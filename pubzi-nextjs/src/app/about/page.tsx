'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LAYER_HERO_IMAGE = 'https://picsum.photos/seed/blackhole-longterm-local-partner/1500/1000';
const PROCESS_IMAGE = 'https://picsum.photos/seed/blackhole-live-ops-room/1200/1500';

const OPERATING_LAYERS = [
  {
    title: 'đọc thị trường',
    copy: 'Hành vi người chơi, cộng đồng và rào cản bản địa được soi trước khi quyết định thông điệp.',
    image: 'https://picsum.photos/seed/blackhole-player-research/900/700',
    alt: 'Không gian nghiên cứu thị trường cho vận hành game',
  },
  {
    title: 'bản địa hóa trải nghiệm',
    copy: 'Ngôn ngữ, onboarding, lịch sự kiện và support được chỉnh theo ngữ cảnh Việt Nam.',
    image: 'https://picsum.photos/seed/blackhole-localization-context/900/700',
    alt: 'Hình ảnh đại diện cho trải nghiệm bản địa hóa',
  },
  {
    title: 'kích hoạt cộng đồng',
    copy: 'Creator, bang hội, giải đấu và social content được nối thành một nhịp có điểm hẹn.',
    image: 'https://picsum.photos/seed/blackhole-community-activation/900/700',
    alt: 'Không khí cộng đồng game trong một hoạt động bản địa',
  },
  {
    title: 'vận hành sau launch',
    copy: 'Phản hồi người chơi và dữ liệu giữ chân quay lại kế hoạch live ops để game có đời sống dài hơn.',
    image: 'https://picsum.photos/seed/blackhole-postlaunch-operations/900/700',
    alt: 'Không gian vận hành live ops sau khi ra mắt',
  },
];

const WORK_STEPS = [
  {
    title: 'lắng nghe',
    kicker: 'từ người chơi',
    copy: 'BlackHole gom tín hiệu từ cộng đồng, creator, social và dữ liệu sản phẩm để nhìn đúng vấn đề trước khi chốt kế hoạch.',
    image: 'https://picsum.photos/seed/blackhole-player-signals/800/600',
    alt: 'Đội vận hành lắng nghe tín hiệu người chơi',
  },
  {
    title: 'định hình',
    kicker: 'thành kế hoạch',
    copy: 'Thông điệp, kênh nội dung và lịch ra mắt được gom về một bản đồ vận hành mà marketing, cộng đồng và live ops cùng đọc được.',
    image: 'https://picsum.photos/seed/blackhole-publishing-plan/800/600',
    alt: 'Bản đồ kế hoạch vận hành cho sản phẩm game',
  },
  {
    title: 'vận hành',
    kicker: 'thành nhịp quay lại',
    copy: 'Sau launch, BlackHole giữ nhịp bằng sự kiện, phản hồi, ưu đãi, nội dung cộng đồng và những vòng cải thiện liên tục.',
    image: 'https://picsum.photos/seed/blackhole-community-liveops/800/600',
    alt: 'Nhịp nội dung và vận hành cộng đồng sau launch',
  },
];

const PRINCIPLES = [
  {
    title: 'đi cùng từ sớm',
    copy: 'Thị trường, pháp lý, thanh toán và cộng đồng được đặt lên bàn từ giai đoạn chuẩn bị, không đợi sát ngày ra mắt.',
  },
  {
    title: 'giữ nhịp sau launch',
    copy: 'Launch chỉ là điểm mở. Lịch cập nhật, support và hoạt động cộng đồng mới quyết định sản phẩm có quay lại được không.',
  },
  {
    title: 'nói đúng ngữ cảnh',
    copy: 'Một sản phẩm quốc tế cần được gặp người chơi bằng ngôn ngữ, thời điểm và kênh phân phối phù hợp với Việt Nam.',
  },
  {
    title: 'quyết định bằng tín hiệu',
    copy: 'Dữ liệu giữ chân, phản hồi cộng đồng và hiệu quả kênh được dùng để điều chỉnh vận hành liên tục.',
  },
];

const PORTFOLIO_ACCENTS = [
  {
    title: 'thị trường',
    image: '/assets/img/landing-page/game/tlbb.png',
    alt: 'Ảnh portfolio game ngang',
    copy: 'Chọn cách tiếp cận theo hành vi và cộng đồng của từng nhóm người chơi.',
  },
  {
    title: 'cộng đồng',
    image: '/assets/img/landing-page/game/kiem-the.png',
    alt: 'Ảnh portfolio game cộng đồng',
    copy: 'Xây lịch nội dung, creator và điểm hẹn để người chơi có lý do quay lại.',
  },
  {
    title: 'vận hành',
    image: '/assets/img/landing-page/list_game_doc/TLBB.png',
    alt: 'Ảnh portfolio game dọc',
    copy: 'Giữ sản phẩm sống bằng phản hồi, support, update và live ops sau ngày mở cửa.',
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
// that rises into view with a cinematic per-line mask wipe driven by GSAP.
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
      // locks in with a quiet weighty finish rather than a flat stop.
      lineTl.fromTo(
        '.ab2-manifesto-copy',
        { letterSpacing: '0.04em', y: 14 },
        { letterSpacing: '0em', y: 0, ease: 'power2.out', duration: 0.6 },
        0.2
      );

      // Framed video parallax: the portal drifts and breathes inside its frame
      // as the section travels. Depth without moving layout (transform only).
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

        const proofMediaTweens = gsap.utils.toArray<HTMLElement>('.ab2-proof-media img').map((image, index) =>
          gsap.fromTo(
            image,
            { scale: 1.04, yPercent: index === 1 ? 4 : -4 },
            {
              scale: 1.12,
              yPercent: index === 1 ? -4 : 4,
              ease: 'none',
              scrollTrigger: {
                trigger: '.ab2-proof',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.05,
                invalidateOnRefresh: true,
              },
            }
          )
        );

        return () => {
          bgTween.scrollTrigger?.kill();
          processMedia.scrollTrigger?.kill();
          proofMediaTweens.forEach((tween) => {
            tween.scrollTrigger?.kill();
            tween.kill();
          });
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
          <div className="ab2-manifesto-mark ab2-reveal">về BlackHole</div>

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
              BlackHole đi cùng sản phẩm từ ngày nghiên cứu thị trường đến khi cộng đồng đã có nhịp quay lại.
            </p>
          </div>

          <div className="ab2-layer-showcase">
            <figure className="ab2-layer-hero ab2-layer-card">
              <div className="ab2-layer-hero-media">
                <Image
                  src={LAYER_HERO_IMAGE}
                  alt="Không gian vận hành phát hành game tại thị trường Việt Nam"
                  fill
                  sizes="(max-width: 991px) 100vw, 54vw"
                />
              </div>
              <figcaption>
                Một bàn vận hành chung cho market, cộng đồng, creator và live ops.
              </figcaption>
            </figure>

            <div className="ab2-layer-stack">
              {OPERATING_LAYERS.map((layer) => (
                <article className="ab2-layer-card" key={layer.title}>
                  <div className="ab2-layer-media">
                    <Image src={layer.image} alt={layer.alt} fill sizes="(max-width: 767px) 100vw, 18vw" />
                  </div>
                  <div className="ab2-layer-copy">
                    <h3>{layer.title}</h3>
                    <p>{layer.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ab2-process" aria-label="Cách BlackHole làm việc">
          <div className="ab2-process-visual ab2-reveal" aria-hidden="true">
            <div className="ab2-process-visual-inner">
              <Image src={PROCESS_IMAGE} alt="" fill sizes="(max-width: 991px) 100vw, 38vw" />
              <div className="ab2-process-panel">
                <span>market</span>
                <span>community</span>
                <span>live ops</span>
              </div>
            </div>
          </div>

          <div className="ab2-process-copy">
            <div className="ab2-process-title ab2-reveal">
              <h2>từ tín hiệu thị trường thành nhịp vận hành.</h2>
              <p>
                BlackHole bắt đầu bằng việc hiểu người chơi đang cần gì, rồi biến tín hiệu đó thành kế hoạch ra mắt và live ops.
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
            <h2>nguyên tắc của một đối tác dài hạn.</h2>
            <p>
              Một thị trường mới không được mở bằng một banner đơn lẻ. Nó cần hệ điều hành đủ bền để sản phẩm sống cùng người chơi.
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
            <h2>portfolio là dấu vết của năng lực vận hành.</h2>
            <p>
              Game xuất hiện như bằng chứng thị trường. Điều quan trọng hơn là cách BlackHole đưa sản phẩm vào Việt Nam và giữ nhịp sau đó.
            </p>
          </div>

          <div className="ab2-proof-board">
            {PORTFOLIO_ACCENTS.map((item, index) => (
              <figure className={`ab2-proof-item ab2-proof-item-${index + 1} ab2-reveal`} key={item.title}>
                <div className="ab2-proof-media">
                  <Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 34vw" />
                </div>
                <figcaption>
                  <strong>{item.title}</strong>
                  <span>{item.copy}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="ab2-cta ab2-reveal">
          <div className="ab2-cta-copy">
            <h2>đưa game vào thị trường Việt Nam bằng một kế hoạch có lực.</h2>
            <p>BlackHole sẵn sàng trao đổi về phát hành, cộng đồng và live ops cho sản phẩm quốc tế.</p>
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
          text-transform: none;
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
          /* body sets text-transform:uppercase globally. Force lowercase here */
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

        .ab2-principles-head,
        .ab2-proof-copy {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(280px, 0.62fr);
          gap: clamp(28px, 5vw, 78px);
          align-items: end;
        }

        .ab2-section-head {
          max-width: 840px;
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

        .ab2-section-head p {
          margin-top: 24px;
          font-size: 1.08rem;
        }

        .ab2-layers {
          padding-top: clamp(80px, 10vh, 130px);
          padding-bottom: clamp(92px, 12vh, 156px);
        }

        .ab2-layer-showcase {
          margin-top: 56px;
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(360px, 0.88fr);
          gap: 20px;
          align-items: stretch;
        }

        .ab2-layer-hero {
          min-height: 720px;
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

        .ab2-layer-hero-media {
          position: relative;
          min-height: 0;
          overflow: hidden;
          background: #05040a;
        }

        .ab2-layer-hero figcaption {
          margin: 0;
          padding: 26px 28px;
          border-top: 1px solid rgba(176, 156, 255, 0.16);
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--font-title-extra, Arial, sans-serif);
          font-size: clamp(1.4rem, 2.2vw, 2.15rem);
          font-weight: 900;
          line-height: 1.08;
        }

        .ab2-layer-stack {
          display: grid;
          gap: 14px;
          align-content: stretch;
        }

        .ab2-layer-stack .ab2-layer-card {
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(132px, 0.4fr) minmax(0, 1fr);
          overflow: hidden;
          border-radius: var(--ab2-radius);
          border: 1px solid var(--ab2-line);
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.016)),
            rgba(13, 9, 28, 0.82);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
        }

        .ab2-layer-media {
          position: relative;
          min-height: 180px;
          overflow: hidden;
          background: #05040a;
        }

        .ab2-layer-hero-media img,
        .ab2-layer-media img,
        .ab2-process-thumb img,
        .ab2-proof-item img,
        .ab2-process-visual-inner img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(1.04) contrast(1.05) brightness(0.86);
          will-change: transform;
        }

        .ab2-layer-copy {
          padding: 24px;
          align-self: center;
        }

        .ab2-layer-copy h3 {
          margin-bottom: 12px;
          font-size: clamp(1.55rem, 2.1vw, 2.05rem);
          line-height: 1.04;
        }

        .ab2-layer-copy p {
          max-width: 42ch;
          font-size: 0.96rem;
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
          box-shadow: 0 32px 110px rgba(0, 0, 0, 0.34);
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
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          overflow: hidden;
        }

        .ab2-process-panel span {
          display: flex;
          align-items: center;
          min-height: 44px;
          padding: 0 14px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--ab2-radius);
          background: rgba(9, 6, 20, 0.78);
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 0.88rem;
          font-weight: 900;
          backdrop-filter: blur(14px);
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
          grid-template-columns: minmax(166px, 0.44fr) minmax(0, 1fr);
          gap: 24px;
          align-items: center;
          padding: 16px;
          border-radius: var(--ab2-radius);
          border: 1px solid var(--ab2-line);
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.012)),
            rgba(12, 8, 26, 0.86);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 64px rgba(0, 0, 0, 0.2);
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

        .ab2-process-card p {
          max-width: 52ch;
        }

        .ab2-principles {
          padding-top: clamp(86px, 11vh, 140px);
          padding-bottom: clamp(86px, 11vh, 140px);
        }

        .ab2-principle-rail {
          margin-top: 58px;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
          gap: 16px;
        }

        .ab2-principle-item {
          min-height: 250px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
          overflow: hidden;
          padding: 30px;
          border: 1px solid var(--ab2-line);
          border-radius: var(--ab2-radius);
          background:
            radial-gradient(circle at 0% 0%, rgba(159, 140, 255, 0.2), transparent 34%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.012)),
            rgba(10, 7, 22, 0.94);
        }

        .ab2-principle-item:nth-child(1) {
          grid-row: span 2;
          min-height: 520px;
        }

        .ab2-principle-item:nth-child(4) {
          grid-column: 1 / -1;
          min-height: 230px;
          background:
            linear-gradient(110deg, rgba(159, 140, 255, 0.18), transparent 42%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.052), rgba(255, 255, 255, 0.014)),
            rgba(10, 7, 22, 0.94);
        }

        .ab2-principle-item h3 {
          max-width: 11ch;
          font-size: clamp(2rem, 3vw, 3.1rem);
          line-height: 1.02;
        }

        .ab2-principle-item p {
          max-width: 50ch;
          font-size: 0.98rem;
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
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 18px;
        }

        .ab2-proof-item {
          margin: 0;
          display: grid;
          gap: 14px;
          border-radius: var(--ab2-radius);
          color: var(--ab2-text);
        }

        .ab2-proof-item-1 {
          grid-column: span 4;
        }

        .ab2-proof-item-2 {
          grid-column: span 2;
          padding-top: 54px;
        }

        .ab2-proof-item-3 {
          grid-column: 3 / -1;
        }

        .ab2-proof-media {
          position: relative;
          overflow: hidden;
          border-radius: var(--ab2-radius);
          border: 1px solid rgba(176, 156, 255, 0.22);
          background: #05040a;
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.34);
        }

        .ab2-proof-item-1 .ab2-proof-media {
          aspect-ratio: 16 / 9;
        }

        .ab2-proof-item-2 .ab2-proof-media {
          aspect-ratio: 4 / 5;
        }

        .ab2-proof-item-3 .ab2-proof-media {
          aspect-ratio: 16 / 8.4;
        }

        .ab2-proof-item figcaption {
          display: grid;
          gap: 8px;
          padding: 0 4px;
        }

        .ab2-proof-item figcaption strong {
          color: rgba(255, 255, 255, 0.94);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 0.9rem;
          font-weight: 900;
        }

        .ab2-proof-item figcaption span {
          max-width: 42ch;
          color: rgba(255, 255, 255, 0.66);
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .ab2-cta {
          padding-top: clamp(72px, 9vh, 110px);
          padding-bottom: clamp(104px, 14vh, 180px);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 34px;
          align-items: end;
          border-top: 1px solid rgba(176, 156, 255, 0.16);
        }

        .ab2-cta h2 {
          max-width: 17ch;
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

          .ab2-layer-hero,
          .ab2-process-visual {
            min-height: 480px;
          }

          .ab2-principle-rail {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab2-principle-item:nth-child(1) {
            min-height: 420px;
          }
        }

        @media (max-width: 991px) {
          .ab2-hero-sticky {
            padding-top: 100px;
          }

          .ab2-manifesto,
          .ab2-process,
          .ab2-principles-head,
          .ab2-proof,
          .ab2-cta {
            grid-template-columns: 1fr;
          }

          .ab2-manifesto {
            min-height: auto;
          }

          .ab2-layer-showcase {
            grid-template-columns: 1fr;
          }

          .ab2-layer-hero {
            min-height: 560px;
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

          .ab2-layer-showcase {
            margin-top: 34px;
            gap: 16px;
          }

          .ab2-layer-hero {
            min-height: auto;
          }

          .ab2-layer-hero-media {
            aspect-ratio: 4 / 5;
          }

          .ab2-layer-hero figcaption {
            padding: 22px;
            font-size: 1.55rem;
          }

          .ab2-layer-stack .ab2-layer-card {
            grid-template-columns: 1fr;
          }

          .ab2-layer-media {
            min-height: auto;
            aspect-ratio: 16 / 10;
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

          .ab2-principle-item:nth-child(1),
          .ab2-principle-item:nth-child(4) {
            grid-column: auto;
            grid-row: auto;
            min-height: auto;
          }

          .ab2-proof-board {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .ab2-proof-item {
            grid-column: auto;
            padding-top: 0;
          }

          .ab2-proof-item-1 .ab2-proof-media,
          .ab2-proof-item-2 .ab2-proof-media {
            aspect-ratio: 16 / 9;
          }

          .ab2-proof-item-3 .ab2-proof-media {
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
          .ab2-proof-media img,
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
