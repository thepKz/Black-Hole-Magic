import { mainNav, site } from '@site/data/site';
import { getDictionary, href, pick, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import { LangSwitcher } from './LangSwitcher';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NavLinks, type NavItem } from './NavLinks';

export interface HeaderProps {
  locale: Locale;
  /** Show the cyan "new posts" dot on Tin tức. */
  newsDot?: boolean;
  className?: string;
}

/** Build the header nav (design v2 order): Trang chủ · Game · Nạp ↗ · Tin tức · Liên hệ. */
export function buildNavItems(locale: Locale, newsDot = false): NavItem[] {
  const t = getDictionary(locale);
  const labels = { home: t.home, games: t.games, topup: t.topup, news: t.news, contact: t.contactTab } as const;
  return mainNav.map((n) =>
    n.external
      ? { key: n.key, label: labels[n.key], href: n.path, external: true, trackTarget: n.key }
      : { key: n.key, label: labels[n.key], href: href(locale, n.path), dot: n.key === 'news' && newsDot },
  );
}

/**
 * Sticky site header (72px / 60px mobile), white 90% + blur (design v2).
 * `.site-header` fades in a soft drop shadow once the page scrolls (site.css).
 * ≥1024: logo · inline nav · VI/EN segmented control.
 * 768–1023: logo · segmented control · hamburger. <768: logo · hamburger
 * (the drawer carries the same language control).
 * No account buttons and no CMS link by design.
 */
export function Header({ locale, newsDot = false, className }: HeaderProps) {
  const t = getDictionary(locale);
  const items = buildNavItems(locale, newsDot);
  const homeHref = href(locale, '/');
  const langLabels = { label: t.langLabel, switchTo: t.langSwitchTo };

  return (
    <header
      className={cn(
        'site-header sticky top-0 z-40 h-[var(--header-h)] shrink-0 bg-surface/90 shadow-[0_1px_0_var(--color-divider)] backdrop-blur-md backdrop-saturate-150',
        className,
      )}
    >
      <div className="container-site flex h-full items-center gap-3 lg:gap-6">
        <Logo href={homeHref} label={`${t.logoAlt} – ${t.home}`} className="mr-auto lg:mr-3" />

        <nav aria-label={t.mainNav} className="hidden flex-1 lg:block">
          <NavLinks items={items} homeHref={homeHref} newTabLabel={t.newTab} dotLabel={t.hasNewPosts} />
        </nav>

        <div className="flex items-center gap-2">
          {/* Wrapper owns visibility: the switcher sets its own display. */}
          <div className="hidden md:flex">
            <LangSwitcher locale={locale} labels={langLabels} />
          </div>
          <MobileMenu
            className="lg:hidden"
            locale={locale}
            items={items}
            homeHref={homeHref}
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
