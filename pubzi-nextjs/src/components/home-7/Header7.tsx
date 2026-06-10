'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header7() {
  const [isScrolled, setIsScrolled] = useState(false)

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
        className={`header-2 header-4 header-7 bh-header ${isScrolled ? 'is-scrolled' : 'is-at-top'}`}
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
                <Link href="/" className="header-logo">
                  <img src="/assets/img/logo/white-logo.svg" alt="logo-img" />
                </Link>
              </div>
              <div className="mean__menu-wrapper">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="has-dropdown active menu-thumb">
                        <Link href="/">
                          Home
                        </Link>
                        <ul className="submenu has-homemenu style-2">
                          <li>
                            <div className="homemenu-items">
                              <div className="homemenu">
                                <div className="homemenu-thumb mb-15">
                                  <img src="/assets/img/header/home-7.jpg" alt="img" />
                                  <div className="demo-button">
                                    <Link href="/" className="gt-theme-btn">
                                      View Home
                                    </Link>
                                  </div>
                                </div>
                                <div className="homemenu-content text-center">
                                  <h4 className="homemenu-title">
                                    Black Hole
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li className="has-dropdown active d-xl-none">
                        <Link href="/" className="border-none">
                          Home
                        </Link>
                        <ul className="submenu">
                          <li><Link href="/">Black Hole</Link></li>
                        </ul>
                      </li>
                      <li>
                        <Link href="/about">About Us</Link>
                      </li>
                      <li>
                        <Link href="/match-details">
                          matches
                        </Link>
                        <ul className="submenu">
                          <li><Link href="/match">matches Page</Link></li>
                          <li><Link href="/match-details">matches Details</Link></li>
                        </ul>
                      </li>
                      <li>
                        <Link href="/news-details">
                          Pages
                        </Link>
                        <ul className="submenu">
                          <li className="has-dropdown">
                            <Link href="/service-details">
                              Our Service
                              <i className="fas fa-angle-right"></i>
                            </Link>
                            <ul className="submenu">
                              <li><Link href="/service">Our Services</Link></li>
                              <li><Link href="/service-details">Service Details</Link></li>
                            </ul>
                          </li>
                          <li className="has-dropdown">
                            <Link href="/game-details">
                              Our Games
                              <i className="fas fa-angle-right"></i>
                            </Link>
                            <ul className="submenu">
                              <li><Link href="/game">Our Games</Link></li>
                              <li><Link href="/game-details">Game Details</Link></li>
                            </ul>
                          </li>
                          <li className="has-dropdown">
                            <Link href="/team-details">
                              Our Team
                              <i className="fas fa-angle-right"></i>
                            </Link>
                            <ul className="submenu">
                              <li><Link href="/team">Our Team</Link></li>
                              <li><Link href="/team-details">Team Details</Link></li>
                            </ul>
                          </li>
                          <li><Link href="/gallery">epic gallery</Link></li>
                          <li><Link href="/pricing">Our Pricing</Link></li>
                          <li><Link href="/faq">Our Faq</Link></li>
                          <li><Link href="/coming-soon">Coming Soon</Link></li>
                          <li><Link href="/404">404 Page</Link></li>
                        </ul>
                      </li>
                      <li>
                        <Link href="/news-details">
                          Blog
                        </Link>
                        <ul className="submenu">
                          <li><Link href="/news-grid">Blog Grid</Link></li>
                          <li><Link href="/news">Blog Standard</Link></li>
                          <li><Link href="/news-details">Blog Details</Link></li>
                        </ul>
                      </li>
                      <li>
                        <Link href="/contact">Contact Us</Link>
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
                    <Link href="/contact" className="gt-theme-btn gt-style-border header-electric-btn">
                      get in touch
                    </Link>
                  </div>
                  <div className="header__hamburger d-xl-block my-auto">
                    <div className="sidebar__toggle">
                      <img src="/assets/img/logo/dot.svg" alt="" />
                    </div>
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
            <input type="text" id="search" name="search" placeholder="Search Here..." />
            <button type="submit" aria-label="search submit" className="search-btn">
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

        #header-sticky .header-electric-btn {
          --electric-purple: #4b22d8;
          --electric-purple-bright: #9b7cff;
          --electric-ink: rgba(20, 10, 55, 0.72);
          position: relative !important;
          isolation: isolate;
          overflow: hidden !important;
          min-width: 200px;
          height: 60px;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
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

        @media (max-width: 1199px) {
          #header-sticky .header-electric-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
