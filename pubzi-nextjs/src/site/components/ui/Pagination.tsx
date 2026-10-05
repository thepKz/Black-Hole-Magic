import Link from 'next/link';

import { format, getDictionary, type Locale } from '@site/i18n';
import { cn } from '@site/lib/cn';

export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

/** 1 … 4 5 6 … 12 (always first/last, one sibling on each side, no lone ellipsis). */
export function paginationRange(page: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const items: PaginationItem[] = [1];
  let start = Math.max(2, page - 1);
  let end = Math.min(totalPages - 1, page + 1);
  if (page <= 4) {
    start = 2;
    end = 5;
  } else if (page >= totalPages - 3) {
    start = totalPages - 4;
    end = totalPages - 1;
  }
  if (start > 2) items.push('ellipsis-start');
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push('ellipsis-end');
  items.push(totalPages);
  return items;
}

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/** URL of page `p`, preserving other params; page 1 drops the param (canonical). */
export function pageHref(pathname: string, searchParams: SearchParamsRecord | undefined, p: number, param = 'page') {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams ?? {})) {
    if (k === param || v === undefined) continue;
    if (Array.isArray(v)) v.forEach((x) => params.append(k, x));
    else if (v !== '') params.set(k, v);
  }
  if (p > 1) params.set(param, String(p));
  const qs = params.toString();
  return `${pathname}${qs ? `?${qs}` : ''}`;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** Locale-prefixed path of the list, e.g. '/vi/news'. */
  pathname: string;
  /** Current search params (from the page's `searchParams`), preserved on every link. */
  searchParams?: SearchParamsRecord;
  /** Default 'page'. */
  param?: string;
  locale: Locale;
  className?: string;
}

const itemBase =
  'inline-grid h-10 min-w-10 place-items-center rounded-md px-2 text-sm tabular-nums no-underline transition-colors duration-150';

function Arrow({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg className="size-4" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'prev' ? 'M160 208 80 128l80-80' : 'm96 48 80 80-80 80'} />
    </svg>
  );
}

/**
 * Numbered pagination: ‹ 1 2 3 … 8 › (desktop) and "Trang 2/8 ‹ ›" (mobile < 640).
 * Server component; links carry rel="prev"/"next". Renders nothing when totalPages <= 1.
 */
export function Pagination({ page, totalPages, pathname, searchParams, param = 'page', locale, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const t = getDictionary(locale);
  const current = Math.min(Math.max(1, page), totalPages);
  const hasPrev = current > 1;
  const hasNext = current < totalPages;
  const prevHref = hasPrev ? pageHref(pathname, searchParams, current - 1, param) : null;
  const nextHref = hasNext ? pageHref(pathname, searchParams, current + 1, param) : null;

  const arrow = (dir: 'prev' | 'next', target: string | null, extra?: string) => {
    const label = dir === 'prev' ? t.prevPage : t.nextPage;
    const cls = cn(itemBase, 'border border-divider bg-surface', extra);
    return target ? (
      <Link href={target} rel={dir} aria-label={label} className={cn(cls, 'text-ink hover:border-accent hover:text-accent-700')}>
        <Arrow dir={dir} />
      </Link>
    ) : (
      <span aria-disabled="true" aria-label={label} role="link" className={cn(cls, 'cursor-not-allowed text-ink/30')}>
        <Arrow dir={dir} />
      </span>
    );
  };

  return (
    <nav aria-label={t.paginationLabel} className={cn('flex items-center justify-center', className)}>
      {/* Mobile: compact */}
      <div className="flex items-center gap-3 sm:hidden">
        {arrow('prev', prevHref)}
        <span className="text-sm text-muted tabular-nums" aria-live="polite">
          {format(t.pageOf, { page: current, total: totalPages })}
        </span>
        {arrow('next', nextHref)}
      </div>

      {/* ≥ 640: numbered */}
      <ul className="hidden items-center gap-1.5 sm:flex" role="list">
        <li>{arrow('prev', prevHref)}</li>
        {paginationRange(current, totalPages).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              {item === current ? (
                <span
                  aria-current="page"
                  className={cn(itemBase, 'bg-accent font-medium text-white shadow-glow-accent')}
                >
                  {item}
                </span>
              ) : (
                <Link
                  href={pageHref(pathname, searchParams, item, param)}
                  aria-label={format(t.pageN, { page: item })}
                  rel={item === current - 1 ? 'prev' : item === current + 1 ? 'next' : undefined}
                  className={cn(itemBase, 'text-ink/75 hover:bg-neutral-100 hover:text-ink')}
                >
                  {item}
                </Link>
              )}
            </li>
          ) : (
            <li key={item} aria-hidden="true" className={cn(itemBase, 'min-w-6 px-0 text-subtle')}>
              …
            </li>
          ),
        )}
        <li>{arrow('next', nextHref)}</li>
      </ul>
    </nav>
  );
}
