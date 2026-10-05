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

  const optionClass = (active: boolean) =>
    cn(
      'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3.5 text-[13px] whitespace-nowrap no-underline',
      'transition-[background-color,color,box-shadow] duration-150',
      active
        ? 'bg-accent text-white shadow-glow-accent hover:text-white'
        : 'text-ink/70 hover:bg-neutral-100 hover:text-ink',
    );

  const countEl = (o: SegmentOption, active: boolean) =>
    typeof o.count === 'number' ? (
      <span className={cn('tabular-nums', active ? 'text-white/75' : 'text-subtle')}>{o.count}</span>
    ) : null;

  const shell = cn(
    'scrollbar-none -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:max-w-full sm:px-0',
    className,
  );
  const track = 'inline-flex min-w-max items-center gap-1 rounded-lg border border-divider bg-surface p-1';

  if (linkMode) {
    return (
      <nav aria-label={label} className={shell}>
        <ul className={track} role="list">
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value}>
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
