import 'server-only';

import config from '@payload-config';
import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';
import { getPayload, type Payload, type Where } from 'payload';

import type {
  Media as PMedia,
  News as PNews,
  NewsCategory as PNewsCategory,
  User as PUser,
} from '@/cms/payload-types';
import { CACHE_TAGS, newsDocTag } from '@/cms/lib/tags';
import { foldText } from '@/cms/lib/text';

import type {
  Locale,
  NewsAuthor,
  NewsCategory,
  NewsDetail,
  NewsImage,
  NewsListItem,
  NewsListQuery,
  NewsSlugEntry,
  Paginated,
  RichTextContent,
} from './types';

/**
 * News data layer (Payload Local API, server only).
 *
 * - Public reads return PUBLISHED docs only, are wrapped in `unstable_cache`
 *   tagged `news` (+ `news:{slug}` for one article, `news-categories` for
 *   categories) and revalidate at most every hour as a safety net. Payload
 *   hooks call `revalidateTag(tag, 'max')` + `revalidatePath` on publish /
 *   unpublish / delete (src/cms/hooks/revalidateNews.ts).
 * - Draft reads (`getNewsBySlug(..., { draft: true })` or any call while Next
 *   Draft Mode is on) bypass the cache and return the latest draft version.
 * - Never throws by default: if the DB is empty/unreachable every function
 *   returns an empty result (errors are logged, and NOT cached). ISR callers
 *   (article page, sitemap) pass `strict: true` to get a thrown
 *   NewsUnavailableError instead, so Next keeps the last good page.
 * - Locale fallback: untranslated EN fields fall back to VI (Payload config).
 *   `NewsDetail.locales` / `NewsSlugEntry.locales` list locales that really
 *   have their own title (use for hreflang / canonical).
 */

export const NEWS_PER_PAGE = 9;
const REVALIDATE_SECONDS = 3600;
const LOCALES: Locale[] = ['vi', 'en'];

// ---------------------------------------------------------------------------
// Payload access
// ---------------------------------------------------------------------------

const payloadClient = (): Promise<Payload> => getPayload({ config });

/** Fields kept when a news doc is populated as a relationship (related posts, internal links). */
const NEWS_CARD_SELECT = {
  title: true,
  slug: true,
  excerpt: true,
  cover: true,
  category: true,
  publishedAt: true,
  featured: true,
  readingTime: true,
  updatedAt: true,
  _status: true,
} as const;

const POPULATE = {
  news: NEWS_CARD_SELECT,
  users: { name: true, avatar: true, bio: true },
} as const;

const publishedWhere: Where = { _status: { equals: 'published' } };

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
 * `strict` callers (ISR article page, sitemap) must THROW on a DB failure so
 * Next keeps serving the last good version and retries, instead of caching a
 * 404 / an empty sitemap for an hour. Exception: `next build` without a DB,
 * where we degrade to empty results so the build still succeeds.
 */
const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build';

export class NewsUnavailableError extends Error {
  constructor(scope: string, cause: unknown) {
    super(`[news] ${scope}: data source unavailable`, { cause });
    this.name = 'NewsUnavailableError';
  }
}

function logError(scope: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[news] ${scope} failed:`, msg.split(/\r?\n/)[0].slice(0, 200));
}

// ---------------------------------------------------------------------------
// Mappers (Payload docs -> UI DTOs in ./types)
// ---------------------------------------------------------------------------

const isObj = <T extends object>(v: unknown): v is T => typeof v === 'object' && v !== null;

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

function toCategory(cat: unknown): NewsCategory | null {
  if (!isObj<PNewsCategory>(cat) || !cat.slug) return null;
  return { id: cat.id, slug: cat.slug, name: cat.name ?? cat.slug, order: cat.order ?? 0 };
}

function toAuthor(user: unknown): NewsAuthor | null {
  if (!isObj<PUser>(user) || !user.name) return null;
  return { id: user.id, name: user.name, avatar: toNewsImage(user.avatar), bio: user.bio ?? null };
}

function toListItem(doc: Partial<PNews>): NewsListItem | null {
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

const compact = <T,>(arr: (T | null)[]): T[] => arr.filter((x): x is T => x !== null);

function paginate<T>(items: T[], page: number, perPage: number, totalItems: number): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  return {
    items,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}

function emptyPage<T>(page = 1, perPage = NEWS_PER_PAGE): Paginated<T> {
  return paginate<T>([], Math.max(1, page), perPage, 0);
}

// ---------------------------------------------------------------------------
// Queries (uncached)
// ---------------------------------------------------------------------------

async function queryList(
  locale: Locale,
  cat: string | null,
  q: string | null,
  page: number,
  perPage: number,
): Promise<Paginated<NewsListItem>> {
  const payload = await payloadClient();
  const and: Where[] = [publishedWhere];
  if (cat) and.push({ 'category.slug': { equals: cat } });
  if (q) {
    const folded = foldText(q);
    and.push({ or: [{ searchText: { like: folded } }, { title: { like: q } }] });
  }

  const run = (p: number) =>
    payload.find({
      collection: 'news',
      locale,
      where: { and },
      sort: '-publishedAt',
      page: p,
      limit: perPage,
      depth: 1,
      select: NEWS_CARD_SELECT as never,
      overrideAccess: true,
    });

  let res = await run(page);
  // Clamp an out-of-range page to the last page.
  if (res.docs.length === 0 && res.totalDocs > 0 && page > res.totalPages) {
    res = await run(res.totalPages);
  }
  const current = Math.min(Math.max(1, res.page ?? page), Math.max(1, res.totalPages));
  return paginate(compact((res.docs as Partial<PNews>[]).map(toListItem)), current, perPage, res.totalDocs);
}

async function queryFeatured(locale: Locale): Promise<NewsListItem | null> {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: 'news',
    locale,
    where: { and: [publishedWhere, { featured: { equals: true } }] },
    sort: '-publishedAt',
    limit: 1,
    depth: 1,
    select: NEWS_CARD_SELECT as never,
    overrideAccess: true,
  });
  const doc = res.docs[0] as Partial<PNews> | undefined;
  return doc ? toListItem(doc) : null;
}

async function queryLocalesBySlug(payload: Payload, slug: string, draft: boolean): Promise<Locale[]> {
  const res = await payload.find({
    collection: 'news',
    locale: 'all',
    draft,
    where: draft ? { slug: { equals: slug } } : { and: [publishedWhere, { slug: { equals: slug } }] },
    limit: 1,
    depth: 0,
    select: { title: true } as never,
    overrideAccess: true,
  });
  const title = (res.docs[0] as { title?: unknown } | undefined)?.title;
  if (!isObj<Record<string, unknown>>(title)) return ['vi'];
  const found = LOCALES.filter((l) => typeof title[l] === 'string' && (title[l] as string).trim() !== '');
  return found.length ? found : ['vi'];
}

async function queryDetail(locale: Locale, slug: string, draft: boolean): Promise<NewsDetail | null> {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: 'news',
    locale,
    draft,
    where: draft ? { slug: { equals: slug } } : { and: [publishedWhere, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
    populate: POPULATE as never,
    overrideAccess: true,
  });
  const doc = res.docs[0] as PNews | undefined;
  if (!doc) return null;
  const base = toListItem(doc);
  if (!base) return null;

  const related = compact(
    (doc.relatedPosts ?? [])
      .filter((r): r is PNews => isObj<PNews>(r) && r._status === 'published' && r.id !== doc.id)
      .map(toListItem),
  );

  const metaImage = toNewsImage(doc.meta?.image);
  return {
    ...base,
    content: (doc.content ?? null) as RichTextContent | null,
    author: toAuthor(doc.author),
    seo: {
      title: doc.meta?.title?.trim() || null,
      description: doc.meta?.description?.trim() || null,
      image: metaImage,
    },
    locales: await queryLocalesBySlug(payload, slug, draft),
    related,
    tags: [...new Set((doc.tags ?? []).map((tag) => String(tag).trim()).filter(Boolean))].slice(0, 10),
  };
}

async function queryRelated(locale: Locale, id: NewsDetail['id'], limit: number): Promise<NewsListItem[]> {
  const payload = await payloadClient();
  const self = await payload.find({
    collection: 'news',
    locale,
    where: { and: [publishedWhere, { id: { equals: id } }] },
    limit: 1,
    depth: 2,
    select: { relatedPosts: true, category: true } as never,
    populate: POPULATE as never,
    overrideAccess: true,
  });
  const doc = self.docs[0] as Partial<PNews> | undefined;
  if (!doc) return [];

  const picked = compact(
    (doc.relatedPosts ?? [])
      .filter((r): r is PNews => isObj<PNews>(r) && r._status === 'published' && r.id !== id)
      .map(toListItem),
  ).slice(0, limit);
  if (picked.length >= limit) return picked;

  const exclude = [id, ...picked.map((p) => p.id)];
  const categoryId = isObj<PNewsCategory>(doc.category) ? doc.category.id : doc.category;
  const fill = async (where: Where[], n: number) =>
    n <= 0
      ? []
      : compact(
          (
            (
              await payload.find({
                collection: 'news',
                locale,
                where: { and: [publishedWhere, { id: { not_in: exclude } }, ...where] },
                sort: '-publishedAt',
                limit: n,
                depth: 1,
                select: NEWS_CARD_SELECT as never,
                overrideAccess: true,
              })
            ).docs as Partial<PNews>[]
          ).map(toListItem),
        );

  const sameCat = categoryId != null ? await fill([{ category: { equals: categoryId } }], limit - picked.length) : [];
  const result = [...picked, ...sameCat];
  exclude.push(...sameCat.map((p) => p.id));
  // Still short (small category): top up with the latest posts of any category.
  if (result.length < limit) result.push(...(await fill([], limit - result.length)));
  return result.slice(0, limit);
}

async function querySlugs(): Promise<NewsSlugEntry[]> {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: 'news',
    locale: 'all',
    where: publishedWhere,
    sort: '-publishedAt',
    pagination: false,
    depth: 0,
    select: { slug: true, title: true, updatedAt: true, publishedAt: true } as never,
    overrideAccess: true,
  });
  return compact(
    (res.docs as { slug?: string; title?: unknown; updatedAt?: string; publishedAt?: string | null }[]).map((d) => {
      if (!d.slug) return null;
      const title = isObj<Record<string, unknown>>(d.title) ? d.title : {};
      const locales = LOCALES.filter((l) => typeof title[l] === 'string' && (title[l] as string).trim() !== '');
      const updatedAt = d.updatedAt ?? new Date(0).toISOString();
      return {
        slug: d.slug,
        updatedAt,
        publishedAt: d.publishedAt ?? updatedAt,
        locales: locales.length ? locales : (['vi'] as Locale[]),
      };
    }),
  );
}

async function queryCategories(locale: Locale): Promise<NewsCategory[]> {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: 'news-categories',
    locale,
    sort: 'order',
    pagination: false,
    depth: 0,
    overrideAccess: true,
  });
  return compact(res.docs.map(toCategory));
}

// ---------------------------------------------------------------------------
// Cache wrappers
// ---------------------------------------------------------------------------

const cachedList = unstable_cache(queryList, ['site-news-list'], {
  tags: [CACHE_TAGS.news, CACHE_TAGS.newsCategories],
  revalidate: REVALIDATE_SECONDS,
});

const cachedFeatured = unstable_cache(queryFeatured, ['site-news-featured'], {
  tags: [CACHE_TAGS.news],
  revalidate: REVALIDATE_SECONDS,
});

const cachedRelated = unstable_cache(queryRelated, ['site-news-related'], {
  tags: [CACHE_TAGS.news],
  revalidate: REVALIDATE_SECONDS,
});

const cachedSlugs = unstable_cache(querySlugs, ['site-news-slugs'], {
  tags: [CACHE_TAGS.news],
  revalidate: REVALIDATE_SECONDS,
});

const cachedCategories = unstable_cache(queryCategories, ['site-news-categories'], {
  tags: [CACHE_TAGS.newsCategories],
  revalidate: REVALIDATE_SECONDS,
});

const cachedDetail = (locale: Locale, slug: string) =>
  unstable_cache(() => queryDetail(locale, slug, false), ['site-news-detail', locale, slug], {
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
  const clean = decodeURIComponent(slug || '').trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,127}$/.test(clean)) return null;
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
 * newest published posts of the same category (excluding `id`), up to `limit`
 * (then any category if still short).
 */
export async function getRelatedNews(
  locale: Locale,
  id: NewsDetail['id'],
  limit = 3,
): Promise<NewsListItem[]> {
  const n = Math.min(12, Math.max(1, Math.floor(limit)));
  try {
    const fn = (await isDraftModeOn()) ? queryRelated : cachedRelated;
    return await fn(locale, id, n);
  } catch (err) {
    logError('getRelatedNews', err);
    return [];
  }
}

/**
 * All published slugs (sitemap, generateStaticParams).
 * `strict: true` (sitemap) throws on a DB failure outside `next build`.
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

/** Categories ordered by `order` (segmented control on /news). */
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
 * "new posts" dot). Cached via getNewsList; false without a DB.
 */
export async function hasRecentNews(locale: Locale, maxAgeDays = 7): Promise<boolean> {
  const [latest] = (await getNewsList(locale, { page: 1, perPage: 1 })).items;
  if (!latest) return false;
  const age = Date.now() - Date.parse(latest.publishedAt);
  return Number.isFinite(age) && age < maxAgeDays * 24 * 60 * 60 * 1000;
}

/** Latest `limit` published posts (RSS feed, header "new posts" dot). */
export async function getLatestNews(locale: Locale, limit = 3): Promise<NewsListItem[]> {
  const res = await getNewsList(locale, { page: 1, perPage: Math.min(48, Math.max(1, limit)) });
  return res.items;
}
