'use client';

import { useLayoutEffect, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Next.js keeps the scroll position when the destination page is still visible
 * in the viewport, and the fixed header is skipped when it looks for a scroll
 * target — so clicking a nav link on these landing pages often doesn't jump to
 * the top. Lenis also eases the native scroll, so a bare window.scrollTo gets
 * overridden. Reset through Lenis when present, fall back to native otherwise.
 *
 * Mobile is the tricky case: there is no Lenis (disabled on touch), the
 * destination page mounts heavy content (images / 3D / GSAP) that shifts layout
 * AFTER the first frames, and ScrollTrigger.refresh()/clearScrollMemory() on
 * pages like /game can nudge the scroll position. So we (1) reset synchronously
 * before paint via useLayoutEffect, and (2) keep re-resetting across several
 * frames + timeouts — on EVERY route, including /game — to outlast late layout
 * shifts. The reset is idempotent and cheap.
 */
export default function ScrollReset() {
  const pathname = usePathname();
  // First mount = a fresh page load (browser already lands at top, and resetting
  // could fight a deep-link/hash). Only force-reset on subsequent navigations.
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      // Respect an initial in-page anchor (#hash) on first load.
      if (window.location.hash) return;
    }

    const reset = () => {
      window.__lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      // Cover every element that might be the scroller across browsers.
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Synchronous (pre-paint) reset, then a ladder of post-paint resets to beat
    // late layout shifts from images/3D/GSAP — kept short enough to be invisible
    // but long enough for mobile to settle.
    reset();

    const frames: number[] = [];
    const timers: number[] = [];
    // two animation frames (after the destination's layout effects run)
    frames.push(
      window.requestAnimationFrame(() => {
        reset();
        frames.push(window.requestAnimationFrame(reset));
      })
    );
    // timeout ladder — same on all routes, incl. /game (the reported page)
    [60, 160, 320, 600].forEach((ms) => timers.push(window.setTimeout(reset, ms)));

    return () => {
      frames.forEach((f) => window.cancelAnimationFrame(f));
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname]);

  return null;
}
