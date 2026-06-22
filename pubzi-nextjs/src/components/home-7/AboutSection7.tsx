'use client';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mount3DTuningPanel } from '../shared/use3DTuningPanel';

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

      const scrim = wrapper.querySelector<HTMLElement>('.about-story-scrim');

      // The story should begin only when the about panel is pinned. Before
      // that, keep text/model hidden so no separate section appears from below.
      gsap.set(inners, { autoAlpha: 0, x: 96, y: 0, filter: 'blur(12px)' });
      gsap.set(track, { autoAlpha: 0, x: () => window.innerWidth * 0.26, y: 0, scale: 1 });
      if (scrim) gsap.set(scrim, { autoAlpha: 0 });

      const rotProxy = { v: 0 };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      const fadeOut = (i: number, at: number) => {
        tl.to(inners[i], { autoAlpha: 0, x: -72, filter: 'blur(12px)', duration: 0.32, ease: 'power2.in' }, at);
      };
      const fadeIn = (i: number, at: number) => {
        tl.to(inners[i], { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out' }, at);
      };

      // Choreography (5 units total): the model drifts gently on the left while
      // the right-side text plays, sweeps across the EMPTY stage as its own beat
      // (so it never covers text), then the remaining copy plays on the left.
      if (scrim) {
        tl.to(scrim, { autoAlpha: 0.78, duration: 0.25, ease: 'power2.out' }, 0);
      }
      tl.to(track, { autoAlpha: 1, duration: 0.16, ease: 'power2.out' }, 0);
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

      fadeIn(0, 0);
      fadeOut(0, 0.72);
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
      if (scrim) {
        tl.to(scrim, { autoAlpha: 0, duration: 0.32, ease: 'power1.out' }, 4.72);
      }
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

      const inners = gsap.utils.toArray<HTMLElement>('.stage-inner', wrapper);
      inners.forEach((el) => {
        const pieces = Array.from(el.children) as HTMLElement[];
        gsap.fromTo(
          pieces,
          {
            autoAlpha: 0,
            y: 24,
            filter: 'blur(8px)',
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.68,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          }
        );
      });
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
        <div className="about-story-scrim" aria-hidden="true" />
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
            <h6 className="stage-kicker text-purple">BLACKHOLE GAME</h6>
            <h2 className="glow-text stage-title">CHÚNG TÔI KHÔNG CHỈ PHÁT HÀNH GAME</h2>
            <p className="glow-text-subtle stage-body stage-body--lead">
              Blackhole Game được xây dựng với mục tiêu trở thành hệ sinh thái đồng phát hành tiêu chuẩn tại Đông Nam Á.
            </p>
          </div>
        </div>

        <div className="about-stage about-stage--right stage-1">
          <div className="stage-inner">
            <h2 className="glow-text stage-title">Publishing - Payment - Legal</h2>
            <p className="glow-text-subtle stage-body stage-body--lead">
              Thông qua ba mảnh ghép cốt lõi gồm Publishing, Payment và Legal, chúng tôi giúp các studio quốc tế tiếp cận thị trường Việt Nam nhanh hơn, vận hành hiệu quả hơn và xây dựng tăng trưởng dài hạn.
              <br />
              <br />
              Chúng tôi tin rằng tăng trưởng bền vững không đến từ may mắn, mà đến từ dữ liệu, kinh nghiệm vận hành và sự am hiểu người chơi bản địa.
            </p>
          </div>
        </div>

        <div className="about-stage about-stage--left stage-2">
          <div className="stage-inner">
            <h2 className="glow-text stage-title">Tầm nhìn 2030</h2>
            <p className="glow-text-subtle stage-body">
              Trở thành hệ sinh thái đồng phát hành tiêu chuẩn tại Đông Nam Á, là lựa chọn hàng đầu của các studio quốc tế khi mở rộng sang Việt Nam và khu vực.
              <br />
              <br />
              Không chỉ đưa game quốc tế đến với người chơi Việt Nam, Blackhole Game còn đưa năng lực vận hành của Việt Nam ra thị trường toàn cầu.
            </p>
          </div>
        </div>

        <div className="about-stage about-stage--left stage-3">
          <div className="stage-inner">
            <h2 className="glow-text stage-title">Sứ mệnh</h2>
            <p className="glow-text-subtle stage-body">
              Kết nối những tựa game chất lượng với hàng trăm triệu người chơi Đông Nam Á.
              <br />
              <br />
              Thông qua năng lực vận hành, dữ liệu và hệ sinh thái khép kín, Blackhole Game giúp các studio quốc tế xây dựng tăng trưởng dài hạn và cộng đồng bền vững.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .about-story {
          position: relative;
          z-index: 1;
          text-transform: none;
        }

        /* Everything after the story must paint ABOVE its pinned panel,
           otherwise the 3D model bleeds through later sections. */
        .about-story ~ section {
          position: relative;
          z-index: 3;
        }

        .about-sticky {
          position: relative;
        }

        .about-story-scrim {
          display: none;
        }

        /* Tech backdrop hidden by default; only shown in stacked/mobile mode. */
        .about-tech-fx {
          display: none;
        }

        .stage-kicker {
          font-family: var(--font-subtitle-krafting);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 22px;
        }

        .stage-title {
          font-family: var(--font-title-extra);
          font-size: clamp(34px, 4.1vw, 58px);
          font-weight: 900;
          line-height: 1.06;
          letter-spacing: 0;
          text-transform: none;
          margin-bottom: 18px;
          color: #fff;
          text-wrap: balance;
        }

        .stage-body {
          font-family: 'Chakra Petch', var(--font-body-regular), sans-serif;
          font-size: clamp(17px, 1.42vw, 22px);
          font-weight: 500;
          line-height: 1.62;
          letter-spacing: 0;
          text-transform: none;
          color: rgba(255, 255, 255, 0.86);
        }

        .stage-body--lead {
          font-size: clamp(18px, 1.7vw, 25px);
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
        }

        .stage-finale {
          font-family: var(--font-title-extra);
          font-size: clamp(38px, 4.4vw, 68px);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: 0;
          text-transform: none;
          color: #fff;
          text-wrap: balance;
        }

        .text-purple {
          color: #8b7ae8;
        }

        .glow-text {
          /* Toned down: a soft purple halo + a dark scrim for legibility, no
             bright white bloom. Keeps the text readable on the busy 3D backdrop
             without the heavy "loá" glow. */
          text-shadow:
            0 0 14px rgba(139, 122, 232, 0.24),
            0 2px 0 rgba(7, 4, 20, 0.9),
            0 10px 30px rgba(0, 0, 0, 0.86);
        }

        .glow-text-subtle {
          text-shadow:
            0 0 8px rgba(139, 122, 232, 0.14),
            0 7px 18px rgba(0, 0, 0, 0.72);
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
          /* Dimmed to a faint floor shadow — no purple glow halo. The model
             carries its own light now. */
          filter: brightness(0.55) saturate(0.7);
          opacity: 0.22;
        }

        .about-3d-stage {
          position: absolute;
          inset: -30%;
          z-index: 2;
          /* No external glow effects — the model lights itself from the scene's
             emissive material + point lights. Just a touch of contrast. */
          filter: contrast(1.04);
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
          max-width: 660px;
          position: relative;
          isolation: isolate;
        }

        .stage-inner::before {
          content: "";
          position: absolute;
          inset: -28% -18%;
          z-index: -1;
          pointer-events: none;
          background: radial-gradient(
            ellipse at 50% 52%,
            rgba(7, 4, 18, 0.66),
            rgba(7, 4, 18, 0.36) 34%,
            transparent 72%
          );
          filter: blur(18px);
          opacity: 0.92;
        }

        /* ===== Story mode: sticky + scroll-driven ===== */
        @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
          .about-story {
            /* Overlap wipe DISABLED for now (was margin-bottom: -100vh) —
               the next section's black panel crept up over the story and the
               client wants it locked. The story now releases naturally and
               the next section follows in normal flow. Height trimmed so the
               final stage doesn't hold a long dead stretch before release. */
            height: 360vh;
            margin-bottom: 0;
          }

          .about-sticky {
            position: sticky;
            top: 0;
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
            isolation: isolate;
            background: transparent !important;
          }

          .about-story-scrim {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background:
              radial-gradient(ellipse at center, transparent 0%, rgba(3, 2, 10, 0.14) 54%, rgba(3, 2, 10, 0.66) 100%),
              radial-gradient(circle at 43% 42%, rgba(95, 42, 255, 0.32), rgba(40, 12, 118, 0.18) 22%, transparent 40%),
              radial-gradient(circle at 82% 20%, rgba(76, 21, 190, 0.2), transparent 30%),
              linear-gradient(90deg, rgba(3, 2, 10, 0.78) 0%, rgba(15, 5, 43, 0.34) 44%, rgba(4, 2, 12, 0.68) 100%),
              linear-gradient(180deg, rgba(3, 2, 10, 0.38), rgba(3, 2, 10, 0.68));
            box-shadow:
              inset 0 0 15vw rgba(2, 1, 8, 0.72),
              inset 0 -18vh 18vh rgba(2, 1, 8, 0.42);
            -webkit-backdrop-filter: blur(1.5px) saturate(94%) brightness(0.86);
            backdrop-filter: blur(1.5px) saturate(94%) brightness(0.86);
          }

          .about-model-track {
            position: absolute;
            left: 4vw;
            top: 11vh;
            width: 38vw;
            height: 78vh;
            z-index: 1;
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
            justify-content: flex-end;
            text-align: right;
          }

          .about-stage--left {
            left: 6vw;
            right: 54vw;
            justify-content: flex-start;
            text-align: left;
          }

          .about-stage--right .stage-inner {
            margin-left: auto;
          }

          .about-stage--left .stage-inner {
            margin-right: auto;
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

          .stage-title {
            font-size: 34px;
          }

          .stage-body,
          .stage-body--lead {
            font-size: 18px;
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
            padding: 26px clamp(22px, 6vw, 28px) 0;
          }

          .about-stage + .about-stage {
            margin-top: 10px;
          }

          .stage-inner {
            max-width: 34rem;
            margin: 0 auto;
          }

          .stage-inner::before {
            inset: -18% -8%;
            background: radial-gradient(
              ellipse at 50% 52%,
              rgba(7, 4, 18, 0.5),
              rgba(7, 4, 18, 0.25) 38%,
              transparent 74%
            );
            filter: blur(14px);
          }

          .stage-kicker {
            margin-bottom: 10px;
            font-size: 10px;
            letter-spacing: 0.18em;
          }

          /* Each stage carries its own "VỀ BLACKHOLE GAME" kicker so it reads
             correctly while only one is visible at a time on desktop. Stacked
             on mobile they all show at once — keep the first, drop the repeats. */
          .stage-1 .stage-kicker,
          .stage-2 .stage-kicker,
          .stage-3 .stage-kicker {
            display: none;
          }

          /* Body copy on mobile: normal case, justified with conservative
             spacing so the monospace rhythm still feels intentional. */
          .stage-body {
            text-transform: none;
            text-align: left;
            text-align-last: left;
            hyphens: auto;
            word-spacing: 0;
            letter-spacing: 0;
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

          .glow-text {
            text-shadow:
              0 0 14px rgba(255, 255, 255, 0.38),
              0 0 28px rgba(139, 122, 232, 0.42),
              0 8px 24px rgba(0, 0, 0, 0.76);
            filter: drop-shadow(0 0 14px rgba(139, 122, 232, 0.34));
          }

          .glow-text-subtle {
            text-shadow:
              0 0 10px rgba(139, 122, 232, 0.22),
              0 6px 20px rgba(0, 0, 0, 0.7);
          }

          .stage-finale {
            font-size: clamp(27px, 7.8vw, 32px);
            line-height: 1.18;
            margin-bottom: 16px;
          }

          .stage-title {
            font-size: clamp(24px, 7.1vw, 30px);
            line-height: 1.18;
            margin-bottom: 14px;
            text-wrap: balance;
          }

          .stage-body {
            font-size: clamp(15px, 4.35vw, 17px);
            line-height: 1.72;
          }

          .stage-body--lead {
            font-size: clamp(15px, 4.35vw, 17px);
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
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
      const { OutputPass } = await import('three/examples/jsm/postprocessing/OutputPass.js');
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
      // Tone mapping is set below and applied by the composer's OutputPass —
      // after bloom has read the HDR buffer, so bright emissive isn't clamped.
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.26;
      mount.appendChild(renderer.domElement);

      camera.position.set(0, 0.16, 9.5);
      scene.add(modelGroup);
      const ambientLight = new THREE.AmbientLight(0xffffff, 0);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0x242424, 17.56);
      keyLight.position.set(2.8, 4.6, 4.2);
      scene.add(keyLight);

      // Purple accent lights — pushed up for a "game character" look: bright
      // enough that the lit areas spill past the bloom threshold and glow.
      const haloLight = new THREE.PointLight(0x8b7ae8, 0, 7.5);
      haloLight.position.set(0, 1.25, 2.3);
      scene.add(haloLight);

      const purpleRim = new THREE.PointLight(0x9b7cff, 0, 8);
      purpleRim.position.set(-2.4, 1.8, 2.8);
      scene.add(purpleRim);

      const softFill = new THREE.PointLight(0x6c5ce7, 1.8, 7);
      softFill.position.set(2.2, -1.2, 2.4);
      scene.add(softFill);

      // Back rim lights placed BEHIND the model on both sides — these graze the
      // silhouette edges (hair, shoulders, sword) and create the bright outline
      // that reads as a glowing game character. High intensity so the rim pixels
      // blow out and bloom into a halo.
      const rimLeft = new THREE.PointLight(0xb09cff, 2.25, 9);
      rimLeft.position.set(-3.2, 2.2, -2.6);
      scene.add(rimLeft);

      const rimRight = new THREE.PointLight(0x9d7cff, 0, 9);
      rimRight.position.set(3.0, 1.4, -2.4);
      scene.add(rimRight);

      // ── Post-processing: UnrealBloom (game-character glow) ─────────────────
      // Values dialled in via the live tuning panel and locked here.
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(1, 1), // sized properly in resize()
        0.104, // strength
        0,     // radius
        0.077  // threshold
      );
      // Live tuning panel (dev / ?tune only) — wired after the model loads.
      let disposeTuning: (() => void) | null = null;
      composer.addPass(bloomPass);
      // OutputPass applies tone mapping + sRGB after bloom, so colors match the
      // previous look without clamping the HDR values bloom needs.
      const outputPass = new OutputPass();
      composer.addPass(outputPass);

      const resize = () => {
        const stage = mount.parentElement ?? mount;
        const width = Math.max(stage.clientWidth, 1);
        const height = Math.max(stage.clientHeight, 1);
        const dpr = Math.min(window.devicePixelRatio, 2);
        renderer.setSize(width, height, false);
        composer.setSize(width * dpr, height * dpr);
        bloomPass.setSize(width * dpr, height * dpr);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        needsRender = true;
      };

      const frame = () => {
        if (!running) return;
        const rotation = baseRotationY + rotationRef.current;
        if (needsRender || rotation !== lastRotation) {
          modelGroup.rotation.y = rotation;
          // composer.render() runs the bloom pipeline instead of a plain render.
          composer.render();
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
          // Self-illumination feeding the bloom pass: drive emission from the
          // base texture so the model's own bright areas (highlights on hair,
          // skin, sword) push past the bloom threshold and bloom selectively —
          // dark areas stay dark and don't glow. toneMapped=false keeps those
          // values HDR so bloom reads them before the OutputPass tone-maps.
          const tintColor = new THREE.Color(0xffffff);
          const tunedMaterials: InstanceType<typeof THREE.MeshStandardMaterial>[] = [];
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              mats.forEach((mat) => {
                if (!mat) return;
                const m = mat as InstanceType<typeof THREE.MeshStandardMaterial>;
                if ('emissive' in m && m.emissive) {
                  // Locked at the tuned value (HDR) so bright areas bloom.
                  if (m.map) {
                    m.emissiveMap = m.map;
                    m.emissive.copy(tintColor);
                  } else {
                    m.emissive.copy(m.color).lerp(tintColor, 0.4);
                  }
                  m.emissiveIntensity = 4;
                  m.toneMapped = false;
                  m.needsUpdate = true;
                  tunedMaterials.push(m);
                }
              });
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

          // Dev-only live tuning panel. requestRender flips needsRender so the
          // on-demand loop repaints after each slider tweak.
          disposeTuning = mount3DTuningPanel({
            label: 'About 3D',
            bloomPass,
            renderer,
            materials: tunedMaterials,
            tintColor,
            lights: [
              { name: 'ambient', light: ambientLight },
              { name: 'key', light: keyLight },
              { name: 'halo', light: haloLight },
              { name: 'purpleRim', light: purpleRim },
              { name: 'softFill', light: softFill },
              { name: 'rimLeft', light: rimLeft },
              { name: 'rimRight', light: rimRight },
            ],
            requestRender: () => {
              needsRender = true;
            },
          });

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
        disposeTuning?.();
        dracoLoader.dispose();
        composer.dispose();
        bloomPass.dispose();
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
      {loadingProgress > 8 && loadingProgress < 100 && (
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
