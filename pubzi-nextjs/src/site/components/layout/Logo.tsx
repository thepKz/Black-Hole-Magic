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

/** Full-resolution mark (395x256) for the large footer lockup; next/image serves it as AVIF/WebP. */
const MARK_LG = { src: '/site/brand/logo-mark.png', width: 395, height: 256 } as const;

/**
 * Brand mark + "BLACK HOLE" wordmark, links to the locale home.
 * - header: inline mark (28-32px) + wordmark.
 * - footer: stacked lockup ~150px tall (design v2 brand column anchor):
 *   96px mark over "BLACK HOLE" and a small "GAME" line.
 */
export function Logo({ href, label, size = 'header', className }: LogoProps) {
  if (size === 'footer') {
    return (
      <Link
        href={href}
        aria-label={label}
        className={cn('flex w-[180px] shrink-0 flex-col items-center gap-2 text-ink no-underline hover:text-ink', className)}
      >
        <Image
          src={MARK_LG.src}
          width={MARK_LG.width}
          height={MARK_LG.height}
          sizes="148px"
          alt=""
          loading="lazy"
          className="h-24 w-auto"
        />
        <span className="flex flex-col items-center leading-none">
          <span className="text-xl font-semibold tracking-[0.14em] whitespace-nowrap">BLACK HOLE</span>
          <span className="mt-1.5 flex items-center gap-2 text-[11px] font-medium tracking-[0.5em] text-accent-700 before:h-px before:w-6 before:bg-current before:opacity-60 after:h-px after:w-6 after:bg-current after:opacity-60">
            <span className="-mr-[0.5em]">GAME</span>
          </span>
        </span>
      </Link>
    );
  }
  const mark = site.logo.mark;
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn('flex shrink-0 items-center gap-2 text-ink no-underline hover:text-ink', className)}
    >
      <Image
        src={mark.src}
        // intrinsic 197x128; request a ~1x/2x pair for the rendered size
        width={50}
        height={32}
        alt=""
        loading="eager"
        className="h-7 w-auto md:h-8"
      />
      <span className="text-[15px] font-medium tracking-[0.04em] whitespace-nowrap md:text-[17px]">BLACK HOLE</span>
    </Link>
  );
}
