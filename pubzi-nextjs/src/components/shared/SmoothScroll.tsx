'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide smooth scrolling. Lenis eases the NATIVE window scroll position
 * (no transform-virtualized container), so position: sticky / fixed keep
 * working — required by the hero curtain and the About scroll story.
 * Driven from gsap.ticker so Lenis and ScrollTrigger share one clock.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // touch devices already have momentum scrolling; doubling it feels wrong
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

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

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
