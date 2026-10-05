import { isRealUrl, mainNav, site } from '@site/data/site';
import { getDictionary, href, pick, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import { LangSwitcher } from './LangSwitcher';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NavLinks, type NavItem } from './NavLinks';
import { TrackedLinkButton } from './TrackedLinkButton';

export interface HeaderProps {
  locale: Locale;
  /** Show the cyan "new posts" dot on Tin tức. */
  newsDot?: boolean;
  className?: string;
}

/** Build the header nav: Trang chủ · Game · Tin tức · Nạp ↗ · Liên hệ. */
export function buildNavItems(locale: Locale, newsDot = false): NavItem[] {
  const t = getDictionary(locale);
  const labels = { home: t.home, games: t.games, news: t.news, contact: t.contactTab } as const;
  const items: NavItem[] = mainNav.map((n) => ({
    key: n.key,
    label: labels[n.key],
    href: href(locale, n.path),
    dot: n.key === 'news' && newsDot,
  }));
  // Trang ID top-up: hidden while its URL is still the '#' placeholder
  // (NEXT_PUBLIC_ID_TOPUP_URL empty) instead of a dead link with an external arrow.
  if (isRealUrl(site.id.topupUrl)) {
    const topup: NavItem = {
      key: 'topup',
      label: t.topup,
      href: site.id.topupUrl,
      external: true,
      trackTarget: 'trang_id_topup',
    };
    const contactIndex = items.findIndex((i) => i.key === 'contact');
    items.splice(contactIndex === -1 ? items.length : contactIndex, 0, topup);
  }
  return items;
}

/**
 * Sticky site header (72px / 60px mobile), white 90% + blur.
 * ≥1024: inline nav + language dropdown + Đăng nhập. <1024: hamburger drawer
 * (language + login stay visible from 768).
 */
export function Header({ locale, newsDot = false, className }: HeaderProps) {
  const t = getDictionary(locale);
  const items = buildNavItems(locale, newsDot);
  const homeHref = href(locale, '/');
  const loginHref = site.id.loginUrl;
  // '#' placeholder (NEXT_PUBLIC_ID_LOGIN_URL empty) -> non-interactive <span aria-disabled>.
  const loginReady = isRealUrl(loginHref);
  const langLabels = { label: t.langLabel, switchTo: t.langSwitchTo };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-[var(--header-h)] shrink-0 bg-surface/90 shadow-[0_1px_0_var(--color-divider)] backdrop-blur-md backdrop-saturate-150',
        className,
      )}
    >
      <div className="container-site flex h-full items-center gap-3 lg:gap-6">
        <Logo href={homeHref} label={`${t.logoAlt} – ${t.home}`} className="mr-auto lg:mr-3" />

        <nav aria-label={t.mainNav} className="hidden flex-1 lg:block">
          <NavLinks items={items} homeHref={homeHref} newTabLabel={t.newTab} dotLabel={t.hasNewPosts} />
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          <LangSwitcher locale={locale} labels={langLabels} className="hidden md:block" />
          <TrackedLinkButton
            href={loginHref}
            external={loginReady}
            disabled={!loginReady}
            trackTarget="trang_id_login"
            newTabLabel={t.newTab}
            variant="primary"
            size="md"
            className="hidden md:inline-flex"
          >
            {t.login}
          </TrackedLinkButton>
          <MobileMenu
            className="lg:hidden"
            locale={locale}
            items={items}
            homeHref={homeHref}
            login={{ href: loginHref, label: t.login, disabled: !loginReady, trackTarget: 'trang_id_login' }}
            labels={{
              open: t.menuOpen,
              close: t.menuClose,
              nav: t.mainNav,
              newTab: t.newTab,
              dot: t.hasNewPosts,
              lang: langLabels,
              healthWarning: pick(site.healthWarning, locale),
            }}
          />
        </div>
      </div>
    </header>
  );
}
