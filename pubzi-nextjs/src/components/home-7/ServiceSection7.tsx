'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    num: '01',
    title: 'Thực chiến',
    body: 'Không lý thuyết, không template. Mọi chiến lược đều xuất phát từ dữ liệu thực và kinh nghiệm vận hành thực tế.',
  },
  {
    num: '02',
    title: 'Hệ sinh thái khép kín',
    body: 'Từ bản địa hóa đến thanh toán và pháp lý — mọi mắt xích đều nằm trong cùng một ecosystem tối ưu.',
  },
  {
    num: '03',
    title: 'ROI làm trọng tâm',
    body: 'Mọi quyết định đều được đo lường bằng chỉ số. Tối ưu ROI là ngôn ngữ chung với mọi đối tác và nhà đầu tư.',
  },
  {
    num: '04',
    title: 'Tư duy toàn cầu',
    body: 'Am hiểu thị trường địa phương, kết nối tiêu chuẩn quốc tế. Cầu nối tin cậy giữa game studio và người chơi Việt Nam.',
  },
];

export default function ServiceSection7() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.values-head', {
        opacity: 0,
        y: 30,
        filter: 'blur(6px)',
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.values-head', start: 'top 85%' },
      });

      gsap.from('.value-card', {
        opacity: 0,
        y: 44,
        filter: 'blur(8px)',
        duration: 0.7,
        stagger: 0.14,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.values-grid', start: 'top 82%' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="values-section">
      <div className="container">
        <div className="values-head">
          <h6 className="values-kicker">LỢI THẾ CẠNH TRANH</h6>
          <h2 className="values-title">Vì sao chọn Blackhole Game</h2>
        </div>

        <div className="values-grid">
          {VALUES.map((v) => (
            <article key={v.num} className="value-card">
              <span className="value-num">{v.num}</span>
              <h3 className="value-card-title">{v.title}</h3>
              <p className="value-card-body">{v.body}</p>
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .values-section {
          position: relative;
          z-index: 9;
          background: #080614;
          padding: 110px 0 120px;
        }

        /* thin glow seam where this section slides over the About story */
        .values-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 6%, rgba(139, 122, 232, 0.65) 50%, transparent 94%);
        }

        .values-section::after {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 70vw;
          height: 140px;
          background: radial-gradient(ellipse at 50% 0%, rgba(108, 92, 231, 0.16), transparent 70%);
          pointer-events: none;
        }

        .values-head {
          text-align: center;
          margin-bottom: 56px;
          will-change: transform, filter, opacity;
        }

        .values-kicker {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #8b7ae8;
          margin-bottom: 18px;
        }

        .values-title {
          font-size: 38px;
          font-weight: 800;
          line-height: 1.25;
          color: #fff;
          text-shadow:
            0 0 20px rgba(255, 255, 255, 0.4),
            0 0 52px rgba(139, 122, 232, 0.7);
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .value-card {
          position: relative;
          overflow: hidden;
          padding: 34px 26px 30px;
          border: 1px solid rgba(139, 122, 232, 0.22);
          border-radius: 14px;
          background:
            radial-gradient(circle at 80% 0%, rgba(139, 122, 232, 0.14), transparent 52%),
            linear-gradient(165deg, rgba(139, 122, 232, 0.09), rgba(16, 10, 38, 0.4) 58%);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          will-change: transform, filter, opacity;
        }

        .value-card:hover {
          transform: translateY(-6px);
          border-color: rgba(176, 156, 255, 0.55);
          box-shadow:
            0 0 18px rgba(108, 92, 231, 0.3),
            0 18px 44px rgba(8, 2, 34, 0.6);
        }

        .value-num {
          position: absolute;
          top: 6px;
          right: 14px;
          font-size: 84px;
          font-weight: 900;
          line-height: 1;
          color: rgba(139, 122, 232, 0.1);
          pointer-events: none;
          user-select: none;
        }

        .value-card-title {
          position: relative;
          font-size: 19px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 14px;
          padding-bottom: 14px;
        }

        .value-card-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 34px;
          height: 2px;
          background: linear-gradient(90deg, #8b7ae8, transparent);
          transition: width 0.3s ease;
        }

        .value-card:hover .value-card-title::after {
          width: 64px;
        }

        .value-card-body {
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.74);
          text-transform: none;
        }

        @media (max-width: 1199px) {
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .values-title {
            font-size: 32px;
          }
        }

        @media (max-width: 600px) {
          .values-section {
            padding: 80px 0 90px;
          }

          .values-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .values-title {
            font-size: 26px;
          }

          .values-head {
            margin-bottom: 40px;
          }
        }
      `}</style>
    </section>
  );
}
