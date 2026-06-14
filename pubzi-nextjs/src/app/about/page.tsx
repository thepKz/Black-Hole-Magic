'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

// ── Fade-up wrapper ──────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── Divider line ─────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(139,122,232,0.35), transparent)',
      margin: '0',
    }} />
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '2019', label: 'Năm thành lập' },
  { value: '12+', label: 'Tựa game cạnh tranh' },
  { value: '50+', label: 'Danh hiệu quốc gia' },
  { value: '1M+', label: 'Người hâm mộ' },
];

const VALUES = [
  {
    icon: '⚡',
    title: 'Chiến thắng có kỷ luật',
    desc: 'Chúng tôi không chỉ chơi để thắng — chúng tôi xây dựng hệ thống, luyện tập quy trình và thi đấu với sự chuẩn bị tuyệt đối.',
  },
  {
    icon: '🎯',
    title: 'Minh bạch tuyệt đối',
    desc: 'Với đối tác, nhà tài trợ và người hâm mộ — số liệu thực, báo cáo thực, không có gì bị che khuất.',
  },
  {
    icon: '🌏',
    title: 'Đại diện Việt Nam',
    desc: 'Từ LAN Hà Nội đến sân khấu quốc tế — mỗi trận đấu là cơ hội đưa tên Việt Nam lên bản đồ esports thế giới.',
  },
  {
    icon: '🤝',
    title: 'Cộng đồng là nền tảng',
    desc: 'Tổ chức mạnh nhất là tổ chức được cộng đồng yêu thương. Chúng tôi xây dựng kết nối trước khi xây dựng chiến thắng.',
  },
];

const TIMELINE = [
  { year: '2019', title: 'Thành lập Black Hole', desc: 'Khởi đầu từ một đội PUBG Mobile nghiệp dư tại Hà Nội với 5 thành viên sáng lập.' },
  { year: '2020', title: 'Chức vô địch đầu tiên', desc: 'Vô địch giải đấu quốc gia đầu tiên — bước ngoặt xác nhận con đường chuyên nghiệp hóa.' },
  { year: '2021', title: 'Mở rộng bộ môn', desc: 'Ra mắt các đội tuyển Valorant, Mobile Legends và League of Legends. Đội ngũ tăng lên 30 người.' },
  { year: '2022', title: 'Ký kết đối tác quốc tế', desc: 'Hợp tác với các NPH Hàn Quốc và Singapore, mở ra cơ hội thi đấu tầm châu lục.' },
  { year: '2023', title: 'Top 8 SEA Championship', desc: 'Lần đầu tiên đại diện Việt Nam vào vòng knock-out giải đấu cấp khu vực Đông Nam Á.' },
  { year: '2024', title: 'ICS Group ra đời', desc: 'Thành lập nhánh kinh doanh ICS Group — hệ sinh thái toàn diện: giải đấu, truyền thông, đào tạo.' },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div style={{ background: '#07050f', minHeight: '100vh', color: '#fff', fontFamily: "'Chakra Petch', 'Inter', sans-serif" }}>

      {/* ══ HERO BREADCRUMB ══════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        paddingTop: 160,
        paddingBottom: 100,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0d0820 0%, #07050f 100%)',
      }}>
        {/* bg glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,92,231,0.22) 0%, transparent 65%)',
        }} />
        {/* grid lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(139,122,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,122,232,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px,5vw,72px)', position: 'relative', zIndex: 1 }}>
          {/* breadcrumb */}
          <FadeUp delay={0.05}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              <Link href="/" style={{ color: 'rgba(196,184,255,0.55)', textDecoration: 'none' }}>Trang chủ</Link>
              <span style={{ color: 'rgba(139,122,232,0.4)' }}>→</span>
              <span style={{ color: '#b09cff' }}>Về chúng tôi</span>
            </nav>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ height: 1, width: 28, background: 'rgba(139,122,232,0.7)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(196,184,255,0.8)' }}>
                Về chúng tôi
              </span>
              <div style={{ height: 1, width: 28, background: 'rgba(139,122,232,0.7)' }} />
            </div>
          </FadeUp>

          <FadeUp delay={0.18}>
            <h1 style={{
              fontSize: 'clamp(40px, 7vw, 88px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: '0 0 24px',
              fontFamily: "'Orbitron', 'Chakra Petch', sans-serif",
            }}>
              Chúng tôi là<br />
              <span style={{ color: '#b09cff' }}>Black Hole</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.26}>
            <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', maxWidth: '52ch', margin: 0 }}>
              Tổ chức eSports hàng đầu Việt Nam — xây dựng trên nền tảng kỷ luật, minh bạch và khát vọng đưa Việt Nam lên bản đồ gaming thế giới.
            </p>
          </FadeUp>
        </div>
      </section>

      <Divider />

      {/* ══ MISSION / VISION ════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px,10vw,140px) clamp(20px,5vw,72px)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,100px)', alignItems: 'center' }}>

          {/* image */}
          <FadeUp delay={0}>
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/5' }}>
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=1000&fit=crop"
                alt="Black Hole team"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(7,5,15,0.85) 100%)',
              }} />
              {/* border accent */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 16,
                boxShadow: 'inset 0 0 0 1px rgba(139,122,232,0.25)',
              }} />
              {/* stat badge */}
              <div style={{
                position: 'absolute', bottom: 28, left: 28,
                background: 'rgba(13,8,32,0.88)',
                border: '1px solid rgba(139,122,232,0.3)',
                borderRadius: 10,
                padding: '14px 20px',
                backdropFilter: 'blur(12px)',
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#b09cff', fontFamily: "'Orbitron', sans-serif", lineHeight: 1 }}>50+</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>Danh hiệu</div>
              </div>
            </div>
          </FadeUp>

          {/* text */}
          <div>
            <FadeUp delay={0.1}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8b7ae8', marginBottom: 16 }}>
                SỨ MỆNH & TẦM NHÌN
              </p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 700,
                lineHeight: 1.15, letterSpacing: '-0.025em',
                color: '#fff', marginBottom: 28,
              }}>
                Hơn cả một đội tuyển —<br />
                <span style={{ color: '#b09cff' }}>một hệ sinh thái</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.18}>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.62)', marginBottom: 24 }}>
                Black Hole được thành lập với sứ mệnh rõ ràng: xây dựng tổ chức eSports chuyên nghiệp đầu tiên của Việt Nam đủ sức cạnh tranh tại đấu trường quốc tế — không chỉ về kỹ năng, mà về văn hóa, thương hiệu và hệ thống vận hành.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.62)', marginBottom: 36 }}>
                Tầm nhìn của chúng tôi là trở thành tổ chức eSports được nhận diện toàn cầu, mang cờ Việt Nam đến mọi giải đấu lớn — từ Đông Nam Á đến các sân khấu thế giới.
              </p>
            </FadeUp>

            <FadeUp delay={0.26}>
              <div style={{ display: 'flex', gap: 16 }}>
                <Link href="/contact" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 24px',
                  background: 'linear-gradient(135deg, rgba(108,92,231,0.9), rgba(75,34,216,0.9))',
                  border: '1px solid rgba(139,122,232,0.5)',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'filter 0.25s ease',
                }}>
                  Hợp tác ngay
                </Link>
                <Link href="/team" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(139,122,232,0.3)',
                  borderRadius: 6,
                  color: 'rgba(196,184,255,0.85)',
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  textDecoration: 'none',
                }}>
                  Xem đội tuyển
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══ STATS ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,72px)',
        maxWidth: 1280, margin: '0 auto',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              style={{
                padding: 'clamp(28px,4vw,48px) clamp(20px,3vw,36px)',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(139,122,232,0.15)' : 'none',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800,
                fontFamily: "'Orbitron', sans-serif",
                color: '#b09cff', lineHeight: 1, marginBottom: 10,
                textShadow: '0 0 30px rgba(139,122,232,0.4)',
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ══ VALUES ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px,10vw,130px) clamp(20px,5vw,72px)', maxWidth: 1280, margin: '0 auto' }}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8b7ae8', marginBottom: 14 }}>
            GIÁ TRỊ CỐT LÕI
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.15, margin: 0 }}>
            Những gì định nghĩa<br /><span style={{ color: '#b09cff' }}>Black Hole</span>
          </h2>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              whileHover={{ backgroundColor: 'rgba(139,122,232,0.05)' }}
              style={{
                padding: 'clamp(28px,4vw,44px)',
                border: '1px solid rgba(139,122,232,0.12)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                transition: 'background-color 0.3s ease',
                background: 'rgba(255,255,255,0.015)',
              }}
            >
              {/* corner accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: 60, height: 60, pointerEvents: 'none',
                background: 'radial-gradient(circle at 0 0, rgba(139,122,232,0.15), transparent 70%)',
              }} />
              <div style={{ fontSize: 28, marginBottom: 16 }}>{v.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-0.01em' }}>
                {v.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.75, color: 'rgba(255,255,255,0.54)', margin: 0 }}>
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ══ TIMELINE ════════════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px,10vw,130px) clamp(20px,5vw,72px)', maxWidth: 1280, margin: '0 auto' }}>
        <FadeUp style={{ marginBottom: 72 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8b7ae8', marginBottom: 14 }}>
            HÀNH TRÌNH
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.15, margin: 0 }}>
            5 năm xây dựng<br /><span style={{ color: '#b09cff' }}>di sản</span>
          </h2>
        </FadeUp>

        <div style={{ position: 'relative' }}>
          {/* vertical line */}
          <div style={{
            position: 'absolute',
            left: 'clamp(60px, 7vw, 96px)',
            top: 0, bottom: 0, width: 1,
            background: 'linear-gradient(180deg, rgba(139,122,232,0.5) 0%, rgba(139,122,232,0.05) 100%)',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-40px' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'clamp(60px,7vw,96px) 1fr',
                  gap: 'clamp(20px,4vw,56px)',
                  alignItems: 'start',
                  padding: 'clamp(24px,3vw,36px) 0',
                  borderBottom: i < TIMELINE.length - 1 ? '1px solid rgba(139,122,232,0.08)' : 'none',
                  position: 'relative',
                }}
              >
                {/* year + dot */}
                <div style={{ textAlign: 'right', position: 'relative', paddingTop: 2 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 800, color: '#8b7ae8',
                    fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.04em',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {t.year}
                  </span>
                  {/* dot on line */}
                  <div style={{
                    position: 'absolute',
                    right: -8, top: 7,
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#8b7ae8',
                    boxShadow: '0 0 12px rgba(139,122,232,0.8)',
                    transform: 'translateX(clamp(60px,7vw,96px))',
                  }} />
                </div>

                <div style={{ paddingLeft: 'clamp(16px,2vw,28px)' }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.01em' }}>
                    {t.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.50)', margin: 0 }}>
                    {t.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══ TEAM PHOTO STRIP ════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,72px)', maxWidth: 1280, margin: '0 auto' }}>
        <FadeUp style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8b7ae8', marginBottom: 14 }}>
            ĐỘI NGŨ
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.15, margin: 0 }}>
            Những con người<br /><span style={{ color: '#b09cff' }}>phía sau màn hình</span>
          </h2>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { src: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=700&fit=crop', label: 'Đội Valorant' },
            { src: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=700&fit=crop', label: 'Đội PUBG Mobile' },
            { src: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=700&fit=crop', label: 'Ban huấn luyện' },
          ].map((img, i) => (
            <motion.div
              key={img.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '3/4' }}
            >
              <img
                src={img.src}
                alt={img.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 50%, rgba(7,5,15,0.88) 100%)',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                boxShadow: 'inset 0 0 0 1px rgba(139,122,232,0.2)',
                borderRadius: 12,
              }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: 'rgba(196,184,255,0.85)',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  {img.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <FadeUp delay={0.2} style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/team" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px',
            border: '1px solid rgba(139,122,232,0.35)',
            borderRadius: 6,
            color: 'rgba(196,184,255,0.85)',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            textDecoration: 'none',
          }}>
            Xem toàn bộ đội tuyển →
          </Link>
        </FadeUp>
      </section>

      <Divider />

      {/* ══ CTA ══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,72px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(108,92,231,0.1) 0%, transparent 70%)',
        }} />

        <FadeUp style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8b7ae8', marginBottom: 20 }}>
            HỢP TÁC
          </p>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 800,
            letterSpacing: '-0.03em', color: '#fff',
            lineHeight: 1.1, marginBottom: 20,
            fontFamily: "'Orbitron', 'Chakra Petch', sans-serif",
          }}>
            Sẵn sàng vào<br />
            <span style={{ color: '#b09cff' }}>đấu trường?</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.7 }}>
            Dù bạn là nhà tài trợ, đối tác phát hành hay đơn giản là muốn cùng xây dựng tương lai gaming Việt Nam — hãy nói chuyện với chúng tôi.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '15px 32px',
              background: 'linear-gradient(135deg, rgba(108,92,231,0.95), rgba(75,34,216,0.95))',
              border: '1px solid rgba(139,122,232,0.6)',
              borderRadius: 6,
              color: '#fff',
              fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(108,92,231,0.35)',
            }}>
              Liên hệ ngay
            </Link>
            <Link href="/pricing" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '15px 32px',
              border: '1px solid rgba(139,122,232,0.25)',
              borderRadius: 6,
              color: 'rgba(196,184,255,0.8)',
              fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              Xem gói hợp tác
            </Link>
          </div>
        </FadeUp>
      </section>

    </div>
  );
}
