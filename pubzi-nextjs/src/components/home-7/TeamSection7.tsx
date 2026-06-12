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

// NOTE: placeholder names + template images — swap with the real
// streamer/creator roster (images in public/assets/img/home-4/team/).
const PARTNERS = [
  {
    name: 'Linh Katy',
    role: 'Creator · Võ Lâm Truyền Kỳ',
    tag: '1.2M followers',
    image: '/assets/img/home-4/team/team-01.png',
  },
  {
    name: 'Phong JX',
    role: 'Caster · Giải đấu JX2',
    tag: '860K followers',
    image: '/assets/img/home-4/team/team-02.png',
  },
  {
    name: 'Đại Ca Mobile',
    role: 'Streamer · Kiếm Thế Mobile',
    tag: '640K followers',
    image: '/assets/img/home-4/team/team-03.png',
  },
  {
    name: 'Tơ Lụa TV',
    role: 'Cộng đồng · Con Đường Tơ Lụa',
    tag: '420K followers',
    image: '/assets/img/home-4/team/team-04.png',
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
                <img src={p.image} alt={p.name} loading="lazy" />
              </div>
              <span className="ptn-tag">{p.tag}</span>
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
          z-index: 9;
          background: #080614;
          padding: 140px 0 150px;
        }

        .ptn-container {
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
        }

        .ptn-head {
          margin-bottom: 64px;
        }

        .ptn-kicker {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #8b7ae8;
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
          font-size: clamp(40px, 3.8vw, 58px);
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin: 0;
          text-shadow:
            0 0 22px rgba(255, 255, 255, 0.28),
            0 0 56px rgba(139, 122, 232, 0.5);
        }

        .ptn-lede {
          font-size: clamp(15px, 1vw, 17px);
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.62);
          text-transform: none;
          max-width: 46ch;
          margin: 0 0 8px auto;
          text-align: right;
        }

        .ptn-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .ptn-card {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid rgba(139, 122, 232, 0.18);
          background: rgba(13, 9, 32, 0.55);
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
          filter: saturate(0.55) brightness(0.82);
          transform: scale(1.04);
          transition: filter 0.5s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ptn-card:hover .ptn-photo img,
        .ptn-card:focus-visible .ptn-photo img {
          filter: saturate(1) brightness(1);
          transform: scale(1);
        }

        .ptn-tag {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #d9d0ff;
          background: rgba(10, 6, 28, 0.72);
          border: 1px solid rgba(139, 122, 232, 0.35);
          backdrop-filter: blur(4px);
        }

        .ptn-info {
          padding: 20px 22px 22px;
        }

        .ptn-info h3 {
          font-size: 19px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 6px;
        }

        .ptn-info p {
          font-size: 13px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(196, 184, 255, 0.7);
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
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .ptn-section {
            padding: 90px 0 100px;
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
