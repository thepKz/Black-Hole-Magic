'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Split a string into word spans so GSAP can light them up one by one.
   Mirrors the project's live `.sw` reveal pattern (ServiceSection7/TeamSection7). */
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

const STATS = [
  { value: 2019, suffix: '', label: 'Năm thành lập' },
  { value: 12, suffix: '+', label: 'Bộ môn thi đấu' },
  { value: 50, suffix: '+', label: 'Danh hiệu quốc gia' },
  { value: 1, suffix: 'M+', label: 'Người hâm mộ' },
];

const VALUES = [
  {
    no: '01',
    title: 'Chiến thắng có kỷ luật',
    desc: 'Chúng tôi không chỉ chơi để thắng — chúng tôi xây hệ thống, luyện tập theo quy trình và bước vào mỗi trận đấu với sự chuẩn bị tuyệt đối.',
  },
  {
    no: '02',
    title: 'Minh bạch tuyệt đối',
    desc: 'Với đối tác, nhà tài trợ và người hâm mộ — số liệu thực, báo cáo thực, không có gì bị che giấu.',
  },
  {
    no: '03',
    title: 'Đại diện Việt Nam',
    desc: 'Từ những giải LAN tại Hà Nội đến sân khấu quốc tế, mỗi trận đấu là một cơ hội đưa tên Việt Nam lên bản đồ esports thế giới.',
  },
  {
    no: '04',
    title: 'Cộng đồng là nền tảng',
    desc: 'Tổ chức mạnh nhất là tổ chức được cộng đồng yêu thương. Chúng tôi xây dựng kết nối trước khi xây dựng chiến thắng.',
  },
];

const TIMELINE = [
  { year: '2019', title: 'Khởi nguồn', desc: 'Black Hole ra đời từ một đội PUBG Mobile nghiệp dư tại Hà Nội với 5 thành viên sáng lập.' },
  { year: '2020', title: 'Chức vô địch đầu tiên', desc: 'Vô địch giải quốc gia đầu tiên — bước ngoặt xác nhận con đường chuyên nghiệp hóa.' },
  { year: '2021', title: 'Mở rộng bộ môn', desc: 'Ra mắt các đội Valorant, Mobile Legends và Liên Minh Huyền Thoại. Đội ngũ tăng lên 30 người.' },
  { year: '2022', title: 'Vươn ra châu lục', desc: 'Ký kết đối tác với các nhà phát hành Hàn Quốc và Singapore, mở đường thi đấu tầm khu vực.' },
  { year: '2023', title: 'Top 8 SEA Championship', desc: 'Lần đầu đại diện Việt Nam vào vòng knock-out giải đấu cấp Đông Nam Á.' },
  { year: '2024', title: 'ICS Group ra đời', desc: 'Thành lập nhánh kinh doanh ICS Group — hệ sinh thái toàn diện: giải đấu, truyền thông, đào tạo.' },
];

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // ── Hero: title letters rise + intro fades, eased entry (not scrub) ──
      gsap.set('.ab-hero-eyebrow, .ab-hero-sub, .ab-hero-cta, .ab-hero-media', { autoAlpha: 0 });
      const heroTl = gsap.timeline({ delay: 0.15 });
      heroTl
        .to('.ab-hero-eyebrow', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .fromTo('.ab-hero-title .ab-line span',
          { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.3')
        .to('.ab-hero-sub', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .to('.ab-hero-cta', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .to('.ab-hero-media', { autoAlpha: 1, duration: 1.1, ease: 'power2.out' }, '-=0.9');

      // subtle parallax on the hero image plate
      gsap.to('.ab-hero-media-inner', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: '.ab-hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
      });

      // ── Manifesto: word-by-word light-up on scroll (the signature beat) ──
      const manifestoWords = gsap.utils.toArray<HTMLElement>('.ab-manifesto .sw');
      if (manifestoWords.length) {
        gsap.fromTo(manifestoWords,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: { trigger: '.ab-manifesto', start: 'top 75%', end: 'top 18%', scrub: 0.6 },
          });
      }

      // ── Stats: count up + fade, staggered ──
      gsap.utils.toArray<HTMLElement>('.ab-stat').forEach((stat, i) => {
        const numEl = stat.querySelector<HTMLElement>('.ab-stat-num');
        const target = Number(numEl?.dataset.value ?? 0);
        const proxy = { v: 0 };
        gsap.timeline({
          scrollTrigger: { trigger: '.ab-stats', start: 'top 78%', once: true },
        })
          .from(stat, { autoAlpha: 0, y: 28, duration: 0.6, delay: i * 0.08, ease: 'power3.out' }, 0)
          .to(proxy, {
            v: target,
            duration: 1.4,
            delay: i * 0.08,
            ease: 'power2.out',
            onUpdate: () => {
              if (numEl) numEl.firstChild!.textContent = String(Math.round(proxy.v));
            },
          }, 0);
      });

      // ── Split fields (mission/vision): image clip-reveal + text rise ──
      gsap.utils.toArray<HTMLElement>('.ab-split').forEach((split) => {
        gsap.timeline({ scrollTrigger: { trigger: split, start: 'top 72%', once: true } })
          .fromTo(split.querySelector('.ab-split-media-inner'),
            { clipPath: 'inset(0 0 100% 0)', scale: 1.12 },
            { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.1, ease: 'power3.out' }, 0)
          .fromTo(split.querySelectorAll('.ab-split-copy > *'),
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 0.25);
      });

      // ── Values rail: each row reveals, hairline draws across ──
      gsap.utils.toArray<HTMLElement>('.ab-vrow').forEach((row) => {
        gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 82%', once: true } })
          .fromTo(row.querySelector('.ab-vrow-line'),
            { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 0)
          .fromTo([row.querySelector('.ab-vrow-no'), row.querySelector('.ab-vrow-main')],
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 0.1);
      });

      // ── Timeline: vertical line draws as you scroll, nodes pop in ──
      gsap.fromTo('.ab-tl-line-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.ab-tl', start: 'top 60%', end: 'bottom 75%', scrub: 0.7 },
        });
      gsap.utils.toArray<HTMLElement>('.ab-tl-item').forEach((item) => {
        gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 82%', once: true } })
          .fromTo(item.querySelector('.ab-tl-dot'),
            { scale: 0, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' }, 0)
          .fromTo(item.querySelectorAll('.ab-tl-content > *'),
            { autoAlpha: 0, x: -22 },
            { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 0.05);
      });

      // ── CTA reveal ──
      gsap.fromTo('.ab-cta-inner > *',
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.ab-cta', start: 'top 78%', once: true },
        });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="ab-root" ref={rootRef}>

      {/* ══ HERO — asymmetric split, pinned-feel title ══════════════════════ */}
      <section className="ab-hero">
        <div className="ab-hero-grain" aria-hidden="true" />
        <div className="ab-hero-lightwell" aria-hidden="true" />

        <div className="ab-hero-inner">
          <div className="ab-hero-left">
            <nav className="ab-breadcrumb ab-hero-eyebrow">
              <Link href="/">Trang chủ</Link>
              <span className="ab-bc-sep">/</span>
              <span className="ab-bc-current">Về chúng tôi</span>
            </nav>

            <h1 className="ab-hero-title">
              <span className="ab-line"><span>Chúng tôi là</span></span>
              <span className="ab-line ab-line-accent"><span>Black Hole</span></span>
            </h1>

            <p className="ab-hero-sub">
              Tổ chức eSports hàng đầu Việt Nam — dựng nên từ kỷ luật, sự minh bạch
              và khát vọng đưa Việt Nam lên bản đồ gaming thế giới.
            </p>

            <div className="ab-hero-cta">
              <Link href="/contact" className="ab-btn ab-btn-primary">Hợp tác cùng chúng tôi</Link>
              <Link href="/team" className="ab-btn ab-btn-ghost">Xem đội tuyển</Link>
            </div>
          </div>

          <div className="ab-hero-media">
            <div className="ab-hero-media-inner">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&h=1200&fit=crop"
                alt="Đội tuyển Black Hole thi đấu"
              />
              <div className="ab-hero-media-tint" aria-hidden="true" />
            </div>
            <div className="ab-hero-tag">
              <span className="ab-hero-tag-num">EST.</span>
              <span className="ab-hero-tag-year">2019</span>
            </div>
          </div>
        </div>

        <div className="ab-hero-scrollcue" aria-hidden="true">
          <span>Cuộn xuống</span>
          <i />
        </div>
      </section>

      {/* ══ MANIFESTO — word-by-word reveal band ════════════════════════════ */}
      <section className="ab-manifesto">
        <span className="ab-section-kicker">Tuyên ngôn</span>
        <p className="ab-manifesto-text">
          <Words text="Hơn cả một đội tuyển. Black Hole là một hệ sinh thái — nơi tài năng được tôi luyện, thương hiệu được dựng xây, và mỗi chiến thắng đều mang theo lá cờ Việt Nam." />
        </p>
      </section>

      {/* ══ STATS RAIL ══════════════════════════════════════════════════════ */}
      <section className="ab-stats">
        {STATS.map((s) => (
          <div className="ab-stat" key={s.label}>
            <div className="ab-stat-num" data-value={s.value}>
              <span>0</span>{s.suffix}
            </div>
            <div className="ab-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ══ SPLIT FIELD 1 — Sứ mệnh (media left, copy right) ════════════════ */}
      <section className="ab-split ab-split--media-left">
        <div className="ab-split-media">
          <div className="ab-split-media-inner">
            <img
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&h=1100&fit=crop"
              alt="Phòng tập luyện của Black Hole"
            />
          </div>
        </div>
        <div className="ab-split-copy">
          <span className="ab-section-kicker">Sứ mệnh</span>
          <h2 className="ab-split-title">Đưa esports Việt Nam<br />ra đấu trường thế giới</h2>
          <p className="ab-split-body">
            Black Hole được thành lập với một sứ mệnh rõ ràng: xây dựng tổ chức esports
            chuyên nghiệp đủ sức cạnh tranh quốc tế — không chỉ về kỹ năng, mà về văn hóa,
            thương hiệu và hệ thống vận hành.
          </p>
          <p className="ab-split-body">
            Chúng tôi tin rằng tài năng Việt Nam không thua kém bất kỳ ai. Việc còn lại
            là tạo ra môi trường, kỷ luật và cơ hội để tài năng ấy tỏa sáng.
          </p>
        </div>
      </section>

      {/* ══ SPLIT FIELD 2 — Tầm nhìn (copy left, media right) ═══════════════ */}
      <section className="ab-split ab-split--media-right">
        <div className="ab-split-copy">
          <span className="ab-section-kicker">Tầm nhìn</span>
          <h2 className="ab-split-title">Năm 2030,<br />một cái tên toàn cầu</h2>
          <p className="ab-split-body">
            Đến năm 2030, Black Hole định vị là một trong những tổ chức esports được nhận
            diện trên toàn cầu — nơi các nhà phát hành quốc tế nghĩ đến đầu tiên khi muốn
            chinh phục thị trường Đông Nam Á.
          </p>
          <p className="ab-split-body">
            Một hệ sinh thái khép kín từ đào tạo tài năng trẻ, vận hành đội tuyển đỉnh cao,
            đến truyền thông và tổ chức giải đấu mang tầm khu vực.
          </p>
        </div>
        <div className="ab-split-media">
          <div className="ab-split-media-inner">
            <img
              src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=900&h=1100&fit=crop"
              alt="Sân khấu thi đấu esports"
            />
          </div>
        </div>
      </section>

      {/* ══ VALUES RAIL ═════════════════════════════════════════════════════ */}
      <section className="ab-values">
        <div className="ab-values-head">
          <span className="ab-section-kicker">Giá trị cốt lõi</span>
          <h2 className="ab-values-title">Những gì định nghĩa Black Hole</h2>
        </div>
        <div className="ab-values-rail">
          {VALUES.map((v) => (
            <div className="ab-vrow" key={v.no}>
              <span className="ab-vrow-line" aria-hidden="true" />
              <span className="ab-vrow-no">{v.no}</span>
              <div className="ab-vrow-main">
                <h3 className="ab-vrow-title">{v.title}</h3>
                <p className="ab-vrow-body">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TIMELINE ════════════════════════════════════════════════════════ */}
      <section className="ab-tl">
        <div className="ab-tl-head">
          <span className="ab-section-kicker">Hành trình</span>
          <h2 className="ab-values-title">Năm năm dựng nên di sản</h2>
        </div>
        <div className="ab-tl-body">
          <div className="ab-tl-line" aria-hidden="true">
            <span className="ab-tl-line-fill" />
          </div>
          {TIMELINE.map((t) => (
            <div className="ab-tl-item" key={t.year}>
              <span className="ab-tl-dot" aria-hidden="true" />
              <div className="ab-tl-content">
                <span className="ab-tl-year">{t.year}</span>
                <h3 className="ab-tl-title">{t.title}</h3>
                <p className="ab-tl-desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════════════ */}
      <section className="ab-cta">
        <div className="ab-cta-lightwell" aria-hidden="true" />
        <div className="ab-cta-inner">
          <span className="ab-section-kicker">Hợp tác</span>
          <h2 className="ab-cta-title">Sẵn sàng vào đấu trường?</h2>
          <p className="ab-cta-sub">
            Dù bạn là nhà tài trợ, đối tác phát hành, hay đơn giản là muốn cùng xây dựng
            tương lai gaming Việt Nam — hãy bắt đầu một cuộc trò chuyện.
          </p>
          <div className="ab-cta-actions">
            <Link href="/contact" className="ab-btn ab-btn-primary">Liên hệ ngay</Link>
            <Link href="/pricing" className="ab-btn ab-btn-ghost">Xem gói hợp tác</Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* ╔════════════════════════════════════════════════════════════════╗
           ║  ABOUT — Dark Luxe, Black Hole brand                            ║
           ╚════════════════════════════════════════════════════════════════╝ */
        .ab-root {
          --ab-bg: #08060f;
          --ab-surface: #0d0a18;
          --ab-purple: #6c5ce7;
          --ab-purple-light: #8b7ae8;
          --ab-purple-bright: #b09cff;
          --ab-hair: rgba(139, 122, 232, 0.14);
          --ab-text: #ffffff;
          --ab-text-soft: rgba(255, 255, 255, 0.62);
          --ab-text-mute: rgba(255, 255, 255, 0.38);
          --ab-maxw: 1280px;
          --ab-pad: clamp(20px, 5vw, 80px);

          position: relative;
          z-index: 1;
          background: var(--ab-bg);
          color: var(--ab-text);
          font-family: var(--font-body-regular, 'Inter', sans-serif);
          overflow: hidden;
        }

        .ab-root .ab-section-kicker {
          display: inline-block;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--ab-purple-light);
          margin-bottom: 22px;
        }

        /* ── Shared buttons ─────────────────────────────────────────────── */
        .ab-root .ab-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 6px;
          transition: transform 0.25s ease, filter 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .ab-root .ab-btn-primary {
          color: #fff;
          background: linear-gradient(135deg, var(--ab-purple), #4b22d8);
          box-shadow: 0 10px 30px rgba(75, 34, 216, 0.4);
        }
        .ab-root .ab-btn-primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.12);
        }
        .ab-root .ab-btn-ghost {
          color: var(--ab-purple-bright);
          border: 1px solid rgba(139, 122, 232, 0.3);
          background: rgba(139, 122, 232, 0.04);
        }
        .ab-root .ab-btn-ghost:hover {
          border-color: rgba(139, 122, 232, 0.6);
          background: rgba(139, 122, 232, 0.1);
          transform: translateY(-2px);
        }

        /* ╔═══ HERO ═══╗ */
        .ab-hero {
          position: relative;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          padding: clamp(120px, 16vh, 200px) var(--ab-pad) clamp(80px, 10vh, 120px);
          background:
            radial-gradient(120% 80% at 78% 8%, rgba(108, 92, 231, 0.22) 0%, transparent 55%),
            linear-gradient(180deg, #0c0820 0%, #08060f 72%);
        }
        .ab-hero-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image:
            linear-gradient(rgba(139,122,232,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,122,232,1) 1px, transparent 1px);
          background-size: 90px 90px;
          mask-image: radial-gradient(80% 80% at 50% 30%, black, transparent 80%);
          -webkit-mask-image: radial-gradient(80% 80% at 50% 30%, black, transparent 80%);
        }
        .ab-hero-lightwell {
          position: absolute; top: -20%; right: -5%;
          width: 60vw; height: 60vw; max-width: 760px; max-height: 760px;
          pointer-events: none;
          background: radial-gradient(closest-side, rgba(124, 92, 255, 0.18), transparent 70%);
          filter: blur(20px);
        }
        .ab-hero-inner {
          position: relative; z-index: 2;
          width: 100%; max-width: var(--ab-maxw); margin: 0 auto;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: clamp(32px, 5vw, 80px);
          align-items: center;
        }
        .ab-hero-left { min-width: 0; }

        .ab-breadcrumb {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
          margin-bottom: 28px;
          transform: translateY(8px);
        }
        .ab-breadcrumb a { color: var(--ab-text-mute); text-decoration: none; transition: color 0.2s; }
        .ab-breadcrumb a:hover { color: var(--ab-purple-bright); }
        .ab-bc-sep { color: rgba(139, 122, 232, 0.4); }
        .ab-bc-current { color: var(--ab-purple-bright); }

        .ab-hero-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900;
          font-size: clamp(44px, 7vw, 92px);
          line-height: 1.02;
          letter-spacing: -0.02em;
          margin: 0 0 28px;
          color: #fff;
        }
        .ab-hero-title .ab-line {
          display: block;
          overflow: hidden;
          padding-bottom: 0.06em;
        }
        .ab-hero-title .ab-line span { display: block; }
        .ab-hero-title .ab-line-accent span {
          color: var(--ab-purple-bright);
          text-shadow: 0 0 40px rgba(139, 122, 232, 0.5);
        }

        .ab-hero-sub {
          font-size: clamp(15px, 1.4vw, 18px);
          line-height: 1.8;
          color: var(--ab-text-soft);
          max-width: 46ch;
          margin: 0 0 36px;
          transform: translateY(16px);
        }
        .ab-hero-cta { display: flex; flex-wrap: wrap; gap: 14px; transform: translateY(16px); }

        .ab-hero-media { position: relative; }
        .ab-hero-media-inner {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
        }
        .ab-hero-media-inner img {
          width: 100%; height: 110%; object-fit: cover; display: block;
        }
        .ab-hero-media-tint {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(108,92,231,0.12) 0%, transparent 35%, rgba(8,6,15,0.72) 100%);
          box-shadow: inset 0 0 0 1px rgba(139, 122, 232, 0.22);
          border-radius: 14px;
        }
        .ab-hero-tag {
          position: absolute; left: -18px; bottom: 34px;
          display: flex; flex-direction: column; align-items: flex-start;
          padding: 14px 20px;
          background: rgba(13, 10, 24, 0.9);
          border: 1px solid rgba(139, 122, 232, 0.3);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        .ab-hero-tag-num {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 11px; letter-spacing: 0.2em; color: var(--ab-text-mute);
        }
        .ab-hero-tag-year {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: 30px; font-weight: 900; line-height: 1; color: var(--ab-purple-bright);
          text-shadow: 0 0 24px rgba(139, 122, 232, 0.5);
        }
        .ab-hero-scrollcue {
          position: absolute; left: 50%; bottom: 26px; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase;
          color: var(--ab-text-mute);
          z-index: 2;
        }
        .ab-hero-scrollcue i {
          width: 1px; height: 38px;
          background: linear-gradient(180deg, var(--ab-purple-light), transparent);
          animation: ab-cue 2s ease-in-out infinite;
        }
        @keyframes ab-cue { 0%,100%{ transform: scaleY(0.4); opacity: 0.5; } 50%{ transform: scaleY(1); opacity: 1; } }

        /* ╔═══ MANIFESTO ═══╗ */
        .ab-manifesto {
          max-width: var(--ab-maxw); margin: 0 auto;
          padding: clamp(90px, 13vw, 170px) var(--ab-pad);
          text-align: left;
        }
        .ab-manifesto .ab-section-kicker { display: block; }
        .ab-manifesto-text {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900;
          font-size: clamp(24px, 3.6vw, 50px);
          line-height: 1.32;
          letter-spacing: -0.01em;
          color: #fff;
          max-width: 22ch;
          margin: 0;
        }
        .ab-manifesto-text .sw { color: inherit; font: inherit; }

        /* ╔═══ STATS ═══╗ */
        .ab-stats {
          max-width: var(--ab-maxw); margin: 0 auto;
          padding: clamp(40px, 6vw, 70px) var(--ab-pad);
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--ab-hair);
          border-bottom: 1px solid var(--ab-hair);
        }
        .ab-stat {
          padding: clamp(16px, 2vw, 30px) clamp(8px, 2vw, 28px);
          text-align: left;
        }
        .ab-stat + .ab-stat { border-left: 1px solid var(--ab-hair); }
        .ab-stat-num {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900;
          font-size: clamp(34px, 4.6vw, 62px);
          line-height: 1;
          color: var(--ab-purple-bright);
          font-variant-numeric: tabular-nums;
          text-shadow: 0 0 30px rgba(139, 122, 232, 0.35);
          margin-bottom: 12px;
        }
        .ab-stat-label {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--ab-text-mute);
        }

        /* ╔═══ SPLIT FIELDS ═══╗ */
        .ab-split {
          max-width: var(--ab-maxw); margin: 0 auto;
          padding: clamp(70px, 10vw, 130px) var(--ab-pad);
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(36px, 6vw, 96px);
          align-items: center;
        }
        .ab-split--media-left .ab-split-media { order: 0; }
        .ab-split-media-inner {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          will-change: clip-path, transform;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
        }
        .ab-split-media-inner img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ab-split-media-inner::after {
          content: ''; position: absolute; inset: 0; border-radius: 14px;
          box-shadow: inset 0 0 0 1px rgba(139, 122, 232, 0.2);
          background: linear-gradient(180deg, transparent 55%, rgba(8,6,15,0.55) 100%);
        }
        .ab-split-copy { min-width: 0; }
        .ab-split-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900;
          font-size: clamp(28px, 3.4vw, 46px);
          line-height: 1.16;
          letter-spacing: -0.02em;
          color: #fff;
          margin: 0 0 26px;
        }
        .ab-split-body {
          font-size: 15.5px; line-height: 1.85; color: var(--ab-text-soft);
          max-width: 54ch; margin: 0 0 18px;
        }
        .ab-split-body:last-child { margin-bottom: 0; }

        /* ╔═══ VALUES RAIL ═══╗ */
        .ab-values {
          max-width: var(--ab-maxw); margin: 0 auto;
          padding: clamp(70px, 10vw, 130px) var(--ab-pad);
        }
        .ab-values-head { margin-bottom: clamp(40px, 6vw, 72px); max-width: 32ch; }
        .ab-values-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900;
          font-size: clamp(28px, 3.6vw, 48px);
          line-height: 1.14;
          letter-spacing: -0.02em;
          color: #fff;
          margin: 0;
        }
        .ab-values-rail { display: flex; flex-direction: column; }
        .ab-vrow {
          position: relative;
          display: grid;
          grid-template-columns: clamp(60px, 8vw, 110px) 1fr;
          gap: clamp(20px, 4vw, 60px);
          padding: clamp(28px, 3.5vw, 46px) 0;
          align-items: start;
        }
        .ab-vrow-line {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, rgba(139,122,232,0.5), rgba(139,122,232,0.06) 70%, transparent);
          transform-origin: left center;
        }
        .ab-vrow:last-child::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, rgba(139,122,232,0.5), rgba(139,122,232,0.06) 70%, transparent);
        }
        .ab-vrow-no {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900;
          font-size: clamp(22px, 2.4vw, 34px);
          color: rgba(139, 122, 232, 0.55);
          font-variant-numeric: tabular-nums;
          line-height: 1.2;
        }
        .ab-vrow-title {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: clamp(18px, 1.8vw, 24px);
          font-weight: 700;
          color: #fff;
          margin: 0 0 12px;
          letter-spacing: -0.01em;
        }
        .ab-vrow-body {
          font-size: 15px; line-height: 1.8; color: var(--ab-text-soft);
          max-width: 60ch; margin: 0;
        }

        /* ╔═══ TIMELINE ═══╗ */
        .ab-tl {
          max-width: var(--ab-maxw); margin: 0 auto;
          padding: clamp(70px, 10vw, 130px) var(--ab-pad);
        }
        .ab-tl-head { margin-bottom: clamp(48px, 6vw, 80px); max-width: 30ch; }
        .ab-tl-body { position: relative; padding-left: clamp(28px, 4vw, 48px); }
        .ab-tl-line {
          position: absolute; left: 4px; top: 6px; bottom: 6px; width: 2px;
          background: rgba(139, 122, 232, 0.12);
          border-radius: 2px; overflow: hidden;
        }
        .ab-tl-line-fill {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, var(--ab-purple-light), rgba(108,92,231,0.2));
          transform-origin: top center;
          box-shadow: 0 0 12px rgba(139, 122, 232, 0.6);
        }
        .ab-tl-item {
          position: relative;
          padding: clamp(18px, 2.5vw, 30px) 0 clamp(18px, 2.5vw, 30px) clamp(28px, 4vw, 52px);
        }
        .ab-tl-dot {
          position: absolute; left: calc(clamp(28px, 4vw, 48px) * -1 - 1px); top: clamp(24px, 3vw, 36px);
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--ab-purple-bright);
          box-shadow: 0 0 0 4px rgba(139, 122, 232, 0.16), 0 0 16px rgba(139, 122, 232, 0.8);
          transform: translateX(-50%);
          left: clamp(-44px, -4vw, -28px);
        }
        .ab-tl-year {
          display: inline-block;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900;
          font-size: 13px; letter-spacing: 0.08em;
          color: var(--ab-purple-light);
          font-variant-numeric: tabular-nums;
          margin-bottom: 8px;
        }
        .ab-tl-title {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: clamp(17px, 1.7vw, 22px); font-weight: 700;
          color: #fff; margin: 0 0 8px; letter-spacing: -0.01em;
        }
        .ab-tl-desc {
          font-size: 14.5px; line-height: 1.8; color: var(--ab-text-soft);
          max-width: 58ch; margin: 0;
        }

        /* ╔═══ CTA ═══╗ */
        .ab-cta {
          position: relative; overflow: hidden;
          padding: clamp(90px, 12vw, 150px) var(--ab-pad);
          text-align: center;
        }
        .ab-cta-lightwell {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: 90vw; height: 60vh; max-width: 900px;
          pointer-events: none;
          background: radial-gradient(closest-side, rgba(108, 92, 231, 0.16), transparent 70%);
          filter: blur(10px);
        }
        .ab-cta-inner { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; }
        .ab-cta-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900;
          font-size: clamp(32px, 5vw, 62px);
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #fff;
          margin: 0 0 20px;
          text-shadow: 0 0 50px rgba(139, 122, 232, 0.35);
        }
        .ab-cta-sub {
          font-size: 16px; line-height: 1.8; color: var(--ab-text-soft);
          max-width: 52ch; margin: 0 auto 38px;
        }
        .ab-cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        /* ╔═══ RESPONSIVE ═══╗ */
        @media (max-width: 991px) {
          .ab-hero-inner { grid-template-columns: 1fr; gap: 48px; }
          .ab-hero-media { max-width: 460px; }
          .ab-split { grid-template-columns: 1fr; gap: 36px; }
          /* media always below copy on mobile for a clean reading order */
          .ab-split--media-left .ab-split-media,
          .ab-split--media-right .ab-split-media { order: 2; }
          .ab-split-media-inner { aspect-ratio: 16 / 11; max-width: 560px; }
          .ab-stats { grid-template-columns: repeat(2, 1fr); }
          .ab-stat:nth-child(3) { border-left: none; }
          .ab-stat:nth-child(3), .ab-stat:nth-child(4) { border-top: 1px solid var(--ab-hair); }
        }

        @media (max-width: 575px) {
          .ab-hero-tag { left: 12px; }
          .ab-stats { grid-template-columns: 1fr 1fr; }
          .ab-vrow { grid-template-columns: 1fr; gap: 10px; }
          .ab-vrow-no { font-size: 20px; }
        }

        /* Reduced motion: everything visible, no transform jank */
        @media (prefers-reduced-motion: reduce) {
          .ab-hero-eyebrow, .ab-hero-sub, .ab-hero-cta, .ab-hero-media { opacity: 1 !important; visibility: visible !important; transform: none !important; }
          .ab-hero-title .ab-line span { transform: none !important; }
          .ab-manifesto-text .sw { opacity: 1 !important; }
          .ab-hero-scrollcue i { animation: none; }
        }
      `}</style>
    </div>
  );
}
