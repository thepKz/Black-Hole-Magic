import { ArrowLeftIcon } from '@phosphor-icons/react/ssr';
import type { Metadata } from 'next';
import config from '@payload-config';
import { draftMode, headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { cache } from 'react';

import { lexicalHeadings, lexicalToPlainText } from '@/cms/lib/lexical';
import { slugify } from '@/cms/lib/text';
import { RefreshRouteOnSave } from '@/cms/live-preview/RefreshRouteOnSave';
import { LocaleAlternates } from '@site/components/layout/LocaleAlternates';
import { getAdjacentNews } from '@site/components/news/adjacent';
import { ArticleBody } from '@site/components/news/ArticleBody';
import { ArticleCover, ArticleHeader, DraftBanner, PrevNextNav, RelatedNews } from '@site/components/news/ArticleParts';
import { articleJsonLdImages, articleOgImage, articlePath } from '@site/components/news/meta';
import { ShareButtons, type ShareLabels } from '@site/components/news/ShareButtons';
import { newsStrings } from '@site/components/news/strings';
import { TableOfContents } from '@site/components/news/TableOfContents';
import { Breadcrumb } from '@site/components/ui/Breadcrumb';
import { absoluteUrl, getDictionary, href, isLocale, locales, type Locale } from '@site/i18n';
import { getAllNewsSlugs, getNewsBySlug, getRelatedNews } from '@site/lib/news';
import { breadcrumbList, buildMetadata, JsonLd, newsArticle, SITE_NAME } from '@site/lib/seo';

/**
 * /{locale}/news/{slug}
 * - ISR: published slugs are prerendered when the DB is reachable at build
 *   time; others render on first request (dynamicParams) and are purged by the
 *   Payload hooks (revalidateTag/revalidatePath) on publish / unpublish.
 * - Draft Mode (/api/draft from the admin): latest draft + live-preview refresh,
 *   preview banner, noindex.
 * - An EN URL of an article without an EN translation renders the VI fallback
 *   with noindex + a SELF canonical (no conflicting cross-URL canonical);
 *   hreflang lists only the real translations.
 * - DB failures THROW (strict) so ISR keeps the last good page instead of
 *   caching a 404.
 */
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const entries = await getAllNewsSlugs();
  const locale = params.locale as Locale;
  return entries.filter((e) => e.locales.includes(locale)).map((e) => ({ slug: e.slug }));
}

/**
 * Draft Mode alone is not trusted: its cookie outlives the admin session, so
 * drafts are only served while a Payload user is still logged in (otherwise a
 * shared machine would keep showing unpublished drafts after /admin logout).
 * Cookies can't be cleared during render; the stale bypass cookie is simply
 * ignored (it is cleared by /api/draft/exit, the banner's exit form).
 */
const isDraftViewer = cache(async (): Promise<boolean> => {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return false;
  try {
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: await headers() });
    return Boolean(user);
  } catch {
    return false;
  }
});

/** One fetch per request for metadata + page (draft reads are uncached). */
const loadPost = cache(async (locale: Locale, slug: string) => {
  const draft = await isDraftViewer();
  const post = await getNewsBySlug(locale, slug, { draft, strict: true });
  return { post, draft };
});

export async function generateMetadata({ params }: PageProps<'/[locale]/news/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const { post, draft } = await loadPost(locale, slug);
  const t = getDictionary(locale);
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
  const { post, draft } = await loadPost(locale, slug);
  if (!post) notFound();

  const t = getDictionary(locale);
  const s = newsStrings(locale);
  const path = articlePath(post.slug);
  const url = absoluteUrl(href(locale, path));

  const [relatedAuto, adjacent] = await Promise.all([
    getRelatedNews(locale, post.id, 3),
    getAdjacentNews(locale, post.slug, post.publishedAt, { draft }),
  ]);
  const related = relatedAuto.length ? relatedAuto : post.related.slice(0, 3);

  const headings = lexicalHeadings(post.content, slugify);
  const showToc = headings.filter((h) => h.level === 2).length >= ROOT_H2_MIN;
  const plain = lexicalToPlainText(post.content);
  const wordCount = plain ? plain.split(/\s+/).filter(Boolean).length : 0;

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
          <RefreshRouteOnSave />
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
