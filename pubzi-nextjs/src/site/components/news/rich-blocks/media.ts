import type { Media, Video } from '@/cms/payload-types';

/**
 * Normalised image/video data for the rich blocks. Accepts whatever the Lexical
 * populate step left in a field: a populated doc, a bare id (depth exhausted)
 * or nothing. Bare ids yield `null` - the block then renders without that media.
 */

export interface RichImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string | null;
  credit: string | null;
  /** CSS object-position from the media focal point. */
  position: string;
  mimeType: string;
}

const isObj = <T extends object>(v: unknown): v is T => typeof v === 'object' && v !== null;

export function toRichImage(value: unknown): RichImage | null {
  if (!isObj<Media>(value) || !value.url) return null;
  const mimeType = value.mimeType ?? 'image/';
  if (!mimeType.startsWith('image/')) return null;
  return {
    src: value.url,
    width: value.width && value.width > 0 ? value.width : 1200,
    height: value.height && value.height > 0 ? value.height : 675,
    alt: value.alt?.trim() ?? '',
    caption: value.caption?.trim() || null,
    credit: value.credit?.trim() || null,
    position: `${value.focalX ?? 50}% ${value.focalY ?? 50}%`,
    mimeType,
  };
}

/** Smaller pre-generated size for posters / thumbnails (falls back to the original). */
export function posterUrl(value: unknown, size: 'thumb' | 'card' | 'news' = 'news'): string | null {
  if (!isObj<Media>(value) || !value.url) return null;
  return value.sizes?.[size]?.url || value.url;
}

export interface RichVideoFile {
  src: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  title: string | null;
  caption: string | null;
  credit: string | null;
  poster: unknown;
}

export function toRichVideoFile(value: unknown): RichVideoFile | null {
  if (!isObj<Video>(value) || !value.url) return null;
  return {
    src: value.url,
    // .mov files are QuickTime containers; most browsers play H.264 .mov as mp4.
    mimeType: value.mimeType === 'video/quicktime' ? 'video/mp4' : value.mimeType || 'video/mp4',
    width: value.width ?? null,
    height: value.height ?? null,
    title: value.title?.trim() || null,
    caption: value.caption?.trim() || null,
    credit: value.credit?.trim() || null,
    poster: value.poster,
  };
}

/** "16:9" -> "16 / 9"; unknown -> null. */
export function ratioToCss(ratio: string | null | undefined): string | null {
  const m = ratio?.match(/^(\d+):(\d+)$/);
  return m ? `${m[1]} / ${m[2]}` : null;
}

/** Only these targets are rendered as links (no javascript:, data:, protocol-relative ...). */
export const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

export function safeHref(url: string | null | undefined): string | null {
  const v = url?.trim();
  return v && SAFE_HREF.test(v) ? v : null;
}
