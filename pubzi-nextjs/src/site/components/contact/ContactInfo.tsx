import {
  ArrowSquareOutIcon,
  EnvelopeSimpleIcon,
  FacebookLogoIcon,
  HeadsetIcon,
  NewspaperIcon,
  PhoneIcon,
} from '@phosphor-icons/react/ssr';
import type { ReactNode } from 'react';

import { isRealUrl, site } from '@site/data/site';
import { pick, type Dictionary } from '@site/i18n';
import { cn } from '@site/lib/cn';
import type { Locale } from '@site/lib/types';

interface Row {
  key: string;
  label: string;
  icon: ReactNode;
  value: string;
  href: string;
  external?: boolean;
}

const iconProps = { size: 18, weight: 'regular' as const, 'aria-hidden': true };

/** Contact channels card (design v2: label column 150px + value). */
export function ContactInfoCard({ t, className }: { t: Dictionary; className?: string }) {
  const fanpage = site.socials.find((s) => s.platform === 'facebook');
  // Same de-duplication rule as the Footer: one row when biz and support share an address.
  const mergedSupport = site.emails.support === site.emails.biz;
  const rows: Row[] = [
    {
      key: 'biz',
      label: mergedSupport ? t.bizSupportContact : t.bizContact,
      icon: <EnvelopeSimpleIcon {...iconProps} />,
      value: site.emails.biz,
      href: `mailto:${site.emails.biz}`,
    },
    ...(!mergedSupport
      ? [{ key: 'support', label: t.supContact, icon: <HeadsetIcon {...iconProps} />, value: site.emails.support, href: `mailto:${site.emails.support}` }]
      : []),
    ...(site.emails.press !== site.emails.biz
      ? [{ key: 'press', label: t.pressContact, icon: <NewspaperIcon {...iconProps} />, value: site.emails.press, href: `mailto:${site.emails.press}` }]
      : []),
    { key: 'hotline', label: t.hotline, icon: <PhoneIcon {...iconProps} />, value: site.company.phone, href: `tel:${site.company.phoneE164}` },
    ...(fanpage && isRealUrl(fanpage.url)
      ? [
          {
            key: 'fanpage',
            label: t.fanpage,
            icon: <FacebookLogoIcon {...iconProps} />,
            value: fanpage.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
            href: fanpage.url,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <dl className={cn('m-0 flex flex-col rounded-xl bg-surface px-5 py-2 text-sm shadow-sm sm:px-6', className)}>
      {rows.map((row, i) => (
        <div
          key={row.key}
          className={cn(
            'grid grid-cols-1 gap-1 py-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center sm:gap-3',
            i > 0 && 'border-t border-divider/70',
          )}
        >
          <dt className="flex items-center gap-2 text-muted">
            <span className="text-accent-600">{row.icon}</span>
            {row.label}
          </dt>
          <dd className="m-0 min-w-0 pl-[26px] sm:pl-0">
            <a
              href={row.href}
              {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex max-w-full items-center gap-1.5 font-medium break-all text-ink no-underline hover:text-accent-700"
            >
              {row.value}
              {row.external ? (
                <>
                  <ArrowSquareOutIcon size={13} aria-hidden="true" className="shrink-0 text-subtle" />
                  <span className="sr-only"> {t.newTab}</span>
                </>
              ) : null}
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
      <p className="m-0 text-[11px] font-medium tracking-[0.12em] text-accent-600 uppercase">{t.hq}</p>
      <h2 className="m-0 text-xl text-ink">{site.company.postal.region}</h2>
      <address className="m-0 text-sm leading-relaxed text-muted not-italic">
        <span className="block font-medium text-ink/85">{pick(site.company.legalName, locale)}</span>
        {pick(site.company.address, locale)}
        <span className="block text-subtle">
          {t.taxId}: {site.company.taxId}
        </span>
      </address>
    </div>
  );
}
