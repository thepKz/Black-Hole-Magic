'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { track } from '@site/components/analytics/track';

import { cn } from '@site/lib/cn';

export interface NavItem {
  key: string;
  label: string;
  /** Locale-prefixed path or absolute URL. */
  href: string;
  /** Opens in a new tab + ↗ icon (Trang ID top-up). */
  external?: boolean;
  /** Cyan "new posts" dot (screen-reader text = dotLabel). */
  dot?: boolean;
  /** Fires track('outbound_click', { target: trackTarget }) on click (external items). */
  trackTarget?: string;
}

/** True when `href` is the current section (home matches exactly). */
export function isActivePath(pathname: string, href: string, homeHref: string) {
  if (href === homeHref) return pathname === homeHref || pathname === `${homeHref}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-3', className)} viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M64 192 192 64M88 64h104v104" />
    </svg>
  );
}

export interface NavLinksProps {
  items: NavItem[];
  /** '/vi' or '/en'. */
  homeHref: string;
  newTabLabel: string;
  dotLabel: string;
  variant?: 'bar' | 'drawer';
  onNavigate?: () => void;
  className?: string;
}

/** Primary navigation links with active state (aria-current="page"). */
export function NavLinks({ items, homeHref, newTabLabel, dotLabel, variant = 'bar', onNavigate, className }: NavLinksProps) {
  const pathname = usePathname() || homeHref;
  const drawer = variant === 'drawer';

  return (
    <ul className={cn(drawer ? 'flex flex-col gap-1' : 'flex items-center gap-1', className)} role="list">
      {items.map((item) => {
        const active = !item.external && isActivePath(pathname, item.href, homeHref);
        const cls = cn(
          'group flex items-center gap-1.5 rounded-md no-underline transition-colors duration-150',
          drawer ? 'h-12 px-4 text-base' : 'h-10 px-3 text-sm',
          active
            ? 'bg-accent/14 font-medium text-accent-700 hover:text-accent-700'
            : 'text-ink/70 hover:bg-ink/7 hover:text-ink',
        );
        const label = (
          <span className="relative">
            {item.label}
            {item.dot ? (
              <>
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-2.5 size-[7px] rounded-full bg-cyan shadow-[0_0_0_2px_var(--color-surface),0_0_8px_var(--color-cyan)]"
                />
                <span className="sr-only"> ({dotLabel})</span>
              </>
            ) : null}
          </span>
        );

        return (
          <li key={item.key}>
            {item.external ? (
              <a
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={cls}
                onClick={() => {
                  if (item.trackTarget) track('outbound_click', { target: item.trackTarget, url: item.href });
                  onNavigate?.();
                }}
              >
                {label}
                <ExternalIcon className="opacity-70 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
                {item.href.startsWith('http') ? <span className="sr-only"> {newTabLabel}</span> : null}
              </a>
            ) : (
              <Link href={item.href} aria-current={active ? 'page' : undefined} className={cls} onClick={onNavigate}>
                {label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
