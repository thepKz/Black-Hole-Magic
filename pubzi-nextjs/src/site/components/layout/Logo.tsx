import Image from 'next/image';
import Link from 'next/link';

import { site } from '@site/data/site';
import { cn } from '@site/lib/cn';

export interface LogoProps {
  /** Locale home, e.g. '/vi'. */
  href: string;
  /** Accessible name of the link, e.g. "Black Hole Game – Trang chủ". */
  label: string;
  size?: 'header' | 'footer';
  className?: string;
}

/** Brand mark + "BLACK HOLE" wordmark, links to the locale home. */
export function Logo({ href, label, size = 'header', className }: LogoProps) {
  const mark = site.logo.mark;
  const footer = size === 'footer';
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn('flex shrink-0 items-center gap-2 text-ink no-underline hover:text-ink', className)}
    >
      <Image
        src={mark.src}
        // intrinsic 197x128; request a ~1x/2x pair for the rendered size
        width={footer ? 74 : 50}
        height={footer ? 48 : 32}
        alt=""
        loading={footer ? 'lazy' : 'eager'}
        className={cn('w-auto', footer ? 'h-12' : 'h-7 md:h-8')}
      />
      <span className={cn('font-medium tracking-[0.04em] whitespace-nowrap', footer ? 'text-lg' : 'text-[15px] md:text-[17px]')}>
        BLACK HOLE
      </span>
    </Link>
  );
}
