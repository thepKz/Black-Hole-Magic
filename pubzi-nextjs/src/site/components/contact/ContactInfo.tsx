import { FacebookLogoIcon } from '@phosphor-icons/react/ssr';
import type { ReactNode } from 'react';

import { isRealUrl, site } from '@site/data/site';
import { pick, type Dictionary } from '@site/i18n';
import { cn } from '@site/lib/cn';
import type { Locale } from '@site/lib/types';

interface Row {
  key: string;
  label: string;
  value: string;
  href: string;
  icon?: ReactNode;
  external?: boolean;
}

/**
 * Contact channels card (design v2): label column 150px (60% ink) + value
 * (500 weight). Rows: Liên hệ hợp tác · Liên hệ hỗ trợ · (Báo chí) · Hotline · Fanpage.
 * Stacks label over value below 640px.
 */
export function ContactInfoCard({ t, className }: { t: Dictionary; className?: string }) {
  // Same de-duplication rule as the Footer: one row when biz and support share an address.
  const mergedSupport = site.emails.support === site.emails.biz;
  const rows: Row[] = [
    {
      key: 'biz',
      label: mergedSupport ? t.bizSupportContact : t.bizContact,
      value: site.emails.biz,
      href: `mailto:${site.emails.biz}`,
    },
    ...(!mergedSupport
      ? [{ key: 'support', label: t.supContact, value: site.emails.support, href: `mailto:${site.emails.support}` }]
      : []),
    ...(site.emails.press !== site.emails.biz
      ? [{ key: 'press', label: t.pressContact, value: site.emails.press, href: `mailto:${site.emails.press}` }]
      : []),
    { key: 'hotline', label: t.hotline, value: site.company.phone, href: `tel:${site.company.phoneE164}` },
    ...(isRealUrl(site.fanpage.url)
      ? [
          {
            key: 'fanpage',
            label: t.fanpage,
            value: site.fanpage.label,
            href: site.fanpage.url,
            icon: <FacebookLogoIcon size={15} weight="fill" aria-hidden="true" className="shrink-0" />,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <dl className={cn('m-0 flex flex-col gap-3 rounded-xl bg-surface px-5 py-5 text-sm shadow-sm sm:gap-2 sm:px-6', className)}>
      {rows.map((row) => (
        <div key={row.key} className="grid grid-cols-1 gap-0.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-3">
          <dt className="text-ink/60">{row.label}</dt>
          <dd className="m-0 min-w-0">
            <a
              href={row.href}
              {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex max-w-full items-center gap-1.5 font-medium break-all text-link no-underline underline-offset-3 hover:text-accent-700 hover:underline"
            >
              {row.icon}
              {row.value}
              {row.external ? <span className="sr-only"> {t.newTab}</span> : null}
            </a>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Headquarters heading + address + company identifiers. */
export function HeadquartersInfo({ locale, t, className }: { locale: Locale; t: Dictionary; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <p className="kicker">{t.hq}</p>
      <h2 className="m-0 text-xl text-ink">{pick(site.company.hqCity, locale)}</h2>
      <address className="m-0 text-sm leading-relaxed text-ink/70 not-italic">
        <span className="block font-medium text-ink/85">{pick(site.company.legalName, locale)}</span>
        {pick(site.company.address, locale)}
        <span className="block text-subtle">
          {t.taxId}: {site.company.taxId}
        </span>
      </address>
    </div>
  );
}
