/**
 * Video URL parsing shared by the CMS (validation of the `videoEmbed` Lexical
 * block) and the public site (RichText converter). No dependencies - safe on
 * server and client.
 *
 * Supported:
 * - YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID,
 *   youtube.com/embed/ID, youtube.com/live/ID (+ optional t= / start= seconds)
 * - Vimeo:   vimeo.com/ID, player.vimeo.com/video/ID
 * - Direct files: https://.../file.mp4 | .webm | .ogg (rendered with <video>)
 */

export type VideoProvider = 'youtube' | 'vimeo' | 'file';

export interface ParsedVideo {
  provider: VideoProvider;
  /** Provider video id (youtube/vimeo) or the file URL (file). */
  id: string;
  /** URL to put in <iframe src> (youtube-nocookie / vimeo player) or <video src>. */
  embedUrl: string;
  /** Poster/thumbnail when the provider exposes a predictable one (YouTube). */
  thumbnailUrl: string | null;
  /** Start offset in seconds, if any. */
  start: number | null;
}

const YT_ID = /^[A-Za-z0-9_-]{11}$/;

function parseStart(value: string | null): number | null {
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value);
  const m = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!m) return null;
  const total = Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
  return total > 0 ? total : null;
}

export function parseVideoUrl(input: string | null | undefined): ParsedVideo | null {
  if (!input) return null;
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  const host = url.hostname.replace(/^www\.|^m\./, '');

  // YouTube
  if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'youtu.be') {
    let id: string | null = null;
    if (host === 'youtu.be') id = url.pathname.split('/')[1] ?? null;
    else if (url.pathname === '/watch') id = url.searchParams.get('v');
    else {
      const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
      id = m?.[1] ?? null;
    }
    if (!id || !YT_ID.test(id)) return null;
    const start = parseStart(url.searchParams.get('t') ?? url.searchParams.get('start'));
    const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
    embed.searchParams.set('rel', '0');
    if (start) embed.searchParams.set('start', String(start));
    return {
      provider: 'youtube',
      id,
      embedUrl: embed.toString(),
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      start,
    };
  }

  // Vimeo
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const m = url.pathname.match(/(?:^|\/)(\d{6,12})(?:\/|$)/);
    if (!m) return null;
    const id = m[1];
    return {
      provider: 'vimeo',
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?dnt=1`,
      thumbnailUrl: null,
      start: null,
    };
  }

  // Direct video file
  if (/\.(mp4|webm|ogg|ogv)$/i.test(url.pathname)) {
    return { provider: 'file', id: url.toString(), embedUrl: url.toString(), thumbnailUrl: null, start: null };
  }

  return null;
}

export const VIDEO_ASPECT_RATIOS = ['16:9', '9:16', '4:3', '1:1'] as const;
export type VideoAspectRatio = (typeof VIDEO_ASPECT_RATIOS)[number];

/** '16:9' -> '16 / 9' (CSS aspect-ratio). */
export const cssAspectRatio = (ratio: string | null | undefined) =>
  (ratio && /^\d+:\d+$/.test(ratio) ? ratio : '16:9').replace(':', ' / ');
