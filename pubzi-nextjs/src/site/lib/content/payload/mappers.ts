import { lexicalHeadings, lexicalToPlainText } from '@/cms/lib/lexical';
import type {
  Media as PMedia,
  News as PNews,
  NewsCategory as PNewsCategory,
  User as PUser,
} from '@/cms/payload-types';
import { slugify } from '@/shared/text';

import type { ArticleContent, ArticleOutline, LexicalDoc, NewsAuthor, NewsCategory, NewsImage, NewsListItem } from '../../types';
import { buildOutline, EMPTY_OUTLINE, isObj } from '../util';

/**
 * Payload documents -> site DTOs (src/site/lib/types.ts). Payload adapter
 * territory: the only site files (with LexicalBody) allowed to know Payload shapes.
 */

export function toNewsImage(media: unknown, captionOverride?: string | null): NewsImage | null {
  if (!isObj<PMedia>(media) || !media.url) return null;
  const sizes: NewsImage['sizes'] = {};
  for (const key of ['thumb', 'card', 'news', 'og'] as const) {
    const s = media.sizes?.[key];
    if (s?.url && s.width && s.height) sizes[key] = { src: s.url, width: s.width, height: s.height };
  }
  return {
    src: media.url,
    width: media.width ?? 1200,
    height: media.height ?? 675,
    alt: media.alt ?? '',
    focal: { x: media.focalX ?? 50, y: media.focalY ?? 50 },
    caption: captionOverride ?? media.caption ?? null,
    sizes,
  };
}

export function toCategory(cat: unknown): NewsCategory | null {
  if (!isObj<PNewsCategory>(cat) || !cat.slug) return null;
  return { id: cat.id, slug: cat.slug, name: cat.name ?? cat.slug, order: cat.order ?? 0 };
}

export function toAuthor(user: unknown): NewsAuthor | null {
  if (!isObj<PUser>(user) || !user.name) return null;
  return { id: user.id, name: user.name, avatar: toNewsImage(user.avatar), bio: user.bio ?? null };
}

export function toListItem(doc: Partial<PNews>): NewsListItem | null {
  if (doc.id == null || !doc.slug) return null;
  const publishedAt = doc.publishedAt ?? doc.updatedAt ?? doc.createdAt ?? new Date(0).toISOString();
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title ?? '',
    excerpt: doc.excerpt ?? '',
    category: toCategory(doc.category),
    publishedAt,
    updatedAt: doc.updatedAt ?? publishedAt,
    cover: toNewsImage(doc.cover),
    featured: Boolean(doc.featured),
    readingTime: Math.max(1, doc.readingTime ?? 1),
  };
}

export function toContent(content: unknown): ArticleContent | null {
  if (!isObj<LexicalDoc>(content) || !isObj(content.root)) return null;
  return { format: 'lexical', doc: content };
}

/** TOC + plain text from Lexical (ids match the Lexical renderer's heading ids). */
export function lexicalOutline(content: ArticleContent | null): ArticleOutline {
  if (!content || content.format !== 'lexical') return EMPTY_OUTLINE;
  const state = content.doc as Parameters<typeof lexicalToPlainText>[0];
  return buildOutline(lexicalHeadings(state, slugify), lexicalToPlainText(state));
}
