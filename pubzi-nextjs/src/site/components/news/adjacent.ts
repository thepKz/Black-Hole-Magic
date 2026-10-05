import 'server-only';

import config from '@payload-config';
import { unstable_cache } from 'next/cache';
import { getPayload, type Where } from 'payload';

import { CACHE_TAGS } from '@/cms/lib/tags';
import type { Locale } from '@site/lib/types';

/**
 * Previous (older) / next (newer) published article around a publish date.
 * Small companion of src/site/lib/news.ts (owned by the CMS agent) used only
 * by the article page. Cached with the `news` tag, never throws.
 */
export interface AdjacentPost {
  slug: string;
  title: string;
}

export interface AdjacentPosts {
  prev: AdjacentPost | null;
  next: AdjacentPost | null;
}

async function queryAdjacent(locale: Locale, slug: string, publishedAt: string): Promise<AdjacentPosts> {
  const payload = await getPayload({ config });
  const base: Where[] = [{ _status: { equals: 'published' } }, { slug: { not_equals: slug } }];
  const find = async (op: 'less_than' | 'greater_than', sort: string): Promise<AdjacentPost | null> => {
    const res = await payload.find({
      collection: 'news',
      locale,
      where: { and: [...base, { publishedAt: { [op]: publishedAt } }] },
      sort,
      limit: 1,
      depth: 0,
      select: { title: true, slug: true } as never,
      overrideAccess: true,
    });
    const doc = res.docs[0] as { slug?: string | null; title?: string | null } | undefined;
    return doc?.slug ? { slug: doc.slug, title: doc.title ?? doc.slug } : null;
  };
  const [prev, next] = await Promise.all([find('less_than', '-publishedAt'), find('greater_than', 'publishedAt')]);
  return { prev, next };
}

const cachedAdjacent = unstable_cache(queryAdjacent, ['site-news-adjacent'], {
  tags: [CACHE_TAGS.news],
  revalidate: 3600,
});

export async function getAdjacentNews(
  locale: Locale,
  slug: string,
  publishedAt: string,
  { draft = false }: { draft?: boolean } = {},
): Promise<AdjacentPosts> {
  try {
    const fn = draft || process.env.NEWS_DISABLE_CACHE === 'true' ? queryAdjacent : cachedAdjacent;
    return await fn(locale, slug, publishedAt);
  } catch (err) {
    console.error('[news] getAdjacentNews failed:', (err instanceof Error ? err.message : String(err)).split(/\r?\n/)[0].slice(0, 200));
    return { prev: null, next: null };
  }
}
