'use client';

import { useEffect } from 'react';

/**
 * Site-wide motion helper. Mount ONCE in the root layout; renders nothing.
 *
 * 1. Reveal - one shared IntersectionObserver (all browsers; time-based so
 *    nothing is left half-faded at the fold). `[data-reveal]`
 *    elements that are still below the fold get data-reveal-state="pending"
 *    (hidden by CSS), flip to "shown" the first time they enter the viewport,
 *    are unobserved (once), and lose the attribute after their transition so
 *    their own hover transitions apply again. Elements already on screen are
 *    never touched (no flash). New content (client navigation, streaming) is
 *    picked up by a MutationObserver batched to one rAF.
 * 2. Header shadow fallback - only in browsers without CSS scroll timelines:
 *    one passive scroll listener toggling html[data-scrolled] (rAF-throttled,
 *    only writes on change).
 *
 * Skipped entirely under prefers-reduced-motion (reveal) - content stays visible.
 * No per-frame work: callbacks run only on intersection / mutation / scroll.
 */
export function MotionObserver() {
  useEffect(() => {
    const supportsScrollTimeline = typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: scroll()');
    const root = document.documentElement;
    const cleanups: Array<() => void> = [];

    // ---- Header shadow fallback (one passive listener) ----
    if (!supportsScrollTimeline) {
      let scrolled = false;
      let scrollTick = 0;
      const syncScrolled = () => {
        scrollTick = 0;
        const next = window.scrollY > 4;
        if (next === scrolled) return;
        scrolled = next;
        if (next) root.setAttribute('data-scrolled', '');
        else root.removeAttribute('data-scrolled');
      };
      const onScroll = () => {
        if (!scrollTick) scrollTick = requestAnimationFrame(syncScrolled);
      };
      syncScrolled();
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener('scroll', onScroll);
        if (scrollTick) cancelAnimationFrame(scrollTick);
        root.removeAttribute('data-scrolled');
      });
    }

    // ---- Reveal (one IntersectionObserver) ----
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!reduce.matches && 'IntersectionObserver' in window) {
      const done = (el: Element) => el.removeAttribute('data-reveal-state');

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            io.unobserve(el);
            el.setAttribute('data-reveal-state', 'shown');
            // Drop the state once the reveal finished (restores the element's own transitions).
            const onEnd = (e: TransitionEvent) => {
              if (e.target !== el || e.propertyName !== 'opacity') return;
              el.removeEventListener('transitionend', onEnd);
              done(el);
            };
            el.addEventListener('transitionend', onEnd);
            window.setTimeout(() => {
              el.removeEventListener('transitionend', onEnd);
              done(el);
            }, 1800); // safety net (transition cancelled / tab hidden)
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0 },
      );

      const scan = () => {
        const vh = window.innerHeight;
        document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-state]):not([data-reveal-seen])').forEach((el) => {
          el.setAttribute('data-reveal-seen', '');
          const rect = el.getBoundingClientRect();
          // Already visible (or not rendered, e.g. a hidden cached page): leave it alone.
          if (rect.height === 0 || rect.top < vh * 0.92) return;
          el.setAttribute('data-reveal-state', 'pending');
          io.observe(el);
        });
      };

      let mutationTick = 0;
      const mo = new MutationObserver(() => {
        if (!mutationTick)
          mutationTick = requestAnimationFrame(() => {
            mutationTick = 0;
            scan();
          });
      });

      scan();
      mo.observe(document.body, { childList: true, subtree: true });
      cleanups.push(() => {
        mo.disconnect();
        io.disconnect();
        if (mutationTick) cancelAnimationFrame(mutationTick);
        document.querySelectorAll('[data-reveal-state]').forEach(done);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
