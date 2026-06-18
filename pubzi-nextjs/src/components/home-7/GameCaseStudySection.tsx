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
  code: string;
  accent: string;
}

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

const GAMES: GameItem[] = [
  {
    num: '01',
    code: 'VLTK',
    accent: '#8b7ae8',
    title: 'Võ Lâm Truyền Kỳ',
    genre: 'MMORPG Kiếm Hiệp',
    platform: 'PC',
    image: '/assets/img/landing-page/game/VLTK.png',
  },
  {
    num: '02',
    code: 'TNGH',
    accent: '#6fa8ff',
    title: 'Tiếu Ngạo Giang Hồ',
    genre: 'MMORPG Kiếm Hiệp',
    platform: 'PC & Mobile',
    image: '/assets/img/landing-page/game/tieu-ngao-giang-ho.png',
  },
  {
    num: '03',
    code: 'KT',
    accent: '#b07ae8',
    title: 'Kiếm Thế',
    genre: 'MMORPG',
    platform: 'Mobile',
    image: '/assets/img/landing-page/game/kiem-the.png',
  },
  {
    num: '04',
    code: 'CDTL',
    accent: '#7adcff',
    title: 'Con Đường Tơ Lụa',
    genre: 'MMORPG',
    platform: 'PC',
    image: '/assets/img/landing-page/game/con-duong-to-lua.png',
  },
  {
    num: '05',
    code: 'TLBB',
    accent: '#9d7aff',
    title: 'Thiên Long Bát Bộ',
    genre: 'MMORPG',
    platform: 'PC & Mobile',
    image: '/assets/img/landing-page/game/thien-long-bat-bo.png',
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

      // Title lights up word by word with the scroll.
      const titleWords = document.querySelectorAll('.games-title .sw');
      if (titleWords.length) {
        gsap.fromTo(
          titleWords,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: 'none',
            scrollTrigger: { trigger: '.games-head', start: 'top 88%', end: 'top 40%', scrub: 0.6 },
          }
        );
      }

      // Kinetic marquee band — one seamless loop, transform-only.
      gsap.to('.games-marquee-track', {
        xPercent: -50,
        duration: 30,
        ease: 'none',
        repeat: -1,
      });

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
              <Words text="Danh sách game" />
              <br />
              <Words text="BLACKHOLE" />
            </h2>
            <p className="games-lede">
              Danh sách những tựa game phát hành và đồng phát hành cùng đối tác trong năm 2024 -&gt; 2025.
            </p>
          </div>
        </div>

        <div className="games-marquee" aria-hidden="true">
          <div className="games-marquee-track">
            {[0, 1].map((dup) => (
              <span key={dup} className="games-marquee-seg">
                {GAMES.map((g) => (
                  <span key={g.num} className="games-marquee-item">
                    {g.title}
                    <i />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div className="games-strip">
          {GAMES.map((g) => (
            <article
              key={g.num}
              className="game-panel"
              tabIndex={0}
              style={{ ['--gp-accent' as string]: g.accent }}
            >
              <div
                className="game-panel-art"
                style={{ backgroundImage: `url('${g.image}')` }}
              />
              <div className="game-panel-tint" />
              <span className="game-panel-sheen" aria-hidden="true" />
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
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(139, 122, 232, 0.1), rgba(8, 6, 20, 0) 34%),
            radial-gradient(ellipse at 88% 20%, rgba(82, 74, 160, 0.1), rgba(8, 6, 20, 0) 34%),
            linear-gradient(180deg, #070512 0%, #06050d 48%, #080614 100%);
          padding: 118px 0 150px;
        }

        .games-section::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.018), rgba(255, 255, 255, 0) 22%),
            linear-gradient(90deg, rgba(139, 122, 232, 0.035), transparent 36%, rgba(139, 122, 232, 0.025));
          opacity: 0.8;
          pointer-events: none;
        }

        .games-section::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          z-index: 0;
          height: 120px;
          background: linear-gradient(180deg, #070512 0%, rgba(7, 5, 18, 0) 100%);
          pointer-events: none;
        }

        .games-container {
          position: relative;
          z-index: 1;
          max-width: 1700px;
          margin: 0 auto;
          padding: 0 48px;
        }

        .games-head {
          margin-bottom: 54px;
        }

        .games-kicker {
          font-family: var(--font-subtitle-krafting);
          font-size: 13px;
          font-weight: 700;
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
          font-family: var(--font-title-extra);
          font-size: clamp(42px, 4.55vw, 72px);
          font-weight: 900 !important;
          line-height: 0.98;
          color: #fff !important;
          margin: 0;
          letter-spacing: 0;
          text-transform: none;
          text-shadow:
            0 0 16px rgba(255, 255, 255, 0.2),
            0 0 38px rgba(139, 122, 232, 0.32);
          will-change: clip-path, transform;
        }

        .games-title .sw {
          color: #fff !important;
          font-family: inherit;
          font-weight: inherit;
        }

        .games-lede {
          font-family: var(--font-body-regular);
          font-size: clamp(14px, 0.95vw, 17px);
          font-weight: 400 !important;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.72) !important;
          text-transform: none;
          max-width: 58ch;
          margin: 0 0 8px auto;
          text-align: right;
        }

        .games-marquee {
          overflow: hidden;
          margin-bottom: 26px;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }

        .games-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }

        .games-marquee-seg {
          display: flex;
          flex: 0 0 auto;
        }

        .games-marquee-item {
          font-family: var(--font-subtitle-krafting);
          display: inline-flex;
          align-items: center;
          gap: 26px;
          padding-right: 26px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          white-space: nowrap;
          color: rgba(196, 184, 255, 0.34);
        }

        .games-marquee-item i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(139, 122, 232, 0.55);
        }

        .games-strip {
          display: flex;
          gap: 12px;
          /* Height tuned so the active panel (flex 4.5 of 8.5 ≈ 850px wide) lands
             near the source art's 16:9 ratio — minimal cropping when expanded. */
          height: min(52vh, 500px);
          min-height: 420px;
          padding: 1px;
          border-top: 1px solid rgba(139, 122, 232, 0.12);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 1.5%, #000 98.5%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 1.5%, #000 98.5%, transparent 100%);
        }

        /* Panel #1 is featured by default so the list starts from 01 visibly. */
        @media (min-width: 992px) {
          .games-strip:not(:hover):not(:focus-within) .game-panel:first-child {
            flex: 4.5;
          }

          .games-strip:not(:hover):not(:focus-within) .game-panel:first-child .game-panel-art {
            background-position: center;
            filter: brightness(1);
            transform: scale(1);
          }

          .games-strip:not(:hover):not(:focus-within) .game-panel:first-child .game-panel-meta {
            opacity: 1;
            transform: translateY(0);
          }

          .games-strip:not(:hover):not(:focus-within) .game-panel:first-child .game-panel-edge {
            transform: scaleX(1);
          }
        }

        .game-panel-sheen {
          position: absolute;
          inset: -40% -60%;
          background: linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.09) 48%, color-mix(in srgb, var(--gp-accent, #8b7ae8) 16%, transparent) 54%, transparent 70%);
          transform: translateX(-70%) rotate(6deg);
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .game-panel:hover .game-panel-sheen,
        .game-panel:focus-visible .game-panel-sheen {
          transform: translateX(70%) rotate(6deg);
        }

        .game-panel {
          position: relative;
          flex: 0.7;
          min-width: 116px;
          overflow: hidden;
          border-radius: 14px;
          cursor: pointer;
          outline: none;
          transition: flex 0.65s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: flex, clip-path;
        }

        .game-panel:hover,
        .game-panel:focus-visible {
          flex: 4.6;
        }

        .game-panel-art {
          position: absolute;
          inset: 0;
          background-size: cover;
          /* Collapsed panels are tall+narrow: anchor the art to the LEFT so the
             subject (always on the left of the key-art) stays visible. */
          background-position: left center;
          /* Near-neutral — let the original key-art colors carry. Only a whisper
             of dim on collapsed panels so the title text stays legible. */
          filter: brightness(0.97);
          transform: scale(1.04);
          transition: filter 0.6s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            background-position 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .game-panel:hover .game-panel-art,
        .game-panel:focus-visible .game-panel-art {
          /* Active panel is wide (~16:9, matching the source) — recenter and show
             the art at full, untouched color. */
          background-position: center;
          filter: brightness(1);
          transform: scale(1);
        }

        .game-panel-tint {
          position: absolute;
          inset: 0;
          /* Only a bottom scrim for title legibility — no color tint over the art,
             so the original key-art palette stays intact. */
          background: linear-gradient(180deg, rgba(8, 5, 20, 0) 62%, rgba(8, 5, 20, 0.42) 82%, rgba(8, 5, 20, 0.82) 100%);
          transition: opacity 0.5s ease;
        }

        .game-panel-num {
          font-family: var(--font-title-extra);
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
          font-family: var(--font-title-extra);
          font-size: 22px;
          font-weight: 900;
          line-height: 1.25;
          color: #fff;
          margin: 0 0 8px;
          text-shadow: 0 2px 18px rgba(0, 0, 0, 0.8);
        }

        .game-panel-meta {
          font-family: var(--font-body-regular);
          font-size: 13px;
          font-weight: 400;
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
          background: linear-gradient(90deg, var(--gp-accent, #8b7ae8), rgba(108, 92, 231, 0.1));
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
            aspect-ratio: 1672 / 941;
            height: auto;
            flex: none;
            background: #090611;
            transition: box-shadow 0.35s ease, border-color 0.35s ease;
          }

          .game-panel:hover,
          .game-panel:focus-visible {
            flex: none;
            height: auto;
          }

          /* The key-art already has the game title baked in, so the overlay
             title + meta read as duplicate text on small panels — hide them
             and let the art (plus the index number) carry the panel. */
          .game-panel-info,
          .game-panel-tint {
            display: none;
          }

          .game-panel-art {
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            filter: brightness(1);
            transform: none;
          }

          .game-panel:hover .game-panel-art,
          .game-panel:focus-visible .game-panel-art {
            filter: brightness(1);
            transform: none;
          }
        }

        @media (max-width: 600px) {
          .games-section {
            padding: 88px 0 100px;
          }

          .games-container {
            padding: 0 24px;
          }

          .games-head {
            margin-bottom: 44px;
          }

          /* Tone down the all-caps marquee on mobile so it doesn't shout. */
          .games-marquee-item {
            text-transform: none;
            letter-spacing: 1px;
            font-size: 13px;
            gap: 18px;
            padding-right: 18px;
          }
        }
      `}</style>
    </section>
  );
}
