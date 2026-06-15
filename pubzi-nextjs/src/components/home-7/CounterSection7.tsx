'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  {
    value: 100,
    suffix: '+',
    label: 'Nhân sự Tech/MKT',
    note: 'Đội vận hành tích hợp kỹ thuật, marketing, cộng đồng và dữ liệu.',
  },
  {
    value: 50000,
    label: 'DAU+/tháng/game',
    note: 'Tệp active được theo dõi theo từng game và từng chiến dịch.',
  },
  {
    value: 38000,
    label: 'Peak CCU/user/game',
    note: 'Năng lực chịu tải và điều phối realtime ở khung cao điểm.',
  },
  {
    value: 80,
    prefix: '~',
    suffix: '%',
    label: 'Retention D30',
    note: 'Chu kỳ MMORPG cần sống dài sau ngày mở server.',
  },
];

function ScrollWords({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\s+)/).map((segment, index) =>
        segment.trim() ? (
          <span className="ops-word" key={`${segment}-${index}`}>
            {segment}
          </span>
        ) : (
          segment
        )
      )}
    </>
  );
}

export default function CounterSection7() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const ctx = gsap.context(() => {
      const enter = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          once: true,
          onEnter: () => setIsVisible(true),
        },
      });

      enter
        .fromTo(
          '.ops-seam-fill, .ops-row-line',
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.inOut',
            stagger: 0.055,
            immediateRender: false,
          },
          0
        )
        .fromTo(
          '.ops-ledger-copy > *, .ops-ledger-caption',
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
            stagger: 0.08,
            immediateRender: false,
          },
          0.08
        )
        .fromTo(
          '.ops-ledger-row',
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
            stagger: 0.085,
            immediateRender: false,
          },
          0.22
        );

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
        .to('.ops-ledger-table', { yPercent: -3, ease: 'none' }, 0)
        .fromTo(
          '.ops-scroll-rail-fill',
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, ease: 'none' },
          0
        );

      gsap.utils.toArray<HTMLElement>('.ops-scroll-text').forEach((textBlock) => {
        const words = textBlock.querySelectorAll<HTMLElement>('.ops-word');
        if (!words.length) return;

        gsap.fromTo(
          words,
          {
            autoAlpha: 0.22,
            y: 10,
            filter: 'blur(2px)',
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'none',
            stagger: 0.025,
            scrollTrigger: {
              trigger: textBlock,
              start: 'top 96%',
              end: 'top 72%',
              scrub: 0.45,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="operations" ref={sectionRef} className="ops-section" aria-labelledby="ops-title">
      <span className="ops-scroll-rail" aria-hidden="true">
        <span className="ops-scroll-rail-fill" />
      </span>

      <span className="ops-seam ops-seam--top" aria-hidden="true">
        <span className="ops-seam-fill" />
      </span>

      <div className="ops-container">
        <div className="ops-ledger">
          <div className="ops-ledger-copy">
            <span className="ops-kicker">SECTION 04 · OPERATING CAPACITY</span>
            <h2 id="ops-title" className="ops-scroll-text">
              <ScrollWords>Năng lực vận hành, bằng số.</ScrollWords>
            </h2>
          </div>

          <div className="ops-ledger-table" role="table" aria-label="Chỉ số vận hành Blackhole Game">
            {METRICS.map((item, index) => (
              <article className="ops-ledger-row" role="row" key={item.label}>
                <span className="ops-row-line" aria-hidden="true" />
                <span className="ops-ledger-index" role="cell">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="ops-ledger-text" role="cell">
                  <h3 className="ops-scroll-text">
                    <ScrollWords>{item.label}</ScrollWords>
                  </h3>
                  <p className="ops-scroll-text">
                    <ScrollWords>{item.note}</ScrollWords>
                  </p>
                </div>
                <strong className="ops-ledger-value" role="cell">
                  {item.prefix}
                  <Counter end={item.value} duration={1250 + index * 150} active={isVisible} />
                  {item.suffix}
                </strong>
              </article>
            ))}
            <span className="ops-row-line ops-row-line--last" aria-hidden="true" />

          </div>
        </div>
      </div>

      <span className="ops-seam ops-seam--bottom" aria-hidden="true">
        <span className="ops-seam-fill" />
      </span>

      <style jsx global>{`
        .ops-section {
          position: relative;
          z-index: 9;
          overflow: hidden;
          background:
            linear-gradient(180deg, #080614 0%, #090716 48%, #080614 100%),
            #080614 !important;
          padding: clamp(86px, 8vw, 132px) 0 clamp(38px, 4vw, 64px);
        }

        .ops-section::before {
          content: '';
          position: absolute;
          inset: -18% -8%;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 18% 46%, rgba(108, 92, 231, 0.15), transparent 32%),
            radial-gradient(ellipse at 88% 28%, rgba(0, 206, 201, 0.08), transparent 28%),
            linear-gradient(90deg, rgba(216, 216, 224, 0.035) 1px, transparent 1px);
          background-size: auto, auto, 132px 100%;
          opacity: 0.72;
          mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent);
        }

        .ops-seam {
          position: absolute;
          left: clamp(20px, 4vw, 68px);
          right: clamp(20px, 4vw, 68px);
          z-index: 2;
          height: 1px;
          overflow: hidden;
          background: rgba(216, 216, 224, 0.08);
        }

        .ops-seam--top {
          top: 34px;
        }

        .ops-seam--bottom {
          bottom: 0;
        }

        .ops-seam-fill {
          display: block;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(139, 122, 232, 0.55), rgba(0, 206, 201, 0.38), transparent);
        }

        .ops-container {
          position: relative;
          z-index: 1;
          max-width: 1500px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
        }

        .ops-scroll-rail {
          position: absolute;
          left: clamp(22px, 3.2vw, 48px);
          top: clamp(78px, 8vw, 128px);
          bottom: clamp(78px, 8vw, 128px);
          z-index: 2;
          width: 1px;
          overflow: hidden;
          background: rgba(216, 216, 224, 0.08);
        }

        .ops-scroll-rail-fill {
          display: block;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(139, 122, 232, 0), rgba(139, 122, 232, 0.72), rgba(0, 206, 201, 0.44), rgba(139, 122, 232, 0));
        }

        .ops-scroll-text {
          overflow-wrap: anywhere;
        }

        .ops-word {
          display: inline-block;
          will-change: opacity, transform, filter;
        }

        .ops-ledger {
          display: grid;
          grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
          gap: clamp(42px, 7vw, 112px);
          align-items: start;
        }

        .ops-ledger-copy {
          position: relative;
          min-height: 360px;
          padding-top: 10px;
        }

        .ops-kicker {
          display: block;
          color: rgba(139, 122, 232, 0.88) !important;
          font-family: var(--font-subtitle-krafting);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 22px;
        }

        .ops-ledger-copy h2 {
          max-width: 520px;
          color: #f7f5ff !important;
          font-family: var(--font-title-extra);
          font-size: clamp(36px, 4.2vw, 68px);
          font-weight: 900;
          line-height: 1.18;
          letter-spacing: 0;
          text-transform: none;
          text-wrap: balance;
          margin: 0 0 22px;
          text-shadow: 0 0 28px rgba(139, 122, 232, 0.2);
        }

        .ops-ledger-copy p,
        .ops-ledger-caption {
          max-width: 48ch;
          color: rgba(216, 216, 224, 0.7) !important;
          font-family: var(--font-body-regular);
          font-size: clamp(12.5px, 0.9vw, 14px);
          line-height: 1.75;
          text-transform: none;
          margin: 0;
        }

        .ops-ledger-table {
          position: relative;
        }

        .ops-ledger-row {
          position: relative;
          display: grid;
          grid-template-columns: 56px minmax(250px, 1fr) minmax(230px, 300px);
          gap: clamp(22px, 3.4vw, 62px);
          align-items: center;
          min-height: 112px;
          padding: 24px 0;
        }

        .ops-row-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(216, 216, 224, 0.46), rgba(139, 122, 232, 0.22), transparent);
        }

        .ops-row-line--last {
          position: relative;
          display: block;
          margin-top: 0;
        }

        .ops-ledger-index {
          color: rgba(139, 122, 232, 0.82) !important;
          font-family: var(--font-subtitle-krafting);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .ops-ledger-text {
          min-width: 0;
          max-width: 46ch;
        }

        .ops-ledger-text h3 {
          color: rgba(255, 255, 255, 0.95) !important;
          font-family: var(--font-title-extra);
          font-size: clamp(17px, 1.25vw, 23px);
          font-weight: 900;
          line-height: 1.12;
          letter-spacing: 0;
          text-transform: none;
          margin: 0 0 8px;
        }

        .ops-ledger-text p {
          max-width: 40ch;
          color: rgba(216, 216, 224, 0.58) !important;
          font-family: var(--font-body-regular);
          font-size: 12.5px;
          line-height: 1.62;
          text-transform: none;
          margin: 0;
        }

        .ops-ledger-value {
          justify-self: end;
          color: #ffffff !important;
          font-family: var(--font-title-extra);
          font-size: clamp(36px, 4vw, 68px);
          font-variant-numeric: tabular-nums;
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: 0;
          text-align: right;
          white-space: nowrap;
          text-shadow: 0 0 24px rgba(139, 122, 232, 0.22);
        }

        .ops-ledger-caption {
          max-width: 76ch;
          margin-top: 24px;
          color: rgba(216, 216, 224, 0.5) !important;
        }

        .ops-ledger-row:hover .ops-ledger-text h3,
        .ops-ledger-row:hover .ops-ledger-value {
          color: #ffffff !important;
          text-shadow: 0 0 26px rgba(0, 206, 201, 0.16);
        }

        @media (max-width: 1199px) {
          .ops-ledger {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .ops-ledger-copy {
            min-height: 0;
          }
          .ops-ledger-row {
            grid-template-columns: 48px minmax(220px, 1fr) minmax(200px, 260px);
            gap: clamp(18px, 3vw, 44px);
          }

          .ops-ledger-value {
            font-size: clamp(34px, 5vw, 58px);
          }
        }

        @media (max-width: 760px) {
          .ops-section {
            padding: 82px 0 44px;
          }

          .ops-scroll-rail {
            display: none;
          }

          .ops-ledger-row {
            grid-template-columns: 44px minmax(0, 1fr);
            grid-template-areas:
              'idx value'
              'idx text';
            gap: 10px 18px;
            min-height: auto;
            padding: 24px 0 26px;
          }

          .ops-ledger-index {
            grid-area: idx;
            align-self: start;
            padding-top: 8px;
          }

          .ops-ledger-text {
            grid-area: text;
          }

          .ops-ledger-value {
            grid-area: value;
            justify-self: start;
            text-align: left;
            font-size: clamp(42px, 14vw, 68px);
          }

        }

        @media (prefers-reduced-motion: reduce) {
          .ops-word {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }

        @media (max-width: 480px) {
          .ops-container {
            padding: 0 20px;
          }

          .ops-ledger-copy h2 {
            font-size: clamp(34px, 11vw, 48px);
          }
        }
      `}</style>
    </section>
  );
}

function Counter({ end, duration, active }: { end: number; duration: number; active: boolean }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!active || hasAnimated.current) return;
    hasAnimated.current = true;

    let frame = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(end * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setCount(end);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, duration, end]);

  return <>{Math.round(count).toLocaleString('vi-VN')}</>;
}
