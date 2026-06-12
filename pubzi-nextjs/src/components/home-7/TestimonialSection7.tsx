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

// NOTE: placeholder quotes — replace with real partner feedback when available.
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

      // Title + featured quote light up word by word with the scroll.
      gsap.utils.toArray<HTMLElement>('.tsm-title, .tsm-featured-quote').forEach((el) => {
        const words = el.querySelectorAll('.sw');
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 40%', scrub: 0.6 },
          }
        );
      });

      gsap.fromTo(
        '.tsm-side-card',
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.tsm-side', start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(
        '.tsm-featured-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.tsm-featured', start: 'top 78%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="tsm-section">
      <div className="tsm-container">
        <div className="tsm-head">
          <h6 className="tsm-kicker">TIẾNG NÓI ĐỐI TÁC</h6>
          <h2 className="tsm-title">
            <Words text="Khách hàng nói về chúng tôi" />
          </h2>
        </div>

        <div className="tsm-grid">
          <figure className="tsm-featured">
            <span className="tsm-featured-mark" aria-hidden="true">“</span>
            <blockquote className="tsm-featured-quote">
              <Words text={FEATURED.quote} />
            </blockquote>
            <span className="tsm-featured-line" aria-hidden="true" />
            <figcaption className="tsm-author">
              <span className="tsm-avatar">{FEATURED.initials}</span>
              <span>
                <strong>{FEATURED.name}</strong>
                <em>{FEATURED.org}</em>
              </span>
            </figcaption>
          </figure>

          <div className="tsm-side">
            {QUOTES.map((q) => (
              <figure key={q.initials} className="tsm-side-card">
                <blockquote>{q.quote}</blockquote>
                <figcaption className="tsm-author">
                  <span className="tsm-avatar">{q.initials}</span>
                  <span>
                    <strong>{q.name}</strong>
                    <em>{q.org}</em>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .tsm-section {
          position: relative;
          z-index: 9;
          background: #080614;
          padding: 140px 0 150px;
        }

        .tsm-container {
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 48px;
        }

        .tsm-head {
          margin-bottom: 64px;
        }

        .tsm-kicker {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #8b7ae8;
          margin-bottom: 24px;
        }

        .tsm-title {
          font-size: clamp(36px, 3.8vw, 56px);
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin: 0;
          max-width: 18ch;
          text-shadow:
            0 0 22px rgba(255, 255, 255, 0.28),
            0 0 56px rgba(139, 122, 232, 0.5);
        }

        .tsm-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 64px;
          align-items: start;
        }

        .tsm-featured {
          position: relative;
          margin: 0;
          padding-top: 18px;
        }

        .tsm-featured-mark {
          position: absolute;
          top: -34px;
          left: -14px;
          font-size: 150px;
          line-height: 1;
          font-weight: 900;
          color: rgba(139, 122, 232, 0.18);
          user-select: none;
          pointer-events: none;
        }

        .tsm-featured-quote {
          font-size: clamp(22px, 1.9vw, 30px);
          font-weight: 600;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.92);
          text-transform: none;
          margin: 0 0 34px;
        }

        .tsm-featured-line {
          display: block;
          height: 1px;
          margin-bottom: 30px;
          background: linear-gradient(90deg, rgba(139, 122, 232, 0.5), transparent 80%);
          transform-origin: left center;
        }

        .tsm-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .tsm-avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          flex: 0 0 auto;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #d9d0ff;
          background: linear-gradient(160deg, rgba(139, 122, 232, 0.32), rgba(50, 30, 120, 0.4));
          border: 1px solid rgba(139, 122, 232, 0.4);
        }

        .tsm-author strong {
          display: block;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
        }

        .tsm-author em {
          display: block;
          font-style: normal;
          font-size: 13px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(196, 184, 255, 0.66);
          margin-top: 3px;
        }

        .tsm-side {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        /* second card offset — staggered stack, not equal boxes */
        .tsm-side-card:nth-child(2) {
          margin-left: 42px;
        }

        .tsm-side-card {
          margin: 0;
          padding: 30px 30px 26px;
          border: 1px solid rgba(139, 122, 232, 0.2);
          border-radius: 14px;
          background:
            radial-gradient(circle at 85% 0%, rgba(139, 122, 232, 0.1), transparent 55%),
            rgba(13, 9, 32, 0.55);
          transition: border-color 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .tsm-side-card:hover {
          border-color: rgba(176, 156, 255, 0.5);
          transform: translateY(-5px);
        }

        .tsm-side-card blockquote {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.78);
          text-transform: none;
          margin: 0 0 22px;
        }

        @media (max-width: 1199px) {
          .tsm-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .tsm-side-card:nth-child(2) {
            margin-left: 0;
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
            margin-bottom: 44px;
          }

          .tsm-featured-mark {
            font-size: 100px;
            top: -22px;
          }
        }
      `}</style>
    </section>
  );
}
