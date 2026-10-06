import 'server-only';

import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';

import { CACHE_TAGS, newsDocTag } from '@/shared/cache';

import { contentSourceCacheKey, contentSourceId, getNewsSource } from './content';
import type { RelatedSeed } from './content/source';
import { emptyPage, NEWS_PER_PAGE, NEWS_SLUG_RE } from './content/util';
import type {
  AdjacentPosts,
  Locale,
  NewsCategory,
  NewsDetail,
  NewsListItem,
  NewsListQuery,
  NewsSlugEntry,
  Paginated,
} from './types';

/**
 * News data layer FACADE (server only). Pages import from here only; where the
 * content comes from is decided by src/site/lib/content (env CONTENT_SOURCE:
 * payload | http | mock - see docs/CONNECT-CMS.md).
 *
 * - Public reads return PUBLISHED docs only, are wrapped in `unstable_cache`
 *   tagged `news` (+ `news:{slug}` for one article, `news-categories` for
 *   categories) and revalidate at most every hour as a safety net. Content
 *   changes purge the tags: Payload hooks (src/cms/hooks/revalidateNews.ts) or,
 *   for another CMS, its webhook to POST /api/revalidate. Cache keys carry the
 *   source id, so switching CMS never serves the other source's entries.
 * - Draft reads (`getNewsBySlug(..., { draft: true })` or any call while Next
 *   Draft Mode is on) bypass the cache and return the latest draft version.
 * - Never throws by default: if the source is empty/unreachable every function
 *   returns an empty result (errors are logged, and NOT cached). ISR callers
 *   (article page, sitemap) pass `strict: true` to get a thrown
 *   NewsUnavailableError instead, so Next keeps the last good page.
 * - `NewsDetail.locales` / `NewsSlugEntry.locales` list locales that really
 *   have their own title (use for hreflang / canonical).
 */

export { NEWS_PER_PAGE };
const REVALIDATE_SECONDS = 3600;

/** Source id (logs) and source cache key (id + variant, baked into every cache key; env is fixed per process). */
const SRC = contentSourceId();
const SRC_KEY = contentSourceCacheKey();

/**
 * True when reads must skip `unstable_cache`: Next Draft Mode, or
 * NEWS_DISABLE_CACHE=true (scripts / tests running outside a Next server,
 * where unstable_cache has no incremental cache).
 */
async function isDraftModeOn(): Promise<boolean> {
  if (process.env.NEWS_DISABLE_CACHE === 'true') return true;
  try {
    return (await draftMode()).isEnabled;
  } catch {
    // Outside a request (generateStaticParams, sitemap at build time, scripts).
    return false;
  }
}

/**
 * `strict` callers (ISR article page, sitemap) must THROW on a source failure so
 * Next keeps serving the last good version and retries, instead of caching a
 * 404 / an empty sitemap for an hour. Exception: `next build` without a
 * source, where we degrade to empty results so the build still succeeds.
 */
const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build';

export class NewsUnavailableError extends Error {
  constructor(scope: string, cause: unknown) {
    super(`[news] ${scope}: data source unavailable`, { cause });
    this.name = 'NewsUnavailableError';
  }
}

/** True for the strict-mode outage error (also across bundle boundaries). */
export const isNewsUnavailable = (err: unknown): boolean =>
  err instanceof NewsUnavailableError || (err as Error | null)?.name === 'NewsUnavailableError';

/** Seconds an ISR page rendered during a source outage stays cached. */
export const OUTAGE_REVALIDATE_SECONDS = 30;

/**
 * Call while rendering a page that could not load its data (source outage):
 * an `unstable_cache` read with a short `revalidate` lowers the ISR lifetime of
 * THIS render to OUTAGE_REVALIDATE_SECONDS (Next keeps the smallest revalidate
 * seen during a prerender), so the "temporarily unavailable" page is replaced
 * by the real one ~30 s after the source is back (or on the next news purge).
 */
export async function shortenCacheForOutage(key: string): Promise<void> {
  await unstable_cache(async () => true, ['site-news-outage', SRC_KEY, key], {
    revalidate: OUTAGE_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.news],
  })().catch(() => undefined);
}

function logError(scope: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[news] ${scope} failed (source=${SRC}):`, msg.split(/\r?\n/)[0].slice(0, 200));
}

// ---------------------------------------------------------------------------
// Uncached calls into the active source
// ---------------------------------------------------------------------------

const src = getNewsSource;

const queryList = async (locale: Locale, cat: string | null, q: string | null, page: number, perPage: number) =>
  (await src()).list(locale, { cat, q, page, perPage });
const queryFeatured = async (locale: Locale) => (await src()).featured(locale);
const queryDetail = async (locale: Locale, slug: string, draft: boolean) => (await src()).bySlug(locale, slug, { draft });
const queryRelated = async (locale: Locale, seed: RelatedSeed, limit: number) => (await src()).related(locale, seed, limit);
const queryAdjacent = async (locale: Locale, slug: string, publishedAt: string) =>
  (await src()).adjacent(locale, slug, publishedAt);
const querySlugs = async () => (await src()).slugs();
const queryCategories = async (locale: Locale) => (await src()).categories(locale);

// ---------------------------------------------------------------------------
// Cache wrappers (source id in every key)
// ---------------------------------------------------------------------------

const cachedList = unstable_cache(queryList, ['site-news-list', SRC_KEY], {
  tags: [CACHE_TAGS.news, CACHE_TAGS.newsCategories],
  revalidate: REVALIDATE_SECONDS,
});

const cachedFeatured = unstable_cache(queryFeatured, ['site-news-featured', SRC_KEY], {
  tags: [CACHE_TAGS.news],
  revalidate: REVALIDATE_SECONDS,
});

const cachedRelated = unstable_cache(queryRelated, ['site-news-related', SRC_KEY], {
  tags: [CACHE_TAGS.news],
  revalidate: REVALIDATE_SECONDS,
});

const cachedAdjacent = unstable_cache(queryAdjacent, ['site-news-adjacent', SRC_KEY], {
  tags: [CACHE_TAGS.news],
  revalidate: REVALIDATE_SECONDS,
});

const cachedSlugs = unstable_cache(querySlugs, ['site-news-slugs', SRC_KEY], {
  tags: [CACHE_TAGS.news],
  revalidate: REVALIDATE_SECONDS,
});

const cachedCategories = unstable_cache(queryCategories, ['site-news-categories', SRC_KEY], {
  tags: [CACHE_TAGS.newsCategories],
  revalidate: REVALIDATE_SECONDS,
});

const cachedDetail = (locale: Locale, slug: string) =>
  unstable_cache(() => queryDetail(locale, slug, false), ['site-news-detail', SRC_KEY, locale, slug], {
    tags: [CACHE_TAGS.news, newsDocTag(slug), CACHE_TAGS.media],
    revalidate: REVALIDATE_SECONDS,
  })();

// ---------------------------------------------------------------------------
// Public API (signatures are the foundation contract)
// ---------------------------------------------------------------------------

/** Paginated published news, newest first. `cat` = category slug, `q` = accent-insensitive title search. */
export async function getNewsList(
  locale: Locale,
  { cat, q, page = 1, perPage = NEWS_PER_PAGE }: NewsListQuery = {},
): Promise<Paginated<NewsListItem>> {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const safePerPage = Math.min(48, Math.max(1, Math.floor(perPage || NEWS_PER_PAGE)));
  const category = cat && cat !== 'all' ? cat.trim().slice(0, 96) : null;
  const query = q?.trim().slice(0, 100) || null;
  try {
    const fn = (await isDraftModeOn()) ? queryList : cachedList;
    return await fn(locale, category, query, safePage, safePerPage);
  } catch (err) {
    logError('getNewsList', err);
    return emptyPage<NewsListItem>(safePage, safePerPage);
  }
}

/** One article by its (shared, non-localized) slug. `draft: true` for live preview / draft mode. */
export async function getNewsBySlug(
  locale: Locale,
  slug: string,
  options: { draft?: boolean; strict?: boolean } = {},
): Promise<NewsDetail | null> {
  let clean: string;
  try {
    clean = decodeURIComponent(slug || '').trim().toLowerCase();
  } catch {
    return null; // malformed %-escape
  }
  if (!NEWS_SLUG_RE.test(clean)) return null;
  try {
    if (options.draft) return await queryDetail(locale, clean, true);
    if (await isDraftModeOn()) return await queryDetail(locale, clean, false);
    return await cachedDetail(locale, clean);
  } catch (err) {
    logError('getNewsBySlug', err);
    // null = "not found"; a failure must not become a cached 404 (see isBuildPhase).
    if (options.strict && !isBuildPhase()) throw new NewsUnavailableError('getNewsBySlug', err);
    return null;
  }
}

/**
 * Related posts for an article: its manual `related` picks first, then the
 * newest published posts of the same category, up to `limit` (then any
 * category if still short). Pass the article itself when you have it (sources
 * without an id lookup need its category / picks); a bare id still works.
 */
export async function getRelatedNews(
  locale: Locale,
  article: NewsDetail['id'] | Pick<NewsDetail, 'id' | 'slug' | 'category' | 'related'>,
  limit = 3,
): Promise<NewsListItem[]> {
  const n = Math.min(12, Math.max(1, Math.floor(limit)));
  const seed: RelatedSeed =
    typeof article === 'object'
      ? { id: article.id, slug: article.slug, category: article.category?.slug ?? null, picks: article.related }
      : { id: article, slug: null, category: null, picks: [] };
  try {
    const fn = (await isDraftModeOn()) ? queryRelated : cachedRelated;
    return await fn(locale, seed, n);
  } catch (err) {
    logError('getRelatedNews', err);
    return [];
  }
}

/** Previous (older) / next (newer) published article around `publishedAt`. Never throws. */
export async function getAdjacentNews(
  locale: Locale,
  slug: string,
  publishedAt: string,
  { draft = false }: { draft?: boolean } = {},
): Promise<AdjacentPosts> {
  try {
    const fn = draft || (await isDraftModeOn()) ? queryAdjacent : cachedAdjacent;
    return await fn(locale, slug, publishedAt);
  } catch (err) {
    logError('getAdjacentNews', err);
    return { prev: null, next: null };
  }
}

/**
 * All published slugs (sitemap, generateStaticParams).
 * `strict: true` (sitemap) throws on a source failure outside `next build`.
 */
export async function getAllNewsSlugs(options: { strict?: boolean } = {}): Promise<NewsSlugEntry[]> {
  try {
    return await ((await isDraftModeOn()) ? querySlugs() : cachedSlugs());
  } catch (err) {
    logError('getAllNewsSlugs', err);
    if (options.strict && !isBuildPhase()) throw new NewsUnavailableError('getAllNewsSlugs', err);
    return [];
  }
}

/** Categories in display order (segmented control on /news). */
export async function getNewsCategories(locale: Locale): Promise<NewsCategory[]> {
  try {
    return await ((await isDraftModeOn()) ? queryCategories(locale) : cachedCategories(locale));
  } catch (err) {
    logError('getNewsCategories', err);
    return [];
  }
}

/** Newest published post flagged `featured` (lead of the /news first page), or null. */
export async function getFeaturedNews(locale: Locale): Promise<NewsListItem | null> {
  try {
    return await ((await isDraftModeOn()) ? queryFeatured(locale) : cachedFeatured(locale));
  } catch (err) {
    logError('getFeaturedNews', err);
    return null;
  }
}

/**
 * True when the newest published post is younger than `maxAgeDays` (header
 * "new posts" dot). Cached via getNewsList; false without a source.
 */
export async function hasRecentNews(locale: Locale, maxAgeDays = 7): Promise<boolean> {
  const [latest] = (await getNewsList(locale, { page: 1, perPage: 1 })).items;
  if (!latest) return false;
  const age = Date.now() - Date.parse(latest.publishedAt);
  return Number.isFinite(age) && age < maxAgeDays * 24 * 60 * 60 * 1000;
}

/** Latest `limit` published posts (RSS feed, home "Tin tức" block). */
export async function getLatestNews(locale: Locale, limit = 3): Promise<NewsListItem[]> {
  const res = await getNewsList(locale, { page: 1, perPage: Math.min(48, Math.max(1, limit)) });
  return res.items;
}
