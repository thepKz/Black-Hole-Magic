'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Word-span split for the scrubbed text reveal — matches the project's `.sw` pattern. */
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

type Game = {
  code: string;
  title: string;
  genre: string;
  platform: string;
  tag: 'PC' | 'Mobile' | 'Global';
  status: string;
  accent: string;
  image: string;
};

const GAMES: Game[] = [
  { code: 'VL2', title: 'Võ Lâm Truyền Kỳ 2', genre: 'MMORPG Kiếm Hiệp', platform: 'PC', tag: 'PC', status: 'Đang phát hành', accent: '#8b7ae8', image: 'https://picsum.photos/seed/blackhole-vl2/800/1000' },
  { code: 'JX2', title: 'Võ Lâm JX2 Global', genre: 'MMORPG Kiếm Hiệp', platform: 'Toàn cầu', tag: 'Global', status: 'Đang phát hành', accent: '#6fa8ff', image: 'https://picsum.photos/seed/blackhole-jx2/800/1000' },
  { code: 'KT', title: 'Kiếm Thế Mobile', genre: 'MMORPG', platform: 'Mobile', tag: 'Mobile', status: 'Đang phát hành', accent: '#b07ae8', image: 'https://picsum.photos/seed/blackhole-kt/800/1000' },
  { code: 'TL', title: 'Con Đường Tơ Lụa', genre: 'MMORPG', platform: 'PC', tag: 'PC', status: 'Sắp ra mắt', accent: '#7adcff', image: 'https://picsum.photos/seed/blackhole-tl/800/1000' },
  { code: 'TLBB', title: 'Thiên Long Bát Bộ', genre: 'MMORPG', platform: 'PC & Mobile', tag: 'PC', status: 'Đang phát hành', accent: '#9d7aff', image: 'https://picsum.photos/seed/blackhole-tlbb/800/1000' },
  { code: 'HHGH', title: 'Hàng Hải Giang Hồ', genre: 'Hành động phiêu lưu', platform: 'Mobile', tag: 'Mobile', status: 'Sắp ra mắt', accent: '#c79bff', image: 'https://picsum.photos/seed/blackhole-hhgh/1200/900' },
];

const FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'PC', label: 'PC' },
  { key: 'Mobile', label: 'Mobile' },
  { key: 'Global', label: 'Toàn cầu' },
];

const FEATURED = GAMES[0];

/* ── 3D-tilt + magnetic glow card (mouse-tracked, GSAP quickTo) ───────────── */
function GameCard({ game, index }: { game: Game; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    const inner = card.querySelector<HTMLElement>('.gc-inner');
    const glow = card.querySelector<HTMLElement>('.gc-glow');
    const media = card.querySelector<HTMLElement>('.gc-media-img');
    if (!inner || !glow || !media) return;

    const rotX = gsap.quickTo(inner, 'rotationX', { duration: 0.5, ease: 'power3' });
    const rotY = gsap.quickTo(inner, 'rotationY', { duration: 0.5, ease: 'power3' });
    const gx = gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power3' });
    const gy = gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power3' });

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rotY(gsap.utils.clamp(-9, 9, (px - 0.5) * 18));
      rotX(gsap.utils.clamp(-9, 9, (0.5 - py) * 18));
      gx(e.clientX - r.left);
      gy(e.clientY - r.top);
    };
    const onEnter = () => {
      gsap.to(glow, { autoAlpha: 1, duration: 0.3 });
      gsap.to(media, { scale: 1.08, duration: 0.6, ease: 'power3.out' });
    };
    const onLeave = () => {
      rotX(0); rotY(0);
      gsap.to(glow, { autoAlpha: 0, duration: 0.4 });
      gsap.to(media, { scale: 1, duration: 0.6, ease: 'power3.out' });
    };

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="gc" ref={cardRef} data-tag={game.tag} style={{ ['--gc-accent' as string]: game.accent }}>
      <div className="gc-inner">
        <div className="gc-glow" aria-hidden="true" />
        <div className="gc-media">
          <div
            className="gc-media-img"
            style={{ backgroundImage: `url(${game.image})` }}
            role="img"
            aria-label={game.title}
          />
          <span className="gc-tag">{game.platform}</span>
          <span className="gc-code">{game.code}</span>
          <span className={`gc-status ${game.status === 'Sắp ra mắt' ? 'is-soon' : ''}`}>
            {game.status}
          </span>
        </div>
        <div className="gc-body">
          <span className="gc-no">{String(index + 1).padStart(2, '0')}</span>
          <div className="gc-text">
            <h3 className="gc-title">{game.title}</h3>
            <p className="gc-genre">{game.genre}</p>
          </div>
          <Link href="/game-details" className="gc-cta" aria-label={`Chơi ${game.title}`}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M9.41 8.47 1.88 16 0 14.12l7.53-7.53L.94 0H16v15.06z" fill="currentColor" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('all');

  const visible = GAMES.filter((g) => filter === 'all' || g.tag === filter);

  // Re-run reveal when the filter changes (cards remount, refresh triggers).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = gsap.utils.toArray<HTMLElement>('.gc');
    gsap.fromTo(cards,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', overwrite: true });
    ScrollTrigger.refresh();
  }, [filter]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // ── Hero entry ──
      gsap.set('.gm-hero-eyebrow, .gm-hero-sub, .gm-hero-cta, .gm-hero-stats, .gm-hero-art', { autoAlpha: 0 });
      gsap.timeline({ delay: 0.12 })
        .to('.gm-hero-eyebrow', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .fromTo('.gm-hero-title .gm-line span', { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.3')
        .to('.gm-hero-sub', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .to('.gm-hero-stats', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
        .to('.gm-hero-cta', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.45')
        .to('.gm-hero-art', { autoAlpha: 1, duration: 1.1, ease: 'power2.out' }, '-=0.9');

      // featured art clip-reveal + parallax
      gsap.fromTo('.gm-hero-art-img',
        { clipPath: 'inset(0 0 100% 0)', scale: 1.15 },
        { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.5 });
      gsap.to('.gm-hero-art-img', {
        yPercent: -10, ease: 'none',
        scrollTrigger: { trigger: '.gm-hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
      });

      // ── Section title word reveal ──
      const titleWords = gsap.utils.toArray<HTMLElement>('.gm-catalog-head .sw');
      if (titleWords.length) {
        gsap.fromTo(titleWords, { opacity: 0.14 },
          { opacity: 1, stagger: 0.05, ease: 'none',
            scrollTrigger: { trigger: '.gm-catalog-head', start: 'top 85%', end: 'top 40%', scrub: 0.6 } });
      }

      // ── Initial card reveal ──
      gsap.fromTo('.gc',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.gm-grid', start: 'top 80%', once: true } });

      // ── Marquee kinetic band ──
      gsap.to('.gm-marquee-track', { xPercent: -50, duration: 26, ease: 'none', repeat: -1 });

      // ── Spotlight band ──
      gsap.fromTo('.gm-spot-media-img',
        { clipPath: 'inset(0 100% 0 0)', scale: 1.12 },
        { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.gm-spot', start: 'top 72%', once: true } });
      gsap.fromTo('.gm-spot-copy > *',
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.gm-spot', start: 'top 68%', once: true } });

      // ── CTA ──
      gsap.fromTo('.gm-cta-inner > *',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.gm-cta', start: 'top 80%', once: true } });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="gm-root" ref={rootRef}>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="gm-hero">
        <div className="gm-hero-grid-bg" aria-hidden="true" />
        <div className="gm-hero-lightwell" aria-hidden="true" />

        <div className="gm-hero-inner">
          <div className="gm-hero-left">
            <nav className="gm-breadcrumb gm-hero-eyebrow">
              <Link href="/">Trang chủ</Link>
              <span className="gm-bc-sep">/</span>
              <span className="gm-bc-current">Danh sách game</span>
            </nav>

            <h1 className="gm-hero-title">
              <span className="gm-line"><span>Thế giới game</span></span>
              <span className="gm-line gm-line-accent"><span>do Black Hole</span></span>
              <span className="gm-line"><span>phát hành</span></span>
            </h1>

            <p className="gm-hero-sub">
              Nhà phát hành game hàng đầu Việt Nam — mang những tựa game đỉnh cao về cho
              cộng đồng, bản địa hóa trọn vẹn và vận hành chuẩn quốc tế.
            </p>

            <div className="gm-hero-stats">
              <div className="gm-hs">
                <span className="gm-hs-num">{GAMES.length}+</span>
                <span className="gm-hs-label">Tựa game phát hành</span>
              </div>
              <div className="gm-hs">
                <span className="gm-hs-num">8M+</span>
                <span className="gm-hs-label">Người chơi</span>
              </div>
              <div className="gm-hs">
                <span className="gm-hs-num">2019</span>
                <span className="gm-hs-label">Từ năm</span>
              </div>
            </div>

            <div className="gm-hero-cta">
              <a href="#catalog" className="gm-btn gm-btn-primary">Khám phá catalog</a>
              <Link href="/contact" className="gm-btn gm-btn-ghost">Đề xuất phát hành</Link>
            </div>
          </div>

          <div className="gm-hero-art">
            <div className="gm-hero-art-frame">
              <div className="gm-hero-art-img" style={{ backgroundImage: `url(${FEATURED.image})` }} />
              <div className="gm-hero-art-tint" aria-hidden="true" />
              <div className="gm-hero-art-badge">
                <span className="gm-hero-art-kicker">Nổi bật</span>
                <span className="gm-hero-art-title">{FEATURED.title}</span>
                <span className="gm-hero-art-genre">{FEATURED.genre}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ═════════════════════════════════════════════════════════ */}
      <div className="gm-marquee" aria-hidden="true">
        <div className="gm-marquee-track">
          {[...GAMES, ...GAMES].map((g, i) => (
            <span key={i} className="gm-marquee-item">
              {g.title}<i className="gm-marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ══ CATALOG ═════════════════════════════════════════════════════════ */}
      <section className="gm-catalog" id="catalog">
        <div className="gm-catalog-head">
          <div>
            <span className="gm-section-kicker">Catalog</span>
            <h2 className="gm-catalog-title">
              <Words text="Chọn cuộc phiêu lưu của bạn" />
            </h2>
          </div>

          <div className="gm-filters" role="tablist" aria-label="Lọc theo nền tảng">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                className={`gm-filter ${filter === f.key ? 'is-active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="gm-grid">
          {visible.map((g, i) => (
            <GameCard key={g.code} game={g} index={i} />
          ))}
        </div>
      </section>

      {/* ══ SPOTLIGHT BAND ══════════════════════════════════════════════════ */}
      <section className="gm-spot">
        <div className="gm-spot-media">
          <div className="gm-spot-media-img" style={{ backgroundImage: `url(${GAMES[4].image})` }} />
        </div>
        <div className="gm-spot-copy">
          <span className="gm-section-kicker">Tâm điểm</span>
          <h2 className="gm-spot-title">{GAMES[4].title}</h2>
          <p className="gm-spot-body">
            Huyền thoại kiếm hiệp trở lại trên cả PC và Mobile — đồ họa nâng cấp, lối chơi
            kinh điển được tái hiện trọn vẹn, vận hành bởi đội ngũ Black Hole với máy chủ
            đặt tại Việt Nam và hỗ trợ 24/7.
          </p>
          <div className="gm-spot-meta">
            <div><span className="gm-spot-meta-k">Thể loại</span><span className="gm-spot-meta-v">{GAMES[4].genre}</span></div>
            <div><span className="gm-spot-meta-k">Nền tảng</span><span className="gm-spot-meta-v">{GAMES[4].platform}</span></div>
            <div><span className="gm-spot-meta-k">Trạng thái</span><span className="gm-spot-meta-v">{GAMES[4].status}</span></div>
          </div>
          <Link href="/game-details" className="gm-btn gm-btn-primary">Vào game</Link>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════════════ */}
      <section className="gm-cta">
        <div className="gm-cta-lightwell" aria-hidden="true" />
        <div className="gm-cta-inner">
          <span className="gm-section-kicker">Đối tác phát hành</span>
          <h2 className="gm-cta-title">Bạn có một tựa game tuyệt vời?</h2>
          <p className="gm-cta-sub">
            Black Hole giúp các nhà phát triển quốc tế chinh phục thị trường Việt Nam và
            Đông Nam Á — từ bản địa hóa, pháp lý, đến vận hành và marketing.
          </p>
          <div className="gm-cta-actions">
            <Link href="/contact" className="gm-btn gm-btn-primary">Hợp tác phát hành</Link>
            <Link href="/service" className="gm-btn gm-btn-ghost">Tìm hiểu ICS Group</Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* ╔══════════════════════════════════════════════════════════════════╗
           ║  GAME CATALOG — Dark Luxe, Black Hole (game publisher)            ║
           ╚══════════════════════════════════════════════════════════════════╝ */
        .gm-root {
          --gm-bg: #08060f;
          --gm-purple: #6c5ce7;
          --gm-purple-light: #8b7ae8;
          --gm-purple-bright: #b09cff;
          --gm-hair: rgba(139, 122, 232, 0.14);
          --gm-text-soft: rgba(255, 255, 255, 0.62);
          --gm-text-mute: rgba(255, 255, 255, 0.4);
          --gm-maxw: 1280px;
          --gm-pad: clamp(20px, 5vw, 80px);

          position: relative; z-index: 1;
          background: var(--gm-bg);
          color: #fff;
          font-family: var(--font-body-regular, 'Inter', sans-serif);
          overflow: hidden;
        }

        .gm-root .gm-section-kicker {
          display: inline-block;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--gm-purple-light); margin-bottom: 20px;
        }

        /* buttons */
        .gm-root .gm-btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 14px 28px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; border-radius: 6px;
          transition: transform 0.25s ease, filter 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .gm-root .gm-btn-primary {
          color: #fff; background: linear-gradient(135deg, var(--gm-purple), #4b22d8);
          box-shadow: 0 10px 30px rgba(75, 34, 216, 0.4);
        }
        .gm-root .gm-btn-primary:hover { transform: translateY(-2px); filter: brightness(1.12); }
        .gm-root .gm-btn-ghost {
          color: var(--gm-purple-bright); border: 1px solid rgba(139, 122, 232, 0.3);
          background: rgba(139, 122, 232, 0.04);
        }
        .gm-root .gm-btn-ghost:hover {
          border-color: rgba(139, 122, 232, 0.6); background: rgba(139, 122, 232, 0.1); transform: translateY(-2px);
        }

        /* ╔═══ HERO ═══╗ */
        .gm-hero {
          position: relative; min-height: 100dvh; display: flex; align-items: center;
          padding: clamp(120px, 16vh, 200px) var(--gm-pad) clamp(70px, 9vh, 110px);
          background:
            radial-gradient(120% 80% at 80% 6%, rgba(108, 92, 231, 0.24) 0%, transparent 55%),
            linear-gradient(180deg, #0c0820 0%, #08060f 74%);
        }
        .gm-hero-grid-bg {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image:
            linear-gradient(rgba(139,122,232,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,122,232,1) 1px, transparent 1px);
          background-size: 92px 92px;
          mask-image: radial-gradient(80% 80% at 50% 30%, black, transparent 80%);
          -webkit-mask-image: radial-gradient(80% 80% at 50% 30%, black, transparent 80%);
        }
        .gm-hero-lightwell {
          position: absolute; top: -18%; right: -6%;
          width: 60vw; height: 60vw; max-width: 780px; max-height: 780px; pointer-events: none;
          background: radial-gradient(closest-side, rgba(124, 92, 255, 0.2), transparent 70%);
          filter: blur(20px);
        }
        .gm-hero-inner {
          position: relative; z-index: 2; width: 100%; max-width: var(--gm-maxw); margin: 0 auto;
          display: grid; grid-template-columns: 1.08fr 0.92fr; gap: clamp(32px, 5vw, 80px); align-items: center;
        }
        .gm-hero-left { min-width: 0; }

        .gm-breadcrumb {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 28px;
          transform: translateY(8px);
        }
        .gm-breadcrumb a { color: var(--gm-text-mute); text-decoration: none; transition: color 0.2s; }
        .gm-breadcrumb a:hover { color: var(--gm-purple-bright); }
        .gm-bc-sep { color: rgba(139, 122, 232, 0.4); }
        .gm-bc-current { color: var(--gm-purple-bright); }

        .gm-hero-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(40px, 6.2vw, 84px); line-height: 1.02;
          letter-spacing: -0.02em; margin: 0 0 26px; color: #fff;
        }
        .gm-hero-title .gm-line { display: block; overflow: hidden; padding-bottom: 0.05em; }
        .gm-hero-title .gm-line span { display: block; }
        .gm-hero-title .gm-line-accent span {
          color: var(--gm-purple-bright); text-shadow: 0 0 40px rgba(139, 122, 232, 0.5);
        }

        .gm-hero-sub {
          font-size: clamp(15px, 1.4vw, 18px); line-height: 1.8; color: var(--gm-text-soft);
          max-width: 48ch; margin: 0 0 32px; transform: translateY(16px);
        }

        .gm-hero-stats { display: flex; gap: clamp(24px, 4vw, 52px); margin-bottom: 36px; transform: translateY(16px); }
        .gm-hs { display: flex; flex-direction: column; }
        .gm-hs-num {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(26px, 2.8vw, 38px); line-height: 1;
          color: var(--gm-purple-bright); font-variant-numeric: tabular-nums;
          text-shadow: 0 0 26px rgba(139, 122, 232, 0.35); margin-bottom: 8px;
        }
        .gm-hs-label {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gm-text-mute);
        }

        .gm-hero-cta { display: flex; flex-wrap: wrap; gap: 14px; transform: translateY(16px); }

        .gm-hero-art { position: relative; perspective: 1200px; }
        .gm-hero-art-frame {
          position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 4 / 5;
          box-shadow: 0 36px 90px rgba(0, 0, 0, 0.65);
        }
        .gm-hero-art-img {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          will-change: transform, clip-path;
        }
        .gm-hero-art-tint {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(108,92,231,0.1) 0%, transparent 30%, rgba(8,6,15,0.9) 100%);
          box-shadow: inset 0 0 0 1px rgba(139, 122, 232, 0.25); border-radius: 16px;
        }
        .gm-hero-art-badge { position: absolute; left: 26px; bottom: 26px; right: 26px; display: flex; flex-direction: column; }
        .gm-hero-art-kicker {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--gm-purple-bright); margin-bottom: 8px;
        }
        .gm-hero-art-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: clamp(20px, 2vw, 28px); font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 4px;
        }
        .gm-hero-art-genre { font-size: 12.5px; color: var(--gm-text-soft); letter-spacing: 0.04em; }

        /* ╔═══ MARQUEE ═══╗ */
        .gm-marquee {
          overflow: hidden; border-top: 1px solid var(--gm-hair); border-bottom: 1px solid var(--gm-hair);
          padding: 22px 0; background: rgba(13, 10, 24, 0.5);
        }
        .gm-marquee-track { display: flex; width: max-content; will-change: transform; }
        .gm-marquee-item {
          display: inline-flex; align-items: center;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: clamp(20px, 2.4vw, 34px); font-weight: 900; letter-spacing: -0.01em;
          color: rgba(255, 255, 255, 0.16); white-space: nowrap; padding: 0 6px;
        }
        .gm-marquee-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--gm-purple-light);
          margin: 0 34px; box-shadow: 0 0 12px rgba(139, 122, 232, 0.8);
        }

        /* ╔═══ CATALOG ═══╗ */
        .gm-catalog { max-width: var(--gm-maxw); margin: 0 auto; padding: clamp(70px, 10vw, 130px) var(--gm-pad); scroll-margin-top: 90px; }
        .gm-catalog-head {
          display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; flex-wrap: wrap;
          margin-bottom: clamp(36px, 5vw, 64px);
        }
        .gm-catalog-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(28px, 3.6vw, 50px); line-height: 1.12;
          letter-spacing: -0.02em; color: #fff; margin: 0; max-width: 18ch;
        }
        .gm-catalog-title .sw { color: inherit; font: inherit; }

        /* filter pills */
        .gm-filters { display: inline-flex; gap: 6px; padding: 5px; border: 1px solid var(--gm-hair); border-radius: 10px; background: rgba(255,255,255,0.02); }
        .gm-filter {
          appearance: none; cursor: pointer; border: 0; background: transparent;
          padding: 9px 18px; border-radius: 7px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
          color: var(--gm-text-mute); transition: color 0.25s ease, background 0.25s ease;
        }
        .gm-filter:hover { color: var(--gm-purple-bright); }
        .gm-filter.is-active {
          color: #fff; background: linear-gradient(135deg, rgba(108,92,231,0.85), rgba(75,34,216,0.85));
          box-shadow: 0 6px 18px rgba(75, 34, 216, 0.35);
        }

        .gm-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px, 2vw, 26px);
        }

        /* ╔═══ GAME CARD (3D tilt) ═══╗ */
        .gc { perspective: 1000px; }
        .gc-inner {
          position: relative; border-radius: 14px; overflow: hidden;
          background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
          border: 1px solid var(--gm-hair);
          transform-style: preserve-3d; will-change: transform;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .gc:hover .gc-inner {
          border-color: color-mix(in srgb, var(--gc-accent) 55%, transparent);
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.55), 0 0 40px color-mix(in srgb, var(--gc-accent) 22%, transparent);
        }
        .gc-glow {
          position: absolute; top: 0; left: 0; width: 320px; height: 320px;
          margin: -160px 0 0 -160px; border-radius: 50%; pointer-events: none; z-index: 4;
          opacity: 0; visibility: hidden;
          background: radial-gradient(circle, color-mix(in srgb, var(--gc-accent) 35%, transparent) 0%, transparent 60%);
          mix-blend-mode: screen;
        }
        .gc-media {
          position: relative; aspect-ratio: 4 / 5; overflow: hidden;
        }
        .gc-media-img {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          will-change: transform;
        }
        .gc-media::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 45%, rgba(8,6,15,0.92) 100%);
        }
        .gc-tag {
          position: absolute; top: 14px; left: 14px; z-index: 3;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: #fff; padding: 5px 11px; border-radius: 5px;
          background: rgba(13, 10, 24, 0.72); border: 1px solid rgba(139, 122, 232, 0.3); backdrop-filter: blur(6px);
        }
        .gc-code {
          position: absolute; top: 14px; right: 14px; z-index: 3;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: 13px; font-weight: 900; letter-spacing: 0.06em;
          color: color-mix(in srgb, var(--gc-accent) 88%, white);
          text-shadow: 0 0 14px color-mix(in srgb, var(--gc-accent) 60%, transparent);
        }
        .gc-status {
          position: absolute; left: 14px; bottom: 78px; z-index: 3;
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 11px; font-weight: 700; letter-spacing: 0.04em; color: #9ff5c0;
        }
        .gc-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #38e08a; box-shadow: 0 0 8px #38e08a; }
        .gc-status.is-soon { color: #ffd479; }
        .gc-status.is-soon::before { background: #ffb938; box-shadow: 0 0 8px #ffb938; }

        .gc-body {
          position: relative; z-index: 3; display: flex; align-items: center; gap: 14px;
          padding: 18px 18px 20px; margin-top: -60px;
        }
        .gc-no {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: 13px; font-weight: 900; color: rgba(139, 122, 232, 0.55);
          font-variant-numeric: tabular-nums; align-self: flex-start; padding-top: 3px;
        }
        .gc-text { flex: 1; min-width: 0; }
        .gc-title {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 4px; letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .gc-genre { font-size: 12.5px; color: var(--gm-text-mute); margin: 0; letter-spacing: 0.02em; }
        .gc-cta {
          flex: 0 0 auto; width: 42px; height: 42px; border-radius: 8px;
          display: inline-flex; align-items: center; justify-content: center;
          color: #fff; text-decoration: none;
          background: rgba(139, 122, 232, 0.12); border: 1px solid rgba(139, 122, 232, 0.28);
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .gc-cta:hover { background: color-mix(in srgb, var(--gc-accent) 55%, transparent); transform: translateY(-2px); }

        /* ╔═══ SPOTLIGHT ═══╗ */
        .gm-spot {
          max-width: var(--gm-maxw); margin: 0 auto; padding: clamp(60px, 8vw, 110px) var(--gm-pad);
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(36px, 5vw, 80px); align-items: center;
        }
        .gm-spot-media-img {
          aspect-ratio: 16 / 11; border-radius: 16px; background-size: cover; background-position: center;
          will-change: transform, clip-path;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55); position: relative;
        }
        .gm-spot-media-img::after {
          content: ''; position: absolute; inset: 0; border-radius: 16px;
          box-shadow: inset 0 0 0 1px rgba(139, 122, 232, 0.2);
        }
        .gm-spot-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(28px, 3.4vw, 46px); line-height: 1.12;
          letter-spacing: -0.02em; color: #fff; margin: 0 0 22px;
        }
        .gm-spot-body { font-size: 15.5px; line-height: 1.85; color: var(--gm-text-soft); max-width: 54ch; margin: 0 0 28px; }
        .gm-spot-meta { display: flex; gap: clamp(20px, 3vw, 40px); margin-bottom: 32px; flex-wrap: wrap; }
        .gm-spot-meta > div { display: flex; flex-direction: column; gap: 5px; }
        .gm-spot-meta-k { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gm-text-mute); font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif); }
        .gm-spot-meta-v { font-size: 14px; color: #fff; font-weight: 600; }

        /* ╔═══ CTA ═══╗ */
        .gm-cta { position: relative; overflow: hidden; padding: clamp(90px, 12vw, 150px) var(--gm-pad); text-align: center; border-top: 1px solid var(--gm-hair); }
        .gm-cta-lightwell {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: 90vw; height: 60vh; max-width: 900px; pointer-events: none;
          background: radial-gradient(closest-side, rgba(108, 92, 231, 0.16), transparent 70%); filter: blur(10px);
        }
        .gm-cta-inner { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; }
        .gm-cta-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(30px, 4.6vw, 56px); line-height: 1.08;
          letter-spacing: -0.02em; color: #fff; margin: 0 0 20px; text-shadow: 0 0 50px rgba(139, 122, 232, 0.35);
        }
        .gm-cta-sub { font-size: 16px; line-height: 1.8; color: var(--gm-text-soft); max-width: 52ch; margin: 0 auto 38px; }
        .gm-cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        /* ╔═══ RESPONSIVE ═══╗ */
        @media (max-width: 991px) {
          .gm-hero-inner { grid-template-columns: 1fr; gap: 44px; }
          .gm-hero-art { max-width: 420px; }
          .gm-grid { grid-template-columns: repeat(2, 1fr); }
          .gm-spot { grid-template-columns: 1fr; gap: 32px; }
          .gm-spot-media-img { max-width: 560px; }
        }
        @media (max-width: 575px) {
          .gm-grid { grid-template-columns: 1fr; }
          .gm-hero-stats { gap: 22px; }
          .gm-catalog-head { flex-direction: column; align-items: flex-start; }
          .gm-filters { width: 100%; overflow-x: auto; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gm-hero-eyebrow, .gm-hero-sub, .gm-hero-cta, .gm-hero-stats, .gm-hero-art { opacity: 1 !important; visibility: visible !important; transform: none !important; }
          .gm-hero-title .gm-line span { transform: none !important; }
          .gm-hero-art-img, .gm-spot-media-img { clip-path: none !important; }
          .gm-catalog-title .sw { opacity: 1 !important; }
          .gc { opacity: 1 !important; visibility: visible !important; }
          .gm-marquee-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
