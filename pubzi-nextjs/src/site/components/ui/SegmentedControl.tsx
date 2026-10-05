'use client';

import Link from 'next/link';

import { cn } from '@site/lib/cn';

export interface SegmentOption {
  value: string;
  label: string;
  /** Link mode: when EVERY option has `href`, renders a <nav> of links (server-side filters, crawlable). */
  href?: string;
  count?: number;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  /** Button mode callback (client-side state). Ignored in link mode. */
  onChange?: (value: string) => void;
  /** Accessible name of the group, e.g. "Danh mục". */
  label: string;
  className?: string;
  /** Called on link click in link mode (analytics). */
  onNavigate?: (value: string) => void;
}

/**
 * Segmented tabs ("Tất cả / Tin game / Sự kiện / Thông báo").
 * Scrolls horizontally on narrow screens instead of wrapping.
 */
export function SegmentedControl({ options, value, onChange, label, className, onNavigate }: SegmentedControlProps) {
  const linkMode = options.length > 0 && options.every((o) => typeof o.href === 'string');

  // Design v2 `.seg`: flat bordered strip; active = accent-100 fill + accent-900 text.
  // The active fill is ::after (opacity fades in), hover wash is `.fx` ::before.
  const optionClass = (active: boolean) =>
    cn(
      'fx inline-flex h-9 shrink-0 items-center gap-1.5 px-3.5 text-[13px] leading-none whitespace-nowrap no-underline select-none',
      'focus-visible:-outline-offset-2',
      'after:absolute after:inset-0 after:-z-10 after:bg-accent-100 after:transition-opacity after:duration-(--dur-2) after:content-[""]',
      active
        ? 'font-medium text-accent-900 after:opacity-100 hover:text-accent-900'
        : 'text-ink/70 after:opacity-0 hover:text-ink',
    );

  const countEl = (o: SegmentOption, active: boolean) =>
    typeof o.count === 'number' ? (
      <span className={cn('tabular-nums', active ? 'text-accent-900/60' : 'text-subtle')}>{o.count}</span>
    ) : null;

  const shell = cn(
    'scrollbar-none -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:max-w-full sm:px-0',
    className,
  );
  const track =
    'inline-flex min-w-max items-stretch overflow-hidden rounded-md border border-divider bg-surface';

  if (linkMode) {
    return (
      <nav aria-label={label} className={shell}>
        <ul className={track} role="list">
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value} className="flex">
                <Link
                  href={o.href!}
                  scroll={false}
                  aria-current={active ? 'page' : undefined}
                  className={optionClass(active)}
                  onClick={() => onNavigate?.(o.value)}
                >
                  {o.label}
                  {countEl(o, active)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <div className={shell}>
      <div role="group" aria-label={label} className={track}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              className={optionClass(active)}
              onClick={() => onChange?.(o.value)}
            >
              {o.label}
              {countEl(o, active)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
