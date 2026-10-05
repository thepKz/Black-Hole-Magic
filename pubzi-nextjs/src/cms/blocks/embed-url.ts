/**
 * URL parsing + normalisation for the embed blocks (`videoEmbed`, `socialEmbed`).
 * Shared by the CMS (validation / normalisation hooks) and the public site
 * (RichText converters under src/site/components/news/rich-blocks). No
 * dependencies - safe on server and client.
 *
 * Video (block `videoEmbed`, source = "url"):
 * - YouTube / Vimeo / direct .mp4/.webm  -> delegated to `parseVideoUrl` (src/cms/lib/video.ts)
 * - Facebook video / reel / fb.watch     -> plugins/video.php iframe
 * - TikTok  tiktok.com/@user/video/ID     -> tiktok.com/player/v1/ID iframe
 *
 * Social posts (block `socialEmbed`):
 * - Facebook post (posts / permalink / photo / share/p), X/Twitter status,
 *   TikTok video, Instagram post / reel.
 */
import { parseVideoUrl, type ParsedVideo } from '../lib/video';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Query params that are only tracking noise and are stripped on save. */
const TRACKING_PARAMS = [
  'fbclid',
  'gclid',
  'igsh',
  'igshid',
  'mibextid',
  'si',
  'feature',
  'is_from_webapp',
  'sender_device',
  'web_id',
  '_r',
  '_t',
  's',
  'ref',
  'rdid',
  'share_url',
];

function toUrl(input: string | null | undefined): URL | null {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url;
  } catch {
    return null;
  }
}

const bareHost = (url: URL) => url.hostname.toLowerCase().replace(/^(www|m|mobile|web|vt|vm)\./, '');

function stripTracking(url: URL): URL {
  const clean = new URL(url.toString());
  clean.protocol = 'https:';
  clean.hash = '';
  for (const key of [...clean.searchParams.keys()]) {
    if (key.startsWith('utm_') || TRACKING_PARAMS.includes(key)) clean.searchParams.delete(key);
  }
  return clean;
}

const isFacebookHost = (host: string) => host === 'facebook.com' || host === 'fb.com' || host === 'fb.watch';

/* ------------------------------------------------------------------ */
/* Video                                                               */
/* ------------------------------------------------------------------ */

export type EmbedVideoProvider = ParsedVideo['provider'] | 'facebook' | 'tiktok';

export interface ParsedEmbedVideo {
  provider: EmbedVideoProvider;
  /** Provider id (youtube/vimeo/tiktok), or the canonical URL (facebook/file). */
  id: string;
  /** Canonical URL stored in the CMS (tracking params removed). */
  url: string;
  /** URL to put in <iframe src> (or <video src> for `file`). */
  embedUrl: string;
  thumbnailUrl: string | null;
  /** True for vertical formats (YouTube Shorts, TikTok, Facebook Reels) - used by aspectRatio "auto". */
  vertical: boolean;
}

export function parseEmbedVideoUrl(input: string | null | undefined): ParsedEmbedVideo | null {
  const url = toUrl(input);
  if (!url) return null;
  const host = bareHost(url);

  // Facebook video / reel / watch
  if (isFacebookHost(host)) {
    const path = url.pathname;
    const isVideo =
      host === 'fb.watch' ||
      /\/videos\/(?:[^/]+\/)?\d+/.test(path) ||
      /^\/(?:watch|reel)\/?/.test(path) ||
      /^\/share\/(?:v|r)\//.test(path);
    if (!isVideo) return null;
    const clean = stripTracking(url);
    if (host !== 'fb.watch') clean.hostname = 'www.facebook.com';
    // keep only `v` for /watch?v=
    if (clean.pathname.startsWith('/watch')) {
      const v = clean.searchParams.get('v');
      if (!v || !/^\d+$/.test(v)) return null;
      clean.search = `?v=${v}`;
    }
    const canonical = clean.toString();
    const vertical = /^\/(?:reel|share\/r)\//.test(clean.pathname);
    return {
      provider: 'facebook',
      id: canonical,
      url: canonical,
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(canonical)}&show_text=false`,
      thumbnailUrl: null,
      vertical,
    };
  }

  // TikTok video
  if (host === 'tiktok.com') {
    const m = url.pathname.match(/^\/(@[\w.-]+)\/video\/(\d{8,25})/);
    if (!m) return null;
    const [, user, id] = m;
    return {
      provider: 'tiktok',
      id,
      url: `https://www.tiktok.com/${user}/video/${id}`,
      embedUrl: `https://www.tiktok.com/player/v1/${id}?rel=0`,
      thumbnailUrl: null,
      vertical: true,
    };
  }

  // YouTube / Vimeo / file
  const parsed = parseVideoUrl(url.toString());
  if (!parsed) return null;
  let canonical: string;
  let vertical = false;
  if (parsed.provider === 'youtube') {
    vertical = /^\/shorts\//.test(url.pathname);
    canonical = vertical
      ? `https://www.youtube.com/shorts/${parsed.id}`
      : `https://www.youtube.com/watch?v=${parsed.id}${parsed.start ? `&t=${parsed.start}s` : ''}`;
  } else if (parsed.provider === 'vimeo') {
    const clean = stripTracking(url);
    clean.search = '';
    canonical = clean.toString();
  } else {
    canonical = url.toString();
  }
  return { ...parsed, url: canonical, vertical };
}

/** Human-readable reason, or `true` when the URL is a supported video link. */
export function validateEmbedVideoUrl(value: string | null | undefined): true | string {
  if (!value || !value.trim()) return 'Vui lòng dán link video.';
  const url = toUrl(value);
  if (!url) return 'Link không hợp lệ. Hãy dán đầy đủ địa chỉ bắt đầu bằng https://';
  const host = bareHost(url);
  if (host === 'tiktok.com' && url.hostname.toLowerCase().startsWith('vm.')) {
    return 'Link rút gọn TikTok (vm.tiktok.com) chưa được hỗ trợ. Hãy mở video rồi sao chép link đầy đủ dạng tiktok.com/@kenh/video/…';
  }
  if (parseEmbedVideoUrl(value)) return true;
  if (isFacebookHost(host)) {
    return 'Link Facebook này không phải video. Hãy dùng link video/reel (…/videos/…, /watch?v=…, /reel/…, fb.watch/…). Bài viết Facebook hãy dùng khối "Nhúng mạng xã hội".';
  }
  return 'Chưa hỗ trợ link này. Dùng link YouTube, Vimeo, Facebook (video/reel), TikTok hoặc file .mp4/.webm.';
}

/* ------------------------------------------------------------------ */
/* Social posts                                                        */
/* ------------------------------------------------------------------ */

export type SocialProvider = 'facebook' | 'x' | 'tiktok' | 'instagram';

export const SOCIAL_PROVIDER_LABELS: Record<SocialProvider, string> = {
  facebook: 'Facebook',
  x: 'X (Twitter)',
  tiktok: 'TikTok',
  instagram: 'Instagram',
};

export interface ParsedSocialUrl {
  provider: SocialProvider;
  /** Canonical URL stored in the CMS. */
  url: string;
  /** Post / status / video id when the URL carries one. */
  id: string | null;
  /** iframe URL when the provider offers one without a script (facebook, tiktok, instagram); null for X (needs widgets.js / oEmbed). */
  embedUrl: string | null;
}

export function parseSocialUrl(input: string | null | undefined): ParsedSocialUrl | null {
  const url = toUrl(input);
  if (!url) return null;
  const host = bareHost(url);
  const path = url.pathname;

  if (isFacebookHost(host) && host !== 'fb.watch') {
    const clean = stripTracking(url);
    clean.hostname = 'www.facebook.com';
    let ok = false;
    let id: string | null = null;
    let m: RegExpMatchArray | null;
    if ((m = path.match(/^\/[^/]+\/(?:posts|videos)\/([\w.-]+)/))) {
      ok = true;
      id = m[1];
    } else if (/^\/(?:permalink|story|photo)\.php$/.test(path)) {
      id = url.searchParams.get('story_fbid') ?? url.searchParams.get('fbid');
      ok = Boolean(id);
      const keep = new URLSearchParams();
      for (const k of ['story_fbid', 'fbid', 'id', 'set']) {
        const v = url.searchParams.get(k);
        if (v) keep.set(k, v);
      }
      clean.search = keep.toString() ? `?${keep}` : '';
    } else if ((m = path.match(/^\/(?:share\/(?:p|v|r)|reel|groups\/[^/]+\/posts|photos)\/([\w.-]+)/))) {
      ok = true;
      id = m[1];
    }
    if (!ok) return null;
    if (!clean.pathname.endsWith('.php')) clean.search = '';
    const canonical = clean.toString();
    const isVideo = /\/(?:videos|reel|share\/v|share\/r)\//.test(clean.pathname);
    return {
      provider: 'facebook',
      url: canonical,
      id,
      embedUrl: `https://www.facebook.com/plugins/${isVideo ? 'video' : 'post'}.php?href=${encodeURIComponent(canonical)}&show_text=true&width=500`,
    };
  }

  if (host === 'x.com' || host === 'twitter.com') {
    const m = path.match(/^\/([A-Za-z0-9_]{1,15})\/status(?:es)?\/(\d{1,25})/);
    if (!m) return null;
    return { provider: 'x', url: `https://x.com/${m[1]}/status/${m[2]}`, id: m[2], embedUrl: null };
  }

  if (host === 'tiktok.com') {
    const m = path.match(/^\/(@[\w.-]+)\/video\/(\d{8,25})/);
    if (!m) return null;
    return {
      provider: 'tiktok',
      url: `https://www.tiktok.com/${m[1]}/video/${m[2]}`,
      id: m[2],
      embedUrl: `https://www.tiktok.com/embed/v2/${m[2]}`,
    };
  }

  if (host === 'instagram.com') {
    const m = path.match(/^\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/);
    if (!m) return null;
    const canonical = `https://www.instagram.com/${m[1]}/${m[2]}/`;
    return { provider: 'instagram', url: canonical, id: m[2], embedUrl: `${canonical}embed/` };
  }

  return null;
}

export function validateSocialUrl(value: string | null | undefined): true | string {
  if (!value || !value.trim()) return 'Vui lòng dán link bài đăng.';
  const url = toUrl(value);
  if (!url) return 'Link không hợp lệ. Hãy dán đầy đủ địa chỉ bắt đầu bằng https://';
  if (url.hostname.toLowerCase().startsWith('vm.') || url.hostname.toLowerCase().startsWith('vt.')) {
    return 'Link rút gọn TikTok chưa được hỗ trợ. Hãy mở bài rồi sao chép link đầy đủ dạng tiktok.com/@kenh/video/…';
  }
  if (parseSocialUrl(value)) return true;
  return 'Chưa hỗ trợ link này. Dùng link bài đăng Facebook, X (Twitter), TikTok hoặc Instagram (link tới một bài cụ thể, không phải trang cá nhân).';
}

/* ------------------------------------------------------------------ */
/* Plain links (CTA / quote source)                                    */
/* ------------------------------------------------------------------ */

/** Accepts https/http URLs, site-relative paths ("/vi/news/..."), mailto: and tel:. */
export const SAFE_LINK = /^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*|mailto:[^\s]+|tel:[+\d\s().-]+)$/i;

export function validateLink(value: string | null | undefined, { required = false } = {}): true | string {
  if (!value || !value.trim()) return required ? 'Vui lòng nhập đường dẫn.' : true;
  return SAFE_LINK.test(value.trim())
    ? true
    : 'Đường dẫn không hợp lệ. Dùng https://…, đường dẫn trong site (bắt đầu bằng /), mailto: hoặc tel:';
}
