import { FacebookLogoIcon, TiktokLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { isRealUrl, site } from '@site/data/site';
import { getDictionary, href, pick, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import type { SocialPlatform } from '@site/lib/types';
import { Logo } from './Logo';

const socialIcons: Partial<Record<SocialPlatform, typeof FacebookLogoIcon>> = {
  facebook: FacebookLogoIcon,
  youtube: YoutubeLogoIcon,
  tiktok: TiktokLogoIcon,
};

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="m-0 text-sm leading-normal font-medium text-ink">{children}</dd>
    </div>
  );
}

/** Site footer (design v2) from mock company data in @site/data/site. */
export function Footer({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();
  const socials = site.socials.filter((s) => isRealUrl(s.url));
  const linkCls = 'text-ink no-underline hover:text-accent-700';
  const bizEmail = site.emails.biz;
  const supportEmail = site.emails.support;

  return (
    <footer className={cn('mt-auto bg-surface shadow-[0_-1px_0_var(--color-divider)]', className)}>
      <div className="container-site grid gap-10 pt-12 pb-8 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.5fr] lg:gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Logo href={href(locale, '/')} label={`${t.logoAlt} – ${t.home}`} size="footer" />
          <p className="m-0 max-w-xs text-sm leading-relaxed text-muted">{pick(site.description, locale)}</p>
          {socials.length ? (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-subtle">{t.followUs}</span>
              <ul className="flex gap-2" role="list">
                {socials.map((s) => {
                  const Icon = socialIcons[s.platform];
                  return (
                    <li key={s.platform}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.label} ${t.newTab}`}
                        className="grid size-10 place-items-center rounded-md bg-neutral-100 text-ink/75 transition-colors hover:bg-accent hover:text-white"
                      >
                        {Icon ? <Icon size={20} weight="fill" aria-hidden="true" /> : s.label.slice(0, 2)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Contacts */}
        <dl className="m-0 flex flex-col gap-5">
          <Item label={t.hq}>
            <address className="not-italic">{pick(site.company.address, locale)}</address>
          </Item>
          <Item label={t.bizContact}>
            <a href={`mailto:${bizEmail}`} className={linkCls}>
              {bizEmail}
            </a>
          </Item>
          {supportEmail !== bizEmail ? (
            <Item label={t.supContact}>
              <a href={`mailto:${supportEmail}`} className={linkCls}>
                {supportEmail}
              </a>
            </Item>
          ) : null}
          <Item label={t.hotline}>
            <a href={`tel:${site.company.phoneE164}`} className={linkCls}>
              {site.company.phone}
            </a>
          </Item>
        </dl>

        {/* Legal */}
        <div className="flex flex-col gap-3 text-[13px] leading-relaxed text-muted md:col-span-2 lg:col-span-1">
          <p className="m-0 text-sm font-medium text-ink">{pick(site.company.legalName, locale)}</p>
          <p className="m-0">
            {t.taxId}: {site.company.taxId}
          </p>
          {pick(site.legalLines, locale).map((line) => (
            <p key={line} className="m-0">
              {line}
            </p>
          ))}
          {site.contentOwner.trim() ? (
            <p className="m-0">
              {t.contentOwner}: {site.contentOwner.trim()}
            </p>
          ) : null}
          <p className="m-0 flex items-start gap-2 rounded-lg bg-accent-50 px-3 py-2.5 text-accent-800">
            <svg className="mt-0.5 size-4 shrink-0" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
              <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm40-88a8 8 0 0 1-8 8h-32a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h24a8 8 0 0 1 8 8Z" />
            </svg>
            <span>{pick(site.healthWarning, locale)}</span>
          </p>
        </div>
      </div>

      <div className="border-t border-divider">
        <div className="container-site flex flex-col-reverse gap-3 py-5 text-xs text-subtle md:flex-row md:items-center md:justify-between">
          <p className="m-0">
            © {year} {site.name}. {t.allRights}
          </p>
          <nav>
            <ul className="flex flex-wrap gap-x-5 gap-y-2" role="list">
              <li>
                <Link href={href(locale, '/games')} className="text-subtle no-underline hover:text-accent-700">
                  {t.games}
                </Link>
              </li>
              <li>
                <Link href={href(locale, '/news')} className="text-subtle no-underline hover:text-accent-700">
                  {t.news}
                </Link>
              </li>
              <li>
                <Link href={href(locale, '/contact')} className="text-subtle no-underline hover:text-accent-700">
                  {t.contact}
                </Link>
              </li>
              <li>
                <Link href={href(locale, '/terms')} className="text-subtle no-underline hover:text-accent-700">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link href={href(locale, '/privacy')} className="text-subtle no-underline hover:text-accent-700">
                  {t.privacy}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
