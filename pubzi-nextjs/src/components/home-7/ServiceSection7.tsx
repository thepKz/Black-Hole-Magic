'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BeamsBackground } from './note';

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    num: '01',
    title: 'Thực chiến',
    body: 'Không lý thuyết, không template. Mọi chiến lược đều xuất phát từ dữ liệu thực và kinh nghiệm vận hành thực tế.',
  },
  {
    num: '02',
    title: 'Hệ sinh thái khép kín',
    body: 'Từ bản địa hóa đến thanh toán và pháp lý, mọi mắt xích đều nằm trong cùng một hệ sinh thái tối ưu.',
  },
  {
    num: '03',
    title: 'ROI làm trọng tâm',
    body: 'Mọi quyết định đều được đo lường bằng chỉ số. Tối ưu ROI là ngôn ngữ chung với mọi đối tác và nhà đầu tư.',
  },
  {
    num: '04',
    title: 'Tư duy toàn cầu',
    body: 'Am hiểu thị trường địa phương, kết nối tiêu chuẩn quốc tế. Cầu nối tin cậy giữa game studio và người chơi Việt Nam.',
  },
];

// Splits a string into word spans so GSAP can scrub them one by one.
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

export default function ServiceSection7() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.values-kicker',
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.values-head', start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      // Words light up as you scroll and reverse cleanly.
      gsap.utils.toArray<HTMLElement>('.values-title, .vrow-title, .vrow-body').forEach((el) => {
        const words = el.querySelectorAll('.sw');
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 42%', scrub: 0.6 },
          }
        );
      });

      gsap.fromTo(
        '.values-lede',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          delay: 0.25,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.values-head', start: 'top 78%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.utils.toArray<HTMLElement>('.vrow').forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 82%', toggleActions: 'play none none reverse' },
        });
        // hairline + ghost number play once; the text itself is scrubbed above
        tl.fromTo(
          row.querySelector('.vrow-line'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.85, ease: 'power3.inOut' },
          0
        ).fromTo(
          row.querySelector('.vrow-num'),
          { yPercent: 55, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' },
          0.15
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="values-section">
      <BeamsBackground className="values-beams" intensity="subtle" />
      <div className="values-container">
        <div className="values-head">
          <div className="values-head-row">
            <h2 className="values-title">
              <Words text="GIÁ TRỊ CỐT LÕI" />
            </h2>
            <p className="values-lede">
              Bốn nguyên tắc vận hành đứng sau mọi sản phẩm chúng tôi đồng phát hành tại thị trường Việt Nam.
            </p>
          </div>
        </div>

        <div className="values-rail">
          {VALUES.map((v) => (
            <article key={v.num} className="vrow">
              <span className="vrow-line" aria-hidden="true" />
              <span className="vrow-num">{v.num}</span>
              <h3 className="vrow-title">
                <Words text={v.title} />
              </h3>
              <p className="vrow-body">
                <Words text={v.body} />
              </p>
            </article>
          ))}
          <span className="vrail-end" aria-hidden="true" />
        </div>
      </div>

      <style jsx global>{`
        .values-section {
          position: relative;
          z-index: 9;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(139, 122, 232, 0.12), rgba(8, 6, 20, 0) 32%),
            radial-gradient(circle at 78% 18%, rgba(82, 74, 160, 0.18), rgba(8, 6, 20, 0) 36%),
            linear-gradient(180deg, #080614 0%, #090716 58%, #070512 100%);
          padding: 132px 0 132px;
        }

        .values-section::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0) 24%),
            linear-gradient(90deg, rgba(139, 122, 232, 0.04), transparent 34%, rgba(139, 122, 232, 0.035));
          opacity: 0.74;
          pointer-events: none;
        }

        .values-section::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          height: 150px;
          background: linear-gradient(180deg, rgba(7, 5, 18, 0), #070512 86%);
          pointer-events: none;
        }

        .values-beams {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.54;
          pointer-events: none;
          mix-blend-mode: screen;
          -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 10%, #000 78%, transparent 100%);
          mask-image: linear-gradient(180deg, transparent 0%, #000 10%, #000 78%, transparent 100%);
        }

        .beams-background {
          overflow: hidden;
        }

        .beams-background__canvas {
          display: block;
          width: 100%;
          height: 100%;
        }

        .values-section > .values-container {
          position: relative;
          z-index: 2;
        }

        .values-section > .values-container::before {
          content: '';
          position: absolute;
          top: -90px;
          right: clamp(20px, 6vw, 90px);
          width: min(42vw, 620px);
          height: 340px;
          background: radial-gradient(ellipse at center, rgba(139, 122, 232, 0.14), rgba(8, 6, 20, 0) 70%);
          filter: blur(18px);
          pointer-events: none;
          z-index: -1;
        }

        .values-container {
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
        }

        .values-head {
          margin-bottom: 84px;
        }

        .values-kicker {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #8b7ae8;
          margin-bottom: 26px;
        }

        .values-head-row {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(360px, 520px);
          gap: clamp(32px, 5vw, 84px);
          align-items: end;
        }

        .values-title {
          max-width: 780px;
          font-family: var(--font-title-extra);
          font-size: clamp(44px, 4.15vw, 68px);
          font-weight: 900 !important;
          line-height: 1.08;
          color: #fff !important;
          margin: 0;
          letter-spacing: 0;
          text-shadow:
            0 0 14px rgba(255, 255, 255, 0.18),
            0 0 34px rgba(139, 122, 232, 0.28);
          -webkit-font-smoothing: antialiased;
          text-rendering: geometricPrecision;
          will-change: clip-path, transform;
        }

        .values-title .sw {
          color: #fff !important;
          font-family: inherit;
          font-weight: inherit;
        }

        .values-lede {
          font-family: var(--font-body-regular);
          font-size: clamp(15px, 1vw, 17px);
          font-weight: 400 !important;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.62) !important;
          text-transform: none;
          max-width: 46ch;
          margin: 0 0 8px auto;
          text-align: right;
        }

        .values-lede .sw,
        .vrow-body .sw {
          color: inherit !important;
          font-family: inherit;
          font-weight: inherit;
        }

        .values-rail {
          position: relative;
        }

        .vrow {
          position: relative;
          display: grid;
          grid-template-columns: minmax(96px, 150px) minmax(260px, 0.85fr) minmax(360px, 1.15fr);
          align-items: center;
          gap: clamp(24px, 3.4vw, 56px);
          padding: 46px clamp(18px, 2vw, 30px);
          transition: background 0.45s ease;
        }

        .vrow-line,
        .vrail-end {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(139, 122, 232, 0.45), rgba(139, 122, 232, 0.08) 70%, transparent);
          transform-origin: left center;
        }

        .vrail-end {
          position: relative;
          display: block;
        }

        .vrow::before {
          content: '';
          position: absolute;
          left: 0;
          top: 18%;
          bottom: 18%;
          width: 2px;
          background: linear-gradient(180deg, #8b7ae8, rgba(108, 92, 231, 0.2));
          transform: scaleY(0);
          transform-origin: top center;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .vrow:hover {
          background: linear-gradient(90deg, rgba(139, 122, 232, 0.07), rgba(139, 122, 232, 0.015) 55%, transparent);
        }

        .vrow:hover::before {
          transform: scaleY(1);
        }

        .vrow-num {
          font-family: var(--font-title-extra);
          font-size: clamp(72px, 6.2vw, 104px);
          font-weight: 900 !important;
          line-height: 0.9;
          color: transparent;
          -webkit-text-stroke: 1px rgba(139, 122, 232, 0.34);
          user-select: none;
          transition: -webkit-text-stroke-color 0.4s ease, color 0.4s ease;
          will-change: transform, opacity;
        }

        .vrow:hover .vrow-num {
          -webkit-text-stroke-color: rgba(176, 156, 255, 0.85);
          color: rgba(139, 122, 232, 0.12);
        }

        .vrow-title {
          font-family: var(--font-subtitle-krafting);
          font-size: clamp(24px, 2vw, 34px);
          font-weight: 700 !important;
          line-height: 1.15;
          color: #fff !important;
          margin: 0;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: clip-path, transform;
        }

        .vrow-title .sw {
          color: #fff !important;
          font-family: inherit;
          font-weight: inherit;
        }

        .vrow:hover .vrow-title {
          transform: translateX(12px);
        }

        .vrow-body {
          font-family: var(--font-body-regular);
          font-size: clamp(14px, 0.95vw, 16px);
          font-weight: 400 !important;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.7) !important;
          text-transform: none;
          max-width: 58ch;
          margin: 0;
        }

        @media (max-width: 1399px) {
          .values-head-row {
            grid-template-columns: 1fr;
            gap: 22px;
            align-items: start;
          }

          .values-title {
            max-width: 860px;
          }

          .values-lede {
            max-width: 64ch;
            text-align: left;
            margin: 0;
          }

          .vrow {
            grid-template-columns: minmax(82px, 120px) minmax(220px, 0.75fr) minmax(320px, 1fr);
          }
        }

        @media (max-width: 1199px) {
          .vrow {
            grid-template-columns: 110px 1fr;
            grid-template-areas:
              'num title'
              'num body';
            row-gap: 12px;
            padding: 38px 18px;
          }

          .vrow-num {
            grid-area: num;
            font-size: 72px;
          }

          .vrow-title {
            grid-area: title;
          }

          .vrow-body {
            grid-area: body;
            max-width: 70ch;
          }
        }

        @media (max-width: 767px) {
          .values-title {
            font-size: clamp(36px, 10vw, 52px);
          }

          .values-kicker {
            font-size: 11px;
            letter-spacing: 2.4px;
          }
        }

        @media (max-width: 600px) {
          .values-section {
            padding: 90px 0 100px;
          }

          .values-container {
            padding: 0 24px;
          }

          .values-head {
            margin-bottom: 52px;
          }

          .values-lede {
            font-size: 14px;
            line-height: 1.65;
          }

          .vrow {
            grid-template-columns: 1fr;
            grid-template-areas:
              'num'
              'title'
              'body';
            padding: 30px 6px;
          }

          .vrow-num {
            font-size: 56px;
          }

          .vrow-title {
            font-size: 25px;
          }
        }
      `}</style>
    </section>
  );
}
