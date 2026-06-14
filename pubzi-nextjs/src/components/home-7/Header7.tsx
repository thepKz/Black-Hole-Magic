'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header7() {
  const [isScrolled, setIsScrolled] = useState(false)

  const openOffcanvas = () => {
    document.querySelector('.offcanvas__info')?.classList.add('info-open')
    document.querySelector('.offcanvas__overlay')?.classList.add('overlay-open')
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Header Section Start */}
      <header
        id="header-sticky"
        className={`bh-header ${isScrolled ? 'is-scrolled' : 'is-at-top'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          background: isScrolled ? 'rgba(6, 6, 10, 0.96)' : 'linear-gradient(180deg, rgba(6, 6, 10, 0.5) 0%, rgba(6, 6, 10, 0) 100%)',
          backdropFilter: isScrolled ? 'blur(18px)' : 'blur(0)',
          borderBottom: isScrolled ? '1px solid rgba(112, 90, 255, 0.28)' : '1px solid rgba(112, 90, 255, 0)',
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 14px 42px rgba(0, 0, 0, 0.38)' : 'none',
        }}
      >
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="logo">
                <Link href="/" className="header-logo" aria-label="BlackHole Game">
                  <img src="/assets/img/logo/white-logo-2.png" alt="logo-img" />
                  <span className="header-wordmark">BlackHole</span>
                </Link>
              </div>
              <div className="mean__menu-wrapper">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="active">
                        <Link href="/">Trang chủ</Link>
                      </li>
                      <li>
                        <Link href="/about">Về chúng tôi</Link>
                      </li>
                      <li>
                        <Link href="/game">Danh sách game</Link>
                      </li>
                      <li>
                        <Link href="/service">ICS GROUP</Link>
                      </li>
                      <li>
                        <Link href="/news">Tin tức</Link>
                      </li>
                      <li>
                        <Link href="/contact">Liên hệ</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center mt-0">
                <div className="header-right-icon">
                  <a href="#" className="main-header__search search-toggler">
                    <i className="fa-regular fa-magnifying-glass"></i>
                  </a>
                  <div className="header-button">
                    <Link href="/contact" className="header-electric-btn">
                      Liên hệ
                    </Link>
                  </div>
                  <div className="header__hamburger d-xl-block my-auto">
                    <button type="button" className="sidebar__toggle" aria-label="Mở menu" onClick={openOffcanvas}>
                      <img src="/assets/img/logo/dot.svg" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* GT Search Start */}
      <div className="search-popup">
        <div className="search-popup__overlay search-toggler"></div>
        <div className="search-popup__content">
          <form role="search" method="get" className="search-popup__form" action="#">
            <input type="text" id="search" name="search" placeholder="Tìm trận đấu, đội tuyển, tin tức..." />
            <button type="submit" aria-label="gửi tìm kiếm" className="search-btn">
              <span><i className="fa-regular fa-magnifying-glass"></i></span>
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        #header-sticky.bh-header.is-at-top,
        #header-sticky.bh-header.is-at-top.header-7,
        #header-sticky.bh-header.is-at-top.header-2 {
          background-color: transparent !important;
          background-image: linear-gradient(180deg, rgba(6, 6, 10, 0.5) 0%, rgba(6, 6, 10, 0) 100%) !important;
          border-bottom-color: transparent !important;
          box-shadow: none !important;
        }

        #header-sticky.bh-header.is-scrolled,
        #header-sticky.bh-header.is-scrolled.header-7,
        #header-sticky.bh-header.is-scrolled.header-2 {
          background-color: rgba(6, 6, 10, 0.96) !important;
          background-image: none !important;
          border-bottom-color: rgba(112, 90, 255, 0.28) !important;
        }

        #header-sticky.bh-header .container-fluid {
          padding-left: 42px !important;
          padding-right: 42px !important;
        }

        #header-sticky.bh-header .header-main {
          min-height: 76px;
          padding: 8px 0 !important;
        }

        #header-sticky.bh-header .header-logo img {
          width: 104px;
          max-height: 62px;
          object-fit: contain;
        }

        #header-sticky.bh-header .header-logo {
          display: inline-flex !important;
          align-items: center;
          gap: 2px;
          text-decoration: none;
        }

        #header-sticky.bh-header .header-wordmark {
          font-family: var(--font-title-extra);
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0;
          color: #ffffff !important;
          text-transform: none;
          text-shadow:
            0 0 14px rgba(255, 255, 255, 0.24),
            0 0 24px rgba(108, 92, 231, 0.35);
          white-space: nowrap;
          transform: translateX(-12px);
        }

        #header-sticky.bh-header .main-menu > nav > ul {
          gap: 18px;
        }

        #header-sticky.bh-header .main-menu ul li {
          margin: 0 4px !important;
        }

        #header-sticky.bh-header .main-menu ul li a {
          padding: 22px 0 !important;
          font-size: 18px !important;
          line-height: 1.1 !important;
        }

        #header-sticky.bh-header .main-menu > nav > ul > li > a {
          position: relative;
          letter-spacing: 0.02em;
        }

        #header-sticky.bh-header .main-menu > nav > ul > li > a::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 15px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #9b7cff, transparent);
          opacity: 0;
          transform: scaleX(0.45);
          transition: opacity 0.24s ease, transform 0.24s ease;
        }

        #header-sticky.bh-header .main-menu > nav > ul > li:hover > a::after,
        #header-sticky.bh-header .main-menu > nav > ul > li.active > a::after {
          opacity: 1;
          transform: scaleX(1);
        }

        #header-sticky .header-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 0 14px;
          border: 1px solid rgba(155, 124, 255, 0.45);
          background: rgba(14, 10, 32, 0.7);
          color: #ffffff !important;
          font-family: var(--font-subtitle-krafting);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          box-shadow: inset 0 0 20px rgba(75, 34, 216, 0.18);
        }

        #header-sticky .header-live-pill span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff3b6b;
          box-shadow: 0 0 0 5px rgba(255, 59, 107, 0.15), 0 0 16px rgba(255, 59, 107, 0.9);
          animation: live-pulse 1.25s ease-in-out infinite;
        }

        #header-sticky .header-electric-btn {
          --electric-purple: #4b22d8;
          --electric-purple-bright: #9b7cff;
          --electric-ink: rgba(20, 10, 55, 0.72);
          position: relative !important;
          isolation: isolate;
          overflow: hidden !important;
          min-width: 160px;
          height: 48px;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          font-size: 15px !important;
          letter-spacing: 1.2px !important;
          background:
            linear-gradient(180deg, rgba(34, 18, 78, 0.88), rgba(8, 6, 20, 0.9)) padding-box,
            linear-gradient(135deg, var(--electric-purple-bright), var(--electric-purple) 42%, #2d117e 72%, var(--electric-purple-bright)) border-box !important;
          border: 2px solid transparent !important;
          color: #ffffff !important;
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 16px) 100%, 0 100%, 0 14px);
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.64);
          box-shadow:
            0 0 0 1px rgba(115, 75, 255, 0.45),
            0 0 16px rgba(83, 39, 216, 0.64),
            inset 0 0 24px rgba(75, 34, 216, 0.22) !important;
          transform: translateZ(0);
          transition:
            transform 0.28s ease,
            filter 0.28s ease,
            box-shadow 0.28s ease !important;
          animation: electric-frame-pulse 2.6s ease-in-out infinite;
        }

        #header-sticky.bh-header .header-right-icon {
          gap: 16px !important;
        }

        #header-sticky.bh-header .sidebar__toggle img {
          width: 42px;
          height: auto;
        }

        #header-sticky .header-electric-btn::before {
          content: "";
          position: absolute;
          inset: -2px;
          z-index: -1;
          clip-path: inherit;
          background:
            linear-gradient(90deg, transparent 0%, rgba(190, 166, 255, 0.95) 10%, transparent 22%) 0 0 / 220% 2px no-repeat,
            linear-gradient(180deg, transparent 0%, rgba(190, 166, 255, 0.9) 14%, transparent 28%) 100% 0 / 2px 220% no-repeat,
            linear-gradient(90deg, transparent 0%, rgba(190, 166, 255, 0.95) 12%, transparent 25%) 100% 100% / 220% 2px no-repeat,
            linear-gradient(180deg, transparent 0%, rgba(190, 166, 255, 0.9) 14%, transparent 30%) 0 100% / 2px 220% no-repeat;
          filter: drop-shadow(0 0 8px rgba(155, 124, 255, 0.95));
          opacity: 0.9;
          animation: electric-run 1.85s linear infinite;
        }

        #header-sticky .header-electric-btn::after {
          content: "";
          position: absolute;
          inset: 4px;
          z-index: -1;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 13px) 100%, 0 100%, 0 12px);
          background:
            radial-gradient(circle at 18% 18%, rgba(155, 124, 255, 0.32), transparent 34%),
            linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.16) 46%, transparent 60%);
          transform: translateX(-22%);
          transition: transform 0.34s ease, opacity 0.34s ease;
          opacity: 0.58;
        }

        #header-sticky .header-electric-btn:hover {
          color: #ffffff !important;
          transform: translateY(-2px) scale(1.035);
          filter: drop-shadow(0 0 14px rgba(100, 52, 255, 0.78));
          box-shadow:
            0 0 0 1px rgba(168, 138, 255, 0.8),
            0 0 24px rgba(83, 39, 216, 0.9),
            0 0 48px rgba(55, 22, 173, 0.55),
            inset 0 0 30px rgba(75, 34, 216, 0.34) !important;
        }

        #header-sticky .header-electric-btn:hover::after {
          transform: translateX(22%);
          opacity: 0.9;
        }

        @keyframes electric-frame-pulse {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(115, 75, 255, 0.45),
              0 0 14px rgba(83, 39, 216, 0.54),
              inset 0 0 22px rgba(75, 34, 216, 0.18);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(166, 136, 255, 0.78),
              0 0 24px rgba(98, 54, 235, 0.82),
              inset 0 0 30px rgba(75, 34, 216, 0.3);
          }
        }

        @keyframes electric-run {
          0% {
            background-position: -120% 0, 100% -120%, 220% 100%, 0 220%;
          }
          100% {
            background-position: 220% 0, 100% 220%, -120% 100%, 0 -120%;
          }
        }

        @keyframes live-pulse {
          0%, 100% { transform: scale(0.9); opacity: 0.72; }
          50% { transform: scale(1.18); opacity: 1; }
        }

        @media (max-width: 1199px) {
          #header-sticky .header-electric-btn,
          #header-sticky .header-live-pill {
            display: none !important;
          }
        }

        @media (max-width: 1199px) {
          #header-sticky.bh-header .container-fluid {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          #header-sticky.bh-header .header-main {
            min-height: 64px;
            padding: 6px 0 !important;
          }

          #header-sticky.bh-header .header-logo img {
            width: 82px;
            max-height: 50px;
          }

          #header-sticky.bh-header .header-logo {
            gap: 0;
          }

          #header-sticky.bh-header .header-wordmark {
            font-size: 18px;
            transform: translateX(-10px);
          }
        }

        #header-sticky.bh-header {
          height: 78px !important;
          min-height: 78px !important;
          padding: 0 !important;
          overflow: visible;
        }

        #header-sticky.bh-header.is-at-top {
          background:
            linear-gradient(180deg, rgba(7, 6, 15, 0.86) 0%, rgba(7, 6, 15, 0.5) 68%, rgba(7, 6, 15, 0) 100%) !important;
          border-bottom: 1px solid rgba(146, 118, 255, 0.14) !important;
        }

        #header-sticky.bh-header.is-scrolled {
          background: rgba(6, 6, 10, 0.92) !important;
          border-bottom: 1px solid rgba(146, 118, 255, 0.24) !important;
          backdrop-filter: blur(14px);
        }

        #header-sticky.bh-header .container-fluid,
        #header-sticky.bh-header .mega-menu-wrapper,
        #header-sticky.bh-header .header-main {
          height: 100%;
        }

        #header-sticky.bh-header .container-fluid {
          padding-left: clamp(22px, 4vw, 72px) !important;
          padding-right: clamp(22px, 4vw, 72px) !important;
        }

        #header-sticky.bh-header .header-main {
          display: grid !important;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: clamp(22px, 2.6vw, 46px);
          min-height: 0 !important;
          padding: 0 !important;
        }

        #header-sticky.bh-header .logo {
          width: auto;
          min-width: 214px;
        }

        #header-sticky.bh-header .header-logo {
          gap: 9px;
          transform: none;
        }

        #header-sticky.bh-header .header-logo img {
          width: 48px;
          height: 48px;
          max-height: 48px;
          object-fit: contain;
        }

        #header-sticky.bh-header .header-wordmark {
          transform: none;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 0;
          text-shadow: 0 0 18px rgba(255, 255, 255, 0.18);
        }

        #header-sticky.bh-header .mean__menu-wrapper {
          min-width: 0;
        }

        #header-sticky.bh-header .main-menu {
          display: flex;
          justify-content: center;
          min-width: 0;
        }

        #header-sticky.bh-header .main-menu > nav > ul {
          display: flex !important;
          align-items: center;
          justify-content: center;
          gap: clamp(12px, 1.25vw, 24px);
          flex-wrap: nowrap;
        }

        #header-sticky.bh-header .main-menu ul li {
          margin: 0 !important;
        }

        #header-sticky.bh-header .main-menu > nav > ul > li > a {
          height: 78px;
          display: inline-flex !important;
          align-items: center;
          padding: 0 !important;
          color: rgba(243, 241, 255, 0.84) !important;
          font-family: var(--font-subtitle-krafting);
          font-size: clamp(13px, 0.78vw, 15px) !important;
          font-weight: 800;
          line-height: 1 !important;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        #header-sticky.bh-header .main-menu > nav > ul > li > a::after {
          bottom: 18px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(156, 128, 255, 0.95), transparent);
        }

        #header-sticky.bh-header .main-menu > nav > ul > li:hover > a,
        #header-sticky.bh-header .main-menu > nav > ul > li.active > a {
          color: #9b7cff !important;
        }

        #header-sticky.bh-header .header-right-icon {
          display: flex !important;
          align-items: center;
          gap: 12px !important;
        }

        #header-sticky .header-live-pill {
          height: 34px;
          padding: 0 12px;
          border-color: rgba(155, 124, 255, 0.34);
          background: rgba(14, 10, 32, 0.58);
          font-size: 12px;
          letter-spacing: 0.06em;
          box-shadow: inset 0 0 14px rgba(75, 34, 216, 0.14);
        }

        #header-sticky .main-header__search {
          width: 38px;
          height: 38px;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          color: rgba(229, 226, 255, 0.86) !important;
          border: 1px solid rgba(155, 124, 255, 0.18);
          background: rgba(12, 9, 26, 0.34);
          text-decoration: none;
        }

        #header-sticky .main-header__search i {
          font-size: 15px;
        }

        #header-sticky .header-electric-btn {
          min-width: 144px;
          height: 42px;
          padding: 0 18px;
          border: 1px solid rgba(155, 124, 255, 0.68) !important;
          background:
            linear-gradient(180deg, rgba(39, 22, 90, 0.72), rgba(9, 7, 22, 0.84)) !important;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          color: #ffffff !important;
          font-family: var(--font-subtitle-krafting);
          font-size: 13px !important;
          font-weight: 800;
          letter-spacing: 0.06em !important;
          line-height: 1;
          text-transform: uppercase;
          text-decoration: none;
          text-shadow: none;
          box-shadow:
            0 0 0 1px rgba(88, 54, 214, 0.16),
            inset 0 0 18px rgba(75, 34, 216, 0.16) !important;
          animation: none !important;
        }

        #header-sticky .header-electric-btn::before {
          display: none !important;
        }

        #header-sticky .header-electric-btn::after {
          inset: 1px;
          opacity: 0.26;
          background: linear-gradient(105deg, transparent 0%, rgba(255, 255, 255, 0.18) 45%, transparent 62%);
          transform: translateX(-34%);
          animation: none !important;
        }

        #header-sticky .header-electric-btn:hover {
          transform: translateY(-1px);
          filter: none;
          border-color: rgba(199, 181, 255, 0.9) !important;
          box-shadow:
            0 0 0 1px rgba(155, 124, 255, 0.32),
            0 12px 30px rgba(44, 17, 145, 0.34),
            inset 0 0 22px rgba(75, 34, 216, 0.22) !important;
        }

        #header-sticky .header-electric-btn:hover::after {
          transform: translateX(34%);
          opacity: 0.54;
        }

        #header-sticky.bh-header .sidebar__toggle {
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          appearance: none;
          border: 1px solid rgba(155, 124, 255, 0.18);
          background: rgba(12, 9, 26, 0.3);
        }

        #header-sticky.bh-header .sidebar__toggle img {
          width: 25px;
          opacity: 0.9;
        }

        @media (max-width: 1399px) {
          #header-sticky .header-live-pill {
            display: none !important;
          }

          #header-sticky.bh-header .logo {
            min-width: 190px;
          }
        }

        @media (max-width: 1199px) {
          #header-sticky.bh-header {
            height: 66px !important;
            min-height: 66px !important;
          }

          #header-sticky.bh-header .container-fluid {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }

          #header-sticky.bh-header .header-main {
            grid-template-columns: auto auto;
          }

          #header-sticky.bh-header .logo {
            min-width: 0;
          }

          #header-sticky.bh-header .header-logo img {
            width: 40px;
            height: 40px;
            max-height: 40px;
          }

          #header-sticky.bh-header .header-wordmark {
            font-size: 18px;
          }

          #header-sticky .header-electric-btn,
          #header-sticky .header-live-pill,
          #header-sticky .main-header__search {
            display: none !important;
          }

          #header-sticky.bh-header .sidebar__toggle {
            width: 38px;
            height: 38px;
          }
        }

        #header-sticky.bh-header,
        #header-sticky.bh-header.is-at-top,
        #header-sticky.bh-header.is-scrolled {
          border: 0 !important;
          border-bottom: 0 !important;
          box-shadow: none !important;
        }

        #header-sticky .header-live-pill {
          display: none !important;
        }

        #header-sticky .main-header__search,
        #header-sticky.bh-header .sidebar__toggle {
          border: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        #header-sticky .header-electric-btn {
          border: 0 !important;
          background: rgba(39, 22, 90, 0.76) !important;
          box-shadow: inset 0 0 18px rgba(75, 34, 216, 0.18) !important;
        }

        #header-sticky .header-electric-btn:hover {
          border: 0 !important;
          box-shadow: 0 12px 30px rgba(44, 17, 145, 0.28), inset 0 0 22px rgba(75, 34, 216, 0.24) !important;
        }
      `}</style>
    </>
  )
}
