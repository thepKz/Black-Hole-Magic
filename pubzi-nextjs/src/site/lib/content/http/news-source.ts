import { createHmac } from 'node:crypto';

import { z } from 'zod';

import { isOptimizableMediaUrl } from '@/shared/media-origins';
import { safeEqual } from '@/shared/revalidate-secret';

import type {
  AdjacentPost,
  ArticleContent,
  LexicalDoc,
  Locale,
  NewsAuthor,
  NewsCategory,
  NewsDetail,
  NewsImage,
  NewsListItem,
  NewsSlugEntry,
} from '../../types';
import { sanitizeArticleHtml } from '../html';
import type { NewsListParams, NewsSource, PreviewRequest, RelatedSeed } from '../source';
import { compact, EMPTY_OUTLINE, estimateReadingTime, foldIncludes, isObj, NEWS_SLUG_RE, paginate, SITE_LOCALES, toIso } from '../util';
import { buildUrl, fetchJson, get, getBool, getNum, getStr } from './client';
import { readHttpConfig, type HttpSourceConfig } from './config';
import { mapping as defaultMapping, type HttpMapping, type ImageMapping } from './mapping';

/**
 * Generic REST/JSON content source (CONTENT_SOURCE=http). Every CMS-specific
 * detail lives in ./mapping.ts; this file only applies it.
 *
 * - Responses are mapped field by field and then validated with zod: an item
 *   without id/slug/title is DROPPED (logged once per call), a malformed list
 *   becomes empty, a malformed article becomes "not found". Network / HTTP
 *   errors THROW (the facade decides: empty state, or strict for ISR).
 * - HTML bodies are sanitized here (sanitizeArticleHtml), Lexical bodies are
 *   passed through for the Lexical renderer.
 * - Images from hosts outside CONTENT_MEDIA_ORIGINS are flagged `unoptimized`.
 * - No 'server-only' import so the fixture check can run it under tsx.
 */

const MAX_SLUG_PAGES = 50;
const SLUG_PAGE_SIZE = 100;

const itemSchema = z.object({
  id: z.union([z.string().min(1), z.number()]),
  slug: z.string().regex(NEWS_SLUG_RE),
  title: z.string().min(1),
  publishedAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export interface HttpSourceOptions {
  config?: HttpSourceConfig;
  mapping?: HttpMapping;
  /** Logger for dropped items (defaults to console.warn). */
  warn?: (msg: string) => void;
}

export function createHttpNewsSource(options: HttpSourceOptions = {}): NewsSource {
  const cfg = options.config ?? readHttpConfig();
  const m = options.mapping ?? defaultMapping;
  const warn = options.warn ?? ((msg: string) => console.warn(`[content/http] ${msg}`));

  // -------------------------------------------------------------------------
  // Mapping helpers
  // -------------------------------------------------------------------------

  const absolute = (src: string) =>
    /^https?:\/\//i.test(src) ? src : src.startsWith('/') && !src.startsWith('//') ? `${cfg.mediaBase}${src}` : src;

  function toImage(parent: unknown, im: ImageMapping | null, caption?: string | null): NewsImage | null {
    if (!im) return null;
    const obj = im.path == null ? parent : get(parent, im.path);
    if (!isObj(obj)) return null;
    const url = getStr(obj, im.url);
    if (!url) return null;
    const src = absolute(url);
    if (!/^https?:\/\//i.test(src) && !src.startsWith('/')) return null;
    const sizes: NewsImage['sizes'] = {};
    for (const [role, sm] of Object.entries(im.sizes) as [keyof NewsImage['sizes'], NonNullable<ImageMapping['sizes']['card']>][]) {
      const sUrl = getStr(obj, sm.url);
      const w = getNum(obj, sm.width);
      const h = getNum(obj, sm.height);
      if (sUrl && w && h) sizes[role] = { src: absolute(sUrl), width: w, height: h };
    }
    const unoptimized = !isOptimizableMediaUrl(src, cfg.mediaOrigins);
    return {
      src,
      width: getNum(obj, im.width) ?? 1200,
      height: getNum(obj, im.height) ?? 675,
      alt: getStr(obj, im.alt) ?? '',
      focal: { x: getNum(obj, im.focalX) ?? 50, y: getNum(obj, im.focalY) ?? 50 },
      caption: caption ?? getStr(obj, im.caption),
      sizes,
      ...(unoptimized ? { unoptimized: true } : {}),
    };
  }

  function toCategory(obj: unknown, cm: HttpMapping['category']): NewsCategory | null {
    if (!isObj(obj)) return null;
    const slug = getStr(obj, cm.slug);
    if (!slug) return null;
    return { id: getStr(obj, cm.id) ?? slug, slug, name: getStr(obj, cm.name) ?? slug, order: getNum(obj, cm.order) ?? 0 };
  }

  function contentOf(doc: unknown, locale: Locale): { content: ArticleContent | null; outline: NewsDetail['outline']; media: number } {
    const raw = get(doc, m.item.content);
    const fmt = typeof m.item.contentFormat === 'string' && (m.item.contentFormat === 'html' || m.item.contentFormat === 'lexical')
      ? m.item.contentFormat
      : getStr(doc, m.item.contentFormat as Exclude<HttpMapping['item']['contentFormat'], 'html' | 'lexical'>) ?? 'html';
    if (fmt === 'lexical') {
      if (!isObj<LexicalDoc>(raw) || !isObj(raw.root)) return { content: null, outline: EMPTY_OUTLINE, media: 0 };
      // Lexical from a non-Payload CMS: no server outline helper here (kept CMS-free);
      // the TOC is simply empty. Use contentFormat 'html' when possible.
      return { content: { format: 'lexical', doc: raw }, outline: EMPTY_OUTLINE, media: 0 };
    }
    if (typeof raw !== 'string' || !raw.trim()) return { content: null, outline: EMPTY_OUTLINE, media: 0 };
    const clean = sanitizeArticleHtml(raw, {
      resolveUrl: absolute,
      tableLabel: locale === 'en' ? 'Data table (scrolls horizontally)' : 'Bảng dữ liệu (cuộn ngang)',
    });
    return { content: clean.html ? { format: 'html', html: clean.html } : null, outline: clean.outline, media: clean.mediaCount };
  }

  function toListItem(doc: unknown): NewsListItem | null {
    if (!isObj(doc)) return null;
    const publishedAt = toIso(get(doc, m.item.publishedAt)) ?? toIso(get(doc, m.item.updatedAt));
    const candidate = {
      id: (get(doc, m.item.id) as string | number | undefined) ?? undefined,
      slug: getStr(doc, m.item.slug)?.toLowerCase(),
      title: getStr(doc, m.item.title),
      publishedAt,
      updatedAt: toIso(get(doc, m.item.updatedAt)) ?? publishedAt,
    };
    const parsed = itemSchema.safeParse(candidate);
    if (!parsed.success) return null;
    const rt = getNum(doc, m.item.readingTime);
    return {
      ...parsed.data,
      excerpt: getStr(doc, m.item.excerpt) ?? '',
      category: toCategory(get(doc, m.item.category.path), m.item.category),
      cover: toImage(doc, m.item.cover),
      featured: getBool(doc, m.item.featured),
      readingTime: Math.max(1, Math.round(rt ?? 1)),
    };
  }

  function mapItems(arr: unknown, scope: string): NewsListItem[] {
    if (!Array.isArray(arr)) {
      warn(`${scope}: list path did not return an array`);
      return [];
    }
    const items = compact(arr.map(toListItem));
    if (items.length < arr.length) warn(`${scope}: dropped ${arr.length - items.length} item(s) without valid id/slug/title/date`);
    return items;
  }

  function toAuthor(doc: unknown): NewsAuthor | null {
    const a = m.item.author;
    const obj = get(doc, a.path);
    if (typeof obj === 'string' && obj.trim()) return { id: obj.trim(), name: obj.trim(), avatar: null, bio: null };
    if (!isObj(obj)) return null;
    const name = getStr(obj, a.name);
    if (!name) return null;
    return { id: getStr(obj, a.id) ?? name, name, avatar: toImage(obj, a.avatar), bio: getStr(obj, a.bio) };
  }

  function tagsOf(doc: unknown): string[] {
    const raw = get(doc, m.item.tags);
    if (!Array.isArray(raw)) return [];
    const out = raw
      .map((t) => (typeof t === 'string' ? t : isObj(t) ? (getStr(t, 'name') ?? getStr(t, 'tag') ?? getStr(t, 'value')) : null))
      .filter((t): t is string => Boolean(t && t.trim()))
      .map((t) => t.trim());
    return [...new Set(out)].slice(0, 10);
  }

  function localesOf(doc: unknown, locale: Locale): Locale[] {
    const raw = get(doc, m.item.locales);
    if (!Array.isArray(raw)) return [locale];
    const found = SITE_LOCALES.filter((l) => raw.includes(l));
    return found.length ? found : [locale];
  }

  // -------------------------------------------------------------------------
  // Requests
  // -------------------------------------------------------------------------

  const localeParam = (locale: Locale): [string, string][] => (m.query.locale ? [[m.query.locale, locale]] : []);
  const publishedParam = (): [string, string][] => (m.query.published ? [m.query.published] : []);

  async function requestList(
    locale: Locale,
    params: { cat?: string | null; q?: string | null; page: number; perPage: number; extra?: [string, string][]; oldest?: boolean },
  ) {
    const query: [string, string][] = [
      ...localeParam(locale),
      ...publishedParam(),
      [m.query.page, String(params.page)],
      [m.query.perPage, String(params.perPage)],
    ];
    const sort = params.oldest ? m.query.sortOldest : m.query.sortNewest;
    if (sort) query.push(sort);
    if (params.cat && m.query.cat) query.push([m.query.cat, params.cat]);
    if (params.q && m.query.q) query.push([m.query.q, params.q]);
    query.push(...(params.extra ?? []));
    const json = await fetchJson(buildUrl(cfg.baseUrl, m.endpoints.list, { locale }, query), {
      token: cfg.token,
      timeoutMs: cfg.timeoutMs,
    });
    const items = mapItems(get(json, m.list.items), 'list');
    const total = getNum(json, m.list.total) ?? items.length;
    return { items, total: Math.max(total, items.length) };
  }

  async function list(locale: Locale, { cat, q, page, perPage }: NewsListParams) {
    // CMS without server-side search: fetch a capped window and fold-filter here.
    if (q && !m.query.q) {
      const { items } = await requestList(locale, { cat, page: 1, perPage: 100 });
      const rows = items.filter((i) => foldIncludes(i.title, q));
      const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
      const current = Math.min(Math.max(1, page), totalPages);
      return paginate(rows.slice((current - 1) * perPage, current * perPage), current, perPage, rows.length);
    }
    let res = await requestList(locale, { cat, q, page, perPage });
    const totalPages = Math.max(1, Math.ceil(res.total / perPage));
    if (!res.items.length && res.total > 0 && page > totalPages) {
      res = await requestList(locale, { cat, q, page: totalPages, perPage });
      return paginate(res.items, totalPages, perPage, res.total);
    }
    return paginate(res.items, Math.min(Math.max(1, page), totalPages), perPage, res.total);
  }

  async function bySlug(locale: Locale, slug: string, options: { draft?: boolean } = {}): Promise<NewsDetail | null> {
    const draft = Boolean(options.draft);
    const query: [string, string][] = [...localeParam(locale)];
    if (draft && m.query.draft) query.push(m.query.draft);
    if (!draft) query.push(...publishedParam());
    const json = await fetchJson(buildUrl(cfg.baseUrl, m.endpoints.bySlug, { slug, locale }, query), {
      token: draft ? cfg.previewToken : cfg.token,
      timeoutMs: cfg.timeoutMs,
    });
    const doc = get(json, m.detail.item);
    const base = toListItem(doc);
    if (!base || base.slug !== slug) return null;
    const { content, outline, media } = contentOf(doc, locale);
    const rt = getNum(doc, m.item.readingTime);
    const relatedRaw = get(doc, m.item.related);
    return {
      ...base,
      readingTime: rt ? Math.max(1, Math.round(rt)) : estimateReadingTime(outline.wordCount, media),
      content,
      outline,
      author: toAuthor(doc),
      seo: {
        title: getStr(doc, m.item.seo.title),
        description: getStr(doc, m.item.seo.description),
        image: toImage(doc, m.item.seo.image),
      },
      locales: localesOf(doc, locale),
      related: Array.isArray(relatedRaw) ? compact(relatedRaw.map(toListItem)).filter((r) => r.slug !== slug) : [],
      tags: tagsOf(doc),
    };
  }

  async function related(locale: Locale, seed: RelatedSeed, limit: number): Promise<NewsListItem[]> {
    const out: NewsListItem[] = [];
    const push = (items: NewsListItem[]) => {
      for (const it of items) {
        if (out.length >= limit) return;
        if (it.id === seed.id || it.slug === seed.slug || out.some((o) => o.id === it.id)) continue;
        out.push(it);
      }
    };
    push(seed.picks);
    if (out.length < limit && seed.category) push((await requestList(locale, { cat: seed.category, page: 1, perPage: limit + 1 })).items);
    if (out.length < limit) push((await requestList(locale, { page: 1, perPage: limit + 1 })).items);
    return out;
  }

  async function adjacent(locale: Locale, slug: string, publishedAt: string) {
    if (!m.query.publishedBefore || !m.query.publishedAfter) return { prev: null, next: null };
    const pick = (items: NewsListItem[]): AdjacentPost | null => {
      const it = items.find((i) => i.slug !== slug);
      return it ? { slug: it.slug, title: it.title } : null;
    };
    const [older, newer] = await Promise.all([
      requestList(locale, { page: 1, perPage: 2, extra: [[m.query.publishedBefore, publishedAt]] }),
      requestList(locale, { page: 1, perPage: 2, extra: [[m.query.publishedAfter, publishedAt]], oldest: true }),
    ]);
    return { prev: pick(older.items), next: pick(newer.items) };
  }

  async function categories(locale: Locale): Promise<NewsCategory[]> {
    const json = await fetchJson(buildUrl(cfg.baseUrl, m.endpoints.categories, { locale }, localeParam(locale)), {
      token: cfg.token,
      timeoutMs: cfg.timeoutMs,
    });
    const raw = get(json, m.categories.items);
    if (!Array.isArray(raw)) return [];
    return compact(raw.map((c) => toCategory(c, m.category))).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }

  async function slugs(): Promise<NewsSlugEntry[]> {
    // Locales are not in list responses of most CMSs: one pass per site locale.
    const byslug = new Map<string, NewsSlugEntry>();
    for (const locale of SITE_LOCALES) {
      for (let page = 1; page <= MAX_SLUG_PAGES; page++) {
        const { items, total } = await requestList(locale, { page, perPage: SLUG_PAGE_SIZE });
        for (const it of items) {
          const prev = byslug.get(it.slug);
          if (prev) {
            if (!prev.locales.includes(locale)) prev.locales.push(locale);
          } else {
            byslug.set(it.slug, { slug: it.slug, updatedAt: it.updatedAt, publishedAt: it.publishedAt, locales: [locale] });
          }
        }
        if (page * SLUG_PAGE_SIZE >= total || !items.length) break;
      }
    }
    return [...byslug.values()];
  }

  /**
   * Preview contract: /api/draft?path=/vi/news/slug&token=<CMS_PREVIEW_SECRET>
   * or a short-lived signature: &exp=<unix seconds>&sig=hex(HMAC-SHA256("<path>:<exp>", CMS_PREVIEW_SECRET)).
   */
  async function verifyPreview(req: PreviewRequest): Promise<boolean> {
    const secret = cfg.previewSecret;
    if (!secret) return false;
    const token = req.searchParams.get('token');
    if (token) return safeEqual(token, secret);
    const sig = req.searchParams.get('sig');
    const exp = Number(req.searchParams.get('exp'));
    const path = req.searchParams.get('path') ?? '';
    if (!sig || !Number.isFinite(exp) || exp * 1000 < Date.now() || exp * 1000 > Date.now() + 24 * 3600 * 1000) return false;
    const expected = createHmac('sha256', secret).update(`${path}:${exp}`).digest('hex');
    return safeEqual(sig.toLowerCase(), expected);
  }

  return {
    id: 'http',
    list,
    featured: async (locale) => {
      if (m.query.featured) {
        const { items } = await requestList(locale, { page: 1, perPage: 1, extra: [m.query.featured] });
        return items.find((i) => i.featured) ?? items[0] ?? null;
      }
      // No featured filter in the CMS: newest featured among the latest 20.
      const { items } = await requestList(locale, { page: 1, perPage: 20 });
      return items.find((i) => i.featured) ?? null;
    },
    bySlug,
    related,
    adjacent: (locale, slug, publishedAt) => adjacent(locale, slug, publishedAt),
    categories,
    slugs,
    verifyPreview,
  };
}
