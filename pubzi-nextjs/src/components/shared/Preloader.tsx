'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Progress counter animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

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

    // Exit animation when loaded
    const exitTimer = setTimeout(() => {
      if (preloaderRef.current) {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            setIsLoaded(true);
          },
        });
      }
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
      ctx.revert();
    };
  }, []);

  if (isLoaded) return null;

  return (
    <div
      ref={preloaderRef}
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
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        gap: '4px',
        marginBottom: '20px',
        perspective: '1000px',
      }}>
        {['B', 'L', 'A', 'C', 'K', ' ', 'H', 'O', 'L', 'E'].map((letter, i) => (
          <span
            key={i}
            className="letter"
            style={{
              fontSize: '48px',
              fontWeight: 900,
              fontFamily: 'Orbitron, sans-serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #6C5CE7 50%, #00CEC9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px rgba(108, 92, 231, 0.6)',
              display: 'inline-block',
              marginRight: letter === ' ' ? '12px' : '0',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Loading Text */}
      <div style={{
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        color: '#00CEC9',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom: '30px',
        textShadow: '0 0 10px #00CEC9',
      }}>
        LOADING
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '300px',
        height: '4px',
        background: 'rgba(108, 92, 231, 0.2)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
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
        marginTop: '15px',
        fontSize: '24px',
        fontFamily: 'Orbitron, sans-serif',
        fontWeight: 700,
        color: '#6C5CE7',
        textShadow: '0 0 20px #6C5CE7',
      }}>
        {Math.min(Math.round(progress), 100)}%
      </div>

      {/* Tagline */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        fontSize: '11px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        WHERE DIGITAL WORLDS CONVERGE
      </div>
      </div>
    </div>
  );
}
