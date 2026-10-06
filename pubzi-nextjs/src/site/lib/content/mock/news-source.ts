import { newsFixtureCategories, newsFixtures, type NewsFixture } from '../../../data/news';
import type { Locale, NewsCategory, NewsDetail, NewsImage, NewsListItem, NewsSlugEntry } from '../../types';
import { sanitizeArticleHtml } from '../html';
import type { NewsSource } from '../source';
import { compact, estimateReadingTime, foldIncludes, paginateArray, SITE_LOCALES } from '../util';

/**
 * In-memory content source (CONTENT_SOURCE=mock, or the automatic fallback
 * when no CMS is configured - see ../index.ts).
 *
 * `withFixtures: false` = an EMPTY newsroom (production without a CMS: clean
 * empty states, no DB init attempts, no fake news indexed). With fixtures it
 * serves src/site/data/news.ts (demo / UI tests / CI without Postgres).
 */

const toImage = (c: NewsFixture['cover']): NewsImage => ({
  src: c.src,
  width: c.width,
  height: c.height,
  alt: c.alt,
  focal: { x: 50, y: 50 },
  caption: null,
  sizes: {},
});

const pickL = (v: Partial<Record<Locale, string>> & { vi: string }, locale: Locale) => v[locale]?.trim() || v.vi;

function category(slug: NewsFixture['category'], locale: Locale): NewsCategory | null {
  const c = newsFixtureCategories.find((x) => x.slug === slug);
  return c ? { id: c.slug, slug: c.slug, name: c.name[locale], order: c.order } : null;
}

function toItem(f: NewsFixture, locale: Locale): NewsListItem {
  const body = sanitizeArticleHtml(pickL(f.html, locale));
  return {
    id: f.id,
    slug: f.slug,
    title: pickL(f.title, locale),
    excerpt: pickL(f.excerpt, locale),
    category: category(f.category, locale),
    publishedAt: f.publishedAt,
    updatedAt: f.updatedAt ?? f.publishedAt,
    cover: toImage(f.cover),
    featured: Boolean(f.featured),
    readingTime: estimateReadingTime(body.outline.wordCount, body.mediaCount),
  };
}

export function createMockNewsSource({ withFixtures }: { withFixtures: boolean }): NewsSource {
  const all = () => (withFixtures ? [...newsFixtures].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)) : []);
  const bySlug = (slug: string) => all().find((f) => f.slug === slug) ?? null;

  return {
    id: 'mock',

    async list(locale, { cat, q, page, perPage }) {
      const rows = all()
        .filter((f) => !cat || f.category === cat)
        .filter((f) => !q || foldIncludes(pickL(f.title, locale), q));
      const res = paginateArray(rows, page, perPage);
      return { ...res, items: res.items.map((f) => toItem(f, locale)) };
    },

    async featured(locale) {
      const f = all().find((x) => x.featured);
      return f ? toItem(f, locale) : null;
    },

    async bySlug(locale, slug): Promise<NewsDetail | null> {
      const f = bySlug(slug);
      if (!f) return null;
      const body = sanitizeArticleHtml(pickL(f.html, locale), { tableLabel: locale === 'en' ? 'Data table' : 'Bảng dữ liệu' });
      return {
        ...toItem(f, locale),
        content: { format: 'html', html: body.html },
        outline: body.outline,
        author: f.author ? { id: f.author, name: f.author, avatar: null, bio: null } : null,
        seo: { title: null, description: null, image: null },
        locales: SITE_LOCALES.filter((l) => l === 'vi' || Boolean(f.title[l])),
        related: compact((f.related ?? []).map(bySlug)).map((r) => toItem(r, locale)),
        tags: f.tags ?? [],
      };
    },

    async related(locale, { id }, limit) {
      const self = all().find((f) => f.id === id);
      if (!self) return [];
      const picked = compact((self.related ?? []).map(bySlug));
      const sameCat = all().filter((f) => f.category === self.category);
      const rest = all();
      const out: NewsFixture[] = [];
      for (const f of [...picked, ...sameCat, ...rest]) {
        if (f.id !== id && !out.includes(f)) out.push(f);
        if (out.length >= limit) break;
      }
      return out.map((f) => toItem(f, locale));
    },

    async adjacent(locale, slug, publishedAt) {
      const rows = all().filter((f) => f.slug !== slug);
      const prev = rows.find((f) => f.publishedAt < publishedAt);
      const next = [...rows].reverse().find((f) => f.publishedAt > publishedAt);
      const map = (f?: NewsFixture) => (f ? { slug: f.slug, title: pickL(f.title, locale) } : null);
      return { prev: map(prev), next: map(next) };
    },

    async categories(locale) {
      return withFixtures
        ? newsFixtureCategories.map((c) => ({ id: c.slug, slug: c.slug, name: c.name[locale], order: c.order }))
        : [];
    },

    async slugs(): Promise<NewsSlugEntry[]> {
      return all().map((f) => ({
        slug: f.slug,
        updatedAt: f.updatedAt ?? f.publishedAt,
        publishedAt: f.publishedAt,
        locales: SITE_LOCALES.filter((l) => l === 'vi' || Boolean(f.title[l])),
      }));
    },
    // No verifyPreview: mock content has no drafts.
  };
}
