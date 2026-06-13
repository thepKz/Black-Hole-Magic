'use client';

import { useEffect, useRef, useState } from 'react';

const SIGNALS = [
  {
    value: 24,
    suffix: '/7',
    label: 'Trực vận hành chiến dịch',
    note: 'Theo dõi cộng đồng, sự kiện và kênh hỗ trợ khi chiến dịch đang live.',
  },
  {
    value: 4,
    suffix: '',
    label: 'Mũi nhọn triển khai',
    note: 'Game publishing, giải đấu, cộng đồng creator và nền tảng công nghệ.',
  },
  {
    value: 30,
    suffix: ' ngày',
    label: 'Chu kỳ tối ưu sau ra mắt',
    note: 'Đọc dữ liệu, chỉnh thông điệp và tinh chỉnh retention theo từng sprint.',
  },
  {
    value: 1,
    suffix: '',
    label: 'Đầu mối điều phối',
    note: 'Một team chịu trách nhiệm từ brief, pháp lý, localize đến ngày lên sóng.',
  },
];

export default function CounterSection7() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="ops-section">
      <div className="ops-container">
        <div className="ops-grid">
          {SIGNALS.map((item, index) => (
            <article className="ops-item" key={item.label}>
              <span className="ops-index">{String(index + 1).padStart(2, '0')}</span>
              <strong className="ops-value">
                <Counter end={item.value} duration={1400 + index * 180} active={isVisible} />
                {item.suffix}
              </strong>
              <h3>{item.label}</h3>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .ops-section {
          position: relative;
          z-index: 9;
          overflow: hidden;
          background: #080614 !important;
          padding: 104px 0 112px;
        }

        .ops-section::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(139, 122, 232, 0.08), transparent 34%, rgba(139, 122, 232, 0.06)),
            radial-gradient(circle at 12% 30%, rgba(139, 122, 232, 0.11), transparent 32%);
        }

        .ops-container {
          position: relative;
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
        }

        .ops-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-top: 1px solid rgba(139, 122, 232, 0.22);
          border-bottom: 1px solid rgba(139, 122, 232, 0.16);
        }

        .ops-item {
          position: relative;
          min-height: 260px;
          padding: 34px 28px 32px;
          border-right: 1px solid rgba(139, 122, 232, 0.14);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent),
            rgba(8, 6, 20, 0.62);
        }

        .ops-item:last-child {
          border-right: 0;
        }

        .ops-index {
          display: block;
          color: rgba(139, 122, 232, 0.68) !important;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.22em;
          margin-bottom: 34px;
        }

        .ops-value {
          display: block;
          color: #ffffff !important;
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(38px, 4vw, 68px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0;
          text-shadow: 0 0 30px rgba(139, 122, 232, 0.36);
          margin-bottom: 22px;
        }

        .ops-item h3 {
          color: #ffffff !important;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.25;
          text-transform: none;
          margin: 0 0 12px;
        }

        .ops-item p {
          color: rgba(216, 216, 224, 0.68) !important;
          font-size: 14px;
          line-height: 1.65;
          text-transform: none;
          margin: 0;
        }

        @media (max-width: 1199px) {
          .ops-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ops-item:nth-child(2) {
            border-right: 0;
          }

          .ops-item:nth-child(-n + 2) {
            border-bottom: 1px solid rgba(139, 122, 232, 0.14);
          }
        }

        @media (max-width: 640px) {
          .ops-section {
            padding: 78px 0 86px;
          }

          .ops-grid {
            grid-template-columns: 1fr;
          }

          .ops-item,
          .ops-item:nth-child(2) {
            min-height: auto;
            border-right: 0;
            border-bottom: 1px solid rgba(139, 122, 232, 0.14);
            padding: 28px 22px;
          }

          .ops-item:last-child {
            border-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
}

function Counter({ end, duration, active }: { end: number; duration: number; active: boolean }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!active || hasAnimated.current) return;
    hasAnimated.current = true;

    let frame = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(end * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setCount(end);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, duration, end]);

  return <>{Number.isInteger(end) ? Math.round(count) : count.toFixed(1)}</>;
}
