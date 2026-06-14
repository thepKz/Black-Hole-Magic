'use client';

import React from 'react';
import { motion } from 'motion/react';

type Card = {
  text: string;
  name: string;
  role: string;
  avatar: string;
};

const CARDS: Card[] = [
  {
    text: 'Blackhole Game hiểu người chơi Việt hơn bất kỳ đối tác nào chúng tôi từng hợp tác. Chỉ số giữ chân sau 30 ngày vượt mọi kỳ vọng của studio.',
    name: 'Giám đốc Phát hành',
    role: 'Studio quốc tế · NDA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Quy trình bản địa hóa và pháp lý gọn đến mức chúng tôi ra mắt sớm hơn kế hoạch một quý. Đây là chuẩn mực mới.',
    name: 'Trưởng dự án',
    role: 'NPH Hàn Quốc',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Một đội ngũ nói chuyện bằng số liệu. Báo cáo ROI minh bạch theo từng tuần vận hành, không có gì bị che khuất.',
    name: 'Quản lý đầu tư',
    role: 'Quỹ game khu vực',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Khả năng phân tích đối thủ và xây dựng chiến lược của Black Hole thực sự ở đẳng cấp khác biệt so với thị trường.',
    name: 'Brand Manager',
    role: 'Esports SEA · NDA',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Hợp tác với Black Hole là quyết định đúng đắn nhất năm nay. Đội ngũ chuyên nghiệp, cam kết và luôn vượt mục tiêu.',
    name: 'CEO',
    role: 'TechVN Corp',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Đầu tư vào sponsorship với Black Hole là khoản chi có hiệu quả nhất trong toàn bộ ngân sách marketing năm nay.',
    name: 'CFO',
    role: 'StartupVN',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Màn trình diễn tại giải đấu quốc tế khiến thương hiệu chúng tôi được chú ý rộng rãi. ROI vượt xa kỳ vọng.',
    name: 'Marketing Director',
    role: 'GameZone Asia',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Cộng tác với team này mang lại giá trị thực sự cho fanbase. Cộng đồng gaming phản hồi cực kỳ tích cực.',
    name: 'Community Lead',
    role: 'VN Gaming Network',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
  },
  {
    text: 'Tinh thần chiến đấu và văn hóa đội nhóm của Black Hole là nguồn cảm hứng lớn cho cả tổ chức chúng tôi.',
    name: 'Operations Director',
    role: 'TechHub SEA',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
  },
];

function Column({ cards, duration, delay = 0 }: { cards: Card[]; duration: number; delay?: number }) {
  const doubled = [...cards, ...cards];
  return (
    <div style={{ width: 290, flexShrink: 0, overflow: 'hidden' }}>
      <motion.div
        animate={{ y: [0, -(cards.length * (240 + 16))] }}
        transition={{
          duration,
          ease: 'linear',
          repeat: Infinity,
          delay,
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {doubled.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              width: 290,
              flexShrink: 0,
              borderRadius: 14,
              padding: '22px 20px 20px',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(139,122,232,0.14)',
              boxShadow: '0 4px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.055)',
              overflow: 'hidden',
            }}
          >
            {/* top glow */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(139,122,232,0.5), transparent)',
            }} />

            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.68)', margin: '0 0 18px', letterSpacing: 0.1 }}>
              &ldquo;{c.text}&rdquo;
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={c.avatar}
                alt={c.name}
                style={{
                  width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                  border: '1.5px solid rgba(139,122,232,0.35)',
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 0.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 11.5, color: 'rgba(196,184,255,0.55)', letterSpacing: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
                  {c.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const col1 = CARDS.slice(0, 3);
const col2 = CARDS.slice(3, 6);
const col3 = CARDS.slice(6, 9);

const CARD_HEIGHT = 240;
const GAP = 16;

export default function TestimonialSection7() {
  return (
    <section style={{
      position: 'relative',
      zIndex: 9,
      background: '#07050f',
      padding: '130px 0 140px',
      overflow: 'hidden',
    }}>
      {/* ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(108,92,231,0.07) 0%, transparent 70%)',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-60px' }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 18 }}
          >
            <div style={{ height: 1, width: 28, background: 'rgba(139,122,232,0.7)' }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'rgba(196,184,255,0.8)',
            }}>
              Tiếng nói đối tác
            </span>
            <div style={{ height: 1, width: 28, background: 'rgba(139,122,232,0.7)' }} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700,
              color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.12,
              margin: '0 0 12px',
            }}
          >
            Khách hàng nói về{' '}
            <span style={{ color: '#b09cff' }}>chúng tôi</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            viewport={{ once: true }}
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', margin: 0 }}
          >
            Trích dẫn được ẩn danh theo thỏa thuận NDA
          </motion.p>
        </motion.div>

        {/* ── Columns ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true, margin: '-40px' }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            maxHeight: 560,
            overflow: 'hidden',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          }}
        >
          <Column cards={col1} duration={col1.length * (CARD_HEIGHT + GAP) / 40} />
          <Column cards={col2} duration={col2.length * (CARD_HEIGHT + GAP) / 32} delay={0.8} />
          <Column cards={col3} duration={col3.length * (CARD_HEIGHT + GAP) / 36} delay={0.4} />
        </motion.div>

      </div>
    </section>
  );
}
