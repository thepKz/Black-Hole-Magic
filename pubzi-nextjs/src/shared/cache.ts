/**
 * Cache contract of the public site - CMS-neutral.
 *
 * ONE source of truth for:
 * - the cache tags the news data layer reads with (src/site/lib/news.ts,
 *   `unstable_cache(..., { tags })`),
 * - the tags/paths a content change must purge (Payload hooks in
 *   src/cms/hooks/revalidate*.ts, and POST /api/revalidate for an external CMS).
 *
 * No dependencies - safe anywhere.
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

const SITE_LOCALES = ['vi', 'en'] as const;

/** Public paths that render a given article (both locales) + list, feeds, sitemap. */
export function newsPaths(slugs: (string | null | undefined)[]): string[] {
  const paths: string[] = ['/sitemap.xml'];
  for (const l of SITE_LOCALES) {
    paths.push(`/${l}/news`, `/${l}/news/rss.xml`);
    for (const slug of slugs) if (slug) paths.push(`/${l}/news/${slug}`);
  }
  return paths;
}

// ---------------------------------------------------------------------------
// CMS-neutral revalidation events (POST /api/revalidate { event, ... })
// ---------------------------------------------------------------------------

export const CONTENT_EVENTS = [
  'news.published',
  'news.unpublished',
  'news.updated',
  'news.deleted',
  'category.changed',
  'media.changed',
  'all',
] as const;

export type ContentEventName = (typeof CONTENT_EVENTS)[number];

export interface ContentEvent {
  event: ContentEventName;
  /** Article slug (news.* events). */
  slug?: string | null;
  /** Old slug when the slug changed (old URL must be purged too). */
  previousSlug?: string | null;
  /** Several slugs at once (bulk publish). */
  slugs?: string[] | null;
}

export const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,127}$/;

export const isContentEventName = (v: unknown): v is ContentEventName =>
  typeof v === 'string' && (CONTENT_EVENTS as readonly string[]).includes(v);

/**
 * Maps a content event to the cache tags + paths to purge. Invalid slugs are ignored.
 * `layout: true` (event 'all') = also purge every page (`revalidatePath('/', 'layout')`).
 */
export function eventToTargets(e: ContentEvent): { tags: string[]; paths: string[]; layout?: true } {
  const slugs = [...new Set([e.slug, e.previousSlug, ...(e.slugs ?? [])].filter((s): s is string => typeof s === 'string' && SLUG_RE.test(s)))];
  switch (e.event) {
    case 'news.published':
    case 'news.unpublished':
    case 'news.updated':
    case 'news.deleted':
      return { tags: [CACHE_TAGS.news, ...slugs.map(newsDocTag)], paths: newsPaths(slugs) };
    case 'category.changed':
      return { tags: [CACHE_TAGS.newsCategories, CACHE_TAGS.news], paths: newsPaths([]) };
    case 'media.changed':
      return { tags: [CACHE_TAGS.media, CACHE_TAGS.news], paths: [] };
    case 'all':
      return { tags: Object.values(CACHE_TAGS), paths: newsPaths(slugs), layout: true };
  }
}
