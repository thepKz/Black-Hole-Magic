'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Word-span split for the scrubbed text reveal. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="sv-sw">
          {w}
          {' '}
        </span>
      ))}
    </>
  );
}

const STATS = [
  { value: '50+', label: 'Khách hàng doanh nghiệp' },
  { value: '4+', label: 'Năm kinh nghiệm' },
  { value: '99.9%', label: 'Uptime cam kết' },
  { value: '24/7', label: 'Giám sát & hỗ trợ' },
];

type Product = {
  code: string;
  name: string;
  tagline: string;
  desc: string;
  accent: string;
  icon: 'shield' | 'soc' | 'endpoint' | 'pentest' | 'agent';
};

const PRODUCTS: Product[] = [
  {
    code: 'VG', name: 'Vietguard', tagline: 'Bảo mật ứng dụng di động', accent: '#8b7ae8', icon: 'shield',
    desc: 'Quét và phát hiện lỗ hổng cho ứng dụng mobile — phân tích mã nguồn, kiểm thử động và cảnh báo rủi ro trước khi kẻ tấn công kịp khai thác.',
  },
  {
    code: 'SOC', name: 'AI SOC', tagline: 'Trung tâm vận hành an ninh', accent: '#6fa8ff', icon: 'soc',
    desc: 'Trung tâm điều hành an ninh thế hệ mới ứng dụng trí tuệ nhân tạo — phát hiện, phân loại và phản ứng sự cố theo thời gian thực, giảm thời gian xử lý xuống vài phút.',
  },
  {
    code: 'CSA', name: 'CSA-Endpoint', tagline: 'Bảo vệ điểm cuối & chống thất thoát', accent: '#b07ae8', icon: 'endpoint',
    desc: 'Bảo vệ toàn diện thiết bị đầu cuối và ngăn rò rỉ dữ liệu (DLP) — kiểm soát mọi luồng dữ liệu rời khỏi tổ chức của bạn.',
  },
  {
    code: 'PT', name: 'Pentest Services', tagline: 'Kiểm thử xâm nhập', accent: '#7adcff', icon: 'pentest',
    desc: 'Đội ngũ chuyên gia mô phỏng tấn công thực chiến vào hệ thống của bạn, tìm ra điểm yếu trước khi tin tặc làm điều đó — kèm báo cáo và lộ trình khắc phục.',
  },
  {
    code: 'VAI', name: 'V AI Agent', tagline: 'Nền tảng chatbot bảo mật', accent: '#9d7aff', icon: 'agent',
    desc: 'Nền tảng trợ lý AI cho doanh nghiệp — tích hợp an toàn vào quy trình, kiểm soát dữ liệu nhạy cảm và tuân thủ chuẩn bảo mật ngay từ thiết kế.',
  },
];

const PROCESS = [
  { k: '01', t: 'Đánh giá', d: 'Khảo sát toàn diện bề mặt tấn công, lập bản đồ tài sản số và xác định rủi ro ưu tiên.' },
  { k: '02', t: 'Triển khai', d: 'Tích hợp giải pháp phù hợp — từ giám sát SOC đến bảo vệ điểm cuối — không gián đoạn vận hành.' },
  { k: '03', t: 'Giám sát', d: 'Theo dõi 24/7, phát hiện bất thường bằng AI và phản ứng sự cố theo thời gian thực.' },
  { k: '04', t: 'Đồng hành', d: 'Báo cáo minh bạch, diễn tập định kỳ và tinh chỉnh liên tục theo bối cảnh mối đe dọa mới.' },
];

const PARTNERS = ['Oracle', 'Gurucul', 'HyperG', 'RAR Center'];
const COMPLIANCE = ['ISO 27001', 'SOC 2'];

function Icon({ name }: { name: Product['icon'] }) {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'shield': return (<svg {...common}><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>);
    case 'soc': return (<svg {...common}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>);
    case 'endpoint': return (<svg {...common}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /><path d="m9 9 1.5 1.5L9 12" /><path d="M13 12h2" /></svg>);
    case 'pentest': return (<svg {...common}><path d="m14.5 4.5 5 5L8 21H3v-5L14.5 4.5Z" /><path d="m12 7 5 5" /></svg>);
    case 'agent': return (<svg {...common}><rect x="4" y="7" width="16" height="11" rx="3" /><path d="M12 7V4M9 12h.01M15 12h.01M9 15.5s1 1 3 1 3-1 3-1" /></svg>);
  }
}

/* 3D-tilt product card. */
function ProductCard({ p, index }: { p: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const inner = card.querySelector<HTMLElement>('.sv-card-inner');
    const glow = card.querySelector<HTMLElement>('.sv-card-glow');
    if (!inner || !glow) return;
    const rotX = gsap.quickTo(inner, 'rotationX', { duration: 0.5, ease: 'power3' });
    const rotY = gsap.quickTo(inner, 'rotationY', { duration: 0.5, ease: 'power3' });
    const gx = gsap.quickTo(glow, 'x', { duration: 0.4, ease: 'power3' });
    const gy = gsap.quickTo(glow, 'y', { duration: 0.4, ease: 'power3' });
    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      rotY(gsap.utils.clamp(-7, 7, ((e.clientX - r.left) / r.width - 0.5) * 14));
      rotX(gsap.utils.clamp(-7, 7, (0.5 - (e.clientY - r.top) / r.height) * 14));
      gx(e.clientX - r.left); gy(e.clientY - r.top);
    };
    const onEnter = () => gsap.to(glow, { autoAlpha: 1, duration: 0.3 });
    const onLeave = () => { rotX(0); rotY(0); gsap.to(glow, { autoAlpha: 0, duration: 0.4 }); };
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
    <div className="sv-card" ref={ref} style={{ ['--sv-accent' as string]: p.accent }} data-feat={index === 0 ? 'true' : undefined}>
      <div className="sv-card-inner">
        <div className="sv-card-glow" aria-hidden="true" />
        <div className="sv-card-top">
          <span className="sv-card-icon"><Icon name={p.icon} /></span>
          <span className="sv-card-code">{p.code}</span>
        </div>
        <h3 className="sv-card-name">{p.name}</h3>
        <p className="sv-card-tagline">{p.tagline}</p>
        <p className="sv-card-desc">{p.desc}</p>
        <Link href="/service-details" className="sv-card-link">
          Tìm hiểu thêm
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M9.41 8.47 1.88 16 0 14.12l7.53-7.53L.94 0H16v15.06z" fill="currentColor" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function ServicePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.set('.sv-hero-eyebrow, .sv-hero-sub, .sv-hero-cta, .sv-hero-badges, .sv-hero-visual', { autoAlpha: 0 });
      gsap.timeline({ delay: 0.12 })
        .to('.sv-hero-eyebrow', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .fromTo('.sv-hero-title .sv-line span', { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.3')
        .to('.sv-hero-sub', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .to('.sv-hero-badges', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
        .to('.sv-hero-cta', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.45')
        .to('.sv-hero-visual', { autoAlpha: 1, duration: 1, ease: 'power2.out' }, '-=0.8');

      gsap.fromTo('.sv-stat',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.sv-stats', start: 'top 82%', once: true } });

      const tw = gsap.utils.toArray<HTMLElement>('.sv-products-head .sv-sw');
      if (tw.length) {
        gsap.fromTo(tw, { opacity: 0.14 },
          { opacity: 1, stagger: 0.05, ease: 'none',
            scrollTrigger: { trigger: '.sv-products-head', start: 'top 85%', end: 'top 42%', scrub: 0.6 } });
      }

      gsap.fromTo('.sv-card',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.sv-grid', start: 'top 80%', once: true } });

      gsap.fromTo('.sv-proc-line-fill', { scaleX: 0 },
        { scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: '.sv-proc-track', start: 'top 70%', end: 'bottom 70%', scrub: 0.7 } });
      gsap.utils.toArray<HTMLElement>('.sv-step').forEach((step) => {
        gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 84%', once: true } })
          .fromTo(step.querySelector('.sv-step-node'), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' }, 0)
          .fromTo(step.querySelectorAll('.sv-step-body > *'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 0.05);
      });

      gsap.fromTo('.sv-trust-inner > *',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.sv-trust', start: 'top 84%', once: true } });

      gsap.fromTo('.sv-cta-inner > *',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.sv-cta', start: 'top 80%', once: true } });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="sv-root" ref={rootRef}>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="sv-hero">
        <div className="sv-hero-grid-bg" aria-hidden="true" />
        <div className="sv-hero-lightwell" aria-hidden="true" />
        <div className="sv-hero-inner">
          <div className="sv-hero-left">
            <nav className="sv-breadcrumb sv-hero-eyebrow">
              <Link href="/">Trang chủ</Link>
              <span className="sv-bc-sep">/</span>
              <span className="sv-bc-current">ICS Group</span>
            </nav>

            <h1 className="sv-hero-title">
              <span className="sv-line"><span>An ninh mạng</span></span>
              <span className="sv-line sv-line-accent"><span>cho kỷ nguyên số</span></span>
            </h1>

            <p className="sv-hero-sub">
              ICS — Công ty An ninh mạng Quốc tế. Chúng tôi không chỉ cung cấp giải pháp,
              mà đồng hành cùng bạn xây dựng một hệ sinh thái số an toàn từ gốc.
            </p>

            <div className="sv-hero-badges">
              {COMPLIANCE.map((c) => (
                <span key={c} className="sv-compliance">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
                  {c}
                </span>
              ))}
            </div>

            <div className="sv-hero-cta">
              <a href="#products" className="sv-btn sv-btn-primary">Khám phá giải pháp</a>
              <Link href="/contact" className="sv-btn sv-btn-ghost">Đặt lịch tư vấn</Link>
            </div>
          </div>

          {/* visual: a "secure core" radar */}
          <div className="sv-hero-visual" aria-hidden="true">
            <div className="sv-radar">
              <span className="sv-radar-ring sv-radar-ring-1" />
              <span className="sv-radar-ring sv-radar-ring-2" />
              <span className="sv-radar-ring sv-radar-ring-3" />
              <span className="sv-radar-sweep" />
              <span className="sv-radar-core">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span className="sv-radar-blip sv-radar-blip-1" />
              <span className="sv-radar-blip sv-radar-blip-2" />
              <span className="sv-radar-blip sv-radar-blip-3" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ═══════════════════════════════════════════════════════════ */}
      <section className="sv-stats">
        {STATS.map((s) => (
          <div className="sv-stat" key={s.label}>
            <div className="sv-stat-num">{s.value}</div>
            <div className="sv-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ══ PRODUCTS ════════════════════════════════════════════════════════ */}
      <section className="sv-products" id="products">
        <div className="sv-products-head">
          <span className="sv-section-kicker">Giải pháp</span>
          <h2 className="sv-products-title">
            <Words text="Bộ giải pháp bảo vệ toàn diện" />
          </h2>
          <p className="sv-products-lede">
            Từ ứng dụng di động đến hạ tầng doanh nghiệp — mỗi sản phẩm của ICS giải quyết
            một lớp phòng thủ, kết hợp lại thành một tấm khiên hoàn chỉnh.
          </p>
        </div>

        <div className="sv-grid">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.code} p={p} index={i} />
          ))}
        </div>
      </section>

      {/* ══ PROCESS ═════════════════════════════════════════════════════════ */}
      <section className="sv-proc">
        <div className="sv-proc-head">
          <span className="sv-section-kicker">Cách chúng tôi bảo vệ bạn</span>
          <h2 className="sv-products-title">Bốn bước, một cam kết</h2>
        </div>
        <div className="sv-proc-track">
          <div className="sv-proc-line" aria-hidden="true"><span className="sv-proc-line-fill" /></div>
          {PROCESS.map((s) => (
            <div className="sv-step" key={s.k}>
              <span className="sv-step-node" aria-hidden="true">{s.k}</span>
              <div className="sv-step-body">
                <h3 className="sv-step-title">{s.t}</h3>
                <p className="sv-step-desc">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TRUST: partners + compliance ════════════════════════════════════ */}
      <section className="sv-trust">
        <div className="sv-trust-inner">
          <span className="sv-section-kicker">Đối tác công nghệ</span>
          <h2 className="sv-trust-title">Được tin cậy trong một hệ sinh thái cao cấp</h2>
          <div className="sv-partners">
            {PARTNERS.map((p) => (
              <span key={p} className="sv-partner">{p}</span>
            ))}
          </div>
          <p className="sv-trust-note">
            Tuân thủ các chuẩn quốc tế ISO 27001 &amp; SOC 2 · Giám sát 24/7 · Cam kết uptime 99.9%
          </p>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════════════ */}
      <section className="sv-cta">
        <div className="sv-cta-lightwell" aria-hidden="true" />
        <div className="sv-cta-inner">
          <span className="sv-section-kicker">Bắt đầu</span>
          <h2 className="sv-cta-title">Hệ thống của bạn đã đủ an toàn chưa?</h2>
          <p className="sv-cta-sub">
            Đặt lịch đánh giá an ninh miễn phí cùng đội ngũ ICS. Chúng tôi sẽ chỉ ra
            những điểm yếu trước khi kẻ tấn công kịp tìm thấy chúng.
          </p>
          <div className="sv-cta-actions">
            <Link href="/contact" className="sv-btn sv-btn-primary">Đặt lịch đánh giá</Link>
            <Link href="/service-details" className="sv-btn sv-btn-ghost">Xem chi tiết dịch vụ</Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* ╔══════════════════════════════════════════════════════════════════╗
           ║  ICS GROUP — Cybersecurity, Dark Luxe                             ║
           ╚══════════════════════════════════════════════════════════════════╝ */
        .sv-root {
          --sv-bg: #08060f;
          --sv-purple: #6c5ce7;
          --sv-purple-light: #8b7ae8;
          --sv-purple-bright: #b09cff;
          --sv-hair: rgba(139, 122, 232, 0.14);
          --sv-text-soft: rgba(255, 255, 255, 0.62);
          --sv-text-mute: rgba(255, 255, 255, 0.4);
          --sv-maxw: 1280px;
          --sv-pad: clamp(20px, 5vw, 80px);
          position: relative; z-index: 1;
          background: var(--sv-bg); color: #fff;
          font-family: var(--font-body-regular, 'Inter', sans-serif);
          overflow: hidden;
        }
        .sv-root .sv-section-kicker {
          display: inline-block;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--sv-purple-light); margin-bottom: 18px;
        }
        .sv-root .sv-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 28px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; border-radius: 6px;
          transition: transform 0.25s ease, filter 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .sv-root .sv-btn-primary { color: #fff; background: linear-gradient(135deg, var(--sv-purple), #4b22d8); box-shadow: 0 10px 30px rgba(75, 34, 216, 0.4); }
        .sv-root .sv-btn-primary:hover { transform: translateY(-2px); filter: brightness(1.12); }
        .sv-root .sv-btn-ghost { color: var(--sv-purple-bright); border: 1px solid rgba(139, 122, 232, 0.3); background: rgba(139, 122, 232, 0.04); }
        .sv-root .sv-btn-ghost:hover { border-color: rgba(139, 122, 232, 0.6); background: rgba(139, 122, 232, 0.1); transform: translateY(-2px); }

        /* ── HERO ── */
        .sv-hero {
          position: relative; min-height: 100dvh; display: flex; align-items: center;
          padding: clamp(120px, 16vh, 200px) var(--sv-pad) clamp(70px, 9vh, 110px);
          background:
            radial-gradient(120% 80% at 82% 6%, rgba(108, 92, 231, 0.24) 0%, transparent 55%),
            linear-gradient(180deg, #0c0820 0%, #08060f 74%);
        }
        .sv-hero-grid-bg {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image:
            linear-gradient(rgba(139,122,232,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,122,232,1) 1px, transparent 1px);
          background-size: 92px 92px;
          mask-image: radial-gradient(80% 80% at 50% 30%, black, transparent 80%);
          -webkit-mask-image: radial-gradient(80% 80% at 50% 30%, black, transparent 80%);
        }
        .sv-hero-lightwell {
          position: absolute; top: -18%; right: -6%; width: 60vw; height: 60vw; max-width: 780px; max-height: 780px;
          pointer-events: none; background: radial-gradient(closest-side, rgba(124, 92, 255, 0.2), transparent 70%); filter: blur(20px);
        }
        .sv-hero-inner {
          position: relative; z-index: 2; width: 100%; max-width: var(--sv-maxw); margin: 0 auto;
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(32px, 5vw, 80px); align-items: center;
        }
        .sv-hero-left { min-width: 0; }
        .sv-breadcrumb {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 28px; transform: translateY(8px);
        }
        .sv-breadcrumb a { color: var(--sv-text-mute); text-decoration: none; transition: color 0.2s; }
        .sv-breadcrumb a:hover { color: var(--sv-purple-bright); }
        .sv-bc-sep { color: rgba(139, 122, 232, 0.4); }
        .sv-bc-current { color: var(--sv-purple-bright); }
        .sv-hero-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(38px, 5.6vw, 78px); line-height: 1.04; letter-spacing: -0.02em;
          margin: 0 0 24px; color: #fff;
        }
        .sv-hero-title .sv-line { display: block; overflow: hidden; padding-bottom: 0.05em; }
        .sv-hero-title .sv-line span { display: block; }
        .sv-hero-title .sv-line-accent span { color: var(--sv-purple-bright); text-shadow: 0 0 40px rgba(139, 122, 232, 0.5); }
        .sv-hero-sub {
          font-size: clamp(15px, 1.4vw, 18px); line-height: 1.8; color: var(--sv-text-soft);
          max-width: 50ch; margin: 0 0 26px; transform: translateY(16px);
        }
        .sv-hero-badges { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 34px; transform: translateY(16px); }
        .sv-compliance {
          display: inline-flex; align-items: center; gap: 7px; padding: 7px 14px; border-radius: 100px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; color: var(--sv-purple-bright);
          background: rgba(139, 122, 232, 0.08); border: 1px solid rgba(139, 122, 232, 0.25);
        }
        .sv-hero-cta { display: flex; flex-wrap: wrap; gap: 14px; transform: translateY(16px); }

        /* radar visual */
        .sv-hero-visual { display: flex; align-items: center; justify-content: center; }
        .sv-radar {
          position: relative; width: clamp(260px, 30vw, 400px); aspect-ratio: 1; display: grid; place-items: center;
        }
        .sv-radar-ring {
          position: absolute; border-radius: 50%; border: 1px solid rgba(139, 122, 232, 0.18); inset: 0; margin: auto;
        }
        .sv-radar-ring-1 { width: 100%; height: 100%; }
        .sv-radar-ring-2 { width: 68%; height: 68%; border-color: rgba(139, 122, 232, 0.26); }
        .sv-radar-ring-3 { width: 38%; height: 38%; border-color: rgba(139, 122, 232, 0.36); }
        .sv-radar-sweep {
          position: absolute; inset: 0; margin: auto; width: 100%; height: 100%; border-radius: 50%;
          background: conic-gradient(from 0deg, rgba(139,122,232,0.35), transparent 38%);
          animation: sv-sweep 4s linear infinite;
        }
        @keyframes sv-sweep { to { transform: rotate(360deg); } }
        .sv-radar-core {
          position: relative; z-index: 2; width: 92px; height: 92px; border-radius: 50%;
          display: grid; place-items: center; color: var(--sv-purple-bright);
          background: radial-gradient(circle at 34% 28%, rgba(139,122,232,0.4), rgba(18,11,46,0.95) 72%);
          box-shadow: 0 0 0 1px rgba(139,122,232,0.5), 0 0 40px rgba(108, 92, 231, 0.4);
        }
        .sv-radar-blip {
          position: absolute; width: 9px; height: 9px; border-radius: 50%; background: var(--sv-purple-bright);
          box-shadow: 0 0 12px rgba(139, 122, 232, 0.9); animation: sv-blip 2.4s ease-in-out infinite;
        }
        .sv-radar-blip-1 { top: 22%; left: 70%; animation-delay: 0s; }
        .sv-radar-blip-2 { top: 64%; left: 26%; animation-delay: 0.8s; }
        .sv-radar-blip-3 { top: 76%; left: 66%; animation-delay: 1.6s; }
        @keyframes sv-blip { 0%, 100% { opacity: 0.3; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.1); } }

        /* ── STATS ── */
        .sv-stats {
          max-width: var(--sv-maxw); margin: 0 auto; padding: clamp(40px, 6vw, 70px) var(--sv-pad);
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--sv-hair); border-bottom: 1px solid var(--sv-hair);
        }
        .sv-stat { padding: clamp(16px, 2vw, 30px) clamp(12px, 2vw, 32px); }
        .sv-stat + .sv-stat { border-left: 1px solid var(--sv-hair); }
        .sv-stat-num {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(30px, 4vw, 52px); line-height: 1; color: var(--sv-purple-bright);
          font-variant-numeric: tabular-nums; text-shadow: 0 0 28px rgba(139, 122, 232, 0.35); margin-bottom: 10px;
        }
        .sv-stat-label {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--sv-text-mute);
        }

        /* ── PRODUCTS ── */
        .sv-products { max-width: var(--sv-maxw); margin: 0 auto; padding: clamp(70px, 10vw, 130px) var(--sv-pad); scroll-margin-top: 90px; }
        .sv-products-head { max-width: 40ch; margin-bottom: clamp(40px, 5vw, 64px); }
        .sv-products-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(28px, 3.6vw, 50px); line-height: 1.12; letter-spacing: -0.02em;
          color: #fff; margin: 0 0 18px;
        }
        .sv-products-title .sv-sw { color: inherit; font: inherit; }
        .sv-products-lede { font-size: 15.5px; line-height: 1.8; color: var(--sv-text-soft); margin: 0; max-width: 60ch; }

        .sv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px, 2vw, 24px); }
        .sv-card { perspective: 1000px; }
        .sv-card-inner {
          position: relative; height: 100%; border-radius: 16px; overflow: hidden; padding: clamp(24px, 3vw, 34px);
          background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
          border: 1px solid var(--sv-hair); transform-style: preserve-3d; will-change: transform;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          display: flex; flex-direction: column;
        }
        .sv-card:hover .sv-card-inner {
          border-color: color-mix(in srgb, var(--sv-accent) 55%, transparent);
          box-shadow: 0 26px 60px rgba(0, 0, 0, 0.55), 0 0 40px color-mix(in srgb, var(--sv-accent) 20%, transparent);
        }
        .sv-card-glow {
          position: absolute; top: 0; left: 0; width: 300px; height: 300px; margin: -150px 0 0 -150px;
          border-radius: 50%; pointer-events: none; z-index: 0; opacity: 0; visibility: hidden;
          background: radial-gradient(circle, color-mix(in srgb, var(--sv-accent) 32%, transparent) 0%, transparent 60%);
          mix-blend-mode: screen;
        }
        .sv-card-top { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
        .sv-card-icon {
          width: 52px; height: 52px; border-radius: 13px; display: inline-flex; align-items: center; justify-content: center;
          color: color-mix(in srgb, var(--sv-accent) 90%, white);
          background: color-mix(in srgb, var(--sv-accent) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--sv-accent) 30%, transparent);
        }
        .sv-card-code {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: 14px; font-weight: 900; letter-spacing: 0.08em;
          color: color-mix(in srgb, var(--sv-accent) 80%, white);
          text-shadow: 0 0 14px color-mix(in srgb, var(--sv-accent) 55%, transparent);
        }
        .sv-card-name {
          position: relative; z-index: 1;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 21px; font-weight: 700; color: #fff; margin: 0 0 5px; letter-spacing: -0.01em;
        }
        .sv-card-tagline {
          position: relative; z-index: 1;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
          color: color-mix(in srgb, var(--sv-accent) 75%, white); margin: 0 0 16px;
        }
        .sv-card-desc { position: relative; z-index: 1; font-size: 14.5px; line-height: 1.75; color: var(--sv-text-soft); margin: 0 0 22px; flex: 1; }
        .sv-card-link {
          position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--sv-purple-bright); text-decoration: none; transition: gap 0.25s ease;
        }
        .sv-card-link:hover { gap: 13px; }

        /* ── PROCESS ── */
        .sv-proc { max-width: var(--sv-maxw); margin: 0 auto; padding: clamp(40px, 6vw, 80px) var(--sv-pad) clamp(70px, 9vw, 120px); }
        .sv-proc-head { max-width: 30ch; margin-bottom: clamp(44px, 6vw, 72px); }
        .sv-proc-track {
          position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(20px, 3vw, 40px);
          padding-top: 40px;
        }
        .sv-proc-line {
          position: absolute; top: 6px; left: 0; right: 0; height: 2px; background: rgba(139, 122, 232, 0.12); border-radius: 2px; overflow: hidden;
        }
        .sv-proc-line-fill {
          position: absolute; inset: 0; transform-origin: left center;
          background: linear-gradient(90deg, var(--sv-purple-light), rgba(108,92,231,0.2));
          box-shadow: 0 0 12px rgba(139, 122, 232, 0.6);
        }
        .sv-step { position: relative; }
        .sv-step-node {
          position: absolute; top: -40px; left: 0; width: 40px; height: 40px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif); font-size: 13px; font-weight: 900;
          color: #fff; background: radial-gradient(circle at 32% 26%, rgba(139,122,232,0.5), rgba(18,11,46,0.95) 72%);
          box-shadow: 0 0 0 1px rgba(139,122,232,0.5), 0 0 18px rgba(108, 92, 231, 0.35);
          transform: translateY(-50%);
        }
        .sv-step-body { padding-top: 14px; }
        .sv-step-title {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 10px; letter-spacing: -0.01em;
        }
        .sv-step-desc { font-size: 14px; line-height: 1.75; color: var(--sv-text-soft); margin: 0; }

        /* ── TRUST ── */
        .sv-trust { border-top: 1px solid var(--sv-hair); }
        .sv-trust-inner { max-width: var(--sv-maxw); margin: 0 auto; padding: clamp(60px, 8vw, 100px) var(--sv-pad); text-align: center; }
        .sv-trust-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(24px, 3vw, 40px); line-height: 1.16; letter-spacing: -0.02em;
          color: #fff; margin: 0 auto 36px; max-width: 24ch;
        }
        .sv-partners { display: flex; flex-wrap: wrap; justify-content: center; gap: clamp(20px, 4vw, 56px); margin-bottom: 32px; }
        .sv-partner {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: clamp(20px, 2.4vw, 30px); font-weight: 900; letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.3); transition: color 0.3s ease;
        }
        .sv-partner:hover { color: var(--sv-purple-bright); }
        .sv-trust-note { font-size: 13.5px; color: var(--sv-text-mute); margin: 0; letter-spacing: 0.02em; }

        /* ── CTA ── */
        .sv-cta { position: relative; overflow: hidden; padding: clamp(90px, 12vw, 150px) var(--sv-pad); text-align: center; border-top: 1px solid var(--sv-hair); }
        .sv-cta-lightwell {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: 90vw; height: 60vh; max-width: 900px; pointer-events: none;
          background: radial-gradient(closest-side, rgba(108, 92, 231, 0.16), transparent 70%); filter: blur(10px);
        }
        .sv-cta-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
        .sv-cta-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(28px, 4.4vw, 54px); line-height: 1.1; letter-spacing: -0.02em;
          color: #fff; margin: 0 0 20px; text-shadow: 0 0 50px rgba(139, 122, 232, 0.35);
        }
        .sv-cta-sub { font-size: 16px; line-height: 1.8; color: var(--sv-text-soft); max-width: 54ch; margin: 0 auto 38px; }
        .sv-cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        /* ── RESPONSIVE ── */
        @media (max-width: 991px) {
          .sv-hero-inner { grid-template-columns: 1fr; gap: 48px; }
          .sv-hero-visual { order: -1; }
          .sv-radar { width: clamp(220px, 56vw, 320px); }
          .sv-grid { grid-template-columns: repeat(2, 1fr); }
          .sv-proc-track { grid-template-columns: 1fr 1fr; gap: 48px 32px; }
          .sv-proc-line { display: none; }
          .sv-step-node { position: static; transform: none; margin-bottom: 14px; }
          .sv-step-body { padding-top: 0; }
        }
        @media (max-width: 575px) {
          .sv-grid { grid-template-columns: 1fr; }
          .sv-stats { grid-template-columns: 1fr 1fr; }
          .sv-stat:nth-child(3) { border-left: none; }
          .sv-stat:nth-child(3), .sv-stat:nth-child(4) { border-top: 1px solid var(--sv-hair); }
          .sv-proc-track { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sv-hero-eyebrow, .sv-hero-sub, .sv-hero-cta, .sv-hero-badges, .sv-hero-visual, .sv-stat, .sv-card, .sv-step-body > *, .sv-trust-inner > *, .sv-cta-inner > * { opacity: 1 !important; visibility: visible !important; transform: none !important; }
          .sv-hero-title .sv-line span { transform: none !important; }
          .sv-products-title .sv-sw { opacity: 1 !important; }
          .sv-radar-sweep, .sv-radar-blip { animation: none !important; }
          .sv-step-node { opacity: 1 !important; }
        }
      `}</style>
    </div>
  );
}
