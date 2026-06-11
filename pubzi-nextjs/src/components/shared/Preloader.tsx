'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const HOME_PRELOAD_ASSETS = [
  '/assets/video/background_1.webm',
  '/assets/video/background_1.mp4',
  '/assets/video/background_1_pingpong.webm',
  '/assets/video/background_1_pingpong.mp4',
  '/assets/img/landing-page/shape-2.png',
  '/assets/img/landing-page/iphone_2.png',
  '/assets/img/home-7/3d/3d_4.glb',
  '/assets/img/home-7/about/bg-shape.png',
  '/assets/img/home-7/about/ellipse.png',
  '/assets/img/home-7/service-bg.jpg',
  '/assets/img/home-7/dot.png',
  '/assets/img/home-7/icon/01.svg',
  '/assets/img/home-7/icon/02.svg',
  '/assets/img/home-7/icon/03.svg',
  '/assets/img/home-7/icon/04.svg',
  '/assets/img/logo/white-logo.svg',
  '/assets/img/logo/white-logo-3.svg',
  '/assets/img/logo/dot.svg',
  '/assets/img/header/home-7.jpg',
  '/assets/img/home-3/game-case-study/game-01.jpg',
  '/assets/img/home-3/game-case-study/game-02.jpg',
  '/assets/img/home-3/game-case-study/game-03.jpg',
  '/assets/img/home-3/game-case-study/game-04.jpg',
  '/assets/img/home-3/game-case-study/game-05.jpg',
  '/assets/img/home-3/game-case-study/game-06.jpg',
  '/assets/img/home-3/top-feature.png',
  '/assets/img/home-3/ellipse-bg.png',
  '/assets/img/home-3/icon/12.svg',
  '/assets/img/home-3/icon/13.svg',
  '/assets/img/home-3/icon/14.svg',
  '/assets/img/home-3/team/team-01.jpg',
  '/assets/img/home-3/team/team-02.jpg',
  '/assets/img/home-3/team/team-03.jpg',
  '/assets/img/home-3/team/team-04.jpg',
  '/assets/img/home-3/team/ellipse.png',
  '/assets/img/home-3/testimonial/client-1.png',
  '/assets/img/home-3/testimonial-image.png',
  '/assets/img/home-3/counter-bg.jpg',
  '/assets/img/home-3/news/news-01.jpg',
  '/assets/img/home-3/news/news-02.jpg',
  '/assets/img/home-3/news/news-03.jpg',
  '/assets/img/home-5/Footer.png',
];

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

function preloadFile(src: string) {
  return fetch(src, { cache: 'force-cache' })
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to preload ${src}`);
      return response.arrayBuffer();
    })
    .then(() => undefined)
    .catch(() => undefined);
}

function preloadAsset(src: string) {
  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(src)) {
    return preloadImage(src);
  }

  return preloadFile(src);
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
      const totalAssets = HOME_PRELOAD_ASSETS.length + 1;
      let completedAssets = 0;

      const markComplete = () => {
        completedAssets += 1;
        if (!cancelled) {
          setProgress(Math.min(99, Math.round((completedAssets / totalAssets) * 100)));
        }
      };

      await Promise.all([
        ...HOME_PRELOAD_ASSETS.map((asset) => preloadAsset(asset).finally(markComplete)),
        document.fonts.ready.then(markComplete).catch(markComplete),
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
