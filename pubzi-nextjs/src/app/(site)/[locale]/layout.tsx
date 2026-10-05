import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';

import '@site/styles/site.css';

import { Analytics } from '@site/components/analytics/Analytics';
import { Footer } from '@site/components/layout/Footer';
import { Header } from '@site/components/layout/Header';
import { hasRecentNews } from '@site/lib/news';
import { site, siteUrl } from '@site/data/site';
import { getDictionary, htmlLang, isLocale, locales, ogLocale, pick } from '@site/i18n';
import { JsonLd, SITE_NAME, TITLE_TEMPLATE, organization, website } from '@site/lib/seo';

/**
 * ROOT layout of the new publisher site (/vi, /en): Inter, site.css,
 * skip link, Header / Footer, GTM (when NEXT_PUBLIC_GTM_ID is set) and
 * sitewide JSON-LD (Organization + WebSite).
 * Pages render their own `<main id="main" tabIndex={-1}>` (skip-link target).
 * The legacy site (src/app/(v2)) and Payload (src/app/(payload)) have their own root layouts.
 */
// NOTE: no `dynamicParams = false` here. Next only renders unknown params on
// demand when EVERY segment allows it, so `false` on this root layout would make
// news articles published after the build 404 (NoFallbackError). Unknown
// locales are rejected below with notFound() (the proxy also redirects them).

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: new URL(siteUrl),
    title: { default: pick(site.title, locale), template: TITLE_TEMPLATE },
    description: pick(site.description, locale),
    applicationName: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { telephone: false, address: false, email: false },
    icons: {
      icon: [{ url: site.logo.square.src, type: 'image/png', sizes: '512x512' }],
      apple: [{ url: '/site/brand/apple-touch-icon.png', sizes: '180x180' }],
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: ogLocale[locale],
      images: [{ url: site.ogImage.src, width: site.ogImage.width, height: site.ogImage.height, alt: SITE_NAME }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function SiteRootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  // "New posts" dot on the News nav item: newest post younger than 7 days.
  // Cached + never throws (false at build time without a DB). Pages are
  // re-rendered on publish (revalidateTag 'news') and at least hourly.
  const newsDot = await hasRecentNews(locale, 7);

  return (
    <html lang={htmlLang[locale]} className={inter.variable}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
        >
          {t.skipToContent}
        </a>
        <Header locale={locale} newsDot={newsDot} />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer locale={locale} />
        <JsonLd data={[organization(locale), website(locale)]} />
        <Analytics />
      </body>
    </html>
  );
}
