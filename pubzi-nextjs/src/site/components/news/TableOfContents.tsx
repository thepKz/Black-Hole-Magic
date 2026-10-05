'use client';

import { CaretDownIcon, ListBulletsIcon } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@site/lib/cn';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface TableOfContentsProps {
  items: TocItem[];
  label: string;
  /**
   * 'sidebar'     - sticky list next to the article (desktop), highlights the
   *                 section in view.
   * 'collapsible' - <details> above the body (mobile / tablet); closes after a jump.
   */
  variant: 'sidebar' | 'collapsible';
  className?: string;
}

/** Tracks which heading is currently at the top of the viewport. */
function useActiveHeading(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled || !ids.length || typeof IntersectionObserver === 'undefined') return;
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const firstVisible = ids.find((id) => visible.get(id));
        if (firstVisible) {
          setActive(firstVisible);
          return;
        }
        // Nothing in the band: keep the last heading above the viewport.
        const above = els.filter((el) => el.getBoundingClientRect().top < 120);
        setActive(above.length ? above[above.length - 1].id : null);
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: [0, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, enabled]);
  return active;
}

function TocList({ items, active, onNavigate }: { items: TocItem[]; active: string | null; onNavigate?: () => void }) {
  return (
    <ol role="list" className="m-0 flex list-none flex-col gap-0.5 p-0">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <li key={item.id} className={cn(item.level === 3 && 'pl-3.5')}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                'block border-l-2 py-1.5 pr-1 pl-3 text-[13px] leading-snug no-underline transition-colors duration-150',
                isActive
                  ? 'border-accent font-medium text-accent-700'
                  : 'border-divider text-muted hover:border-accent-300 hover:text-ink',
              )}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** Auto table of contents (rendered by the article page when it has >= 3 h2). */
export function TableOfContents({ items, label, variant, className }: TableOfContentsProps) {
  const idKey = items.map((i) => i.id).join('|');
  const ids = useMemo(() => (idKey ? idKey.split('|') : []), [idKey]);
  const active = useActiveHeading(ids, variant === 'sidebar');
  const detailsRef = useRef<HTMLDetailsElement>(null);

  if (variant === 'collapsible') {
    return (
      <details ref={detailsRef} className={cn('group rounded-xl border border-divider bg-surface', className)}>
        <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-3 text-sm font-medium text-ink select-none [&::-webkit-details-marker]:hidden">
          <ListBulletsIcon className="size-[18px] text-accent" aria-hidden="true" weight="bold" />
          {label}
          <span className="ml-1 text-xs font-normal text-subtle tabular-nums">({items.length})</span>
          <CaretDownIcon
            className="ml-auto size-4 text-subtle transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
            weight="bold"
          />
        </summary>
        <nav aria-label={label} className="border-t border-divider px-3 py-3">
          <TocList
            items={items}
            active={null}
            onNavigate={() => {
              if (detailsRef.current) detailsRef.current.open = false;
            }}
          />
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label={label} className={className}>
      <p className="m-0 mb-3 flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] text-accent-600 uppercase">
        <ListBulletsIcon className="size-4" aria-hidden="true" weight="bold" />
        {label}
      </p>
      <TocList items={items} active={active} />
    </nav>
  );
}
