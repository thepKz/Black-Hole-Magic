'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface OffcanvasProps {
  variant?: 'default' | 'style-2';
}

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/about', label: 'Về chúng tôi' },
  { href: '/game', label: 'Danh sách game' },
  { href: '/service', label: 'ICS Group' },
  { href: '/news', label: 'Tin tức' },
  { href: '/contact', label: 'Liên hệ' },
];

export default function Offcanvas({ variant = 'default' }: OffcanvasProps) {
  const styleClass = variant === 'style-2' ? 'style-2' : '';
  const closeOffcanvas = () => {
    document.querySelector('.offcanvas__info')?.classList.remove('info-open');
    document.querySelector('.offcanvas__overlay')?.classList.remove('overlay-open');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeOffcanvas();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="fix-area">
        <div className={`offcanvas__info ${styleClass}`}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link href="/" onClick={closeOffcanvas} className="offcanvas__brand">
                    <img src="/assets/img/logo/white-logo-2.png" alt="BlackHole" />
                    <span>BlackHole</span>
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button type="button" aria-label="Đóng menu" onClick={closeOffcanvas}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <nav className="offcanvas__nav">
                <ul>
                  {NAV_LINKS.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={closeOffcanvas}>
                        {item.label}
                        <i className="fas fa-arrow-right"></i>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <Link href="/contact" className="offcanvas__cta" onClick={closeOffcanvas}>
                Liên hệ ngay
              </Link>

              <div className="offcanvas__contact">
                <h4>Liên hệ</h4>
                <ul>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon">
                      <i className="fal fa-map-marker-alt"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.google.com/maps/search/?api=1&query=S%E1%BB%91%20777%20Nguy%E1%BB%85n%20Thi%E1%BB%87n%20Thu%E1%BA%ADt%2C%20M%E1%BB%B9%20H%C3%A0o%2C%20H%C6%B0ng%20Y%C3%AAn"
                      >
                        777 Nguyễn Thiện Thuật, Mỹ Hào, Hưng Yên
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-envelope"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a href="mailto:contact@blackholegame.com">contact@blackholegame.com</a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="far fa-phone"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a href="tel:+84779467868">0779467868</a>
                    </div>
                  </li>
                </ul>
                <div className="social-icon d-flex align-items-center">
                  <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                  <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                  <a href="#" aria-label="Discord"><i className="fab fa-discord"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="offcanvas__overlay" onClick={closeOffcanvas}></div>

      <style jsx global>{`
        .offcanvas__info {
          background: #0a0714 !important;
        }

        .offcanvas__brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .offcanvas__brand img {
          width: 38px;
          height: 38px;
          object-fit: contain;
        }
        .offcanvas__brand span {
          font-family: var(--font-title-extra, 'Chakra Petch', sans-serif);
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          text-shadow: 0 0 16px rgba(108, 92, 231, 0.4);
        }

        .offcanvas__nav {
          margin-bottom: 28px;
        }

        .offcanvas__nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .offcanvas__nav li {
          border-bottom: 1px solid rgba(155, 124, 255, 0.12);
        }

        .offcanvas__nav li a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 4px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: rgba(243, 241, 255, 0.82) !important;
          text-decoration: none;
          transition: color 0.25s ease, padding-left 0.25s ease;
        }

        .offcanvas__nav li a i {
          font-size: 12px;
          color: #8b7ae8;
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .offcanvas__nav li a:hover {
          color: #b09cff !important;
          padding-left: 12px;
        }

        .offcanvas__nav li a:hover i {
          opacity: 1;
          transform: translateX(0);
        }

        .offcanvas__cta {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 14px;
          margin-bottom: 36px;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff !important;
          text-decoration: none;
          background: linear-gradient(135deg, #6c5ce7, #4b22d8);
          border-radius: 8px;
          box-shadow: 0 8px 26px rgba(75, 34, 216, 0.4);
          transition: filter 0.25s ease, transform 0.2s ease;
        }

        .offcanvas__cta:hover {
          filter: brightness(1.12);
          transform: translateY(-2px);
        }

        .offcanvas__contact h4 {
          color: #fff !important;
          font-family: var(--font-subtitle-krafting, 'Chakra Petch', sans-serif);
          margin-bottom: 16px;
        }

        .offcanvas__contact-text a {
          color: rgba(216, 216, 224, 0.78) !important;
        }

        .offcanvas__contact-text a:hover {
          color: #b09cff !important;
        }

        .offcanvas__contact .offcanvas__contact-icon i {
          color: #8b7ae8;
        }

        .offcanvas__info .social-icon a {
          color: rgba(216, 216, 224, 0.8) !important;
          transition: color 0.25s ease, background 0.25s ease;
        }

        .offcanvas__info .social-icon a:hover {
          color: #fff !important;
        }
      `}</style>
    </>
  );
}
