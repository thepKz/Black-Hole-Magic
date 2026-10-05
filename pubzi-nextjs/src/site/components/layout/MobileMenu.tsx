'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react';

import type { Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';
import { LangSwitcher, type LangSwitcherProps } from './LangSwitcher';
import { NavLinks, type NavItem } from './NavLinks';

export interface MobileMenuProps {
  locale: Locale;
  items: NavItem[];
  homeHref: string;
  labels: {
    open: string;
    close: string;
    nav: string;
    newTab: string;
    dot: string;
    lang: LangSwitcherProps['labels'];
    healthWarning: string;
  };
  className?: string;
}

/**
 * Hamburger + right drawer (< 1024px). Uses a modal <dialog>: focus is trapped,
 * Esc closes, background is inert. Closes on navigation and backdrop click.
 */
export function MobileMenu({ locale, items, homeHref, labels, className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const dialogId = useId();

  const close = useCallback(() => setOpen(false), []);

  // Sync state -> <dialog>.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    const root = document.documentElement;
    root.style.overflow = open ? 'hidden' : '';
    return () => {
      root.style.overflow = '';
    };
  }, [open]);

  // Close on route change (state adjusted during render, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // Close when resized to desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mq.matches && close();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [close]);

  return (
    <div className={className}>
      <button
        type="button"
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls={dialogId}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="fx grid size-10 place-items-center rounded-md text-ink"
      >
        <svg className="size-6" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" aria-hidden="true">
          <path d="M40 72h176M40 128h176M40 184h176" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label={labels.nav}
        onClose={close}
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close(); // backdrop
        }}
        className={cn(
          'fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(360px,88vw)] max-w-none bg-surface p-0 text-ink shadow-lg',
          // `.drawer` (site.css): slide in 320ms emphasized / out 200ms, backdrop fade, item stagger.
          'drawer',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-divider px-4">
            <span className="text-[15px] font-medium tracking-[0.04em]">BLACK HOLE</span>
            <button
              type="button"
              aria-label={labels.close}
              onClick={close}
              className="fx grid size-10 place-items-center rounded-md text-ink"
              autoFocus
            >
              <svg className="size-5" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="round" aria-hidden="true">
                <path d="M200 56 56 200M56 56l144 144" />
              </svg>
            </button>
          </div>

          <nav aria-label={labels.nav} className="flex-1 overflow-y-auto px-3 py-4">
            <NavLinks items={items} homeHref={homeHref} newTabLabel={labels.newTab} dotLabel={labels.dot} variant="drawer" onNavigate={close} />
          </nav>

          <div
            className="drawer-item flex shrink-0 flex-col gap-4 border-t border-divider px-4 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]"
            style={{ '--i': items.length } as CSSProperties}
          >
            <LangSwitcher locale={locale} labels={labels.lang} size="lg" onSwitch={close} />
            <p className="m-0 text-center text-xs leading-snug text-subtle">{labels.healthWarning}</p>
          </div>
        </div>
      </dialog>
    </div>
  );
}
