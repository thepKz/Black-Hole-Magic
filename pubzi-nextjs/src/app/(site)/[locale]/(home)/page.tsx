import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FeaturedGamesSection } from '@site/components/home/FeaturedGamesSection';
import { HomeBanner } from '@site/components/home/HomeBanner';
import { PartnersSection } from '@site/components/home/PartnersSection';
import { ServicesSection } from '@site/components/home/ServicesSection';
import { site } from '@site/data/site';
import { getDictionary, isLocale, pick } from '@site/i18n';
import { buildMetadata } from '@site/lib/seo';

/**
 * Home (/vi, /en) - static, MOCK data only (no CMS, no news):
 * Banner slider -> Publishing services -> Featured games -> Partners.
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
      <PartnersSection locale={locale} />
    </main>
  );
}
