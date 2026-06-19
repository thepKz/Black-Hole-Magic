'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MISSION_LINES: ReactNode[] = [
  <>Chúng tôi đưa</>,
  <><span className="ab2-hl">game quốc tế</span> vào</>,
  <>đời sống của</>,
  <><span className="ab2-hl">người chơi Việt</span>.</>,
];

const OPERATING_STEPS = [
  {
    title: 'Sản phẩm',
    copy: 'Hiểu vòng chơi, điểm mạnh và rào cản bản địa trước khi lập kế hoạch phát hành.',
    image: '/assets/img/landing-page/list_game_doc/VLTK2.png',
    alt: 'Poster game Võ Lâm Truyền Kỳ 2',
  },
  {
    title: 'Người chơi',
    copy: 'Đọc hành vi, thói quen chi trả, kênh cộng đồng và lý do người chơi quyết định thử game.',
    image: '/assets/img/landing-page/list_game_doc/tieu-ngao-giang-ho.png',
    alt: 'Poster game Tiếu Ngạo Giang Hồ',
  },
  {
    title: 'Cộng đồng',
    copy: 'Kết nối bang hội, nhà sáng tạo nội dung, sự kiện và các điểm hẹn để cộng đồng có nhịp quay lại.',
    image: '/assets/img/landing-page/list_game_doc/kiem-the.png',
    alt: 'Poster game Kiếm Thế',
  },
  {
    title: 'Vận hành',
    copy: 'Theo dõi phản hồi, hỗ trợ người chơi, cập nhật nội dung và giữ sản phẩm không mất nhiệt sau ngày ra mắt.',
    image: '/assets/img/landing-page/list_game_doc/con-duong-to-lua.png',
    alt: 'Poster game Con Đường Tơ Lụa',
  },
];

const PROOF_ITEMS = [
  {
    title: 'Võ Lâm Truyền Kỳ 2',
    copy: 'Một sản phẩm kiếm hiệp cần được đọc bằng thói quen bang hội, chiến trường và cộng đồng lâu năm.',
    image: '/assets/img/landing-page/game/vltk.png',
    alt: 'Key art Võ Lâm Truyền Kỳ 2',
    aspect: 'landscape',
  },
  {
    title: 'Thiên Long Bát Bộ',
    copy: 'Danh mục nhiều nền tảng đòi hỏi thông điệp, lịch ra mắt và hỗ trợ người chơi thống nhất.',
    image: '/assets/img/landing-page/game/thien-long-bat-bo.png',
    alt: 'Key art Thiên Long Bát Bộ',
    aspect: 'landscape',
  },
  {
    title: 'Tru Tiên',
    copy: 'Poster dọc được giữ đúng tỉ lệ để hình ảnh không bị cắt sai hoặc mất trọng tâm.',
    image: '/assets/img/landing-page/list_game_doc/tru-tien.png',
    alt: 'Poster game Tru Tiên',
    aspect: 'portrait',
  },
  {
    title: 'Con Đường Tơ Lụa',
    copy: 'Sản phẩm có vòng lặp cộng đồng riêng cần cách vận hành riêng, không dùng một mẫu chung cho mọi game.',
    image: '/assets/img/landing-page/game/con-duong-to-lua.png',
    alt: 'Key art Con Đường Tơ Lụa',
    aspect: 'landscape',
  },
];

const TEAM_CAPABILITIES = [
  {
    title: 'Sản phẩm',
    copy: 'Chuyển mục tiêu của nhà phát triển thành kế hoạch phát hành có thể triển khai tại Việt Nam.',
  },
  {
    title: 'Người chơi',
    copy: 'Đọc tín hiệu từ hành vi, phản hồi, kênh nội dung và các rào cản trước ngày ra mắt.',
  },
  {
    title: 'Cộng đồng',
    copy: 'Tổ chức nhà sáng tạo nội dung, bang hội, mạng xã hội và sự kiện thành một nhịp giao tiếp rõ ràng.',
  },
  {
    title: 'Vận hành',
    copy: 'Giữ nhịp cập nhật, hỗ trợ và phản hồi sau ra mắt để sản phẩm có đời sống dài hơn.',
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

function MissionLines() {
  return (
    <>
      {MISSION_LINES.map((line, i) => (
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
          end: 'bottom bottom+=220',
          scrub: 0.15,
          invalidateOnRefresh: true,
        },
      });

      portalTl.to(
        '.ab2-portal-frame',
        { scale: 6.4, filter: 'brightness(1.08)', ease: 'none', duration: 1, force3D: false },
        0
      );
      portalTl.to(
        '.ab2-fixed-video',
        {
          scale: 1.08,
          xPercent: -1.4,
          yPercent: 1.2,
          filter: 'contrast(1.2) brightness(1) saturate(1.28)',
          ease: 'none',
          duration: 1.28,
          force3D: true,
        },
        0
      );
      portalTl.to(
        '.ab2-portal-frame',
        { autoAlpha: 0, filter: 'brightness(1.05) blur(10px)', duration: 0.28, ease: 'power2.in' },
        1
      );

      mm.add('(min-width: 768px)', () => {
        const hero = root.querySelector<HTMLElement>('.ab2-hero');
        const letterbox = root.querySelector<HTMLElement>('.ab2-letterbox');
        const fixedVideoWrap = root.querySelector<HTMLElement>('.ab2-fixed-video-wrap');
        const sectionBackdrop = root.querySelector<HTMLElement>('.ab2-section-backdrop');
        if (!hero || !letterbox || !fixedVideoWrap || !sectionBackdrop) return;

        const getHeroEndScroll = () => {
          const heroTop = hero.getBoundingClientRect().top + window.scrollY;
          return heroTop + hero.offsetHeight;
        };
        const getTargetRect = () => {
          const rect = letterbox.getBoundingClientRect();
          const targetScroll = getHeroEndScroll();
          return {
            left: rect.left,
            top: rect.top + window.scrollY - targetScroll,
            width: rect.width,
            height: rect.height,
          };
        };

        gsap.set(fixedVideoWrap, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          width: '100vw',
          height: '100vh',
          transformOrigin: '0 0',
          '--ab2-fixed-vignette': 0.22,
          clipPath: 'inset(0% round 0px)',
        });
        gsap.set(sectionBackdrop, { autoAlpha: 0, yPercent: 2, scale: 1.02 });
        gsap.set(letterbox, { autoAlpha: 0 });

        const morphTl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        });

        morphTl
          .to(
            sectionBackdrop,
            {
              autoAlpha: 1,
              yPercent: 0,
              scale: 1,
              duration: 0.38,
              ease: 'power2.out',
            },
            0
          )
          .to(
            fixedVideoWrap,
            {
              autoAlpha: 1,
              '--ab2-fixed-vignette': 0.42,
              filter: 'brightness(0.82) saturate(1.08) blur(0px)',
              duration: 0.32,
              ease: 'power2.out',
            },
            0
          )
          .to(
            fixedVideoWrap,
            {
              clipPath: 'ellipse(100% 100% at 50% 50%)',
              duration: 0.14,
              ease: 'power1.out',
            },
            0
          )
          .to(
            fixedVideoWrap,
            {
              clipPath: 'ellipse(73% 62% at 50% 50%)',
              duration: 0.34,
              ease: 'power1.inOut',
            },
            0.52
          )
          .fromTo(
            fixedVideoWrap,
            {
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
            },
            {
              x: () => getTargetRect().left,
              y: () => getTargetRect().top,
              scaleX: () => getTargetRect().width / window.innerWidth,
              scaleY: () => getTargetRect().height / window.innerHeight,
              duration: 0.68,
              ease: 'power2.inOut',
            },
            0.18
          )
          .to(letterbox, { autoAlpha: 1, duration: 0.06, ease: 'none' }, 0.94)
          .to(fixedVideoWrap, { autoAlpha: 0, duration: 0.04, ease: 'none' }, 0.96);

        return () => {
          morphTl.scrollTrigger?.kill();
          morphTl.kill();
        };
      });

      const lineTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.ab2-manifesto',
          start: 'top 70%',
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
          stagger: 0.14,
        },
        0
      );

      lineTl.fromTo(
        '.ab2-manifesto-copy',
        { letterSpacing: '0.035em', y: 14 },
        { letterSpacing: '0em', y: 0, ease: 'power2.out', duration: 0.6 },
        0.2
      );

      gsap.fromTo(
        '.ab2-letterbox-video',
        { yPercent: -5, scale: 1.08 },
        {
          yPercent: 5,
          scale: 1.14,
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
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 84%', once: true },
          }
        );
      });

      gsap.fromTo(
        '.ab2-final-ring, .ab2-final-core',
        { autoAlpha: 0, scale: 0.72, rotate: -7 },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: '.ab2-final-contact',
            start: 'top 82%',
            once: true,
          },
        }
      );

      mm.add('(min-width: 992px)', () => {
        const visuals = gsap.utils.toArray<HTMLElement>('.ab2-story-visual');
        const steps = gsap.utils.toArray<HTMLElement>('.ab2-story-step');
        const copies = steps
          .map((step) => step.querySelector<HTMLElement>('.ab2-step-copy'))
          .filter((copy): copy is HTMLElement => Boolean(copy));

        gsap.set(visuals, { autoAlpha: 0, yPercent: 10, scale: 0.975, filter: 'blur(5px)' });
        gsap.set(copies, { autoAlpha: 0, y: 28, filter: 'blur(4px)' });

        copies.forEach((copy) => {
          gsap.set(gsap.utils.toArray<HTMLElement>('.ab2-step-index, h3, p', copy), { autoAlpha: 0, y: 12 });
        });

        const storyTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.ab2-story-layout',
            start: 'top 112px',
            end: () => `+=${steps.length * window.innerHeight * 0.78}`,
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        steps.forEach((step, index) => {
          const visual = visuals[index];
          const copy = step.querySelector<HTMLElement>('.ab2-step-copy');
          if (!visual || !copy) return;

          const pieces = gsap.utils.toArray<HTMLElement>('.ab2-step-index, h3, p', copy);
          const at = index * 0.92;

          storyTimeline
            .to(visual, { autoAlpha: 1, yPercent: 0, scale: 1, filter: 'blur(0px)', duration: 0.34, ease: 'power2.out' }, at)
            .to(copy, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.34, ease: 'power2.out' }, at + 0.04)
            .to(pieces, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }, at + 0.08)
            .to(visual, { autoAlpha: 1, yPercent: -2, scale: 1.012, filter: 'blur(0px)', duration: 0.32, ease: 'none' }, at + 0.36)
            .to(copy, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.32, ease: 'none' }, at + 0.36);

          if (index < steps.length - 1) {
            storyTimeline
              .to(visual, { autoAlpha: 0, yPercent: -10, scale: 1.018, filter: 'blur(5px)', duration: 0.28, ease: 'power2.in' }, at + 0.68)
              .to(copy, { autoAlpha: 0, y: -22, filter: 'blur(4px)', duration: 0.28, ease: 'power2.in' }, at + 0.68)
              .to(pieces, { autoAlpha: 0, y: -8, duration: 0.22, stagger: 0.03, ease: 'power2.in' }, at + 0.68);
          }
        });

        const proofTweens = gsap.utils.toArray<HTMLElement>('.ab2-proof-card').map((card) =>
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 44, scale: 0.985 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 86%', once: true },
            }
          )
        );

        const mapTween = gsap.fromTo(
          '.ab2-capability-rail',
          { '--map-progress': 0 },
          {
            '--map-progress': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.ab2-capability-map',
              start: 'top 72%',
              end: 'bottom 48%',
              scrub: 0.9,
            },
          }
        );

        const backdropTween = gsap.to('.ab2-content-backdrop', {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: '.ab2-content',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          storyTimeline.scrollTrigger?.kill();
          storyTimeline.kill();
          proofTweens.forEach((tween) => {
            tween.scrollTrigger?.kill();
            tween.kill();
          });
          mapTween.scrollTrigger?.kill();
          backdropTween.scrollTrigger?.kill();
          mapTween.kill();
          backdropTween.kill();
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
      <div className="ab2-section-backdrop" aria-hidden="true" />

      <div className="ab2-fixed-video-wrap" aria-hidden="true">
        <video
          className="ab2-fixed-video ab2-motion-video"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
        >
          <PortalVideoSources />
        </video>
      </div>

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
        <div className="ab2-portal-bridge" aria-hidden="true" />
        <div className="ab2-content-backdrop" aria-hidden="true" />

        <section className="ab2-manifesto">
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
              <MissionLines />
            </p>
          </div>

          <p className="ab2-manifesto-note">
            BlackHole là đối tác bản địa cho nhà phát triển game quốc tế cần bước vào Việt Nam bằng hiểu biết thị trường, cộng đồng và vận hành sau ra mắt.
          </p>
        </section>

        <section className="ab2-scroll-story" aria-label="Cách BlackHole vận hành sản phẩm">
          <div className="ab2-story-head ab2-reveal">
            <h2>Từ chuẩn bị ra mắt đến vận hành dài hạn.</h2>
           
          </div>

          <div className="ab2-story-layout">
            <div className="ab2-story-visual-col" aria-hidden="true">
              <div className="ab2-story-visuals">
                {OPERATING_STEPS.map((step) => (
                  <figure className="ab2-story-visual" key={step.title}>
                    <Image className="ab2-story-visual-poster" src={step.image} alt="" fill sizes="(max-width: 991px) 100vw, 32vw" />
                  </figure>
                ))}
              </div>
            </div>

            <div className="ab2-story-list">
              {OPERATING_STEPS.map((step, index) => (
                <article className="ab2-story-step" key={step.title}>
                  <figure className="ab2-step-inline-media">
                    <Image className="ab2-step-media-poster" src={step.image} alt={step.alt} fill sizes="100vw" />
                  </figure>
                  <div className="ab2-step-copy">
                    <span className="ab2-step-index">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ab2-proof-gallery" aria-label="Danh mục game làm bằng chứng năng lực">
          <div className="ab2-proof-head ab2-reveal">
            <h2>Bằng chứng nằm trong cách game được giữ đúng nhịp.</h2>
            <p>
              Ảnh game được đặt đúng tỉ lệ để nhìn rõ sản phẩm. Điều quan trọng hơn là mỗi sản phẩm có một cách vào thị trường riêng.
            </p>
          </div>

          <div className="ab2-proof-grid">
            {PROOF_ITEMS.map((item) => (
              <figure className={`ab2-proof-card ab2-proof-card--${item.aspect}`} key={item.title}>
                <div className={`ab2-proof-media ab2-proof-media--${item.aspect}`}>
                  <Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 42vw" />
                </div>
                <figcaption>
                  <strong>{item.title}</strong>
                  <span>{item.copy}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="ab2-capability-map" aria-label="Đội ngũ vận hành của BlackHole">
          <div className="ab2-capability-head ab2-reveal">
            <h2>Đội ngũ vận hành như một phòng điều phối.</h2>
            <p>
              Không tách rời phát hành, cộng đồng và hỗ trợ. Các nhóm cùng đọc một tín hiệu để phản ứng nhanh hơn.
            </p>
          </div>

          <div className="ab2-capability-rail">
            {TEAM_CAPABILITIES.map((capability) => (
              <article className="ab2-capability-item ab2-reveal" key={capability.title}>
                <h3>{capability.title}</h3>
                <p>{capability.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ab2-final-contact ab2-reveal">
          <div className="ab2-final-portal" aria-hidden="true">
            <span className="ab2-final-ring ab2-final-ring-a" />
            <span className="ab2-final-ring ab2-final-ring-b" />
            <span className="ab2-final-core" />
          </div>
          <div className="ab2-final-copy">
            <h2>Sẵn sàng đưa game vào Việt Nam đúng cách.</h2>
            <p>Bắt đầu bằng một buổi trao đổi về sản phẩm, người chơi và kế hoạch vận hành.</p>
          </div>
          <div className="ab2-actions">
            <Link className="ab2-btn ab2-btn-primary" href="/contact">
              Bắt đầu trao đổi
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
          --ab2-panel: rgba(14, 10, 30, 0.82);
          --ab2-panel-strong: rgba(18, 12, 38, 0.92);
          --ab2-text: rgba(255, 255, 255, 0.96);
          --ab2-soft: rgba(255, 255, 255, 0.74);
          --ab2-muted: rgba(255, 255, 255, 0.54);
          --ab2-line: rgba(194, 180, 255, 0.22);
          --ab2-accent: #9f8cff;
          --ab2-accent-strong: #c2b4ff;
          --ab2-radius: 10px;
          --ab2-ring-x: 50%;
          --ab2-ring-y: 39.5%;
          --ab2-frame-y-offset: -26px;
          position: relative;
          color: var(--ab2-text);
          background: var(--ab2-bg);
          font-family: var(--font-body-regular, Arial, sans-serif);
          text-transform: none;
        }

        html:has(.ab2-root),
        body:has(.ab2-root) {
          overflow-x: hidden;
        }

        .ab2-root section {
          background: transparent !important;
          background-color: transparent !important;
        }

        .ab2-root::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: #08060f;
        }

        .ab2-section-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          background:
            radial-gradient(ellipse 86% 44% at 50% 12%, rgba(159, 140, 255, 0.22), rgba(73, 34, 170, 0.1) 46%, transparent 78%),
            radial-gradient(ellipse 60% 42% at 76% 28%, rgba(159, 140, 255, 0.12), transparent 70%),
            linear-gradient(180deg, rgba(19, 11, 48, 0.74) 0%, rgba(8, 6, 15, 0.96) 54%, #08060f 100%);
          will-change: transform, opacity;
        }

        .ab2-section-backdrop::before,
        .ab2-section-backdrop::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .ab2-section-backdrop::before {
          background:
            linear-gradient(90deg, rgba(194, 180, 255, 0.07) 1px, transparent 1px),
            linear-gradient(180deg, rgba(194, 180, 255, 0.055) 1px, transparent 1px);
          background-size: 96px 96px;
          opacity: 0.58;
          -webkit-mask-image: radial-gradient(ellipse 82% 68% at 50% 38%, black 0%, rgba(0, 0, 0, 0.72) 62%, transparent 100%);
          mask-image: radial-gradient(ellipse 82% 68% at 50% 38%, black 0%, rgba(0, 0, 0, 0.72) 62%, transparent 100%);
        }

        .ab2-section-backdrop::after {
          background:
            radial-gradient(circle at 44% 58%, transparent 0 15%, rgba(194, 180, 255, 0.18) 16%, rgba(159, 140, 255, 0.06) 21%, transparent 28%),
            radial-gradient(circle at 44% 58%, transparent 0 27%, rgba(87, 56, 186, 0.14) 28%, rgba(194, 180, 255, 0.06) 32%, transparent 40%),
            conic-gradient(from 226deg at 44% 58%, transparent 0deg, rgba(159, 140, 255, 0.18) 54deg, transparent 112deg, rgba(61, 36, 142, 0.2) 206deg, transparent 292deg, rgba(194, 180, 255, 0.12) 332deg, transparent 360deg),
            radial-gradient(ellipse 72% 44% at 44% 58%, rgba(159, 140, 255, 0.16), rgba(47, 24, 116, 0.1) 46%, transparent 72%),
            radial-gradient(ellipse 42% 26% at 18% 34%, rgba(159, 140, 255, 0.1), transparent 72%),
            linear-gradient(180deg, transparent 0%, rgba(8, 6, 15, 0.28) 72%, rgba(8, 6, 15, 0.86) 100%);
          filter: blur(12px);
          opacity: 0.9;
        }

        .ab2-fixed-video-wrap {
          --ab2-fixed-vignette: 0.22;
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          overflow: hidden;
          pointer-events: none;
          transform: none;
          transform-origin: 0 0;
          visibility: visible;
          background: #08060f;
          will-change: transform, opacity, filter, clip-path;
        }

        .ab2-fixed-video-wrap::before,
        .ab2-fixed-video-wrap::after {
          content: '';
          position: absolute;
          pointer-events: none;
        }

        .ab2-fixed-video-wrap::before {
          inset: 0;
          z-index: 2;
          background:
            radial-gradient(ellipse 118% 96% at 50% 46%, transparent 0%, rgba(5, 3, 12, 0.1) 46%, rgba(5, 3, 12, 0.42) 80%, rgba(5, 3, 12, 0.72) 100%),
            linear-gradient(180deg, rgba(5, 3, 12, 0.12) 0%, rgba(5, 3, 12, 0.16) 34%, rgba(5, 3, 12, 0.34) 55%, rgba(5, 3, 12, 0.68) 73%, rgba(5, 3, 12, 0.86) 100%);
        }

        .ab2-fixed-video-wrap::after {
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse 86% 78% at 50% 50%, transparent 0%, rgba(5, 3, 12, 0.04) 52%, rgba(5, 3, 12, var(--ab2-fixed-vignette)) 100%),
            linear-gradient(180deg, rgba(5, 3, 12, calc(var(--ab2-fixed-vignette) * 0.34)) 0%, rgba(5, 3, 12, 0.05) 38%, rgba(5, 3, 12, calc(var(--ab2-fixed-vignette) * 0.24)) 74%, rgba(5, 3, 12, calc(var(--ab2-fixed-vignette) * 0.62)) 100%);
        }

        .ab2-fixed-video {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          filter: contrast(1.18) brightness(0.96) saturate(1.22);
          transform-origin: center center;
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
          overflow: visible;
          isolation: isolate;
          background: transparent;
        }

        .ab2-portal-bridge {
          display: none;
        }

        .ab2-content-backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background:
            linear-gradient(90deg, rgba(194, 180, 255, 0.07) 1px, transparent 1px),
            linear-gradient(180deg, rgba(194, 180, 255, 0.055) 1px, transparent 1px),
            linear-gradient(115deg, transparent 0%, rgba(159, 140, 255, 0.09) 42%, transparent 66%),
            radial-gradient(ellipse 56rem 28rem at 76% 22%, rgba(159, 140, 255, 0.16), transparent 68%);
          background-size: 96px 96px, 96px 96px, 100% 100%, 100% 100%;
          -webkit-mask-image: linear-gradient(180deg, transparent 0, transparent 360px, rgba(0, 0, 0, 0.52) 620px, black 900px, black calc(100% - 420px), transparent 100%);
          mask-image: linear-gradient(180deg, transparent 0, transparent 360px, rgba(0, 0, 0, 0.52) 620px, black 900px, black calc(100% - 420px), transparent 100%);
          opacity: 0.68;
        }

        .ab2-content > section {
          position: relative;
          z-index: 1;
        }

        .ab2-content-backdrop::before,
        .ab2-content-backdrop::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .ab2-content-backdrop::before {
          background:
            radial-gradient(ellipse 48% 24% at 16% 28%, rgba(159, 140, 255, 0.08), transparent 72%),
            radial-gradient(ellipse 34% 42% at 84% 34%, rgba(8, 6, 15, 0.58), transparent 76%);
          opacity: 0.7;
        }

        .ab2-content-backdrop::after {
          background:
            repeating-linear-gradient(0deg, transparent 0 22px, rgba(194, 180, 255, 0.035) 23px 24px),
            radial-gradient(ellipse 60% 42% at 52% 20%, rgba(72, 42, 172, 0.22), transparent 70%);
          opacity: 0.28;
        }

        .ab2-content h2,
        .ab2-content h3,
        .ab2-content p,
        .ab2-content span,
        .ab2-content strong,
        .ab2-content a {
          text-transform: none;
        }

        .ab2-content h2,
        .ab2-content h3 {
          margin: 0;
          color: #f8f5ff;
          font-family: var(--font-title-extra, Arial, sans-serif);
          font-weight: 900;
          letter-spacing: 0;
        }

        .ab2-content p {
          margin: 0;
          color: var(--ab2-soft);
          font-family: 'Chakra Petch', var(--font-body-regular, Arial, sans-serif);
          font-weight: 500;
          letter-spacing: 0.005em;
          font-size: 1rem;
          line-height: 1.72;
          text-align: left;
        }

        .ab2-manifesto,
        .ab2-scroll-story,
        .ab2-proof-gallery,
        .ab2-capability-map,
        .ab2-final-contact {
          width: min(100%, 1360px);
          margin: 0 auto;
          padding-left: clamp(20px, 5vw, 80px);
          padding-right: clamp(20px, 5vw, 80px);
          scroll-margin-top: 96px;
        }

        .ab2-manifesto {
          min-height: 100dvh;
          padding-top: clamp(100px, 13vh, 168px);
          padding-bottom: clamp(86px, 11vh, 140px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(24px, 4vw, 46px);
        }

        .ab2-manifesto-stage {
          position: relative;
          width: min(100%, 1180px);
          isolation: isolate;
        }

        .ab2-manifesto-stage::before,
        .ab2-manifesto-stage::after {
          content: '';
          position: absolute;
          pointer-events: none;
          z-index: -1;
        }

        .ab2-manifesto-stage::before {
          inset: -24% -9%;
          background:
            radial-gradient(ellipse 68% 50% at 48% 48%, rgba(174, 151, 255, 0.18), transparent 70%),
            radial-gradient(ellipse 88% 74% at 50% 50%, rgba(8, 6, 15, 0.64), transparent 78%);
          filter: blur(26px);
          opacity: 0.95;
        }

        .ab2-manifesto-stage::after {
          inset: -2% -4%;
          background: radial-gradient(ellipse 76% 56% at 48% 48%, transparent 46%, rgba(5, 3, 12, 0.78) 74%, transparent 90%);
          filter: blur(24px);
        }

        .ab2-letterbox {
          --ab2-media-mask: radial-gradient(ellipse 58% 52% at 45% 53%, black 0%, black 42%, rgba(0, 0, 0, 0.54) 58%, rgba(0, 0, 0, 0.14) 72%, transparent 86%);
          position: relative;
          width: 100%;
          aspect-ratio: 2.39 / 1;
          overflow: visible;
          background: transparent;
          box-shadow: none;
          -webkit-mask-image: var(--ab2-media-mask);
          mask-image: var(--ab2-media-mask);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
        }

        .ab2-letterbox::before,
        .ab2-letterbox::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .ab2-letterbox::before {
          background:
            radial-gradient(ellipse 58% 48% at 50% 46%, transparent 0%, transparent 50%, rgba(5, 3, 12, 0.54) 74%, rgba(5, 3, 12, 0.94) 100%),
            linear-gradient(120deg, rgba(5, 3, 12, 0.22), transparent 28%, transparent 72%, rgba(5, 3, 12, 0.34));
          -webkit-mask-image: var(--ab2-media-mask);
          mask-image: var(--ab2-media-mask);
        }

        .ab2-letterbox::after {
          inset: 0;
          background:
            linear-gradient(105deg, rgba(7, 5, 15, 0.38) 0%, transparent 34%, transparent 66%, rgba(7, 5, 15, 0.44) 100%),
            radial-gradient(ellipse 96% 82% at 50% 50%, transparent 0%, transparent 56%, rgba(8, 6, 15, 0.64) 100%);
          -webkit-mask-image: var(--ab2-media-mask);
          mask-image: var(--ab2-media-mask);
        }

        .ab2-letterbox-video {
          position: absolute;
          inset: -14% -10%;
          width: 120%;
          height: 128%;
          object-fit: cover;
          object-position: center center;
          filter: contrast(1.18) brightness(0.76) saturate(1.2);
          will-change: transform;
          -webkit-mask-image: var(--ab2-media-mask);
          mask-image: var(--ab2-media-mask);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
        }

        .ab2-letterbox-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(8, 6, 15, 0.82) 0%, rgba(8, 6, 15, 0.16) 18%, rgba(8, 6, 15, 0.08) 66%, rgba(8, 6, 15, 0.86) 100%),
            linear-gradient(105deg, rgba(7, 5, 15, 0.9) 0%, rgba(7, 5, 15, 0.48) 48%, rgba(7, 5, 15, 0.2) 74%),
            linear-gradient(0deg, rgba(7, 5, 15, 0.66), rgba(7, 5, 15, 0.08) 62%);
          -webkit-mask-image: var(--ab2-media-mask);
          mask-image: var(--ab2-media-mask);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
        }

        .ab2-manifesto-copy {
          position: absolute;
          left: clamp(20px, 4vw, 56px);
          right: clamp(20px, 4vw, 56px);
          bottom: clamp(22px, 5vh, 56px);
          margin: 0;
          display: flex;
          flex-direction: column;
          z-index: 3;
        }

        .ab2-line {
          display: block;
          overflow: hidden;
          padding: 0.12em 0.06em;
          margin: -0.12em -0.06em;
          font-size: clamp(2.1rem, 5vw, 4.2rem);
          line-height: 1.05;
        }

        .ab2-line-inner {
          display: block;
          color: #fff;
          font-family: var(--font-title-extra, Arial, sans-serif);
          font-weight: 900;
          letter-spacing: 0;
          text-wrap: balance;
          text-shadow: 0 2px 24px rgba(0, 0, 0, 0.72), 0 0 42px rgba(0, 0, 0, 0.36);
          will-change: transform, opacity;
        }

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
          max-width: 66ch;
          color: rgba(255, 255, 255, 0.86);
          font-size: 1.04rem;
          line-height: 1.8;
          text-shadow: 0 14px 38px rgba(0, 0, 0, 0.58);
        }

        .ab2-story-head,
        .ab2-proof-head,
        .ab2-capability-head {
          max-width: 820px;
        }

        .ab2-story-head h2,
        .ab2-proof-head h2,
        .ab2-capability-head h2,
        .ab2-final-contact h2 {
          max-width: 13ch;
          font-size: clamp(2.75rem, 5.4vw, 5.4rem);
          line-height: 1;
          text-wrap: balance;
        }

        .ab2-story-head p,
        .ab2-proof-head p,
        .ab2-capability-head p,
        .ab2-final-contact p {
          margin-top: 22px;
          max-width: 62ch;
          font-size: 1.05rem;
        }

        .ab2-scroll-story {
          padding-top: clamp(80px, 10vh, 132px);
          padding-bottom: clamp(92px, 13vh, 164px);
        }

        .ab2-story-layout {
          margin-top: clamp(46px, 6vw, 78px);
          display: grid;
          grid-template-columns: minmax(360px, 0.82fr) minmax(0, 0.96fr);
          gap: clamp(34px, 6vw, 88px);
          align-items: center;
          min-height: min(680px, 72vh);
        }

        .ab2-story-visual-col {
          position: relative;
          display: flex;
          align-items: center;
          min-height: min(680px, 72vh);
        }

        .ab2-story-visuals {
          position: relative;
          width: 100%;
          height: min(680px, 72vh);
          overflow: visible;
          background: transparent;
        }

        .ab2-story-visual {
          position: absolute;
          inset: 0;
          margin: 0;
          overflow: visible;
          background: transparent;
        }

        .ab2-story-visual-poster,
        .ab2-step-media-poster,
        .ab2-proof-media img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain !important;
          object-position: center center;
          filter: saturate(1.03) contrast(1.05) brightness(0.92);
        }

        .ab2-story-list {
          position: relative;
          min-height: min(680px, 72vh);
          align-self: stretch;
        }

        .ab2-story-step {
          position: absolute;
          inset: 0;
          min-height: 0;
          display: flex;
          align-items: center;
        }

        .ab2-step-copy {
          position: relative;
          width: 100%;
          padding: clamp(26px, 3vw, 38px) 0 clamp(28px, 3vw, 40px);
          border-top: 0;
        }

        .ab2-step-copy::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: min(68%, 520px);
          height: 1px;
          background: linear-gradient(90deg, rgba(5, 3, 12, 0.92), rgba(159, 140, 255, 0.24) 56%, transparent 100%);
          opacity: 0.86;
        }

        .ab2-step-index {
          display: block;
          margin-bottom: 20px;
          color: var(--ab2-accent-strong);
          font-family: var(--font-subtitle-krafting, Arial, sans-serif);
          font-size: 0.88rem;
          font-weight: 900;
        }

        .ab2-step-copy h3 {
          margin-bottom: 16px;
          font-size: clamp(2.4rem, 5vw, 5rem);
          line-height: 0.98;
        }

        .ab2-step-copy p {
          max-width: 48ch;
          font-size: 1.04rem;
        }

        .ab2-step-inline-media {
          display: none;
          position: relative;
          width: 100%;
          aspect-ratio: 1122 / 1402;
          margin: 0 0 22px;
          overflow: visible;
          background: transparent;
        }

        .ab2-proof-gallery {
          padding-top: clamp(80px, 10vh, 132px);
          padding-bottom: clamp(86px, 12vh, 150px);
        }

        .ab2-proof-grid {
          margin-top: clamp(42px, 6vw, 76px);
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 20px;
          align-items: start;
        }

        .ab2-proof-card {
          margin: 0;
          display: grid;
          gap: 16px;
        }

        .ab2-proof-card--landscape {
          grid-column: span 7;
        }

        .ab2-proof-card--portrait {
          grid-column: span 5;
        }

        .ab2-proof-card:nth-child(2) {
          padding-top: 8%;
        }

        .ab2-proof-card:nth-child(4) {
          grid-column: 4 / -1;
        }

        .ab2-proof-media {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.008)),
            #06040d;
          box-shadow:
            inset 0 0 0 1px rgba(194, 180, 255, 0.16),
            0 28px 82px rgba(0, 0, 0, 0.28);
        }

        .ab2-proof-media--landscape {
          aspect-ratio: 1672 / 941;
        }

        .ab2-proof-media--portrait {
          aspect-ratio: 1122 / 1402;
        }

        .ab2-proof-card figcaption {
          display: grid;
          gap: 8px;
          padding: 0 2px;
        }

        .ab2-proof-card figcaption strong {
          color: rgba(255, 255, 255, 0.94);
          font-family: var(--font-title-extra, Arial, sans-serif);
          font-size: clamp(1.3rem, 2.2vw, 2rem);
          line-height: 1.05;
        }

        .ab2-proof-card figcaption span {
          max-width: 50ch;
          color: rgba(255, 255, 255, 0.68);
          font-family: 'Chakra Petch', var(--font-body-regular, Arial, sans-serif);
          font-weight: 500;
          font-size: 0.95rem;
          line-height: 1.65;
        }

        .ab2-capability-map {
          padding-top: clamp(82px, 10vh, 136px);
          padding-bottom: clamp(86px, 12vh, 150px);
        }

        .ab2-capability-rail {
          --map-progress: 0;
          position: relative;
          margin-top: clamp(44px, 6vw, 74px);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0;
          border-top: 1px solid rgba(194, 180, 255, 0.2);
        }

        .ab2-capability-rail::before {
          content: '';
          position: absolute;
          left: 0;
          top: -1px;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(194, 180, 255, 0.86), transparent);
          transform: scaleX(var(--map-progress));
          transform-origin: left;
        }

        .ab2-capability-item {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 34px;
          padding: 28px clamp(18px, 2.4vw, 34px) 0 0;
        }

        .ab2-capability-item + .ab2-capability-item {
          padding-left: clamp(18px, 2.4vw, 34px);
          border-left: 1px solid rgba(194, 180, 255, 0.13);
        }

        .ab2-capability-item h3 {
          font-size: clamp(1.9rem, 3.1vw, 3.1rem);
          line-height: 1;
        }

        .ab2-capability-item p {
          max-width: 32ch;
          font-size: 0.98rem;
        }

        .ab2-final-contact {
          position: relative;
          min-height: min(760px, 82dvh);
          /* balanced padding so the centered closing scene doesn't sit high */
          padding-top: clamp(96px, 13vh, 168px);
          padding-bottom: clamp(96px, 13vh, 168px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(28px, 4vw, 44px);
          text-align: center;
          isolation: isolate;
          overflow: hidden;
        }

        .ab2-final-contact::before,
        .ab2-final-contact::after {
          content: '';
          position: absolute;
          pointer-events: none;
          z-index: -2;
        }

        .ab2-final-contact::before {
          /* full-height now (was 6% from top) + a top-darkening band so the
             section above no longer bleeds into the closing portal scene */
          inset: 0 -10%;
          background:
            radial-gradient(ellipse 70% 52% at 50% 54%, rgba(159, 140, 255, 0.22), transparent 70%),
            linear-gradient(180deg, rgba(8, 6, 15, 0.96) 0%, rgba(9, 6, 20, 0.5) 16%, transparent 36%, rgba(9, 6, 20, 0.62) 76%, rgba(8, 6, 15, 0.96) 100%);
          filter: blur(10px);
        }

        .ab2-final-contact::after {
          left: 50%;
          top: 50%;
          width: min(1120px, 112vw);
          aspect-ratio: 1 / 1;
          transform: translate(-50%, -47%);
          background:
            radial-gradient(circle at 50% 50%, rgba(8, 6, 15, 0.98) 0 22%, rgba(81, 48, 186, 0.24) 23% 34%, transparent 35%),
            repeating-radial-gradient(circle at 50% 50%, transparent 0 88px, rgba(194, 180, 255, 0.11) 90px 91px, transparent 93px 158px);
          opacity: 0.58;
          -webkit-mask-image: radial-gradient(circle, black 0%, black 54%, transparent 74%);
          mask-image: radial-gradient(circle, black 0%, black 54%, transparent 74%);
        }

        .ab2-final-portal {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: -1;
          width: min(860px, 90vw);
          aspect-ratio: 1 / 1;
          transform: translate(-50%, -52%);
          pointer-events: none;
        }

        .ab2-final-ring,
        .ab2-final-core {
          position: absolute;
          border-radius: 50%;
          inset: 0;
          opacity: 0;
          will-change: transform, opacity;
        }

        .ab2-final-ring-a {
          background:
            radial-gradient(circle at 50% 50%, transparent 35%, rgba(194, 180, 255, 0.24) 43%, rgba(159, 140, 255, 0.13) 50%, transparent 64%),
            conic-gradient(from 210deg, transparent, rgba(194, 180, 255, 0.26), transparent 34%, rgba(116, 84, 255, 0.24), transparent 68%, rgba(194, 180, 255, 0.16), transparent);
          filter: blur(1px);
        }

        .ab2-final-ring-b {
          inset: 11%;
          background:
            radial-gradient(circle at 50% 50%, transparent 44%, rgba(194, 180, 255, 0.18) 49%, transparent 57%),
            conic-gradient(from 24deg, transparent, rgba(159, 140, 255, 0.2), transparent 28%, rgba(194, 180, 255, 0.18), transparent 72%);
          filter: blur(10px);
        }

        .ab2-final-core {
          inset: 24%;
          background: radial-gradient(circle at 50% 50%, rgba(8, 6, 15, 0.94) 0 32%, rgba(159, 140, 255, 0.24) 45%, transparent 72%);
          filter: blur(4px);
        }

        .ab2-final-copy {
          position: relative;
          z-index: 1;
          display: grid;
          justify-items: center;
        }

        .ab2-final-contact h2 {
          /* sized to sit INSIDE the portal ring (min(860px,90vw)); was 7.6rem
             which overflowed the ring on wide screens */
          max-width: 12ch;
          font-size: clamp(2.6rem, 4.6vw, 4.8rem);
          line-height: 1;
          text-shadow:
            0 0 22px rgba(159, 140, 255, 0.18),
            0 18px 48px rgba(0, 0, 0, 0.6);
        }

        .ab2-final-contact p {
          max-width: 58ch;
          color: rgba(255, 255, 255, 0.8);
        }

        .ab2-actions {
          position: relative;
          z-index: 1;
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
          padding: 0 26px;
          border-radius: 999px;
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
          color: #fff !important;
          box-shadow:
            0 18px 46px rgba(95, 54, 219, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.26);
        }

        .ab2-btn-primary:hover {
          transform: translateY(-2px);
          color: #fff !important;
          background: linear-gradient(135deg, #b9acff, #6d46ec);
        }

        .ab2-btn-secondary {
          border: 1px solid rgba(194, 180, 255, 0.36);
          color: #f7f3ff !important;
          background: rgba(14, 10, 30, 0.58);
        }

        .ab2-btn-secondary:hover {
          transform: translateY(-2px);
          border-color: rgba(194, 180, 255, 0.72);
          background: rgba(159, 140, 255, 0.14);
        }

        @media (max-width: 1199px) {
          .ab2-story-head h2,
          .ab2-proof-head h2,
          .ab2-capability-head h2,
          .ab2-final-contact h2 {
            font-size: clamp(2.45rem, 5.2vw, 4.4rem);
          }

          .ab2-story-layout {
            grid-template-columns: minmax(300px, 0.78fr) minmax(0, 1fr);
          }
        }

        @media (max-width: 991px) {
          .ab2-hero-sticky {
            padding-top: 100px;
          }

          .ab2-story-layout {
            grid-template-columns: 1fr;
          }

          .ab2-story-visual-col,
          .ab2-story-visuals {
            display: none;
          }

          .ab2-story-list {
            min-height: 0;
            display: grid;
            gap: 20px;
          }

          .ab2-story-step {
            position: static;
            inset: auto;
            min-height: auto;
            display: block;
          }

          .ab2-step-inline-media {
            display: block;
          }

          .ab2-proof-card--landscape,
          .ab2-proof-card--portrait,
          .ab2-proof-card:nth-child(4) {
            grid-column: span 6;
          }

          .ab2-capability-rail {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab2-capability-item:nth-child(3) {
            border-left: 0;
          }

          .ab2-actions {
            justify-content: center;
          }
        }

        @media (max-width: 767px) {
          .ab2-fixed-video-wrap {
            position: absolute;
            height: 100dvh;
            transform: none !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          .ab2-fixed-video {
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
              linear-gradient(180deg, rgba(52, 25, 129, 0.34) 0%, rgba(8, 6, 15, 0.88) 150px, #08060f 360px),
              #08060f;
          }

          .ab2-manifesto,
          .ab2-scroll-story,
          .ab2-proof-gallery,
          .ab2-capability-map,
          .ab2-final-contact {
            padding-left: 20px;
            padding-right: 20px;
          }

          .ab2-manifesto {
            min-height: auto;
            padding-top: 74px;
            padding-bottom: 66px;
            gap: 22px;
          }

          .ab2-letterbox {
            --ab2-media-mask: radial-gradient(ellipse 72% 66% at 50% 52%, black 0%, black 46%, rgba(0, 0, 0, 0.58) 60%, transparent 82%);
            aspect-ratio: 1 / 1.16;
          }

          .ab2-manifesto-copy {
            left: 18px;
            right: 18px;
            bottom: 20px;
          }

          .ab2-line {
            font-size: clamp(2rem, 12vw, 3.25rem);
          }

          .ab2-story-head h2,
          .ab2-proof-head h2,
          .ab2-capability-head h2,
          .ab2-final-contact h2 {
            max-width: 12ch;
            font-size: clamp(2.2rem, 12vw, 3rem);
          }

          .ab2-content p,
          .ab2-manifesto-note {
            font-size: 0.95rem;
          }

          .ab2-scroll-story,
          .ab2-proof-gallery,
          .ab2-capability-map {
            padding-top: 68px;
            padding-bottom: 72px;
          }

          .ab2-step-copy {
            padding-top: 22px;
            padding-bottom: 28px;
          }

          .ab2-step-copy h3 {
            font-size: clamp(2rem, 13vw, 3rem);
          }

          .ab2-proof-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .ab2-proof-card--landscape,
          .ab2-proof-card--portrait,
          .ab2-proof-card:nth-child(4) {
            grid-column: auto;
            padding-top: 0;
          }

          .ab2-capability-rail {
            grid-template-columns: 1fr;
            border-top: 0;
          }

          .ab2-capability-rail::before {
            display: none;
          }

          .ab2-capability-item,
          .ab2-capability-item + .ab2-capability-item {
            min-height: auto;
            padding: 24px 0;
            border-left: 0;
            border-top: 1px solid rgba(194, 180, 255, 0.18);
          }

          .ab2-final-contact {
            min-height: min(640px, 78dvh);
            padding-top: 70px;
            padding-bottom: 112px;
            gap: 28px;
          }

          .ab2-actions {
            width: 100%;
            gap: 12px;
          }

          .ab2-btn {
            width: 100%;
            white-space: nowrap;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab2-portal-frame,
          .ab2-reveal,
          .ab2-step-copy,
          .ab2-proof-card,
          .ab2-capability-item,
          .ab2-content-backdrop {
            opacity: 1 !important;
            visibility: visible !important;
            filter: none !important;
            transform: none !important;
          }

          .ab2-final-ring,
          .ab2-final-core {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
          }

          .ab2-line-inner {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
          }

          .ab2-story-visual-col,
          .ab2-story-visuals {
            display: none;
          }

          .ab2-story-list {
            min-height: 0;
            display: grid;
            gap: 20px;
          }

          .ab2-story-step {
            position: static;
            inset: auto;
            min-height: auto;
            display: block;
          }

          .ab2-step-inline-media {
            display: block;
          }

          .ab2-letterbox-video {
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
