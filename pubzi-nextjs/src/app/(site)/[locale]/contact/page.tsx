import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContactForm } from '@site/components/contact/ContactForm';
import { ContactInfoCard, HeadquartersInfo } from '@site/components/contact/ContactInfo';
import { contactFormLabels } from '@site/components/contact/labels';
import { MapEmbed } from '@site/components/contact/MapEmbed';
import { Container } from '@site/components/ui/Container';
import { contactTypes, site } from '@site/data/site';
import { absoluteUrl, getDictionary, href, isLocale, pick } from '@site/i18n';
import { JsonLd, ORGANIZATION_ID, breadcrumbList, buildMetadata } from '@site/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({ locale, path: '/contact', title: t.metaContactTitle, description: t.metaContactDesc });
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || undefined;

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const crumbs = [{ name: t.home, path: '/' }, { name: t.contact }];
  const contactPage = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t.metaContactTitle,
    description: t.metaContactDesc,
    url: absoluteUrl(href(locale, '/contact')),
    inLanguage: locale,
    about: { '@id': ORGANIZATION_ID },
    mainEntity: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      contactPoint: [
        { '@type': 'ContactPoint', contactType: 'sales', email: site.emails.biz, telephone: site.company.phoneE164, availableLanguage: ['vi', 'en'] },
        { '@type': 'ContactPoint', contactType: 'customer support', email: site.emails.support, telephone: site.company.phoneE164, areaServed: 'VN', availableLanguage: ['vi', 'en'] },
      ],
    },
  };

  return (
    <main id="main" tabIndex={-1} className="section-b pt-10 outline-none md:pt-14">
      <Container>
        {/* Design v2: two columns (auto-fit 420px), 48px gap; breadcrumb lives in JSON-LD only. */}
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left: heading, channels, HQ + map */}
          <div className="flex min-w-0 flex-col gap-8 md:gap-10">
            <div className="flex flex-col gap-2">
              <p className="kicker">{t.contactKicker}</p>
              <h1 className="m-0 text-[30px] leading-tight tracking-[-0.02em] text-ink text-balance md:text-[36px]">
                {t.contactTitle}
              </h1>
              <span className="heading-bar mt-1" aria-hidden="true" />
            </div>

            <ContactInfoCard t={t} />

            <section aria-label={t.hq} className="flex flex-col gap-3">
              <HeadquartersInfo locale={locale} t={t} />
              <MapEmbed
                query={site.company.mapQuery}
                title={`${t.hq} — ${pick(site.company.address, locale)}`}
                loadLabel={t.loadMap}
                openLabel={t.openInMaps}
                newTabLabel={t.newTab}
              />
            </section>
          </div>

          {/* Right: form */}
          <ContactForm
            locale={locale}
            labels={contactFormLabels(t)}
            typeOptions={contactTypes.map((o) => ({ value: o.value, label: pick(o.label, locale) }))}
            privacyHref={href(locale, '/privacy')}
            turnstileSiteKey={turnstileSiteKey}
            className="lg:sticky lg:top-[calc(var(--header-h)+24px)]"
          />
        </div>
      </Container>
      <JsonLd data={[contactPage, breadcrumbList(locale, crumbs)]} />
    </main>
  );
}
