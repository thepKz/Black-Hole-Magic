import { ArrowLeftIcon } from '@phosphor-icons/react/ssr';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { RefreshRouteOnSave } from '@/cms/live-preview/RefreshRouteOnSave';
import { LocaleAlternates } from '@site/components/layout/LocaleAlternates';
import { ArticleBody } from '@site/components/news/ArticleBody';
import { ArticleUnavailable } from '@site/components/news/ArticleUnavailable';
import { ArticleCover, ArticleHeader, DraftBanner, PrevNextNav, RelatedNews } from '@site/components/news/ArticleParts';
import { articleJsonLdImages, articleOgImage, articlePath } from '@site/components/news/meta';
import { ShareButtons, type ShareLabels } from '@site/components/news/ShareButtons';
import { newsStrings } from '@site/components/news/strings';
import { TableOfContents } from '@site/components/news/TableOfContents';
import { Breadcrumb } from '@site/components/ui/Breadcrumb';
import { absoluteUrl, getDictionary, href, isLocale, locales, type Locale } from '@site/i18n';
import { contentSourceId } from '@site/lib/content';
import { isDraftViewer as checkDraftViewer } from '@site/lib/content/preview';
import { getAdjacentNews, getAllNewsSlugs, getNewsBySlug, getRelatedNews, isNewsUnavailable, shortenCacheForOutage } from '@site/lib/news';
import { breadcrumbList, buildMetadata, JsonLd, newsArticle, SITE_NAME } from '@site/lib/seo';

/**
 * /{locale}/news/{slug}
 * - Content comes from the active content source (CONTENT_SOURCE, see
 *   src/site/lib/content); this page only uses the CMS-neutral DTOs.
 * - ISR: published slugs are prerendered when the source is reachable at build
 *   time; others render on first request (dynamicParams) and are purged by the
 *   Payload hooks / the CMS webhook (POST /api/revalidate) on publish / unpublish.
 * - Draft Mode (/api/draft): latest draft, preview banner, noindex; Payload's
 *   live-preview refresh bridge only when the source is Payload.
 * - An EN URL of an article without an EN translation renders the VI fallback
 *   with noindex + a SELF canonical (no conflicting cross-URL canonical);
 *   hreflang lists only the real translations.
 * - Source failures THROW (strict) so ISR keeps the last good page instead of
 *   caching a 404. With no cached copy at all, the page renders
 *   <ArticleUnavailable> with a ~30 s ISR lifetime (ISR renders cannot use
 *   ./error.tsx; that stays for unexpected errors).
 */
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const entries = await getAllNewsSlugs();
  const locale = params.locale as Locale;
  return entries.filter((e) => e.locales.includes(locale)).map((e) => ({ slug: e.slug }));
}

/**
 * Drafts only with Draft Mode + a valid signed preview cookie for the active
 * content source (+ a live CMS session for Payload): see
 * src/site/lib/content/preview.ts. Memoised per request.
 */
const isDraftViewer = cache(checkDraftViewer);

/** One fetch per request for metadata + page (draft reads are uncached). */
const loadPost = cache(async (locale: Locale, slug: string) => {
  const draft = await isDraftViewer();
  const post = await getNewsBySlug(locale, slug, { draft, strict: true });
  return { post, draft };
});

export async function generateMetadata({ params }: PageProps<'/[locale]/news/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  let loaded: Awaited<ReturnType<typeof loadPost>>;
  try {
    loaded = await loadPost(locale, slug);
  } catch (err) {
    // Source outage with no cached copy: neutral, noindex metadata; the page
    // renders <ArticleUnavailable> (see below).
    if (isNewsUnavailable(err)) {
      return { title: locale === 'en' ? 'Temporarily unavailable' : 'Tạm thời không tải được', robots: { index: false, follow: false } };
    }
    throw err;
  }
  const { post, draft } = loaded;
  if (!post) return { title: t.notFoundTitle, robots: { index: false, follow: true } };

  const path = articlePath(post.slug);
  const translated = post.locales.includes(locale);
  const seoTitle = post.seo?.title?.trim();
  // A meta title that already carries the brand (plugin generator appends
  // " | Black Hole Game") is used as-is; any other goes through the template.
  const brandedSeoTitle = Boolean(seoTitle && seoTitle.toLowerCase().endsWith(SITE_NAME.toLowerCase()));
  const meta = buildMetadata({
    locale,
    path,
    title: seoTitle || post.title,
    absoluteTitle: brandedSeoTitle,
    description: post.seo?.description || post.excerpt || undefined,
    image: articleOgImage(post, locale),
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: post.author ? [post.author.name] : undefined,
    section: post.category?.name,
    tags: post.tags.length ? post.tags : undefined,
    noindex: draft || !translated,
    availableLocales: post.locales,
  });
  return meta;
}

const ROOT_H2_MIN = 3;

export default async function NewsArticlePage({ params }: PageProps<'/[locale]/news/[slug]'>) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  let loaded: Awaited<ReturnType<typeof loadPost>>;
  try {
    loaded = await loadPost(locale, slug);
  } catch (err) {
    // Only reached when the source is down AND this article has no cached data
    // (cached ones are served stale by unstable_cache). Throwing would end in
    // Next's bare "Internal Server Error" (ISR renders bypass error.tsx), so
    // render a branded page that ISR keeps for only ~30 s.
    if (!isNewsUnavailable(err)) throw err;
    await shortenCacheForOutage(`${locale}/${slug}`);
    return <ArticleUnavailable locale={locale} path={href(locale, `/news/${encodeURIComponent(slug)}`)} />;
  }
  const { post, draft } = loaded;
  if (!post) notFound();

  const t = getDictionary(locale);
  const s = newsStrings(locale);
  const path = articlePath(post.slug);
  const url = absoluteUrl(href(locale, path));

  const [relatedAuto, adjacent] = await Promise.all([
    getRelatedNews(locale, post, 3),
    getAdjacentNews(locale, post.slug, post.publishedAt, { draft }),
  ]);
  const related = relatedAuto.length ? relatedAuto : post.related.slice(0, 3);

  const { headings, wordCount } = post.outline;
  const showToc = headings.filter((h) => h.level === 2).length >= ROOT_H2_MIN;

  const crumbs = [
    { name: t.home, path: '/' },
    { name: t.news, path: '/news' },
    ...(post.category ? [{ name: post.category.name, path: `/news?cat=${encodeURIComponent(post.category.slug)}` }] : []),
    { name: post.title },
  ];

  const shareLabels: ShareLabels = {
    share: t.share,
    shareFacebook: t.shareFacebook,
    shareX: t.shareX,
    copyLink: t.copyLink,
    linkCopied: t.linkCopied,
    copyFailed: s.copyFailed,
    shareNative: s.shareNative,
    newTab: t.newTab,
  };

  // Language switcher: same article when translated, else the other locale's news list.
  const switcherPaths = Object.fromEntries(
    locales.map((l) => [l, post.locales.includes(l) ? href(l, path) : href(l, '/news')]),
  );

  return (
    <main id="main" tabIndex={-1} className="section-b outline-none">
      {draft ? (
        <>
          <DraftBanner locale={locale} path={href(locale, path)} />
          {contentSourceId() === 'payload' ? <RefreshRouteOnSave /> : null}
        </>
      ) : null}
      <LocaleAlternates paths={switcherPaths} />

      <div className="container-site pt-6 md:pt-8">
        <div className="xl:grid xl:grid-cols-[minmax(0,760px)_232px] xl:justify-center xl:gap-14">
          <article className="mx-auto min-w-0 max-w-article xl:mx-0" aria-labelledby="article-title">
            <Breadcrumb
              label={t.breadcrumb}
              className="mb-5 md:mb-6"
              items={crumbs.map((c) => ({ label: c.name, href: c.path ? href(locale, c.path) : undefined }))}
            />

            <ArticleHeader post={post} locale={locale} titleId="article-title" />

            {post.cover ? (
              <div className="mt-6 md:mt-8">
                <ArticleCover post={post} />
              </div>
            ) : null}

            {showToc ? (
              <TableOfContents items={headings} label={t.tableOfContents} variant="collapsible" className="mt-6 xl:hidden" />
            ) : null}

            <div className="mt-8 md:mt-10">
              <ArticleBody content={post.content} locale={locale} />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-divider pt-6">
              <ShareButtons url={url} title={post.title} labels={shareLabels} />
              <Link
                href={href(locale, '/news')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-link no-underline hover:text-accent-700"
              >
                <ArrowLeftIcon className="size-4" aria-hidden="true" weight="bold" />
                {t.backToNews}
              </Link>
            </div>

            <div className="mt-8">
              <PrevNextNav adjacent={adjacent} locale={locale} />
            </div>
          </article>

          <aside className="hidden xl:block" aria-label={showToc ? t.tableOfContents : t.share}>
            <div className="sticky top-[calc(var(--header-h)+32px)] flex max-h-[calc(100dvh-var(--header-h)-64px)] flex-col gap-8 overflow-y-auto pt-12 pb-4">
              {showToc ? <TableOfContents items={headings} label={t.tableOfContents} variant="sidebar" /> : null}
              <ShareButtons url={url} title={post.title} labels={shareLabels} layout="column" />
            </div>
          </aside>
        </div>

        <RelatedNews items={related} locale={locale} />
      </div>

      <JsonLd
        data={[
          breadcrumbList(locale, crumbs),
          newsArticle({
            locale,
            path,
            headline: post.title,
            description: post.seo?.description || post.excerpt || undefined,
            images: articleJsonLdImages(post, locale),
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: post.author ? { name: post.author.name } : null,
            section: post.category?.name,
            keywords: post.tags.length ? post.tags : undefined,
            wordCount: wordCount || undefined,
          }),
        ]}
      />
    </main>
  );
}
