'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer7() {
  return (
    <footer className="footer-section-5 fix bg-cover" style={{ backgroundImage: 'url(/assets/img/home-5/Footer.png)' }}>
      <div className="container">
        <div className="footer-widget-wrapper-5">
          <div className="row">
            <div className="col-xl-4 wow fadeInUp" data-wow-delay=".2s">
              <div className="footer-single-item-5">
                <div className="footer-content">
                  <Link href="/">
                    <Image src="/assets/img/logo/white-logo-3.svg" alt="img" width={150} height={50} />
                  </Link>
                  <p>
                    A game studio crafting exciting, high-quality video games, prioritizing immersive gameplay and mechanics. Hac habitasse platea
                  </p>
                  <div className="footer-app">
                    <div className="app-image">
                      <Image src="/assets/img/home-5/google.png" alt="img" width={150} height={50} />
                    </div>
                    <div className="app-image">
                      <Image src="/assets/img/home-5/apple.png" alt="img" width={150} height={50} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
              <div className="footer-single-item-5">
                <div className="widget-head">
                  <h5>Our Studio</h5>
                </div>
                <ul className="list-area">
                  <li>
                    <Link href="/about">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/team">
                      our team
                    </Link>
                  </li>
                  <li>
                    <Link href="/service-details">
                      Advertising
                    </Link>
                  </li>
                  <li>
                    <Link href="/service-details">
                      Legal Notices
                    </Link>
                  </li>
                  <li>
                    <Link href="/service-details">
                      Partnership
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-2 ps-lg-3 col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".6s">
              <div className="footer-single-item-5">
                <div className="widget-head">
                  <h5>Utility Pages</h5>
                </div>
                <ul className="list-area">
                  <li>
                    <Link href="/service-details">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      Privacy/Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/service-details">
                      Gift Cards
                    </Link>
                  </li>
                  <li>
                    <Link href="/game-details">
                      Game Reviews
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      Subscriptions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".8s">
              <div className="footer-single-item-5">
                <div className="widget-head">
                  <h5>Newsletter</h5>
                </div>
                <div className="footer-newsletter">
                  <p>
                    Sign up today to get the latest inspiration & insights Sign up today to get the latest
                  </p>
                  <form action="#">
                    <div className="form-clt">
                      <Image src="/assets/img/home-3/icon/10.svg" alt="img" className="input-icon" width={20} height={20} />
                      <input type="text" name="email" id="email" placeholder="enter your email" />
                      <button type="submit" className="theme-btn">
                        subscribe now
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom-5">
          <div className="footer-wrapper">
            <p>© 2025 Pubzi. All Rights Reserved.</p>
            <div className="social-icon">
              <Link href="#"><i className="fa-brands fa-facebook-f"></i></Link>
              <Link href="#"><i className="fa-brands fa-twitter"></i></Link>
              <Link href="#"><i className="fa-brands fa-linkedin-in"></i></Link>
              <Link href="#"><i className="fa-brands fa-instagram"></i></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
