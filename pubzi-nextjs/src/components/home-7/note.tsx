'use client';

import { useEffect, useRef } from 'react';

interface BeamsBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

const BEAM_COUNT = 12;

function createBeam(width: number, height: number, index: number): Beam {
  const column = index % 4;
  const spacing = width / 4;

  return {
    x: column * spacing + spacing * (0.2 + Math.random() * 0.8),
    y: Math.random() * height * 1.4 - height * 0.2,
    width: 70 + Math.random() * 95,
    length: height * (1.65 + Math.random() * 0.65),
    angle: -28 + Math.random() * 8,
    speed: 0.16 + Math.random() * 0.2,
    opacity: 0.035 + Math.random() * 0.055,
    hue: 252 + Math.random() * 22,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.008 + Math.random() * 0.012,
  };
}

export function BeamsBackground({ className = '', intensity = 'subtle' }: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const opacityScale = intensity === 'strong' ? 1.2 : intensity === 'medium' ? 0.92 : 0.66;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      beamsRef.current = Array.from({ length: BEAM_COUNT }, (_, index) => createBeam(width, height, index));
    };

    const resetBeam = (beam: Beam, index: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const column = index % 4;
      const spacing = width / 4;

      beam.x = column * spacing + spacing * (0.15 + Math.random() * 0.9);
      beam.y = height + Math.random() * 160;
      beam.width = 70 + Math.random() * 95;
      beam.length = height * (1.65 + Math.random() * 0.65);
      beam.speed = 0.16 + Math.random() * 0.2;
      beam.opacity = 0.035 + Math.random() * 0.055;
      beam.hue = 252 + Math.random() * 22;
    };

    const drawBeam = (beam: Beam) => {
      const opacity = beam.opacity * (0.82 + Math.sin(beam.pulse) * 0.18) * opacityScale;
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

      gradient.addColorStop(0, `hsla(${beam.hue}, 72%, 66%, 0)`);
      gradient.addColorStop(0.22, `hsla(${beam.hue}, 72%, 66%, ${opacity * 0.35})`);
      gradient.addColorStop(0.48, `hsla(${beam.hue}, 72%, 66%, ${opacity})`);
      gradient.addColorStop(0.76, `hsla(${beam.hue}, 72%, 66%, ${opacity * 0.42})`);
      gradient.addColorStop(1, `hsla(${beam.hue}, 72%, 66%, 0)`);

      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);
      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.filter = 'blur(30px)';

      beamsRef.current.forEach((beam, index) => {
        if (!reduceMotion) {
          beam.y -= beam.speed;
          beam.pulse += beam.pulseSpeed;
        }

        if (beam.y + beam.length < -120) {
          resetBeam(beam, index);
        }

        drawBeam(beam);
      });

      if (!reduceMotion) {
        frameRef.current = window.requestAnimationFrame(render);
      }
    };

    resize();
    render();

    const observer = new ResizeObserver(() => {
      resize();
      render();
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [intensity]);

  return (
    <div className={`beams-background ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="beams-background__canvas" />
    </div>
  );
}
