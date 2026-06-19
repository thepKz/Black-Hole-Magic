'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function TitleLetters({ text }: { text: string }) {
  return (
    <div className="hero-main-title hero-title-stars" role="heading" aria-level={1} aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span className="ht-word" aria-hidden="true" key={w}>
          {word.split('').map((ch, i) => <span className="ht-letter" key={i}>{ch}</span>)}
        </span>
      ))}
    </div>
  );
}

export default function HeroSection7() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frostRef = useRef<HTMLVideoElement>(null);
  const phoneImageRef = useRef<HTMLImageElement>(null);

  // Video visibility observer - extended to both videos, respects mobile + reduced motion
  useEffect(() => {
    const video = videoRef.current;
    const frost = frostRef.current;
    const hero = heroRef.current;
    if (!video || !frost || !hero) return;

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mobileQuery.matches || motionQuery.matches) {
      video.pause();
      frost.pause();
      return;
    }

    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target, e.isIntersecting));
        const anyVisible = [...visible.values()].some(Boolean);
        if (anyVisible) {
          video.style.visibility = 'visible';
          frost.style.visibility = 'visible';
          video.play().catch(() => {});
          // Frost respects opacity guard from section 4
          if (frost.style.opacity !== '0') {
            frost.play().catch(() => {});
          }
        } else {
          video.pause();
          frost.pause();
          video.style.visibility = 'hidden';
          frost.style.visibility = 'hidden';
        }
      },
      { rootMargin: '10% 0px' }
    );
    io.observe(hero);
    const about = document.querySelector('.about-story');
    if (about) io.observe(about);

    const handleMobileChange = () => {
      if (mobileQuery.matches || motionQuery.matches) {
        video.pause();
        frost.pause();
        io.disconnect();
      }
    };

    mobileQuery.addEventListener('change', handleMobileChange);
    motionQuery.addEventListener('change', handleMobileChange);

    return () => {
      io.disconnect();
      mobileQuery.removeEventListener('change', handleMobileChange);
      motionQuery.removeEventListener('change', handleMobileChange);
    };
  }, []);

  // Preloader gating + choreography
  useEffect(() => {
    if (!heroRef.current) return;

    let startTimer: number | undefined;
    let settleFrameOne: number | undefined;
    let settleFrameTwo: number | undefined;
    let hasStarted = false;
    let isCancelled = false;

    const mm = gsap.matchMedia(heroRef);
    gsap.set(['.iphone-float', '.hero-title-block'], { autoAlpha: 0 });

    const waitForPhoneImage = () =>
      new Promise<void>((resolve) => {
        const image = phoneImageRef.current;
        if (!image) {
          resolve();
          return;
        }

        const finish = () => {
          image.decode?.().catch(() => undefined).finally(resolve);
        };

        if (image.complete && image.naturalWidth > 0) {
          finish();
          return;
        }

        image.addEventListener('load', finish, { once: true });
        image.addEventListener('error', () => resolve(), { once: true });
      });

    const waitForFonts = () => document.fonts?.ready.catch(() => undefined) ?? Promise.resolve();

    const waitForSettledPaint = () =>
      new Promise<void>((resolve) => {
        settleFrameOne = window.requestAnimationFrame(() => {
          settleFrameTwo = window.requestAnimationFrame(() => resolve());
        });
      });

    // Desktop choreography - created only after preloader, media, fonts, and paint settle.
    const addDesktopChoreography = () => mm.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
      const pinRange = heroRef.current!.closest('.hero-pin-range') ?? heroRef.current!.parentElement!;
      const tl = gsap.timeline({
        defaults: { ease: 'none', force3D: true, immediateRender: false },
        scrollTrigger: {
          trigger: pinRange,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tl.totalDuration(110);

      // Phase 1: zoom (0 -> 18)
      tl.addLabel('zoom', 0);
      tl.fromTo('.iphone-stage',
        { scale: 1, transformOrigin: '50% 50%' },
        { scale: 1.12, duration: 18 },
        0
      );

      // Phase 2: videoDrift (0 -> 110)
      tl.addLabel('videoDrift', 0);
      if (videoRef.current) {
        tl.fromTo(videoRef.current,
          { scale: 1, transformOrigin: '50% 50%' },
          { scale: 1.035, duration: 110 },
          0
        );
      }

      // Phase 3: phoneExit (14 -> 30)
      tl.addLabel('phoneExit', 14);
      tl.fromTo('.iphone-stage',
        { yPercent: 0, scale: 1.12 },
        { yPercent: -145, scale: 1.18, duration: 16, ease: 'power1.in' },
        14
      );

      // Phase 4: phoneFade (22 -> 32)
      tl.addLabel('phoneFade', 22);
      tl.fromTo('.iphone-stage',
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 10 },
        22
      );

      // Phase 5: titleIn (20 -> 30)
      tl.addLabel('titleIn', 20);
      tl.fromTo('.hero-title-block',
        { autoAlpha: 0, scale: 0.86, transformOrigin: '50% 50%' },
        { autoAlpha: 1, scale: 1.0, duration: 10 },
        20
      );

      // Phase 6: titleLetters (20 -> 32, stagger)
      tl.addLabel('titleLetters', 20);
      tl.fromTo('.hero-title-block .ht-letter',
        { autoAlpha: 0, yPercent: 36 },
        { autoAlpha: 1, yPercent: 0, duration: 4, stagger: 0.35 },
        20
      );

      // Phase 7: titleGrow (30 -> 36)
      tl.addLabel('titleGrow', 30);
      tl.fromTo('.hero-title-block',
        { scale: 1.0 },
        { scale: 1.08, duration: 6 },
        30
      );

      // Phase 8: titleOut (36 -> 44)
      tl.addLabel('titleOut', 36);
      tl.fromTo('.hero-title-block',
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 8 },
        36
      );

      // Phase 9: contrastOut (44 -> 66)
      tl.addLabel('contrastOut', 44);
      tl.fromTo('.hero-contrast-layer',
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 22 },
        44
      );

      tl.progress(0);
    });

    // Mobile + reduced motion fallback
    mm.add('(max-width: 991px), (prefers-reduced-motion: reduce)', () => {
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isReducedMotion) {
        gsap.set(['.iphone-float', '.hero-title-block'], {
          opacity: 1,
          clearProps: 'visibility,transform,filter'
        });
        videoRef.current?.pause();
        frostRef.current?.pause();
      }
    });

    // Preloader gating
    const startHeroAnimations = async () => {
      if (hasStarted) return;
      hasStarted = true;

      await Promise.all([waitForPhoneImage(), waitForFonts()]);
      await waitForSettledPaint();
      if (isCancelled) return;

      const isMobile = window.matchMedia('(max-width: 991px)').matches;
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isDesktopAnimated = !isMobile && !isReducedMotion;

      if (isDesktopAnimated) {
        addDesktopChoreography();
        ScrollTrigger.refresh();

        gsap.fromTo('.iphone-float',
          { autoAlpha: 0, y: 46, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            onComplete: () => {
              gsap.to('.iphone-float', {
                y: -8,
                rotation: 0.6,
                duration: 4.6,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                force3D: true
              });
            }
          }
        );
      } else if (!isReducedMotion) {
        // Mobile with motion OK
        gsap.fromTo(['.hero-title-block', '.iphone-float'],
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' }
        );
      }

      if (!isMobile && !isReducedMotion) {
        videoRef.current?.play().catch(() => {});
      } else {
        videoRef.current?.pause();
        frostRef.current?.pause();
      }
    };

    const handlePreloaderComplete = () => {
      startHeroAnimations();
    };

    if (document.body.dataset.preloaderDone === 'true' || !document.querySelector('[data-preloader="black-hole"]')) {
      startHeroAnimations();
    } else {
      window.addEventListener('black-hole:preloader-complete', handlePreloaderComplete, { once: true });
      startTimer = window.setTimeout(handlePreloaderComplete, 5200);
    }

    return () => {
      isCancelled = true;
      if (startTimer) window.clearTimeout(startTimer);
      if (settleFrameOne) window.cancelAnimationFrame(settleFrameOne);
      if (settleFrameTwo) window.cancelAnimationFrame(settleFrameTwo);
      window.removeEventListener('black-hole:preloader-complete', handlePreloaderComplete);
      mm.revert();
    };
  }, []);

  return (
    <>
      {/* Base video */}
      <video
        ref={videoRef}
        className="hero-video-bg"
        loop
        muted
        playsInline
        preload="none"
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

      {/* Frost twin */}
      <video
        ref={frostRef}
        className="hero-video-frost"
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <source src="/assets/video/background_1_pingpong.webm" type="video/webm" />
        <source src="/assets/video/background_1_pingpong.mp4" type="video/mp4" />
      </video>

      <div ref={heroRef} className="hero-section hero-7" style={{
        ['--bh-purple' as string]: '#6C5CE7',
        ['--bh-ink' as string]: '#06060A',
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

        {/* Tech backdrop — mobile only (display:none ≥768px). Grid, diagonal
            beams, particles. All opacity ≤0.15 so it reads as texture. */}
        <div className="hero-tech-fx" aria-hidden="true">
          <span className="htf-grid" />
          <span className="htf-beam htf-beam-1" />
          <span className="htf-beam htf-beam-2" />
          <span className="htf-beam htf-beam-3" />
          <span className="htf-dot htf-dot-1" />
          <span className="htf-dot htf-dot-2" />
          <span className="htf-dot htf-dot-3" />
          <span className="htf-dot htf-dot-4" />
          <span className="htf-dot htf-dot-5" />
          <span className="htf-dot htf-dot-6" />
        </div>

        {/* Corner frame SVG */}
        <svg style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
        }} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 0 150 L 0 0 L 200 0" stroke="var(--bh-purple)" strokeWidth="2" vectorEffect="non-scaling-stroke" fill="none" opacity="0.6" />
          <path d="M 1000 850 L 1000 1000 L 800 1000" stroke="var(--bh-purple)" strokeWidth="2" vectorEffect="non-scaling-stroke" fill="none" opacity="0.6" />
        </svg>

        {/* CENTERED PHONE */}
        <div className="hero-phone-wrap">
          <div className="iphone-stage">
            <div className="iphone-float" style={{ opacity: 0, visibility: 'hidden' }}>
              <Image
                ref={phoneImageRef}
                src="/assets/img/landing-page/iphone_2.png"
                alt="Trải nghiệm game trên iPhone"
                className="iphone-art"
                width={1920}
                height={1080}
                priority
                sizes="(min-width: 992px) 62vw, 92vw"
              />
             
            </div>
          </div>
        </div>

        {/* CENTERED TITLE */}
        <div className="hero-title-wrap">
          <div className="hero-title-block" style={{ opacity: 0, visibility: 'hidden' }}>
            <div className="hero-kicker-text" style={{
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--bh-purple)',
              marginBottom: '28px',
              textAlign: 'center',
            }}>
              Nền tảng gaming Việt
            </div>
            <TitleLetters text="BLACK HOLE GAME" />
          </div>
        </div>

        <style jsx global>{`
          .hero-pin-range {
            position: relative;
            isolation: isolate;
            background: #06060a;
          }

          .hero-scroll-spacer {
            height: 120vh;
            height: 120dvh;
          }

          @media (max-width: 991px) {
            .hero-scroll-spacer {
              height: 90vh;
              height: 90dvh;
            }
          }

          /* Base video: filter is now permanent */
          .hero-video-bg {
            filter: contrast(1.2) brightness(0.85);
          }

          /* Frost twin: permanently blurred; ONLY opacity is animated */
          .hero-video-frost {
            display: none;
            filter: blur(16px) saturate(1.25) contrast(1.08) brightness(0.7);
          }

          /* Hide both videos on small screens */
          @media (max-width: 767px) {
            .hero-video-bg, .hero-video-frost {
              display: none;
            }
            .hero-section.hero-7 {
              padding-top: 80px !important;
              padding-bottom: 60px !important;
              background:
                radial-gradient(circle at 50% 38%, rgba(108,92,231,0.42), rgba(40,12,118,0.14) 34%, transparent 60%),
                linear-gradient(180deg, #0a0718 0%, #06060A 100%) !important;
            }
          }

          /* Tech backdrop — hidden on desktop, activated only on mobile. */
          .hero-tech-fx { display: none; }

          @media (max-width: 767px) {
            .hero-tech-fx {
              display: block;
              position: absolute;
              inset: 0;
              z-index: 1;
              pointer-events: none;
              overflow: hidden;
            }

            /* Faint technical grid fading out toward edges. */
            .htf-grid {
              position: absolute;
              inset: -1px;
              background-image:
                linear-gradient(rgba(176, 156, 255, 0.55) 1px, transparent 1px),
                linear-gradient(90deg, rgba(176, 156, 255, 0.55) 1px, transparent 1px);
              background-size: 44px 44px;
              opacity: 0.14;
              -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 42%, #000 0%, transparent 82%);
              mask-image: radial-gradient(ellipse 90% 70% at 50% 42%, #000 0%, transparent 82%);
            }

            /* Thin diagonal light-purple beams. */
            .htf-beam {
              position: absolute;
              top: -10%;
              width: 1px;
              height: 130%;
              background: linear-gradient(180deg, transparent 0%, rgba(176, 156, 255, 0.95) 50%, transparent 100%);
              filter: blur(0.5px);
              transform: rotate(22deg);
              transform-origin: top center;
              will-change: transform;
            }

            .htf-beam-1 {
              left: 18%;
              opacity: 0.22;
              animation: htf-beam-drift 14s ease-in-out infinite;
            }

            .htf-beam-2 {
              left: 52%;
              opacity: 0.14;
              height: 110%;
              animation: htf-beam-drift 19s ease-in-out infinite reverse;
              animation-delay: -5s;
            }

            .htf-beam-3 {
              left: 78%;
              opacity: 0.18;
              animation: htf-beam-drift 11s ease-in-out infinite;
              animation-delay: -8s;
            }

            @keyframes htf-beam-drift {
              0%, 100% { transform: rotate(22deg) translateX(-12px); }
              50%       { transform: rotate(22deg) translateX(16px); }
            }

            /* Small glowing particles. */
            .htf-dot {
              position: absolute;
              width: 2px;
              height: 2px;
              border-radius: 50%;
              background: #c4b8ff;
              box-shadow: 0 0 5px 1px rgba(139, 122, 232, 0.9);
              will-change: transform, opacity;
              animation: htf-dot-float 9s ease-in-out infinite;
            }

            .htf-dot-1 { left: 9%;  top: 18%; opacity: 0.15; animation-delay: 0s; }
            .htf-dot-2 { left: 31%; top: 72%; opacity: 0.10; animation-delay: -2s;  width: 3px; height: 3px; }
            .htf-dot-3 { left: 61%; top: 24%; opacity: 0.13; animation-delay: -4s; }
            .htf-dot-4 { left: 85%; top: 60%; opacity: 0.09; animation-delay: -1s;  width: 3px; height: 3px; }
            .htf-dot-5 { left: 47%; top: 50%; opacity: 0.12; animation-delay: -6s; }
            .htf-dot-6 { left: 73%; top: 36%; opacity: 0.08; animation-delay: -3s; }

            @keyframes htf-dot-float {
              0%, 100% { transform: translateY(0px);   opacity: 0.10; }
              50%       { transform: translateY(-12px); opacity: 0.22; }
            }

            @media (prefers-reduced-motion: reduce) {
              .htf-beam, .htf-dot { animation: none; }
            }
          }

          /* DEFAULT (mobile + reduced motion) = static stacked layout */
          .hero-phone-wrap {
            position: relative;
            z-index: 3;
            display: flex;
            justify-content: center;
            padding: 0 20px;
          }

          .hero-title-wrap {
            position: relative;
            z-index: 4;
            display: flex;
            justify-content: center;
            text-align: center;
            padding: 0 20px;
            margin-bottom: 34px;
          }

          .iphone-stage {
            width: min(92vw, 560px);
            aspect-ratio: 16 / 9;
          }

          .hero-section.hero-7 {
            flex-direction: column;
            justify-content: center;
          }

          /* ANIMATED DESKTOP */
          @media (min-width: 992px) and (prefers-reduced-motion: no-preference) {
            .hero-phone-wrap, .hero-title-wrap {
              position: absolute;
              inset: 0;
              z-index: 3;
              display: flex;
              align-items: center;
              justify-content: center;
              pointer-events: none;
              padding: 0;
            }
            .hero-title-wrap {
              z-index: 4;
            }
            .iphone-stage {
              width: min(62vw, 980px);
              will-change: transform, opacity;
            }
            .hero-title-block {
              opacity: 0;
              will-change: transform, opacity;
              text-align: center;
            }
            .hero-title-stars .ht-letter {
              will-change: transform, opacity;
            }
          }

          .iphone-float {
            position: relative;
          }

          .iphone-float::before {
            content: '';
            position: absolute;
            inset: 18% 4% -18% -6%;
            z-index: -1;
            background:
              radial-gradient(circle at 45% 46%, rgba(134, 69, 255, 0.38) 0%, rgba(70, 24, 204, 0.26) 34%, transparent 68%);
            filter: blur(24px) contrast(1.18);
          }

          .iphone-float::after {
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

          .iphone-stage {
            position: relative;
            filter:
              drop-shadow(0 28px 54px rgba(20, 5, 74, 0.82))
              drop-shadow(0 0 12px rgba(119, 58, 255, 0.36))
              drop-shadow(0 0 30px rgba(56, 13, 170, 0.32));
          }

          .iphone-art {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
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

          .hero-main-title {
            font-size: clamp(42px, 7vw, 104px);
            font-weight: 900;
            font-family: var(--font-title-extra);
            line-height: 1.08;
            margin: 0;
            text-transform: uppercase;
            color: #fff;
          }

          .ht-word {
            display: inline-block;
            white-space: nowrap;
            margin-right: 0.3em;
          }

          .ht-word:last-child {
            margin-right: 0;
          }

          .ht-letter {
            display: inline-block;
          }

          .hero-title-stars .ht-letter {
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
          }

          @media (min-width: 992px) and (prefers-reduced-motion: no-preference) {
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

            .hero-title-stars .ht-letter {
              animation: titleWhitePulse 4.8s ease-in-out infinite;
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

            @keyframes titleWhitePulse {
              0%, 100% {
                filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 12px rgba(102, 42, 255, 0.4));
              }
              50% {
                filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.44)) drop-shadow(0 0 18px rgba(102, 42, 255, 0.52));
              }
            }
          }

          .hero-section.hero-7 {
            position: sticky !important;
            width: 100vw !important;
            max-width: 100vw !important;
            min-height: max(760px, 100dvh) !important;
            margin-left: calc(50% - 50vw) !important;
            margin-right: calc(50% - 50vw) !important;
          }

          @supports not (height: 100dvh) {
            .hero-section.hero-7 {
              min-height: max(760px, 100vh) !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
