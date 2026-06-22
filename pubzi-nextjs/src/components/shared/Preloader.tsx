'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

// Light assets: images + svg used across the home-7 experience. They warm the
// browser image cache and contribute the "light" slice of the progress bar.
const HOME_PRELOAD_ASSETS = [
  '/assets/img/header/home-7.jpg',
  '/assets/img/home-7/about/bg-shape.png',
  '/assets/img/home-7/about/ellipse.png',
  '/assets/img/home-2/news/news-01.jpg',
  '/assets/img/home-2/news/news-02.jpg',
  '/assets/img/home-2/news/news-03.jpg',
  '/assets/img/home-3/ellipse-bg.png',
  '/assets/img/home-3/icon/12.svg',
  '/assets/img/home-3/icon/13.svg',
  '/assets/img/home-3/icon/14.svg',
  '/assets/img/home-3/top-feature.png',
  '/assets/img/landing-page/game/VLTK.png',
  '/assets/img/landing-page/game/tieu-ngao-giang-ho.png',
  '/assets/img/landing-page/game/kiem-the.png',
  '/assets/img/landing-page/game/con-duong-to-lua.png',
  '/assets/img/landing-page/game/thien-long-bat-bo.png',
  '/assets/img/landing-page/kol/gray_FPT.jpg',
  '/assets/img/landing-page/kol/betroc_FPT.jpg',
  '/assets/img/landing-page/kol/quanghai_FPT.jpg',
  '/assets/img/landing-page/kol/huyhoang_FPT.jpg',
  '/assets/img/landing-page/kol/yutan_FPT.jpg',
  '/assets/img/landing-page/iphone_2.png',
  '/assets/img/landing-page/shape-2.png',
  '/assets/img/landing-page/test_lan_thu_9.png',
  '/assets/img/logo/white-logo-2.png',
  '/assets/img/logo/white-logo-3.svg',
  '/assets/img/logo/dot.svg',
];

// Heavy assets streamed via fetch so the bar tracks real byte progress. Keep
// below-the-fold 3D out of this list so the first load is not blocked by WebGL.
const HOME_HEAVY_ASSETS = [
    '/assets/img/home-7/3d/3d_9.glb',
  '/assets/video/background_1.webm',
  '/assets/video/background_1_pingpong.webm',
];

// The heavy bucket dominates transfer size, so it owns most of the progress bar.
const HEAVY_PROGRESS_WEIGHT = 0.8;
const LIGHT_PROGRESS_WEIGHT = 1 - HEAVY_PROGRESS_WEIGHT;

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      image.decode?.().catch(() => undefined).finally(resolve);
    };
    image.onerror = () => resolve();
    image.src = src;
  });
}

function preloadAsset(src: string) {
  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(src)) {
    return preloadImage(src);
  }

  return Promise.resolve();
}

// Stream a file to completion, reporting bytes received vs. its content-length.
// Reading the whole body lands the full file in the HTTP cache. Falls back to a
// best-effort resolve when streaming/headers are unavailable so the user is
// never trapped behind the preloader.
function streamAsset(src: string, onBytes: (received: number, total: number) => void) {
  return (async () => {
    try {
      const response = await fetch(src, { cache: 'force-cache' });
      if (!response.ok || !response.body) {
        onBytes(1, 1);
        return;
      }

      const total = Number(response.headers.get('content-length') || 0);
      const reader = response.body.getReader();
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value?.length ?? 0;
        if (total > 0) onBytes(received, total);
      }

      // Ensure the bucket reads as complete even without a content-length.
      onBytes(total || received || 1, total || received || 1);
    } catch {
      onBytes(1, 1);
    }
  })();
}

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.dataset.preloaderDone = 'false';
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const startedAt = performance.now();
    let cancelled = false;

    const completePreloader = () => {
      if (cancelled) return;

      setProgress(100);

      const elapsed = performance.now() - startedAt;
      const remainingMinimumTime = Math.max(0, 900 - elapsed);

      window.setTimeout(() => {
        if (cancelled || !preloaderRef.current) return;

        gsap.to(preloaderRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            document.body.dataset.preloaderDone = 'true';
            document.body.style.overflow = originalOverflow;
            window.dispatchEvent(new Event('black-hole:preloader-complete'));
            setIsLoaded(true);
          },
        });
      }, remainingMinimumTime);
    };

    const loadHomepageAssets = async () => {
      // Light bucket: small images + fonts, counted per-item. Heavy bucket:
      // background videos, summed by real bytes. The bar combines both by
      // weight so it reflects the actual download.
      const lightTotal = HOME_PRELOAD_ASSETS.length + 1;
      let lightDone = 0;
      let lightFraction = 0;

      // Track per-file byte progress for the heavy bucket and sum into a fraction.
      const heavyReceived = new Array(HOME_HEAVY_ASSETS.length).fill(0);
      const heavyTotals = new Array(HOME_HEAVY_ASSETS.length).fill(0);
      let heavyFraction = 0;

      const updateProgress = () => {
        if (cancelled) return;
        const combined =
          lightFraction * LIGHT_PROGRESS_WEIGHT + heavyFraction * HEAVY_PROGRESS_WEIGHT;
        setProgress(Math.min(99, Math.round(combined * 100)));
      };

      const markLightComplete = () => {
        lightDone += 1;
        lightFraction = lightDone / lightTotal;
        updateProgress();
      };

      const recomputeHeavy = () => {
        const received = heavyReceived.reduce((a, b) => a + b, 0);
        const total = heavyTotals.reduce((a, b) => a + b, 0);
        heavyFraction = total > 0 ? Math.min(received / total, 1) : 0;
        updateProgress();
      };

      await Promise.all([
        ...HOME_PRELOAD_ASSETS.map((asset) => preloadAsset(asset).finally(markLightComplete)),
        document.fonts.ready.then(markLightComplete).catch(markLightComplete),
        ...HOME_HEAVY_ASSETS.map((asset, index) =>
          streamAsset(asset, (received, total) => {
            heavyReceived[index] = received;
            heavyTotals[index] = total;
            recomputeHeavy();
          })
        ),
      ]);

      completePreloader();
    };

    // GSAP animations
    const ctx = gsap.context(() => {
      // Particles animation
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll('.particle');
        particles.forEach((particle) => {
          const randomX = Math.random() * window.innerWidth;
          const randomY = Math.random() * window.innerHeight;
          const randomDelay = Math.random() * 2;

          gsap.fromTo(
            particle,
            {
              x: randomX,
              y: randomY,
              opacity: 1,
              scale: 1,
            },
            {
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
              opacity: 0,
              scale: 0,
              duration: 2 + Math.random() * 2,
              ease: 'power2.in',
              repeat: -1,
              delay: randomDelay,
            }
          );
        });
      }

      // Letter stagger animation
      const letters = document.querySelectorAll('.letter');
      gsap.fromTo(
        letters,
        { opacity: 0, y: 50, rotationX: -90 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          delay: 0.3,
        }
      );

      // Glow pulse
      gsap.to('.brand-text', {
        textShadow: '0 0 30px rgba(108, 92, 231, 1), 0 0 60px rgba(108, 92, 231, 0.8)',
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    loadHomepageAssets();

    return () => {
      cancelled = true;
      document.body.style.overflow = originalOverflow;
      ctx.revert();
    };
  }, []);

  if (isLoaded) return null;

  return (
    <div
      ref={preloaderRef}
      data-preloader="black-hole"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a0c 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        overflow: 'hidden',
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'cover',
          opacity: 0.8,
          filter: 'brightness(0.7)',
        }}
      >
        <source src="/assets/video/background_1.webm" type="video/webm" />
        <source src="/assets/video/background_1.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(10, 10, 12, 0.3) 0%, rgba(10, 10, 12, 0.7) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content wrapper */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'min(92vw, 720px)',
        padding: '0 20px',
        overflow: 'visible',
      }}>
        {/* Particles */}
        <div ref={particlesRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: i % 2 === 0 ? '#6C5CE7' : '#00CEC9',
                boxShadow: `0 0 10px ${i % 2 === 0 ? '#6C5CE7' : '#00CEC9'}`,
              }}
            />
          ))}
        </div>

        {/* Brand Text */}
      <div className="brand-text" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'clamp(2px, 0.8vw, 6px)',
        width: '100%',
        maxWidth: '100%',
        marginBottom: '20px',
        perspective: '1000px',
        overflow: 'visible',
        whiteSpace: 'nowrap',
      }}>
        {['B', 'L', 'A', 'C', 'K', ' ', 'H', 'O', 'L', 'E'].map((letter, i) => (
          <span
            key={i}
            className="letter"
            style={{
              fontSize: 'clamp(28px, 7.6vw, 52px)',
              fontWeight: 900,
              fontFamily: 'Orbitron, sans-serif',
              lineHeight: 1.15,
              background: 'linear-gradient(135deg, #ffffff 0%, #6C5CE7 50%, #00CEC9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px rgba(108, 92, 231, 0.6)',
              display: 'inline-block',
              marginRight: letter === ' ' ? 'clamp(8px, 2vw, 18px)' : '0',
              padding: '0 1px 4px',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Loading Text - HIDDEN */}
      <div style={{ display: 'none' }}>
        LOADING
      </div>

      {/* Progress Bar */}
      <div style={{
        width: 'min(300px, 76vw)',
        height: '4px',
        background: 'rgba(108, 92, 231, 0.2)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 0 18px rgba(0, 206, 201, 0.22)',
      }}>
        <div style={{
          width: `${Math.min(progress, 100)}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #6C5CE7 0%, #00CEC9 100%)',
          borderRadius: '2px',
          boxShadow: '0 0 10px #6C5CE7',
          transition: 'width 0.3s ease-out',
        }} />
      </div>

      {/* Progress Counter */}
      <div style={{
        marginTop: '16px',
        minWidth: '76px',
        padding: '6px 12px',
        fontSize: 'clamp(20px, 5vw, 28px)',
        fontFamily: 'Orbitron, sans-serif',
        fontWeight: 800,
        color: '#AFA2FF',
        textAlign: 'center',
        lineHeight: 1,
        borderRadius: '8px',
        background: 'rgba(6, 6, 10, 0.42)',
        border: '1px solid rgba(108, 92, 231, 0.32)',
        textShadow: '0 0 16px rgba(175, 162, 255, 0.95), 0 0 28px rgba(0, 206, 201, 0.45)',
        boxShadow: '0 0 22px rgba(108, 92, 231, 0.26)',
        position: 'relative',
        zIndex: 3,
      }}>
        {Math.min(Math.round(progress), 100)}%
      </div>

      {/* Tagline - HIDDEN */}
      <div style={{ display: 'none' }}>
        WHERE DIGITAL WORLDS CONVERGE
      </div>
      </div>
    </div>
  );
}
