import { open, readdir, readFile, stat, unlink } from 'fs/promises';
import os from 'os';
import path from 'path';

import { APIError } from 'payload';
import type { AllowList, CollectionBeforeOperationHook, PayloadRequest } from 'payload';

/**
 * Shared helpers for the upload collections (media = images, videos = clips).
 *
 * Size limits:
 * - The multipart parser has ONE global cap (payload.config `upload.limits.fileSize`),
 *   set to the largest allowed upload (video). Anything above it is rejected while
 *   streaming with `UPLOAD_LIMIT_MESSAGE`.
 * - Each collection then enforces its own, smaller cap in `beforeOperation` with a
 *   Vietnamese message the admin shows as a toast (status 413, public).
 */

export const MB = 1024 * 1024;

/** Per-collection caps. Keep VIDEO_MAX_BYTES === the global multipart cap. */
export const IMAGE_MAX_BYTES = 15 * MB;
export const VIDEO_MAX_BYTES = 300 * MB;

export const UPLOAD_LIMIT_MESSAGE = `Tệp quá lớn: tối đa ${VIDEO_MAX_BYTES / MB} MB cho video và ${IMAGE_MAX_BYTES / MB} MB cho ảnh.`;

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
export const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const formatMB = (bytes: number) =>
  `${(bytes / MB).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} MB`;

/**
 * Largest of: the size the client claimed, the bytes in memory and the temp file
 * on disk. Client uploads (Vercel Blob) only carry the size the browser CLAIMS
 * (`file.size`), while Payload has already streamed the real object to a temp
 * file - never trust the claim alone.
 */
export async function realFileSize(file: NonNullable<PayloadRequest['file']>): Promise<number> {
  let size = typeof file.size === 'number' ? file.size : 0;
  if (file.data && file.data.length > size) size = file.data.length;
  if (file.tempFilePath) {
    const st = await stat(file.tempFilePath).catch(() => null);
    if (st && st.size > size) size = st.size;
  }
  return size;
}

/**
 * `beforeOperation` guard: friendly Vietnamese errors for a wrong file type or an
 * oversized file, before Payload's own (English) checks run. Payload's
 * checkFileRestrictions still validates the real file signature afterwards.
 */
export function uploadGuard(opts: {
  maxBytes: number;
  mimeTypes: string[];
  /** Human list of accepted formats, e.g. "JPG, PNG, WebP". */
  formats: string;
  /** Extra hint when the file belongs to the other library. */
  wrongKindHint?: (mime: string) => string | null;
}): CollectionBeforeOperationHook {
  return async ({ args, operation, req }) => {
    if (operation !== 'create' && operation !== 'update') return args;
    void sweepUploadTempDir();
    const file = req.file;
    if (!file) return args;
    // Guests: let the access check answer (403) instead of revealing upload rules.
    if (!req.user && req.payloadAPI !== 'local') return args;

    const mime = (file.mimetype || '').split(';')[0].trim().toLowerCase();
    if (mime && !opts.mimeTypes.includes(mime)) {
      const hint = opts.wrongKindHint?.(mime);
      throw new APIError(
        `Không hỗ trợ định dạng của tệp "${file.name}". Chỉ nhận ${opts.formats}.${hint ? ` ${hint}` : ''}`,
        415,
        undefined,
        true,
      );
    }
    const size = await realFileSize(file);
    if (size > opts.maxBytes) {
      throw new APIError(
        `Tệp "${file.name}" nặng ${formatMB(size)}, vượt giới hạn ${formatMB(opts.maxBytes)}. Hãy nén hoặc giảm kích thước rồi tải lại.`,
        413,
        undefined,
        true,
      );
    }
    return args;
  };
}

// ---------------------------------------------------------------------------
// Filename -> readable text (alt / title prefill)
// ---------------------------------------------------------------------------

const CAMERA_NAME =
  /^(img|image|dsc|dscf|dscn|dcim|pxl|mvimg|vid|video|photo|pic|picture|screenshot|screen shot|ảnh chụp màn hình|anh chup man hinh|untitled|download|file)?[\s\d()x]*$/i;

/**
 * "tlbb-ra-mat-server-moi_1200x675.webp" -> "Tlbb ra mat server moi".
 * Returns null when the name carries no meaning (IMG_1234.JPG, 1696222.png ...).
 * `storedName`: the name came from the library (not the uploaded file), so a
 * trailing "-1" / "-2" is Payload's duplicate suffix and is dropped. Uploaded
 * names keep it: "gallery-1.jpg" and "gallery-2.jpg" must not get the same alt.
 */
export function humanizeFilename(name: string | null | undefined, { storedName = false } = {}): string | null {
  if (!name) return null;
  let base = name;
  try {
    base = decodeURIComponent(base);
  } catch {
    /* keep raw */
  }
  base = base
    .replace(/\.[a-z0-9]{2,5}$/i, '') // extension
    .replace(/[-_ ]\d{2,5}x\d{2,5}$/i, '') // size suffix
    .replace(storedName ? /-\d{1,2}$/ : /(?!)/, '') // Payload duplicate suffix "-1" (stored names only)
    .replace(/[_\-+.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!base || CAMERA_NAME.test(base) || !/\p{L}/u.test(base)) return null;
  base = base.charAt(0).toLocaleUpperCase('vi-VN') + base.slice(1);
  return base.length > 160 ? `${base.slice(0, 157).trimEnd()}...` : base;
}

/** Original upload name when a new file is attached, else the stored filename. */
export const incomingFilename = (req: PayloadRequest, data?: { filename?: unknown } | null, originalDoc?: { filename?: unknown } | null) =>
  req.file?.name ??
  (typeof data?.filename === 'string' ? data.filename : null) ??
  (typeof originalDoc?.filename === 'string' ? originalDoc.filename : null);

/** Readable text from the incoming / stored file name (see humanizeFilename). */
export const humanizeIncoming = (req: PayloadRequest, data?: { filename?: unknown } | null, originalDoc?: { filename?: unknown } | null) =>
  humanizeFilename(incomingFilename(req, data, originalDoc), { storedName: !req.file?.name });

// ---------------------------------------------------------------------------
// Temp files
// ---------------------------------------------------------------------------

/** Must match payload.config `upload.tempFileDir`. */
export const UPLOAD_TEMP_DIR = path.join(os.tmpdir(), 'payload-uploads');

/**
 * Images: read the multipart temp file into memory and delete it BEFORE
 * Payload processes the upload (media `beforeOperation`, after uploadGuard).
 *
 * With `useTempFiles`, Payload opens the temp file with sharp and then writes
 * the converted WebP back INTO that same temp file while libvips may still hold
 * it open. On Windows that write fails (`UNKNOWN: open ...payload-uploads/tmp-*`)
 * and every JPEG upload ended in "Không tải lên được tệp". Images are capped at
 * 15 MB, so a buffer is cheap; videos (up to 300 MB) keep the temp file.
 */
export const imageTempFileToBuffer: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return args;
  const file = req.file;
  if (!file?.tempFilePath || (file.data && file.data.length > 0)) return args;
  if (!req.user && req.payloadAPI !== 'local') return args; // access will reject it
  const tempPath = file.tempFilePath;
  const data = await readFile(tempPath);
  req.file = { ...file, data, size: data.length, tempFilePath: undefined };
  await unlink(tempPath).catch(() => {});
  return args;
};

let lastSweep = 0;

/**
 * Deletes multipart temp files older than 1 hour. Payload parses multipart
 * bodies (useTempFiles) before auth/access and never deletes the temp file
 * when the target is not an upload collection, so junk accumulates. Called
 * opportunistically from uploadGuard, at most once every 10 minutes; never throws.
 */
export async function sweepUploadTempDir(maxAgeMs = 60 * 60 * 1000, now = Date.now()): Promise<number> {
  if (now - lastSweep < 10 * 60 * 1000) return 0;
  lastSweep = now;
  let removed = 0;
  try {
    const names = await readdir(UPLOAD_TEMP_DIR);
    for (const name of names) {
      if (!name.startsWith('tmp-') && !name.startsWith('payload-client-upload-')) continue;
      const full = path.join(UPLOAD_TEMP_DIR, name);
      try {
        const st = await stat(full);
        if (st.isFile() && now - st.mtimeMs > maxAgeMs) {
          await unlink(full);
          removed += 1;
        }
      } catch {
        /* busy or gone */
      }
    }
  } catch {
    /* dir missing */
  }
  return removed;
}

// ---------------------------------------------------------------------------
// Paste-URL allow list
// ---------------------------------------------------------------------------

/**
 * "Dán URL" in the upload field first tries a browser fetch (fails on most sites
 * because of CORS), then the server `/paste-url` endpoint - but only for hosts on
 * this list (EXACT hostname match - Payload has no wildcards - https only).
 * Allow-listed hosts skip Payload's SSRF filter and the endpoint streams the
 * remote file through our server, so only OFFICIAL CDNs belong here - never
 * hosts where anyone can upload (Discord, Imgur, Google user content...).
 * Extra hosts: comma-separated env MEDIA_PASTE_HOSTS, e.g.
 *   MEDIA_PASTE_HOSTS=cdn.blackholegame.vn,static.kiemthe.vn
 * Other sources (Facebook, TikTok...): save the image, then drag it in.
 * PASTE_HOST_HINT is shown to editors when a link is refused.
 */
export const PASTE_HOST_HINT = 'YouTube, Steam, App Store, Google Play, Wikimedia, Unsplash, X/Twitter và CDN của công ty';

const PASTE_HOSTS = [
  'images.unsplash.com',
  'upload.wikimedia.org',
  'i.ytimg.com',
  'img.youtube.com',
  'pbs.twimg.com',
  'cdn.cloudflare.steamstatic.com',
  'shared.akamai.steamstatic.com',
  'shared.cloudflare.steamstatic.com',
  'cdn.akamai.steamstatic.com',
  'play-lh.googleusercontent.com',
  'is1-ssl.mzstatic.com',
];

export function pasteAllowList(): AllowList {
  const extra = (process.env.MEDIA_PASTE_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter((h) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(h));
  return [...new Set([...PASTE_HOSTS, ...extra])].map((hostname) => ({ hostname, protocol: 'https' as const }));
}

// ---------------------------------------------------------------------------
// MP4 / MOV probe (duration + frame size) - reads box headers only
// ---------------------------------------------------------------------------

export interface VideoProbe {
  duration: number | null;
  width: number | null;
  height: number | null;
}

type Reader = { size: number; read: (offset: number, length: number) => Promise<Buffer>; close: () => Promise<void> };

async function makeReader(file: NonNullable<PayloadRequest['file']>): Promise<Reader | null> {
  if (file.data && file.data.length > 0) {
    const buf = file.data;
    return {
      size: buf.length,
      read: async (o, l) => buf.subarray(o, Math.min(buf.length, o + l)),
      close: async () => {},
    };
  }
  if (file.tempFilePath) {
    const fh = await open(file.tempFilePath, 'r');
    const { size } = await fh.stat();
    return {
      size,
      read: async (o, l) => {
        const len = Math.max(0, Math.min(l, size - o));
        const out = Buffer.alloc(len);
        if (len) await fh.read(out, 0, len, o);
        return out;
      },
      close: () => fh.close(),
    };
  }
  return null;
}

/** Iterate ISO-BMFF boxes in [start, end). */
async function* boxes(r: Reader, start: number, end: number) {
  let pos = start;
  for (let guard = 0; pos + 8 <= end && guard < 10_000; guard++) {
    const head = await r.read(pos, 16);
    if (head.length < 8) return;
    let size = head.readUInt32BE(0);
    const type = head.toString('latin1', 4, 8);
    let headerSize = 8;
    if (size === 1) {
      if (head.length < 16) return;
      size = Number(head.readBigUInt64BE(8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - pos;
    }
    if (size < headerSize) return;
    yield { type, start: pos + headerSize, end: Math.min(end, pos + size) };
    pos += size;
  }
}

/**
 * Duration (seconds) from moov/mvhd and frame size from the first visual
 * moov/trak/tkhd. Returns nulls for WebM or unreadable files - never throws.
 */
export async function probeVideo(file: PayloadRequest['file']): Promise<VideoProbe> {
  const empty: VideoProbe = { duration: null, width: null, height: null };
  if (!file) return empty;
  const mime = (file.mimetype || '').toLowerCase();
  if (!mime.includes('mp4') && !mime.includes('quicktime')) return empty;
  let r: Reader | null = null;
  try {
    r = await makeReader(file);
    if (!r) return empty;
    const out: VideoProbe = { ...empty };
    for await (const top of boxes(r, 0, r.size)) {
      if (top.type !== 'moov') continue;
      for await (const child of boxes(r, top.start, top.end)) {
        if (child.type === 'mvhd') {
          const b = await r.read(child.start, 32);
          const version = b[0];
          const timescale = version === 1 ? b.readUInt32BE(20) : b.readUInt32BE(12);
          const dur = version === 1 ? Number(b.readBigUInt64BE(24)) : b.readUInt32BE(16);
          if (timescale > 0 && dur > 0) out.duration = Math.round((dur / timescale) * 10) / 10;
        } else if (child.type === 'trak' && out.width === null) {
          for await (const t of boxes(r, child.start, child.end)) {
            if (t.type !== 'tkhd' || t.end - t.start < 8) continue;
            const b = await r.read(t.end - 8, 8);
            const w = b.readUInt32BE(0) / 65536;
            const h = b.readUInt32BE(4) / 65536;
            if (w > 0 && h > 0) {
              out.width = Math.round(w);
              out.height = Math.round(h);
            }
          }
        }
      }
      break;
    }
    return out;
  } catch {
    return empty;
  } finally {
    await r?.close().catch(() => {});
  }
}

/** 125.4 -> "2:05" */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '';
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}
