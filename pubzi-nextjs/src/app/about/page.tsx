'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  {
    title: 'Bản địa hóa sản phẩm',
    desc: 'Điều chỉnh ngôn ngữ, nhịp sự kiện, thanh toán và vận hành theo hành vi người chơi Việt Nam.',
    media: 'https://picsum.photos/seed/bh-localize/800/1000',
  },
  {
    title: 'Tăng trưởng cộng đồng',
    desc: 'Xây dựng cộng đồng thật qua creator, giải đấu, social content và chăm sóc người chơi sau ra mắt.',
    media: 'https://picsum.photos/seed/bh-community/800/1000',
  },
  {
    title: 'Đồng phát hành',
    desc: 'Đi cùng studio từ giai đoạn chuẩn bị thị trường đến live operations, báo cáo và mở rộng doanh thu.',
    media: 'https://picsum.photos/seed/bh-copublish/800/1000',
  },
  {
    title: 'Hiểu thị trường Đông Nam Á',
    desc: 'Dùng dữ liệu vận hành tại Việt Nam làm nền để mở rộng sang các cộng đồng có hành vi tương đồng.',
    media: 'https://picsum.photos/seed/bh-sea/800/1000',
  },
];

const OPERATING_POINTS = [
  'Đọc sản phẩm và cộng đồng mục tiêu trước khi chốt chiến lược phát hành.',
  'Thiết kế soft launch, nội dung, creator plan và kênh hỗ trợ người chơi.',
  'Theo dõi dữ liệu vận hành hằng tuần để tối ưu giữ chân, doanh thu và niềm tin.',
];

function PortalVideoSources() {
  return (
    <>
      <source src="/assets/video/background_1_pingpong.webm" type="video/webm" />
      <source src="/assets/video/background_1_pingpong.mp4" type="video/mp4" />
    </>
  );
}

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <span className="ab2-word" key={`${word}-${index}`}>
          {word}{' '}
        </span>
      ))}
    </>
  );
}

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('.ab2-motion-video'));
    if (!videos.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      videos.forEach((video) => video.pause());
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            videos.forEach((video) => {
              video.style.visibility = 'visible';
              video.play().catch(() => undefined);
            });
          } else {
            videos.forEach((video) => video.pause());
          }
        },
        { rootMargin: '20% 0px' }
      );
      io.observe(root);
      return () => io.disconnect();
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const portalTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.ab2-hero',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });

      portalTl
        .to('.ab2-portal-frame', { scale: 6.4, filter: 'brightness(1.08)', ease: 'none', duration: 1, force3D: false }, 0);

      gsap.fromTo(
        '.ab2-word',
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.035,
          ease: 'none',
          scrollTrigger: {
            trigger: '.ab2-manifesto',
            start: 'top 72%',
            end: 'top 20%',
            scrub: 0.6,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>('.ab2-reveal').forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 82%', once: true },
          }
        );
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="ab2-root" ref={rootRef}>
      <video
        className="ab2-fixed-video ab2-motion-video"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
      >
        <PortalVideoSources />
      </video>

      <section className="ab2-hero">
        <div className="ab2-hero-sticky">
          <div className="ab2-portal" aria-hidden="true">
            <div className="ab2-portal-frame-shell">
              <img className="ab2-portal-frame" src="/assets/img/landing-page/trasparent_bg.png" alt="" />
            </div>
          </div>
          <div className="ab2-hero-shade" aria-hidden="true" />

        </div>
      </section>

      <main className="ab2-content">
        <section className="ab2-proof ab2-reveal" aria-label="BlackHole focus areas">
          <span>Publishing</span>
          <span>Live Ops</span>
          <span>Community</span>
          <span>Growth</span>
        </section>

        <section className="ab2-manifesto">
          <p>
            <Words text="BlackHole Game kết nối studio quốc tế với thị trường Việt Nam bằng năng lực bản địa hóa, vận hành cộng đồng và đồng phát hành có trách nhiệm." />
          </p>
        </section>

        <section className="ab2-capabilities">
          <div className="ab2-section-head ab2-reveal">
            <h2>Chúng tôi xử lý phần khó của thị trường địa phương</h2>
            <p>
              Mỗi game cần một cách vào thị trường khác nhau. BlackHole biến hiểu biết bản địa thành kế hoạch vận hành cụ thể.
            </p>
          </div>

          <div className="ab2-cap-grid">
            {CAPABILITIES.map((item, index) => (
              <article className={`ab2-cap-card ab2-card-${index + 1} ab2-reveal`} key={item.title}>
                <div className="ab2-card-media">
                  <img src={item.media} alt="" />
                </div>
                <div className="ab2-card-copy">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ab2-field ab2-reveal">
          <div className="ab2-field-media">
            <img src="https://picsum.photos/seed/bh-field/1200/750" alt="Không gian gaming của BlackHole" />
          </div>
          <div className="ab2-field-copy">
            <h2>Từ ra mắt đến vận hành dài hạn</h2>
            <p>
              Vai trò của BlackHole không dừng ở chiến dịch launch. Chúng tôi theo dõi phản hồi người chơi, điều chỉnh lịch sự kiện và giữ nhịp cộng đồng sau từng bản cập nhật.
            </p>
          </div>
        </section>

        <section className="ab2-operating">
          <p className="ab2-kicker ab2-reveal">Cách làm việc</p>
          <div className="ab2-operating-grid">
            <h2 className="ab2-reveal">Một hệ vận hành rõ vai trò, rõ nhịp, rõ dữ liệu.</h2>
            <div className="ab2-operating-list">
              {OPERATING_POINTS.map((point) => (
                <div className="ab2-operating-item ab2-reveal" key={point}>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ab2-cta ab2-reveal">
          <h2>Cùng đưa game của bạn vào thị trường Việt Nam.</h2>
          <p>BlackHole sẵn sàng trao đổi về phát hành, cộng đồng và live operations.</p>
          <div className="ab2-actions">
            <Link className="ab2-btn ab2-btn-primary" href="/contact">Liên hệ</Link>
            <Link className="ab2-btn ab2-btn-secondary" href="/game">Danh sách game</Link>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .ab2-root {
          --ab2-bg: #08060f;
          --ab2-panel: #0f0b1e;
          --ab2-panel-2: #17112e;
          --ab2-text: rgba(255, 255, 255, 0.96);
          --ab2-soft: rgba(255, 255, 255, 0.68);
          --ab2-muted: rgba(255, 255, 255, 0.45);
          --ab2-line: rgba(176, 156, 255, 0.18);
          --ab2-accent: #8b7ae8;
          --ab2-accent-strong: #b09cff;
          --ab2-radius: 14px;
          --ab2-ring-x: 50%;
          --ab2-ring-y: 39.5%;
          --ab2-frame-y-offset: -26px;
          position: relative;
          color: var(--ab2-text);
          background: var(--ab2-bg);
          overflow: clip;
          font-family: var(--font-body-regular, Arial, sans-serif);
        }

        .ab2-root::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: #08060f;
        }

        .ab2-fixed-video {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          z-index: 1;
          pointer-events: none;
          transform: none;
          transform-origin: 50% 50%;
          filter: contrast(1.32) brightness(1.12) saturate(1.32);
          visibility: visible;
          will-change: transform, filter;
        }

        .ab2-hero {
          position: relative;
          height: 240dvh;
          min-height: 1600px;
          z-index: 3;
          background-color: transparent !important;
        }

        .ab2-hero-sticky {
          position: sticky;
          top: 0;
          min-height: max(760px, 100dvh);
          height: 100dvh;
          display: flex;
          overflow: hidden;
          isolation: isolate;
          padding: clamp(96px, 10vh, 128px) clamp(20px, 5vw, 80px) clamp(42px, 6vh, 74px);
          background: transparent !important;
          background-color: transparent !important;
        }

        .ab2-portal {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .ab2-portal-frame-shell {
          position: absolute;
          left: 50%;
          top: calc(50% + var(--ab2-frame-y-offset));
          z-index: 2;
          width: max(100vw, 133.333dvh);
          max-width: none;
          transform: translate(calc(var(--ab2-ring-x) * -1), calc(var(--ab2-ring-y) * -1));
          transform-origin: var(--ab2-ring-x) var(--ab2-ring-y);
          will-change: transform;
        }

        .ab2-portal-frame {
          display: block;
          width: 100%;
          height: auto;
          max-width: none;
          opacity: 1;
          filter: brightness(0.9) saturate(1.04);
          transform-origin: var(--ab2-ring-x) var(--ab2-ring-y);
          user-select: none;
          will-change: transform, opacity, filter;
        }

        .ab2-hero-shade {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 50%, transparent 0%, transparent 30%, rgba(8, 6, 15, 0.02) 50%, rgba(8, 6, 15, 0.34) 88%),
            linear-gradient(180deg, rgba(8, 6, 15, 0) 0%, rgba(8, 6, 15, 0.28) 100%);
        }

        .ab2-hero-caption {
          position: absolute;
          left: clamp(20px, 5vw, 80px);
          bottom: clamp(28px, 5vh, 58px);
          z-index: 3;
          max-width: 360px;
          pointer-events: auto;
        }

        .ab2-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.55);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 12px;
          font-weight: 700;
        }

        .ab2-breadcrumb a {
          color: #08d8dc;
          text-decoration: none;
        }

        .ab2-breadcrumb span:last-child {
          color: var(--ab2-accent-strong);
        }

        .ab2-hero-caption p {
          margin: 0;
          color: rgba(255, 255, 255, 0.74);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: clamp(14px, 1.2vw, 17px);
          font-weight: 700;
          line-height: 1.55;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-shadow: 0 8px 26px rgba(0, 0, 0, 0.72);
        }

        .ab2-kicker {
          margin: 0 0 18px;
          color: var(--ab2-accent-strong);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .ab2-hero h1,
        .ab2-section-head h2,
        .ab2-field-copy h2,
        .ab2-operating h2,
        .ab2-cta h2 {
          font-family: var(--font-title-extra, Arial, sans-serif);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #f7f4ff;
        }

        .ab2-hero h1 {
          max-width: 10.8ch;
          margin: 0 0 26px;
          font-size: clamp(46px, 7.4vw, 96px);
          line-height: 0.98;
          text-shadow: 0 10px 40px rgba(0, 0, 0, 0.52);
        }

        .ab2-hero-sub {
          max-width: 46ch;
          margin: 0 0 34px;
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(16px, 1.3vw, 19px);
          line-height: 1.72;
        }

        .ab2-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .ab2-btn {
          display: inline-flex;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          border-radius: 8px;
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }

        .ab2-btn:active {
          transform: translateY(1px) scale(0.99);
        }

        .ab2-btn-primary {
          background: linear-gradient(135deg, #8b7ae8, #5a33d6);
          color: #fff;
          box-shadow: 0 18px 46px rgba(67, 34, 175, 0.34);
        }

        .ab2-btn-primary:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #a18fff, #6841e7);
        }

        .ab2-btn-secondary {
          border: 1px solid rgba(176, 156, 255, 0.34);
          color: #e4ddff;
          background: rgba(14, 10, 30, 0.58);
        }

        .ab2-btn-secondary:hover {
          transform: translateY(-2px);
          border-color: rgba(176, 156, 255, 0.72);
          background: rgba(139, 122, 232, 0.14);
        }

        .ab2-content {
          position: relative;
          z-index: 4;
          background:
            linear-gradient(180deg, rgba(8, 6, 15, 0.18) 0%, rgba(8, 6, 15, 0.9) 220px, #08060f 430px),
            #08060f;
        }

        .ab2-proof {
          width: min(100%, 1280px);
          margin: 0 auto;
          padding: 28px clamp(20px, 5vw, 80px);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--ab2-line);
          border-bottom: 1px solid var(--ab2-line);
          color: rgba(255, 255, 255, 0.76);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 12px;
        }

        .ab2-proof span + span {
          border-left: 1px solid var(--ab2-line);
          padding-left: clamp(16px, 3vw, 38px);
        }

        .ab2-manifesto {
          width: min(100%, 1280px);
          margin: 0 auto;
          padding: clamp(84px, 12vw, 156px) clamp(20px, 5vw, 80px);
        }

        .ab2-manifesto p {
          max-width: 25ch;
          margin: 0;
          font-family: var(--font-title-extra, Arial, sans-serif);
          font-size: clamp(30px, 4.4vw, 60px);
          font-weight: 900;
          line-height: 1.18;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .ab2-word {
          opacity: 0.18;
        }

        .ab2-capabilities,
        .ab2-operating,
        .ab2-cta {
          width: min(100%, 1280px);
          margin: 0 auto;
          padding: clamp(72px, 10vw, 130px) clamp(20px, 5vw, 80px);
        }

        .ab2-section-head {
          max-width: 720px;
          margin-bottom: clamp(36px, 6vw, 70px);
        }

        .ab2-section-head h2,
        .ab2-field-copy h2,
        .ab2-operating h2,
        .ab2-cta h2 {
          margin: 0 0 18px;
          font-size: clamp(30px, 4vw, 54px);
          line-height: 1.08;
        }

        .ab2-section-head p,
        .ab2-field-copy p,
        .ab2-operating-item p,
        .ab2-cta p {
          margin: 0;
          color: var(--ab2-soft);
          font-size: 16px;
          line-height: 1.78;
        }

        .ab2-cap-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          grid-auto-rows: minmax(260px, auto);
          gap: 18px;
        }

        .ab2-cap-card {
          position: relative;
          overflow: hidden;
          min-height: 300px;
          border-radius: var(--ab2-radius);
          background: var(--ab2-panel);
          border: 1px solid var(--ab2-line);
        }

        .ab2-card-1 {
          grid-row: span 2;
        }

        .ab2-card-4 {
          background:
            radial-gradient(circle at 20% 20%, rgba(139, 122, 232, 0.34), transparent 36%),
            linear-gradient(135deg, #130d29, #08060f);
        }

        .ab2-card-media {
          position: absolute;
          inset: 0;
        }

        .ab2-card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.54;
          filter: saturate(0.98) contrast(1.08);
        }

        .ab2-card-copy {
          position: relative;
          z-index: 1;
          min-height: inherit;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(24px, 3vw, 38px);
          background: linear-gradient(180deg, transparent 0%, rgba(8, 6, 15, 0.84) 70%);
        }

        .ab2-card-copy h3 {
          margin: 0 0 12px;
          color: #fff;
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: clamp(22px, 2.5vw, 34px);
          font-weight: 900;
          line-height: 1.12;
        }

        .ab2-card-copy p {
          max-width: 44ch;
          margin: 0;
          color: rgba(255, 255, 255, 0.76);
          line-height: 1.72;
        }

        .ab2-field {
          width: min(100%, 1280px);
          margin: 0 auto;
          padding: clamp(72px, 10vw, 130px) clamp(20px, 5vw, 80px);
          display: grid;
          grid-template-columns: minmax(0, 0.96fr) minmax(280px, 0.64fr);
          align-items: end;
          gap: clamp(28px, 5vw, 76px);
        }

        .ab2-field-media {
          overflow: hidden;
          border-radius: var(--ab2-radius);
          border: 1px solid var(--ab2-line);
          aspect-ratio: 16 / 10;
        }

        .ab2-field-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: saturate(0.9) contrast(1.06) brightness(0.86);
        }

        .ab2-field-copy {
          padding-bottom: clamp(8px, 3vw, 40px);
        }

        .ab2-operating {
          border-top: 1px solid var(--ab2-line);
        }

        .ab2-operating-grid {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: clamp(34px, 6vw, 90px);
          align-items: start;
        }

        .ab2-operating-list {
          display: grid;
          gap: 16px;
        }

        .ab2-operating-item {
          border-radius: var(--ab2-radius);
          border: 1px solid var(--ab2-line);
          background: rgba(255, 255, 255, 0.035);
          padding: clamp(20px, 2.5vw, 30px);
        }

        .ab2-cta {
          text-align: center;
          padding-bottom: clamp(94px, 12vw, 150px);
        }

        .ab2-cta h2 {
          max-width: 780px;
          margin-left: auto;
          margin-right: auto;
        }

        .ab2-cta p {
          max-width: 54ch;
          margin: 0 auto 34px;
        }

        .ab2-cta .ab2-actions {
          justify-content: center;
        }

        @media (max-width: 991px) {
          .ab2-hero-sticky {
            padding-top: 100px;
          }

          .ab2-operating-grid,
          .ab2-field {
            grid-template-columns: 1fr;
          }

          .ab2-proof {
            grid-template-columns: repeat(2, 1fr);
            gap: 0;
          }

          .ab2-proof span {
            padding: 16px 0;
          }

          .ab2-proof span + span {
            border-left: 0;
            padding-left: 0;
          }

          .ab2-proof span:nth-child(even) {
            border-left: 1px solid var(--ab2-line);
            padding-left: 18px;
          }

          .ab2-proof span:nth-child(n + 3) {
            border-top: 1px solid var(--ab2-line);
          }

          .ab2-cap-grid {
            grid-template-columns: 1fr;
          }

          .ab2-card-1 {
            grid-row: auto;
          }
        }

        @media (max-width: 575px) {
          .ab2-hero {
            min-height: 100dvh;
            height: 190dvh;
          }

          .ab2-portal-frame-shell {
            width: max(170vw, 133.333dvh);
          }

          .ab2-hero-caption {
            right: 20px;
          }

          .ab2-breadcrumb {
            font-size: 12px;
          }

          .ab2-actions {
            width: 100%;
          }

          .ab2-btn {
            width: 100%;
          }

          .ab2-cap-card {
            min-height: 260px;
          }
        }

        @media (max-width: 767px) {
          .ab2-fixed-video {
            position: absolute;
            height: 100dvh;
            transform: none !important;
          }

          /* Portal: giữ lại ảnh ring nhưng tắt scroll-driven zoom trên mobile —
             chỉ hiện static, không scale 6.4x gây chiếm toàn màn hình. */
          .ab2-portal-frame {
            transform: none !important;
          }

          .ab2-portal-frame-shell {
            transform: translate(-50%, -39.5%) !important;
          }

          /* Giảm chiều cao hero section trên mobile cho gọn. */
          .ab2-hero {
            height: 100dvh;
            min-height: unset;
          }

          /* Ẩn hàng proof (PUBLISHING / LIVE OPS...) — 4 cột bị ép xuống
             2x2, border-top/bottom tạo đường line ngang cứng ngay dưới hero. */
          .ab2-proof {
            display: none;
          }

          /* Blend content vào hero không có seam cứng. */
          .ab2-content {
            background:
              linear-gradient(180deg, transparent 0%, rgba(8, 6, 15, 0.7) 120px, #08060f 300px),
              #08060f;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab2-portal-frame,
          .ab2-reveal {
            opacity: 1 !important;
            visibility: visible !important;
            filter: none !important;
          }

          .ab2-word {
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
