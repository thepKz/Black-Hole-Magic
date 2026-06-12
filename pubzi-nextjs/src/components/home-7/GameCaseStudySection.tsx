'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GameItem {
  num: string;
  title: string;
  genre: string;
  platform: string;
  image: string;
}

// NOTE: images are template placeholders — drop the real key-art into
// public/assets/img/home-3/game-case-study/ with the same names to replace.
const GAMES: GameItem[] = [
  {
    num: '01',
    title: 'Võ Lâm Truyền Kỳ 2',
    genre: 'MMORPG Kiếm Hiệp',
    platform: 'PC',
    image: '/assets/img/home-3/game-case-study/game-01.jpg',
  },
  {
    num: '02',
    title: 'Võ Lâm JX2 Global',
    genre: 'MMORPG Kiếm Hiệp',
    platform: 'Global',
    image: '/assets/img/home-3/game-case-study/game-02.jpg',
  },
  {
    num: '03',
    title: 'Kiếm Thế Mobile',
    genre: 'MMORPG',
    platform: 'Mobile',
    image: '/assets/img/home-3/game-case-study/game-03.jpg',
  },
  {
    num: '04',
    title: 'Con Đường Tơ Lụa',
    genre: 'MMORPG',
    platform: 'PC',
    image: '/assets/img/home-3/game-case-study/game-04.jpg',
  },
  {
    num: '05',
    title: 'Thiên Long Bát Bộ',
    genre: 'MMORPG',
    platform: 'PC & Mobile',
    image: '/assets/img/home-3/game-case-study/game-05.jpg',
  },
];

export default function GameCaseStudySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.games-kicker',
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.games-head', start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(
        '.games-title',
        { clipPath: 'inset(0 0 100% 0)', y: 34 },
        {
          clipPath: 'inset(0 0 -12% 0)',
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.games-head', start: 'top 78%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(
        '.games-lede',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          delay: 0.25,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.games-head', start: 'top 78%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(
        '.game-panel',
        { clipPath: 'inset(100% 0 0 0)', y: 30 },
        {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: '.games-strip', start: 'top 78%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="games-section">
      <div className="games-container">
        <div className="games-head">
          <h6 className="games-kicker">DANH MỤC PHÁT HÀNH</h6>
          <div className="games-head-row">
            <h2 className="games-title">
              Những tựa game
              <br />
              chúng tôi đồng hành
            </h2>
            <p className="games-lede">
              Các IP đã và đang được Blackhole Game đồng phát hành, vận hành và tăng trưởng tại thị trường Việt Nam.
            </p>
          </div>
        </div>

        <div className="games-strip">
          {GAMES.map((g) => (
            <article key={g.num} className="game-panel" tabIndex={0}>
              <div
                className="game-panel-art"
                style={{ backgroundImage: `url('${g.image}')` }}
              />
              <div className="game-panel-tint" />
              <span className="game-panel-num">{g.num}</span>
              <div className="game-panel-info">
                <h3 className="game-panel-title">{g.title}</h3>
                <p className="game-panel-meta">
                  {g.genre} · {g.platform}
                </p>
              </div>
              <span className="game-panel-edge" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .games-section {
          position: relative;
          z-index: 9;
          background: #080614;
          padding: 140px 0 150px;
        }

        .games-container {
          max-width: 1700px;
          margin: 0 auto;
          padding: 0 48px;
        }

        .games-head {
          margin-bottom: 64px;
        }

        .games-kicker {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #8b7ae8;
          margin-bottom: 26px;
        }

        .games-head-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: end;
        }

        .games-title {
          font-size: clamp(38px, 4vw, 58px);
          font-weight: 800;
          line-height: 1.08;
          color: #fff;
          margin: 0;
          text-shadow:
            0 0 22px rgba(255, 255, 255, 0.28),
            0 0 56px rgba(139, 122, 232, 0.5);
          will-change: clip-path, transform;
        }

        .games-lede {
          font-size: 17px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.62);
          text-transform: none;
          max-width: 44ch;
          margin: 0 0 8px auto;
          text-align: right;
        }

        .games-strip {
          display: flex;
          gap: 12px;
          height: min(62vh, 600px);
          min-height: 460px;
        }

        .game-panel {
          position: relative;
          flex: 1;
          overflow: hidden;
          border-radius: 14px;
          cursor: pointer;
          outline: none;
          transition: flex 0.65s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: flex, clip-path;
        }

        .game-panel:hover,
        .game-panel:focus-visible {
          flex: 3;
        }

        .game-panel-art {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: saturate(0.8) brightness(0.58) contrast(1.05);
          transform: scale(1.06);
          transition: filter 0.6s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .game-panel:hover .game-panel-art,
        .game-panel:focus-visible .game-panel-art {
          filter: saturate(1.05) brightness(0.82) contrast(1.05);
          transform: scale(1);
        }

        .game-panel-tint {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(13, 8, 34, 0.25) 0%, rgba(8, 5, 20, 0.05) 45%, rgba(8, 5, 20, 0.85) 100%),
            linear-gradient(160deg, rgba(108, 92, 231, 0.22), transparent 55%);
          transition: opacity 0.5s ease;
        }

        .game-panel-num {
          position: absolute;
          top: 22px;
          right: 24px;
          font-size: 44px;
          font-weight: 900;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
          user-select: none;
          transition: -webkit-text-stroke-color 0.4s ease;
        }

        .game-panel:hover .game-panel-num {
          -webkit-text-stroke-color: rgba(176, 156, 255, 0.95);
        }

        .game-panel-info {
          position: absolute;
          left: 26px;
          right: 26px;
          bottom: 24px;
        }

        .game-panel-title {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.25;
          color: #fff;
          margin: 0 0 8px;
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.8);
        }

        .game-panel-meta {
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(196, 184, 255, 0.85);
          margin: 0;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.45s ease 0.1s, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;
        }

        .game-panel:hover .game-panel-meta,
        .game-panel:focus-visible .game-panel-meta {
          opacity: 1;
          transform: translateY(0);
        }

        .game-panel-edge {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: linear-gradient(90deg, #8b7ae8, rgba(108, 92, 231, 0.1));
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .game-panel:hover .game-panel-edge,
        .game-panel:focus-visible .game-panel-edge {
          transform: scaleX(1);
        }

        @media (max-width: 1199px) {
          .games-head-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .games-lede {
            text-align: left;
            margin-left: 0;
          }
        }

        @media (max-width: 991px) {
          .games-strip {
            flex-direction: column;
            height: auto;
            min-height: 0;
          }

          .game-panel {
            height: 150px;
            flex: none;
            transition: height 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .game-panel:hover,
          .game-panel:focus-visible {
            flex: none;
            height: 230px;
          }

          .game-panel-meta {
            opacity: 1;
            transform: none;
          }
        }

        @media (max-width: 600px) {
          .games-section {
            padding: 90px 0 100px;
          }

          .games-container {
            padding: 0 24px;
          }

          .games-head {
            margin-bottom: 44px;
          }
        }
      `}</style>
    </section>
  );
}
