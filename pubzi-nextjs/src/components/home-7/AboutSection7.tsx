'use client';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
      tl.to({}, { duration: 0.4 }, 4.6);
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
      <div className="about-sticky">
        <div ref={trackRef} className="about-model-track">
          <div className="about-ellipse">
            <img src="/assets/img/home-7/about/ellipse.png" alt="" />
          </div>
          <div className="about-3d-stage" aria-label="Black Hole 3D model">
            <AboutGlbModel rotationRef={rotationRef} />
          </div>
        </div>

        <div className="about-stage about-stage--right stage-0">
          <div className="stage-inner">
            <h6 className="stage-kicker text-purple">VỀ BLACKHOLE GAME</h6>
            <h2 className="glow-text stage-finale">
              Local Partner chiến lược
              <br />
              cho thị trường game Việt Nam
            </h2>
          </div>
        </div>

        <div className="about-stage about-stage--right stage-1">
          <div className="stage-inner">
            <h6 className="stage-kicker text-purple">VỀ BLACKHOLE GAME</h6>
            <p className="glow-text-subtle stage-statement">
              Chúng tôi không chỉ phát hành game — chúng tôi tháo gỡ từng rào cản bản địa, tối ưu hóa ROI và nâng cao giá trị vòng đời người dùng (LTV) của từng sản phẩm.
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
              Trở thành cổng kết nối hàng đầu giữa game quốc tế và 100 triệu người chơi Đông Nam Á — đặt Việt Nam lên bản đồ gaming toàn cầu.
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

        .stage-kicker {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .stage-title {
          font-size: 32px;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 16px;
          color: #fff;
        }

        .stage-body {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
        }

        .stage-statement {
          font-size: 23px;
          font-weight: 600;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.92);
        }

        .stage-finale {
          font-size: 44px;
          font-weight: 800;
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

        .about-3d-stage {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          filter: contrast(1.12) brightness(1.04)
            drop-shadow(0 0 22px rgba(108, 92, 231, 0.5))
            drop-shadow(0 0 62px rgba(139, 122, 232, 0.42));
        }

        .about-3d-stage canvas {
          position: relative;
          z-index: 1;
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        .about-model-mount {
          width: 100%;
          height: 100%;
          will-change: transform, filter, opacity;
        }

        .about-stage {
          z-index: 2;
          pointer-events: none;
        }

        .stage-inner {
          width: 100%;
          will-change: transform, filter, opacity;
        }

        /* ===== Story mode: sticky + scroll-driven ===== */
        @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
          .about-story {
            /* Overlap wipe DISABLED for now (was margin-bottom: -100vh) —
               the next section's black panel crept up over the story and the
               client wants it locked. The story now releases naturally and
               the next section follows in normal flow. Height trimmed so the
               final stage doesn't hold a long dead stretch before release. */
            height: 500vh;
            margin-bottom: 0;
          }

          .about-sticky {
            position: sticky;
            top: 0;
            height: 100vh;
            overflow: hidden;
            /* Glass panel: the video behind is blurred by the hero-exit tween
               (see HeroSection7) — this layer only tints. No backdrop-filter:
               re-sampling the whole stack each frame is what melted the GPU. */
            /* Uniform tint with a small FIXED-SIZE soft top edge (90px) —
               soft enough that the rising panel has no hard line, small
               enough that it reads as an edge, not a traveling gradient */
            background: linear-gradient(180deg, rgba(8, 5, 20, 0) 0, rgba(8, 5, 20, 0.4) 90px, rgba(8, 5, 20, 0.4) 100%);
          }

          .about-model-track {
            position: absolute;
            left: 4vw;
            top: 11vh;
            width: 38vw;
            height: 78vh;
            z-index: 3;
            pointer-events: none;
            will-change: transform;
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
            padding: 72px 0 56px;
            /* solid backdrop on stacked mode — backdrop-filter is too heavy here */
            background: #0a0718;
          }

          .about-model-track {
            position: relative;
            width: min(100%, 520px);
            height: 46vh;
            min-height: 320px;
            margin: 0 auto;
          }

          .about-stage {
            position: static;
            padding: 30px 24px 0;
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

  // Lazy init: only boot WebGL when the section is within 1.5 viewports.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldInit(true);
          io.disconnect();
        }
      },
      { rootMargin: '150% 0px' }
    );
    io.observe(mount);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldInit) return;
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    const modelGroup = new THREE.Group();
    const baseRotationY = -0.28;
    let animationFrame = 0;
    let running = false;
    let disposed = false;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    mount.appendChild(renderer.domElement);

    camera.position.set(0, 0.16, 6.2);
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

    // Dirty-flag rendering: only re-render when the rotation actually changed.
    // The stage has drop-shadow filters that get recomputed every time the
    // canvas presents a frame, so idle frames are not free.
    let lastRotation = NaN;
    let needsRender = true;

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
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

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
    };

    // Sleep the render loop whenever the canvas is offscreen.
    const visibility = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '15% 0px' }
    );
    visibility.observe(mount);

    const loader = new GLTFLoader();
    loader.load(
      '/assets/img/home-7/3d/3d_1.glb',
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
          model.scale.setScalar(2.75 / maxDimension);
        }

        model.rotation.set(0.08, 0, 0);
        modelGroup.add(model);
        needsRender = true;
        setLoadingProgress(100);

        // "Materialize" reveal: fade in from blur instead of popping.
        gsap.fromTo(
          mount,
          { opacity: 0, scale: 0.92, filter: 'blur(8px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out', clearProps: 'filter,transform' }
        );
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percent = Math.min((xhr.loaded / xhr.total) * 100, 95);
          setLoadingProgress(Math.floor(percent));
        }
      }
    );

    resize();
    start();

    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      visibility.disconnect();
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
