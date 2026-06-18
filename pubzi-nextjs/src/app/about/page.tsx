'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OPERATING_LAYERS = [
  {
    title: 'đọc thị trường',
    copy: 'Bắt đầu từ hành vi người chơi, kênh cộng đồng, nhịp nội dung và những rào cản bản địa trước khi nói về launch.',
    image: '/assets/img/inner-page/service-details/details-1.jpg',
    alt: 'Không gian nghiên cứu thị trường cho vận hành game',
    ratio: 'wide',
  },
  {
    title: 'bản địa hóa trải nghiệm',
    copy: 'Không chỉ dịch chữ. Thông điệp, onboarding, lịch sự kiện và cách người chơi gặp sản phẩm đều cần đúng ngữ cảnh.',
    image: '/assets/img/home-2/about/aout-01.jpg',
    alt: 'Hình ảnh đại diện cho trải nghiệm bản địa hóa',
    ratio: 'vertical',
  },
  {
    title: 'kích hoạt cộng đồng',
    copy: 'Creator, bang hội, giải đấu và social content được nối thành một nhịp vận hành có điểm hẹn rõ ràng.',
    image: '/assets/img/inner-page/gallery/gallery-1.jpg',
    alt: 'Không khí cộng đồng game trong một chiến dịch',
    ratio: 'vertical',
  },
  {
    title: 'vận hành sau launch',
    copy: 'Phản hồi người chơi, dữ liệu giữ chân và lịch cập nhật được đưa ngược về đội vận hành để game có đời sống dài hơn.',
    image: '/assets/img/inner-page/service-details/details-2.jpg',
    alt: 'Không gian vận hành live ops sau khi ra mắt',
    ratio: 'wide',
  },
];

const WORK_STEPS = [
  {
    title: 'lắng nghe',
    kicker: 'từ người chơi',
    copy: 'BlackHole gom tín hiệu từ cộng đồng, creator, social và dữ liệu sản phẩm để nhìn đúng vấn đề trước khi đẩy chiến dịch.',
    image: '/assets/img/home-7/about/about-01.png',
    alt: 'Đội vận hành lắng nghe tín hiệu người chơi',
  },
  {
    title: 'định hình',
    kicker: 'thành kế hoạch',
    copy: 'Mỗi thông điệp, kênh nội dung và lịch ra mắt được gom về một bản đồ vận hành mà marketing, cộng đồng và live ops cùng đọc được.',
    image: '/assets/img/inner-page/service-details/details-3.jpg',
    alt: 'Bản đồ kế hoạch vận hành cho chiến dịch',
  },
  {
    title: 'vận hành',
    kicker: 'thành nhịp quay lại',
    copy: 'Sau launch, BlackHole giữ nhịp bằng sự kiện, phản hồi, ưu đãi, nội dung cộng đồng và những vòng cải thiện liên tục.',
    image: '/assets/img/home-2/news/news-03.jpg',
    alt: 'Nhịp nội dung và vận hành cộng đồng sau launch',
  },
];

const PRINCIPLES = [
  {
    title: 'rõ việc',
    copy: 'Mỗi đội biết mình đang tác động vào phần nào của hành trình người chơi.',
  },
  {
    title: 'phản hồi nhanh',
    copy: 'Tín hiệu từ cộng đồng được chuyển thành hành động, không nằm im trong báo cáo.',
  },
  {
    title: 'tôn trọng cộng đồng',
    copy: 'Người chơi không chỉ là traffic. Họ là lý do sản phẩm có đời sống dài hạn.',
  },
  {
    title: 'đo bằng dữ liệu',
    copy: 'Cảm hứng cần có số liệu đi cùng để quyết định bớt mơ hồ.',
  },
];

const PORTFOLIO_ACCENTS = [
  {
    title: 'thị trường',
    image: '/assets/img/landing-page/game/tlbb.png',
    alt: 'Ảnh portfolio game ngang',
  },
  {
    title: 'cộng đồng',
    image: '/assets/img/landing-page/game/kiem-the.png',
    alt: 'Ảnh portfolio game cộng đồng',
  },
  {
    title: 'vận hành',
    image: '/assets/img/landing-page/list_game_doc/TLBB.png',
    alt: 'Ảnh portfolio game dọc',
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

// Manifesto rendered as discrete lines so each can reveal on scroll without
// the inline-block whitespace-collapse bug that glued words together.
// Each line is a clip window (.ab2-line) over an inner span (.ab2-line-inner)
// that rises into view — a cinematic per-line mask wipe driven by GSAP.
const MANIFESTO_LINES: ReactNode[] = [
  <>Chúng tôi đưa</>,
  <><span className="ab2-hl">game quốc tế</span> vào</>,
  <>nhịp sống của</>,
  <><span className="ab2-hl">người chơi Việt</span>.</>,
];

function ManifestoLines() {
  return (
    <>
      {MANIFESTO_LINES.map((line, i) => (
        <span className="ab2-line" key={i}>
          <span className="ab2-line-inner">{line}</span>
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

      portalTl.to(
        '.ab2-portal-frame',
        { scale: 6.4, filter: 'brightness(1.08)', ease: 'none', duration: 1, force3D: false },
        0
      );

      // Manifesto line wipe: each line's inner span rises into its clip window
      // (cinematic masked reveal), staggered as the section scrubs into view.
      const lineTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.ab2-manifesto',
          start: 'top 72%',
          end: 'top 26%',
          scrub: 0.8,
        },
      });
      lineTl.fromTo(
        '.ab2-manifesto-copy .ab2-line-inner',
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power3.out',
          stagger: 0.16,
        },
        0
      );
      // Gentle settle: the copy block tightens tracking and lifts a touch as it
      // locks in — a quiet weighty finish rather than a flat stop.
      lineTl.fromTo(
        '.ab2-manifesto-copy',
        { letterSpacing: '0.04em', y: 14 },
        { letterSpacing: '0em', y: 0, ease: 'power2.out', duration: 0.6 },
        0.2
      );

      // Framed video parallax: the portal drifts and breathes inside its frame
      // as the section travels — depth without moving layout (transform only).
      gsap.fromTo(
        '.ab2-letterbox-video',
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 6,
          scale: 1.16,
          ease: 'none',
          scrollTrigger: {
            trigger: '.ab2-manifesto',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>('.ab2-reveal').forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 84%', once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.ab2-layer-card').forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0.42, y: 54, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 44%',
              scrub: 0.75,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.ab2-process-card').forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0.52, y: 70, scale: 0.97 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              end: 'top 42%',
              scrub: 0.8,
            },
          }
        );
      });

      mm.add('(min-width: 992px)', () => {
        const bgTween = gsap.to('.ab2-content-backdrop', {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: '.ab2-content',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        const processMedia = gsap.to('.ab2-process-visual-inner', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: '.ab2-process',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          bgTween.scrollTrigger?.kill();
          processMedia.scrollTrigger?.kill();
          bgTween.kill();
          processMedia.kill();
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
        <div className="ab2-content-backdrop" aria-hidden="true" />

        <section className="ab2-manifesto">
          <div className="ab2-manifesto-mark ab2-reveal">— về BlackHole</div>

          <div className="ab2-manifesto-stage">
            <div className="ab2-letterbox" aria-hidden="true">
              <video
                className="ab2-letterbox-video ab2-motion-video"
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
              >
                <PortalVideoSources />
              </video>
              <span className="ab2-letterbox-scrim" />
            </div>

            <p className="ab2-manifesto-copy">
              <ManifestoLines />
            </p>
          </div>

          <span className="ab2-manifesto-note ab2-reveal">
            BlackHole xây nhịp vận hành bản địa: thị trường, cộng đồng, creator, live ops và phản hồi người chơi.
          </span>
        </section>

        <section className="ab2-layers" aria-label="Mô hình vận hành của BlackHole">
          <div className="ab2-section-head ab2-reveal">
            <h2>một local partner, không phải một chiến dịch ngắn ngày.</h2>
            <p>
              Khi một sản phẩm bước vào thị trường mới, việc khó không chỉ là truyền thông. Việc khó là tạo được ngữ cảnh,
              niềm tin và lý do quay lại sau ngày ra mắt.
            </p>
          </div>

          <div className="ab2-layer-grid">
            {OPERATING_LAYERS.map((layer) => (
              <article className={`ab2-layer-card ab2-layer-card-${layer.ratio}`} key={layer.title}>
                <div className="ab2-layer-media">
                  <Image src={layer.image} alt={layer.alt} fill sizes="(max-width: 991px) 100vw, 52vw" />
                </div>
                <div className="ab2-layer-copy">
                  <h3>{layer.title}</h3>
                  <p>{layer.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ab2-process" aria-label="Cách BlackHole làm việc">
          <div className="ab2-process-visual ab2-reveal" aria-hidden="true">
            <div className="ab2-process-visual-inner">
              <Image src="/assets/img/inner-page/service-details/details-1.jpg" alt="" fill sizes="(max-width: 991px) 100vw, 38vw" />
              <div className="ab2-process-panel">
                <span>market</span>
                <span>community</span>
                <span>live ops</span>
              </div>
            </div>
          </div>

          <div className="ab2-process-copy">
            <div className="ab2-process-title ab2-reveal">
              <h2>từ tín hiệu rời rạc thành một nhịp vận hành.</h2>
              <p>
                Cách làm của BlackHole không bắt đầu bằng một poster đẹp. Nó bắt đầu bằng việc hiểu người chơi đang cần gì
                và sản phẩm nên gặp họ ở đâu.
              </p>
            </div>

            <div className="ab2-process-stack">
              {WORK_STEPS.map((step) => (
                <article className="ab2-process-card" key={step.title}>
                  <div className="ab2-process-thumb">
                    <Image src={step.image} alt={step.alt} fill sizes="(max-width: 767px) 100vw, 22vw" />
                  </div>
                  <div className="ab2-process-card-copy">
                    <span>{step.kicker}</span>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ab2-principles" aria-label="Nguyên tắc vận hành BlackHole">
          <div className="ab2-principles-head ab2-reveal">
            <h2>những nguyên tắc giữ trang About này thật.</h2>
            <p>
              Khi chưa có fact từ marketing, điều đúng nhất là nói rõ cách BlackHole muốn vận hành, không dựng lên những con
              số chưa được xác nhận.
            </p>
          </div>

          <div className="ab2-principle-rail">
            {PRINCIPLES.map((principle) => (
              <article className="ab2-principle-item ab2-reveal" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ab2-proof" aria-label="Điểm chạm portfolio của BlackHole">
          <div className="ab2-proof-copy ab2-reveal">
            <h2>sản phẩm là bằng chứng, nhưng không chiếm hết câu chuyện.</h2>
            <p>
              Game vẫn xuất hiện như dấu vết portfolio. Trọng tâm của About là cách BlackHole đưa sản phẩm vào thị trường và
              giữ nó sống cùng cộng đồng.
            </p>
          </div>

          <div className="ab2-proof-board">
            {PORTFOLIO_ACCENTS.map((item, index) => (
              <figure className={`ab2-proof-item ab2-proof-item-${index + 1} ab2-reveal`} key={item.title}>
                <Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 34vw" />
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="ab2-cta ab2-reveal">
          <div>
            <h2>đưa game vào thị trường Việt Nam bằng một kế hoạch có lực.</h2>
            <p>BlackHole sẵn sàng trao đổi về phát hành, cộng đồng và live operations.</p>
          </div>
          <div className="ab2-actions">
            <Link className="ab2-btn ab2-btn-primary" href="/contact">
              Trao đổi với BlackHole
            </Link>
            <Link className="ab2-btn ab2-btn-secondary" href="/game">
              Xem danh sách game
            </Link>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .ab2-root {
          --ab2-bg: #08060f;
          --ab2-panel: #0f0b1e;
          --ab2-panel-2: #161026;
          --ab2-text: rgba(255, 255, 255, 0.96);
          --ab2-soft: rgba(255, 255, 255, 0.72);
          --ab2-muted: rgba(255, 255, 255, 0.5);
          --ab2-line: rgba(176, 156, 255, 0.2);
          --ab2-accent: #9f8cff;
          --ab2-accent-strong: #c2b4ff;
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
            linear-gradient(180deg, rgba(8, 6, 15, 0.08) 0%, rgba(8, 6, 15, 0.94) 210px, #08060f 430px),
            linear-gradient(145deg, #08060f 0%, #0d081c 48%, #08060f 100%);
          isolation: isolate;
        }

        .ab2-content-backdrop {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(130deg, rgba(159, 140, 255, 0.11), transparent 34%, rgba(255, 255, 255, 0.035));
          background-size: 92px 92px, 92px 92px, 100% 100%;
          mask-image: linear-gradient(180deg, transparent 0%, black 8%, black 92%, transparent 100%);
          opacity: 0.62;
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
          font-size: 1rem;
          line-height: 1.72;
        }

        .ab2-manifesto,
        .ab2-layers,
        .ab2-process,
        .ab2-principles,
        .ab2-proof,
        .ab2-cta {
          width: min(100%, 1360px);
          margin: 0 auto;
          padding-left: clamp(20px, 5vw, 80px);
          padding-right: clamp(20px, 5vw, 80px);
        }

        .ab2-manifesto {
          min-height: 100dvh;
          padding-top: clamp(100px, 13vh, 168px);
          padding-bottom: clamp(86px, 11vh, 140px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(22px, 3vw, 38px);
        }

        .ab2-manifesto-mark {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: var(--ab2-accent-strong);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 1.1rem;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        /* Stage = the film frame; copy is absolutely overlaid on top of it. */
        .ab2-manifesto-stage {
          position: relative;
          width: min(100%, 1180px);
        }

        .ab2-letterbox {
          position: relative;
          width: 100%;
          aspect-ratio: 2.39 / 1;
          overflow: hidden;
          border-radius: var(--ab2-radius);
          border: 1px solid var(--ab2-line);
          background: #05040a;
          box-shadow: 0 36px 120px rgba(0, 0, 0, 0.46);
        }

        .ab2-letterbox-video {
          position: absolute;
          /* oversized + negative inset so the parallax scale/translate never
             exposes the frame edges as the video drifts inside the letterbox */
          inset: -12%;
          width: 124%;
          height: 124%;
          object-fit: cover;
          object-position: center center;
          filter: contrast(1.22) brightness(0.82) saturate(1.24);
          will-change: transform;
        }

        /* Darkens video so overlaid text stays legible; stronger bottom-left. */
        .ab2-letterbox-scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(105deg, rgba(7, 5, 15, 0.86) 0%, rgba(7, 5, 15, 0.42) 46%, rgba(7, 5, 15, 0.2) 72%),
            linear-gradient(0deg, rgba(7, 5, 15, 0.62), rgba(7, 5, 15, 0.08) 60%);
        }

        /* Manifesto sentence overlaid on the frame, lowercase, line-by-line. */
        .ab2-manifesto-copy {
          position: absolute;
          left: clamp(20px, 4vw, 56px);
          right: clamp(20px, 4vw, 56px);
          bottom: clamp(22px, 5vh, 56px);
          margin: 0;
          display: flex;
          flex-direction: column;
          z-index: 2;
        }

        /* Clip window: hides the inner span until it rises into view. Vertical
           padding + matching negative margin give Vietnamese diacritics and
           descenders room so overflow:hidden never crops them. */
        .ab2-line {
          display: block;
          overflow: hidden;
          padding: 0.12em 0.06em;
          margin: -0.12em -0.06em;
          font-size: clamp(2.1rem, 5.2vw, 4.4rem);
          line-height: 1.04;
        }

        .ab2-line-inner {
          display: block;
          color: #fff;
          font-family: var(--font-title-extra, Arial, sans-serif);
          font-weight: 900;
          letter-spacing: 0;
          /* body sets text-transform:uppercase globally — force lowercase here */
          text-transform: none;
          text-wrap: balance;
          text-shadow: 0 2px 24px rgba(0, 0, 0, 0.74), 0 0 48px rgba(0, 0, 0, 0.4);
          will-change: transform, opacity;
        }

        /* Purple accent on key phrases. */
        .ab2-hl {
          background: linear-gradient(120deg, var(--ab2-accent), var(--ab2-accent-strong));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          text-shadow: none;
        }

        .ab2-manifesto-note {
          display: block;
          max-width: 58ch;
          color: rgba(255, 255, 255, 0.74);
          font-size: 1rem;
          line-height: 1.8;
        }

        .ab2-section-head,
        .ab2-principles-head,
        .ab2-proof-copy {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(280px, 0.62fr);
          gap: clamp(28px, 5vw, 78px);
          align-items: end;
        }

        .ab2-section-head h2,
        .ab2-process-title h2,
        .ab2-principles-head h2,
        .ab2-proof-copy h2,
        .ab2-cta h2 {
          max-width: 13ch;
          font-size: 3.85rem;
          line-height: 1.02;
          text-wrap: balance;
        }

        .ab2-section-head p,
        .ab2-process-title p,
        .ab2-principles-head p,
        .ab2-proof-copy p,
        .ab2-cta p {
          max-width: 56ch;
        }

        .ab2-layers {
          padding-top: clamp(80px, 10vh, 130px);
          padding-bottom: clamp(92px, 12vh, 156px);
        }

        .ab2-layer-grid {
          margin-top: 56px;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 18px;
          align-items: stretch;
        }

        .ab2-layer-card {
          min-height: 520px;
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          overflow: hidden;
          border-radius: var(--ab2-radius);
          border: 1px solid var(--ab2-line);
          background:
            linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.018)),
            rgba(13, 9, 28, 0.86);
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.28);
        }

        .ab2-layer-card:nth-child(1) {
          grid-column: span 7;
        }

        .ab2-layer-card:nth-child(2) {
          grid-column: span 5;
        }

        .ab2-layer-card:nth-child(3) {
          grid-column: span 5;
        }

        .ab2-layer-card:nth-child(4) {
          grid-column: span 7;
        }

        .ab2-layer-media {
          position: relative;
          overflow: hidden;
          background: #05040a;
        }

        .ab2-layer-card-wide .ab2-layer-media {
          aspect-ratio: 16 / 9;
        }

        .ab2-layer-card-vertical .ab2-layer-media {
          aspect-ratio: 4 / 5;
        }

        .ab2-layer-media img,
        .ab2-process-thumb img,
        .ab2-proof-item img,
        .ab2-process-visual-inner img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(1.04) contrast(1.05) brightness(0.86);
        }

        .ab2-layer-copy {
          padding: 28px;
        }

        .ab2-layer-copy h3 {
          margin-bottom: 12px;
          font-size: 2.15rem;
          line-height: 1.04;
        }

        .ab2-layer-copy p {
          max-width: 48ch;
        }

        .ab2-process {
          min-height: 100dvh;
          padding-top: clamp(90px, 12vh, 150px);
          padding-bottom: clamp(90px, 12vh, 150px);
          display: grid;
          grid-template-columns: minmax(280px, 0.75fr) minmax(0, 1fr);
          gap: clamp(34px, 6vw, 86px);
          align-items: start;
        }

        .ab2-process-visual {
          position: sticky;
          top: 112px;
          min-height: 580px;
          overflow: hidden;
          border-radius: var(--ab2-radius);
          border: 1px solid var(--ab2-line);
          background: #090611;
        }

        .ab2-process-visual-inner {
          position: absolute;
          inset: -8% 0;
          will-change: transform;
        }

        .ab2-process-visual-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(8, 6, 15, 0.05), rgba(8, 6, 15, 0.86)),
            linear-gradient(90deg, rgba(8, 6, 15, 0.18), transparent 58%);
          pointer-events: none;
        }

        .ab2-process-panel {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 24px;
          z-index: 2;
          display: grid;
          gap: 1px;
          overflow: hidden;
          border-radius: var(--ab2-radius);
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.14);
        }

        .ab2-process-panel span {
          min-height: 58px;
          display: flex;
          align-items: center;
          padding: 0 18px;
          background: rgba(9, 6, 20, 0.82);
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-weight: 900;
        }

        .ab2-process-copy {
          display: grid;
          gap: 34px;
        }

        .ab2-process-title {
          max-width: 760px;
        }

        .ab2-process-title p {
          margin-top: 20px;
        }

        .ab2-process-stack {
          display: grid;
          gap: 20px;
        }

        .ab2-process-card {
          display: grid;
          grid-template-columns: minmax(180px, 0.56fr) minmax(0, 1fr);
          gap: 24px;
          align-items: center;
          padding: 18px;
          border-radius: var(--ab2-radius);
          border: 1px solid var(--ab2-line);
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.018)),
            rgba(12, 8, 26, 0.86);
          backdrop-filter: blur(16px);
        }

        .ab2-process-thumb {
          position: relative;
          overflow: hidden;
          border-radius: var(--ab2-radius);
          aspect-ratio: 4 / 3;
          background: #05040a;
        }

        .ab2-process-card-copy span {
          display: block;
          margin-bottom: 8px;
          color: var(--ab2-accent-strong);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 0.9rem;
          font-weight: 900;
        }

        .ab2-process-card h3 {
          margin-bottom: 10px;
          font-size: 2.1rem;
          line-height: 1.04;
        }

        .ab2-principles {
          padding-top: clamp(86px, 11vh, 140px);
          padding-bottom: clamp(86px, 11vh, 140px);
        }

        .ab2-principle-rail {
          margin-top: 58px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border: 1px solid var(--ab2-line);
          border-radius: var(--ab2-radius);
          overflow: hidden;
          background: rgba(176, 156, 255, 0.12);
        }

        .ab2-principle-item {
          min-height: 310px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
          padding: 28px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.015)),
            rgba(10, 7, 22, 0.94);
        }

        .ab2-principle-item + .ab2-principle-item {
          border-left: 1px solid rgba(176, 156, 255, 0.14);
        }

        .ab2-principle-item h3 {
          max-width: 8ch;
          font-size: 2.55rem;
          line-height: 1.02;
        }

        .ab2-principle-item p {
          font-size: 0.95rem;
        }

        .ab2-proof {
          padding-top: clamp(80px, 10vh, 130px);
          padding-bottom: clamp(92px, 12vh, 156px);
          display: grid;
          grid-template-columns: minmax(0, 0.78fr) minmax(320px, 0.8fr);
          gap: clamp(34px, 6vw, 86px);
          align-items: center;
        }

        .ab2-proof-copy {
          display: block;
        }

        .ab2-proof-copy p {
          margin-top: 22px;
        }

        .ab2-proof-board {
          min-height: 620px;
          position: relative;
        }

        .ab2-proof-item {
          position: absolute;
          margin: 0;
          overflow: hidden;
          border-radius: var(--ab2-radius);
          border: 1px solid rgba(176, 156, 255, 0.22);
          background: #05040a;
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.34);
        }

        .ab2-proof-item-1 {
          left: 0;
          top: 48px;
          width: 64%;
          aspect-ratio: 16 / 9;
        }

        .ab2-proof-item-2 {
          right: 0;
          top: 0;
          width: 46%;
          aspect-ratio: 4 / 3;
        }

        .ab2-proof-item-3 {
          right: 10%;
          bottom: 0;
          width: 34%;
          aspect-ratio: 4 / 5;
        }

        .ab2-proof-item figcaption {
          position: absolute;
          left: 12px;
          bottom: 12px;
          padding: 8px 11px;
          border-radius: var(--ab2-radius);
          color: rgba(255, 255, 255, 0.92);
          background: rgba(7, 5, 15, 0.78);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 0.82rem;
          font-weight: 900;
        }

        .ab2-cta {
          padding-top: clamp(72px, 9vh, 110px);
          padding-bottom: clamp(104px, 14vh, 180px);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 34px;
          align-items: end;
        }

        .ab2-cta h2 {
          max-width: 15ch;
        }

        .ab2-cta p {
          margin-top: 20px;
        }

        .ab2-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
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
          font-size: 0.95rem;
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
          background: linear-gradient(135deg, #9f8cff, #5f36db);
          color: #fff;
          box-shadow: 0 18px 46px rgba(95, 54, 219, 0.34);
        }

        .ab2-btn-primary:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #b9acff, #6d46ec);
        }

        .ab2-btn-secondary {
          border: 1px solid rgba(194, 180, 255, 0.36);
          color: #eee9ff;
          background: rgba(14, 10, 30, 0.58);
        }

        .ab2-btn-secondary:hover {
          transform: translateY(-2px);
          border-color: rgba(194, 180, 255, 0.72);
          background: rgba(159, 140, 255, 0.14);
        }

        @media (max-width: 1199px) {
          .ab2-line {
            font-size: clamp(2.1rem, 5.2vw, 4rem);
          }

          .ab2-section-head h2,
          .ab2-process-title h2,
          .ab2-principles-head h2,
          .ab2-proof-copy h2,
          .ab2-cta h2 {
            font-size: 3.35rem;
          }

          .ab2-layer-card,
          .ab2-process-visual {
            min-height: 480px;
          }

          .ab2-principle-rail {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab2-principle-item:nth-child(3) {
            border-left: 0;
          }

          .ab2-principle-item:nth-child(n + 3) {
            border-top: 1px solid rgba(176, 156, 255, 0.14);
          }
        }

        @media (max-width: 991px) {
          .ab2-hero-sticky {
            padding-top: 100px;
          }

          .ab2-manifesto,
          .ab2-section-head,
          .ab2-process,
          .ab2-principles-head,
          .ab2-proof,
          .ab2-cta {
            grid-template-columns: 1fr;
          }

          .ab2-manifesto {
            min-height: auto;
          }

          .ab2-layer-grid {
            grid-template-columns: 1fr;
          }

          .ab2-layer-card:nth-child(n) {
            grid-column: auto;
          }

          .ab2-process-visual {
            position: relative;
            top: auto;
            min-height: 420px;
          }

          .ab2-process-visual-inner {
            inset: 0;
          }

          .ab2-cta {
            align-items: start;
          }

          .ab2-actions {
            justify-content: flex-start;
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
              linear-gradient(180deg, transparent 0%, rgba(8, 6, 15, 0.72) 120px, #08060f 300px),
              #08060f;
          }

          .ab2-manifesto,
          .ab2-layers,
          .ab2-process,
          .ab2-principles,
          .ab2-proof,
          .ab2-cta {
            padding-left: 20px;
            padding-right: 20px;
          }

          .ab2-manifesto {
            padding-top: 74px;
            padding-bottom: 64px;
            gap: 20px;
          }

          .ab2-letterbox {
            /* taller frame on phones so 4 big lines fit without overflow */
            aspect-ratio: 4 / 5;
          }

          .ab2-manifesto-copy {
            left: 18px;
            right: 18px;
            bottom: 20px;
          }

          .ab2-manifesto-mark {
            font-size: 0.95rem;
          }

          .ab2-section-head h2,
          .ab2-process-title h2,
          .ab2-principles-head h2,
          .ab2-proof-copy h2,
          .ab2-cta h2 {
            font-size: 2.35rem;
            max-width: 12ch;
          }

          .ab2-content p,
          .ab2-manifesto-note {
            font-size: 0.93rem;
          }

          .ab2-layer-grid {
            margin-top: 34px;
          }

          .ab2-layer-card {
            min-height: auto;
          }

          .ab2-layer-copy,
          .ab2-principle-item {
            padding: 22px;
          }

          .ab2-layer-copy h3,
          .ab2-process-card h3,
          .ab2-principle-item h3 {
            font-size: 1.85rem;
          }

          .ab2-process-card {
            grid-template-columns: 1fr;
          }

          .ab2-process-visual {
            min-height: 360px;
          }

          .ab2-process-panel {
            left: 16px;
            right: 16px;
            bottom: 16px;
          }

          .ab2-principle-rail {
            grid-template-columns: 1fr;
          }

          .ab2-principle-item + .ab2-principle-item {
            border-left: 0;
            border-top: 1px solid rgba(176, 156, 255, 0.14);
          }

          .ab2-proof-board {
            min-height: auto;
            display: grid;
            gap: 16px;
          }

          .ab2-proof-item {
            position: relative;
            inset: auto;
            width: 100%;
          }

          .ab2-proof-item-1,
          .ab2-proof-item-2 {
            aspect-ratio: 16 / 9;
          }

          .ab2-proof-item-3 {
            aspect-ratio: 4 / 5;
          }

          .ab2-actions {
            width: 100%;
          }

          .ab2-btn {
            width: 100%;
            white-space: normal;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab2-portal-frame,
          .ab2-reveal,
          .ab2-layer-card,
          .ab2-process-card,
          .ab2-process-visual-inner,
          .ab2-content-backdrop {
            opacity: 1 !important;
            visibility: visible !important;
            filter: none !important;
            transform: none !important;
          }

          .ab2-line-inner {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
          }

          .ab2-letterbox-video {
            /* kill parallax drift but keep the color grade and a clean cover fit */
            transform: none !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
