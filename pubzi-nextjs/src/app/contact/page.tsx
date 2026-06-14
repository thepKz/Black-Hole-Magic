'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CHANNELS = [
  { icon: 'fa-phone', label: 'Gọi cho chúng tôi', value: '+84 24 7100 0000', href: 'tel:+842471000000' },
  { icon: 'fa-envelope', label: 'Email hợp tác', value: 'hello@blackhole.gg', href: 'mailto:hello@blackhole.gg' },
  { icon: 'fa-location-dot', label: 'Trụ sở', value: 'Hà Nội, Việt Nam', href: '#' },
  { icon: 'fa-clock', label: 'Giờ làm việc', value: 'Thứ 2 – Thứ 7 · 9:00–18:00', href: '#' },
];

const REASONS = [
  { k: '01', t: 'Phát hành game', d: 'Bạn là nhà phát triển muốn đưa game ra thị trường Việt Nam & Đông Nam Á.' },
  { k: '02', t: 'Tài trợ & quảng bá', d: 'Hợp tác thương hiệu, tài trợ đội tuyển và các chiến dịch truyền thông.' },
  { k: '03', t: 'Tuyển dụng & thử việc', d: 'Gia nhập đội tuyển, ban huấn luyện hoặc đội ngũ vận hành của Black Hole.' },
];

export default function ContactPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.set('.ct-hero-eyebrow, .ct-hero-sub, .ct-hero-channels', { autoAlpha: 0 });
      gsap.timeline({ delay: 0.12 })
        .to('.ct-hero-eyebrow', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .fromTo('.ct-hero-title .ct-line span', { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.3')
        .to('.ct-hero-sub', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
        .to('.ct-hero-channels', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');

      gsap.fromTo('.ct-form-wrap',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.ct-main', start: 'top 75%', once: true } });

      gsap.fromTo('.ct-reason',
        { autoAlpha: 0, x: 26 },
        { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.ct-reasons', start: 'top 78%', once: true } });

      gsap.fromTo('.ct-map',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.ct-map', start: 'top 82%', once: true } });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="ct-root" ref={rootRef}>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="ct-hero">
        <div className="ct-hero-grid-bg" aria-hidden="true" />
        <div className="ct-hero-lightwell" aria-hidden="true" />
        <div className="ct-hero-inner">
          <nav className="ct-breadcrumb ct-hero-eyebrow">
            <Link href="/">Trang chủ</Link>
            <span className="ct-bc-sep">/</span>
            <span className="ct-bc-current">Liên hệ</span>
          </nav>

          <h1 className="ct-hero-title">
            <span className="ct-line"><span>Bắt đầu một</span></span>
            <span className="ct-line ct-line-accent"><span>cuộc trò chuyện</span></span>
          </h1>

          <p className="ct-hero-sub">
            Dù bạn muốn phát hành game, tài trợ đội tuyển, hay gia nhập Black Hole —
            đội ngũ của chúng tôi luôn sẵn sàng. Phản hồi trong vòng 24 giờ làm việc.
          </p>

          <div className="ct-hero-channels">
            {CHANNELS.map((c) => (
              <a key={c.label} href={c.href} className="ct-channel">
                <span className="ct-channel-icon"><i className={`fa-solid ${c.icon}`} /></span>
                <span className="ct-channel-text">
                  <span className="ct-channel-label">{c.label}</span>
                  <span className="ct-channel-value">{c.value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAIN: form + reasons ════════════════════════════════════════════ */}
      <section className="ct-main">
        <div className="ct-main-inner">
          {/* form */}
          <div className="ct-form-wrap">
            <span className="ct-section-kicker">Gửi tin nhắn</span>
            <h2 className="ct-form-title">Chúng tôi rất muốn nghe từ bạn</h2>

            {submitStatus === 'success' && (
              <div className="ct-alert ct-alert-ok">
                Cảm ơn bạn! Tin nhắn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="ct-alert ct-alert-err">
                Có lỗi xảy ra. Vui lòng thử lại hoặc gửi email trực tiếp đến hello@blackhole.gg.
              </div>
            )}

            <form onSubmit={handleSubmit} className="ct-form">
              <div className="ct-field">
                <label htmlFor="name">Họ và tên</label>
                <input id="name" name="name" type="text" placeholder="Nguyễn Văn A"
                  value={formData.name} onChange={handleChange} required />
              </div>
              <div className="ct-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="ban@congty.com"
                  value={formData.email} onChange={handleChange} required />
              </div>
              <div className="ct-field ct-field-full">
                <label htmlFor="subject">Chủ đề</label>
                <input id="subject" name="subject" type="text" placeholder="Đề xuất phát hành game / Tài trợ / Tuyển dụng…"
                  value={formData.subject} onChange={handleChange} />
              </div>
              <div className="ct-field ct-field-full">
                <label htmlFor="message">Nội dung</label>
                <textarea id="message" name="message" rows={5} placeholder="Hãy cho chúng tôi biết bạn cần gì…"
                  value={formData.message} onChange={handleChange} required />
              </div>
              <div className="ct-field-full">
                <button type="submit" className="ct-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang gửi…' : 'Gửi tin nhắn'}
                  {!isSubmitting && (
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M9.41 8.47 1.88 16 0 14.12l7.53-7.53L.94 0H16v15.06z" fill="currentColor" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* reasons rail */}
          <aside className="ct-reasons">
            <span className="ct-section-kicker">Bạn liên hệ về</span>
            <div className="ct-reasons-list">
              {REASONS.map((r) => (
                <div className="ct-reason" key={r.k}>
                  <span className="ct-reason-k">{r.k}</span>
                  <div>
                    <h3 className="ct-reason-t">{r.t}</h3>
                    <p className="ct-reason-d">{r.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="ct-reasons-cta">
              <p>Cần phản hồi gấp?</p>
              <a href="mailto:hello@blackhole.gg" className="ct-btn ct-btn-ghost">Email trực tiếp</a>
            </div>
          </aside>
        </div>
      </section>

      {/* ══ MAP ═════════════════════════════════════════════════════════════ */}
      <section className="ct-map">
        <div className="ct-map-frame">
          <iframe
            title="Bản đồ Black Hole"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0!2d105.8342!3d21.0278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1700000000000"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="ct-map-tint" aria-hidden="true" />
        </div>
      </section>

      <style jsx global>{`
        /* ╔══════════════════════════════════════════════════════════════════╗
           ║  CONTACT — Dark Luxe, Black Hole                                  ║
           ╚══════════════════════════════════════════════════════════════════╝ */
        .ct-root {
          --ct-bg: #08060f;
          --ct-purple: #6c5ce7;
          --ct-purple-light: #8b7ae8;
          --ct-purple-bright: #b09cff;
          --ct-hair: rgba(139, 122, 232, 0.14);
          --ct-text-soft: rgba(255, 255, 255, 0.62);
          --ct-text-mute: rgba(255, 255, 255, 0.4);
          --ct-maxw: 1280px;
          --ct-pad: clamp(20px, 5vw, 80px);
          position: relative; z-index: 1;
          background: var(--ct-bg); color: #fff;
          font-family: var(--font-body-regular, 'Inter', sans-serif);
          overflow: hidden;
        }
        .ct-root .ct-section-kicker {
          display: inline-block;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--ct-purple-light); margin-bottom: 18px;
        }
        .ct-root .ct-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 26px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; border-radius: 6px;
          transition: transform 0.25s ease, filter 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .ct-root .ct-btn-ghost {
          color: var(--ct-purple-bright); border: 1px solid rgba(139, 122, 232, 0.3); background: rgba(139, 122, 232, 0.04);
        }
        .ct-root .ct-btn-ghost:hover { border-color: rgba(139, 122, 232, 0.6); background: rgba(139, 122, 232, 0.1); transform: translateY(-2px); }

        /* ── HERO ── */
        .ct-hero {
          position: relative;
          padding: clamp(130px, 18vh, 210px) var(--ct-pad) clamp(50px, 7vh, 90px);
          background:
            radial-gradient(110% 70% at 80% 4%, rgba(108, 92, 231, 0.22) 0%, transparent 55%),
            linear-gradient(180deg, #0c0820 0%, #08060f 80%);
        }
        .ct-hero-grid-bg {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image:
            linear-gradient(rgba(139,122,232,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,122,232,1) 1px, transparent 1px);
          background-size: 92px 92px;
          mask-image: radial-gradient(80% 80% at 50% 26%, black, transparent 80%);
          -webkit-mask-image: radial-gradient(80% 80% at 50% 26%, black, transparent 80%);
        }
        .ct-hero-lightwell {
          position: absolute; top: -16%; right: -6%; width: 56vw; height: 56vw; max-width: 720px; max-height: 720px;
          pointer-events: none; background: radial-gradient(closest-side, rgba(124, 92, 255, 0.18), transparent 70%); filter: blur(20px);
        }
        .ct-hero-inner { position: relative; z-index: 2; max-width: var(--ct-maxw); margin: 0 auto; }
        .ct-breadcrumb {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 28px; transform: translateY(8px);
        }
        .ct-breadcrumb a { color: var(--ct-text-mute); text-decoration: none; transition: color 0.2s; }
        .ct-breadcrumb a:hover { color: var(--ct-purple-bright); }
        .ct-bc-sep { color: rgba(139, 122, 232, 0.4); }
        .ct-bc-current { color: var(--ct-purple-bright); }
        .ct-hero-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(40px, 6.4vw, 88px); line-height: 1.02; letter-spacing: -0.02em;
          margin: 0 0 24px; color: #fff;
        }
        .ct-hero-title .ct-line { display: block; overflow: hidden; padding-bottom: 0.05em; }
        .ct-hero-title .ct-line span { display: block; }
        .ct-hero-title .ct-line-accent span { color: var(--ct-purple-bright); text-shadow: 0 0 40px rgba(139, 122, 232, 0.5); }
        .ct-hero-sub {
          font-size: clamp(15px, 1.4vw, 18px); line-height: 1.8; color: var(--ct-text-soft);
          max-width: 56ch; margin: 0 0 44px; transform: translateY(16px);
        }
        .ct-hero-channels {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
          background: var(--ct-hair); border: 1px solid var(--ct-hair); border-radius: 14px; overflow: hidden;
          transform: translateY(16px);
        }
        .ct-channel {
          display: flex; align-items: center; gap: 14px; padding: 22px 22px;
          background: rgba(13, 10, 24, 0.5); text-decoration: none; transition: background 0.25s ease;
        }
        .ct-channel:hover { background: rgba(139, 122, 232, 0.08); }
        .ct-channel-icon {
          flex: 0 0 auto; width: 42px; height: 42px; border-radius: 10px;
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(139, 122, 232, 0.12); border: 1px solid rgba(139, 122, 232, 0.25);
          color: var(--ct-purple-bright); font-size: 15px;
        }
        .ct-channel-text { display: flex; flex-direction: column; min-width: 0; }
        .ct-channel-label {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ct-text-mute); margin-bottom: 4px;
        }
        .ct-channel-value { font-size: 14px; color: #fff; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* ── MAIN ── */
        .ct-main { max-width: var(--ct-maxw); margin: 0 auto; padding: clamp(60px, 8vw, 110px) var(--ct-pad); }
        .ct-main-inner { display: grid; grid-template-columns: 1.4fr 0.9fr; gap: clamp(36px, 5vw, 80px); align-items: start; }

        .ct-form-wrap {
          background: linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
          border: 1px solid var(--ct-hair); border-radius: 18px; padding: clamp(26px, 4vw, 44px);
        }
        .ct-form-title {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: clamp(22px, 2.6vw, 32px); line-height: 1.18; letter-spacing: -0.02em;
          color: #fff; margin: 0 0 28px;
        }
        .ct-alert { padding: 14px 18px; border-radius: 10px; font-size: 14px; margin-bottom: 22px; }
        .ct-alert-ok { background: rgba(56, 224, 138, 0.1); border: 1px solid rgba(56, 224, 138, 0.4); color: #9ff5c0; }
        .ct-alert-err { background: rgba(255, 90, 90, 0.1); border: 1px solid rgba(255, 90, 90, 0.4); color: #ffb3b3; }
        .ct-form { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .ct-field { display: flex; flex-direction: column; }
        .ct-field-full { grid-column: 1 / -1; }
        .ct-field label {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--ct-text-mute); margin-bottom: 9px;
        }
        .ct-root .ct-field input,
        .ct-root .ct-field textarea {
          width: 100%; font-family: var(--font-body-regular, 'Inter', sans-serif);
          font-size: 15px; color: #fff; padding: 14px 16px;
          background: rgba(8, 6, 15, 0.6); border: 1px solid var(--ct-hair); border-radius: 9px;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease; resize: vertical;
        }
        .ct-root .ct-field input::placeholder,
        .ct-root .ct-field textarea::placeholder { color: rgba(255, 255, 255, 0.3); }
        .ct-root .ct-field input:focus,
        .ct-root .ct-field textarea:focus {
          outline: none; border-color: rgba(139, 122, 232, 0.6);
          background: rgba(13, 10, 24, 0.8); box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.16);
        }
        .ct-submit {
          appearance: none; cursor: pointer; border: 0;
          display: inline-flex; align-items: center; gap: 9px; padding: 15px 30px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 13px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
          color: #fff; border-radius: 7px;
          background: linear-gradient(135deg, var(--ct-purple), #4b22d8);
          box-shadow: 0 10px 30px rgba(75, 34, 216, 0.4);
          transition: transform 0.25s ease, filter 0.25s ease;
        }
        .ct-submit:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.12); }
        .ct-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* reasons rail */
        .ct-reasons-list { display: flex; flex-direction: column; }
        .ct-reason {
          display: grid; grid-template-columns: 44px 1fr; gap: 18px; align-items: start;
          padding: 24px 0; border-top: 1px solid var(--ct-hair);
        }
        .ct-reason:last-of-type { border-bottom: 1px solid var(--ct-hair); }
        .ct-reason-k {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-weight: 900; font-size: 18px; color: rgba(139, 122, 232, 0.55); font-variant-numeric: tabular-nums;
        }
        .ct-reason-t {
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 7px; letter-spacing: -0.01em;
        }
        .ct-reason-d { font-size: 14px; line-height: 1.7; color: var(--ct-text-soft); margin: 0; }
        .ct-reasons-cta {
          margin-top: 28px; padding: 22px; border-radius: 12px;
          background: rgba(139, 122, 232, 0.06); border: 1px solid var(--ct-hair);
          display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
        }
        .ct-reasons-cta p { margin: 0; font-size: 14px; color: var(--ct-text-soft); }

        /* ── MAP ── */
        .ct-map { max-width: var(--ct-maxw); margin: 0 auto; padding: 0 var(--ct-pad) clamp(80px, 10vw, 130px); }
        .ct-map-frame {
          position: relative; border-radius: 18px; overflow: hidden; height: clamp(320px, 42vw, 480px);
          border: 1px solid var(--ct-hair); box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
        }
        .ct-map-frame iframe { width: 100%; height: 100%; border: 0; display: block; filter: grayscale(0.4) brightness(0.78) contrast(1.05); }
        .ct-map-tint {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, rgba(108,92,231,0.08), transparent 30%, rgba(8,6,15,0.35));
          box-shadow: inset 0 0 0 1px rgba(139, 122, 232, 0.2); border-radius: 18px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 991px) {
          .ct-hero-channels { grid-template-columns: 1fr 1fr; }
          .ct-main-inner { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 575px) {
          .ct-hero-channels { grid-template-columns: 1fr; }
          .ct-form { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ct-hero-eyebrow, .ct-hero-sub, .ct-hero-channels, .ct-form-wrap, .ct-reason, .ct-map { opacity: 1 !important; visibility: visible !important; transform: none !important; }
          .ct-hero-title .ct-line span { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
