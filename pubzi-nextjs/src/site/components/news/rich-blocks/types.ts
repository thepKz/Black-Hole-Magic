/**
 * Structural shapes of the newsroom editor blocks as stored in Lexical JSON
 * (`fields` of a block node). Local on purpose: the renderer must not depend
 * on Payload's generated types (src/cms/payload-types.ts), only on the stored
 * JSON. Every field is optional - converters read defensively. Media fields
 * hold a populated doc (`{ url, alt, ... }`), a bare id (depth exhausted) or
 * nothing; see ./media.ts.
 *
 * Block slugs (= stored `blockType`) never change: gallery, videoEmbed,
 * socialEmbed, callout, quote, cta, relatedNews.
 */

export interface MediaDocLike {
  id?: number | string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
  focalX?: number | null;
  focalY?: number | null;
  sizes?: Partial<Record<string, { url?: string | null; width?: number | null; height?: number | null } | undefined>> | null;
}

export interface VideoDocLike {
  url?: string | null;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  title?: string | null;
  caption?: string | null;
  credit?: string | null;
  poster?: unknown;
}

export interface NewsDocLike {
  id: number | string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  cover?: unknown;
  _status?: 'draft' | 'published' | null;
}

export interface CalloutBlock {
  variant?: 'note' | 'important' | 'warning' | null;
  title?: string | null;
  content?: { root?: { children?: unknown[] } } | null;
}

export interface CtaBlock {
  label?: string | null;
  url?: string | null;
  note?: string | null;
  variant?: 'primary' | 'secondary' | null;
  newTab?: boolean | null;
  nofollow?: boolean | null;
}

export interface GalleryBlock {
  images?: unknown[] | null;
  layout?: 'grid' | 'slider' | null;
  columns?: '2' | '3' | '4' | null;
  ratio?: 'auto' | '16:9' | '4:3' | '1:1' | null;
  showCaptions?: boolean | null;
  caption?: string | null;
}

export interface QuoteBlock {
  text?: string | null;
  author?: string | null;
  role?: string | null;
  sourceUrl?: string | null;
}

export interface RelatedNewsBlock {
  title?: string | null;
  posts?: unknown[] | null;
}

export interface SocialEmbedBlock {
  url?: string | null;
  caption?: string | null;
}

export interface VideoEmbedBlock {
  source?: 'url' | 'upload' | null;
  url?: string | null;
  file?: unknown;
  poster?: unknown;
  aspectRatio?: 'auto' | '16:9' | '9:16' | '4:3' | '1:1' | null;
  autoplay?: boolean | null;
  title?: string | null;
  caption?: string | null;
  credit?: string | null;
}
