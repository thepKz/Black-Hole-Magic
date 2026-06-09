'use client'

import Link from 'next/link'

export default function Header2() {
    return (
        <>
            {/* Header Section Start */}
            <header id="header-sticky" className="header-2">
                <div className="container-fluid">
                    <div className="mega-menu-wrapper">
                        <div className="header-main">
                            <div className="header-left">
                                <div className="header__hamburger d-xl-block my-auto">
                                    <div className="sidebar__toggle">
                                        <img src="/assets/img/logo/ber.svg" alt="" />
                                    </div>
                                </div>
                                <div className="logo">
                                    <Link href="/" className="header-logo">
                                        <img src="/assets/img/logo/white-logo-3.svg" alt="logo-img" />
                                    </Link>
                                </div>
                            </div>
                            <div className="header-right d-flex justify-content-end align-items-center mt-0">
                                <div className="mean__menu-wrapper">
                                    <div className="main-menu">
                                        <nav id="mobile-menu">
                                            <ul>
                                                <li className="has-dropdown active menu-thumb">
                                                    <Link href="/">
                                                        Home
                                                    </Link>
                                                    <ul className="submenu has-homemenu">
                                                        <li>
                                                            <div className="homemenu-items">
                                                                <div className="homemenu">
                                                                    <div className="homemenu-thumb mb-15">
                                                                        <img src="/assets/img/header/home-2.jpg" alt="img" />
                                                                        <div className="demo-button">
                                                                            <Link href="/" className="gt-theme-btn">
                                                                                View Demo
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                    <div className="homemenu-content text-center">
                                                                        <h4 className="homemenu-title">
                                                                            Esport
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                                <div className="homemenu">
                                                                    <div className="homemenu-thumb mb-15">
                                                                        <img src="/assets/img/header/home-7.jpg" alt="img" />
                                                                        <div className="demo-button">
                                                                            <Link href="/home-7" className="gt-theme-btn">
                                                                                View Demo
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                    <div className="homemenu-content text-center">
                                                                        <h4 className="homemenu-title">
                                                                            Gaming Studio
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
                                                        <li><Link href="/">Esport</Link></li>
                                                        <li><Link href="/home-7">Gaming Studio</Link></li>
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
                                                <li className="has-dropdown">
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
                                <div className="header-right-icon">
                                    <a href="#" className="main-header__search search-toggler">
                                        <i className="fa-regular fa-magnifying-glass"></i>
                                    </a>
                                    <div className="header-button">
                                        <Link href="/contact" className="theme-btn style-2">
                                            <span className="left-line"></span>
                                            get in touch
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M9.41099 8.46917L1.88219 16L0 14.1166L7.53013 6.58846L0.941096 0H16V15.0576L9.41099 8.46917Z" fill="#0B0E13"></path>
                                            </svg>
                                        </Link>
                                    </div>
                                    <div className="header__hamburger d-xl-none d-xl-block my-auto">
                                        <div className="sidebar__toggle">
                                            <img src="/assets/img/logo/dot-ber.svg" alt="" />
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
        </>
    )
}
