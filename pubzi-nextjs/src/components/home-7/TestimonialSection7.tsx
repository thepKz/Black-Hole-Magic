'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Card = {
  text: string;
  name: string;
  role?: string;
  avatar: string;
};

const CARDS: Card[] = [
  {
    text: 'Cách tiếp cận dựa trên dữ liệu của Blackhole đã giúp chiến dịch của chúng tôi vượt xa kỳ vọng.',
    name: 'Publisher Quốc tế',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Quy trình bản địa hóa và pháp lý được thực hiện nhanh hơn dự kiến, giúp dự án ra mắt đúng thời điểm.',
    name: 'Studio Hàn Quốc',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Mọi báo cáo đều minh bạch và tập trung vào hiệu quả thực tế.',
    name: 'Marketing Director',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Khả năng xây dựng cộng đồng của Blackhole tạo nên giá trị dài hạn cho sản phẩm.',
    name: 'Community Partner',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
  },
];

const CARD_HEIGHT = 270;
const GAP = 20;
const col1 = CARDS.slice(0, 2);
const col2 = CARDS.slice(2, 3);
const col3 = CARDS.slice(3, 4);

function ScrollWords({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\s+)/).map((segment, index) =>
        segment.trim() ? (
          <span className="tst-word" key={`${segment}-${index}`}>
            {segment}
          </span>
        ) : (
          segment
        )
      )}
    </>
  );
}

function Column({ cards, duration, delay = 0, reverse = false }: { cards: Card[]; duration: number; delay?: number; reverse?: boolean }) {
  const reduceMotion = useReducedMotion();
  const doubled = [...cards, ...cards];
  const distance = cards.length * (CARD_HEIGHT + GAP);

  return (
    <div className="tst-column">
      <motion.div
        className="tst-column-track"
        animate={reduceMotion ? { y: 0 } : { y: reverse ? [-distance, 0] : [0, -distance] }}
        transition={reduceMotion ? undefined : { duration, ease: 'linear', repeat: Infinity, delay }}
      >
        {doubled.map((card, index) => (
          <article className="tst-card" key={`${card.name}-${index}`}>
            <span className="tst-card-line" aria-hidden="true" />
            <p>&ldquo;{card.text}&rdquo;</p>
            <div className="tst-author">
              <img src={card.avatar} alt={card.name} loading="lazy" />
              <div>
                <strong>{card.name}</strong>
                {card.role ? <span>{card.role}</span> : null}
              </div>
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

export default function TestimonialSection7() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const enter = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          toggleActions: 'play none none reverse',
        },
      });

      enter
        .fromTo(
          '.tst-seam-fill, .tst-header-line',
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.95, ease: 'power3.inOut', stagger: 0.08 },
          0
        )
        .fromTo(
          '.tst-kicker, .tst-proof-note',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.72, ease: 'power3.out', stagger: 0.08 },
          0.08
        )
        .fromTo(
          '.tst-column',
          { autoAlpha: 0, y: 42, clipPath: 'inset(12% 0 12% 0)' },
          { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0 0% 0)', duration: 1, ease: 'power3.out', stagger: 0.12 },
          0.22
        );

      gsap.utils.toArray<HTMLElement>('.tst-scroll-text').forEach((textBlock) => {
        const words = textBlock.querySelectorAll<HTMLElement>('.tst-word');
        if (!words.length) return;

        gsap.fromTo(
          words,
          { autoAlpha: 0.16, y: 12, filter: 'blur(2px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'none',
            stagger: 0.03,
            scrollTrigger: {
              trigger: textBlock,
              start: 'top 90%',
              end: 'top 48%',
              scrub: 0.65,
            },
          }
        );
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
        .to('.tst-columns', { yPercent: -4, ease: 'none' }, 0)
        .fromTo('.tst-scroll-rail-fill', { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 1, ease: 'none' }, 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="tst-section" aria-labelledby="tst-title">
      <span className="tst-seam tst-seam--top" aria-hidden="true">
        <span className="tst-seam-fill" />
      </span>
      <span className="tst-scroll-rail" aria-hidden="true">
        <span className="tst-scroll-rail-fill" />
      </span>

      <div className="tst-container">
        <div className="tst-header">
          <div className="tst-title-block">
          
            <h2 id="tst-title" className="tst-scroll-text">
              <ScrollWords>06. KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI</ScrollWords>
            </h2>
          </div>

          <aside className="tst-proof-note">
            <span className="tst-header-line" aria-hidden="true" />
            <p className="tst-scroll-text">
              <ScrollWords>Được tin tưởng bởi các studio, publisher và đối tác trong khu vực.</ScrollWords>
            </p>

          </aside>
        </div>

        <div className="tst-columns" aria-label="Nhận xét đối tác">
          <Column cards={col1} duration={(col1.length * (CARD_HEIGHT + GAP)) / 34} />
          <Column cards={col2} duration={(col2.length * (CARD_HEIGHT + GAP)) / 28} delay={0.75} reverse />
          <Column cards={col3} duration={(col3.length * (CARD_HEIGHT + GAP)) / 31} delay={0.35} />
        </div>

        <div className="tst-partner-bridge" aria-hidden="true">
          <span className="tst-bridge-line" />
          <span className="tst-bridge-node" />
          <span className="tst-bridge-copy">Từ phản hồi đối tác đến mạng lưới sáng tạo</span>
          <span className="tst-bridge-node" />
        </div>
      </div>

      <span className="tst-seam tst-seam--bottom" aria-hidden="true">
        <span className="tst-seam-fill" />
      </span>

      <style jsx global>{`
        .tst-section {
          position: relative;
          z-index: 9;
          overflow: hidden;
          isolation: isolate;
          background:
            linear-gradient(180deg, #080614 0%, #07050f 54%, #080614 100%),
            #080614 !important;
          padding: clamp(46px, 4vw, 66px) 0 clamp(58px, 6vw, 92px);
        }

        .tst-section::before {
          content: '';
          position: absolute;
          inset: -16% -8%;
          z-index: -2;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 18% 0%, rgba(139, 122, 232, 0.13), transparent 34%),
            radial-gradient(ellipse at 82% 82%, rgba(0, 206, 201, 0.045), transparent 30%),
            linear-gradient(90deg, rgba(216, 216, 224, 0.03) 1px, transparent 1px);
          background-size: auto, auto, 132px 100%;
          mask-image: linear-gradient(180deg, transparent, #000 14%, #000 88%, transparent);
        }

        .tst-seam {
          position: absolute;
          left: clamp(20px, 4vw, 68px);
          right: clamp(20px, 4vw, 68px);
          z-index: 2;
          height: 1px;
          overflow: hidden;
          background: rgba(216, 216, 224, 0.08);
        }

        .tst-seam--top {
          top: 0;
        }

        .tst-seam--bottom {
          bottom: 0;
        }

        .tst-seam-fill {
          display: block;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(139, 122, 232, 0.52), rgba(216, 216, 224, 0.2), transparent);
        }

        .tst-scroll-rail {
          position: absolute;
          left: clamp(22px, 3.2vw, 48px);
          top: clamp(46px, 5vw, 76px);
          bottom: clamp(80px, 8vw, 132px);
          z-index: 2;
          width: 1px;
          overflow: hidden;
          background: rgba(216, 216, 224, 0.08);
        }

        .tst-scroll-rail-fill {
          display: block;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(139, 122, 232, 0), rgba(139, 122, 232, 0.72), rgba(0, 206, 201, 0.32), rgba(139, 122, 232, 0));
        }

        .tst-container {
          position: relative;
          z-index: 1;
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
        }

        .tst-header {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(360px, 520px);
          gap: clamp(32px, 5vw, 84px);
          align-items: end;
          margin-bottom: 64px;
        }

        .tst-kicker {
          display: block;
          color: rgba(139, 122, 232, 0.9) !important;
          font-family: var(--font-subtitle-krafting);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 22px;
        }

        .tst-title-block h2 {
          max-width: 780px;
          color: #f7f5ff !important;
          font-family: var(--font-title-extra);
          font-size: clamp(46px, 4.8vw, 82px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: 0;
          text-transform: none;
          text-wrap: balance;
          margin: 0;
          text-shadow: 0 0 34px rgba(139, 122, 232, 0.22);
        }

        .tst-proof-note {
          max-width: 520px;
          margin-left: auto;
        }

        .tst-header-line {
          display: block;
          width: 100%;
          height: 1px;
          margin-bottom: 22px;
          background: linear-gradient(90deg, rgba(216, 216, 224, 0.5), rgba(139, 122, 232, 0.22), transparent);
        }

        .tst-proof-note p {
          color: rgba(216, 216, 224, 0.72) !important;
          font-family: var(--font-body-regular);
          font-size: clamp(13px, 0.92vw, 15px);
          line-height: 1.78;
          text-transform: none;
          margin: 0;
        }

        .tst-proof-meta {
          display: grid;
          grid-template-columns: auto 1fr auto 1fr;
          align-items: baseline;
          gap: 10px 12px;
          margin-top: 28px;
          color: rgba(216, 216, 224, 0.56);
          font-family: var(--font-body-regular);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .tst-proof-meta strong {
          color: #ffffff;
          font-family: var(--font-title-extra);
          font-size: 28px;
          line-height: 1;
          letter-spacing: 0;
        }

        .tst-columns {
          display: flex;
          justify-content: center;
          gap: clamp(18px, 2vw, 28px);
          max-height: clamp(560px, 62vw, 680px);
          overflow: hidden;
          mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 82%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 82%, transparent 100%);
          will-change: transform;
        }

        .tst-partner-bridge {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto auto auto 1fr;
          align-items: center;
          gap: 14px;
          min-height: clamp(82px, 7vw, 116px);
          margin-top: clamp(20px, 3vw, 42px);
          color: rgba(216, 216, 224, 0.58);
          font-family: var(--font-subtitle-krafting);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .tst-partner-bridge::before {
          content: '';
          position: absolute;
          left: clamp(24px, 7vw, 110px);
          right: clamp(24px, 7vw, 110px);
          top: 50%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139, 122, 232, 0.5), rgba(216, 216, 224, 0.22), rgba(0, 206, 201, 0.24), transparent);
        }

        .tst-bridge-line {
          height: 1px;
        }

        .tst-bridge-node {
          position: relative;
          z-index: 1;
          width: 9px;
          height: 9px;
          border: 1px solid rgba(216, 216, 224, 0.52);
          border-radius: 50%;
          background: #080614;
          box-shadow: 0 0 22px rgba(139, 122, 232, 0.32);
        }

        .tst-bridge-copy {
          position: relative;
          z-index: 1;
          padding: 10px 18px;
          border: 1px solid rgba(216, 216, 224, 0.1);
          border-radius: 999px;
          background: rgba(8, 6, 20, 0.88);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
          white-space: nowrap;
        }

        .tst-column {
          width: min(30vw, 380px);
          min-width: 310px;
          flex: 0 0 auto;
          overflow: hidden;
          will-change: transform, opacity, clip-path;
        }

        .tst-column-track {
          display: flex;
          flex-direction: column;
          gap: ${GAP}px;
        }

        .tst-card {
          position: relative;
          min-height: ${CARD_HEIGHT}px;
          padding: 28px 28px 24px;
          overflow: hidden;
          border: 1px solid rgba(216, 216, 224, 0.18);
          border-radius: 8px;
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.018)),
            rgba(12, 10, 24, 0.74);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.055), 0 22px 58px rgba(0, 0, 0, 0.28);
        }

        .tst-card-line {
          position: absolute;
          top: 0;
          left: 24px;
          right: 24px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139, 122, 232, 0.55), transparent);
        }

        .tst-card p {
          color: rgba(247, 245, 255, 0.78) !important;
          font-family: var(--font-body-regular);
          font-size: clamp(13px, 0.95vw, 15px);
          font-weight: 700;
          line-height: 1.78;
          letter-spacing: 0;
          text-transform: none;
          margin: 0 0 24px;
        }

        .tst-author {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;
        }

        .tst-author img {
          width: 38px;
          height: 38px;
          flex: 0 0 auto;
          object-fit: cover;
          border-radius: 50%;
          border: 1px solid rgba(139, 122, 232, 0.42);
          filter: saturate(0.82);
        }

        .tst-author strong,
        .tst-author span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tst-author strong {
          color: #ffffff !important;
          font-family: var(--font-title-extra);
          font-size: 13px;
          line-height: 1.15;
          letter-spacing: 0;
          text-transform: none;
        }

        .tst-author span {
          color: rgba(139, 122, 232, 0.7) !important;
          font-family: var(--font-subtitle-krafting);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .tst-scroll-text {
          overflow-wrap: anywhere;
        }

        .tst-word {
          display: inline-block;
          will-change: opacity, transform, filter;
        }

        @media (max-width: 1199px) {
          .tst-header {
            grid-template-columns: 1fr;
            gap: 34px;
          }

          .tst-proof-note {
            max-width: 680px;
            margin-left: 0;
          }

          .tst-column {
            min-width: 290px;
          }
        }

        @media (max-width: 760px) {
          .tst-section {
            padding: 44px 0 64px;
            background:
              radial-gradient(ellipse 65% 30% at 20% 15%, rgba(139, 122, 232, 0.12), transparent 55%),
              radial-gradient(ellipse 45% 25% at 80% 85%, rgba(82, 74, 160, 0.09), transparent 50%),
              linear-gradient(180deg, #080614 0%, #07050f 54%, #080614 100%);
          }

          .tst-scroll-rail {
            display: none;
          }

          .tst-header {
            margin-bottom: 44px;
          }

          .tst-title-block h2 {
            font-size: clamp(34px, 10vw, 48px);
          }

          .tst-proof-meta {
            grid-template-columns: auto 1fr;
          }

          .tst-columns {
            justify-content: flex-start;
            gap: 16px;
            max-height: 590px;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 10px;
            scroll-snap-type: x mandatory;
            mask-image: none;
            -webkit-mask-image: none;
          }

          .tst-partner-bridge {
            display: flex;
            justify-content: center;
            min-height: 88px;
            margin-top: 18px;
            font-size: 9.5px;
            letter-spacing: 0.12em;
          }

          .tst-bridge-line,
          .tst-bridge-node {
            display: none;
          }

          .tst-bridge-copy {
            white-space: normal;
            text-align: center;
          }

          .tst-column {
            width: 82vw;
            min-width: 82vw;
            scroll-snap-align: start;
          }
        }

        @media (max-width: 480px) {
          .tst-container {
            padding: 0 20px;
          }

          .tst-card {
            padding: 24px 22px 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tst-word {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </section>
  );
}
