import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LegalArticle } from '@site/components/contact/LegalArticle';
import { privacy } from '@site/data/legal';
import { getDictionary, isLocale } from '@site/i18n';
import { buildMetadata } from '@site/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/privacy',
    title: t.metaPrivacyTitle,
    description: t.metaPrivacyDesc,
    modifiedTime: privacy.updatedAt,
  });
}

export default async function PrivacyPage({ params }: PageProps<'/[locale]/privacy'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LegalArticle page={privacy} locale={locale} />;
}
