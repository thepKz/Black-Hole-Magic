import type { MetadataRoute } from 'next';

import { banners } from '@site/data/banners';
import { getGames } from '@site/data/games';
import { legalPages } from '@site/data/legal';
import { absoluteUrl, defaultLocale, href, locales, type Locale } from '@site/i18n';
import { getAllNewsSlugs } from '@site/lib/news';

/**
 * /sitemap.xml for the new publisher site only (/vi, /en).
 * - Static routes x 2 locales, each with hreflang alternates (vi, en, x-default).
 * - Every published news post, per locale it is translated into, with lastmod = updatedAt.
 * - The legacy site (/v2), /admin and /api are never listed.
 *
 * Freshness: the news CMS hook calls revalidatePath('/sitemap.xml') on publish /
 * unpublish / delete; `revalidate` is the safety net (e.g. a build made without DB).
 */
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

interface StaticRoute {
  path: string;
  changeFrequency: NonNullable<Entry['changeFrequency']>;
  priority: number;
  lastModified?: string;
  images?: string[];
}

const toAbs = (src: string) => (/^https?:\/\//i.test(src) ? src : absoluteUrl(src));

/** hreflang map for a locale-less path restricted to `available` locales (+ x-default). */
function languages(path: string, available: readonly Locale[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of available) map[l] = absoluteUrl(href(l, path));
  const xDefault = available.includes(defaultLocale) ? defaultLocale : available[0];
  if (xDefault) map['x-default'] = absoluteUrl(href(xDefault, path));
  return map;
}

function expand(route: StaticRoute, available: readonly Locale[] = locales): Entry[] {
  const alternates = { languages: languages(route.path, available) };
  return available.map((l) => ({
    url: absoluteUrl(href(l, route.path)),
    ...(route.lastModified ? { lastModified: route.lastModified } : {}),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates,
    ...(route.images?.length ? { images: route.images } : {}),
  }));
}

const maxIso = (dates: (string | undefined)[]) =>
  dates.filter((d): d is string => !!d).sort().at(-1);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // strict: a DB failure at runtime THROWS so Next keeps serving the last good
  // sitemap (instead of caching one without news for an hour). At build time
  // without a DB it returns [] so the build still succeeds.
  const news = await getAllNewsSlugs({ strict: true });
  const latestNews = maxIso(news.map((n) => n.updatedAt));

  const statics: StaticRoute[] = [
    {
      path: '/',
      changeFrequency: 'daily',
      priority: 1,
      // No lastModified: the home page is static mock data with no news section,
      // so tying it to the latest post would make <lastmod> inaccurate.
      images: banners.map((b) => toAbs(b.image.src)),
    },
    {
      path: '/games',
      changeFrequency: 'weekly',
      priority: 0.9,
      images: getGames().map((g) => toAbs(g.cover.src)),
    },
    { path: '/news', changeFrequency: 'daily', priority: 0.9, lastModified: latestNews },
    { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
    ...Object.values(legalPages).map<StaticRoute>((p) => ({
      path: `/${p.slug}`,
      changeFrequency: 'yearly',
      priority: 0.2,
      lastModified: p.updatedAt,
    })),
  ];

  const newsEntries = news.flatMap((n) => {
    const available = locales.filter((l) => n.locales.includes(l));
    return expand(
      {
        path: `/news/${n.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
        lastModified: n.updatedAt,
      },
      available.length ? available : [defaultLocale],
    );
  });

  return [...statics.flatMap((r) => expand(r)), ...newsEntries];
}
