'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  ABOUT — Portal Intro (video through the ring)                        ║
   ║                                                                       ║
   ║  Layers in the fixed plate, bottom → top:                             ║
   ║   • <video>  — bg loop, full-bleed cover. Only seen THROUGH the ring  ║
   ║               because the portal image's ring window is now near-     ║
   ║               transparent (trasparent_bg.png) while its black surround   ║
   ║               + the person stay opaque and frame it.                  ║
   ║   • <img>    — trasparent_bg.png, full-bleed cover, centred on the ring. ║
   ║   • flash    — radial bloom that fills late to hide the seam.         ║
   ║                                                                       ║
   ║  On scroll the video + image scale into the ring centre together →    ║
   ║  you fly through the portal into the video. Near the end the image +  ║
   ║  flash fade out, leaving the video as the About hero's background.    ║
   ╚══════════════════════════════════════════════════════════════════════╝ */

// Centre of the purple ring inside trasparent_bg.png (1448×1086), as % of the
// image. Used for BOTH object-position (so the ring lands centre-screen after
// cover-crop) and transform-origin (so the zoom flies through the ring).
// Tune by eye on /about.
const RING_ORIGIN = '62% 38%';
const VIDEO_ORIGIN = '50% 50%';

export default function AboutPortalIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Play/pause the bg video with viewport visibility (battery) ──
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            video.style.visibility = 'visible';
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: '15% 0px' }
    );
    // Observe the fixed plate's host section AND the hero, so the video keeps
    // playing while the hero (which uses it as a background) is on screen.
    const section = sectionRef.current;
    if (section) io.observe(section);
    const hero = document.querySelector('.ab-hero');
    if (hero) io.observe(hero);

    return () => io.disconnect();
  }, []);

  // ── Scroll-zoom timeline ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Mobile: skip the heavy scroll-zoom; static fade-in plate only.
    if (window.matchMedia('(max-width: 767px)').matches) {
      gsap.fromTo('.apx-art', { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' });
      gsap.fromTo('.apx-video', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' });
      return;
    }

    const ctx = gsap.context(() => {
      // Load: fade in plate, breathing glow while we wait for scroll.
      gsap.set('.apx-art', { transformOrigin: RING_ORIGIN });
      gsap.set('.apx-video', { transformOrigin: VIDEO_ORIGIN });
      gsap.set('.apx-art', { autoAlpha: 0 });
      gsap.set('.apx-video', { autoAlpha: 0 });

      gsap.to('.apx-video', { autoAlpha: 1, duration: 1.0, ease: 'power2.out' });
      gsap.to('.apx-art', {
        autoAlpha: 1,
        duration: 1.1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to('.apx-art', {
            filter: 'brightness(1.12)',
            duration: 2.4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        },
      });

      // Scroll: fly through the ring centre. Video + image scale together so
      // the video grows to fill the screen; flash blooms late; image + flash
      // fade out, leaving the video as the hero's background underneath.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1 },
      });

      tl
        // 0 → 100%: drive into the ring centre.
        .fromTo('.apx-video', { scale: 1 }, { scale: 6, ease: 'power1.in' }, 0)
        .fromTo('.apx-art',
          { scale: 1, filter: 'brightness(1)' },
          { scale: 6, filter: 'brightness(1.25)', ease: 'power1.in' }, 0)
        // 65 → 100%: radial bloom fills, masking the cut.
        .fromTo('.apx-flash', { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power2.in' }, 0.65)
        // 82 → 100%: portal image + flash fade, leaving the video full-screen.
        .to('.apx-art', { autoAlpha: 0, ease: 'power1.out' }, 0.82)
        .to('.apx-flash', { autoAlpha: 0, ease: 'power1.out' }, 0.9);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="apx" aria-label="Black Hole portal intro">
      <div className="apx-fixed">
        <video
          ref={videoRef}
          className="apx-video"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
        >
          <source src="/assets/video/background_1_pingpong.webm" type="video/webm" />
          <source src="/assets/video/background_1_pingpong.mp4" type="video/mp4" />
        </video>

        <img
          className="apx-art"
          src="/assets/img/landing-page/trasparent_bg.png"
          alt=""
          aria-hidden="true"
        />
        <span className="apx-flash" aria-hidden="true" />
      </div>

      <style jsx global>{`
        .apx {
          position: relative;
          z-index: 2;
          /* Tall spacer = scroll runway for the zoom. Tune on /about. */
          height: 250vh;
          background: transparent !important;
          background-color: transparent !important;
          pointer-events: none;
        }
        /* Persistent fixed plate behind the (transparent) About root, so it
           shows through the hero and is covered by the opaque block below it.
           Only the portal image + flash on top fade away on scroll. */
        .apx-fixed {
          position: fixed;
          inset: 0;
          z-index: -1;
          height: 100vh;
          overflow: hidden;
          background: #08060f;
          pointer-events: none;
        }
        .apx-video,
        .apx-art {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
          will-change: transform, opacity, filter;
        }
        .apx-video {
          z-index: 0;
          object-position: ${VIDEO_ORIGIN};
          transform-origin: ${VIDEO_ORIGIN};
        }
        .apx-art {
          z-index: 1;
          opacity: 1;
          object-position: ${RING_ORIGIN};
          transform-origin: ${RING_ORIGIN};
        }
        /* Radial bloom centred on the ring — fills late to mask the cut. */
        .apx-flash {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(
            circle at ${RING_ORIGIN},
            #ffffff 0%,
            #cdb8ff 24%,
            var(--ab-purple, #6c5ce7) 48%,
            #08060f 78%
          );
        }

        /* The hero sits OVER the fixed video plate. Make its own background a
           translucent scrim so the video shows through behind the hero copy. */
        .apx + .ab-hero {
          position: relative;
          z-index: 1;
          background-color: transparent !important;
          background:
            radial-gradient(120% 80% at 78% 8%, rgba(108, 92, 231, 0.18) 0%, transparent 55%),
            linear-gradient(180deg, rgba(8, 6, 15, 0.55) 0%, rgba(8, 6, 15, 0.82) 72%, #08060f 100%) !important;
        }

        /* Mobile: static, in-flow plate, no zoom. */
        @media (max-width: 767px) {
          .apx {
            height: auto;
            min-height: 70vh;
          }
          .apx-fixed {
            position: relative;
            inset: auto;
            z-index: 2;
            min-height: 70vh;
          }
          .apx-video,
          .apx-art {
            transform: none;
          }
          .apx-flash { display: none; }
          /* Hero returns to its own solid background on mobile. */
          .apx + .ab-hero { background: none !important; }
        }

        /* Reduced motion: static portal, no video autoplay, no animation. */
        @media (prefers-reduced-motion: reduce) {
          .apx {
            height: auto;
            min-height: 80vh;
          }
          .apx-fixed {
            position: relative;
            inset: auto;
            z-index: 2;
            min-height: 80vh;
          }
          .apx-art {
            opacity: 1;
            visibility: visible;
            transform: none;
            filter: none;
          }
          .apx-video { opacity: 1; visibility: visible; transform: none; }
          .apx-flash { display: none; }
          .apx + .ab-hero { background: none !important; }
        }
      `}</style>
    </section>
  );
}
