'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, type CSSProperties, type MouseEvent } from 'react';

import { track } from '@site/components/analytics/track';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, format, localeNames, locales, switchLocalePath, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import { LocaleFlag } from './Flags';
import { useLocaleAlternatesOverride, type LocalePaths } from './LocaleAlternates';

export interface LangSwitcherProps {
  locale: Locale;
  labels: {
    /** t.langLabel "Ngôn ngữ" (group label) */
    label: string;
    /** t.langSwitchTo "Chuyển sang {lang}" (tooltip of the inactive option) */
    switchTo: string;
  };
  /** 'md' = header (compact, design v2); 'lg' = mobile drawer (full width, 44px targets). */
  size?: 'md' | 'lg';
  /** Static override of target paths (locale-prefixed). <LocaleAlternates> in a page wins over this. */
  alternates?: LocalePaths;
  /** Called after a switch is triggered (e.g. close the drawer). */
  onSwitch?: () => void;
  className?: string;
}

function persistLocale(locale: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
  } catch {
    /* ignore */
  }
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" aria-hidden="true" focusable="false">
      <circle cx="128" cy="128" r="96" />
      <path d="M32 128h192M128 32c-28 30-28 162 0 192M128 32c28 30 28 162 0 192" />
    </svg>
  );
}

/**
 * Language switcher - segmented control from design v2:
 * [globe | flag VI | flag EN]. Each option is a real `<a hreflang>` to the same
 * page in the other language (crawlable, works without JS). With JS it keeps the
 * current query + hash, writes the NEXT_LOCALE cookie and navigates client-side.
 * Per-page targets (news article translations) come from <LocaleAlternates>.
 */
export function LangSwitcher({ locale, labels, size = 'md', alternates, onSwitch, className }: LangSwitcherProps) {
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();
  const override = useLocaleAlternatesOverride();
  const lg = size === 'lg';
  // The indicator slides to the clicked option at once (instant feedback) while
  // the other-language page loads; the new page then renders with it in place.
  const [pending, setPending] = useState<Locale | null>(null);
  const [seenLocale, setSeenLocale] = useState(locale);
  if (seenLocale !== locale) {
    // Locale changed (switch done, or back/forward): drop the optimistic state.
    setSeenLocale(locale);
    setPending(null);
  }
  const shown = pending ?? locale;
  const shownIndex = Math.max(0, locales.indexOf(shown));

  const targetFor = (to: Locale, withQuery: boolean) => {
    const explicit = override?.[to] ?? alternates?.[to];
    if (explicit) return explicit;
    const suffix = withQuery && typeof window !== 'undefined' ? window.location.search + window.location.hash : '';
    return switchLocalePath(pathname + suffix, to);
  };

  const go = (e: MouseEvent<HTMLAnchorElement>, to: Locale) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // let the browser open new tabs
    e.preventDefault();
    persistLocale(to);
    onSwitch?.();
    if (to === locale) return;
    setPending(to);
    track('lang_switch', { from: locale, to });
    router.push(targetFor(to, true));
  };

  return (
    <div
      role="group"
      aria-label={labels.label}
      className={cn(
        'items-stretch overflow-hidden rounded-md border border-divider bg-surface',
        lg ? 'flex h-11 w-full' : 'inline-flex h-8',
        className,
      )}
    >
      <span className={cn('flex items-center text-ink/60', lg ? 'pr-2 pl-3.5' : 'pr-1.5 pl-2.5')}>
        <GlobeIcon className={lg ? 'size-[18px]' : 'size-[15px]'} />
      </span>
      <div
        className="seg-track grid flex-1 grid-cols-[repeat(var(--seg-n),minmax(0,1fr))]"
        style={{ '--seg-n': locales.length, '--seg-i': shownIndex } as CSSProperties}
      >
        <span aria-hidden="true" className="seg-indicator bg-accent-100" />
        {locales.map((l) => {
          const active = l === locale;
          const lit = l === shown;
          return (
            <a
              key={l}
              href={targetFor(l, false)}
              hrefLang={l}
              lang={l}
              aria-label={localeNames[l]}
              aria-current={active ? 'true' : undefined}
              title={active ? undefined : format(labels.switchTo, { lang: localeNames[l] })}
              onClick={(e) => go(e, l)}
              className={cn(
                'fx flex items-center justify-center gap-1.5 tracking-[0.06em] no-underline',
                'focus-visible:-outline-offset-2',
                lg ? 'text-sm' : 'px-2.5 text-xs',
                lit ? 'font-medium text-accent-900 hover:text-accent-900' : 'text-ink/60 hover:text-ink',
              )}
            >
              <LocaleFlag locale={l} size="sm" />
              <span aria-hidden="true">{l.toUpperCase()}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
