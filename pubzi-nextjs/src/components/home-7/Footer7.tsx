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
                    <Image src="/assets/img/logo/white-logo-3.svg" alt="Black Hole Logo" width={150} height={50} />
                  </Link>
                  <p>
                    Black Hole unifies game publishing, fintech payments, digital platforms,
                    and B2B tech solutions into one powerful ecosystem for global growth.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
              <div className="footer-single-item-5">
                <div className="widget-head">
                  <h5>Ecosystem</h5>
                </div>
                <ul className="list-area">
                  <li>
                    <Link href="/game-publishing">
                      Game Publishing
                    </Link>
                  </li>
                  <li>
                    <Link href="/fintech">
                      Fintech Payment
                    </Link>
                  </li>
                  <li>
                    <Link href="/platform">
                      Digital Platform
                    </Link>
                  </li>
                  <li>
                    <Link href="/b2b-tech">
                      B2B Tech Solutions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-2 ps-lg-3 col-lg-3 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".6s">
              <div className="footer-single-item-5">
                <div className="widget-head">
                  <h5>Company</h5>
                </div>
                <ul className="list-area">
                  <li>
                    <Link href="/about">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/partnerships">
                      Partnerships
                    </Link>
                  </li>
                  <li>
                    <Link href="/community">
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".8s">
              <div className="footer-single-item-5">
                <div className="widget-head">
                  <h5>Resources</h5>
                </div>
                <ul className="list-area">
                  <li>
                    <Link href="/documentation">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/api">
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <Link href="/support">
                      Support Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal">
                      Legal & Privacy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom-5">
          <div className="footer-wrapper">
            <p>© 2025 Black Hole. All Rights Reserved.</p>
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
