'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';

import { track } from '@site/components/analytics/track';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, format, localeNames, locales, switchLocalePath, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import { LocaleFlag } from './Flags';
import { useLocaleAlternatesOverride, type LocalePaths } from './LocaleAlternates';

export interface LangSwitcherProps {
  locale: Locale;
  labels: {
    /** t.langLabel "Ngôn ngữ" */
    label: string;
    /** t.langSwitchTo "Chuyển sang {lang}" */
    switchTo: string;
  };
  /** 'dropdown' (header, Funtap style) or 'buttons' (mobile drawer: two flag buttons). */
  variant?: 'dropdown' | 'buttons';
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

/**
 * Language switcher: flag + native name + caret, keyboard-accessible menu.
 * Keeps the current path + query (+ hash), writes the NEXT_LOCALE cookie,
 * and renders real <a hreflang> links so crawlers see the alternates.
 */
export function LangSwitcher({ locale, labels, variant = 'dropdown', alternates, onSwitch, className }: LangSwitcherProps) {
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();
  const override = useLocaleAlternatesOverride();

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
    track('lang_switch', { from: locale, to });
    router.push(targetFor(to, true));
  };

  if (variant === 'buttons') {
    return (
      <div role="group" aria-label={labels.label} className={cn('grid grid-cols-2 gap-2', className)}>
        {locales.map((l) => {
          const active = l === locale;
          return (
            <a
              key={l}
              href={targetFor(l, false)}
              hrefLang={l}
              lang={l}
              aria-current={active ? 'true' : undefined}
              aria-label={active ? localeNames[l] : format(labels.switchTo, { lang: localeNames[l] })}
              onClick={(e) => go(e, l)}
              className={cn(
                'flex h-11 items-center justify-center gap-2.5 rounded-md border text-sm no-underline transition-colors',
                active
                  ? 'border-accent bg-accent-50 font-medium text-accent-800 hover:text-accent-800'
                  : 'border-divider bg-surface text-ink/80 hover:border-neutral-400 hover:text-ink',
              )}
            >
              <LocaleFlag locale={l} />
              {localeNames[l]}
            </a>
          );
        })}
      </div>
    );
  }

  return <LangDropdown locale={locale} labels={labels} targetFor={targetFor} go={go} className={className} />;
}

function LangDropdown({
  locale,
  labels,
  targetFor,
  go,
  className,
}: {
  locale: Locale;
  labels: LangSwitcherProps['labels'];
  targetFor: (to: Locale, withQuery: boolean) => string;
  go: (e: MouseEvent<HTMLAnchorElement>, to: Locale) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const focusIndex = useRef(0);

  const items = () => Array.from(wrapRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? []);

  useEffect(() => {
    if (!open) return;
    items()[focusIndex.current]?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const openAt = (index: number) => {
    focusIndex.current = index;
    setOpen(true);
  };

  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openAt(Math.max(0, locales.indexOf(locale)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openAt(locales.length - 1);
    }
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLElement);
    const focus = (n: number) => list[(n + list.length) % list.length]?.focus();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focus(i + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focus(i - 1);
        break;
      case 'Home':
        e.preventDefault();
        focus(0);
        break;
      case 'End':
        e.preventDefault();
        focus(list.length - 1);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${labels.label}: ${localeNames[locale]}`}
        onClick={() => (open ? setOpen(false) : openAt(Math.max(0, locales.indexOf(locale))))}
        onKeyDown={onTriggerKey}
        className={cn(
          'flex h-10 items-center gap-2 rounded-md border border-transparent px-2.5 text-sm text-ink/80 transition-colors',
          'hover:bg-ink/7 hover:text-ink',
          open && 'bg-ink/7 text-ink',
        )}
      >
        <LocaleFlag locale={locale} />
        <span className="hidden xl:inline">{localeNames[locale]}</span>
        <span className="xl:hidden">{locale.toUpperCase()}</span>
        <svg
          className={cn('size-3 text-subtle transition-transform duration-200', open && 'rotate-180')}
          viewBox="0 0 256 256"
          fill="none"
          stroke="currentColor"
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M64 96l64 64 64-64" />
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={labels.label}
          onKeyDown={onMenuKey}
          className="absolute top-[calc(100%+8px)] right-0 z-50 min-w-[184px] rounded-lg border border-divider bg-surface p-1 shadow-lg"
        >
          {locales.map((l) => {
            const active = l === locale;
            return (
              <a
                key={l}
                role="menuitemradio"
                aria-checked={active}
                tabIndex={-1}
                href={targetFor(l, false)}
                hrefLang={l}
                lang={l}
                onClick={(e) => {
                  setOpen(false);
                  go(e, l);
                }}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm no-underline outline-none',
                  'focus:bg-accent-50 focus-visible:outline-none',
                  active ? 'font-medium text-accent-800 hover:text-accent-800' : 'text-ink/80 hover:bg-neutral-50 hover:text-ink',
                )}
              >
                <LocaleFlag locale={l} />
                <span className="flex-1">{localeNames[l]}</span>
                {active ? (
                  <svg className="size-4 text-accent" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M40 136l56 56L216 72" />
                  </svg>
                ) : null}
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
