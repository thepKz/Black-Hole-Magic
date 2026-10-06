/**
 * Cache tags shared by the Payload revalidation hooks (src/cms/hooks/revalidate*.ts)
 * and the site's news data layer. The contract now lives in src/shared/cache.ts
 * (CMS-neutral, also used by POST /api/revalidate); this file re-exports it.
 *
 * Usage on the read side:   unstable_cache(fn, keys, { tags: [CACHE_TAGS.news] })
 * Usage on the write side:  revalidateTag(CACHE_TAGS.news, 'max')   (Next 16 two-arg form)
 */
export { CACHE_TAGS, newsDocTag, type CacheTag } from '../../shared/cache';
