import Link from 'next/link';

import { cn } from '@site/lib/cn';

export interface BreadcrumbItem {
  label: string;
  /** Locale-prefixed path. Omit for the current page (last item). */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** nav aria-label, e.g. t.breadcrumb. */
  label: string;
  className?: string;
}

/**
 * Visual breadcrumb. Last item gets aria-current="page".
 * Pair with `breadcrumbList()` JSON-LD from @site/lib/seo for rich results.
 */
export function Breadcrumb({ items, label, className }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={cn('min-w-0 text-[13px]', className)}>
      <ol className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-subtle" role="list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className={cn('flex min-w-0 items-center gap-1.5', last && 'flex-1')}>
              {item.href && !last ? (
                <Link href={item.href} className="text-subtle no-underline hover:text-accent-700">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cn(last && 'line-clamp-1 text-ink/80')}>
                  {item.label}
                </span>
              )}
              {!last ? (
                <svg className="size-3 shrink-0 text-neutral-400" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m96 48 80 80-80 80" />
                </svg>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
