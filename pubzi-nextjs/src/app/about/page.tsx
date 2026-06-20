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
    image: '/assets/img/landing-page/game/VLTK.png',
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

  // Section 1 has two stacked layers: the full-bleed video (z:2) and the portal
  // ring PNG (z:3). The video autoplays instantly while the PNG arrives later,
  // so on first paint the bare video shows and the ring "pops" in — a visible
  // jolt. Fix: keep BOTH layers hidden (CSS opacity:0) until the video can play
  // AND the ring image has loaded, then add `ab2-ready` to fade them in together.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reveal = () => root.classList.add('ab2-ready');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal();
      return;
    }

    const video = root.querySelector<HTMLVideoElement>('.ab2-fixed-video');
    const ring = root.querySelector<HTMLImageElement>('.ab2-portal-frame');

    let videoOk = false;
    let ringOk = false;
    const maybeReveal = () => {
      if (videoOk && ringOk) reveal();
    };

    const onVideoReady = () => {
      videoOk = true;
      maybeReveal();
    };
    const onRingReady = () => {
      ringOk = true;
      maybeReveal();
    };

    // Video: readyState >= 2 (HAVE_CURRENT_DATA) means a frame is paintable.
    if (!video || video.readyState >= 2) {
      videoOk = true;
    } else {
      video.addEventListener('loadeddata', onVideoReady, { once: true });
      video.addEventListener('canplay', onVideoReady, { once: true });
    }

    // Ring image: complete + naturalWidth guards against a broken/0-byte load.
    if (!ring || (ring.complete && ring.naturalWidth > 0)) {
      ringOk = true;
    } else {
      ring.addEventListener('load', onRingReady, { once: true });
      ring.addEventListener('error', onRingReady, { once: true });
    }

    maybeReveal();

    // Fallback: if an event never fires (cache quirks, decode stalls), reveal
    // anyway so the section can never stay invisible.
    const fallback = window.setTimeout(reveal, 2500);

    return () => {
      window.clearTimeout(fallback);
      video?.removeEventListener('loadeddata', onVideoReady);
      video?.removeEventListener('canplay', onVideoReady);
      ring?.removeEventListener('load', onRingReady);
      ring?.removeEventListener('error', onRingReady);
    };
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
          end: 'bottom bottom+=60',
          scrub: 0.15,
          invalidateOnRefresh: true,
        },
      });

      // Portal ring: its container is sticky, so it stays put while you scroll and
      // only scales outward. It must NOT scroll away — so it fades out IN PLACE
      // (dissolves at center) before the sticky releases.
      portalTl.to(
        '.ab2-portal-frame',
        { scale: 6.4, filter: 'brightness(1.08)', ease: 'none', duration: 0.62, force3D: false },
        0
      );
      portalTl.to(
        '.ab2-portal-frame',
        { autoAlpha: 0, ease: 'power1.in', duration: 0.2 },
        0.44
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

      mm.add('(min-width: 1024px) and (pointer: fine)', () => {
        const fixedVideoWrap = root.querySelector<HTMLElement>('.ab2-fixed-video-wrap');
        const stage = root.querySelector<HTMLElement>('.ab2-stage');
        const frame = root.querySelector<HTMLElement>('.ab2-frame-mask');
        const sectionBackdrop = root.querySelector<HTMLElement>('.ab2-section-backdrop');
        if (!fixedVideoWrap || !stage || !frame || !sectionBackdrop) {
          return;
        }

        // Keep the portal full-bleed through the manifesto, then crossfade it with
        // the section backdrop as the next section enters.
        // NOTE: opacity/visibility intentionally NOT set here — the first-paint
        // reveal (CSS .ab2-ready, added by JS once video+ring are both ready) owns
        // the initial fade-in. Setting autoAlpha:1 here would write inline opacity
        // and defeat that gate, letting the bare video flash before the ring.
        gsap.set(fixedVideoWrap, {
          y: 0,
          clearProps: 'clipPath',
          '--ab2-fixed-vignette': 0.22,
        });
        gsap.set(stage, {
          top: 0,
          left: 0,
          width: () => window.innerWidth,
          height: () => window.innerHeight,
          clearProps: 'transform',
        });
        gsap.set(frame, { '--f-left': '0px', '--f-top': '0px', '--f-right': '0px', '--f-bot': '0px' });
        gsap.set(sectionBackdrop, { autoAlpha: 0, yPercent: 0, scale: 1.01 });

        // Crossfade from the hero video into the manifesto's purple grid backdrop
        // before the manifesto headline reveals.
        const followTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.ab2-manifesto',
            start: 'top 98%',
            end: 'top 72%',
            scrub: true,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        });

        followTl
          .to(sectionBackdrop, { autoAlpha: 1, scale: 1, ease: 'none', duration: 1 }, 0)
          .to(fixedVideoWrap, { autoAlpha: 0, ease: 'none', duration: 1 }, 0);

        return () => {
          followTl.scrollTrigger?.kill();
          followTl.kill();
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

      mm.add('(min-width: 992px)', () => {
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
        <div className="ab2-stage">
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
        <span className="ab2-frame-mask" />
      </div>

      <div className="ab2-portal" aria-hidden="true">
        <div className="ab2-portal-frame-shell">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ab2-portal-frame" src="/assets/img/landing-page/trasparent_bg.png" alt="" />
        </div>
      </div>

      <section className="ab2-hero">
        <div className="ab2-hero-sticky" />
      </section>

      <main className="ab2-content">
        <div className="ab2-portal-bridge" aria-hidden="true" />
        <div className="ab2-content-backdrop" aria-hidden="true" />

        <section className="ab2-manifesto">
          <div className="ab2-manifesto-stage">
            <div className="ab2-card-slot" aria-hidden="true" />

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
          <div className="ab2-final-media" aria-hidden="true">
            <video
              className="ab2-final-video ab2-motion-video"
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
            >
              <PortalVideoSources />
            </video>
            <span className="ab2-final-scrim" />
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
            radial-gradient(ellipse 94% 56% at 52% 4%, rgba(159, 140, 255, 0.28), rgba(73, 34, 170, 0.16) 48%, transparent 82%),
            radial-gradient(ellipse 76% 58% at 58% 46%, rgba(64, 38, 150, 0.24), transparent 76%),
            linear-gradient(180deg, rgba(24, 14, 58, 0.82) 0%, rgba(13, 9, 30, 0.96) 58%, #08060f 100%);
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
            linear-gradient(90deg, rgba(194, 180, 255, 0.064) 1px, transparent 1px),
            linear-gradient(180deg, rgba(194, 180, 255, 0.052) 1px, transparent 1px);
          background-size: 96px 96px;
          opacity: 0.52;
          -webkit-mask-image: radial-gradient(ellipse 88% 72% at 50% 36%, black 0%, rgba(0, 0, 0, 0.64) 66%, transparent 100%);
          mask-image: radial-gradient(ellipse 88% 72% at 50% 36%, black 0%, rgba(0, 0, 0, 0.64) 66%, transparent 100%);
        }

        .ab2-section-backdrop::after {
          background: linear-gradient(180deg, transparent 0%, rgba(8, 6, 15, 0.22) 72%, rgba(8, 6, 15, 0.72) 100%);
          opacity: 0.64;
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
          background: transparent;
          will-change: transform, opacity;
        }

        /* Both section-1 layers start hidden and fade in together once the video
           AND the portal ring are both ready (JS adds .ab2-ready on the root).
           This kills the first-paint jolt where the video showed before the ring. */
        .ab2-fixed-video-wrap,
        .ab2-portal {
          opacity: 0;
          transition: opacity 0.5s ease-out;
        }
        .ab2-root.ab2-ready .ab2-fixed-video-wrap,
        .ab2-root.ab2-ready .ab2-portal {
          opacity: 1;
        }

        /* The box that morphs. At rest it fills the viewport; GSAP animates its
           top/left/width/height down to the card slot. It clips the video and
           carries the grading/vignette so those track the box, not the screen. */
        .ab2-stage {
          --ab2-fixed-vignette: 0.22;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #08060f;
          will-change: top, left, width, height;
        }

        /* No vignette/glow over the video — it shows raw and evenly lit. The only
           overlay is a light bottom gradient so the mission text stays legible once
           the video parks in the card slot. */
        .ab2-stage::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(180deg, transparent 0%, transparent 52%, rgba(5, 3, 12, 0.22) 78%, rgba(5, 3, 12, 0.52) 100%);
        }

        /* Rectangular soft edge. Lives on the NON-transformed wrap so the feather
           softness is sized in true screen px and never squashes. Four directional
           gradients dissolve the page bg (#08060f) inward — squared corners, no oval.
           Feather is split X vs Y: wider on the sides, gentler top/bottom so the band
           never darkens the hero headline. The --f-* insets stay 0 at rest (the mask
           fills the wrap); they exist so a future morph could animate them to a card
           rect. NOTE: the feather is a static dissolve — it is intentionally NOT
           animated by any timeline, so it cannot interfere with the scroll-zoom. */
        .ab2-frame-mask {
          --f-left: 0px;
          --f-top: 0px;
          --f-right: 0px;
          --f-bot: 0px;
          --feather-x: clamp(90px, 13vw, 240px);
          --feather-y: clamp(56px, 8vh, 150px);
          position: absolute;
          inset: var(--f-top) var(--f-right) var(--f-bot) var(--f-left);
          z-index: 3;
          pointer-events: none;
          background:
            linear-gradient(to right, #08060f 0, rgba(8, 6, 15, 0.86) calc(var(--feather-x) * 0.22), rgba(8, 6, 15, 0.4) calc(var(--feather-x) * 0.55), transparent var(--feather-x)),
            linear-gradient(to left, #08060f 0, rgba(8, 6, 15, 0.86) calc(var(--feather-x) * 0.22), rgba(8, 6, 15, 0.4) calc(var(--feather-x) * 0.55), transparent var(--feather-x)),
            linear-gradient(to bottom, #08060f 0, rgba(8, 6, 15, 0.86) calc(var(--feather-y) * 0.22), rgba(8, 6, 15, 0.4) calc(var(--feather-y) * 0.55), transparent var(--feather-y)),
            linear-gradient(to top, #08060f 0, rgba(8, 6, 15, 0.86) calc(var(--feather-y) * 0.22), rgba(8, 6, 15, 0.4) calc(var(--feather-y) * 0.55), transparent var(--feather-y));
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
          height: 220dvh;
          min-height: 1500px;
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

        /* Fixed to the viewport so the portal ring NEVER scrolls with the page —
           it stays dead-center and only scales + fades out in place. z:3 sits ABOVE
           the video wrap (z:2) so the ring is visible, but below .ab2-content (z:4)
           so it can't cover the sections below once it has faded. */
        .ab2-portal {
          position: fixed;
          inset: 0;
          z-index: 3;
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
          inset: -260px 0 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background:
            linear-gradient(90deg, rgba(194, 180, 255, 0.07) 1px, transparent 1px),
            linear-gradient(180deg, rgba(194, 180, 255, 0.055) 1px, transparent 1px),
            linear-gradient(115deg, transparent 0%, rgba(159, 140, 255, 0.09) 42%, transparent 66%),
            radial-gradient(ellipse 56rem 28rem at 76% 22%, rgba(159, 140, 255, 0.16), transparent 68%);
          background-size: 96px 96px, 96px 96px, 100% 100%, 100% 100%;
          -webkit-mask-image: linear-gradient(180deg, transparent 0, rgba(0, 0, 0, 0.28) 180px, rgba(0, 0, 0, 0.68) 420px, black 720px, black calc(100% - 420px), transparent 100%);
          mask-image: linear-gradient(180deg, transparent 0, rgba(0, 0, 0, 0.28) 180px, rgba(0, 0, 0, 0.68) 420px, black 720px, black calc(100% - 420px), transparent 100%);
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
          min-height: 112dvh;
          padding-top: clamp(80px, 10vh, 124px);
          padding-bottom: clamp(76px, 10vh, 128px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(18px, 3vw, 30px);
        }

        .ab2-manifesto-stage {
          position: relative;
          width: min(100%, 1280px);
          min-height: min(760px, 76dvh);
          margin: 0 auto;
          display: grid;
          align-items: center;
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
          inset: -18% -8%;
          background:
            radial-gradient(ellipse 78% 56% at 54% 44%, rgba(174, 151, 255, 0.16), transparent 68%),
            linear-gradient(180deg, transparent 0%, rgba(8, 6, 15, 0.08) 72%, transparent 100%);
          filter: blur(24px);
          opacity: 0.62;
        }

        .ab2-manifesto-stage::after {
          inset: -8% -6%;
          background: linear-gradient(180deg, rgba(8, 6, 15, 0.06), transparent 42%, transparent 100%);
          opacity: 0.36;
        }

        /* Invisible in-flow placeholder. It reserves the manifesto's height (so the
           layout doesn't collapse when the video became a fixed overlay) and is the
           getBoundingClientRect() target the morph aims at. Never display:none —
           it must keep a measurable box. */
        .ab2-card-slot {
          position: relative;
          width: 100%;
          min-height: min(720px, 72dvh);
          aspect-ratio: 16 / 9;
          visibility: hidden;
        }

        .ab2-manifesto-copy {
          position: absolute;
          left: clamp(28px, 6vw, 96px);
          right: clamp(28px, 34vw, 420px);
          bottom: clamp(42px, 8vh, 92px);
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
          font-size: clamp(2.15rem, 4.45vw, 4.95rem);
          line-height: 1;
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
          width: min(100%, 1280px);
          max-width: none;
          margin: 0 auto;
          padding-left: clamp(28px, 6vw, 96px);
          padding-right: clamp(28px, 48vw, 540px);
          color: rgba(255, 255, 255, 0.78);
          font-size: clamp(0.92rem, 0.92vw, 1rem);
          line-height: 1.78;
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
          display: block;
          min-height: 0;
        }

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
          display: grid;
          position: relative;
          gap: clamp(34px, 6vw, 82px);
          min-height: 0;
        }

        .ab2-story-step {
          position: relative;
          min-height: auto;
          display: grid;
          grid-template-columns: minmax(240px, 0.54fr) minmax(0, 0.9fr);
          grid-template-areas: 'media copy';
          gap: clamp(28px, 5vw, 76px);
          align-items: center;
          padding: clamp(24px, 4vw, 54px) 0;
          border-top: 0;
        }

        .ab2-story-step + .ab2-story-step {
          border-top: 1px solid rgba(194, 180, 255, 0.1);
        }

        .ab2-story-step:nth-child(even) {
          grid-template-columns: minmax(0, 0.9fr) minmax(240px, 0.54fr);
          grid-template-areas: 'copy media';
        }

        .ab2-story-step:nth-child(even) .ab2-step-copy {
          justify-self: end;
        }

        .ab2-step-copy {
          grid-area: copy;
          position: relative;
          width: 100%;
          max-width: 620px;
          padding: 0;
          border-top: 0;
        }

        .ab2-step-copy::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: min(62%, 420px);
          height: 1px;
          background: linear-gradient(90deg, rgba(194, 180, 255, 0.44), rgba(159, 140, 255, 0.18) 62%, transparent 100%);
          opacity: 0.72;
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
          font-size: clamp(2.35rem, 4.8vw, 4.8rem);
          line-height: 0.98;
        }

        .ab2-step-copy p {
          max-width: 48ch;
          font-size: 1.04rem;
        }

        .ab2-step-inline-media {
          grid-area: media;
          display: block;
          position: relative;
          width: min(100%, 420px);
          aspect-ratio: 1122 / 1402;
          margin: 0;
          justify-self: center;
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
          min-height: max(760px, 100dvh);
          /* Keep the closing portal as a complete scene before the footer enters. */
          padding-top: clamp(112px, 14vh, 176px);
          padding-bottom: clamp(112px, 14vh, 176px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(28px, 4vw, 44px);
          text-align: center;
          isolation: isolate;
          /* No overflow clip here: any clip on this 1360px box would cut the
             full-bleed video media back into a 1360px rectangle (the very seam we're
             removing). The media spans exactly 100vw centered, so it never exceeds the
             viewport and can't create a horizontal scrollbar; vertically it's pinned
             to this section (top/bottom:0) so it won't bleed into neighbours. */
          overflow: visible;
        }

        /* Real blackhole video as the closing scene — same footage as the hero, so
           the page speaks one visual language end to end (no CSS fake ring). */
        .ab2-final-media {
          position: absolute;
          /* Full-bleed break-out: the parent .ab2-final-contact is capped at 1360px
             and centered, so an inset:0 media only filled that box — its edges met
             the wider page bg in two straight vertical seams. Spanning the full
             viewport width (100vw, centered via left:50% + -50vw) removes the box
             edge entirely; the mask is now the only thing shaping the video, so it
             dissolves into the page bg with no rectangular seam at any screen width. */
          top: 0;
          bottom: 0;
          left: 50%;
          width: 100vw;
          margin-left: -50vw;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
          /* Two masks multiplied (mask-composite): an ellipse that melts the L/R
             sides, AND a vertical linear fade that melts the TOP/BOTTOM edges sooner
             than the ellipse alone did (the top edge was still showing a faint
             horizontal seam where the video met the grid bg). Intersecting them means
             a pixel is only opaque where BOTH say so, so all four edges dissolve. */
          -webkit-mask-image:
            radial-gradient(ellipse 64% 78% at 50% 50%, black 0%, black 34%, rgba(0, 0, 0, 0.5) 60%, transparent 84%),
            linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.5) 12%, black 30%, black 70%, rgba(0, 0, 0, 0.5) 88%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-image:
            radial-gradient(ellipse 64% 78% at 50% 50%, black 0%, black 34%, rgba(0, 0, 0, 0.5) 60%, transparent 84%),
            linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.5) 12%, black 30%, black 70%, rgba(0, 0, 0, 0.5) 88%, transparent 100%);
          mask-composite: intersect;
        }

        .ab2-final-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          filter: contrast(1.16) brightness(0.9) saturate(1.2);
        }

        /* Dark wash so the headline + buttons stay readable over the video, with a
           soft purple core glow. Shares the media's elliptical mask so its edges
           dissolve with the video instead of forming a straight rectangular band —
           the old inset:-1px + opaque top/bottom linear stops were drawing that band.
           The vertical readability wash is now a soft center-weighted radial, not a
           full-width linear, so it never paints a hard edge at the box top/bottom. */
        .ab2-final-scrim {
          position: absolute;
          inset: 0;
          /* Same intersect approach as the media so the dark wash dissolves on all
             four edges (especially top/bottom) and never paints a horizontal seam. */
          -webkit-mask-image:
            radial-gradient(ellipse 72% 74% at 50% 50%, black 0%, black 38%, rgba(0, 0, 0, 0.55) 62%, transparent 84%),
            linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.5) 12%, black 30%, black 70%, rgba(0, 0, 0, 0.5) 88%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-image:
            radial-gradient(ellipse 72% 74% at 50% 50%, black 0%, black 38%, rgba(0, 0, 0, 0.55) 62%, transparent 84%),
            linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.5) 12%, black 30%, black 70%, rgba(0, 0, 0, 0.5) 88%, transparent 100%);
          mask-composite: intersect;
          background:
            radial-gradient(ellipse 68% 54% at 50% 50%, transparent 0%, rgba(8, 6, 15, 0.3) 58%, rgba(8, 6, 15, 0.6) 100%),
            radial-gradient(ellipse 82% 56% at 50% 52%, rgba(159, 140, 255, 0.2), rgba(70, 42, 154, 0.11) 48%, transparent 74%),
            radial-gradient(ellipse 60% 78% at 50% 50%, rgba(8, 6, 15, 0.72) 0%, rgba(20, 12, 48, 0.34) 42%, transparent 78%);
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

          .ab2-story-step {
            grid-template-columns: minmax(220px, 0.5fr) minmax(0, 1fr);
            gap: clamp(24px, 4vw, 54px);
          }

          .ab2-story-step:nth-child(even) {
            grid-template-columns: minmax(0, 1fr) minmax(220px, 0.5fr);
          }
        }

        @media (max-width: 991px) {
          .ab2-hero-sticky {
            padding-top: 100px;
          }

          .ab2-story-layout {
            margin-top: 38px;
          }

          .ab2-story-list {
            min-height: 0;
            display: grid;
            gap: 42px;
          }

          .ab2-story-step {
            position: relative;
            inset: auto;
            min-height: auto;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-areas:
              'media'
              'copy';
            gap: 22px;
            padding: 30px 0;
          }

          .ab2-story-step:nth-child(even) {
            grid-template-columns: 1fr;
            grid-template-areas:
              'media'
              'copy';
          }

          .ab2-step-inline-media {
            display: block;
            width: min(100%, 460px);
            margin: 0 auto;
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

        /* Below the morph gate (1024px / fine pointer) the JS morph never runs, so
           the video stays a static fullscreen background in the hero area and the
           rectangular frame collapses to flush (invisible) edges. */
        @media (max-width: 1023px), (pointer: coarse) {
          .ab2-fixed-video-wrap {
            position: absolute;
            height: 100dvh;
            transform: none !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          .ab2-stage {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            transform: none !important;
          }

          .ab2-frame-mask {
            inset: 0 !important;
            --f-left: 0px !important;
            --f-top: 0px !important;
            --f-right: 0px !important;
            --f-bot: 0px !important;
            /* Mobile keeps flush edges (no feather) — video is a plain fullscreen bg. */
            --feather-x: 0px !important;
            --feather-y: 0px !important;
          }

          .ab2-fixed-video {
            transform: none !important;
          }

          .ab2-fixed-portal-frame {
            width: 100vw !important;
            transform: translate(-50%, -39.5%) !important;
          }

          .ab2-portal-bloom {
            display: none;
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

          .ab2-manifesto-stage {
            min-height: clamp(520px, 84dvh, 680px);
          }

          .ab2-card-slot {
            min-height: clamp(520px, 84dvh, 680px);
            aspect-ratio: 1 / 1.16;
          }

          .ab2-manifesto-copy {
            left: 18px;
            right: 18px;
            bottom: 34px;
          }

          .ab2-line {
            font-size: clamp(2rem, 11.4vw, 3.15rem);
          }

          .ab2-manifesto-note {
            padding-left: 0;
            padding-right: 0;
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
            min-height: max(620px, 92dvh);
            padding-top: 84px;
            padding-bottom: 120px;
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

          .ab2-fixed-portal-frame {
            opacity: 1 !important;
            visibility: visible !important;
            filter: none !important;
            transform: translate(calc(var(--ab2-ring-x) * -1), calc(var(--ab2-ring-y) * -1)) !important;
          }

          .ab2-portal-bloom {
            display: none !important;
          }

          .ab2-line-inner {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
          }

          .ab2-story-list {
            min-height: 0;
          }

          .ab2-story-step {
            position: relative;
            inset: auto;
            min-height: auto;
          }

          .ab2-step-inline-media {
            display: block;
          }

          .ab2-fixed-video-wrap {
            transform: none !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          .ab2-stage {
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            transform: none !important;
          }

          .ab2-frame-mask {
            inset: 0 !important;
            --f-left: 0px !important;
            --f-top: 0px !important;
            --f-right: 0px !important;
            --f-bot: 0px !important;
            /* Mobile keeps flush edges (no feather) — video is a plain fullscreen bg. */
            --feather-x: 0px !important;
            --feather-y: 0px !important;
          }
        }
      `}</style>
    </div>
  );
}
