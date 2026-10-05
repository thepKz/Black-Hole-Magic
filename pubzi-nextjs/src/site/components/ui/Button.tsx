import Link from 'next/link';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cn } from '@site/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Square icon button (give it an `aria-label`). */
  iconOnly?: boolean;
  /** Full width. */
  block?: boolean;
}

// `.fx` (site.css): hover wash on ::before (opacity only) + press nudge (transform).
// Colours swap instantly; nothing but opacity/transform is transitioned.
const base =
  'fx inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-medium leading-none whitespace-nowrap select-none no-underline ' +
  'disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45 [&_svg]:shrink-0';

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-accent bg-accent text-white hover:text-white active:text-white [--fx-inset:-1px] [--fx-bg:var(--color-accent-600)] [--fx-press:var(--color-accent-700)]',
  secondary:
    'border-divider bg-surface text-ink hover:border-neutral-300 hover:text-ink [--fx-bg:rgb(28_22_51/.05)] [--fx-press:rgb(28_22_51/.1)]',
  ghost: 'border-transparent bg-transparent text-ink hover:text-ink [--fx-inset:-1px]',
  soft: 'border-transparent bg-neutral-100 text-ink/75 hover:text-ink [--fx-inset:-1px] [--fx-bg:var(--color-neutral-200)] [--fx-press:var(--color-neutral-300)]',
  inverse:
    'border-white bg-white text-ink hover:text-accent-800 [--fx-inset:-1px] [--fx-bg:var(--color-accent-50)] [--fx-press:var(--color-accent-100)]',
};

const sizes: Record<ButtonSize, { text: string; icon: string }> = {
  sm: { text: 'h-8 px-3 text-[13px]', icon: 'size-8 text-[13px]' },
  md: { text: 'h-10 px-4 text-sm', icon: 'size-10 text-sm' },
  lg: { text: 'h-12 px-6 text-[15px]', icon: 'size-12 text-[15px]' },
};

/** Class string of a button - for elements that cannot use <Button> (e.g. <summary>). */
export function buttonClasses({ variant = 'primary', size = 'md', iconOnly = false, block = false }: ButtonStyleOptions = {}) {
  return cn(base, variants[variant], iconOnly ? sizes[size].icon : sizes[size].text, block && 'w-full');
}

interface CommonProps extends ButtonStyleOptions {
  className?: string;
  children?: ReactNode;
  /** Shows a spinner and sets aria-busy (button mode only disables it). */
  loading?: boolean;
}

export type ButtonAsButtonProps = CommonProps &
  Omit<ComponentPropsWithRef<'button'>, keyof CommonProps> & { href?: undefined };

export type ButtonAsLinkProps = CommonProps &
  Omit<ComponentPropsWithRef<'a'>, keyof CommonProps | 'href'> & {
    /** Internal path (already locale-prefixed, e.g. href(locale,'/games')) or absolute URL. */
    href: string;
    /** Force new-tab behaviour; default: true for http(s) URLs. */
    external?: boolean;
    /** Screen-reader suffix for new-tab links, e.g. t.newTab "(mở tab mới)". */
    newTabLabel?: string;
    /** Render as a non-interactive disabled link. */
    disabled?: boolean;
    prefetch?: boolean;
    scroll?: boolean;
    replace?: boolean;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function Spinner() {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const isExternalUrl = (url: string) => /^(https?:)?\/\//i.test(url);

/**
 * Button / link button.
 * - No `href` -> <button type="button"> (pass type="submit" for forms).
 * - Internal `href` -> next/link. External (http) -> <a target="_blank" rel="noopener noreferrer">.
 * - `disabled` link -> <span aria-disabled="true"> (not focusable).
 */
export function Button(props: ButtonProps) {
  const { variant, size, iconOnly, block, className, children, loading = false, ...restAll } = props;
  const classes = cn(buttonClasses({ variant, size, iconOnly, block }), className);
  const content = (
    <>
      {loading ? <Spinner /> : null}
      {children}
    </>
  );

  if (typeof restAll.href === 'string') {
    const { href, external, newTabLabel, disabled, prefetch, scroll, replace, ...rest } = restAll as Omit<
      ButtonAsLinkProps,
      keyof CommonProps
    >;

    if (disabled || href === '') {
      const spanProps = { ...rest } as Record<string, unknown>;
      for (const k of ['ref', 'target', 'rel', 'onClick']) delete spanProps[k];
      return (
        <span {...(spanProps as ComponentPropsWithRef<'span'>)} className={classes} aria-disabled="true" role="link">
          {content}
        </span>
      );
    }

    const newTab = external ?? isExternalUrl(href);
    if (newTab || /^(mailto:|tel:)/i.test(href)) {
      return (
        <a
          {...rest}
          href={href}
          className={classes}
          target={newTab ? (rest.target ?? '_blank') : rest.target}
          rel={newTab ? (rest.rel ?? 'noopener noreferrer') : rest.rel}
          aria-busy={loading || undefined}
        >
          {content}
          {newTab && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
        </a>
      );
    }

    return (
      <Link
        {...rest}
        href={href}
        prefetch={prefetch}
        scroll={scroll}
        replace={replace}
        className={classes}
        aria-busy={loading || undefined}
      >
        {content}
      </Link>
    );
  }

  const { type = 'button', disabled, ...rest } = restAll as Omit<ButtonAsButtonProps, keyof CommonProps | 'href'>;
  return (
    <button {...rest} type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined}>
      {content}
    </button>
  );
}