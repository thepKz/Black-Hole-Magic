'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HeroSection7() {
  const heroRef = useRef<HTMLDivElement>(null);

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

      const playIntro = () => {
        gsap.timeline({
          defaults: {
            duration: 0.4,
            ease: 'power3.out',
            overwrite: 'auto',
          },
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

        gsap.to('.iphone-stage', {
          y: -16,
          rotation: -4.2,
          duration: 3.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        gsap.to('.hero-character-art', {
          x: 8,
          y: -14,
          rotation: 0.8,
          scale: 1.018,
          duration: 4.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) playIntro();
          },
          { threshold: 0.45 }
        );

        observer.observe(heroRef.current!);
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
    <div ref={heroRef} className="hero-section hero-7" style={{
      ['--bh-purple' as string]: '#6C5CE7',
      ['--bh-ink' as string]: '#06060A',
      position: 'relative',
      minHeight: 'max(760px, 100dvh)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '140px',
      paddingBottom: '120px',
      marginBottom: '0',
    }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'contrast(1.2) brightness(0.85)',
        }}
      >
        <source src="/assets/video/background_1_pingpong.webm" type="video/webm" />
        <source src="/assets/video/background_1_pingpong.mp4" type="video/mp4" />
      </video>
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
      <div className="hero-action-cluster">
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

            {/* Main heading - clean, no effects */}
            <h1 className="hero-main-title" style={{
              fontSize: '82px',
              fontWeight: 900,
              fontFamily: 'Orbitron, sans-serif',
              lineHeight: 1.1,
              marginBottom: '36px',
              textTransform: 'uppercase',
              letterSpacing: '0',
            }}>
              <span>
                BLACK HOLE GAME
              </span>

            </h1>

          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style jsx>{`
        .hero-contrast-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(circle at 28% 42%, rgba(122, 92, 255, 0.28), transparent 34%),
            radial-gradient(circle at 82% 18%, rgba(86, 32, 210, 0.32), transparent 30%),
            linear-gradient(90deg, rgba(8, 4, 22, 0.46) 0%, rgba(22, 8, 54, 0.14) 47%, rgba(5, 3, 14, 0.58) 100%),
            linear-gradient(180deg, rgba(4, 2, 12, 0.2), rgba(4, 2, 12, 0.54));
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
        }

        .hero-character::before {
          content: '';
          position: absolute;
          inset: 5% 2% -4% -8%;
          z-index: -1;
          pointer-events: none;
          background:
            radial-gradient(circle at 48% 38%, rgba(180, 145, 255, 0.52), transparent 31%),
            radial-gradient(circle at 58% 62%, rgba(98, 48, 255, 0.58), transparent 50%),
            radial-gradient(circle at 20% 56%, rgba(0, 206, 201, 0.18), transparent 34%);
          filter: blur(30px);
          opacity: 1;
          mix-blend-mode: screen;
        }

        .hero-character::after {
          content: '';
          position: absolute;
          inset: 9% 2% 2% 12%;
          z-index: -1;
          pointer-events: none;
          background: conic-gradient(from 215deg at 50% 50%, transparent 0deg, rgba(132, 92, 255, 0.46) 72deg, transparent 145deg, rgba(0, 206, 201, 0.2) 222deg, transparent 310deg);
          border-radius: 50%;
          filter: blur(28px);
          opacity: 0.88;
          transform: rotate(-10deg);
        }

        .hero-character-art {
          filter:
            hue-rotate(8deg)
            saturate(1.08)
            drop-shadow(0 24px 34px rgba(0, 0, 0, 0.66))
            drop-shadow(0 0 28px rgba(184, 150, 255, 0.78))
            drop-shadow(0 0 74px rgba(112, 66, 255, 0.62))
            drop-shadow(0 0 118px rgba(72, 28, 196, 0.42));
          transform-origin: 50% 78%;
          will-change: transform;
        }

        .iphone-stage {
          position: relative;
          width: 570px;
          flex: 0 0 auto;
          transform: rotate(-6deg);
          transform-origin: left bottom;
          filter:
            drop-shadow(0 30px 70px rgba(122, 95, 255, 0.9))
            drop-shadow(0 0 34px rgba(174, 138, 255, 0.68))
            drop-shadow(0 0 82px rgba(92, 44, 238, 0.54));
          will-change: transform;
        }

        .iphone-stage::before {
          content: '';
          position: absolute;
          inset: 18% 4% -18% -6%;
          z-index: -1;
          background:
            radial-gradient(circle at 45% 46%, rgba(184, 150, 255, 0.58) 0%, rgba(112, 90, 255, 0.38) 32%, transparent 70%),
            radial-gradient(circle at 76% 52%, rgba(0, 206, 201, 0.16), transparent 38%);
          filter: blur(50px);
        }

        .iphone-stage::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(142, 118, 255, 0.42), rgba(108, 92, 231, 0.16) 44%, rgba(0, 206, 201, 0.1));
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
          filter: contrast(1.16) saturate(0.88) hue-rotate(18deg);
        }

        .hero-cta {
          pointer-events: auto;
          position: absolute;
          left: 50%;
          top: 75%;
          transform: translate(-50%);
          z-index: 4;
          background:
            radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.28), transparent 34%),
            linear-gradient(135deg, #19084f 0%, #4f24e7 52%, #00c8ff 145%);
          border: 2px solid #c2b7ff;
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
          transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          box-shadow:
            0 0 20px rgba(194, 183, 255, 0.74),
            0 0 52px rgba(75, 36, 231, 0.82),
            0 0 74px rgba(0, 200, 255, 0.28),
            0 16px 42px rgba(18, 6, 80, 0.72),
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            inset 0 -3px 10px rgba(0, 0, 0, 0.3);
        }

        .hero-cta::before {
          content: '';
          position: absolute;
          inset: -35% -45%;
          background: linear-gradient(115deg, transparent 18%, rgba(255, 255, 255, 0.42) 42%, rgba(0, 206, 201, 0.28) 50%, transparent 68%);
          transform: translateX(-72%) rotate(8deg);
          transition: transform 0.72s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .hero-cta span {
          position: relative;
          z-index: 1;
        }

        .hero-cta:hover {
          background:
            radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.36), transparent 34%),
            linear-gradient(135deg, #21076d 0%, #6a45ff 54%, #00d9ff 142%);
          border-color: #ffffff;
          box-shadow:
            0 0 28px rgba(255, 255, 255, 0.82),
            0 0 70px rgba(108, 92, 231, 0.98),
            0 0 92px rgba(0, 217, 255, 0.38),
            0 18px 50px rgba(34, 12, 123, 0.72),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -3px 10px rgba(0, 0, 0, 0.28);
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
          .hero-cta {
            animation: ctaEnergy 3.2s ease-in-out infinite;
          }

          @keyframes ctaEnergy {
            0%, 100% {
              box-shadow:
                0 0 20px rgba(194, 183, 255, 0.7),
                0 0 52px rgba(75, 36, 231, 0.78),
                0 0 74px rgba(0, 200, 255, 0.24),
                0 16px 42px rgba(18, 6, 80, 0.72),
                inset 0 1px 0 rgba(255, 255, 255, 0.22),
                inset 0 -3px 10px rgba(0, 0, 0, 0.3);
            }
            50% {
              box-shadow:
                0 0 28px rgba(255, 255, 255, 0.86),
                0 0 68px rgba(108, 92, 231, 0.96),
                0 0 94px rgba(0, 217, 255, 0.34),
                0 18px 50px rgba(18, 6, 80, 0.78),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -3px 10px rgba(0, 0, 0, 0.3);
            }
          }
        }

        .hero-section.hero-7 {
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

        .hero-main-title span {
          display: block;
          color: #ffffff;
          -webkit-text-fill-color: #ffffff;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.28);
          filter: drop-shadow(0 0 14px rgba(255, 255, 255, 0.58)) drop-shadow(0 0 34px rgba(108, 92, 231, 0.76));
          text-shadow:
            0 2px 0 rgba(7, 4, 20, 0.92),
            0 0 20px rgba(255, 255, 255, 0.55),
            0 0 58px rgba(108, 92, 231, 0.9),
            0 10px 30px rgba(0, 0, 0, 0.86);
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

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to bottom, transparent 0%, var(--bh-ink) 100%);
          pointer-events: none;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
