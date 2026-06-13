'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="sw">
          {w}
          {' '}
        </span>
      ))}
    </>
  );
}

function MaskedWords({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="swm">
          <span className="sw">{w}</span>
        </span>
      ))}
    </>
  );
}

const FEATURED = {
  quote:
    'Blackhole Game hiểu người chơi Việt hơn bất kỳ đối tác nào chúng tôi từng hợp tác. Chỉ số giữ chân người chơi sau 30 ngày vượt mọi kỳ vọng của studio.',
  name: 'Giám đốc Phát hành',
  org: 'Studio quốc tế · NDA',
  initials: 'GP',
};

const QUOTES = [
  {
    quote: 'Quy trình bản địa hóa và pháp lý gọn đến mức chúng tôi ra mắt sớm hơn kế hoạch một quý.',
    name: 'Trưởng dự án',
    org: 'NPH Hàn Quốc',
    initials: 'TD',
  },
  {
    quote: 'Một đội ngũ nói chuyện bằng số liệu. Báo cáo ROI minh bạch theo từng tuần vận hành.',
    name: 'Quản lý đầu tư',
    org: 'Quỹ game khu vực',
    initials: 'QD',
  },
];

export default function TestimonialSection7() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tsm-kicker',
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.tsm-head', start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(
        '.tsm-meta > *',
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.tsm-head', start: 'top 78%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(
        '.tsm-title .sw',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: '.tsm-title', start: 'top 90%', end: 'top 42%', scrub: 0.6 },
        }
      );

      gsap.fromTo(
        '.tsm-arc-halo, .tsm-arc-core',
        { strokeDashoffset: 38 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.tsm-feat', start: 'top 85%', end: 'center 45%', scrub: 0.8 },
        }
      );

      gsap.fromTo(
        '.tsm-arc-orbit',
        { rotation: -62 },
        {
          rotation: 56,
          ease: 'none',
          scrollTrigger: { trigger: '.tsm-feat', start: 'top 85%', end: 'center 45%', scrub: 0.8 },
        }
      );

      gsap.fromTo(
        '.tsm-feat-text .sw',
        { yPercent: 62, opacity: 0.12 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.045,
          ease: 'none',
          scrollTrigger: { trigger: '.tsm-feat-text', start: 'top 86%', end: 'top 34%', scrub: 0.6 },
        }
      );

      const line = section.querySelector<HTMLElement>('.tsm-feat-line');
      if (line) {
        gsap.timeline({
          scrollTrigger: {
            trigger: line,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        })
          .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' })
          .fromTo(
            '.tsm-feat-glint',
            { x: -90 },
            { x: () => line.offsetWidth + 90, duration: 1.1, ease: 'power2.inOut' },
            '-=0.25'
          )
          .fromTo(
            '.tsm-feat .tsm-author',
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.7'
          );
      }

      gsap.utils.toArray<HTMLElement>('.tsm-row').forEach((row) => {
        gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 84%', toggleActions: 'play none none reverse' },
        })
          .fromTo(
            row.querySelector('.tsm-row-line'),
            { scaleX: 0 },
            { scaleX: 1, duration: 0.85, ease: 'power3.inOut' },
            0
          )
          .fromTo(
            [row.querySelector('.tsm-row-idx'), row.querySelector('.tsm-row-text'), row.querySelector('.tsm-author')],
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
            0.12
          );
      });

      const mm = gsap.matchMedia();
      mm.add('(min-width: 1200px) and (pointer: fine)', () => {
        const seal = section.querySelector<HTMLElement>('.tsm-feat .tsm-seal');
        const zone = section.querySelector<HTMLElement>('.tsm-feat .tsm-author');
        if (!seal || !zone) return undefined;

        const xTo = gsap.quickTo(seal, 'x', { duration: 0.45, ease: 'power3' });
        const yTo = gsap.quickTo(seal, 'y', { duration: 0.45, ease: 'power3' });
        const maxPull = 9;

        const onMove = (e: PointerEvent) => {
          const r = seal.getBoundingClientRect();
          xTo(gsap.utils.clamp(-maxPull, maxPull, (e.clientX - (r.left + r.width / 2)) * 0.18));
          yTo(gsap.utils.clamp(-maxPull, maxPull, (e.clientY - (r.top + r.height / 2)) * 0.18));
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        zone.addEventListener('pointermove', onMove);
        zone.addEventListener('pointerleave', onLeave);

        return () => {
          zone.removeEventListener('pointermove', onMove);
          zone.removeEventListener('pointerleave', onLeave);
        };
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="tsm-section">
      <div className="tsm-container">
        <header className="tsm-head">
          <div className="tsm-headcol">
            <h6 className="tsm-kicker">Tiếng nói đối tác</h6>
            <h2 className="tsm-title">
              <Words text="Khách hàng nói về chúng tôi" />
            </h2>
          </div>
          <aside className="tsm-meta">
            <span className="tsm-meta-idx">01-03</span>
            <span className="tsm-meta-note">Trích dẫn được ẩn danh theo thỏa thuận NDA</span>
          </aside>
        </header>

        <div className="tsm-grid">
          <figure className="tsm-feat">
            <div className="tsm-arcwrap" aria-hidden="true">
              <svg className="tsm-arc" viewBox="0 0 600 600" focusable="false">
                <circle className="tsm-arc-halo" cx="300" cy="300" r="258" pathLength="100" />
                <circle className="tsm-arc-core" cx="300" cy="300" r="258" pathLength="100" />
              </svg>
              <div className="tsm-arc-orbit">
                <span className="tsm-arc-sat" />
              </div>
            </div>

            <span className="tsm-feat-idx" aria-hidden="true">01</span>
            <blockquote className="tsm-feat-text">
              <MaskedWords text={FEATURED.quote} />
            </blockquote>
            <span className="tsm-feat-line" aria-hidden="true">
              <span className="tsm-feat-glint" />
            </span>
            <figcaption className="tsm-author">
              <span className="tsm-seal">{FEATURED.initials}</span>
              <span className="tsm-author-id">
                <strong>{FEATURED.name}</strong>
                <em>{FEATURED.org}</em>
              </span>
            </figcaption>
          </figure>

          <div className="tsm-rail">
            {QUOTES.map((q, i) => (
              <figure key={q.initials} className="tsm-row">
                <span className="tsm-row-line" aria-hidden="true" />
                <span className="tsm-row-idx" aria-hidden="true">
                  {String(i + 2).padStart(2, '0')}
                </span>
                <div className="tsm-row-main">
                  <blockquote className="tsm-row-text">{q.quote}</blockquote>
                  <figcaption className="tsm-author tsm-author-sm">
                    <span className="tsm-seal tsm-seal-sm">{q.initials}</span>
                    <span className="tsm-author-id">
                      <strong>{q.name}</strong>
                      <em>{q.org}</em>
                    </span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .tsm-section {
          position: relative;
          z-index: 9;
          background: #080614 !important;
          background-color: #080614 !important;
          padding: 150px 0 160px;
          overflow: hidden;
        }

        .tsm-container {
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 48px;
        }

        .tsm-head {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 32px;
          margin-bottom: 96px;
        }

        .tsm-kicker {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #8b7ae8 !important;
          text-shadow: none !important;
          margin: 0 0 24px;
        }

        .tsm-title {
          font-size: clamp(36px, 3.8vw, 56px);
          font-weight: 700;
          line-height: 1.12;
          letter-spacing: 0;
          color: #fff;
          margin: 0;
          max-width: 16ch;
        }

        .tsm-meta {
          text-align: right;
          padding-bottom: 6px;
        }

        .tsm-meta-idx {
          display: block;
          font-variant-numeric: tabular-nums;
          font-size: 13px;
          letter-spacing: 5px;
          color: rgba(139, 122, 232, 0.9) !important;
          margin-bottom: 10px;
        }

        .tsm-meta-note {
          display: block;
          max-width: 32ch;
          font-size: 12.5px;
          line-height: 1.6;
          letter-spacing: 0.6px;
          text-transform: none;
          color: rgba(216, 216, 224, 0.55) !important;
        }

        .tsm-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
          gap: 72px;
          align-items: start;
        }

        .tsm-feat {
          position: relative;
          margin: 0;
          padding: 56px 0 0;
        }

        .tsm-feat::before {
          content: '';
          position: absolute;
          top: -140px;
          left: -200px;
          width: 760px;
          height: 560px;
          background: radial-gradient(closest-side, rgba(108, 92, 231, 0.13), transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .tsm-arcwrap {
          position: absolute;
          top: -120px;
          left: -260px;
          width: 620px;
          height: 620px;
          pointer-events: none;
          z-index: 0;
        }

        .tsm-arc {
          display: block;
          width: 100%;
          height: 100%;
          transform: rotate(-158deg);
        }

        .tsm-arc-halo {
          fill: none;
          stroke: rgba(108, 92, 231, 0.16);
          stroke-width: 7;
          stroke-linecap: round;
          stroke-dasharray: 38 62;
        }

        .tsm-arc-core {
          fill: none;
          stroke: rgba(139, 122, 232, 0.75);
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-dasharray: 38 62;
        }

        .tsm-arc-orbit {
          position: absolute;
          inset: 0;
          transform: rotate(56deg);
        }

        .tsm-arc-sat {
          position: absolute;
          left: calc(50% - 4px);
          top: calc(7% - 4px);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cfc3ff;
          box-shadow:
            0 0 10px rgba(139, 122, 232, 0.9),
            0 0 26px rgba(108, 92, 231, 0.55);
        }

        .tsm-feat-idx {
          position: relative;
          z-index: 1;
          display: inline-block;
          font-variant-numeric: tabular-nums;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 4px;
          color: rgba(139, 122, 232, 0.85) !important;
          margin-bottom: 26px;
        }

        .tsm-feat-text {
          position: relative;
          z-index: 1;
          font-family: var(--font-headline);
          font-size: clamp(26px, 2.5vw, 40px);
          font-weight: 600;
          line-height: 1.42;
          letter-spacing: 0;
          text-transform: none;
          margin: 0 0 40px;
        }

        .swm {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding: 0.16em 0.02em 0.08em;
          margin: -0.16em 0.28em -0.08em -0.02em;
        }

        .tsm-feat-text .swm:last-child {
          margin-right: -0.02em;
        }

        .tsm-feat-text .sw {
          display: inline-block;
          color: rgba(255, 255, 255, 0.96) !important;
        }

        .tsm-feat-line {
          position: relative;
          z-index: 1;
          display: block;
          height: 1px;
          margin-bottom: 34px;
          overflow: hidden;
          background: linear-gradient(90deg, rgba(139, 122, 232, 0.5), rgba(139, 122, 232, 0.08) 75%, transparent);
          transform-origin: left center;
        }

        .tsm-feat-glint {
          position: absolute;
          top: 0;
          left: 0;
          width: 90px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(224, 214, 255, 0.95), transparent);
        }

        .tsm-author {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .tsm-seal {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          flex: 0 0 auto;
          font-family: var(--font-headline);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #d9d0ff !important;
          background: radial-gradient(circle at 32% 26%, rgba(139, 122, 232, 0.42), rgba(18, 11, 46, 0.92) 72%);
          box-shadow:
            0 0 0 1px rgba(139, 122, 232, 0.5),
            0 0 22px rgba(108, 92, 231, 0.22);
        }

        .tsm-author-id strong {
          display: block;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          text-transform: none;
          letter-spacing: 0.2px;
        }

        .tsm-author-id em {
          display: block;
          font-style: normal;
          font-size: 12.5px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: rgba(196, 184, 255, 0.6);
          margin-top: 4px;
        }

        .tsm-rail {
          display: flex;
          flex-direction: column;
          margin-top: 112px;
        }

        .tsm-row {
          position: relative;
          margin: 0;
          display: grid;
          grid-template-columns: 64px minmax(0, 1fr);
          padding: 30px 0 34px;
        }

        .tsm-row + .tsm-row {
          margin-top: 6px;
        }

        .tsm-row:last-child {
          margin-left: 40px;
        }

        .tsm-row-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(139, 122, 232, 0.38), rgba(139, 122, 232, 0.05) 70%, transparent);
          transform-origin: left center;
        }

        .tsm-row::before {
          content: '';
          position: absolute;
          left: 0;
          top: 22px;
          bottom: 26px;
          width: 2px;
          background: linear-gradient(180deg, #8b7ae8, rgba(108, 92, 231, 0.06));
          transform: scaleY(0);
          transform-origin: top center;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .tsm-row:hover::before {
          transform: scaleY(1);
        }

        .tsm-row-idx {
          font-variant-numeric: tabular-nums;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          color: rgba(139, 122, 232, 0.6) !important;
          padding: 4px 0 0 18px;
          transition: color 0.35s ease;
        }

        .tsm-row:hover .tsm-row-idx {
          color: rgba(176, 156, 255, 0.95) !important;
        }

        .tsm-row-text {
          font-size: 16.5px;
          line-height: 1.75;
          text-transform: none;
          margin: 0 0 24px;
          color: rgba(255, 255, 255, 0.68);
          transition: color 0.35s ease;
        }

        .tsm-row:hover .tsm-row-text {
          color: rgba(255, 255, 255, 0.92);
        }

        .tsm-author-sm {
          gap: 14px;
        }

        .tsm-seal-sm {
          width: 44px;
          height: 44px;
          font-size: 12.5px;
          box-shadow: 0 0 0 1px rgba(139, 122, 232, 0.4);
        }

        @media (max-width: 1399px) {
          .tsm-grid {
            gap: 56px;
          }

          .tsm-rail {
            margin-top: 84px;
          }
        }

        @media (max-width: 1199px) {
          .tsm-head {
            grid-template-columns: 1fr;
            align-items: start;
            gap: 18px;
            margin-bottom: 72px;
          }

          .tsm-meta {
            text-align: left;
            padding-bottom: 0;
          }

          .tsm-meta-idx {
            display: inline-block;
            margin: 0 18px 0 0;
          }

          .tsm-meta-note {
            display: inline-block;
          }

          .tsm-grid {
            grid-template-columns: 1fr;
            gap: 64px;
          }

          .tsm-rail {
            margin-top: 0;
          }

          .tsm-row:last-child {
            margin-left: 0;
          }

          .tsm-arcwrap {
            top: -150px;
            left: -300px;
            opacity: 0.7;
          }
        }

        @media (max-width: 767px) {
          .tsm-feat-text {
            font-size: clamp(22px, 5.6vw, 28px);
            line-height: 1.5;
          }

          .tsm-arcwrap {
            width: 480px;
            height: 480px;
            top: -130px;
            left: -260px;
          }
        }

        @media (max-width: 600px) {
          .tsm-section {
            padding: 90px 0 100px;
          }

          .tsm-container {
            padding: 0 24px;
          }

          .tsm-head {
            margin-bottom: 52px;
          }

          .tsm-feat {
            padding-top: 36px;
          }

          .tsm-row {
            grid-template-columns: 48px minmax(0, 1fr);
            padding: 24px 0 28px;
          }

          .tsm-row-idx {
            padding-left: 14px;
          }

          .tsm-seal {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </section>
  );
}
