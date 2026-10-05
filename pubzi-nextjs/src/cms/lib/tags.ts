/**
 * Cache tags shared by the Payload revalidation hooks (src/cms/hooks/revalidate.ts)
 * and the news data layer (src/site/lib/news.ts). Import from here only.
 *
 * Usage on the read side:   unstable_cache(fn, keys, { tags: [CACHE_TAGS.news] })
 * Usage on the write side:  revalidateTag(CACHE_TAGS.news, 'max')   (Next 16 two-arg form)
 */
export const CACHE_TAGS = {
  news: 'news',
  newsCategories: 'news-categories',
  media: 'media',
  users: 'users',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Per-document tag, e.g. newsDocTag('my-slug') -> 'news:my-slug'. */
export const newsDocTag = (slug: string) => `news:${slug}` as const;
