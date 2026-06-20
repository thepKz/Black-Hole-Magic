'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type Lenis from 'lenis';

// Shared so route changes can reset scroll through Lenis instead of fighting it.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Site-wide smooth scrolling. Lenis eases the NATIVE window scroll position
 * (no transform-virtualized container), so position: sticky / fixed keep
 * working — required by the hero curtain and the About scroll story.
 * Driven from gsap.ticker so Lenis and ScrollTrigger share one clock.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/game')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // touch devices already have momentum scrolling; doubling it feels wrong
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')])
      .then(([lenisModule, gsapModule, scrollTriggerModule]) => {
        if (disposed) return;

        const LenisConstructor = lenisModule.default;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new LenisConstructor({
          duration: 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        window.__lenis = lenis;

        lenis.on('scroll', ScrollTrigger.update);

        const tick = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // Native scrollbar dragging: Lenis keeps easing toward its own target and
        // fights the drag (the first drag "bounces back" and only the second one
        // sticks). Pause Lenis while the scrollbar is held, then resync.
        let draggingScrollbar = false;
        const onPointerDown = (e: PointerEvent) => {
          if (e.clientX >= document.documentElement.clientWidth) {
            draggingScrollbar = true;
            lenis.stop();
          }
        };
        const onPointerUp = () => {
          if (!draggingScrollbar) return;
          draggingScrollbar = false;
          lenis.start();
          lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        };
        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointerup', onPointerUp);

        cleanup = () => {
          window.removeEventListener('pointerdown', onPointerDown);
          window.removeEventListener('pointerup', onPointerUp);
          gsap.ticker.remove(tick);
          lenis.destroy();
          if (window.__lenis === lenis) delete window.__lenis;
        };
      })
      .catch(() => {});

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
