/**
 * SEO helpers for the new site: Next `Metadata` builder + JSON-LD (schema.org).
 *
 *   export async function generateMetadata({ params }) {
 *     const { locale } = await params;
 *     return buildMetadata({ locale, path: '/games', title: t.metaGamesTitle, description: t.metaGamesDesc });
 *   }
 *
 *   <JsonLd data={[breadcrumbList(locale, [...]), newsArticle({...})]} />
 *
 * The root layout already sets the title template ('%s | Black Hole Game') and
 * renders organization() + website() JSON-LD, so pages must not repeat those.
 */
import type { Metadata } from 'next';
import { createElement, type ReactElement } from 'react';

import { site, siteUrl, isRealUrl } from '@site/data/site';
import { absoluteUrl, href, localeAlternates, locales, ogLocale, pick, type Locale } from '@site/i18n';

export const SITE_NAME = site.name;
export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

export interface SeoImage {
  /** Root-relative or absolute URL. */
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface BuildMetadataInput {
  locale: Locale;
  /** Locale-less path: '/', '/news', '/news/my-post'. */
  path: string;
  /** Page title WITHOUT the site suffix (template adds it). Omit on the home page to use the site title. */
  title?: string;
  /** Use `title` as-is (no template) - e.g. the home page. */
  absoluteTitle?: boolean;
  description?: string;
  /** OG/Twitter image; default = site OG image (/site/og-default.jpg 1200x630). */
  image?: SeoImage | string | null;
  type?: 'website' | 'article';
  /** ISO datetimes (articles). */
  publishedTime?: string;
  modifiedTime?: string;
  /** Article author names. */
  authors?: string[];
  /** Article section (category name). */
  section?: string;
  tags?: string[];
  /** noindex,follow (search results, previews, 404, filtered lists). */
  noindex?: boolean;
  /** Locales that exist for this URL (hreflang); default both. */
  availableLocales?: readonly Locale[];
}

/** Absolute URL for a root-relative path or an absolute URL. */
export function toAbsolute(url: string): string {
  return /^https?:\/\//i.test(url) ? url : absoluteUrl(url);
}

function normalizeImage(image: BuildMetadataInput['image'], fallbackAlt: string): Required<SeoImage> {
  if (!image) {
    const og = site.ogImage;
    return { src: toAbsolute(og.src), width: og.width, height: og.height, alt: fallbackAlt };
  }
  if (typeof image === 'string') return { src: toAbsolute(image), width: 1200, height: 630, alt: fallbackAlt };
  return {
    src: toAbsolute(image.src),
    width: image.width ?? 1200,
    height: image.height ?? 630,
    alt: image.alt || fallbackAlt,
  };
}

/**
 * Full page metadata: title (template), description, canonical, hreflang
 * vi/en/x-default, Open Graph (incl. article fields), Twitter large card, robots.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const {
    locale,
    path,
    title,
    absoluteTitle = false,
    description = pick(site.description, locale),
    image,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
    noindex = false,
    availableLocales = locales,
  } = input;

  const siteTitle = pick(site.title, locale);
  const fullTitle = !title ? siteTitle : absoluteTitle ? title : TITLE_TEMPLATE.replace('%s', title);
  const alternates = localeAlternates(locale, path, availableLocales.includes(locale) ? availableLocales : [locale, ...availableLocales]);
  const img = normalizeImage(image, title || siteTitle);
  const otherLocales = availableLocales.filter((l) => l !== locale).map((l) => ogLocale[l]);

  const openGraphBase = {
    title: fullTitle,
    description,
    url: alternates.canonical,
    siteName: SITE_NAME,
    locale: ogLocale[locale],
    alternateLocale: otherLocales,
    images: [{ url: img.src, width: img.width, height: img.height, alt: img.alt }],
  };

  return {
    title: !title ? { absolute: siteTitle } : absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
    openGraph:
      type === 'article'
        ? {
            ...openGraphBase,
            type: 'article',
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
            authors,
            section,
            tags,
          }
        : { ...openGraphBase, type: 'website' },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [{ url: img.src, alt: img.alt }],
    },
    robots: noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
        },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

export type JsonLdObject = Record<string, unknown>;

export const ORGANIZATION_ID = `${siteUrl}/#organization`;
export const WEBSITE_ID = `${siteUrl}/#website`;

/** Organization (publisher) - rendered once by the root layout. */
export function organization(locale: Locale): JsonLdObject {
  const sameAs = site.socials.map((s) => s.url).filter(isRealUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: pick(site.company.legalName, locale),
    alternateName: site.company.shortName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: toAbsolute(site.logo.square.src),
      width: site.logo.square.width,
      height: site.logo.square.height,
    },
    image: toAbsolute(site.ogImage.src),
    description: pick(site.description, locale),
    foundingDate: String(site.foundingYear),
    taxID: site.company.taxId,
    email: site.emails.other,
    telephone: site.company.phoneE164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.company.postal.street,
      addressLocality: site.company.postal.locality,
      addressRegion: site.company.postal.region,
      addressCountry: site.company.postal.country,
    },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', email: site.emails.support, telephone: site.company.phoneE164, areaServed: 'VN', availableLanguage: ['Vietnamese', 'English'] },
      { '@type': 'ContactPoint', contactType: 'sales', email: site.emails.biz, areaServed: 'VN', availableLanguage: ['Vietnamese', 'English'] },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** WebSite + SearchAction (news search) - rendered once by the root layout. */
export function website(locale: Locale): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl(href(locale, '/')),
    name: SITE_NAME,
    description: pick(site.description, locale),
    inLanguage: locale,
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${absoluteUrl(href(locale, '/news'))}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface NewsArticleInput {
  locale: Locale;
  /** Locale-less path, e.g. '/news/my-post'. */
  path: string;
  headline: string;
  description?: string;
  /** Image URLs (root-relative ok); ideally 16:9, 4:3 and 1:1 >= 1200px wide. */
  images?: string[];
  datePublished: string;
  dateModified?: string;
  author?: { name: string; url?: string } | null;
  section?: string;
  keywords?: string[];
  wordCount?: number;
}

/** NewsArticle for /{locale}/news/{slug}. */
export function newsArticle(input: NewsArticleInput): JsonLdObject {
  const url = absoluteUrl(href(input.locale, input.path));
  const images = (input.images?.length ? input.images : [site.ogImage.src]).map(toAbsolute);
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline: input.headline.slice(0, 110),
    ...(input.description ? { description: input.description } : {}),
    image: images,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: input.locale,
    author: input.author
      ? { '@type': 'Person', name: input.author.name, ...(input.author.url ? { url: input.author.url } : {}) }
      : { '@type': 'Organization', name: SITE_NAME, url: siteUrl },
    publisher: { '@id': ORGANIZATION_ID, '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: toAbsolute(site.logo.square.src) } },
    isPartOf: { '@id': WEBSITE_ID },
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.keywords?.length ? { keywords: input.keywords.join(', ') } : {}),
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
  };
}

export interface BreadcrumbEntry {
  name: string;
  /** Locale-less path ('/news'); omit for the current page. */
  path?: string;
}

/** BreadcrumbList. Pass the same items you render in <Breadcrumb>. */
export function breadcrumbList(locale: Locale, items: BreadcrumbEntry[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path !== undefined ? { item: absoluteUrl(href(locale, item.path)) } : {}),
    })),
  };
}

/** Escape a JSON string for safe embedding inside <script> (XSS: </script>, <!--, U+2028/9). */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * <JsonLd data={...} /> - renders one <script type="application/ld+json">.
 * Server-safe; an array renders as a JSON array (valid JSON-LD).
 */
export function JsonLd({ data, id }: { data: JsonLdObject | JsonLdObject[]; id?: string }): ReactElement {
  return createElement('script', {
    type: 'application/ld+json',
    id,
    dangerouslySetInnerHTML: { __html: serializeJsonLd(data) },
  });
}