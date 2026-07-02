'use client';

import GameCompanion3D from '@/components/game/GameCompanion3D';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  Gamepad2,
  Layers3,
  Monitor,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

type Game = {
  code: string;
  title: string;
  shortTitle: string;
  genre: string;
  platform: 'PC' | 'Mobile' | 'PC & Mobile';
  poster: string;
  backdrop: string;
  backdropSource?: 'portrait';
  // hook: one emotional line - the player's reason to care (not a feature list).
  hook: string;
  // forWho: helps the player self-identify ("this game is for someone like me").
  forWho: string;
  status: string;
  details: string[];
  accent: string;
  ctaLabel: string;
  ctaHref: string;
};

const posterDir = '/assets/img/landing-page/list_game_doc';
const backdropDir = '/assets/img/landing-page/game';
const heroBackdrop = `${backdropDir}/background_1_game.png`;
const partnerBackdrop = `${backdropDir}/background_2_game.png`;

const GAMES: Game[] = [
  {
    code: 'VLTK2',
    title: 'Võ Lâm Truyền Kỳ 2',
    shortTitle: 'VLTK2',
    genre: 'Kiếm hiệp MMORPG',
    platform: 'PC',
    poster: `${posterDir}/VLTK2.png`,
    backdrop: `${backdropDir}/VLTK.png`,
    hook: 'Giang hồ vẫn đông như ngày đó. Bang hội, công thành, săn boss mỗi tối.',
    forWho: 'Dành cho ai mê chiến trường đông và muốn có anh em chinh chiến cùng.',
    status: 'Đang vận hành',
    details: ['Bang hội', 'Công thành', 'Boss thế giới'],
    accent: '#b79cff',
    ctaLabel: 'Trao đổi về game này',
    ctaHref: '/contact',
  },
  {
    code: 'KT',
    title: 'Kiếm Thế',
    shortTitle: 'Kiếm Thế',
    genre: 'Nhập vai võ hiệp',
    platform: 'PC',
    poster: `${posterDir}/kiem-the.png`,
    backdrop: `${backdropDir}/kiem-the.png`,
    hook: 'Tống Kim 9 giờ tối, cả server lao vào nhau. Bạn đứng phe nào?',
    forWho: 'Dành cho dân máu chiến, thích PvP nhanh và mỗi tối một trận lớn.',
    status: 'Sắp mở',
    details: ['Tống Kim', 'Gia tộc', 'PvP phe phái'],
    accent: '#8fd7ff',
    ctaLabel: 'Trao đổi về game này',
    ctaHref: '/contact',
  },
  {
    code: 'TLBB',
    title: 'Thiên Long Bát Bộ',
    shortTitle: 'TLBB',
    genre: 'MMORPG võ hiệp',
    platform: 'PC & Mobile',
    poster: `${posterDir}/TLBB.png`,
    backdrop: `${backdropDir}/thien-long-bat-bo.png`,
    hook: 'Thiên Long trở lại. Vẫn môn phái đó, giờ chơi được cả trên điện thoại.',
    forWho: 'Dành cho ai muốn chơi lại huyền thoại mà không phải ngồi mãi bên máy.',
    status: 'Ra mắt 2026',
    details: ['Môn phái', 'PvP lớn', 'PC & Mobile'],
    accent: '#f2d18a',
    ctaLabel: 'Trao đổi về game này',
    ctaHref: '/contact',
  },
  {
    code: 'TNGH',
    title: 'Tiếu Ngạo Giang Hồ',
    shortTitle: 'TNGH',
    genre: 'Hành động nhập vai',
    platform: 'PC',
    poster: `${posterDir}/tieu-ngao-giang-ho.png`,
    backdrop: `${backdropDir}/tieu-ngao-giang-ho.png`,
    hook: 'Combo tay nhanh, phe phái rõ ràng. Giang hồ đúng chất phim kiếm hiệp.',
    forWho: 'Dành cho game thủ thích đánh đấm có kỹ năng, không chỉ bấm auto.',
    status: 'Sắp mở',
    details: ['Combo võ học', 'Thế lực', 'Chiến trường'],
    accent: '#9de6c7',
    ctaLabel: 'Trao đổi về game này',
    ctaHref: '/contact',
  },
  {
    code: 'SRO',
    title: 'Con Đường Tơ Lụa',
    shortTitle: 'Silkroad',
    genre: 'MMORPG thương lộ',
    platform: 'PC',
    poster: `${posterDir}/con-duong-to-lua.png`,
    backdrop: `${backdropDir}/con-duong-to-lua.png`,
    hook: 'Buôn lụa hay cướp lụa? Mỗi chuyến hàng là một canh bạc.',
    forWho: 'Dành cho dân thích vai trò xã hội, buôn bán và phục kích nhau trên đường.',
    status: 'Sắp mở',
    details: ['Buôn bán', 'Cướp đường', 'Bảo tiêu'],
    accent: '#ffb86b',
    ctaLabel: 'Trao đổi về game này',
    ctaHref: '/contact',
  },
];

const OPS_STEPS = [
  {
    label: 'Chọn game',
    text: 'Đọc cộng đồng, thể loại, nền tảng và khả năng vận hành lâu dài trước khi đưa vào catalog.',
  },
  {
    label: 'Định vị ra mắt',
    text: 'Tách rõ game đang vận hành, game sắp mở và nhóm cần truyền thông trước launch.',
  },
  {
    label: 'Vận hành nội địa',
    text: 'Theo dõi nhịp sự kiện, cộng đồng, phản hồi người chơi và kênh hỗ trợ tại Việt Nam.',
  },
  {
    label: 'Mở rộng vòng đời',
    text: 'Giữ game sống bằng nội dung, chiến dịch, cộng đồng và lịch cập nhật có nhịp.',
  },
];

function PlatformIcon({ platform }: { platform: Game['platform'] }) {
  if (platform === 'Mobile') return <Smartphone size={17} strokeWidth={1.8} aria-hidden="true" />;
  if (platform === 'PC & Mobile') return <Layers3 size={17} strokeWidth={1.8} aria-hidden="true" />;
  return <Monitor size={17} strokeWidth={1.8} aria-hidden="true" />;
}

function accentStyle(game: Game): CSSProperties {
  return { '--game-accent': game.accent } as CSSProperties;
}

export default function GamePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.remove('gm-pending');
      return;
    }

    let disposed = false;
    let refreshFrame = 0;
    let refreshTimer = 0;
    let refreshScrollTrigger: (() => void) | null = null;
    let ctx: { revert: () => void } | null = null;

    const requestStableRefresh = () => {
      if (disposed || !refreshScrollTrigger) return;
      window.cancelAnimationFrame(refreshFrame);
      window.clearTimeout(refreshTimer);
      refreshFrame = window.requestAnimationFrame(() => {
        refreshTimer = window.setTimeout(() => {
          if (!disposed) refreshScrollTrigger?.();
        }, 60);
      });
    };

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([gsapModule, scrollTriggerModule]) => {
        if (disposed) return;

        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        refreshScrollTrigger = () => ScrollTrigger.refresh();
        ScrollTrigger.clearScrollMemory();

        ctx = gsap.context(() => {
          const showcaseHead = root.querySelector<HTMLElement>('.gm-showcase-head');
          const showcaseWords = showcaseHead
            ? Array.from(showcaseHead.querySelectorAll<HTMLElement>('.gm-word'))
            : [];
          const ledgerRows = Array.from(root.querySelectorAll<HTMLElement>('.gm-ledger-row'));

          if (showcaseWords.length) {
            gsap.set(showcaseWords, { opacity: 0.16, y: 12 });
          }
          gsap.set('.gm-panel', { autoAlpha: 0, y: 34, scale: 0.985 });
          if (ledgerRows.length) {
            gsap.set(ledgerRows, { autoAlpha: 0, y: 24 });
          }
          gsap.set('.gm-ops-step', { autoAlpha: 0, y: 24 });
          gsap.set('.gm-cta-visual', { autoAlpha: 0, scale: 1.04 });
          gsap.set('.gm-cta-copy > *', { autoAlpha: 0, y: 30 });

          // Drifting starfield in the hero background: keep the first viewport
          // already visible, then add motion once GSAP has loaded.
          gsap.utils.toArray<HTMLElement>('.gm-star').forEach((star) => {
            gsap.set(star, {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              scale: 0.5 + Math.random() * 1.1,
            });
            gsap.to(star, {
              x: () => (Math.random() - 0.5) * 80,
              y: () => (Math.random() - 0.5) * 80,
              duration: 6 + Math.random() * 8,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
            gsap.to(star, {
              opacity: 0.15 + Math.random() * 0.5,
              duration: 1.4 + Math.random() * 2.6,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: Math.random() * 2,
            });
          });

          gsap.to('.gm-hero-backdrop img', {
            scale: 1.1,
            yPercent: -4,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: '.gm-hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });

          if (showcaseHead && showcaseWords.length) {
            gsap.to(showcaseWords, {
              opacity: 1,
              y: 0,
              duration: 0.54,
              stagger: 0.024,
              ease: 'power2.out',
              force3D: true,
              scrollTrigger: { trigger: showcaseHead, start: 'top 76%', once: true },
            });
          }

          gsap.to('.gm-panel', {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            stagger: 0.08,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: { trigger: '.gm-showcase', start: 'top 76%', once: true },
          });

          if (ledgerRows.length) {
            gsap.to(ledgerRows, {
              autoAlpha: 1,
              y: 0,
              duration: 0.58,
              stagger: 0.055,
              ease: 'power3.out',
              force3D: true,
              scrollTrigger: {
                trigger: ledgerRows[0].closest('.gm-ledger') ?? ledgerRows[0],
                start: 'top 74%',
                once: true,
              },
            });
          }

          gsap.to('.gm-ops-step', {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            stagger: 0.07,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: { trigger: '.gm-ops', start: 'top 74%', once: true },
          });

          gsap.to(
            '.gm-cta-visual',
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.9,
              ease: 'power3.out',
              force3D: true,
              scrollTrigger: { trigger: '.gm-cta', start: 'top 72%', once: true },
            }
          );

          gsap.to(
            '.gm-cta-copy > *',
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: 'power3.out',
              force3D: true,
              scrollTrigger: { trigger: '.gm-cta', start: 'top 72%', once: true },
            }
          );
        }, root);

        root.classList.remove('gm-pending');

        window.addEventListener('load', requestStableRefresh, { once: true });
        void document.fonts?.ready.then(requestStableRefresh);
        requestStableRefresh();
      })
      .catch(() => {
        if (!disposed) root.classList.remove('gm-pending');
      });

    return () => {
      disposed = true;
      window.removeEventListener('load', requestStableRefresh);
      window.cancelAnimationFrame(refreshFrame);
      window.clearTimeout(refreshTimer);
      ctx?.revert();
    };
  }, []);

  return (
    <main className="gm-root gm-pending" ref={rootRef}>
      {/* Page-coordinate floating warrior - lives only on /game, drag it
          anywhere down the page and it stays where dropped. */}
      <GameCompanion3D />

      <section className="gm-hero">
        <div className="gm-hero-backdrop" aria-hidden="true">
          <Image src={heroBackdrop} alt="" fill priority sizes="100vw" />
        </div>
        <div className="gm-hero-grid" aria-hidden="true" />
        <div className="gm-hero-stars" aria-hidden="true">
          {Array.from({ length: 26 }).map((_, i) => (
            <span key={i} className="gm-star" />
          ))}
        </div>

        <div className="gm-hero-inner">
          <div className="gm-hero-copy">
            <h1 className="gm-hero-title">
              <span>Bước qua cổng,</span>
              <span>chọn thế giới của bạn</span>
            </h1>
            <p className="gm-hero-sub">
              Mỗi tựa game được chọn vì có cộng đồng, nhịp vận hành và câu chuyện riêng.
              Black Hole dựng bối cảnh để người chơi muốn ở lại.
            </p>
            <div className="gm-hero-facts" aria-label="Thông tin catalog">
              <span>
                <Gamepad2 size={18} strokeWidth={1.8} aria-hidden="true" />
                {GAMES.length} tựa game
              </span>
              <span>
                <Layers3 size={18} strokeWidth={1.8} aria-hidden="true" />
                PC và Mobile
              </span>
              <span>
                <ShieldCheck size={18} strokeWidth={1.8} aria-hidden="true" />
                Vận hành nội địa
              </span>
            </div>
            <div className="gm-hero-actions">
              <a href="#showcase" className="gm-link gm-link-lg">
                Xem các thế giới
                <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right column of the hero. The 3D warrior (GameCompanion3D) floats
              here at start - its home is measured from this shell - then can be
              dragged/thrown anywhere down the page. No ring/frame. */}
          <div className="gm-portal-shell" aria-hidden="true" />
        </div>
      </section>


      <section id="showcase" className="gm-showcase" aria-label="Danh sách game Black Hole">
        <div className="gm-showcase-track">
          {GAMES.map((game, index) => (
            <article className="gm-panel" key={game.code} style={accentStyle(game)}>
              <Link href={game.ctaHref} prefetch={false} className="gm-panel-card" aria-label={`Trao đổi về ${game.title}`}>
                <div className={`gm-panel-visual ${game.backdropSource === 'portrait' ? 'is-portrait-source' : ''}`}>
                  <Image src={game.backdrop} alt={game.title} fill sizes="(max-width: 767px) 92vw, (max-width: 1199px) 46vw, 760px" />
                  <span className="gm-panel-shade" aria-hidden="true" />
                </div>

                <div className="gm-panel-info">
                  <div className="gm-panel-info-top">
                    <span className="gm-panel-count">{String(index + 1).padStart(2, '0')}</span>
                    <span className="gm-panel-status">{game.status}</span>
                  </div>
                  <div className="gm-panel-info-main">
                    <h3>{game.title}</h3>
                    <span className="gm-panel-platform">
                      <PlatformIcon platform={game.platform} />
                      {game.platform}
                    </span>
                  </div>
                  <div className="gm-panel-info-bottom">
                    <p className="gm-panel-genre">{game.genre}</p>
                    <span className="gm-panel-open">
                      Trao đổi
                      <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>



      <section className="gm-ops" aria-label="Cách Black Hole vận hành danh mục game">
  <div className="gm-ops-inner">
    <div className="gm-ops-copy">
      <p className="gm-mini-label">Vận hành danh mục game</p>
      <h2>Không chỉ đưa game lên kệ.</h2>
      <p>      
        Với đối tác phát hành, điều quan trọng hơn là thấy rõ Black Hole giới thiệu game ra thị trường,
        theo dõi hiệu quả và giữ nhịp vận hành ổn định sau khi ra mắt.
      </p>
    </div>

    <div className="gm-ops-grid">
      {OPS_STEPS.map((step, index) => (
        <div className="gm-ops-step" key={step.label}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{step.label}</strong>
          <p>{step.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      <section className="gm-cta" id="partner">
        <div className="gm-cta-visual">
          <Image src={partnerBackdrop} alt="" fill sizes="100vw" />
        </div>
        <div className="gm-cta-copy">
          <p className="gm-mini-label">Đối tác phát hành</p>
          <h2>Có game cần bước vào thị trường Việt?</h2>
          <p>
            Black Hole hỗ trợ bản địa hóa, vận hành cộng đồng, chiến dịch ra mắt và kênh phân phối cho game PC lẫn Mobile.
          </p>
          <Link href="/contact" prefetch={false} className="gm-link gm-link-lg">
            Bắt đầu trao đổi
            <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <style jsx global>{`
        .gm-root {
          --gm-bg: #08060f;
          --gm-bg-deep: #05040a;
          --gm-surface: rgba(20, 15, 36, 0.72);
          --gm-surface-strong: rgba(28, 21, 48, 0.92);
          --gm-line: rgba(198, 181, 255, 0.18);
          --gm-line-strong: rgba(214, 200, 255, 0.38);
          --gm-text: rgba(255, 255, 255, 0.94);
          --gm-soft: rgba(255, 255, 255, 0.68);
          --gm-muted: rgba(255, 255, 255, 0.5);
          --gm-accent: #b79cff;
          --gm-max: 1360px;
          --gm-pad: clamp(20px, 5vw, 78px);
          position: relative;
          overflow: visible;
          min-height: 100dvh;
          background:
            radial-gradient(circle at 72% 8%, rgba(183, 156, 255, 0.18), transparent 28rem),
            /* Resolve to the section colour (#05040a) well before the hero ends
               so the hero region and every section below sit on one continuous
               deep-black plate - no lighter band at the showcase seam. */
            linear-gradient(180deg, #0c0819 0%, var(--gm-bg) 18%, var(--gm-bg-deep) 30%);
          color: var(--gm-text);
        }

        .gm-root img {
          object-fit: cover;
        }

        .gm-root a {
          color: inherit;
          text-decoration: none;
        }

        .gm-root,
        .gm-root * {
          text-transform: none !important;
        }

        /* --- Shared text-link CTA (no boxes, no white border) --------------- */
        .gm-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0 8px;
          color: #f3efff !important;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: none;
          white-space: nowrap;
          transition: color 0.24s ease, gap 0.24s ease;
        }

        .gm-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--game-accent, #d8c8ff), color-mix(in srgb, var(--game-accent, #d8c8ff) 30%, transparent));
          transform: scaleX(0.001);
          transform-origin: left center;
          transition: transform 0.34s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gm-link:hover,
        .gm-link:focus-visible {
          color: #fff !important;
          gap: 12px;
        }

        .gm-link:hover::after,
        .gm-link:focus-visible::after {
          transform: scaleX(1);
        }

        .gm-link:focus-visible {
          outline: none;
        }

        .gm-link svg {
          color: var(--game-accent, #d8c8ff);
          transition: transform 0.24s ease;
        }

        .gm-link:hover svg {
          transform: translate(2px, -2px);
        }

        .gm-link-lg {
          font-size: 15px;
        }

        .gm-hero {
          position: relative;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          padding: clamp(92px, 10vh, 112px) var(--gm-pad) clamp(52px, 8vh, 86px);
          isolation: isolate;
          background: var(--gm-bg-deep) !important;
        }

        .gm-hero::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          z-index: -1;
          height: clamp(300px, 46vh, 560px);
          /* Tall, opaque-by-the-bottom wash in the EXACT section colour (#05040a,
             measured with a colour picker) so the hero image fully dissolves into
             the section below - no bright band left at the seam. */
          background: linear-gradient(180deg, rgba(5, 4, 10, 0), rgba(5, 4, 10, 0.65) 50%, rgba(5, 4, 10, 0.95) 82%, #05040a 96%);
          pointer-events: none;
        }

        .gm-hero-backdrop {
          position: absolute;
          inset: 0;
          z-index: -3;
          opacity: 0.72;
          filter: saturate(1.08) brightness(0.82) contrast(1.04);
          pointer-events: none;
          /* Dissolve the image itself toward the bottom (not just dim it) so the
             lower edge melts fully away into the section colour - same on
             mobile + web. The image must be FULLY gone (alpha 0) by ~74%: any
             residual tail overlaps the opaque #05040a wash below and reads as a
             darker/denser band at the showcase seam. Smooth single ramp, no
             mid-stop plateau that would leave a faint image edge. */
          -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 34%, transparent 74%);
          mask-image: linear-gradient(180deg, #000 0%, #000 34%, transparent 74%);
        }

        .gm-hero-backdrop img {
          object-fit: cover;
          object-position: center;
        }

        .gm-hero-backdrop::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(5, 4, 10, 0.9), rgba(5, 4, 10, 0.3) 52%, rgba(5, 4, 10, 0.68)),
            linear-gradient(180deg, rgba(5, 4, 10, 0.14), rgba(5, 4, 10, 0.84));
        }

        .gm-hero-grid {
          position: absolute;
          inset: 0;
          z-index: -2;
          opacity: 0.36;
          background:
            linear-gradient(rgba(183, 156, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(183, 156, 255, 0.08) 1px, transparent 1px);
          background-size: 76px 76px;
          mask-image: radial-gradient(circle at 68% 42%, black 0%, transparent 68%);
          -webkit-mask-image: radial-gradient(circle at 68% 42%, black 0%, transparent 68%);
          pointer-events: none;
        }

        /* Drifting starfield - positions/opacity/motion driven by GSAP. */
        .gm-hero-stars {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
        }
        .gm-star {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(214, 200, 255, 0.95);
          box-shadow: 0 0 6px rgba(183, 156, 255, 0.8);
          opacity: 0.3;
          will-change: transform, opacity;
        }

        .gm-hero-inner,
        .gm-showcase-head,
        .gm-cta-copy {
          width: 100%;
          max-width: var(--gm-max);
          margin: 0 auto;
        }

        .gm-hero-inner {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
          gap: clamp(30px, 5vw, 74px);
          align-items: center;
        }

        .gm-mini-label {
          margin: 0 0 16px;
          color: #d5c8ff;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: none;
        }

        .gm-hero-title,
        .gm-showcase-head h2,
        .gm-cta-copy h2 {
          margin: 0;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: 0;
          text-transform: none;
          color: #f7f4ff !important;
          background: transparent !important;
          -webkit-text-fill-color: #f7f4ff !important;
          text-shadow: none !important;
        }

        .gm-hero-title {
          max-width: 11.5ch;
          font-size: clamp(42px, 5.55vw, 82px);
        }

        .gm-hero-title span {
          display: block;
        }

        .gm-hero-title span:last-child {
          color: #d4c7ff !important;
          -webkit-text-fill-color: #d4c7ff !important;
        }

        .gm-hero-sub,
        .gm-showcase-head p,
        .gm-cta-copy p:not(.gm-mini-label) {
          color: var(--gm-soft);
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-weight: 500;
          font-size: clamp(14px, 1.1vw, 17px);
          line-height: 1.72;
        }

        .gm-hero-sub {
          max-width: 56ch;
          margin: 24px 0 0;
        }

        .gm-hero-facts {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, max-content);
          align-items: stretch;
          gap: 0;
          width: min(100%, 640px);
          margin: 30px 0 0;
          padding: 16px 0 0;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
        }

        .gm-hero-facts::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 0;
          width: 116px;
          height: 1px;
          background: linear-gradient(90deg, rgba(216, 255, 78, 0.92), rgba(171, 121, 255, 0));
        }

        .gm-hero-facts span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .gm-hero-facts span {
          display: inline-grid;
          grid-template-columns: 26px max-content;
          min-height: 36px;
          align-items: center;
          gap: 10px;
          padding: 0 22px 0 0;
          margin-right: 22px;
          border-right: 1px solid rgba(255, 255, 255, 0.14);
          color: rgba(255, 255, 255, 0.78);
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 13px;
        }

        .gm-hero-facts span:last-child {
          margin-right: 0;
          padding-right: 0;
          border-right: 0;
        }

        .gm-hero-facts svg {
          width: 26px;
          height: 26px;
          padding: 5px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.055);
          color: #f0ebff;
        }

        .gm-hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 22px;
          margin: 34px 0 0;
        }

        .gm-portal-shell {
          position: relative;
          min-height: min(680px, calc(100dvh - 150px));
          perspective: 1200px;
        }

        /* ====================================================================
           SHOWCASE - image-first game library. Key art stays clean; metadata
           lives in a separate footer so artwork text is not duplicated.
           ==================================================================== */
        .gm-showcase-head {
          position: relative;
          isolation: isolate;
          padding: clamp(56px, 8vw, 104px) var(--gm-pad) clamp(34px, 5vw, 62px);
          /* Opaque #05040a - matches the hero's bottom fade target exactly so
             the dissolved hero image lands on the same colour with no seam. */
          background: #05040a;
        }

        .gm-showcase-head::before {
          content: "";
          position: absolute;
          z-index: 1;
          left: var(--gm-pad);
          top: clamp(30px, 5vw, 56px);
          width: min(280px, 42vw);
          height: 1px;
          background: linear-gradient(90deg, rgba(216, 255, 78, 0.7), transparent);
        }

        .gm-showcase-head::after {
          content: "";
          position: absolute;
          z-index: 0;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 100vw;
          transform: translateX(-50%);
          /* Exact section colour so the dissolved hero image and the page
             gradient both land on #05040a - single seamless plate. */
          background: #05040a;
          pointer-events: none;
        }

        .gm-showcase-head > * {
          position: relative;
          z-index: 2;
        }

        .gm-showcase-head h2 {
          max-width: 900px;
          font-size: clamp(36px, 5.1vw, 72px);
        }

        .gm-showcase-head p:not(.gm-mini-label) {
          max-width: 64ch;
          margin: 20px 0 0;
        }

        .gm-word {
          display: inline-block;
          margin-right: 0.28em;
        }

        .gm-showcase {
          position: relative;
          min-height: auto;
          overflow: visible;
          padding: 0 var(--gm-pad) clamp(86px, 9vw, 142px);
          background: var(--gm-bg-deep) !important;
        }

        .gm-showcase-track {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: clamp(14px, 1.5vw, 22px);
          width: min(100%, var(--gm-max));
          height: auto;
          margin: 0 auto;
          padding: 0;
        }

        .gm-panel {
          --game-accent: #b79cff;
          position: relative;
          grid-column: span 4;
          min-width: 0;
          height: auto;
          max-width: none;
          overflow: visible;
          background: transparent;
        }

        .gm-panel:nth-child(1) {
          grid-column: span 7;
        }

        .gm-panel:nth-child(2) {
          grid-column: span 5;
        }

        .gm-panel-card {
          position: relative;
          display: grid;
          grid-template-rows: auto 1fr;
          min-height: 100%;
          overflow: hidden;
          clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
          background:
            linear-gradient(180deg, rgba(18, 14, 28, 0.72), rgba(7, 6, 12, 0.98)),
            color-mix(in srgb, var(--game-accent) 5%, #07050d);
          box-shadow: 0 30px 82px rgba(0, 0, 0, 0.42);
          transition:
            transform 0.42s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.42s ease;
        }

        .gm-panel-card::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(180deg, rgba(216, 255, 78, 0.025), transparent 22%),
            radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--game-accent) 12%, transparent), transparent 18rem);
          pointer-events: none;
        }

        .gm-panel-card:hover,
        .gm-panel-card:focus-visible {
          transform: translateY(-6px);
          box-shadow:
            0 34px 86px rgba(0, 0, 0, 0.5),
            0 0 42px color-mix(in srgb, var(--game-accent) 14%, transparent);
        }

        .gm-panel-card:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--game-accent) 78%, #ffffff);
          outline-offset: 4px;
        }

        .gm-panel-visual {
          position: relative;
          inset: auto;
          aspect-ratio: 1672 / 941;
          overflow: hidden;
          background: #0b0814;
          isolation: isolate;
        }

        .gm-panel-visual img {
          object-fit: cover;
          object-position: center;
          transform: scale(1.01);
          filter: saturate(0.92) brightness(0.82) contrast(1.08);
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease;
        }

        .gm-panel-card:hover .gm-panel-visual img,
        .gm-panel-card:focus-visible .gm-panel-visual img {
          transform: scale(1.045);
          filter: saturate(1.02) brightness(0.9) contrast(1.08);
        }

        .gm-panel-visual.is-portrait-source img {
          object-fit: cover;
          filter: saturate(0.92) brightness(0.82) contrast(1.08);
        }

        .gm-panel-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(6, 5, 12, 0.04), rgba(6, 5, 12, 0.3)),
            linear-gradient(90deg, rgba(6, 5, 12, 0.28), transparent 46%, rgba(6, 5, 12, 0.18)),
            radial-gradient(circle at 20% 0%, color-mix(in srgb, var(--game-accent) 18%, transparent), transparent 42%);
          opacity: 0.86;
          pointer-events: none;
        }

        .gm-panel-info {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 12px;
          min-height: 168px;
          padding: clamp(15px, 1.45vw, 21px);
          background: linear-gradient(180deg, rgba(10, 8, 17, 0.84), rgba(6, 5, 11, 0.98));
        }

        .gm-panel-info-top,
        .gm-panel-info-main,
        .gm-panel-info-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-width: 0;
        }

        .gm-panel-count {
          display: inline-flex;
          align-items: baseline;
          color: var(--game-accent);
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .gm-panel-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 28px;
          padding: 5px 10px;
          background: color-mix(in srgb, var(--game-accent) 11%, rgba(8, 6, 15, 0.72));
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 11.5px;
          font-weight: 700;
          white-space: nowrap;
        }

        .gm-panel-info-main h3 {
          min-width: 0;
          margin: 0;
          color: #fff;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900;
          font-size: clamp(20px, 2vw, 30px);
          line-height: 1.04;
          letter-spacing: 0;
          text-transform: none;
        }

        .gm-panel:nth-child(n + 3) .gm-panel-info-main h3 {
          font-size: clamp(19px, 1.55vw, 24px);
        }

        .gm-panel-platform,
        .gm-panel-open {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          flex: 0 0 auto;
          color: rgba(255, 255, 255, 0.74);
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 650;
          white-space: nowrap;
        }

        .gm-panel-platform svg,
        .gm-panel-open svg {
          color: var(--game-accent);
        }

        .gm-panel-info-bottom {
          align-items: flex-end;
          padding-top: 13px;
          background: linear-gradient(90deg, color-mix(in srgb, var(--game-accent) 22%, transparent), transparent 54%) top / 100% 1px no-repeat;
        }

        .gm-panel-genre {
          min-width: 0;
          margin: 0;
          color: rgba(255, 255, 255, 0.58);
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          line-height: 1.45;
        }

        .gm-panel-open {
          color: color-mix(in srgb, var(--game-accent) 72%, #ffffff);
          transition: gap 0.24s ease;
        }

        .gm-panel-card:hover .gm-panel-open,
        .gm-panel-card:focus-visible .gm-panel-open {
          gap: 10px;
        }

        /* ====================================================================
           LEDGER + OPERATIONS
           ==================================================================== */
        .gm-ledger,
        .gm-ops {
          position: relative;
          padding: clamp(76px, 9vw, 132px) var(--gm-pad);
          background:
            linear-gradient(90deg, rgba(216, 255, 78, 0.026), transparent 24%, transparent 76%, rgba(183, 156, 255, 0.032)),
            linear-gradient(180deg, #05040a 0%, #08060f 48%, #05040a 100%);
        }

        .gm-ledger {
          position: relative;
          padding: clamp(76px, 9vw, 132px) var(--gm-pad);
          /* Bridges .gm-showcase (ends ~#05040a) into .gm-ops (starts #05040a)
             so all three sections read as one continuous dark plate. */
          background:
            linear-gradient(90deg, rgba(216, 255, 78, 0.026), transparent 24%, transparent 76%, rgba(183, 156, 255, 0.032)),
            linear-gradient(180deg, #05040a 0%, #08060f 50%, #05040a 100%);
        }

        .gm-ledger::before,
        .gm-ops::before {
          content: '';
          position: absolute;
          left: var(--gm-pad);
          right: var(--gm-pad);
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(216, 255, 78, 0.42), rgba(255, 255, 255, 0.1), transparent);
        }

        .gm-ledger-inner,
        .gm-ops-inner {
          width: min(100%, var(--gm-max));
          margin: 0 auto;
        }

        .gm-ledger-head {
          display: grid;
          grid-template-columns: minmax(0, 0.72fr) minmax(280px, 0.28fr);
          gap: clamp(24px, 4vw, 64px);
          align-items: end;
          margin-bottom: clamp(28px, 4vw, 52px);
        }

        .gm-ledger-head h2,
        .gm-ops-copy h2 {
          margin: 0;
          max-width: 760px;
          color: #f7f4ff !important;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: clamp(34px, 4.5vw, 68px);
          font-weight: 900;
          line-height: 1.02;
          letter-spacing: 0;
        }

        .gm-ledger-list {
          display: grid;
        }

        .gm-ledger-row {
          --game-accent: #b79cff;
          display: grid;
          grid-template-columns: 72px minmax(0, 1fr) minmax(240px, 0.34fr);
          gap: clamp(16px, 2.2vw, 34px);
          align-items: center;
          min-height: 96px;
          padding: 22px 0;
          color: inherit;
          background:
            linear-gradient(90deg, color-mix(in srgb, var(--game-accent) 16%, transparent), transparent 34%) bottom / 100% 1px no-repeat;
          transition: transform 0.3s ease, background-size 0.3s ease;
        }

        .gm-ledger-row:hover,
        .gm-ledger-row:focus-visible {
          transform: translateX(8px);
          background:
            linear-gradient(90deg, color-mix(in srgb, var(--game-accent) 42%, transparent), transparent 52%) bottom / 100% 1px no-repeat;
        }

        .gm-ledger-row:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--game-accent) 72%, #ffffff);
          outline-offset: 8px;
        }

        .gm-ledger-index {
          color: var(--game-accent);
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .gm-ledger-main {
          display: grid;
          gap: 8px;
          min-width: 0;
        }

        .gm-ledger-main strong {
          color: #fff;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: clamp(23px, 2.4vw, 36px);
          font-weight: 900;
          line-height: 1.05;
        }

        .gm-ledger-main span,
        .gm-ops-copy p,
        .gm-ops-step p {
          color: rgba(255, 255, 255, 0.64);
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.68;
        }

        .gm-ledger-meta {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
          min-width: 0;
        }

        .gm-ledger-meta span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: rgba(255, 255, 255, 0.72);
          font-family: 'Montserrat', 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 650;
          white-space: nowrap;
        }

        .gm-ledger-meta svg {
          color: var(--game-accent);
        }

        .gm-ops-inner {
          display: grid;
          grid-template-columns: minmax(0, 0.44fr) minmax(0, 0.56fr);
          gap: clamp(30px, 5vw, 76px);
          align-items: start;
        }

        .gm-ops-copy {
          position: sticky;
          top: 112px;
        }

        .gm-ops-copy p:not(.gm-mini-label) {
          max-width: 52ch;
          margin: 22px 0 0;
        }

        .gm-ops-grid {
          display: grid;
          gap: 0;
        }

        .gm-ops-step {
          display: grid;
          grid-template-columns: 64px minmax(0, 0.42fr) minmax(0, 0.58fr);
          gap: clamp(14px, 2vw, 26px);
          align-items: start;
          padding: 26px 0;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.13), transparent 64%) bottom / 100% 1px no-repeat;
        }

        .gm-ops-step span {
          color: #d8ff4e;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .gm-ops-step strong {
          color: #fff;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: clamp(18px, 1.5vw, 24px);
          font-weight: 800;
          line-height: 1.12;
        }

        .gm-ops-step p {
          margin: 0;
        }

        /* ====================================================================
           PARTNER CTA
           ==================================================================== */
        .gm-cta {
          position: relative;
          min-height: min(720px, 100dvh);
          display: grid;
          align-items: center;
          overflow: hidden;
          border-top: 1px solid var(--gm-line);
        }

        .gm-cta-visual {
          position: absolute;
          inset: 0;
          will-change: clip-path, transform;
        }

        .gm-cta-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(8, 6, 15, 0.82), rgba(8, 6, 15, 0.18) 55%, rgba(8, 6, 15, 0.62)),
            linear-gradient(180deg, rgba(8, 6, 15, 0.06), rgba(8, 6, 15, 0.6));
        }

        .gm-cta-copy {
          position: relative;
          z-index: 1;
          padding: 0 var(--gm-pad);
        }

        .gm-cta-copy h2 {
          max-width: 760px;
          font-size: clamp(36px, 5.1vw, 72px);
        }

        .gm-cta-copy p:not(.gm-mini-label) {
          max-width: 62ch;
          margin: 20px 0 28px;
        }

        /* ====================================================================
           RESPONSIVE
           ==================================================================== */
        @media (max-width: 1199px) {
          .gm-showcase-track {
            grid-template-columns: repeat(6, minmax(0, 1fr));
          }

          .gm-panel,
          .gm-panel:nth-child(1),
          .gm-panel:nth-child(2),
          .gm-panel:nth-child(n + 3) {
            grid-column: span 3;
          }
        }

        @media (max-width: 991px) {
          .gm-hero-inner {
            grid-template-columns: 1fr;
          }

          .gm-portal-shell {
            min-height: 560px;
          }

          .gm-ledger-head,
          .gm-ops-inner {
            grid-template-columns: 1fr;
          }

          .gm-ops-copy {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 899px) {
          .gm-showcase {
            padding-bottom: 76px;
          }

          .gm-showcase-track {
            width: 100%;
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .gm-panel {
            grid-column: 1 / -1 !important;
          }

          .gm-panel-visual {
            aspect-ratio: 1672 / 941;
          }

          .gm-panel-visual img,
          .gm-panel-visual.is-portrait-source img {
            object-fit: cover;
            object-position: center;
            filter: saturate(0.92) brightness(0.82) contrast(1.08);
          }

          .gm-panel-shade {
            background:
              linear-gradient(180deg, rgba(8, 6, 15, 0.02), rgba(8, 6, 15, 0.18)),
              linear-gradient(90deg, color-mix(in srgb, var(--game-accent) 10%, transparent), transparent 48%);
          }

          .gm-panel-info {
            min-height: 0;
          }

          .gm-panel-info-main,
          .gm-panel-info-bottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .gm-ledger-row {
            grid-template-columns: 44px minmax(0, 1fr);
            align-items: start;
            gap: 12px 18px;
          }

          .gm-ledger-meta {
            grid-column: 2;
            justify-content: flex-start;
          }

          .gm-ops-step {
            grid-template-columns: 44px minmax(0, 1fr);
            gap: 8px 18px;
          }

          .gm-ops-step p {
            grid-column: 2;
          }
        }

        @media (max-width: 767px) {
          .gm-root {
            --gm-pad: 20px;
          }

          .gm-hero {
            padding-top: 94px;
          }

          .gm-hero-title {
            max-width: 12ch;
            font-family: 'Chakra Petch', sans-serif;
            font-weight: 800;
            font-size: clamp(34px, 10.5vw, 44px);
            line-height: 1.1;
          }

          .gm-hero-sub {
            font-size: 14px;
          }

          .gm-hero-facts {
            grid-template-columns: 1fr;
            gap: 12px;
            padding-top: 18px;
          }

          .gm-hero-facts span {
            grid-template-columns: 26px minmax(0, 1fr);
            width: 100%;
            margin-right: 0;
            padding-right: 0;
            border-right: 0;
          }

          .gm-portal-shell {
            min-height: 460px;
          }

          .gm-showcase-head h2,
          .gm-ledger-head h2,
          .gm-ops-copy h2,
          .gm-cta-copy h2 {
            max-width: 11ch;
            font-family: 'Chakra Petch', sans-serif;
            font-weight: 800;
            font-size: clamp(30px, 10vw, 42px);
            line-height: 1.08;
          }

          .gm-panel-info-main h3,
          .gm-panel:nth-child(n + 3) .gm-panel-info-main h3 {
            font-family: 'Chakra Petch', sans-serif;
            font-size: clamp(22px, 7vw, 32px);
            font-weight: 800;
          }

          .gm-panel-card {
            clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          }

          .gm-panel-info {
            padding: 15px;
          }

          .gm-ledger,
          .gm-ops {
            padding-top: 72px;
            padding-bottom: 76px;
          }

          .gm-ledger-row {
            min-height: 0;
            padding: 20px 0;
          }

          .gm-ledger-main strong {
            font-size: clamp(22px, 7vw, 30px);
          }

          .gm-ledger-main span,
          .gm-ops-copy p,
          .gm-ops-step p {
            font-size: 13.5px;
          }

          .gm-ops-step {
            padding: 22px 0;
          }

          .gm-cta {
            min-height: 620px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gm-hero-copy > *,
          .gm-portal-shell,
          .gm-showcase-head .gm-word,
          .gm-panel,
          .gm-ledger-row,
          .gm-ops-step,
          .gm-cta-copy > * {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
          }

          .gm-showcase-track {
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}
