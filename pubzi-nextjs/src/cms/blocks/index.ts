/**
 * Lexical BlocksFeature blocks for the news editor (config only - the site
 * renders them with converters in src/site/components/news/rich-blocks).
 *
 * Slugs are STABLE (stored as `fields.blockType` in article JSON). Never rename
 * one without migrating stored content. `videoEmbed` and `code` are the v1 slugs.
 *
 * Site code: import URL helpers from `@/cms/blocks/embed-url` directly (this
 * index pulls in server-only editor config).
 */
import type { Block } from 'payload';

import { CalloutBlock } from './callout';
import { CodeBlock } from './code';
import { CtaBlock } from './cta';
import { GalleryBlock } from './gallery';
import { QuoteBlock } from './quote';
import { RelatedNewsBlock } from './related-news';
import { SocialEmbedBlock } from './social-embed';
import { VideoBlock } from './video';

export const NEWS_BLOCK_SLUGS = {
  gallery: 'gallery',
  video: 'videoEmbed',
  socialEmbed: 'socialEmbed',
  callout: 'callout',
  quote: 'quote',
  cta: 'cta',
  relatedNews: 'relatedNews',
  code: 'code',
} as const;
export type NewsBlockSlug = (typeof NEWS_BLOCK_SLUGS)[keyof typeof NEWS_BLOCK_SLUGS];

/** Order = order in the editor's "+" / slash menu (most used first). */
export const NEWS_BLOCKS: Block[] = [
  GalleryBlock,
  VideoBlock,
  SocialEmbedBlock,
  QuoteBlock,
  CalloutBlock,
  RelatedNewsBlock,
  CtaBlock,
  CodeBlock,
];

export { CALLOUT_VARIANTS, type CalloutVariant, CalloutBlock } from './callout';
export { CODE_LANGUAGES, CodeBlock } from './code';
export { CtaBlock } from './cta';
export { GalleryBlock } from './gallery';
export { QuoteBlock } from './quote';
export { RelatedNewsBlock } from './related-news';
export { SocialEmbedBlock } from './social-embed';
export { VIDEO_UPLOAD_COLLECTION, VideoBlock } from './video';
