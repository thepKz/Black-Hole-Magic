import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

import { CACHE_TAGS, newsDocTag } from '../lib/tags';
import { purge as purgeTargets, type RevalidateReq } from './revalidate';

const LOCALES = ['vi', 'en'] as const;

type NewsDocLike = { id: number | string; slug?: string | null; _status?: 'draft' | 'published' | null };

/** Public paths that render a given article (both locales) + list, feeds, sitemap. */
export function newsPaths(slugs: (string | null | undefined)[]): string[] {
  const paths: string[] = ['/sitemap.xml'];
  for (const l of LOCALES) {
    paths.push(`/${l}/news`, `/${l}/news/rss.xml`);
    for (const slug of slugs) if (slug) paths.push(`/${l}/news/${slug}`);
  }
  return paths;
}

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
