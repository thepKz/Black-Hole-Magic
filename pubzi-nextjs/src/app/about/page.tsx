'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ABOUT_CHAPTERS = [
  {
    title: 'Đọc thị trường trước khi nói về launch',
    role: 'Vào thị trường',
    copy: 'BlackHole bắt đầu từ hành vi người chơi, gu cộng đồng, kênh thanh toán và nhịp nội dung tại Việt Nam.',
    image: '/assets/img/landing-page/game/tlbb.png',
  },
  {
    title: 'Bản địa hóa cảm giác chơi',
    role: 'Bản địa hóa',
    copy: 'Không chỉ dịch chữ. Chúng tôi điều chỉnh thông điệp, onboarding, sự kiện và cách người chơi gặp sản phẩm.',
    image: '/assets/img/landing-page/iphone_1.png',
  },
  {
    title: 'Kích hoạt cộng đồng có nhịp',
    role: 'Community',
    copy: 'Người sáng tạo nội dung, bang hội, giải đấu và social content được nối thành một lịch vận hành có điểm hẹn rõ ràng.',
    image: '/assets/img/landing-page/game/kiem-the.png',
  },
  {
    title: 'Live ops sau từng bản cập nhật',
    role: 'Live operations',
    copy: 'Dữ liệu giữ chân, phản hồi người chơi và doanh thu được đưa ngược về lịch sự kiện hằng tuần.',
    image: '/assets/img/landing-page/iphone_2.png',
  },
];

const OPERATING_SYSTEM = [
  {
    title: 'Định vị thị trường',
    copy: 'Chọn đúng thông điệp, đúng nhóm người chơi và đúng khoảnh khắc để game không bị trôi trong ngày ra mắt.',
    image: '/assets/img/landing-page/game/tlbb.png',
  },
  {
    title: 'Vận hành cộng đồng',
    copy: 'Giữ nhịp nội dung, giải đấu, bang hội và chăm sóc người chơi để cộng đồng có lý do quay lại mỗi tuần.',
    image: '/assets/img/landing-page/iphone_1.png',
  },
  {
    title: 'Live operations',
    copy: 'Theo dõi phản hồi, doanh thu và giữ chân để điều chỉnh lịch sự kiện, ưu đãi và nội dung sau từng bản cập nhật.',
    image: '/assets/img/landing-page/iphone_2.png',
  },
];

const VISION_POINTS = [
  {
    title: 'Tầm nhìn 2030',
    copy: 'Trở thành đối tác đồng phát hành được các studio quốc tế nghĩ đến đầu tiên khi bước vào Đông Nam Á.',
  },
  {
    title: 'Sứ mệnh',
    copy: 'Kết nối game quốc tế với người chơi bản địa bằng vận hành tử tế, cộng đồng thật và tăng trưởng dài hạn.',
  },
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

    const mm = gsap.matchMedia();
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

      gsap.utils.toArray<HTMLElement>('.ab2-depth-card').forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0.48, y: 72, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 46%',
              scrub: 0.7,
            },
          }
        );
      });

      mm.add('(min-width: 992px)', () => {
        const showcase = root.querySelector<HTMLElement>('.ab2-showcase');
        const windowEl = root.querySelector<HTMLElement>('.ab2-showcase-window');
        const track = root.querySelector<HTMLElement>('.ab2-showcase-track');
        if (!showcase || !windowEl || !track) return;

        const travel = () => Math.max(0, track.scrollWidth - windowEl.clientWidth);
        const tween = gsap.to(track, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: showcase,
            start: 'top top',
            end: () => `+=${Math.max(travel(), 1)}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      ScrollTrigger.refresh();
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
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
        <section className="ab2-manifesto">
          <div className="ab2-manifesto-mark ab2-reveal">BlackHole Game</div>
          <p>
            <Words text="Chúng tôi biến game quốc tế thành trải nghiệm có nhịp, có cộng đồng và có lý do để người chơi Việt quay lại." />
          </p>
        </section>

        <section className="ab2-showcase" aria-label="Vai trò của BlackHole">
          <div className="ab2-showcase-sticky">
            <div className="ab2-showcase-copy ab2-reveal">
              <span>Vai trò của BlackHole</span>
              <h2>Đứng giữa studio và người chơi bản địa.</h2>
              <p>
                Chúng tôi biến một sản phẩm tốt thành một hành trình thị trường có ngữ cảnh, cộng đồng và nhịp vận hành.
              </p>
            </div>

            <div className="ab2-showcase-window">
              <div className="ab2-showcase-track">
                {ABOUT_CHAPTERS.map((chapter) => (
                  <article className="ab2-game-card" key={chapter.title}>
                    <div className="ab2-game-image">
                      <img src={chapter.image} alt={chapter.title} />
                    </div>
                    <div className="ab2-game-copy">
                      <span>{chapter.role}</span>
                      <h3>{chapter.title}</h3>
                      <p>{chapter.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="ab2-system">
          <div className="ab2-system-copy ab2-reveal">
            <h2>Một hệ vận hành có chủ đích.</h2>
            <p>
              Mỗi đội trong BlackHole cùng nhìn vào một bản đồ: sản phẩm, cộng đồng, dữ liệu và lịch vận hành.
            </p>
          </div>

          <div className="ab2-system-board">
            {OPERATING_SYSTEM.map((item) => (
              <article className="ab2-depth-card" key={item.title}>
                <div className="ab2-depth-media">
                  <img src={item.image} alt={item.title} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ab2-network ab2-vision">
          <div className="ab2-network-copy ab2-reveal">
            <h2>Không chạy theo tiếng ồn ngắn hạn.</h2>
            <p>
              BlackHole xây năng lực phát hành để game có đời sống dài hơn một chiến dịch launch.
            </p>
          </div>

          <div className="ab2-vision-board">
            <div className="ab2-vision-art ab2-reveal">
              <img src="/assets/img/landing-page/list_game_doc/TLBB.png" alt="Thế giới game BlackHole phát hành" />
            </div>
            {VISION_POINTS.map((point) => (
              <article className="ab2-vision-note ab2-reveal" key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ab2-command ab2-reveal">
          <div>
            <h2>Một local partner, nhiều điểm chạm.</h2>
            <p>
              Studio có sản phẩm. BlackHole xây cầu nối từ sản phẩm đó đến thị trường, cộng đồng và đội vận hành bản địa.
            </p>
          </div>
          <div className="ab2-command-grid" aria-label="BlackHole operating model">
            <span>Phát hành</span>
            <span>Đồng phát hành</span>
            <span>Bản địa hóa</span>
            <span>Cộng đồng</span>
            <span>Live Ops</span>
            <span>Tăng trưởng</span>
          </div>
        </section>

        <section className="ab2-cta ab2-reveal">
          <h2>Đưa game vào thị trường Việt Nam bằng một kế hoạch có lực.</h2>
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
          --ab2-radius: 8px;
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

        .ab2-content {
          position: relative;
          z-index: 4;
          overflow: hidden;
          background:
            linear-gradient(180deg, rgba(8, 6, 15, 0.08) 0%, rgba(8, 6, 15, 0.92) 220px, #08060f 440px),
            linear-gradient(145deg, #08060f 0%, #0f0921 42%, #070511 100%);
        }

        .ab2-content h2,
        .ab2-content h3 {
          margin: 0;
          color: #f7f4ff;
          font-family: var(--font-title-extra, Arial, sans-serif);
          font-weight: 900;
          letter-spacing: 0;
        }

        .ab2-content p {
          margin: 0;
          color: var(--ab2-soft);
          font-size: 16px;
          line-height: 1.72;
        }

        .ab2-manifesto {
          width: min(100%, 1320px);
          margin: 0 auto;
          padding: clamp(92px, 13vw, 170px) clamp(20px, 5vw, 80px) clamp(80px, 10vw, 132px);
          display: grid;
          grid-template-columns: minmax(180px, 0.42fr) minmax(0, 1fr);
          gap: clamp(30px, 6vw, 92px);
          align-items: end;
        }

        .ab2-manifesto-mark {
          max-width: 14ch;
          color: var(--ab2-accent-strong);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: clamp(18px, 2vw, 28px);
          font-weight: 900;
          line-height: 1.04;
        }

        .ab2-manifesto p {
          max-width: 22ch;
          color: #fff;
          font-family: var(--font-title-extra, Arial, sans-serif);
          font-size: clamp(36px, 5.2vw, 76px);
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: 0;
        }

        .ab2-word {
          opacity: 0.18;
        }

        .ab2-showcase {
          position: relative;
          min-height: 100dvh;
          background:
            linear-gradient(180deg, rgba(8, 6, 15, 0) 0%, rgba(18, 11, 39, 0.86) 52%, rgba(8, 6, 15, 0) 100%);
        }

        .ab2-showcase-sticky {
          min-height: 100dvh;
          padding: clamp(72px, 8vw, 112px) clamp(20px, 5vw, 80px);
          display: grid;
          grid-template-columns: minmax(280px, 0.34fr) minmax(0, 1fr);
          gap: clamp(30px, 5vw, 70px);
          align-items: center;
        }

        .ab2-showcase-copy {
          max-width: 390px;
        }

        .ab2-showcase-copy span,
        .ab2-game-copy span {
          display: inline-flex;
          margin-bottom: 14px;
          color: var(--ab2-accent-strong);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 13px;
          font-weight: 800;
        }

        .ab2-showcase-copy h2,
        .ab2-system-copy h2,
        .ab2-network-copy h2,
        .ab2-command h2,
        .ab2-cta h2 {
          font-size: clamp(34px, 4.4vw, 62px);
          line-height: 1.02;
          text-wrap: balance;
        }

        .ab2-showcase-copy p,
        .ab2-system-copy p,
        .ab2-network-copy p,
        .ab2-command p,
        .ab2-cta p {
          max-width: 48ch;
          margin-top: 20px;
        }

        .ab2-showcase-window {
          overflow: hidden;
          min-width: 0;
        }

        .ab2-showcase-track {
          display: flex;
          gap: clamp(18px, 2vw, 28px);
          width: max-content;
          will-change: transform;
        }

        .ab2-game-card {
          flex: 0 0 min(72vw, 820px);
          border-radius: var(--ab2-radius);
          overflow: hidden;
          border: 1px solid rgba(176, 156, 255, 0.22);
          background: #0d0a19;
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.36);
        }

        .ab2-game-image {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #05040a;
        }

        .ab2-game-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(1.08) contrast(1.04) brightness(0.92);
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ab2-game-card:hover .ab2-game-image img {
          transform: scale(1.04);
        }

        .ab2-game-copy {
          padding: clamp(22px, 2.7vw, 34px);
        }

        .ab2-game-copy h3 {
          font-size: clamp(28px, 3.4vw, 48px);
          line-height: 1.02;
        }

        .ab2-game-copy p {
          margin-top: 14px;
          max-width: 44ch;
        }

        .ab2-system,
        .ab2-network,
        .ab2-command,
        .ab2-cta {
          width: min(100%, 1320px);
          margin: 0 auto;
          padding: clamp(82px, 10vw, 140px) clamp(20px, 5vw, 80px);
        }

        .ab2-system {
          display: grid;
          grid-template-columns: minmax(260px, 0.72fr) minmax(0, 1fr);
          gap: clamp(34px, 6vw, 92px);
          align-items: start;
        }

        .ab2-system-copy {
          position: sticky;
          top: 110px;
        }

        .ab2-system-board {
          display: grid;
          gap: clamp(20px, 2vw, 28px);
        }

        .ab2-depth-card {
          display: grid;
          grid-template-columns: minmax(220px, 0.84fr) minmax(0, 1fr);
          gap: clamp(20px, 3vw, 44px);
          align-items: center;
          padding: clamp(18px, 2.4vw, 30px);
          border-radius: var(--ab2-radius);
          border: 1px solid rgba(176, 156, 255, 0.18);
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.018)),
            rgba(13, 9, 28, 0.84);
        }

        .ab2-depth-card:nth-child(even) {
          grid-template-columns: minmax(0, 1fr) minmax(220px, 0.84fr);
        }

        .ab2-depth-card:nth-child(even) .ab2-depth-media {
          order: 2;
        }

        .ab2-depth-media {
          overflow: hidden;
          border-radius: var(--ab2-radius);
          background: #05040a;
          aspect-ratio: 16 / 10;
        }

        .ab2-depth-media img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(1.02) contrast(1.04) brightness(0.86);
        }

        .ab2-depth-card h3 {
          margin-bottom: 12px;
          font-size: clamp(24px, 2.4vw, 36px);
          line-height: 1.04;
        }

        .ab2-network {
          display: grid;
          grid-template-columns: minmax(260px, 0.62fr) minmax(0, 1fr);
          gap: clamp(32px, 6vw, 86px);
          align-items: center;
        }

        .ab2-vision-board {
          display: grid;
          grid-template-columns: minmax(220px, 0.74fr) minmax(0, 1fr);
          gap: clamp(18px, 2.5vw, 30px);
          align-items: stretch;
        }

        .ab2-vision-art {
          grid-row: span 2;
          min-height: 520px;
          overflow: hidden;
          border-radius: var(--ab2-radius);
          border: 1px solid rgba(176, 156, 255, 0.22);
          background: #05040a;
        }

        .ab2-vision-art img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(1.02) contrast(1.04) brightness(0.88);
        }

        .ab2-vision-note {
          min-height: 245px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: clamp(24px, 3vw, 38px);
          border-radius: var(--ab2-radius);
          border: 1px solid rgba(176, 156, 255, 0.18);
          background:
            radial-gradient(circle at 18% 12%, rgba(139, 122, 232, 0.22), transparent 36%),
            rgba(13, 9, 28, 0.82);
        }

        .ab2-vision-note h3 {
          margin-bottom: 14px;
          font-size: clamp(26px, 3vw, 42px);
          line-height: 1.02;
        }

        .ab2-command {
          display: grid;
          grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1fr);
          gap: clamp(26px, 5vw, 70px);
          align-items: center;
          border: 1px solid rgba(176, 156, 255, 0.18);
          border-radius: var(--ab2-radius);
          background:
            linear-gradient(135deg, rgba(139, 122, 232, 0.16), rgba(8, 6, 15, 0.72) 42%, rgba(255, 255, 255, 0.04));
        }

        .ab2-command-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1px;
          overflow: hidden;
          border-radius: var(--ab2-radius);
          border: 1px solid rgba(176, 156, 255, 0.2);
          background: rgba(176, 156, 255, 0.14);
        }

        .ab2-command-grid span {
          min-height: clamp(86px, 9vw, 124px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          color: rgba(255, 255, 255, 0.88);
          background: rgba(10, 7, 22, 0.94);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: clamp(13px, 1.3vw, 17px);
          font-weight: 900;
          text-align: center;
        }

        .ab2-cta {
          text-align: center;
          padding-bottom: clamp(96px, 12vw, 160px);
        }

        .ab2-cta h2 {
          max-width: 840px;
          margin: 0 auto;
        }

        .ab2-cta p {
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 34px;
        }

        .ab2-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
        }

        .ab2-btn {
          display: inline-flex;
          min-height: 52px;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          border-radius: var(--ab2-radius);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0;
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

        @media (max-width: 991px) {
          .ab2-hero-sticky {
            padding-top: 100px;
          }

          .ab2-manifesto,
          .ab2-system,
          .ab2-network,
          .ab2-command {
            grid-template-columns: 1fr;
          }

          .ab2-system-copy {
            position: static;
          }

          .ab2-showcase {
            min-height: auto;
          }

          .ab2-showcase-sticky {
            min-height: auto;
            display: block;
          }

          .ab2-showcase-copy {
            max-width: 680px;
            margin-bottom: 30px;
          }

          .ab2-showcase-window {
            overflow-x: auto;
            padding-bottom: 12px;
          }

          .ab2-showcase-track {
            padding-right: 20px;
          }

          .ab2-game-card {
            flex-basis: min(82vw, 620px);
          }

          .ab2-vision-art {
            min-height: 460px;
          }
        }

        @media (max-width: 767px) {
          .ab2-fixed-video {
            position: absolute;
            height: 100dvh;
            transform: none !important;
          }

          .ab2-portal-frame {
            transform: none !important;
          }

          .ab2-portal-frame-shell {
            width: 100vw !important;
            transform: translate(-50%, -39.5%) !important;
          }

          .ab2-hero,
          .ab2-hero-sticky {
            overflow: hidden;
          }

          .ab2-hero {
            height: 100dvh;
            min-height: unset;
          }

          .ab2-content {
            background:
              linear-gradient(180deg, transparent 0%, rgba(8, 6, 15, 0.7) 120px, #08060f 300px),
              #08060f;
          }

          .ab2-manifesto,
          .ab2-showcase-sticky,
          .ab2-system,
          .ab2-network,
          .ab2-command,
          .ab2-cta {
            padding-left: 20px;
            padding-right: 20px;
          }

          .ab2-manifesto {
            padding-top: 74px;
            padding-bottom: 58px;
            gap: 18px;
          }

          .ab2-showcase-copy h2,
          .ab2-system-copy h2,
          .ab2-network-copy h2,
          .ab2-command h2,
          .ab2-cta h2 {
            font-size: clamp(30px, 10vw, 42px);
          }

          .ab2-depth-card,
          .ab2-depth-card:nth-child(even) {
            grid-template-columns: 1fr;
          }

          .ab2-depth-card:nth-child(even) .ab2-depth-media {
            order: 0;
          }

          .ab2-vision-board {
            grid-template-columns: 1fr;
          }

          .ab2-vision-art {
            grid-row: auto;
            min-height: 440px;
          }

          .ab2-command-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab2-actions {
            width: 100%;
          }

          .ab2-btn {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab2-portal-frame,
          .ab2-reveal,
          .ab2-depth-card {
            opacity: 1 !important;
            visibility: visible !important;
            filter: none !important;
            transform: none !important;
          }

          .ab2-word {
            opacity: 1 !important;
          }

          .ab2-showcase-track {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
