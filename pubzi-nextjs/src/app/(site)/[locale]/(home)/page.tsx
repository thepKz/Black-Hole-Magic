import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FeaturedGamesSection } from '@site/components/home/FeaturedGamesSection';
import { HomeBanner } from '@site/components/home/HomeBanner';
import { LatestNewsSection } from '@site/components/home/LatestNewsSection';
import { ServicesSection } from '@site/components/home/ServicesSection';
import { site } from '@site/data/site';
import { getDictionary, isLocale, pick } from '@site/i18n';
import { buildMetadata } from '@site/lib/seo';

/**
 * Home (/vi, /en): mock data + the 3 latest news posts from /admin.
 * Banner slider -> Publishing services -> Featured games -> News & events.
 * Partners section is hidden for now (user decision); PartnersSection is kept
 * in src/site/components/home for when real partner logos arrive.
 * Organization + WebSite JSON-LD are emitted sitewide by the root layout.
 */
export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  // No `title` -> absolute site title (no template suffix).
  return buildMetadata({ locale, path: '/', description: t.metaHomeDesc });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <h1 className="sr-only">{pick(site.title, locale)}</h1>
      <HomeBanner locale={locale} />
      <ServicesSection locale={locale} />
      <FeaturedGamesSection locale={locale} />
      <LatestNewsSection locale={locale} />
    </main>
  );
}
