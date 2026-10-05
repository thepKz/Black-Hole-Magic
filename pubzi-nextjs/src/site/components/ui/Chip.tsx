import Link from 'next/link';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cn } from '@site/lib/cn';

interface ChipBase {
  label: ReactNode;
  /** Count badge ("MMO 3"). */
  count?: number;
  selected?: boolean;
  className?: string;
}

export type ChipButtonProps = ChipBase &
  Omit<ComponentPropsWithRef<'button'>, keyof ChipBase | 'children'> & { href?: undefined };

export type ChipLinkProps = ChipBase & {
  /** Link mode (server-side filters): selected -> aria-current="true". */
  href: string;
  scroll?: boolean;
  replace?: boolean;
  onClick?: ComponentPropsWithRef<'a'>['onClick'];
};

export type ChipProps = ChipButtonProps | ChipLinkProps;

/**
 * Design v2 genre chip: 13px, 8px radius, divider border; selected = accent
 * border + accent 14% wash + accent-700 text. Hover wash / press via `.fx`.
 */
export function chipClasses(selected: boolean | undefined, className?: string) {
  return cn(
    'fx inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-[13px] leading-none whitespace-nowrap no-underline select-none',
    selected
      ? 'border-accent bg-accent/14 font-medium text-accent-700 hover:text-accent-700'
      : 'border-divider bg-transparent text-ink hover:border-neutral-400 hover:text-ink',
    className,
  );
}

/** Filter chip with optional count. Button mode uses aria-pressed; link mode uses aria-current. */
export function Chip(props: ChipProps) {
  const { label, count, selected, className } = props;
  const inner = (
    <>
      <span>{label}</span>
      {typeof count === 'number' ? (
        <span className={cn('tabular-nums', selected ? 'text-accent-700/70' : 'text-subtle')}>{count}</span>
      ) : null}
    </>
  );

  if (typeof props.href === 'string') {
    return (
      <Link
        href={props.href}
        scroll={props.scroll ?? false}
        replace={props.replace}
        onClick={props.onClick}
        aria-current={selected ? 'true' : undefined}
        className={chipClasses(selected, className)}
      >
        {inner}
      </Link>
    );
  }

  const { label: _l, count: _c, selected: _s, className: _cn, href: _h, type = 'button', ...rest } = props; // eslint-disable-line @typescript-eslint/no-unused-vars
  return (
    <button {...rest} type={type} aria-pressed={!!selected} className={chipClasses(selected, className)}>
      {inner}
    </button>
  );
}
