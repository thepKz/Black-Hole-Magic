'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PortalTransitionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      tl.fromTo(
        '.portal-art',
        { autoAlpha: 0, scale: 0.94, yPercent: 8, filter: 'blur(10px) brightness(0.65)' },
        { autoAlpha: 1, scale: 1, yPercent: 0, filter: 'blur(0px) brightness(1)', duration: 0.3, ease: 'power2.out' },
        0
      )
        .to('.portal-art', { autoAlpha: 1, scale: 1.1, yPercent: -4, filter: 'blur(0px) brightness(1.06)', duration: 0.7, ease: 'none' }, 0.3)
        .fromTo('.portal-vignette', { opacity: 0.86 }, { opacity: 0.38, duration: 0.6, ease: 'none' }, 0.16);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="portal-transition" aria-label="Blackhole future portal transition">
      <div className="portal-sticky">
        <img
          className="portal-art"
          src="/assets/img/landing-page/test_lan_thu_9.png"
          alt=""
          aria-hidden="true"
        />
        <span className="portal-vignette" aria-hidden="true" />
      </div>

      <style jsx global>{`
        .portal-transition {
          position: relative;
          z-index: 12 !important;
          height: 190vh;
          margin-top: -1px;
          background: #030306 !important;
        }

        .portal-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 52%, rgba(93, 54, 175, 0.24), rgba(3, 3, 6, 0) 34%),
            linear-gradient(180deg, #05040a 0%, #020204 48%, #070512 100%);
        }

        .portal-art {
          position: absolute;
          inset: 50% auto auto 50%;
          width: min(112vw, 1448px);
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: contain;
          object-position: center;
          opacity: 1;
          pointer-events: none;
          user-select: none;
          will-change: transform, opacity, filter;
          z-index: 1;
        }

        .portal-vignette {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(ellipse at center, transparent 0%, transparent 38%, rgba(0, 0, 0, 0.42) 70%, rgba(0, 0, 0, 0.92) 100%),
            linear-gradient(180deg, rgba(3, 3, 6, 0.82) 0%, rgba(3, 3, 6, 0) 18%, rgba(3, 3, 6, 0) 76%, rgba(7, 5, 18, 0.95) 100%);
        }

        @media (max-width: 767px), (prefers-reduced-motion: reduce) {
          .portal-transition {
            height: auto;
            min-height: 78vh;
          }

          .portal-sticky {
            position: relative;
            min-height: 78vh;
          }

          .portal-art {
            opacity: 1;
            width: 140vw;
            filter: brightness(0.9);
          }
        }
      `}</style>
    </section>
  );
}
