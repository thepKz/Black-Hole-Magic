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

const linkCls = 'text-ink no-underline hover:text-accent-700';
const subtleLinkCls = 'text-subtle no-underline hover:text-accent-700';

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="m-0 text-sm leading-normal font-medium text-ink">{children}</dd>
    </div>
  );
}

/**
 * Site footer (design v2): brand · contacts (HQ, partnership, support, hotline)
 * · legal lines; bottom bar © + Terms / Privacy. All values come from
 * @site/data/site - nothing is hard-coded here. No CMS link by design.
 */
export function Footer({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();
  const socials = site.socials.filter((s) => isRealUrl(s.url));
  const { biz, support } = site.emails;
  const contentOwner = site.contentOwner.trim();

  return (
    <footer className={cn('mt-auto bg-surface shadow-[0_-1px_0_var(--color-divider)]', className)}>
      <div className="container-site grid gap-10 pt-12 pb-8 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.35fr] lg:gap-12">
        {/* Brand */}
        <div className="flex flex-col items-start gap-5">
          <Logo href={href(locale, '/')} label={`${t.logoAlt} – ${t.home}`} size="footer" />
          {socials.length ? (
            <ul className="flex gap-2" role="list" aria-label={t.followUs}>
              {socials.map((s) => {
                const Icon = socialIcons[s.platform];
                return (
                  <li key={s.platform}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} ${t.newTab}`}
                      className={cn(
                        'relative isolate grid size-10 place-items-center overflow-hidden rounded-md bg-neutral-100 text-ink/75 hover:text-white',
                        'before:absolute before:inset-0 before:-z-10 before:bg-accent before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-100',
                      )}
                    >
                      {Icon ? <Icon size={20} weight="fill" aria-hidden="true" /> : s.label.slice(0, 2)}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        {/* Contacts */}
        <dl className="m-0 flex flex-col gap-5">
          <Item label={t.hq}>
            <address className="not-italic">{pick(site.company.address, locale)}</address>
          </Item>
          <Item label={support === biz ? t.bizSupportContact : t.bizContact}>
            <a href={`mailto:${biz}`} className={linkCls}>
              {biz}
            </a>
          </Item>
          {support !== biz ? (
            <Item label={t.supContact}>
              <a href={`mailto:${support}`} className={linkCls}>
                {support}
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
          <p className="m-0">{pick(site.healthWarning, locale)}</p>
          {pick(site.legalLines, locale).map((line) => (
            <p key={line} className="m-0">
              {line}
            </p>
          ))}
          {contentOwner ? (
            <p className="m-0">
              {t.contentOwner}: {contentOwner}
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-t border-divider">
        <div className="container-site flex flex-col-reverse gap-3 py-5 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">
            © {year} {site.name}. {t.allRights}
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2" role="list">
            <li>
              <Link href={href(locale, '/terms')} className={subtleLinkCls}>
                {t.terms}
              </Link>
            </li>
            <li>
              <Link href={href(locale, '/privacy')} className={subtleLinkCls}>
                {t.privacy}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
