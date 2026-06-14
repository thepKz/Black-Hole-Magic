'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Next.js maintains scroll position when the destination page is still visible
 * in the viewport, and the fixed header is skipped when it looks for a scroll
 * target — so clicking a nav link on these landing pages often doesn't jump to
 * the top. Lenis also eases the native scroll, so a bare window.scrollTo gets
 * overridden. Reset through Lenis when present, fall back to native otherwise.
 */
export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
