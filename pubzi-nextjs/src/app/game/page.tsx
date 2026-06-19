'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Gamepad2, Globe2, Layers3, Monitor, ShieldCheck, Smartphone } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type FilterKey = 'all' | 'PC' | 'Mobile';

type Game = {
  code: string;
  title: string;
  shortTitle: string;
  genre: string;
  platform: 'PC' | 'Mobile' | 'PC & Mobile';
  filters: FilterKey[];
  poster: string;
  backdrop: string;
  backdropSource?: 'portrait';
  intro: string;
  details: string[];
};

const posterDir = '/assets/img/landing-page/list_game_doc';
const backdropDir = '/assets/img/landing-page/game';

const GAMES: Game[] = [
  {
    code: 'VLTK2',
    title: 'Võ Lâm Truyền Kỳ 2',
    shortTitle: 'VLTK2',
    genre: 'Kiếm hiệp MMORPG',
    platform: 'PC',
    filters: ['PC'],
    poster: `${posterDir}/VLTK2.png`,
    backdrop: `${backdropDir}/VLTK.png`,
    intro: 'Bang hội, chiến trường và những cuộc săn boss lớn được dựng như một thế giới sống.',
    details: ['Đấu phái', 'Bang hội', 'Giao thương'],
  },
  {
    code: 'KT',
    title: 'Kiếm Thế',
    shortTitle: 'Kiếm Thế',
    genre: 'Nhập vai võ hiệp',
    platform: 'PC',
    filters: ['PC'],
    poster: `${posterDir}/Kiếm Thế.png`,
    backdrop: `${backdropDir}/kiem-the.png`,
    intro: 'Nhịp chiến đấu nhanh, chất kiếm hiệp rõ và vòng lặp cộng đồng giữ chân người chơi lâu dài.',
    details: ['Tống Kim', 'Gia tộc', 'Sự kiện mùa'],
  },
  {
    code: 'TLBB',
    title: 'Thiên Long Bát Bộ',
    shortTitle: 'TLBB',
    genre: 'MMORPG võ hiệp',
    platform: 'PC & Mobile',
    filters: ['PC', 'Mobile'],
    poster: `${posterDir}/TLBB.png`,
    backdrop: `${backdropDir}/thien-long-bat-bo.png`,
    intro: 'Một huyền thoại võ hiệp trở lại với khung hình lớn, kỹ năng rõ và nhịp vận hành hiện đại.',
    details: ['Môn phái', 'PvP lớn', 'Ra mắt 2026'],
  },
  {
    code: 'TNGH',
    title: 'Tiếu Ngạo Giang Hồ',
    shortTitle: 'TNGH',
    genre: 'Hành động nhập vai',
    platform: 'PC',
    filters: ['PC'],
    poster: `${posterDir}/Tiếu Ngạo Giang Hồ.png`,
    backdrop: `${backdropDir}/tieu-ngao-giang-ho.png`,
    intro: 'Không khí giang hồ đậm màu điện ảnh, tập trung vào tốc độ, thế võ và cuộc đấu phe phái.',
    details: ['Combo võ học', 'Thế lực', 'Chiến trường'],
  },
  {
    code: 'TT',
    title: 'Tru Tiên',
    shortTitle: 'Tru Tiên',
    genre: 'Tiên hiệp MMORPG',
    platform: 'Mobile',
    filters: ['Mobile'],
    poster: `${posterDir}/Tru Tiên.png`,
    backdrop: `${posterDir}/Tru Tiên.png`,
    backdropSource: 'portrait',
    intro: 'Tiên hiệp kỳ ảo với mood tím sâu, dựng trải nghiệm theo hướng lãng mạn và đại cảnh.',
    details: ['Tiên môn', 'Thú cưỡi', 'Boss thế giới'],
  },
  {
    code: 'SRO',
    title: 'Con Đường Tơ Lụa',
    shortTitle: 'Silkroad',
    genre: 'MMORPG thương lộ',
    platform: 'PC',
    filters: ['PC'],
    poster: `${posterDir}/Con Đường Tơ luaj.png`,
    backdrop: `${backdropDir}/con-duong-to-lua.png`,
    intro: 'Thương nhân, đạo tặc và bảo tiêu va chạm trong một bản đồ rộng có nhiều rủi ro thật.',
    details: ['Trading', 'Job war', 'Boss săn chung'],
  },
];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'PC', label: 'PC' },
  { key: 'Mobile', label: 'Mobile' },
];

function PlatformIcon({ platform }: { platform: Game['platform'] }) {
  if (platform === 'Mobile') return <Smartphone size={17} strokeWidth={1.8} aria-hidden="true" />;
  if (platform === 'PC & Mobile') return <Layers3 size={17} strokeWidth={1.8} aria-hidden="true" />;
  return <Monitor size={17} strokeWidth={1.8} aria-hidden="true" />;
}

function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <span className="gm-word" key={`${word}-${index}`}>
          {word}
        </span>
      ))}
    </>
  );
}

function GameCard({
  game,
  active,
  onActivate,
}: {
  game: Game;
  active: boolean;
  onActivate: (code: string) => void;
}) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const media = card.querySelector<HTMLElement>('.gm-card-media');
    const image = card.querySelector<HTMLElement>('.gm-card-img');
    if (!media || !image) return;

    const rotateX = gsap.quickTo(media, 'rotationX', { duration: 0.45, ease: 'power3.out' });
    const rotateY = gsap.quickTo(media, 'rotationY', { duration: 0.45, ease: 'power3.out' });

    const handleMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      rotateY(gsap.utils.clamp(-6, 6, (px - 0.5) * 12));
      rotateX(gsap.utils.clamp(-6, 6, (0.5 - py) * 12));
    };

    const handleEnter = () => {
      gsap.to(image, { scale: 1.06, duration: 0.65, ease: 'power3.out' });
      gsap.to(card, { y: -6, duration: 0.35, ease: 'power3.out' });
    };

    const handleLeave = () => {
      rotateX(0);
      rotateY(0);
      gsap.to(image, { scale: 1, duration: 0.65, ease: 'power3.out' });
      gsap.to(card, { y: 0, duration: 0.35, ease: 'power3.out' });
    };

    card.addEventListener('pointermove', handleMove);
    card.addEventListener('pointerenter', handleEnter);
    card.addEventListener('pointerleave', handleLeave);

    return () => {
      card.removeEventListener('pointermove', handleMove);
      card.removeEventListener('pointerenter', handleEnter);
      card.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  return (
    <article className={`gm-card ${active ? 'is-active' : ''}`} ref={cardRef}>
      <button
        type="button"
        className="gm-card-link"
        aria-pressed={active}
        aria-label={`Chọn ${game.title}`}
        onClick={() => onActivate(game.code)}
        onFocus={() => onActivate(game.code)}
        onMouseEnter={() => onActivate(game.code)}
      >
        <span className="gm-card-media">
          <Image
            className="gm-card-img"
            src={game.poster}
            alt={game.title}
            fill
            sizes="(max-width: 767px) 180px, 210px"
          />
          <span className="gm-card-shade" aria-hidden="true" />
        </span>
        <span className="gm-card-copy">
          <span className="gm-card-code">{game.code}</span>
          <span className="gm-card-title">{game.shortTitle}</span>
          <span className="gm-card-meta">
            <PlatformIcon platform={game.platform} />
            {game.platform}
          </span>
        </span>
      </button>
    </article>
  );
}

export default function GamePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const panWrapRef = useRef<HTMLElement>(null);
  const panTrackRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [activeCode, setActiveCode] = useState(GAMES[0].code);

  const visibleGames = useMemo(
    () => GAMES.filter((game) => filter === 'all' || game.filters.includes(filter)),
    [filter],
  );

  const activeGame = useMemo(
    () => visibleGames.find((game) => game.code === activeCode) ?? visibleGames[0] ?? GAMES[0],
    [activeCode, visibleGames],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.set('.gm-hero-copy > *, .gm-stage-backdrop, .gm-stage-poster, .gm-stage-rail', {
        autoAlpha: 0,
        y: 28,
      });

      gsap.timeline({ delay: 0.08 })
        .to('.gm-hero-copy > *', {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
        })
        .to('.gm-stage-backdrop', {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
        }, '-=0.55')
        .to('.gm-stage-poster', {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.09,
          ease: 'power3.out',
        }, '-=0.62')
        .to('.gm-stage-rail', {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
        }, '-=0.5');

      gsap.to('.gm-stage-backdrop-img', {
        scale: 1.08,
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.gm-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.gm-stage-poster.is-main', {
        yPercent: -8,
        rotate: -2,
        ease: 'none',
        scrollTrigger: {
          trigger: '.gm-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.fromTo('.gm-showcase-head .gm-word',
        { opacity: 0.16, y: 12 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.035,
          ease: 'none',
          scrollTrigger: {
            trigger: '.gm-showcase-head',
            start: 'top 78%',
            end: 'top 34%',
            scrub: 0.8,
          },
        });

      gsap.fromTo('.gm-catalog-head, .gm-card',
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gm-catalog',
            start: 'top 78%',
            once: true,
          },
        });

      gsap.fromTo('.gm-cta-copy > *',
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gm-cta',
            start: 'top 72%',
            once: true,
          },
        });

      gsap.fromTo('.gm-cta-visual',
        { clipPath: 'inset(0 0 100% 0)', scale: 1.08 },
        {
          clipPath: 'inset(0 0 0% 0)',
          scale: 1,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gm-cta',
            start: 'top 72%',
            once: true,
          },
        });
    }, root);

    const media = gsap.matchMedia();
    media.add('(min-width: 768px)', () => {
      const wrap = panWrapRef.current;
      const track = panTrackRef.current;
      if (!wrap || !track) return undefined;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      gsap.to('.gm-panel-poster', {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
        },
      });

      return () => tween.kill();
    });

    ScrollTrigger.refresh();

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.gm-card',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.045, ease: 'power3.out', overwrite: true });
    }, root);

    return () => ctx.revert();
  }, [filter]);

  return (
    <main className="gm-root" ref={rootRef}>
      <section className="gm-hero">
        <div className="gm-hero-ambient" aria-hidden="true" />
        <div className="gm-hero-inner">
          <div className="gm-hero-copy">
            <nav className="gm-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Trang chủ</Link>
              <span>/</span>
              <span>Danh sách game</span>
            </nav>
            <h1 className="gm-hero-title">
              <span>Game của</span>
              <span>Black Hole</span>
            </h1>
            <p className="gm-hero-sub">
              Tựa kiếm hiệp và nhập vai được bản địa hóa kỹ, vận hành ổn định cho cộng đồng Việt.
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
              <a href="#showcase" className="gm-btn gm-btn-primary">
                Xem game
                <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
              </a>
              <Link href="/contact" className="gm-btn gm-btn-secondary">
                Hợp tác
              </Link>
            </div>
          </div>

          <div className="gm-stage" aria-label="Ảnh nổi bật của catalog game">
            <div className="gm-stage-backdrop">
              <Image
                className="gm-stage-backdrop-img"
                src={GAMES[0].backdrop}
                alt=""
                fill
                priority
                sizes="(max-width: 767px) 92vw, 760px"
              />
            </div>
            <div className="gm-stage-poster is-main">
              <Image
                src={GAMES[0].poster}
                alt={GAMES[0].title}
                fill
                priority
                sizes="(max-width: 767px) 62vw, 330px"
              />
            </div>
            <div className="gm-stage-poster is-secondary">
              <Image
                src={GAMES[2].poster}
                alt={GAMES[2].title}
                fill
                sizes="(max-width: 767px) 36vw, 180px"
              />
            </div>
            <div className="gm-stage-rail" aria-hidden="true">
              {GAMES.slice(1, 5).map((game) => (
                <span className="gm-rail-poster" key={game.code}>
                  <Image src={game.poster} alt="" fill sizes="92px" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="gm-showcase-head" id="showcase">
        <h2>
          <SplitWords text="Duyệt từng thế giới bằng nhịp cuộn" />
        </h2>
        <p>
          Mỗi slide dùng ảnh ngang làm bối cảnh và poster dọc làm tâm điểm, để người chơi nhận ra game ngay trong vài giây.
        </p>
      </section>

      <section className="gm-pan" ref={panWrapRef} aria-label="Showcase game theo scroll">
        <div className="gm-pan-track" ref={panTrackRef}>
          {GAMES.map((game, index) => (
            <article className="gm-panel" key={game.code}>
              <div className={`gm-panel-visual ${game.backdropSource === 'portrait' ? 'is-portrait-source' : ''}`}>
                <Image
                  src={game.backdrop}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 92vw, 760px"
                />
              </div>
              <div className="gm-panel-copy">
                <span className="gm-panel-count">{String(index + 1).padStart(2, '0')}</span>
                <h3>{game.title}</h3>
                <p>{game.intro}</p>
                <div className="gm-panel-meta">
                  <span>
                    <PlatformIcon platform={game.platform} />
                    {game.platform}
                  </span>
                  <span>
                    <Globe2 size={17} strokeWidth={1.8} aria-hidden="true" />
                    {game.genre}
                  </span>
                </div>
                <div className="gm-panel-tags">
                  {game.details.map((detail) => (
                    <span key={detail}>{detail}</span>
                  ))}
                </div>
              </div>
              <div className="gm-panel-poster">
                <Image
                  src={game.poster}
                  alt={game.title}
                  fill
                  sizes="(max-width: 767px) 64vw, 280px"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-catalog" id="catalog">
        <div className="gm-catalog-head">
          <div>
            <p className="gm-mini-label">Chọn nhanh</p>
            <h2>Tất cả tựa game</h2>
          </div>
          <div className="gm-filters" aria-label="Lọc game theo nền tảng">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`gm-filter ${filter === item.key ? 'is-active' : ''}`}
                aria-pressed={filter === item.key}
                onClick={() => setFilter(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {visibleGames.length > 0 ? (
          <div className="gm-catalog-stage">
            <article className="gm-catalog-preview">
              <Image
                key={activeGame.backdrop}
                className="gm-catalog-preview-bg"
                src={activeGame.backdrop}
                alt=""
                fill
                sizes="(max-width: 991px) 92vw, 760px"
              />
              <div className="gm-catalog-preview-shade" aria-hidden="true" />
              <div className="gm-catalog-preview-copy">
                <span className="gm-preview-code">{activeGame.code}</span>
                <h3>{activeGame.title}</h3>
                <p>{activeGame.intro}</p>
                <div className="gm-preview-meta">
                  <span>
                    <PlatformIcon platform={activeGame.platform} />
                    {activeGame.platform}
                  </span>
                  <span>{activeGame.genre}</span>
                </div>
                <Link href="/game-details" className="gm-preview-link">
                  Chi tiết
                  <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
                </Link>
              </div>
              <div className="gm-catalog-preview-poster">
                <Image
                  key={activeGame.poster}
                  src={activeGame.poster}
                  alt={activeGame.title}
                  fill
                  sizes="(max-width: 767px) 170px, 260px"
                />
              </div>
            </article>

            <div className="gm-grid" aria-label="Danh sách game">
              {visibleGames.map((game) => (
                <GameCard
                  key={game.code}
                  game={game}
                  active={game.code === activeGame.code}
                  onActivate={setActiveCode}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="gm-empty">
            Hiện chưa có game trong nhóm này.
          </div>
        )}
      </section>

      <section className="gm-cta">
        <div className="gm-cta-visual">
          <Image
            src={GAMES[5].backdrop}
            alt=""
            fill
            sizes="100vw"
          />
        </div>
        <div className="gm-cta-copy">
          <p className="gm-mini-label">Đối tác phát hành</p>
          <h2>Có game cần vào thị trường Việt?</h2>
          <p>
            Black Hole hỗ trợ bản địa hóa, vận hành cộng đồng, chiến dịch ra mắt và kênh phân phối cho game PC lẫn Mobile.
          </p>
          <Link href="/contact" className="gm-btn gm-btn-primary">
            Hợp tác
            <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <style jsx global>{`
        .gm-root {
          --gm-bg: #08060f;
          --gm-surface: rgba(18, 14, 34, 0.74);
          --gm-surface-strong: rgba(25, 20, 46, 0.92);
          --gm-line: rgba(154, 132, 255, 0.2);
          --gm-line-strong: rgba(172, 154, 255, 0.42);
          --gm-text: rgba(255, 255, 255, 0.94);
          --gm-soft: rgba(255, 255, 255, 0.68);
          --gm-muted: rgba(255, 255, 255, 0.5);
          --gm-accent: #8b7ae8;
          --gm-accent-strong: #b8a7ff;
          --gm-max: 1320px;
          --gm-pad: clamp(20px, 5vw, 76px);
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 82% 4%, rgba(139, 122, 232, 0.2), transparent 34rem),
            linear-gradient(180deg, #0d0920 0%, var(--gm-bg) 30%, #090710 100%);
          color: var(--gm-text);
          font-family: var(--font-body-regular, 'Chakra Petch', sans-serif);
        }

        .gm-root img {
          object-fit: cover;
        }

        .gm-root a {
          color: inherit;
          text-decoration: none;
        }

        .gm-hero {
          position: relative;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          padding: clamp(88px, 10vh, 96px) var(--gm-pad) clamp(48px, 7vh, 76px);
        }

        .gm-hero-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.72;
          background:
            linear-gradient(rgba(139, 122, 232, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 122, 232, 0.07) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(circle at 68% 40%, black 0%, transparent 72%);
          -webkit-mask-image: radial-gradient(circle at 68% 40%, black 0%, transparent 72%);
        }

        .gm-hero-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: var(--gm-max);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.86fr) minmax(420px, 1.14fr);
          gap: clamp(28px, 5vw, 72px);
          align-items: center;
        }

        .gm-hero-copy {
          min-width: 0;
        }

        .gm-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 22px;
          color: var(--gm-muted);
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px;
          letter-spacing: 0.02em;
        }

        .gm-breadcrumb a,
        .gm-breadcrumb span {
          color: var(--gm-muted) !important;
        }

        .gm-breadcrumb span:last-child {
          color: var(--gm-accent-strong) !important;
        }

        .gm-breadcrumb a:hover {
          color: var(--gm-accent-strong) !important;
        }

        .gm-hero-title {
          margin: 0;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: clamp(40px, 5.35vw, 72px);
          line-height: 1.02;
          letter-spacing: 0;
          color: #f7f4ff !important;
          background: transparent !important;
          -webkit-text-fill-color: #f7f4ff !important;
          text-shadow: none !important;
          text-transform: none !important;
        }

        .gm-hero-title span {
          display: block;
        }

        .gm-hero-title span:last-child {
          color: var(--gm-accent-strong) !important;
          -webkit-text-fill-color: var(--gm-accent-strong) !important;
          white-space: nowrap;
        }

        .gm-hero-sub {
          max-width: 48ch;
          margin: 24px 0 0;
          color: var(--gm-soft);
          font-size: clamp(15px, 1.4vw, 18px);
          line-height: 1.72;
        }

        .gm-hero-facts {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 28px 0 0;
        }

        .gm-hero-facts span,
        .gm-panel-meta span,
        .gm-card-meta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .gm-hero-facts span {
          min-height: 40px;
          padding: 8px 12px;
          border: 1px solid var(--gm-line);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          letter-spacing: 0 !important;
          text-transform: none !important;
        }

        .gm-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 30px 0 0;
        }

        .gm-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
          padding: 12px 20px;
          border-radius: 999px;
          border: 1px solid transparent;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 14px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0 !important;
          text-transform: none !important;
          word-spacing: 0.08em;
          white-space: nowrap;
          transition: transform 0.24s ease, border-color 0.24s ease, background 0.24s ease, color 0.24s ease;
        }

        .gm-btn:hover {
          transform: translateY(-2px);
        }

        .gm-btn:active {
          transform: translateY(1px) scale(0.98);
        }

        .gm-root .gm-btn-primary {
          background: #eee8ff;
          color: #150f2d !important;
          border-color: rgba(255, 255, 255, 0.28);
          box-shadow: 0 18px 44px rgba(96, 72, 210, 0.36);
        }

        .gm-root .gm-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #f3efff !important;
          border-color: var(--gm-line-strong);
        }

        .gm-stage {
          position: relative;
          min-height: min(660px, calc(100dvh - 158px));
          perspective: 1200px;
        }

        .gm-stage-backdrop {
          position: absolute;
          inset: 7% 0 8% 10%;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid var(--gm-line-strong);
          background: var(--gm-surface);
          box-shadow: 0 32px 90px rgba(0, 0, 0, 0.58);
        }

        .gm-stage-backdrop::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(8, 6, 15, 0.72), rgba(8, 6, 15, 0.08) 52%, rgba(8, 6, 15, 0.84)),
            linear-gradient(180deg, transparent, rgba(8, 6, 15, 0.72));
        }

        .gm-stage-poster {
          position: absolute;
          overflow: hidden;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: var(--gm-surface-strong);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.72);
        }

        .gm-stage-poster.is-main {
          left: 0;
          bottom: 2%;
          width: min(46%, 340px);
          aspect-ratio: 1122 / 1402;
          transform: rotate(-4deg);
        }

        .gm-stage-poster.is-secondary {
          right: 4%;
          top: 2%;
          width: min(29%, 200px);
          aspect-ratio: 1122 / 1402;
          transform: rotate(6deg);
          opacity: 0.86;
        }

        .gm-stage-rail {
          position: absolute;
          left: 33%;
          right: 10%;
          bottom: 0;
          display: flex;
          gap: 12px;
          padding: 12px;
          border: 1px solid var(--gm-line);
          border-radius: 18px;
          background: rgba(10, 7, 22, 0.72);
          backdrop-filter: blur(18px);
        }

        .gm-rail-poster {
          position: relative;
          display: block;
          flex: 1;
          min-width: 0;
          aspect-ratio: 1122 / 1402;
          overflow: hidden;
          border-radius: 12px;
          opacity: 0.86;
        }

        .gm-showcase-head,
        .gm-catalog,
        .gm-cta-copy {
          max-width: var(--gm-max);
          margin: 0 auto;
          padding-left: var(--gm-pad);
          padding-right: var(--gm-pad);
        }

        .gm-showcase-head {
          padding-top: clamp(76px, 10vw, 130px);
          padding-bottom: clamp(36px, 5vw, 64px);
        }

        .gm-mini-label {
          margin: 0 0 14px;
          color: var(--gm-accent-strong);
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px;
          letter-spacing: 0.04em;
        }

        .gm-showcase-head h2,
        .gm-catalog-head h2,
        .gm-cta-copy h2 {
          margin: 0;
          max-width: 820px;
          color: #f7f4ff;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: clamp(34px, 5.1vw, 70px);
          line-height: 1.02;
          letter-spacing: 0;
        }

        .gm-showcase-head p:last-child,
        .gm-cta-copy p:not(.gm-mini-label) {
          max-width: 62ch;
          margin: 18px 0 0;
          color: var(--gm-soft);
          font-size: 15.5px;
          line-height: 1.75;
        }

        .gm-word {
          display: inline-block;
          margin-right: 0.28em;
        }

        .gm-pan {
          position: relative;
          min-height: 100dvh;
          overflow: hidden;
        }

        .gm-pan-track {
          display: flex;
          align-items: center;
          gap: clamp(18px, 3vw, 34px);
          width: max-content;
          height: 100dvh;
          padding: 0 var(--gm-pad);
          will-change: transform;
        }

        .gm-panel {
          position: relative;
          flex: 0 0 min(1120px, calc(100vw - (var(--gm-pad) * 2)));
          height: min(690px, calc(100dvh - 138px));
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(250px, 0.56fr);
          gap: clamp(20px, 3vw, 34px);
          align-items: stretch;
          overflow: hidden;
          border: 1px solid var(--gm-line);
          border-radius: 26px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.025));
          box-shadow: 0 34px 86px rgba(0, 0, 0, 0.5);
        }

        .gm-panel-visual {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #0b0814;
        }

        .gm-panel-visual img {
          object-position: center;
        }

        .gm-panel-visual.is-portrait-source img {
          filter: blur(8px) saturate(1.08);
          transform: scale(1.08);
        }

        .gm-panel-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(8, 6, 15, 0.22), rgba(8, 6, 15, 0.86)),
            linear-gradient(180deg, rgba(8, 6, 15, 0), rgba(8, 6, 15, 0.62));
        }

        .gm-panel-copy {
          position: absolute;
          z-index: 2;
          left: clamp(22px, 4vw, 52px);
          bottom: clamp(24px, 4vw, 52px);
          width: min(52ch, 48%);
        }

        .gm-panel-count {
          display: block;
          margin-bottom: 14px;
          color: rgba(255, 255, 255, 0.52);
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 15px;
        }

        .gm-panel-copy h3 {
          margin: 0;
          color: #fff;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: clamp(32px, 4vw, 58px);
          line-height: 1.02;
        }

        .gm-panel-copy p {
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: 15px;
          line-height: 1.7;
        }

        .gm-panel-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .gm-panel-meta span,
        .gm-panel-tags span {
          min-height: 36px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(10, 7, 22, 0.66);
          color: rgba(255, 255, 255, 0.8);
          font-size: 12.5px;
          backdrop-filter: blur(14px);
        }

        .gm-panel-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .gm-panel-poster {
          position: relative;
          z-index: 3;
          grid-column: 2;
          align-self: center;
          justify-self: center;
          width: min(78%, 310px);
          aspect-ratio: 1122 / 1402;
          overflow: hidden;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: var(--gm-surface-strong);
          box-shadow: 0 28px 76px rgba(0, 0, 0, 0.65);
          will-change: transform;
        }

        .gm-catalog {
          padding-top: clamp(68px, 8vw, 112px);
          padding-bottom: clamp(84px, 10vw, 138px);
        }

        .gm-catalog-head {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 20px;
          align-items: center;
          margin-bottom: clamp(24px, 4vw, 42px);
        }

        .gm-catalog-head h2 {
          max-width: none;
          background: transparent !important;
          color: #f7f4ff !important;
          -webkit-text-fill-color: #f7f4ff !important;
          text-shadow: none !important;
          font-size: clamp(34px, 4.15vw, 56px);
        }

        .gm-filters {
          display: inline-flex;
          gap: 6px;
          padding: 6px;
          border-radius: 999px;
          border: 1px solid var(--gm-line);
          background: rgba(255, 255, 255, 0.045);
          backdrop-filter: blur(16px);
        }

        .gm-filter {
          appearance: none;
          border: 0;
          min-height: 38px;
          padding: 8px 15px;
          border-radius: 999px;
          background: transparent;
          color: var(--gm-soft);
          cursor: pointer;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px;
          transition: background 0.22s ease, color 0.22s ease, transform 0.22s ease;
        }

        .gm-filter:hover {
          color: #fff;
        }

        .gm-filter:active {
          transform: scale(0.98);
        }

        .gm-filter.is-active {
          background: #eee8ff;
          color: #150f2d !important;
        }

        .gm-catalog-stage {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.74fr);
          gap: clamp(16px, 2vw, 26px);
          align-items: stretch;
        }

        .gm-catalog-preview {
          position: relative;
          min-height: clamp(420px, 42vw, 520px);
          overflow: hidden;
          border-radius: 26px;
          border: 1px solid var(--gm-line-strong);
          background: rgba(255, 255, 255, 0.035);
          box-shadow: 0 34px 82px rgba(0, 0, 0, 0.52);
          isolation: isolate;
        }

        .gm-catalog-preview-bg {
          object-position: center;
          transition: opacity 0.32s ease, transform 0.5s ease;
        }

        .gm-catalog-preview-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(90deg, rgba(8, 6, 15, 0.9), rgba(8, 6, 15, 0.22) 48%, rgba(8, 6, 15, 0.76)),
            linear-gradient(180deg, rgba(8, 6, 15, 0.08), rgba(8, 6, 15, 0.82));
        }

        .gm-catalog-preview-copy {
          position: absolute;
          z-index: 3;
          left: clamp(22px, 4vw, 48px);
          bottom: clamp(22px, 3vw, 38px);
          width: min(48ch, 54%);
        }

        .gm-preview-code {
          display: inline-flex;
          margin-bottom: 14px;
          color: var(--gm-accent-strong);
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 14px;
        }

        .gm-catalog-preview-copy h3 {
          margin: 0;
          color: #fff;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: clamp(32px, 3.6vw, 50px);
          line-height: 1.03;
          letter-spacing: 0;
        }

        .gm-catalog-preview-copy p {
          margin: 16px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 14.5px;
          line-height: 1.72;
        }

        .gm-preview-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }

        .gm-preview-meta span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 36px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(10, 7, 22, 0.6);
          color: rgba(255, 255, 255, 0.8);
          font-size: 12.5px;
          backdrop-filter: blur(14px);
        }

        .gm-preview-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 42px;
          margin-top: 20px;
          padding: 10px 16px;
          border-radius: 999px;
          background: #eee8ff;
          color: #150f2d !important;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px;
          font-weight: 700;
          transition: transform 0.24s ease;
        }

        .gm-preview-link:hover {
          transform: translateY(-2px);
        }

        .gm-catalog-preview-poster {
          position: absolute;
          z-index: 2;
          right: clamp(18px, 4vw, 44px);
          top: 50%;
          width: min(31%, 270px);
          aspect-ratio: 1122 / 1402;
          overflow: hidden;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: var(--gm-surface-strong);
          box-shadow: 0 28px 76px rgba(0, 0, 0, 0.66);
          transform: translateY(-50%) rotate(2deg);
        }

        .gm-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .gm-card {
          min-width: 0;
          will-change: transform;
        }

        .gm-card-link {
          appearance: none;
          width: 100%;
          height: 100%;
          min-height: 172px;
          position: relative;
          display: block;
          overflow: hidden;
          padding: 0;
          border: 1px solid var(--gm-line);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.035);
          color: inherit;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }

        .gm-card-link:hover,
        .gm-card.is-active .gm-card-link {
          border-color: var(--gm-line-strong);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.36);
        }

        .gm-card-media {
          position: absolute;
          inset: 0;
          display: block;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .gm-card-img {
          will-change: transform;
        }

        .gm-card-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(8, 6, 15, 0.02), rgba(8, 6, 15, 0.16) 44%, rgba(8, 6, 15, 0.92)),
            linear-gradient(90deg, rgba(8, 6, 15, 0.5), transparent 45%);
        }

        .gm-card-copy {
          position: absolute;
          inset: auto 14px 14px;
          z-index: 2;
          display: grid;
          gap: 5px;
          min-width: 0;
        }

        .gm-card-code {
          color: var(--gm-accent-strong);
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px;
        }

        .gm-card-title {
          color: #fff;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 18px;
          font-weight: 700;
          line-height: 1.12;
        }

        .gm-card-meta {
          color: rgba(255, 255, 255, 0.66);
          font-size: 12px;
        }

        .gm-empty {
          min-height: 180px;
          display: grid;
          place-items: center;
          border: 1px solid var(--gm-line);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.035);
          color: var(--gm-soft);
        }

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
            linear-gradient(90deg, rgba(8, 6, 15, 0.92), rgba(8, 6, 15, 0.52), rgba(8, 6, 15, 0.92)),
            linear-gradient(180deg, rgba(8, 6, 15, 0.2), rgba(8, 6, 15, 0.9));
        }

        .gm-cta-copy {
          position: relative;
          z-index: 1;
          width: 100%;
        }

        .gm-cta-copy h2 {
          max-width: 760px;
        }

        @media (max-width: 1199px) {
          .gm-catalog-stage {
            grid-template-columns: minmax(0, 1fr) minmax(300px, 0.62fr);
          }

          .gm-card-link {
            min-height: 170px;
          }
        }

        @media (max-width: 991px) {
          .gm-hero-inner {
            grid-template-columns: 1fr;
          }

          .gm-stage {
            min-height: 560px;
          }

          .gm-catalog-stage {
            grid-template-columns: 1fr;
          }

          .gm-catalog-preview {
            min-height: 500px;
          }

          .gm-catalog-preview-poster {
            width: min(28%, 220px);
          }

          .gm-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 767px) {
          .gm-root {
            --gm-pad: 20px;
          }

          .gm-hero {
            padding-top: 92px;
          }

          .gm-hero-title {
            font-family: 'Chakra Petch', sans-serif;
            font-weight: 800;
            font-size: clamp(32px, 9.2vw, 40px);
            line-height: 1.14;
          }

          .gm-stage {
            min-height: 460px;
          }

          .gm-stage-backdrop {
            inset: 8% 0 19% 0;
          }

          .gm-stage-poster.is-main {
            width: min(56%, 240px);
          }

          .gm-stage-poster.is-secondary {
            width: min(33%, 150px);
            right: 1%;
          }

          .gm-stage-rail {
            left: 16%;
            right: 0;
            bottom: 1%;
            gap: 8px;
            padding: 8px;
          }

          .gm-showcase-head {
            padding-top: 72px;
          }

          .gm-pan {
            min-height: auto;
            overflow: visible;
          }

          .gm-pan-track {
            width: auto;
            height: auto;
            display: grid;
            padding: 0 var(--gm-pad) 76px;
          }

          .gm-panel {
            flex: none;
            height: auto;
            min-height: 0;
            display: flex;
            flex-direction: column;
            grid-template-columns: none;
            overflow: hidden;
          }

          .gm-panel-copy {
            position: relative;
            z-index: 3;
            width: auto;
            left: auto;
            right: auto;
            bottom: auto;
            padding: 22px 20px 24px;
            background:
              linear-gradient(180deg, rgba(14, 10, 26, 0.92), rgba(8, 6, 15, 0.98)),
              radial-gradient(circle at 20% 0%, rgba(139, 122, 232, 0.18), transparent 18rem);
          }

          .gm-panel-copy h3 {
            font-size: clamp(28px, 9vw, 38px);
          }

          .gm-panel-copy p {
            font-size: 14px;
            line-height: 1.62;
          }

          .gm-panel-poster {
            position: absolute;
            top: 14px;
            right: 14px;
            width: min(31%, 126px);
            border-radius: 14px;
            box-shadow: 0 18px 46px rgba(0, 0, 0, 0.5);
          }

          .gm-panel-visual {
            position: relative;
            inset: auto;
            min-height: 0;
            aspect-ratio: 1672 / 941;
            flex: none;
          }

          .gm-panel-visual img,
          .gm-panel-visual.is-portrait-source img {
            object-fit: contain;
            object-position: center;
            filter: none;
            transform: none;
          }

          .gm-panel-visual::after {
            background:
              linear-gradient(180deg, rgba(8, 6, 15, 0.06), rgba(8, 6, 15, 0.28)),
              linear-gradient(90deg, rgba(8, 6, 15, 0.16), rgba(8, 6, 15, 0));
          }

          .gm-catalog-head {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .gm-catalog-head .gm-mini-label,
          .gm-catalog-head h2 {
            max-width: 9ch;
          }

          .gm-filters {
            justify-self: start;
            max-width: 100%;
            overflow-x: auto;
          }

          .gm-catalog-preview {
            min-height: 570px;
            border-radius: 22px;
          }

          .gm-catalog-preview-shade {
            background:
              linear-gradient(180deg, rgba(8, 6, 15, 0.18), rgba(8, 6, 15, 0.34) 36%, rgba(8, 6, 15, 0.94)),
              linear-gradient(90deg, rgba(8, 6, 15, 0.64), rgba(8, 6, 15, 0.12));
          }

          .gm-catalog-preview-copy {
            left: 20px;
            right: 20px;
            bottom: 22px;
            width: auto;
          }

          .gm-catalog-preview-copy h3 {
            max-width: 10ch;
            font-family: 'Chakra Petch', sans-serif;
            font-size: clamp(30px, 9vw, 40px);
            font-weight: 800;
            line-height: 1.08;
            background: transparent !important;
            color: #fff !important;
            -webkit-text-fill-color: #fff !important;
          }

          .gm-catalog-preview-copy p {
            max-width: 28ch;
            font-size: 13px;
          }

          .gm-catalog-preview-poster {
            top: 22px;
            right: 18px;
            width: min(42%, 166px);
            transform: rotate(4deg);
          }

          .gm-grid {
            display: flex;
            gap: 12px;
            margin-left: calc(var(--gm-pad) * -1);
            margin-right: calc(var(--gm-pad) * -1);
            padding: 0 var(--gm-pad) 10px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
          }

          .gm-grid::-webkit-scrollbar {
            display: none;
          }

          .gm-card {
            flex: 0 0 172px;
            scroll-snap-align: start;
          }

          .gm-card-link {
            min-height: 248px;
          }

          .gm-cta {
            min-height: 620px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gm-hero-copy > *,
          .gm-stage-backdrop,
          .gm-stage-poster,
          .gm-stage-rail,
          .gm-catalog-head,
          .gm-card,
          .gm-cta-copy > * {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
          }

          .gm-pan-track {
            transform: none !important;
          }

          .gm-showcase-head .gm-word {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}
