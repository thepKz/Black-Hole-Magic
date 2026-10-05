import { ArrowRightIcon, CaretDownIcon } from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Breadcrumb } from '@site/components/ui/Breadcrumb';
import { Container } from '@site/components/ui/Container';
import { formatDate } from '@site/components/ui/format';
import { legalPages } from '@site/data/legal';
import { absoluteUrl, format, getDictionary, href, pick } from '@site/i18n';
import { JsonLd, ORGANIZATION_ID, breadcrumbList } from '@site/lib/seo';
import type { LegalPage, LegalSection, Locale } from '@site/lib/types';

/** Group paragraphs: consecutive "- " lines become one <ul>. */
function renderBody(body: string[], sectionId: string): ReactNode[] {
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    out.push(
      <ul key={`${sectionId}-ul-${out.length}`}>
        {list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  body.forEach((p, i) => {
    if (p.startsWith('- ')) {
      list.push(p.slice(2));
    } else {
      flush();
      out.push(<p key={`${sectionId}-p-${i}`}>{p}</p>);
    }
  });
  flush();
  return out;
}

function TocList({ sections, className }: { sections: LegalSection[]; className?: string }) {
  return (
    <ol className={className} role="list">
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="block rounded-md px-3 py-1.5 text-[13px] leading-snug text-muted no-underline transition-colors hover:bg-accent-50 hover:text-accent-700"
          >
            {s.heading}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Terms / Privacy page body: breadcrumb, H1, updated date, table of contents
 * (sticky sidebar >=1024, collapsible <details> below), sections and a
 * cross-link to the other legal page. Content from @site/data/legal (mock).
 */
export function LegalArticle({ page, locale }: { page: LegalPage; locale: Locale }) {
  const t = getDictionary(locale);
  const title = pick(page.title, locale);
  const sections = pick(page.sections, locale);
  const path = `/${page.slug}`;
  const other = page.slug === 'terms' ? legalPages.privacy : legalPages.terms;
  const crumbs = [{ name: t.home, path: '/' }, { name: title }];

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: pick(page.description, locale),
    url: absoluteUrl(href(locale, path)),
    inLanguage: locale,
    dateModified: page.updatedAt,
    publisher: { '@id': ORGANIZATION_ID },
  };

  return (
    <main id="main" tabIndex={-1} className="section-b pt-6 outline-none md:pt-8">
      <Container>
        <Breadcrumb
          label={t.breadcrumb}
          items={[{ label: t.home, href: href(locale, '/') }, { label: title }]}
          className="mb-6 md:mb-10"
        />

        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
          {/* Desktop TOC */}
          <div className="hidden lg:block">
            <nav aria-labelledby="toc-title-desktop" className="sticky top-[calc(var(--header-h)+24px)] flex flex-col gap-2">
              <p id="toc-title-desktop" className="m-0 px-3 text-[11px] font-medium tracking-[0.12em] text-accent-600 uppercase">
                {t.tableOfContents}
              </p>
              <TocList sections={sections} className="m-0 flex list-none flex-col gap-0.5 p-0" />
            </nav>
          </div>

          <article className="min-w-0 max-w-article" aria-labelledby="legal-title">
            <header className="mb-8 flex flex-col gap-3 border-b border-divider pb-6">
              <h1 id="legal-title" className="m-0 text-[30px] leading-tight tracking-[-0.02em] text-ink md:text-[36px]">
                {title}
              </h1>
              <p className="m-0 text-[15px] leading-relaxed text-muted">{pick(page.description, locale)}</p>
              <p className="m-0 text-[13px] text-subtle">
                <time dateTime={page.updatedAt}>{format(t.lastUpdated, { date: formatDate(page.updatedAt, locale, 'long') })}</time>
              </p>
            </header>

            {/* Mobile / tablet TOC */}
            <details className="group mb-8 rounded-xl border border-divider bg-surface lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                {t.tableOfContents}
                <CaretDownIcon size={16} aria-hidden="true" className="text-subtle transition-transform group-open:rotate-180 motion-reduce:transition-none" />
              </summary>
              <nav aria-label={t.tableOfContents} className="border-t border-divider px-1 py-2">
                <TocList sections={sections} className="m-0 flex list-none flex-col gap-0.5 p-0" />
              </nav>
            </details>

            <div className="prose-site">
              {sections.map((s) => (
                <section key={s.id} aria-labelledby={s.id}>
                  <h2 id={s.id}>{s.heading}</h2>
                  {renderBody(s.body, s.id)}
                </section>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-3 border-t border-divider pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={href(locale, `/${other.slug}`)}
                className="group inline-flex items-center gap-2 text-sm font-medium text-link no-underline hover:underline"
              >
                {pick(other.title, locale)}
                <ArrowRightIcon size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Link>
              <Link href={href(locale, '/contact')} className="text-sm text-muted no-underline hover:text-accent-700">
                {t.contact}
              </Link>
            </div>
          </article>
        </div>
      </Container>
      <JsonLd data={[webPage, breadcrumbList(locale, crumbs)]} />
    </main>
  );
}
