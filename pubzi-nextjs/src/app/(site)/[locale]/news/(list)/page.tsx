import { RssSimpleIcon } from '@phosphor-icons/react/ssr';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { NewsCategoryTabs } from '@site/components/news/NewsCategoryTabs';
import { NewsFeatured, NewsGrid } from '@site/components/news/NewsListing';
import { NewsResultsRegion } from '@site/components/news/NewsResultsRegion';
import { newsStrings } from '@site/components/news/strings';
import { Button } from '@site/components/ui/Button';
import { Container } from '@site/components/ui/Container';
import { EmptyState } from '@site/components/ui/EmptyState';
import { pageHref, Pagination, type SearchParamsRecord } from '@site/components/ui/Pagination';
import { SearchInput } from '@site/components/ui/SearchInput';
import { absoluteUrl, format, getDictionary, href, isLocale, type Locale } from '@site/i18n';
import { getFeaturedNews, getNewsCategories, getNewsList, NEWS_PER_PAGE } from '@site/lib/news';
import { breadcrumbList, buildMetadata, JsonLd } from '@site/lib/seo';
import type { NewsCategory } from '@site/lib/types';

/**
 * /{locale}/news - server-rendered from searchParams:
 *   ?q=    accent-insensitive title search  (noindex)
 *   ?cat=  category slug                    (indexable, self-canonical)
 *   ?page= page number, 9 per page          (indexable, self-canonical)
 * Page 1 without filters opens with a featured block (1 large + 2 cards).
 */

type ListParams = { q: string; cat: string; page: number };

function first(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? '';
}

function parseParams(sp: SearchParamsRecord): ListParams {
  const page = Number.parseInt(first(sp.page), 10);
  return {
    q: first(sp.q).slice(0, 100),
    cat: first(sp.cat).toLowerCase().slice(0, 96),
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

/** Locale-less canonical path for a (cat, page) combination - `q` is never canonical. */
function listPath(cat: NewsCategory | null, page: number): string {
  const params = new URLSearchParams();
  if (cat) params.set('cat', cat.slug);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return `/news${qs ? `?${qs}` : ''}`;
}

export async function generateMetadata({ params, searchParams }: PageProps<'/[locale]/news'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const s = newsStrings(locale);
  const { q, cat, page } = parseParams(await searchParams);
  const categories = await getNewsCategories(locale);
  const category = cat ? (categories.find((c) => c.slug === cat) ?? null) : null;
  const unknownCategory = Boolean(cat) && !category;
  // Out-of-range ?page=N: the page redirects to the last page (real 307, no
  // loading.tsx streaming); belt and braces, never index it and point the
  // canonical at the real page. getNewsList is cached and shared with the page.
  let canonicalPage = page;
  let outOfRange = false;
  if (page > 1) {
    const probe = await getNewsList(locale, { cat: cat || undefined, q: q || undefined, page, perPage: NEWS_PER_PAGE });
    if (probe.page !== page) {
      outOfRange = true;
      canonicalPage = probe.page;
    }
  }

  const parts = [category ? `${category.name} – ${t.metaNewsTitle}` : t.metaNewsTitle];
  if (q) parts.unshift(format(t.resultsFor, { q }));
  if (canonicalPage > 1) parts.push(format(s.pageSuffix, { page: canonicalPage }));

  const meta = buildMetadata({
    locale,
    path: listPath(category, canonicalPage),
    title: parts.join(' · '),
    description: t.metaNewsDesc,
    // Search results and unknown categories are thin/duplicate pages.
    noindex: Boolean(q) || unknownCategory || outOfRange,
  });

  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      types: { 'application/rss+xml': [{ url: absoluteUrl(href(locale, '/news/rss.xml')), title: s.rssTitle }] },
    },
  };
}

export default async function NewsPage({ params, searchParams }: PageProps<'/[locale]/news'>) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const t = getDictionary(locale);
  const s = newsStrings(locale);
  const sp = await searchParams;
  const { q, cat, page } = parseParams(sp);

  const categories = await getNewsCategories(locale);
  const category = cat ? (categories.find((c) => c.slug === cat) ?? null) : null;
  // Unknown category slug -> show the empty state for it rather than silently ignoring it.
  const result = await getNewsList(locale, { cat: cat || undefined, q: q || undefined, page, perPage: NEWS_PER_PAGE });

  const basePath = href(locale, '/news');
  // Out-of-range ?page= was clamped by the data layer -> send to the real last
  // page (a real 307: this route has no loading.tsx, so nothing streams first).
  if (page > 1 && result.page !== page) redirect(pageHref(basePath, sp, result.page));

  const filtered = Boolean(q || cat);
  const firstPage = !filtered && result.page === 1;
  // Lead = newest post flagged `featured` in the CMS (even when it is not among
  // the newest posts), else the newest post. It is removed from the grid below.
  const pinned = firstPage ? await getFeaturedNews(locale) : null;
  const pool = pinned ? [pinned, ...result.items.filter((i) => i.id !== pinned.id)] : result.items;
  const showFeatured = firstPage && pool.length >= 3;
  const featured = showFeatured ? pool.slice(0, 3) : [];
  const gridItems = showFeatured ? pool.slice(3) : result.items;

  const tabHref = (slug: string | null) => {
    const p = new URLSearchParams();
    if (slug) p.set('cat', slug);
    if (q) p.set('q', q);
    const qs = p.toString();
    return `${basePath}${qs ? `?${qs}` : ''}`;
  };
  const tabOptions = [
    { value: 'all', label: t.all, href: tabHref(null) },
    ...categories.map((c) => ({ value: c.slug, label: c.name, href: tabHref(c.slug) })),
  ];

  const crumbs = [
    { name: t.home, path: '/' },
    ...(category ? [{ name: t.newsHub, path: '/news' }, { name: category.name }] : [{ name: t.newsHub }]),
  ];

  const hasAnyPost = result.totalItems > 0;
  // Identity of the rendered result set (NewsResultsRegion: pending + keyed fade-in).
  const stateKey = `${cat}|${q}|${result.page}`;

  return (
    <main id="main" tabIndex={-1} className="section-b pt-10 outline-none md:pt-12">
      <Container>
        {/* Design v2: kicker + 40px H1 (same header as /games). */}
        <header className="mb-6">
          <p className="kicker">{t.newsKicker}</p>
          <h1 className="m-0 mt-1 text-[30px] tracking-[-0.02em] text-ink md:text-[36px] lg:text-[40px]">{t.newsHub}</h1>
        </header>

        <NewsResultsRegion stateKey={stateKey}>
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mb-8">
            <SearchInput
              label={t.searchNews}
              placeholder={t.searchNews}
              clearLabel={t.clearSearch}
              navigation="router"
              resetParams={['page']}
              trackContext="news"
            />
            {categories.length ? (
              <NewsCategoryTabs options={tabOptions} value={category?.slug ?? (cat ? cat : 'all')} label={s.categories} />
            ) : null}
            <a
              href={href(locale, '/news/rss.xml')}
              className="fx ml-auto hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] text-subtle no-underline hover:text-accent-700 lg:inline-flex"
              type="application/rss+xml"
            >
              <RssSimpleIcon className="size-4" aria-hidden="true" weight="bold" />
              {t.rssFeed}
            </a>
          </div>

          {/* Keyed by the result set: after a tab / page click the new list fades in;
              while the next one loads, the current one dims (NewsResultsRegion). */}
          <div
            key={stateKey}
            data-news-results
            className="transition-[opacity,translate] duration-(--dur-3) ease-standard group-data-[pending]/news:opacity-55 group-data-[pending]/news:duration-(--dur-2) in-data-[navigated]:starting:translate-y-1.5 in-data-[navigated]:starting:opacity-0"
          >
            {filtered && hasAnyPost ? (
              <p className="mb-5 text-sm text-muted" aria-live="polite">
                {q ? <span className="font-medium text-ink">{format(t.resultsFor, { q })}</span> : null}
                {q ? <span aria-hidden="true"> · </span> : null}
                {format(t.resultsCount, { count: result.totalItems })}
              </p>
            ) : null}

            {!hasAnyPost ? (
              filtered ? (
                <EmptyState
                  title={t.emptyTitle}
                  description={t.emptyDesc}
                  action={
                    <Button href={basePath} variant="secondary" scroll={false}>
                      {t.clearFilters}
                    </Button>
                  }
                />
              ) : (
                <EmptyState title={t.newsEmptyTitle} description={t.newsEmptyDesc} />
              )
            ) : (
              <>
                {showFeatured ? (
                  <section aria-label={t.featuredPost} className="mb-10 md:mb-14">
                    <NewsFeatured items={featured} locale={locale} />
                  </section>
                ) : null}

                {gridItems.length ? (
                  <section aria-label={showFeatured ? s.latestPosts : t.newsHub}>
                    {showFeatured ? (
                      <div className="mb-5 flex items-center gap-3">
                        <h2 className="m-0 shrink-0 text-xl text-ink md:text-[22px]">{s.latestPosts}</h2>
                        <span aria-hidden="true" className="h-px flex-1 bg-divider" />
                      </div>
                    ) : null}
                    <NewsGrid items={gridItems} locale={locale} preloadFirst={!showFeatured} />
                  </section>
                ) : null}

                <div data-news-nav>
                  <Pagination
                    page={result.page}
                    totalPages={result.totalPages}
                    pathname={basePath}
                    searchParams={sp}
                    locale={locale}
                    className="mt-12"
                  />
                </div>
              </>
            )}
          </div>
        </NewsResultsRegion>
      </Container>
      <JsonLd data={breadcrumbList(locale, crumbs)} />
    </main>
  );
}
