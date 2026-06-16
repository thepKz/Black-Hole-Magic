'use client';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STACKED_MEDIA = '(max-width: 767px), (prefers-reduced-motion: reduce)';

export default function AboutSection7() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Scroll-driven Y rotation, read by the Three.js render loop each frame.
  const rotationRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const mm = gsap.matchMedia();

    const setupStory = (driftVW: number, travelVW: number) => {
      const inners = [0, 1, 2, 3].map((i) =>
        wrapper.querySelector<HTMLElement>(`.stage-${i} .stage-inner`)
      );
      if (inners.some((el) => !el)) return;

      gsap.set(inners[0], { opacity: 1, y: 0, filter: 'blur(0px)' });
      gsap.set(inners.slice(1), { opacity: 0, y: 60, filter: 'blur(12px)' });

      const rotProxy = { v: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      const fadeOut = (i: number, at: number) => {
        tl.to(inners[i], { opacity: 0, y: -60, filter: 'blur(12px)', duration: 0.32, ease: 'power2.in' }, at);
      };
      const fadeIn = (i: number, at: number) => {
        tl.to(inners[i], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.36, ease: 'power2.out' }, at);
      };

      // Choreography (5 units total): the model drifts gently on the left while
      // the right-side text plays, sweeps across the EMPTY stage as its own beat
      // (so it never covers text), then the remaining copy plays on the left.
      tl.to(rotProxy, {
        v: Math.PI * 2,
        duration: 4.6,
        ease: 'none',
        onUpdate: () => {
          rotationRef.current = rotProxy.v;
        },
      }, 0);
      tl.to(track, {
        x: () => (window.innerWidth * driftVW) / 100,
        duration: 1.9,
        ease: 'none',
      }, 0);
      tl.to(track, {
        x: () => (window.innerWidth * travelVW) / 100,
        duration: 0.6,
        ease: 'power1.inOut',
      }, 1.9);

      fadeOut(0, 0.7);
      fadeIn(1, 0.96);
      fadeOut(1, 1.75); // text clears the floor before the sweep
      fadeIn(2, 2.55); // model has landed on the right
      fadeOut(2, 3.35);
      fadeIn(3, 3.61); // fully in right as the next section starts its wipe
      fadeOut(3, 4.22);

      // Exit: model glides to viewport center, punches up in scale, then
      // drops off the bottom so the next section reveals cleanly underneath.
      tl.to(track, {
        x: () => (window.innerWidth / 2) - (track!.offsetWidth / 2) - (4 / 100 * window.innerWidth),
        y: () => (window.innerHeight / 2) - (track!.offsetHeight / 2) - (11 / 100 * window.innerHeight),
        duration: 0.32,
        ease: 'power2.inOut',
      }, 4.16);
      tl.to(track, {
        scale: 1.18,
        duration: 0.26,
        ease: 'power1.out',
      }, 4.48);
      tl.to(track, {
        y: () => window.innerHeight * 1.18,
        scale: 1.1,
        duration: 0.44,
        ease: 'power2.in',
      }, 4.74);
      tl.to({}, { duration: 0.18 }, 5.12);
    };

    mm.add('(min-width: 1200px) and (prefers-reduced-motion: no-preference)', () => {
      setupStory(6, 46);
    });
    mm.add('(min-width: 768px) and (max-width: 1199px) and (prefers-reduced-motion: no-preference)', () => {
      setupStory(2, 8);
    });
    mm.add(STACKED_MEDIA, () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;

      // Slow idle spin instead of scroll-driven rotation.
      const tick = () => {
        rotationRef.current += gsap.ticker.deltaRatio() * 0.0045;
      };
      gsap.ticker.add(tick);

      const inners = gsap.utils.toArray<HTMLElement>('.stage-inner', wrapper);
      inners.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          filter: 'blur(8px)',
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        });
      });

      return () => {
        gsap.ticker.remove(tick);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={wrapperRef} className="about-story about-section-purple">
      {/* Decorative tech backdrop — mobile only (hidden ≥768px). Faint grid,
          thin diagonal beams and small particles, all kept at low opacity so
          it reads as texture, not decoration. */}
      <div className="about-tech-fx" aria-hidden="true">
        <span className="atf-grid" />
        <span className="atf-beam atf-beam-1" />
        <span className="atf-beam atf-beam-2" />
        <span className="atf-dot atf-dot-1" />
        <span className="atf-dot atf-dot-2" />
        <span className="atf-dot atf-dot-3" />
        <span className="atf-dot atf-dot-4" />
        <span className="atf-dot atf-dot-5" />
      </div>
      <div className="about-sticky">
        <div ref={trackRef} className="about-model-track">
          <div className="about-ellipse">
            <img src="/assets/img/home-7/about/ellipse.png" alt="" />
          </div>
          {/* Hào quang nhân vật — lớp glow tím pulse nhẹ đứng sau model,
              tạo cảm giác nhân vật phát sáng từ bên trong. */}
          <div className="about-hero-aura" aria-hidden="true">
            <span className="aura-core" />
            <span className="aura-ring" />
          </div>
          <div className="about-3d-stage" aria-label="Black Hole 3D model">
            <AboutGlbModel rotationRef={rotationRef} />
          </div>
        </div>

        <div className="about-stage about-stage--right stage-0">
          <div className="stage-inner">
            <h6 className="stage-kicker text-purple">VỀ BLACKHOLE GAME</h6>
            <h2 className="glow-text stage-finale">
              Local Partner chiến lược{' '}
              <br className="finale-break" />
              cho thị trường game Việt Nam
            </h2>
          </div>
        </div>

        <div className="about-stage about-stage--right stage-1">
          <div className="stage-inner">
            <h6 className="stage-kicker text-purple">VỀ BLACKHOLE GAME</h6>
            <p className="glow-text-subtle stage-statement">
              Chúng tôi không chỉ phát hành game. Chúng tôi tháo gỡ từng rào cản bản địa, tối ưu hóa ROI và nâng cao giá trị vòng đời người dùng (LTV) của từng sản phẩm.
            </p>
          </div>
        </div>

        <div className="about-stage about-stage--left stage-2">
          <div className="stage-inner">
            <h6 className="stage-kicker text-purple">VỀ BLACKHOLE GAME</h6>
            <h2 className="glow-text stage-title">Tầm nhìn 2030</h2>
            <p className="glow-text-subtle stage-body">
              Đến năm 2030, Blackhole Game định vị là Hệ sinh thái Đồng phát hành (Co-Publishing) tiêu chuẩn và là Local Partner được lựa chọn đầu tiên (Top-of-mind) bởi các nhà phát triển game quốc tế tại thị trường Đông Nam Á.
            </p>
          </div>
        </div>

        <div className="about-stage about-stage--left stage-3">
          <div className="stage-inner">
            <h6 className="stage-kicker text-purple">VỀ BLACKHOLE GAME</h6>
            <h2 className="glow-text stage-title">Sứ mệnh</h2>
            <p className="glow-text-subtle stage-body">
              Trở thành cổng kết nối hàng đầu giữa game quốc tế và 100 triệu người chơi Đông Nam Á, đặt Việt Nam lên bản đồ gaming toàn cầu.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .about-story {
          position: relative;
          z-index: 1;
        }

        /* Everything after the story must paint ABOVE its pinned panel,
           otherwise the 3D model bleeds through later sections. */
        .about-story ~ section {
          position: relative;
          z-index: 2;
        }

        .about-sticky {
          position: relative;
        }

        /* Tech backdrop hidden by default; only shown in stacked/mobile mode. */
        .about-tech-fx {
          display: none;
        }

        .stage-kicker {
          font-family: var(--font-subtitle-krafting);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .stage-title {
          font-family: var(--font-title-extra);
          font-size: 32px;
          font-weight: 900;
          line-height: 1.3;
          margin-bottom: 16px;
          color: #fff;
        }

        .stage-body {
          font-family: var(--font-body-regular);
          font-size: 16px;
          font-weight: 400;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
        }

        .stage-statement {
          font-family: var(--font-body-regular);
          font-size: 23px;
          font-weight: 400;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.92);
        }

        .stage-finale {
          font-family: var(--font-title-extra);
          font-size: 44px;
          font-weight: 900;
          line-height: 1.25;
          color: #fff;
        }

        .text-purple {
          color: #8b7ae8;
        }

        .glow-text {
          text-shadow:
            0 0 20px rgba(255, 255, 255, 0.55),
            0 0 58px rgba(139, 122, 232, 0.9),
            0 2px 0 rgba(7, 4, 20, 0.92),
            0 10px 30px rgba(0, 0, 0, 0.86);
          filter: drop-shadow(0 0 14px rgba(255, 255, 255, 0.58)) drop-shadow(0 0 34px rgba(139, 122, 232, 0.76));
        }

        .glow-text-subtle {
          text-shadow:
            0 0 12px rgba(139, 122, 232, 0.4),
            0 0 24px rgba(139, 122, 232, 0.2);
        }

        .about-ellipse {
          position: absolute;
          left: 50%;
          bottom: 2%;
          transform: translateX(-50%);
          width: 72%;
          z-index: 1;
          pointer-events: none;
        }

        .about-ellipse img {
          width: 100%;
          filter: brightness(0.9) saturate(0.9) drop-shadow(0 0 24px rgba(108, 92, 231, 0.35));
          opacity: 0.58;
        }

        /* ===== Hào quang nhân vật ===== */
        .about-hero-aura {
          position: absolute;
          left: 50%;
          top: 46%;
          transform: translate(-50%, -50%);
          width: 70%;
          aspect-ratio: 1 / 1.25;
          z-index: 1;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        /* Lõi sáng dọc theo thân nhân vật — pulse chậm. */
        .aura-core {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
            ellipse 52% 64% at 50% 48%,
            rgba(178, 142, 255, 0.55) 0%,
            rgba(124, 78, 245, 0.34) 32%,
            rgba(74, 24, 204, 0.16) 56%,
            transparent 74%
          );
          filter: blur(14px);
          animation: aura-breathe 5.5s ease-in-out infinite;
        }

        /* Vầng hào quang ngoài rộng hơn, sáng yếu, lệch nhịp với lõi. */
        .aura-ring {
          position: absolute;
          inset: -16%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 42%,
            transparent 38%,
            rgba(155, 124, 255, 0.22) 52%,
            rgba(108, 92, 231, 0.1) 64%,
            transparent 78%
          );
          filter: blur(22px);
          animation: aura-breathe 7s ease-in-out infinite reverse;
        }

        @keyframes aura-breathe {
          0%, 100% { opacity: 0.7; transform: scale(0.97); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @media (prefers-reduced-motion: reduce) {
          .aura-core, .aura-ring { animation: none; }
        }

        .about-3d-stage {
          position: absolute;
          inset: -30%;
          z-index: 2;
          filter: contrast(1.12) brightness(1.04)
            drop-shadow(0 0 22px rgba(108, 92, 231, 0.5))
            drop-shadow(0 0 62px rgba(139, 122, 232, 0.42));
        }

        .about-3d-stage canvas {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        .about-model-mount {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .about-stage {
          z-index: 2;
          pointer-events: none;
        }

        .stage-inner {
          width: 100%;
        }

        /* ===== Story mode: sticky + scroll-driven ===== */
        @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
          .about-story {
            /* Overlap wipe DISABLED for now (was margin-bottom: -100vh) —
               the next section's black panel crept up over the story and the
               client wants it locked. The story now releases naturally and
               the next section follows in normal flow. Height trimmed so the
               final stage doesn't hold a long dead stretch before release. */
            height: 560vh;
            margin-bottom: 0;
          }

          .about-sticky {
            position: sticky;
            top: 0;
            height: 100vh;
            overflow: visible;
            background: linear-gradient(180deg, rgba(8, 5, 20, 0) 0, rgba(8, 5, 20, 0.4) 90px, rgba(8, 5, 20, 0.4) 100%);
          }

          .about-model-track {
            position: absolute;
            left: 4vw;
            top: 11vh;
            width: 38vw;
            height: 78vh;
            z-index: 100;
            pointer-events: none;
            will-change: transform;
            overflow: visible;
          }

          .about-model-mount,
          .stage-inner {
            will-change: transform, filter, opacity;
          }

          .about-stage {
            position: absolute;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
          }

          .about-stage--right {
            left: 50vw;
            right: 6vw;
          }

          .about-stage--left {
            left: 6vw;
            right: 54vw;
          }
        }

        /* Tablet: model travels less, text stays on the right */
        @media (min-width: 768px) and (max-width: 1199px) and (prefers-reduced-motion: no-preference) {
          .about-model-track {
            left: 2vw;
            width: 42vw;
          }

          .about-stage--right,
          .about-stage--left {
            left: 48vw;
            right: 4vw;
          }

          .stage-finale {
            font-size: 34px;
          }

          .stage-statement {
            font-size: 20px;
          }
        }

        /* ===== Stacked mode: mobile or reduced motion ===== */
        @media (max-width: 767px), (prefers-reduced-motion: reduce) {
          .about-story {
            position: relative;
            overflow: hidden;
            padding: 72px 0 56px;
            /* Stacked backdrop bridging both seams on mobile: top fades in from
               the hero's end color (#06060A), bottom settles to the next
               section's top color (#080614 — ServiceSection), so hero→about and
               about→service both read as one continuous gradient, no hard line. */
            background: linear-gradient(180deg, #06060a 0%, #0a0718 220px, #0a0718 calc(100% - 200px), #080614 100%);
          }

          /* ---- Tech backdrop (mobile only) ---- */
          .about-tech-fx {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
          }

          /* Keep all real content above the texture. */
          .about-sticky {
            position: relative;
            z-index: 1;
          }

          /* Faint technical grid. */
          .atf-grid {
            position: absolute;
            inset: -2px;
            background-image:
              linear-gradient(rgba(176, 156, 255, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(176, 156, 255, 0.5) 1px, transparent 1px);
            background-size: 46px 46px;
            opacity: 0.06;
            -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 0%, transparent 78%);
            mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 0%, transparent 78%);
          }

          /* Thin purple beams drifting on a diagonal. */
          .atf-beam {
            position: absolute;
            top: -20%;
            width: 1px;
            height: 140%;
            background: linear-gradient(180deg, transparent, rgba(176, 156, 255, 0.9), transparent);
            opacity: 0.12;
            filter: blur(0.4px);
            transform: rotate(18deg);
            will-change: transform;
          }

          .atf-beam-1 {
            left: 26%;
            animation: atf-beam-drift 13s ease-in-out infinite;
          }

          .atf-beam-2 {
            left: 68%;
            height: 120%;
            opacity: 0.08;
            animation: atf-beam-drift 17s ease-in-out infinite reverse;
            animation-delay: -4s;
          }

          @keyframes atf-beam-drift {
            0%, 100% { transform: rotate(18deg) translateX(-10px); }
            50% { transform: rotate(18deg) translateX(18px); }
          }

          /* Small particles. */
          .atf-dot {
            position: absolute;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: rgba(199, 186, 255, 0.9);
            box-shadow: 0 0 6px rgba(139, 122, 232, 0.8);
            opacity: 0.14;
            will-change: transform, opacity;
            animation: atf-dot-float 9s ease-in-out infinite;
          }

          .atf-dot-1 { left: 14%; top: 22%; animation-delay: 0s; }
          .atf-dot-2 { left: 82%; top: 16%; animation-delay: -2s; width: 2px; height: 2px; }
          .atf-dot-3 { left: 38%; top: 64%; animation-delay: -4s; }
          .atf-dot-4 { left: 70%; top: 72%; animation-delay: -6s; width: 2px; height: 2px; }
          .atf-dot-5 { left: 54%; top: 40%; animation-delay: -1.5s; }

          @keyframes atf-dot-float {
            0%, 100% { transform: translateY(0); opacity: 0.06; }
            50% { transform: translateY(-14px); opacity: 0.16; }
          }

          @media (prefers-reduced-motion: reduce) {
            .atf-beam, .atf-dot { animation: none; }
          }

          .about-model-track {
            display: none;
          }

          .about-ellipse {
            display: none;
          }

          .about-3d-stage {
            display: none;
          }

          .about-stage {
            position: static;
            padding: 30px 24px 0;
          }

          /* Each stage carries its own "VỀ BLACKHOLE GAME" kicker so it reads
             correctly while only one is visible at a time on desktop. Stacked
             on mobile they all show at once — keep the first, drop the repeats. */
          .stage-1 .stage-kicker,
          .stage-2 .stage-kicker,
          .stage-3 .stage-kicker {
            display: none;
          }

          /* Body copy on mobile: normal case (not all-caps), left-aligned.
             Justify is avoided — the body font is monospace, so justify blows
             the word gaps wide open and the text reads ragged. */
          .stage-statement,
          .stage-body {
            text-transform: none;
            text-align: left;
          }

          /* The hard <br> inside the finale heading drops "lược" onto its own
             line on narrow screens — collapse it to a normal space (the {' '}
             before it keeps the words apart) and let the heading wrap cleanly. */
          .stage-finale .finale-break {
            display: none;
          }

          .stage-finale {
            text-wrap: balance;
          }

          .stage-finale {
            font-size: 28px;
          }

          .stage-statement {
            font-size: 18px;
          }

          .stage-title {
            font-size: 26px;
          }
        }

        .loading-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .loading-circle {
          width: 100px;
          height: 100px;
          transform: rotate(-90deg);
        }

        .loading-bg {
          fill: none;
          stroke: rgba(108, 92, 231, 0.2);
          stroke-width: 4;
        }

        .loading-progress {
          fill: none;
          stroke: #8b7ae8;
          stroke-width: 4;
          stroke-linecap: round;
          transition: stroke-dasharray 0.3s ease;
          filter: drop-shadow(0 0 8px rgba(139, 122, 232, 0.8));
        }

        .loading-text {
          position: absolute;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 0 20px rgba(139, 122, 232, 0.8);
        }
      `}</style>
    </section>
  );
}

function AboutGlbModel({ rotationRef }: { rotationRef: React.RefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [shouldInit, setShouldInit] = useState(false);

  // Lazy init: boot WebGL when the section nears the viewport, OR as soon as the
  // preloader finishes — by then it has already streamed the .glb into the HTTP
  // cache, so booting early is cheap and the model is ready before the user scrolls.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const canInit3D = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    if (!canInit3D.matches) return;

    let done = false;
    const init = () => {
      if (done) return;
      done = true;
      setShouldInit(true);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && canInit3D.matches) {
          init();
          io.disconnect();
        }
      },
      { rootMargin: '150% 0px' }
    );
    io.observe(mount);

    // If the preloader already completed (or completes now), the model bytes are
    // cached — init immediately so the loading ring never flashes.
    if (document.body.dataset.preloaderDone === 'true') {
      init();
      io.disconnect();
    } else {
      const onPreloaderComplete = () => {
        init();
        io.disconnect();
      };
      window.addEventListener('black-hole:preloader-complete', onPreloaderComplete, { once: true });
      return () => {
        io.disconnect();
        window.removeEventListener('black-hole:preloader-complete', onPreloaderComplete);
      };
    }

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldInit) return;
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let animationFrame = 0;
    let running = false;
    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let disposeScene: (() => void) | null = null;

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
    };

    const boot = async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
      if (disposed || !mountRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      const modelGroup = new THREE.Group();
      const baseRotationY = -0.28;
      let lastRotation = NaN;
      let needsRender = true;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.28;
      mount.appendChild(renderer.domElement);

      camera.position.set(0, 0.16, 9.5);
      scene.add(modelGroup);
      scene.add(new THREE.AmbientLight(0xffffff, 1.75));

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.35);
      keyLight.position.set(2.8, 4.6, 4.2);
      scene.add(keyLight);

      const haloLight = new THREE.PointLight(0x8b7ae8, 4.2, 7.5);
      haloLight.position.set(0, 1.25, 2.3);
      scene.add(haloLight);

      const purpleRim = new THREE.PointLight(0x9b7cff, 4.4, 8);
      purpleRim.position.set(-2.4, 1.8, 2.8);
      scene.add(purpleRim);

      const softFill = new THREE.PointLight(0x6c5ce7, 2.2, 7);
      softFill.position.set(2.2, -1.2, 2.4);
      scene.add(softFill);

      const resize = () => {
        const stage = mount.parentElement ?? mount;
        const width = Math.max(stage.clientWidth, 1);
        const height = Math.max(stage.clientHeight, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        needsRender = true;
      };

      const frame = () => {
        if (!running) return;
        const rotation = baseRotationY + rotationRef.current;
        if (needsRender || rotation !== lastRotation) {
          modelGroup.rotation.y = rotation;
          renderer.render(scene, camera);
          lastRotation = rotation;
          needsRender = false;
        }
        animationFrame = window.requestAnimationFrame(frame);
      };

      const start = () => {
        if (running || disposed) return;
        running = true;
        animationFrame = window.requestAnimationFrame(frame);
      };

      visibilityObserver = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { rootMargin: '15% 0px' }
      );
      visibilityObserver.observe(mount);

      // The .glb is Draco-compressed (42MB → 3.4MB), so GLTFLoader needs a
      // DRACOLoader wired up to decode the mesh. Decoder files live in /public.
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/assets/draco/');
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      loader.load(
        '/assets/img/home-7/3d/3d_9.glb',
        (gltf) => {
          if (disposed) return;

          const model = gltf.scene;
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);

          model.position.sub(center);
          const maxDimension = Math.max(size.x, size.y, size.z);
          if (maxDimension > 0) {
            model.scale.setScalar(3.4 / maxDimension);
          }

          model.rotation.set(0.08, 0, 0);
          modelGroup.add(model);
          needsRender = true;
          setLoadingProgress(100);

          gsap.fromTo(
            mount,
            { opacity: 0, scale: 0.92, filter: 'blur(8px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out', clearProps: 'filter,transform' }
          );
        },
        (xhr) => {
          if (disposed || !xhr.lengthComputable) return;
          const percent = Math.min((xhr.loaded / xhr.total) * 100, 95);
          setLoadingProgress(Math.floor(percent));
        }
      );

      resize();
      start();

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);

      disposeScene = () => {
        dracoLoader.dispose();
        renderer.dispose();
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.domElement.remove();
      };
    };

    void boot();

    return () => {
      disposed = true;
      stop();
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      disposeScene?.();
    };
  }, [shouldInit, rotationRef]);

  return (
    <>
      <div ref={mountRef} className="about-model-mount" style={{ opacity: 0 }} />
      {loadingProgress < 100 && (
        <div className="loading-overlay">
          <svg className="loading-circle" viewBox="0 0 100 100">
            <circle className="loading-bg" cx="50" cy="50" r="40" />
            <circle
              className="loading-progress"
              cx="50"
              cy="50"
              r="40"
              strokeDasharray={`${loadingProgress * 2.51} 251.2`}
            />
          </svg>
          <div className="loading-text">{loadingProgress}%</div>
        </div>
      )}
    </>
  );
}
