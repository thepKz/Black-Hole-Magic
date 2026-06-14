'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Post = {
  id: number;
  image: string;
  date: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  slug: string;
};

const FEATURED: Post = {
  id: 0,
  image: 'https://picsum.photos/seed/blackhole-feat/1200/800',
  date: '12 Tháng 6, 2025',
  category: 'Phát hành',
  readTime: '6 phút đọc',
  title: 'Thiên Long Bát Bộ chính thức cập bến Việt Nam cùng Black Hole',
  excerpt: 'Sau nhiều tháng đàm phán và bản địa hóa, tựa MMORPG kiếm hiệp huyền thoại trở lại với máy chủ đặt tại Việt Nam, đồ họa nâng cấp và lộ trình cập nhật riêng cho cộng đồng game thủ Việt.',
  slug: 'thien-long-bat-bo-ra-mat',
};

const POSTS: Post[] = [
  { id: 1, image: 'https://picsum.photos/seed/blackhole-n1/800/600', date: '08 Tháng 6, 2025', category: 'Esports', readTime: '4 phút', title: 'Black Hole vào Top 8 giải đấu khu vực Đông Nam Á', excerpt: 'Lần đầu tiên đại diện Việt Nam tiến sâu vào vòng knock-out, đánh dấu cột mốc mới cho đội tuyển.', slug: 'top-8-sea-championship' },
  { id: 2, image: 'https://picsum.photos/seed/blackhole-n2/800/600', date: '02 Tháng 6, 2025', category: 'Cộng đồng', readTime: '3 phút', title: 'Sự kiện offline cho game thủ Hà Nội thu hút 5.000 người', excerpt: 'Một ngày hội thực sự với giải đấu, gặp gỡ tuyển thủ và những phần quà giới hạn từ nhà phát hành.', slug: 'offline-ha-noi-5000' },
  { id: 3, image: 'https://picsum.photos/seed/blackhole-n3/800/600', date: '28 Tháng 5, 2025', category: 'Phát hành', readTime: '5 phút', title: 'Lộ trình bản địa hóa: từ ngôn ngữ đến văn hóa chơi', excerpt: 'Hậu trường quy trình đưa một tựa game quốc tế đến tay người chơi Việt một cách trọn vẹn.', slug: 'lo-trinh-ban-dia-hoa' },
  { id: 4, image: 'https://picsum.photos/seed/blackhole-n4/800/600', date: '20 Tháng 5, 2025', category: 'Phân tích', readTime: '7 phút', title: 'Vì sao thị trường game Việt Nam hấp dẫn nhà phát hành quốc tế', excerpt: 'Góc nhìn dữ liệu về quy mô, hành vi người chơi và tiềm năng tăng trưởng của thị trường.', slug: 'thi-truong-game-viet-nam' },
];

const CATEGORIES = [
  { name: 'Phát hành', count: 12 },
  { name: 'Esports', count: 8 },
  { name: 'Cộng đồng', count: 15 },
  { name: 'Phân tích', count: 6 },
  { name: 'Sự kiện', count: 9 },
];

export default function NewsPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.set('.nw-hero-eyebrow, .nw-hero-sub', { autoAlpha: 0 });
      gsap.timeline({ delay: 0.12 })
        .to('.nw-hero-eyebrow', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .fromTo('.nw-hero-title .nw-line span', { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.3')
        .to('.nw-hero-sub', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');

      gsap.fromTo('.nw-feat',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.nw-feat', start: 'top 80%', once: true } });
      gsap.fromTo('.nw-feat-img',
        { clipPath: 'inset(0 0 0 100%)', scale: 1.1 },
        { clipPath: 'inset(0 0 0 0%)', scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.nw-feat', start: 'top 78%', once: true } });

      gsap.fromTo('.nw-card',
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: '.nw-grid', start: 'top 82%', once: true } });

      gsap.fromTo('.nw-aside > *',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.nw-aside', start: 'top 82%', once: true } });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="nw-root" ref={rootRef}>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="nw-hero">
        <div className="nw-hero-grid-bg" aria-hidden="true" />
        <div className="nw-hero-lightwell" aria-hidden="true" />
        <div className="nw-hero-inner">
          <nav className="nw-breadcrumb nw-hero-eyebrow">
            <Link href="/">Trang chủ</Link>
            <span className="nw-bc-sep">/</span>
            <span className="nw-bc-current">Tin tức</span>
          </nav>
          <h1 className="nw-hero-title">
            <span className="nw-line"><span>Tin tức &amp;</span></span>
            <span className="nw-line nw-line-accent"><span>câu chuyện</span></span>
          </h1>
          <p className="nw-hero-sub">
            Cập nhật mới nhất về các tựa game Black Hole phát hành, hành trình đội tuyển,
            sự kiện cộng đồng và góc nhìn về thị trường game Việt Nam.
          </p>
        </div>
      </section>

      {/* ══ FEATURED ════════════════════════════════════════════════════════ */}
      <section className="nw-feat-wrap">
        <Link href={`/news/${FEATURED.slug}`} className="nw-feat">
          <div className="nw-feat-media">
            <div className="nw-feat-img" style={{ backgroundImage: `url(${FEATURED.image})` }} />
            <div className="nw-feat-tint" aria-hidden="true" />
            <span className="nw-badge nw-badge-feat">Nổi bật</span>
          </div>
          <div className="nw-feat-body">
            <div className="nw-meta">
              <span className="nw-cat">{FEATURED.category}</span>
              <span className="nw-dot" />
              <span>{FEATURED.date}</span>
              <span className="nw-dot" />
              <span>{FEATURED.readTime}</span>
            </div>
            <h2 className="nw-feat-title">{FEATURED.title}</h2>
            <p className="nw-feat-excerpt">{FEATURED.excerpt}</p>
            <span className="nw-readmore">Đọc bài viết
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M9.41 8.47 1.88 16 0 14.12l7.53-7.53L.94 0H16v15.06z" fill="currentColor" />
              </svg>
            </span>
          </div>
        </Link>
      </section>

      {/* ══ GRID + SIDEBAR ══════════════════════════════════════════════════ */}
      <section className="nw-main">
        <div className="nw-main-inner">
          <div className="nw-content">
            <div className="nw-content-head">
              <span className="nw-section-kicker">Bài viết mới nhất</span>
            </div>
            <div className="nw-grid">
              {POSTS.map((p) => (
                <Link href={`/news/${p.slug}`} className="nw-card" key={p.id}>
                  <div className="nw-card-media">
                    <div className="nw-card-img" style={{ backgroundImage: `url(${p.image})` }} />
                    <span className="nw-badge">{p.category}</span>
                  </div>
                  <div className="nw-card-body">
                    <div className="nw-meta">
                      <span>{p.date}</span>
                      <span className="nw-dot" />
                      <span>{p.readTime}</span>
                    </div>
                    <h3 className="nw-card-title">{p.title}</h3>
                    <p className="nw-card-excerpt">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="nw-aside">
            <div className="nw-widget">
              <h4 className="nw-widget-title">Chuyên mục</h4>
              <ul className="nw-cats">
                {CATEGORIES.map((c) => (
                  <li key={c.name}>
                    <Link href="/news">{c.name}</Link>
                    <span>{String(c.count).padStart(2, '0')}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nw-widget">
              <h4 className="nw-widget-title">Bài viết gần đây</h4>
              <div className="nw-recent">
                {POSTS.slice(0, 3).map((p) => (
                  <Link href={`/news/${p.slug}`} className="nw-recent-item" key={p.id}>
                    <span className="nw-recent-thumb" style={{ backgroundImage: `url(${p.image})` }} />
                    <span className="nw-recent-text">
                      <span className="nw-recent-title">{p.title}</span>
                      <span className="nw-recent-date">{p.date}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="nw-widget nw-widget-cta">
              <h4 className="nw-widget-cta-title">Đăng ký bản tin</h4>
              <p>Nhận tin game mới &amp; sự kiện sớm nhất.</p>
              <form className="nw-sub" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email của bạn" aria-label="Email" />
                <button type="submit" aria-label="Đăng ký">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M9.41 8.47 1.88 16 0 14.12l7.53-7.53L.94 0H16v15.06z" fill="currentColor" />
                  </svg>
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      <style jsx global>{`
        /* ╔══════════════════════════════════════════════════════════════════╗
           ║  NEWS — Dark Luxe, Black Hole                                     ║
           ╚══════════════════════════════════════════════════════════════════╝ */
        .nw-root {
          --nw-bg: #08060f;
          --nw-purple: #6c5ce7;
          --nw-purple-light: #8b7ae8;
          --nw-purple-bright: #b09cff;
          --nw-hair: rgba(139, 122, 232, 0.14);
          --nw-text-soft: rgba(255, 255, 255, 0.62);
          --nw-text-mute: rgba(255, 255, 255, 0.4);
          --nw-maxw: 1280px;
          --nw-pad: clamp(20px, 5vw, 80px);
          position: relative; z-index: 1;
          background: var(--nw-bg); color: #fff;
          font-family: var(--font-body-regular, 'Inter', sans-serif);
          overflow: hidden;
        }
        .nw-root .nw-section-kicker {
          display: inline-block;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--nw-purple-light); margin-bottom: 20px;
        }
        .nw-root .nw-meta {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--nw-text-mute);
          margin-bottom: 14px;
        }
        .nw-root .nw-meta .nw-cat { color: var(--nw-purple-bright); }
        .nw-root .nw-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(139, 122, 232, 0.5); }
        .nw-root .nw-badge {
          position: absolute; top: 14px; left: 14px; z-index: 2;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #fff;
          padding: 6px 12px; border-radius: 6px;
          background: rgba(13, 10, 24, 0.78); border: 1px solid rgba(139, 122, 232, 0.3); backdrop-filter: blur(6px);
        }
        .nw-root .nw-badge-feat { background: linear-gradient(135deg, rgba(108,92,231,0.92), rgba(75,34,216,0.92)); border-color: rgba(139, 122, 232, 0.5); }

        /* ── HERO ── */
        .nw-hero {
          position: relative;
          padding: clamp(130px, 18vh, 200px) var(--nw-pad) clamp(40px, 6vh, 70px);
          background:
            radial-gradient(110% 70% at 78% 4%, rgba(108, 92, 231, 0.2) 0%, transparent 55%),
            linear-gradient(180deg, #0c0820 0%, #08060f 82%);
        }
        .nw-hero-grid-bg {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image:
            linear-gradient(rgba(139,122,232,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,122,232,1) 1px, transparent 1px);
          background-size: 92px 92px;
          mask-image: radial-gradient(80% 80% at 50% 26%, black, transparent 80%);
          -webkit-mask-image: radial-gradient(80% 80% at 50% 26%, black, transparent 80%);
        }
        .nw-hero-lightwell {
          position: absolute; top: -16%; right: -6%; width: 54vw; height: 54vw; max-width: 700px; max-height: 700px;
          pointer-events: none; background: radial-gradient(closest-side, rgba(124, 92, 255, 0.16), transparent 70%); filter: blur(20px);
        }
        .nw-hero-inner { position: relative; z-index: 2; max-width: var(--nw-maxw); margin: 0 auto; }
        .nw-breadcrumb {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 26px; transform: translateY(8px);
        }
        .nw-breadcrumb a { color: var(--nw-text-mute); text-decoration: none; transition: color 0.2s; }
        .nw-breadcrumb a:hover { color: var(--nw-purple-bright); }
        .nw-bc-sep { color: rgba(139, 122, 232, 0.4); }
        .nw-bc-current { color: var(--nw-purple-bright); }
        .nw-hero-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(40px, 6.4vw, 84px); line-height: 1.02; letter-spacing: -0.02em;
          margin: 0 0 22px; color: #fff;
        }
        .nw-hero-title .nw-line { display: block; overflow: hidden; padding-bottom: 0.05em; }
        .nw-hero-title .nw-line span { display: block; }
        .nw-hero-title .nw-line-accent span { color: var(--nw-purple-bright); text-shadow: 0 0 40px rgba(139, 122, 232, 0.5); }
        .nw-hero-sub {
          font-size: clamp(15px, 1.4vw, 18px); line-height: 1.8; color: var(--nw-text-soft);
          max-width: 56ch; margin: 0; transform: translateY(16px);
        }

        /* ── FEATURED ── */
        .nw-feat-wrap { max-width: var(--nw-maxw); margin: 0 auto; padding: clamp(30px, 4vw, 50px) var(--nw-pad) 0; }
        .nw-feat {
          display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 0; text-decoration: none;
          border: 1px solid var(--nw-hair); border-radius: 18px; overflow: hidden;
          background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.012));
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .nw-feat:hover { border-color: rgba(139, 122, 232, 0.4); box-shadow: 0 26px 60px rgba(0, 0, 0, 0.5); }
        .nw-feat-media { position: relative; min-height: 300px; overflow: hidden; }
        .nw-feat-img { position: absolute; inset: 0; background-size: cover; background-position: center; will-change: transform, clip-path; transition: transform 0.6s ease; }
        .nw-feat:hover .nw-feat-img { transform: scale(1.05); }
        .nw-feat-tint { position: absolute; inset: 0; background: linear-gradient(110deg, transparent 40%, rgba(8,6,15,0.4) 100%); }
        .nw-feat-body { padding: clamp(28px, 4vw, 48px); display: flex; flex-direction: column; justify-content: center; }
        .nw-feat-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(22px, 2.6vw, 36px); line-height: 1.18; letter-spacing: -0.02em;
          color: #fff; margin: 0 0 16px;
        }
        .nw-feat-excerpt { font-size: 15px; line-height: 1.8; color: var(--nw-text-soft); margin: 0 0 24px; }
        .nw-readmore {
          display: inline-flex; align-items: center; gap: 9px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--nw-purple-bright);
        }

        /* ── MAIN ── */
        .nw-main { max-width: var(--nw-maxw); margin: 0 auto; padding: clamp(50px, 7vw, 90px) var(--nw-pad) clamp(80px, 10vw, 130px); }
        .nw-main-inner { display: grid; grid-template-columns: 1fr 320px; gap: clamp(36px, 5vw, 64px); align-items: start; }
        .nw-content-head { margin-bottom: 28px; }
        .nw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(18px, 2vw, 26px); }
        .nw-card {
          display: flex; flex-direction: column; text-decoration: none;
          border: 1px solid var(--nw-hair); border-radius: 14px; overflow: hidden;
          background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.012));
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .nw-card:hover { border-color: rgba(139, 122, 232, 0.4); transform: translateY(-4px); box-shadow: 0 22px 50px rgba(0, 0, 0, 0.5); }
        .nw-card-media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; }
        .nw-card-img { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.6s ease; }
        .nw-card:hover .nw-card-img { transform: scale(1.07); }
        .nw-card-body { padding: 22px; }
        .nw-card-title {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 18px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; color: #fff; margin: 0 0 10px;
          transition: color 0.25s ease;
        }
        .nw-card:hover .nw-card-title { color: var(--nw-purple-bright); }
        .nw-card-excerpt { font-size: 14px; line-height: 1.7; color: var(--nw-text-soft); margin: 0; }

        /* ── SIDEBAR ── */
        .nw-aside { display: flex; flex-direction: column; gap: 24px; position: sticky; top: 96px; }
        .nw-widget {
          padding: 26px; border: 1px solid var(--nw-hair); border-radius: 14px;
          background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.012));
        }
        .nw-widget-title {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #fff;
          margin: 0 0 18px; padding-bottom: 14px; border-bottom: 1px solid var(--nw-hair);
        }
        .nw-cats { list-style: none; margin: 0; padding: 0; }
        .nw-cats li { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid rgba(139, 122, 232, 0.08); }
        .nw-cats li:last-child { border-bottom: 0; padding-bottom: 0; }
        .nw-cats li a { color: var(--nw-text-soft); text-decoration: none; font-size: 14.5px; transition: color 0.2s, padding-left 0.2s; }
        .nw-cats li a:hover { color: var(--nw-purple-bright); padding-left: 5px; }
        .nw-cats li span {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; color: var(--nw-text-mute); font-variant-numeric: tabular-nums;
        }
        .nw-recent { display: flex; flex-direction: column; gap: 16px; }
        .nw-recent-item { display: flex; gap: 13px; text-decoration: none; align-items: center; }
        .nw-recent-thumb { flex: 0 0 auto; width: 62px; height: 62px; border-radius: 10px; background-size: cover; background-position: center; border: 1px solid var(--nw-hair); }
        .nw-recent-text { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .nw-recent-title { font-size: 13.5px; font-weight: 600; line-height: 1.4; color: #fff; transition: color 0.2s; }
        .nw-recent-item:hover .nw-recent-title { color: var(--nw-purple-bright); }
        .nw-recent-date {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--nw-text-mute);
        }
        .nw-widget-cta { background: linear-gradient(160deg, rgba(108,92,231,0.14), rgba(75,34,216,0.06)); border-color: rgba(139, 122, 232, 0.28); }
        .nw-widget-cta-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: 18px; font-weight: 900; color: #fff; margin: 0 0 8px;
        }
        .nw-widget-cta p { font-size: 13.5px; line-height: 1.6; color: var(--nw-text-soft); margin: 0 0 16px; }
        .nw-sub { display: flex; gap: 8px; }
        .nw-root .nw-sub input {
          flex: 1; min-width: 0; font-family: var(--font-body-regular, 'Inter', sans-serif);
          font-size: 14px; color: #fff; padding: 11px 14px;
          background: rgba(8, 6, 15, 0.6); border: 1px solid var(--nw-hair); border-radius: 8px;
        }
        .nw-root .nw-sub input::placeholder { color: rgba(255, 255, 255, 0.32); }
        .nw-root .nw-sub input:focus { outline: none; border-color: rgba(139, 122, 232, 0.6); box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.16); }
        .nw-sub button {
          flex: 0 0 auto; width: 44px; border: 0; cursor: pointer; border-radius: 8px; color: #fff;
          background: linear-gradient(135deg, var(--nw-purple), #4b22d8);
          display: inline-flex; align-items: center; justify-content: center;
          transition: filter 0.2s, transform 0.2s;
        }
        .nw-sub button:hover { filter: brightness(1.15); transform: translateY(-1px); }

        /* ── RESPONSIVE ── */
        @media (max-width: 991px) {
          .nw-feat { grid-template-columns: 1fr; }
          .nw-feat-media { aspect-ratio: 16 / 9; min-height: 0; }
          .nw-main-inner { grid-template-columns: 1fr; gap: 44px; }
          .nw-aside { position: static; }
        }
        @media (max-width: 575px) {
          .nw-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nw-hero-eyebrow, .nw-hero-sub, .nw-feat, .nw-card, .nw-aside > * { opacity: 1 !important; visibility: visible !important; transform: none !important; }
          .nw-hero-title .nw-line span { transform: none !important; }
          .nw-feat-img { clip-path: none !important; }
        }
      `}</style>
    </div>
  );
}
