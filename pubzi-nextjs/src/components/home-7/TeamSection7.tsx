'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

const PARTNERS = [
  {
    name: 'Gray',
    role: 'FPT Esports',
    image: '/assets/img/landing-page/kol/gray_FPT.jpg',
  },
  {
    name: 'Bé Trọc',
    role: 'FPT Esports',
    image: '/assets/img/landing-page/kol/betroc_FPT.jpg',
  },
  {
    name: 'Quang Hải',
    role: 'Đội trưởng · FPT Esports',
    image: '/assets/img/landing-page/kol/quanghai_FPT.jpg',
  },
  {
    name: 'Huy Hoàng',
    role: 'FPT Esports',
    image: '/assets/img/landing-page/kol/huyhoang_FPT.jpg',
  },
  {
    name: 'Yutan',
    role: 'FPT Esports',
    image: '/assets/img/landing-page/kol/yutan_FPT.jpg',
  },
];

export default function TeamSection7() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ptn-kicker',
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.ptn-head', start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      // Title + lede light up word by word with scroll, matching the other home-7 text sections.
      gsap.utils.toArray<HTMLElement>('.ptn-title, .ptn-lede').forEach((el) => {
        const words = el.querySelectorAll('.sw');
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.055,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 42%', scrub: 0.6 },
          }
        );
      });

      gsap.fromTo(
        '.ptn-card',
        { clipPath: 'inset(100% 0 0 0)', y: 26 },
        {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ptn-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ptn-section">
      <div className="ptn-container">
        <div className="ptn-head">
          <h6 className="ptn-kicker">MẠNG LƯỚI SÁNG TẠO</h6>
          <div className="ptn-head-row">
            <h2 className="ptn-title">
              <Words text="Đối tác đồng hành" />
              <br />
              <Words text="cùng Blackhole Game" />
            </h2>
            <p className="ptn-lede">
              <Words text="Streamer, caster và cộng đồng sáng tạo nội dung đưa từng tựa game đến gần hơn với người chơi Việt." />
            </p>
          </div>
        </div>

        <div className="ptn-grid">
          {PARTNERS.map((p) => (
            <article key={p.name} className="ptn-card" tabIndex={0}>
              <div className="ptn-photo">
                <img src={p.image} alt={p.name} loading="eager" decoding="async" />
              </div>
              <div className="ptn-info">
                <h3>{p.name}</h3>
                <p>{p.role}</p>
              </div>
              <span className="ptn-edge" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .ptn-section {
          position: relative;
          z-index: 8;
          overflow: hidden;
          margin-top: clamp(-84px, -5vw, -48px);
          background:
            radial-gradient(ellipse at 82% -10%, rgba(0, 206, 201, 0.046), transparent 34%),
            radial-gradient(ellipse at 18% 44%, rgba(139, 122, 232, 0.085), transparent 34%),
            linear-gradient(180deg, #080614 0%, #080614 26%, #090716 58%, #080614 100%),
            #080614 !important;
          padding: clamp(136px, 11vw, 184px) 0 150px;
        }

        .ptn-section::before {
          content: '';
          position: absolute;
          inset: 14% -8% -18%;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 18% 24%, rgba(139, 122, 232, 0.075), transparent 34%),
            radial-gradient(ellipse at 84% 46%, rgba(0, 206, 201, 0.045), transparent 30%),
            linear-gradient(90deg, rgba(216, 216, 224, 0.028) 1px, transparent 1px);
          background-size: auto, auto, 132px 100%;
          mask-image: linear-gradient(180deg, transparent, #000 24%, #000 84%, transparent);
        }

        .ptn-section::after {
          content: '';
          position: absolute;
          left: clamp(20px, 4vw, 68px);
          right: clamp(20px, 4vw, 68px);
          top: clamp(58px, 5vw, 86px);
          height: 1px;
          pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(139, 122, 232, 0.5), rgba(216, 216, 224, 0.18), rgba(0, 206, 201, 0.22), transparent);
        }

        .ptn-container {
          position: relative;
          z-index: 1;
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
        }

        .ptn-head {
          margin-bottom: 64px;
        }

        .ptn-kicker {
          font-family: var(--font-subtitle-krafting);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(139, 122, 232, 0.9) !important;
          margin-bottom: 24px;
        }

        .ptn-head-row {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(360px, 520px);
          gap: clamp(32px, 5vw, 84px);
          align-items: end;
        }

        .ptn-title {
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
          text-shadow:
            0 0 24px rgba(255, 255, 255, 0.16),
            0 0 46px rgba(139, 122, 232, 0.24);
        }

        .ptn-lede {
          font-family: var(--font-body-regular);
          font-size: clamp(15px, 1vw, 17px);
          line-height: 1.65;
          color: rgba(216, 216, 224, 0.68) !important;
          text-transform: none;
          max-width: 46ch;
          margin: 0 0 8px auto;
          text-align: right;
        }

        .ptn-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 18px;
        }

        .ptn-card {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid rgba(139, 122, 232, 0.18);
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018)),
            rgba(13, 9, 32, 0.55);
          cursor: pointer;
          outline: none;
          transition: border-color 0.4s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: clip-path, transform;
        }

        .ptn-card:hover,
        .ptn-card:focus-visible {
          border-color: rgba(176, 156, 255, 0.55);
          transform: translateY(-6px);
        }

        .ptn-photo {
          aspect-ratio: 4 / 4.6;
          overflow: hidden;
        }

        .ptn-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* Keep the original key-art punchy, full color, a touch more contrast. */
          filter: contrast(1.12) saturate(1.05);
          transform: scale(1.04);
          transition: filter 0.5s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ptn-card:hover .ptn-photo img,
        .ptn-card:focus-visible .ptn-photo img {
          filter: contrast(1.16) saturate(1.12);
          transform: scale(1);
        }

        .ptn-info {
          padding: 20px 22px 22px;
        }

        .ptn-info h3 {
          font-family: var(--font-title-extra);
          font-size: 19px;
          font-weight: 900;
          color: #fff !important;
          line-height: 1.12;
          letter-spacing: 0;
          text-transform: none;
          margin: 0 0 6px;
        }

        .ptn-info p {
          font-family: var(--font-body-regular);
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(196, 184, 255, 0.7) !important;
          margin: 0;
        }

        .ptn-edge {
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

        .ptn-card:hover .ptn-edge,
        .ptn-card:focus-visible .ptn-edge {
          transform: scaleX(1);
        }

        @media (max-width: 1399px) {
          .ptn-head-row {
            grid-template-columns: 1fr;
            gap: 22px;
            align-items: start;
          }

          .ptn-title {
            max-width: 860px;
          }

          .ptn-lede {
            max-width: 64ch;
            text-align: left;
            margin: 0;
          }
        }

        @media (max-width: 1199px) {
          .ptn-head-row {
            grid-template-columns: 1fr;
          }

          .ptn-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 760px) {
          .ptn-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .ptn-section {
            margin-top: -58px;
            padding: 116px 0 100px;
            background:
              radial-gradient(ellipse 75% 35% at 15% 20%, rgba(139, 122, 232, 0.11), transparent 55%),
              radial-gradient(ellipse 50% 28% at 88% 70%, rgba(0, 206, 201, 0.07), transparent 50%),
              linear-gradient(180deg, #080614 0%, #080614 26%, #090716 58%, #080614 100%);
          }

          .ptn-container {
            padding: 0 24px;
          }

          .ptn-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .ptn-head {
            margin-bottom: 44px;
          }

          .ptn-title {
            font-size: clamp(34px, 10vw, 48px);
          }

          .ptn-kicker {
            font-size: 11px;
            letter-spacing: 2.4px;
          }

          .ptn-lede {
            font-size: 14px;
            line-height: 1.65;
          }
        }
      `}</style>
    </section>
  );
}
