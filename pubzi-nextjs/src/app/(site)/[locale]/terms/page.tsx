import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LegalArticle } from '@site/components/contact/LegalArticle';
import { terms } from '@site/data/legal';
import { getDictionary, isLocale } from '@site/i18n';
import { buildMetadata } from '@site/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/terms'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/terms',
    title: t.metaTermsTitle,
    description: t.metaTermsDesc,
    modifiedTime: terms.updatedAt,
  });
}

export default async function TermsPage({ params }: PageProps<'/[locale]/terms'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LegalArticle page={terms} locale={locale} />;
}
