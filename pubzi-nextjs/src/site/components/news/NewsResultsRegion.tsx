'use client';

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';

import { cn } from '@site/lib/cn';

export interface NewsResultsRegionProps {
  /** Identity of the rendered result set, e.g. `${cat}|${q}|${page}`. A new value = new results arrived. */
  stateKey: string;
  children: ReactNode;
  className?: string;
}

/**
 * Feedback for the server-rendered /news filters (category tabs, pagination).
 *
 * A click on a link inside a `[data-news-nav]` element marks the region pending
 * until the server sends the next result set (`stateKey` changes):
 *   - results (`[data-news-results]` descendants) dim to 55% opacity,
 *   - a thin accent bar at the top grows with transform: scaleX (CSS only),
 *   - aria-busy is set.
 * After the first navigation `data-navigated` is set, so the next keyed result
 * block fades in (@starting-style, see the page). The first paint never animates.
 *
 * One delegated click listener, no timers except a safety reset; nothing runs per frame.
 */
export function NewsResultsRegion({ stateKey, children, className }: NewsResultsRegionProps) {
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [navigated, setNavigated] = useState(false);
  // A new result set arrived (click, back/forward, search): clear pending
  // ("adjust state on prop change" pattern - no effect, no extra paint).
  const [shownKey, setShownKey] = useState(stateKey);
  if (shownKey !== stateKey) {
    setShownKey(stateKey);
    setPendingFrom(null);
  }
  // Pending only while the result set it started from is still on screen.
  const pending = pendingFrom !== null && pendingFrom === stateKey;

  // Safety net: a failed / cancelled navigation must not leave the list dimmed.
  useEffect(() => {
    if (!pending) return;
    const id = window.setTimeout(() => setPendingFrom(null), 8000);
    return () => window.clearTimeout(id);
  }, [pending]);

  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = e.target as Element | null;
    const link = target?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!link || !link.closest('[data-news-nav]')) return;
    if (link.target && link.target !== '_self') return;
    if (link.getAttribute('aria-current') === 'page') return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;
    setPendingFrom(stateKey);
    setNavigated(true);
  };

  return (
    <div
      onClickCapture={onClickCapture}
      data-pending={pending ? '' : undefined}
      data-navigated={navigated ? '' : undefined}
      aria-busy={pending || undefined}
      className={cn('group/news relative', className)}
    >
      {/* Progress hint: grows to 85% over ~2.4s while waiting, never reaches the end on its own. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-3 h-0.5 overflow-hidden rounded-full">
        {pending ? (
          <span className="block h-full origin-left scale-x-[0.85] rounded-full bg-accent transition-transform duration-[2400ms] ease-emphasized starting:scale-x-0" />
        ) : null}
      </span>
      {children}
    </div>
  );
}
