'use client';

import Link from 'next/link';
import Image from 'next/image';

const NEWS = [
  {
    image: '/assets/img/home-2/news/news-01.jpg',
    date: '13 Tháng 06, 2026',
    tag: 'Vận hành',
    title: 'Black Hole mở lịch triển khai cộng đồng mùa hè 2026',
    summary: 'Các gói hỗ trợ launch, creator seeding và tournament ops được gom về một đầu mối triển khai.',
    link: '/news-details',
  },
  {
    image: '/assets/img/home-2/news/news-02.jpg',
    date: '10 Tháng 06, 2026',
    tag: 'Phân tích',
    title: 'Những điểm cần khóa trước ngày mở server tại Việt Nam',
    summary: 'Localize, thanh toán, CSKH và kịch bản cộng đồng cần được kiểm tra như một hệ thống thống nhất.',
    link: '/news-details',
  },
  {
    image: '/assets/img/home-2/news/news-03.jpg',
    date: '06 Tháng 06, 2026',
    tag: 'Creator',
    title: 'Giữ nhịp cộng đồng sau tuần ra mắt bằng creator hub',
    summary: 'Một lịch nội dung đủ chặt giúp streamer, caster và người chơi cùng đẩy nhịp tăng trưởng.',
    link: '/news-details',
  },
];

export default function NewsSection7() {
  const [featured, ...secondary] = NEWS;

  return (
    <section className="news7-section">
      <div className="news7-container">
        <div className="news7-head">
          <h2>Bản tin từ đấu trường</h2>
          <p>Góc nhìn vận hành, publishing và cộng đồng game dành cho đối tác đang chuẩn bị vào thị trường Việt Nam.</p>
        </div>

        <div className="news7-grid">
          <article className="news7-feature">
            <Link href={featured.link} className="news7-image news7-image-large" aria-label={featured.title}>
              <Image src={featured.image} alt={featured.title} width={760} height={520} />
            </Link>
            <div className="news7-copy">
              <span className="news7-meta">{featured.tag} / {featured.date}</span>
              <h3><Link href={featured.link}>{featured.title}</Link></h3>
              <p>{featured.summary}</p>
              <Link href={featured.link} className="news7-link">Đọc bản tin</Link>
            </div>
          </article>

          <div className="news7-stack">
            {secondary.map((item) => (
              <article className="news7-row" key={item.title}>
                <Link href={item.link} className="news7-image" aria-label={item.title}>
                  <Image src={item.image} alt={item.title} width={320} height={220} />
                </Link>
                <div className="news7-copy">
                  <span className="news7-meta">{item.tag} / {item.date}</span>
                  <h3><Link href={item.link}>{item.title}</Link></h3>
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .news7-section {
          position: relative;
          z-index: 9;
          overflow: hidden;
          background: #0a0a0c !important;
          padding: 128px 0 136px;
        }

        .news7-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 140px;
          background: linear-gradient(180deg, #080614 0%, rgba(10, 10, 12, 0) 100%);
          pointer-events: none;
        }

        .news7-container {
          position: relative;
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
        }

        .news7-head {
          max-width: 760px;
          margin-bottom: 62px;
        }

        .news7-head h2 {
          color: #ffffff !important;
          font-family: 'Chakra Petch', sans-serif;
          font-size: clamp(38px, 4vw, 64px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: 0;
          text-transform: none;
          margin: 0 0 18px;
        }

        .news7-head p,
        .news7-copy p {
          color: rgba(216, 216, 224, 0.68) !important;
          text-transform: none;
          line-height: 1.7;
          margin: 0;
        }

        .news7-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(380px, 0.82fr);
          gap: clamp(28px, 4vw, 58px);
          align-items: start;
        }

        .news7-feature,
        .news7-row {
          position: relative;
        }

        .news7-image {
          display: block;
          position: relative;
          overflow: hidden;
          background: #11101d;
          clip-path: polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px);
        }

        .news7-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.92) contrast(1.08) brightness(0.82);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.55s ease;
        }

        .news7-image:hover img,
        .news7-image:focus-visible img {
          transform: scale(1.045);
          filter: saturate(1.05) contrast(1.12) brightness(0.94);
        }

        .news7-image-large {
          aspect-ratio: 1.46 / 1;
          margin-bottom: 28px;
        }

        .news7-stack {
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding-top: 58px;
        }

        .news7-row {
          display: grid;
          grid-template-columns: 170px minmax(0, 1fr);
          gap: 22px;
          padding-top: 28px;
          border-top: 1px solid rgba(139, 122, 232, 0.18);
        }

        .news7-row .news7-image {
          aspect-ratio: 1.1 / 1;
        }

        .news7-meta {
          display: block;
          color: rgba(155, 124, 255, 0.82) !important;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .news7-copy h3 {
          margin: 0 0 14px;
        }

        .news7-copy h3 a {
          color: #ffffff !important;
          font-family: 'Chakra Petch', sans-serif;
          font-size: clamp(22px, 2vw, 32px);
          line-height: 1.15;
          text-transform: none;
          text-decoration: none;
          transition: color 0.25s ease;
        }

        .news7-row .news7-copy h3 a {
          font-size: 20px;
          line-height: 1.25;
        }

        .news7-copy h3 a:hover,
        .news7-copy h3 a:focus-visible {
          color: #9b7cff !important;
        }

        .news7-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 24px;
          min-height: 48px;
          padding: 0 20px;
          color: #ffffff !important;
          border: 1px solid rgba(139, 122, 232, 0.55);
          background: rgba(21, 13, 58, 0.72);
          font-family: 'Chakra Petch', sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }

        .news7-link:hover,
        .news7-link:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(207, 195, 255, 0.9);
          background: rgba(75, 34, 216, 0.78);
        }

        .news7-image:focus-visible,
        .news7-link:focus-visible,
        .news7-copy h3 a:focus-visible {
          outline: 2px solid #8b7ae8;
          outline-offset: 4px;
        }

        @media (max-width: 1199px) {
          .news7-grid {
            grid-template-columns: 1fr;
          }

          .news7-stack {
            padding-top: 0;
          }
        }

        @media (max-width: 640px) {
          .news7-section {
            padding: 88px 0 96px;
          }

          .news7-row {
            grid-template-columns: 1fr;
          }

          .news7-row .news7-image {
            aspect-ratio: 1.55 / 1;
          }
        }
      `}</style>
    </section>
  );
}
