import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

import { CACHE_TAGS, newsDocTag, newsPaths } from '../../shared/cache';
import { purge as purgeTargets, type RevalidateReq } from './revalidate';

type NewsDocLike = { id: number | string; slug?: string | null; _status?: 'draft' | 'published' | null };

/** Public paths of an article: defined once in src/shared/cache.ts (also used by POST /api/revalidate). */
export { newsPaths };

async function purge(slugs: (string | null | undefined)[], req: RevalidateReq) {
  const unique = [...new Set(slugs.filter((s): s is string => Boolean(s)))];
  await purgeTargets({ tags: [CACHE_TAGS.news, ...unique.map(newsDocTag)], paths: newsPaths(unique) }, req);
}

/**
 * Revalidate only when the PUBLIC version changes:
 * - publish (draft -> published or published -> published),
 * - unpublish (published -> draft, request without `?draft=true`),
 * - slug change of a published doc (old + new URL).
 * Draft/autosave saves of an unpublished doc never touch the cache
 * (Payload stores those in the versions table only).
 */
export const revalidateNewsAfterChange: CollectionAfterChangeHook<NewsDocLike> = async ({
  doc,
  previousDoc,
  req,
}) => {
  const isPublished = doc?._status === 'published';
  const wasPublished = previousDoc?._status === 'published';
  // "Save draft" / autosave on an already-published article go through
  // `?draft=true` and only write a new version: the public doc is unchanged.
  // An unpublish (button or scheduled job) has no draft flag.
  const draftFlag = (req.query as Record<string, unknown> | undefined)?.draft;
  const isDraftOnlySave = !isPublished && (draftFlag === 'true' || draftFlag === true);
  if ((isPublished || wasPublished) && !isDraftOnlySave) {
    await purge([doc?.slug, previousDoc?.slug], req);
  }
  return doc;
};

export const revalidateNewsAfterDelete: CollectionAfterDeleteHook<NewsDocLike> = async ({ doc, req }) => {
  await purge([doc?.slug], req);
  return doc;
};
