'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from '@/components/ui/animated-text';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection7() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // The video is a fixed layer shared with the About glass section below.
  // Pause and hide it once both sections are out of view to free the GPU.
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;

    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target, e.isIntersecting));
        const anyVisible = [...visible.values()].some(Boolean);
        if (anyVisible) {
          video.style.visibility = 'visible';
          video.play().catch(() => {});
        } else {
          video.pause();
          video.style.visibility = 'hidden';
        }
      },
      { rootMargin: '10% 0px' }
    );
    io.observe(hero);
    const about = document.querySelector('.about-story');
    if (about) io.observe(about);

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let observer: IntersectionObserver | undefined;
    let startTimer: number | undefined;
    let hasStarted = false;
    let startHeroAnimations: (() => void) | undefined;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set('.hero-kicker-text, .hero-main-title, .hero-character, .hero-action-cluster', {
          clearProps: 'all',
          opacity: 1,
        });
        return;
      }

      gsap.set('.hero-kicker-text', { x: -44, opacity: 0 });
      gsap.set('.hero-main-title', { x: -74, opacity: 0, filter: 'blur(10px)' });
      gsap.set('.hero-character', { x: 92, opacity: 0, filter: 'blur(6px)' });
      gsap.set('.hero-action-cluster', { x: -76, opacity: 0, scale: 0.96 });
      gsap.set('.hero-energy-rift', { opacity: 0.72, xPercent: -8 });
      gsap.set('.hero-video-bg', { scale: 1, transformOrigin: '50% 50%' });

      // The scroll-exit timeline is created ONLY after the intro finishes:
      // a scrubbed .to() captures its start values at first render, so if it
      // is born while the intro still has pieces at opacity 0, the exit tween
      // animates 0 → 0 and the phone/character stay invisible forever.
      const createExitTimeline = () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=70%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
          defaults: {
            ease: 'none',
            overwrite: 'auto',
            force3D: true,
            duration: 0.55,
          },
        })
          .to('.hero-video-bg', { scale: 1.085, duration: 1 }, 0)
          .to('.hero-contrast-layer', { autoAlpha: 0.25, duration: 1 }, 0)
          .to('.hero-action-cluster', { xPercent: -116, rotation: -14, autoAlpha: 0 }, 0)
          .to('.hero-main-title', { xPercent: -42, autoAlpha: 0 }, 0)
          .to('.hero-kicker-text', { xPercent: -30, autoAlpha: 0 }, 0)
          .to('.hero-character', { xPercent: 92, rotation: 3, autoAlpha: 0 }, 0);
      };

      const playIntro = () => {
        gsap.timeline({
          defaults: {
            duration: 0.4,
            ease: 'power3.out',
            overwrite: 'auto',
          },
          onComplete: createExitTimeline,
        })
          .to('.hero-kicker-text', { x: 0, opacity: 1 }, 0)
          .to('.hero-main-title', { x: 0, opacity: 1, filter: 'blur(0px)' }, 0)
          .to('.hero-character', { x: 0, opacity: 1, filter: 'blur(0px)' }, 0)
          .to('.hero-action-cluster', { x: 0, opacity: 1, scale: 1 }, 0);
      };

      startHeroAnimations = () => {
        if (hasStarted) return;
        hasStarted = true;

        playIntro();

        gsap.fromTo(
          '.iphone-stage',
          { x: -4, rotation: -6.8, force3D: true },
          {
            x: 6,
            rotation: -4.8,
            duration: 5.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            force3D: true,
          }
        );

        gsap.to('.hero-character-art', {
          x: -8,
          rotation: -0.3,
          scale: 1.006,
          duration: 6.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          force3D: true,
        });

        // Frost the video only once the About glass panel actually starts
        // entering the screen (after the hero pieces finish their exit) —
        // never during the first stretch of scrolling.
        ScrollTrigger.create({
          trigger: '.about-story',
          start: 'top 78%',
          end: 'bottom top',
          invalidateOnRefresh: true,
          toggleClass: { targets: '.hero-video-bg', className: 'is-frosted' },
        });
      };
    }, heroRef);

    const handlePreloaderComplete = () => {
      startHeroAnimations?.();
    };

    if (document.body.dataset.preloaderDone === 'true' || !document.querySelector('[data-preloader="black-hole"]')) {
      startHeroAnimations?.();
    } else {
      window.addEventListener('black-hole:preloader-complete', handlePreloaderComplete, { once: true });
      startTimer = window.setTimeout(handlePreloaderComplete, 5200);
    }

    return () => {
      if (startTimer) window.clearTimeout(startTimer);
      window.removeEventListener('black-hole:preloader-complete', handlePreloaderComplete);
      observer?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* Fixed video layer shared by the hero and the About glass section.
          Kept OUTSIDE the hero: .hero-section has z-index 9 (template), which
          would trap the video above the About panel's z-index 1. */}
      <video
        ref={videoRef}
        className="hero-video-bg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <source src="/assets/video/background_1_pingpong.webm" type="video/webm" />
        <source src="/assets/video/background_1_pingpong.mp4" type="video/mp4" />
      </video>

    <div ref={heroRef} className="hero-section hero-7" style={{
      ['--bh-purple' as string]: '#6C5CE7',
      ['--bh-ink' as string]: '#06060A',
      // Curtain reveal (see home-7/page.tsx): pin at the top while the content
      // block slides over. Negative top on screens shorter than 760px lets the
      // hero bottom scroll into view before it pins. zIndex 0 overrides the
      // template's .hero-section z-index 9 so the content can paint above.
      position: 'sticky',
      top: 'calc(100dvh - max(760px, 100dvh))',
      zIndex: 0,
      minHeight: 'max(760px, 100dvh)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '140px',
      paddingBottom: '120px',
      marginBottom: '0',
      background: 'transparent',
    }}>
      <div className="hero-contrast-layer" />

      {/* Simple frame lines - purple only */}
      <svg style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        <path d="M 0,150 L 0,0 L 200,0" stroke="var(--bh-purple)" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M 100%,calc(100% - 150) L 100%,100% L calc(100% - 200),100%" stroke="var(--bh-purple)" strokeWidth="2" fill="none" opacity="0.6" />
      </svg>

      {/* Person image - RIGHT SIDE */}
      <div className="hero-character" style={{
        position: 'absolute',
        right: '-28px',
        bottom: 0,
        height: '770px',
        width: '700px',
        zIndex: 3,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <img
          src="/assets/img/landing-page/shape-2.png"
          alt="Professional"
          className="hero-character-art"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            display: 'block',
          }}
        />
      </div>

      {/* Phone and CTA are locked together to avoid resize drift. */}
      <div className="hero-action-cluster" style={{ transform: 'translateX(-76px) scale(0.96)', opacity: 0 }}>
        <div className="iphone-stage">
          <img
            src="/assets/img/landing-page/iphone_2.png"
            alt="iPhone"
            className="iphone-art"
          />

          <a
            href="/contact"
            className="hero-cta"
          >
            <span>READ MORE</span>
            <span className="hero-cta-arrow">→</span>
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="container hero-copy-container" style={{ position: 'relative', zIndex: 4 }}>
        <div className="row">
          <div className="col-lg-7 col-md-10">
            {/* Small tagline */}
            <div className="hero-kicker-text" style={{
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--bh-purple)',
              marginBottom: '28px',
            }}>
              Digital Gaming Platform
            </div>

            <AnimatedText
              text="BLACK HOLE GAME"
              className="hero-main-title hero-title-stars"
              animationType="letters"
              staggerDelay={0.032}
              duration={0.62}
              initialY={24}
            />

          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style jsx global>{`
        .hero-video-bg {
          filter: contrast(1.2) brightness(0.85);
          /* frost via class toggle + transition — never scrub-animate filter */
          transition: filter 0.7s ease;
        }

        .hero-video-bg.is-frosted {
          /* darker than the hero state so the frosted gap above the rising
             panel reads as "background receding", not a broken image */
          filter: blur(16px) saturate(1.25) contrast(1.08) brightness(0.7);
        }

        .hero-contrast-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(circle at 43% 42%, rgba(95, 42, 255, 0.38), rgba(40, 12, 118, 0.2) 22%, transparent 38%),
            radial-gradient(circle at 82% 20%, rgba(76, 21, 190, 0.22), transparent 28%),
            linear-gradient(90deg, rgba(3, 2, 10, 0.82) 0%, rgba(15, 5, 43, 0.38) 44%, rgba(4, 2, 12, 0.72) 100%),
            linear-gradient(180deg, rgba(3, 2, 10, 0.46), rgba(3, 2, 10, 0.72));
        }


        .hero-action-cluster {
          position: absolute;
          left: 54px;
          bottom: 12px;
          z-index: 5;
          width: 620px;
          max-width: calc(100% - 560px);
          pointer-events: none;
          will-change: transform, opacity;
        }

        .hero-character {
          isolation: isolate;
          pointer-events: auto !important;
        }

        .hero-character::before {
          content: '';
          position: absolute;
          inset: 5% 2% -4% -8%;
          z-index: -1;
          pointer-events: none;
          background: radial-gradient(circle at 54% 57%, rgba(80, 23, 220, 0.34), transparent 44%);
          filter: blur(16px) contrast(1.18) saturate(1.1);
          opacity: 0.46;
          mix-blend-mode: screen;
          transform: scale(1);
          transition: opacity 0.28s ease, transform 0.28s ease, filter 0.28s ease;
        }

        .hero-character::after {
          content: '';
          position: absolute;
          inset: 9% 2% 2% 12%;
          z-index: -1;
          pointer-events: none;
          background: conic-gradient(from 215deg at 50% 50%, transparent 0deg, rgba(126, 65, 255, 0.38) 72deg, transparent 145deg, rgba(68, 17, 190, 0.28) 222deg, transparent 310deg);
          border-radius: 50%;
          filter: blur(14px) contrast(1.16);
          opacity: 0.34;
          transform: rotate(-10deg) scale(1);
          transition: opacity 0.28s ease, transform 0.28s ease, filter 0.28s ease;
        }

        .hero-character:hover::before {
          opacity: 0.6;
          filter: blur(18px) contrast(1.22) saturate(1.18);
          transform: scale(1.025);
        }

        .hero-character:hover::after {
          opacity: 0.46;
          filter: blur(16px) contrast(1.2);
          transform: rotate(-10deg) scale(1.025);
        }

        .hero-character-art {
          filter:
            hue-rotate(8deg)
            saturate(1.04)
            contrast(1.06)
            drop-shadow(0 24px 34px rgba(0, 0, 0, 0.66))
            drop-shadow(0 0 10px rgba(118, 62, 255, 0.38))
            drop-shadow(0 0 26px rgba(62, 18, 184, 0.3));
          mix-blend-mode: multiply;
          transform-origin: 50% 78%;
          transition: filter 0.28s ease;
          will-change: transform, filter;
        }

        .hero-character:hover .hero-character-art {
          filter:
            hue-rotate(10deg)
            saturate(1.12)
            contrast(1.08)
            drop-shadow(0 26px 36px rgba(0, 0, 0, 0.66))
            drop-shadow(0 0 14px rgba(140, 76, 255, 0.48))
            drop-shadow(0 0 34px rgba(68, 20, 194, 0.38));
        }

        .iphone-stage {
          position: relative;
          width: 570px;
          flex: 0 0 auto;
          transform: rotate(-6deg);
          transform-origin: left bottom;
          filter:
            drop-shadow(0 28px 54px rgba(20, 5, 74, 0.82))
            drop-shadow(0 0 12px rgba(119, 58, 255, 0.36))
            drop-shadow(0 0 30px rgba(56, 13, 170, 0.32));
          will-change: transform;
        }

        .iphone-stage::before {
          content: '';
          position: absolute;
          inset: 18% 4% -18% -6%;
          z-index: -1;
          background:
            radial-gradient(circle at 45% 46%, rgba(134, 69, 255, 0.38) 0%, rgba(70, 24, 204, 0.26) 34%, transparent 68%);
          filter: blur(24px) contrast(1.18);
        }

        .iphone-stage::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(142, 92, 255, 0.34), rgba(74, 22, 213, 0.18) 44%, rgba(16, 4, 64, 0.08));
          mix-blend-mode: soft-light;
          -webkit-mask-image: url('/assets/img/landing-page/iphone_2.png');
          mask-image: url('/assets/img/landing-page/iphone_2.png');
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          pointer-events: none;
        }

        .iphone-art {
          display: block;
          width: 100%;
          height: auto;
          filter: contrast(1.22) saturate(0.92) hue-rotate(14deg);
        }

        .hero-cta {
          --cta-border-angle: 0deg;
          pointer-events: auto;
          position: absolute;
          left: 50%;
          top: 75%;
          transform: translate(-50%);
          z-index: 4;
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.16), transparent 18% 78%, rgba(0, 224, 255, 0.2)),
            radial-gradient(circle at 18% 0%, rgba(188, 152, 255, 0.34), transparent 34%),
            linear-gradient(135deg, #10002f 0%, #2a087f 44%, #5a23ff 88%, #00d8ff 160%);
          border: 1px solid rgba(214, 198, 255, 0.76);
          padding: 12px 24px;
          min-width: 160px;
          min-height: 50px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          line-height: 1;
          text-transform: uppercase;
          color: #fff;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          white-space: nowrap;
          clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
          transition: transform 0.28s ease, background 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, filter 0.28s ease;
          overflow: hidden;
          box-shadow:
            0 0 10px rgba(151, 92, 255, 0.46),
            0 0 24px rgba(62, 16, 194, 0.48),
            0 16px 42px rgba(12, 2, 58, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            inset 0 -4px 14px rgba(4, 0, 24, 0.54);
        }

        .hero-cta::before {
          content: '';
          position: absolute;
          inset: -35% -45%;
          background: linear-gradient(115deg, transparent 18%, rgba(255, 255, 255, 0.34) 42%, rgba(147, 92, 255, 0.34) 50%, transparent 68%);
          transform: translateX(-72%) rotate(8deg);
          transition: transform 0.72s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .hero-cta::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          padding: 2px;
          background: conic-gradient(from var(--cta-border-angle), #6d28ff, #ffffff, #9a5cff, #3a0ca3, #6d28ff);
          clip-path: inherit;
          pointer-events: none;
          opacity: 0.82;
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
          filter: drop-shadow(0 0 8px rgba(120, 54, 255, 0.64));
        }

        .hero-cta span {
          position: relative;
          z-index: 1;
        }

        .hero-cta:hover {
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.22), transparent 18% 76%, rgba(0, 232, 255, 0.3)),
            radial-gradient(circle at 18% 0%, rgba(235, 222, 255, 0.42), transparent 34%),
            linear-gradient(135deg, #170044 0%, #3a08a4 42%, #6d28ff 88%, #9f6cff 155%);
          border-color: rgba(255, 255, 255, 0.92);
          filter: saturate(1.2) contrast(1.08);
          transform: translate(-50%, -3px) skewX(-1.5deg);
          box-shadow:
            0 0 14px rgba(235, 222, 255, 0.46),
            0 0 34px rgba(112, 42, 255, 0.62),
            0 22px 54px rgba(20, 2, 94, 0.84),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -4px 14px rgba(4, 0, 24, 0.48);
        }

        .hero-cta:hover::before {
          transform: translateX(72%) rotate(8deg);
        }

        .hero-cta:active {
          transform: translate(-50%, 1px) scale(0.99);
        }

        .hero-cta-arrow {
          font-size: 20px;
          line-height: 1;
        }

        @media (prefers-reduced-motion: no-preference) {
          @property --cta-border-angle {
            syntax: '<angle>';
            inherits: false;
            initial-value: 0deg;
          }

          .hero-cta {
            animation: ctaEnergy 3.2s ease-in-out infinite, ctaIdleDrift 2.2s ease-in-out infinite;
          }

          .hero-cta::after {
            animation: ctaBorderSpin 2.4s linear infinite;
          }

          .hero-cta:hover {
            animation: ctaEnergy 1.35s ease-in-out infinite, ctaHoverJitter 0.42s steps(2, end) infinite;
          }

          .hero-cta:hover::after {
            animation-duration: 0.75s;
          }

          @keyframes ctaEnergy {
            0%, 100% {
              box-shadow:
                0 0 10px rgba(151, 92, 255, 0.42),
                0 0 24px rgba(62, 16, 194, 0.46),
                0 16px 42px rgba(12, 2, 58, 0.8),
                inset 0 1px 0 rgba(255, 255, 255, 0.22),
                inset 0 -4px 14px rgba(4, 0, 24, 0.54);
            }
            50% {
              box-shadow:
                0 0 14px rgba(218, 196, 255, 0.5),
                0 0 32px rgba(112, 42, 255, 0.62),
                0 18px 50px rgba(12, 2, 58, 0.84),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -4px 14px rgba(4, 0, 24, 0.5);
            }
          }

          @keyframes ctaBorderSpin {
            to {
              --cta-border-angle: 360deg;
            }
          }

          @keyframes ctaIdleDrift {
            0%, 100% {
              transform: translate(-50%, 0) skewX(0deg);
            }
            35% {
              transform: translate(calc(-50% - 2px), -1px) skewX(-0.8deg);
            }
            70% {
              transform: translate(calc(-50% + 2px), 1px) skewX(0.8deg);
            }
          }

          @keyframes ctaHoverJitter {
            0%, 100% {
              transform: translate(-50%, -3px) skewX(-1.5deg);
            }
            50% {
              transform: translate(calc(-50% + 1px), -4px) skewX(1.5deg);
            }
          }
        }

        .hero-section.hero-7 {
          /* force-brand-colors.css sets .hero-section { position: relative
             !important }, which silently kills the inline sticky and with it
             the whole curtain reveal. Re-assert sticky with higher specificity. */
          position: sticky !important;
          width: 100vw !important;
          max-width: 100vw !important;
          min-height: max(760px, 100dvh) !important;
          margin-left: calc(50% - 50vw) !important;
          margin-right: calc(50% - 50vw) !important;
        }

        .hero-copy-container {
          transform: translateY(-86px);
          will-change: transform, opacity;
        }

        .hero-kicker-text,
        .hero-main-title,
        .hero-character {
          will-change: transform, opacity, filter;
        }

        .hero-main-title {
          font-size: 82px;
          font-weight: 900;
          font-family: Orbitron, sans-serif;
          line-height: 1.1;
          margin-bottom: 36px;
          text-transform: uppercase;
          letter-spacing: 0;
          color: #ffffff;
          max-width: 720px;
          perspective: 900px;
        }

        .hero-title-stars span {
          position: relative;
          color: #ffffff;
          -webkit-text-fill-color: #ffffff;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.34);
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.34)) drop-shadow(0 0 14px rgba(102, 42, 255, 0.46));
          text-shadow:
            0 2px 0 rgba(7, 4, 20, 0.92),
            0 0 8px rgba(255, 255, 255, 0.34),
            0 0 20px rgba(111, 42, 255, 0.58),
            0 10px 30px rgba(0, 0, 0, 0.86);
          transform-origin: 50% 68%;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: no-preference) {
          .hero-title-stars span {
            animation: titleWhitePulse 4.8s ease-in-out infinite;
          }

          @keyframes titleWhitePulse {
            0%, 100% {
              filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 12px rgba(102, 42, 255, 0.4));
            }
            50% {
              filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.44)) drop-shadow(0 0 18px rgba(102, 42, 255, 0.52));
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-action-cluster,
          .iphone-stage,
          .hero-kicker-text,
          .hero-main-title,
          .hero-character,
          .hero-copy-container {
            will-change: auto;
          }
        }

        @supports not (height: 100dvh) {
          .hero-section.hero-7 {
            min-height: max(760px, 100vh) !important;
          }
        }

        @media (min-width: 1400px) {
          .hero-section.hero-7 {
            min-height: max(820px, 100dvh) !important;
            padding-top: 150px !important;
            padding-bottom: 130px !important;
          }

          @supports not (height: 100dvh) {
            .hero-section.hero-7 {
              min-height: max(820px, 100vh) !important;
            }
          }

          .hero-character {
            right: -12px !important;
            width: 760px !important;
            height: 820px !important;
          }

          .hero-action-cluster {
            left: 56px;
            bottom: 18px;
            width: 660px;
            max-width: calc(100% - 620px);
          }

          .iphone-stage {
            width: 610px;
          }

          .hero-cta {
            left: 50%;
          }

          .hero-copy-container {
            transform: translateY(-96px);
          }
        }

        @media (max-width: 1199px) {
          .hero-section.hero-7 {
            min-height: max(700px, 100dvh) !important;
            padding-top: 120px !important;
            padding-bottom: 100px !important;
          }

          @supports not (height: 100dvh) {
            .hero-section.hero-7 {
              min-height: max(700px, 100vh) !important;
            }
          }

          .hero-character {
            right: -118px !important;
            width: 640px !important;
            height: 710px !important;
          }

          .hero-action-cluster {
            left: 32px;
            bottom: 14px;
            width: 512px;
            max-width: calc(100% - 430px);
          }

          .iphone-stage {
            width: 468px;
          }

          .hero-cta {
            min-width: 140px;
            min-height: 46px;
            left: 50%;
            top: 64%;
            padding: 10px 20px;
            font-size: 11px;
          }

          .hero-main-title {
            font-size: 64px !important;
          }

          .hero-copy-container {
            transform: translateY(-70px);
          }
        }

        @media (max-width: 991px) {
          .hero-character,
          .hero-action-cluster {
            display: none !important;
          }

          .hero-section.hero-7 {
            padding-top: 80px !important;
            padding-bottom: 90px !important;
            min-height: max(560px, 100dvh) !important;
          }

          @supports not (height: 100dvh) {
            .hero-section.hero-7 {
              min-height: max(560px, 100vh) !important;
            }
          }

          .hero-main-title {
            font-size: 52px !important;
          }

          .hero-kicker-text {
            margin-bottom: 22px !important;
          }

          .hero-copy-container {
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-section.hero-7 {
            min-height: max(520px, 100dvh) !important;
          }

          @supports not (height: 100dvh) {
            .hero-section.hero-7 {
              min-height: max(520px, 100vh) !important;
            }
          }

          .hero-main-title {
            font-size: 42px !important;
          }
        }

      `}</style>
    </div>
    </>
  );
}
