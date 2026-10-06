import 'server-only';

import config from '@payload-config';
import { getPayload, type Payload, type Where } from 'payload';

import type { News as PNews, NewsCategory as PNewsCategory } from '@/cms/payload-types';
import { foldText } from '@/shared/text';

import type { AdjacentPost, Locale, NewsCategory, NewsDetail, NewsListItem, NewsSlugEntry, Paginated } from '../../types';
import type { NewsListParams, NewsSource, PreviewRequest } from '../source';
import { compact, isObj, paginate, SITE_LOCALES } from '../util';
import { lexicalOutline, toAuthor, toCategory, toContent, toListItem, toNewsImage } from './mappers';

/**
 * Payload Local API content source (CONTENT_SOURCE=payload, the default).
 * Loaded ONLY through the dynamic import in ../index.ts, so '@payload-config'
 * (and the postgres adapter) never run for another source.
 * Throws on failures; the facade (src/site/lib/news.ts) handles them.
 */

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

async function queryList(locale: Locale, { cat, q, page, perPage }: NewsListParams): Promise<Paginated<NewsListItem>> {
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
  const found = SITE_LOCALES.filter((l) => typeof title[l] === 'string' && (title[l] as string).trim() !== '');
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

  const content = toContent(doc.content);
  return {
    ...base,
    content,
    outline: lexicalOutline(content),
    author: toAuthor(doc.author),
    seo: {
      title: doc.meta?.title?.trim() || null,
      description: doc.meta?.description?.trim() || null,
      image: toNewsImage(doc.meta?.image),
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

async function queryAdjacent(locale: Locale, slug: string, publishedAt: string) {
  const payload = await payloadClient();
  const base: Where[] = [publishedWhere, { slug: { not_equals: slug } }];
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
      const locales = SITE_LOCALES.filter((l) => typeof title[l] === 'string' && (title[l] as string).trim() !== '');
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

/** A logged-in Payload user (admin session cookie, same origin as /admin). */
async function hasPayloadSession(headers: Headers): Promise<boolean> {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers });
  return Boolean(user);
}

export const payloadNewsSource: NewsSource = {
  id: 'payload',
  list: queryList,
  featured: queryFeatured,
  bySlug: (locale, slug, options) => queryDetail(locale, slug, Boolean(options?.draft)),
  related: (locale, seed, limit) => queryRelated(locale, seed.id, limit),
  adjacent: (locale, slug, publishedAt) => queryAdjacent(locale, slug, publishedAt),
  categories: queryCategories,
  slugs: querySlugs,
  verifyPreview: (req: PreviewRequest) => hasPayloadSession(req.headers),
  // The Draft Mode cookie outlives the admin session: re-check on every draft
  // render so a shared machine stops showing drafts after /admin logout.
  verifyPreviewSession: hasPayloadSession,
};
