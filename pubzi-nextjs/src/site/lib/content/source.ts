import type {
  AdjacentPosts,
  Locale,
  NewsCategory,
  NewsDetail,
  NewsListItem,
  NewsSlugEntry,
  Paginated,
} from '../types';

/**
 * CONTENT SOURCE CONTRACT - the only thing the public site needs from a CMS.
 *
 * Implementations (selected by env CONTENT_SOURCE, see ./index.ts):
 * - payload : Payload Local API (./payload/news-source.ts)          default
 * - http    : any REST/JSON CMS through ./http/mapping.ts         Strapi, Directus, WP REST, ...
 * - mock    : in-memory fixtures (src/site/data/news.ts)           no DB / demo / tests
 *
 * Rules for adapters:
 * - Return PUBLISHED content only, unless `draft: true` is passed to bySlug().
 * - Map to the DTOs in ../types (the CMS boundary). Never leak CMS documents.
 * - THROW on failures (network, auth, malformed payload). Never swallow: the
 *   facade (src/site/lib/news.ts) owns caching, logging, empty-state fallbacks
 *   and the strict/ISR semantics.
 * - No caching inside adapters (the facade wraps every call in unstable_cache
 *   with the source id in the key + the tags of src/shared/cache.ts).
 */
export type ContentSourceId = 'payload' | 'http' | 'mock';

export interface NewsListParams {
  /** Category slug, or null for all. */
  cat: string | null;
  /** Search text (already trimmed, max 100 chars), accent-insensitive. */
  q: string | null;
  /** 1-based; adapters CLAMP an out-of-range page to the last page. */
  page: number;
  perPage: number;
}

export interface BySlugOptions {
  /** Latest draft instead of the published version (preview). */
  draft?: boolean;
}

/**
 * What `related()` knows about the current article. Sources that can look the
 * article up by id (Payload) may ignore everything but `id`.
 */
export interface RelatedSeed {
  id: NewsDetail['id'];
  slug: string | null;
  /** Category slug. */
  category: string | null;
  /** Manual picks already resolved on the article (NewsDetail.related). */
  picks: NewsListItem[];
}

/** Minimal request view for preview verification (works for Request and next/headers). */
export interface PreviewRequest {
  headers: Headers;
  searchParams: URLSearchParams;
}

export interface NewsSource {
  readonly id: ContentSourceId;
  list(locale: Locale, params: NewsListParams): Promise<Paginated<NewsListItem>>;
  /** Newest published post flagged featured, or null. */
  featured(locale: Locale): Promise<NewsListItem | null>;
  bySlug(locale: Locale, slug: string, options?: BySlugOptions): Promise<NewsDetail | null>;
  /** Manual related picks first, then same category, then latest; excludes the article itself. */
  related(locale: Locale, seed: RelatedSeed, limit: number): Promise<NewsListItem[]>;
  /** Older (`prev`) / newer (`next`) published article around `publishedAt`. */
  adjacent(locale: Locale, slug: string, publishedAt: string, options?: { draft?: boolean }): Promise<AdjacentPosts>;
  /** Categories in display order. */
  categories(locale: Locale): Promise<NewsCategory[]>;
  /** Every published slug (sitemap, generateStaticParams). */
  slugs(): Promise<NewsSlugEntry[]>;
  /**
   * May this request turn on preview (Draft Mode)? Payload: admin session
   * cookie. http: CMS_PREVIEW_SECRET token. Optional: no method = no preview.
   */
  verifyPreview?(req: PreviewRequest): Promise<boolean>;
  /** Re-check on every draft render (e.g. Payload: still logged in). Optional. */
  verifyPreviewSession?(headers: Headers): Promise<boolean>;
}
