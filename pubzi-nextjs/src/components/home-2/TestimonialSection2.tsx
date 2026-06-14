'use client';

import { motion } from 'motion/react';
import { TestimonialsColumn, type TestimonialItem } from '@/components/ui/testimonials-columns';

const testimonials: TestimonialItem[] = [
  {
    text: "Đội ngũ thi đấu chuyên nghiệp, chiến thuật bài bản. Hợp tác với Black Hole là quyết định đúng đắn nhất của chúng tôi trong năm nay.",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face",
    name: "Nguyen Thi Lan",
    role: "CEO, TechVN Corp",
  },
  {
    text: "Màn trình diễn tại giải đấu quốc tế khiến thương hiệu chúng tôi được chú ý rộng rãi. ROI vượt kỳ vọng.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    name: "Tran Van Minh",
    role: "Marketing Director, GameZone",
  },
  {
    text: "Đối tác tin cậy, cam kết mạnh mẽ. Trích dẫn được ẩn danh theo thỏa thuận NDA.",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face",
    name: "A.T.",
    role: "CEO, Tập đoàn ẩn danh",
  },
  {
    text: "Khả năng phân tích đối thủ và xây dựng chiến lược của Black Hole thực sự ở đẳng cấp khác biệt.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    name: "Pham Bich Ngoc",
    role: "Brand Manager, Esports SEA",
  },
  {
    text: "Cộng tác với team này mang lại giá trị thực sự cho fanbase và cộng đồng gaming của chúng tôi.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    name: "Le Hoang Nam",
    role: "Community Lead, VN Gaming",
  },
  {
    text: "Sự chuyên nghiệp, kỷ luật trong từng trận đấu. Trích dẫn được ẩn danh theo thỏa thuận NDA.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    name: "N.H.",
    role: "Giám đốc, Đối tác chiến lược",
  },
  {
    text: "Đầu tư vào sponsorship với Black Hole là khoản chi có hiệu quả nhất trong ngân sách marketing của chúng tôi.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    name: "Do Quoc Bao",
    role: "CFO, StartupVN",
  },
  {
    text: "Team chuyên nghiệp, đúng giờ và luôn vượt mục tiêu đặt ra. Chúng tôi tự hào là đối tác của Black Hole.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    name: "Hoang Thu Ha",
    role: "Head of Partnerships, Media Group",
  },
  {
    text: "Tinh thần chiến đấu và văn hóa đội nhóm của Black Hole là nguồn cảm hứng lớn cho tổ chức chúng tôi.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
    name: "Vu Thanh Long",
    role: "Operations Director, TechHub",
  },
];

const firstColumn  = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn  = testimonials.slice(6, 9);

export default function TestimonialSection2() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "100px 0",
        background: "transparent",
      }}
    >
      {/* subtle ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(125,249,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 10 }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-60px" }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}
          >
            <div style={{ height: 1, width: 32, background: "var(--color-brand, #7DF9FF)" }} />
           
            <div style={{ height: 1, width: 32, background: "var(--color-brand, #7DF9FF)" }} />
          </motion.div>

          {/* heading */}
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "0 0 12px",
            }}
          >
            Khách hàng nói về{" "}
            <span style={{ color: "var(--color-brand, #7DF9FF)" }}>chúng tôi</span>
          </motion.h2>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            viewport={{ once: true }}
            style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", margin: 0 }}
          >
            Trích dẫn được ẩn danh theo thỏa thuận NDA
          </motion.p>
        </motion.div>

        {/* ── Columns ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          viewport={{ once: true, margin: "-40px" }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            maxHeight: 620,
            overflow: "hidden",
            maskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          }}
        >
          <TestimonialsColumn testimonials={firstColumn} duration={20} />
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={25}
            className="hidden md:block"
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={22}
            className="hidden lg:block"
          />
        </motion.div>

      </div>
    </section>
  );
}
