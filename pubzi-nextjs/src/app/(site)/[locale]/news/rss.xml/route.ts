import { newsStrings } from '@site/components/news/strings';
import { site } from '@site/data/site';
import { absoluteUrl, getDictionary, href, intlLocale, isLocale, pick } from '@site/i18n';
import { getNewsList } from '@site/lib/news';
import { toAbsolute } from '@site/lib/seo';
import type { NewsListItem } from '@site/lib/types';

/**
 * GET /{locale}/news/rss.xml - RSS 2.0 feed of the 30 latest published articles.
 * Data comes from the cached news layer (tag `news`); the Payload hooks also
 * revalidatePath() this URL on publish. Dynamic handler + CDN cache headers,
 * so a build without a database never freezes an empty feed.
 */
export const dynamic = 'force-dynamic';

const FEED_SIZE = 30;

function xml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const rfc822 = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date(0).toUTCString() : d.toUTCString();
};

function itemXml(item: NewsListItem, locale: 'vi' | 'en'): string {
  const link = absoluteUrl(href(locale, `/news/${item.slug}`));
  const img = item.cover ? (item.cover.sizes.og ?? item.cover.sizes.news ?? item.cover) : null;
  const imgType = img && /\.jpe?g($|\?)/i.test(img.src) ? 'image/jpeg' : img && /\.png($|\?)/i.test(img.src) ? 'image/png' : 'image/webp';
  return [
    '    <item>',
    `      <title>${xml(item.title)}</title>`,
    `      <link>${xml(link)}</link>`,
    `      <guid isPermaLink="true">${xml(link)}</guid>`,
    `      <pubDate>${rfc822(item.publishedAt)}</pubDate>`,
    item.category ? `      <category>${xml(item.category.name)}</category>` : '',
    item.excerpt ? `      <description>${xml(item.excerpt)}</description>` : '',
    img
      ? `      <media:content url="${xml(toAbsolute(img.src))}" medium="image" type="${imgType}" width="${img.width}" height="${img.height}" />`
      : '',
    '    </item>',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function GET(_req: Request, ctx: RouteContext<'/[locale]/news/rss.xml'>) {
  const { locale } = await ctx.params;
  if (!isLocale(locale)) return new Response('Not found', { status: 404 });

  const t = getDictionary(locale);
  const s = newsStrings(locale);
  const { items } = await getNewsList(locale, { page: 1, perPage: FEED_SIZE });
  const self = absoluteUrl(href(locale, '/news/rss.xml'));
  const home = absoluteUrl(href(locale, '/news'));
  const lastBuild = items.reduce((max, i) => (i.updatedAt > max ? i.updatedAt : max), items[0]?.publishedAt ?? '');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${xml(s.rssTitle)}</title>
    <link>${xml(home)}</link>
    <description>${xml(t.metaNewsDesc)}</description>
    <language>${intlLocale[locale].toLowerCase()}</language>
    <copyright>${xml(`© ${new Date().getFullYear()} ${pick(site.company.legalName, locale)}`)}</copyright>
    <generator>Black Hole Game</generator>
    <ttl>60</ttl>
    ${lastBuild ? `<lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>` : ''}
    <atom:link href="${xml(self)}" rel="self" type="application/rss+xml" />
    <image>
      <url>${xml(toAbsolute(site.logo.square.src))}</url>
      <title>${xml(s.rssTitle)}</title>
      <link>${xml(home)}</link>
    </image>
${items.map((i) => itemXml(i, locale)).join('\n')}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=1800, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
    },
  });
}
