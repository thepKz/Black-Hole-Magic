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
    if (!('scrollRestoration' in window.history)) return;

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    let frameOne = 0;
    let frameTwo = 0;
    const timers: number[] = [];

    const reset = () => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    reset();
    frameOne = window.requestAnimationFrame(() => {
      reset();
      frameTwo = window.requestAnimationFrame(reset);
    });
    timers.push(window.setTimeout(reset, 80));
    timers.push(window.setTimeout(reset, 240));

    return () => {
      window.cancelAnimationFrame(frameOne);
      window.cancelAnimationFrame(frameTwo);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [pathname]);

  return null;
}
