import Image from 'next/image';
import Link from 'next/link';

export default function MatchPage() {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/breadcrumb.png')" }}>
        <div className="gt-left-shape">
          <Image src="/assets/img/shape-1.png" alt="img" width={200} height={200} />
        </div>
        <div className="gt-right-shape">
          <Image src="/assets/img/shape-2.png" alt="img" width={200} height={200} />
        </div>
        <div className="gt-blur-shape">
          <Image src="/assets/img/breadcrumb-shape.png" alt="img" width={800} height={400} />
        </div>
        <div className="container">
          <div className="gt-page-heading">
            <div className="gt-breadcrumb-sub-title">
              <h1 className="wow fadeInUp" data-wow-delay=".3s">matches schedule</h1>
            </div>
            <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <i className="fa-solid fa-house"></i>
              </li>
              <li>
                <Link href="/">
                  home :
                </Link>
              </li>
              <li className="color">
                matches schedule
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trending Match Section */}
      <section className="trending-match-section fix section-padding">
        <div className="left-shape float-bob-y1">
          <Image src="/assets/img/home-2/match/left-shape.png" alt="img" width={300} height={400} />
        </div>
        <div className="right-shape">
          <Image src="/assets/img/home-2/match/right-shape.png" alt="img" width={300} height={400} />
        </div>
        <div className="container">
          <div className="trending-match-wrapper mt-0">
            <div className="vec-arrow">
              <Image src="/assets/img/home-2/match/vec-arrow.png" alt="img" width={100} height={100} />
            </div>
            <div className="linear-shape">
              <Image src="/assets/img/home-2/match/linear-bg-1.png" alt="img" width={600} height={400} />
            </div>
            <div className="linear-shape-2">
              <Image src="/assets/img/home-2/match/linear-bg-2.png" alt="img" width={600} height={400} />
            </div>

            {/* Match 1 */}
            <div className="trending-match-items wow fadeInUp" data-wow-delay=".3s">
              <div className="trending-match-left">
                <div className="gt-match-logo">
                  <Image src="/assets/img/home-2/match/match-01.jpg" alt="img" className="gt-match-thumb" width={120} height={120} />
                  <Image src="/assets/img/home-2/match/vs.png" alt="img" width={60} height={60} />
                  <Image src="/assets/img/home-2/match/match-02.jpg" alt="img" className="gt-match-thumb" width={120} height={120} />
                </div>
                <div className="gt-watch-now-items">
                  <span>Watch live on</span>
                  <ul className="gt-watch-now-list">
                    <li>
                      <Link href="#">
                        <i className="fa-brands fa-youtube"></i> you tube
                      </Link>
                      <Link href="#">
                        <i className="fa-brands fa-discord"></i>
                        discord
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="fa-brands fa-twitch"></i>
                        twitch
                      </Link>
                      <Link href="#">
                        <i className="fa-solid fa-eyes"></i>
                        GeForce
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="trending-match-content">
                <ul className="gt-date-list">
                  <li>
                    <i className="fa-light fa-calendar"></i>
                    30 May, 2025
                  </li>
                  <li>
                    <i className="fa-regular fa-clock"></i>
                    10:00 am - 12:30 pm
                  </li>
                </ul>
                <h3>
                  <Link href="/match-details">
                    Aggressive & War-Themed
                  </Link>
                </h3>
                <p>
                  A game studio crafting exciting, high-quality video
                  immersive gameplay and mechanics.
                </p>
              </div>
            </div>

            {/* Match 2 */}
            <div className="trending-match-items wow fadeInUp" data-wow-delay=".5s">
              <div className="trending-match-content">
                <ul className="gt-date-list">
                  <li>
                    <i className="fa-light fa-calendar"></i>
                    30 May, 2025
                  </li>
                  <li>
                    <i className="fa-regular fa-clock"></i>
                    10:00 am - 12:30 pm
                  </li>
                </ul>
                <h3>
                  <Link href="/match-details">
                    The Cognitive Crusade
                  </Link>
                </h3>
                <p>
                  A game studio crafting exciting, high-quality video
                  immersive gameplay and mechanics.
                </p>
              </div>
              <div className="trending-match-left">
                <div className="gt-match-logo">
                  <Image src="/assets/img/home-2/match/match-03.jpg" alt="img" className="gt-match-thumb" width={120} height={120} />
                  <Image src="/assets/img/home-2/match/vs.png" alt="img" width={60} height={60} />
                  <Image src="/assets/img/home-2/match/match-04.jpg" alt="img" className="gt-match-thumb" width={120} height={120} />
                </div>
                <div className="gt-watch-now-items">
                  <span>Watch live on</span>
                  <ul className="gt-watch-now-list">
                    <li>
                      <Link href="#">
                        <i className="fa-brands fa-youtube"></i> you tube
                      </Link>
                      <Link href="#">
                        <i className="fa-brands fa-discord"></i>
                        discord
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="fa-brands fa-twitch"></i>
                        twitch
                      </Link>
                      <Link href="#">
                        <i className="fa-solid fa-eyes"></i>
                        GeForce
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Match 3 */}
            <div className="trending-match-items bb-none wow fadeInUp" data-wow-delay=".7s">
              <div className="trending-match-left">
                <div className="gt-match-logo">
                  <Image src="/assets/img/home-2/match/match-01.jpg" alt="img" className="gt-match-thumb" width={120} height={120} />
                  <Image src="/assets/img/home-2/match/vs.png" alt="img" width={60} height={60} />
                  <Image src="/assets/img/home-2/match/match-02.jpg" alt="img" className="gt-match-thumb" width={120} height={120} />
                </div>
                <div className="gt-watch-now-items">
                  <span>Watch live on</span>
                  <ul className="gt-watch-now-list">
                    <li>
                      <Link href="#">
                        <i className="fa-brands fa-youtube"></i> you tube
                      </Link>
                      <Link href="#">
                        <i className="fa-brands fa-discord"></i>
                        discord
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <i className="fa-brands fa-twitch"></i>
                        twitch
                      </Link>
                      <Link href="#">
                        <i className="fa-solid fa-eyes"></i>
                        GeForce
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="trending-match-content">
                <ul className="gt-date-list">
                  <li>
                    <i className="fa-light fa-calendar"></i>
                    30 May, 2025
                  </li>
                  <li>
                    <i className="fa-regular fa-clock"></i>
                    10:00 am - 12:30 pm
                  </li>
                </ul>
                <h3>
                  <Link href="/match-details">
                    The Machine Uprising
                  </Link>
                </h3>
                <p>
                  A game studio crafting exciting, high-quality video
                  immersive gameplay and mechanics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section fix mt-5 section-padding pt-0">
        <div className="radius-shape float-bob-y">
          <Image src="/assets/img/home-1/team/radius-shape.png" alt="img" width={300} height={300} />
        </div>
        <div className="container">
          <div className="section-title-area">
            <div className="section-title mb-0">
              <h6 className="wow fadeInUp">our team members</h6>
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                Our Best Team Members
              </h2>
            </div>
            <div className="array-button d-flex align-items-center wow fadeInUp" data-wow-delay=".5s">
              <button className="array-prev">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <g clipPath="url(#clip0_135_87)">
                    <path d="M0.000243405 1.16006L0.000243999 14.762C0.000244027 15.4019 0.520557 15.9222 1.1604 15.9222C1.80024 15.9222 2.32056 15.4019 2.32056 14.762L2.32056 3.96553L16.0174 17.6589C16.4709 18.1124 17.2057 18.1124 17.6592 17.6589C18.1127 17.2054 18.1127 16.4706 17.6592 16.0171L3.96235 2.32373L14.7588 2.32373C15.3987 2.32373 15.919 1.80342 15.919 1.16357C15.919 0.523731 15.3987 0.0034173 14.7588 0.00341732L1.1604 0.00341792C0.520556 -9.72975e-05 0.000243377 0.520214 0.000243405 1.16006Z" fill="#0B0E13"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_135_87">
                      <rect width="18" height="18" fill="white" transform="translate(0.000244141 18) rotate(-90)"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <button className="array-next">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <g clipPath="url(#clip0_135_80)">
                    <path d="M17.9944 16.8399L17.9944 3.23799C17.9944 2.59814 17.4741 2.07783 16.8342 2.07783C16.1944 2.07783 15.6741 2.59814 15.6741 3.23799L15.6741 14.0345L1.9772 0.341113C1.52368 -0.112403 0.788916 -0.112403 0.335402 0.341112C-0.118115 0.794628 -0.118115 1.52939 0.335401 1.98291L14.0323 15.6763L3.23579 15.6763C2.59595 15.6763 2.07563 16.1966 2.07563 16.8364C2.07563 17.4763 2.59595 17.9966 3.23579 17.9966L16.8342 17.9966C17.4741 18.0001 17.9944 17.4798 17.9944 16.8399Z" fill="#0B0E13"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_135_80">
                      <rect width="18" height="18" fill="white" transform="translate(17.9944) rotate(90)"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
          <div className="swiper team-slider">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="team-box-items">
                  <div className="content">
                    <h3><Link href="/team-details">Jammey hanson</Link></h3>
                    <p>Game artist</p>
                  </div>
                  <div className="thumb">
                    <Image src="/assets/img/home-1/team/team-01.png" alt="img" width={300} height={400} />
                    <div className="social-icon d-flex align-items-center">
                      <Link href="#"><i className="fab fa-facebook-f"></i></Link>
                      <Link href="#"><i className="fab fa-twitter"></i></Link>
                      <Link href="#"><i className="fab fa-linkedin-in"></i></Link>
                      <Link href="#"><i className="fab fa-instagram"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="team-box-items">
                  <div className="content">
                    <h3><Link href="/team-details">Shikhon Islam</Link></h3>
                    <p>Game artist</p>
                  </div>
                  <div className="thumb">
                    <Image src="/assets/img/home-1/team/team-02.png" alt="img" width={300} height={400} />
                    <div className="social-icon d-flex align-items-center">
                      <Link href="#"><i className="fab fa-facebook-f"></i></Link>
                      <Link href="#"><i className="fab fa-twitter"></i></Link>
                      <Link href="#"><i className="fab fa-linkedin-in"></i></Link>
                      <Link href="#"><i className="fab fa-instagram"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="team-box-items">
                  <div className="content">
                    <h3><Link href="/team-details">Robert David</Link></h3>
                    <p>Game artist</p>
                  </div>
                  <div className="thumb">
                    <Image src="/assets/img/home-1/team/team-03.png" alt="img" width={300} height={400} />
                    <div className="social-icon d-flex align-items-center">
                      <Link href="#"><i className="fab fa-facebook-f"></i></Link>
                      <Link href="#"><i className="fab fa-twitter"></i></Link>
                      <Link href="#"><i className="fab fa-linkedin-in"></i></Link>
                      <Link href="#"><i className="fab fa-instagram"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="team-box-items">
                  <div className="content">
                    <h3><Link href="/team-details">Thomas Mark</Link></h3>
                    <p>Game artist</p>
                  </div>
                  <div className="thumb">
                    <Image src="/assets/img/home-1/team/team-04.png" alt="img" width={300} height={400} />
                    <div className="social-icon d-flex align-items-center">
                      <Link href="#"><i className="fab fa-facebook-f"></i></Link>
                      <Link href="#"><i className="fab fa-twitter"></i></Link>
                      <Link href="#"><i className="fab fa-linkedin-in"></i></Link>
                      <Link href="#"><i className="fab fa-instagram"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="team-box-items">
                  <div className="content">
                    <h3><Link href="/team-details">Donald Paul</Link></h3>
                    <p>Game artist</p>
                  </div>
                  <div className="thumb">
                    <Image src="/assets/img/home-1/team/team-05.png" alt="img" width={300} height={400} />
                    <div className="social-icon d-flex align-items-center">
                      <Link href="#"><i className="fab fa-facebook-f"></i></Link>
                      <Link href="#"><i className="fab fa-twitter"></i></Link>
                      <Link href="#"><i className="fab fa-linkedin-in"></i></Link>
                      <Link href="#"><i className="fab fa-instagram"></i></Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section-2 parallaxie fix section-padding bg-cover" style={{ backgroundImage: "url('/assets/img/home-2/video-bg.jpg')" }}>
        <div className="video-info-items">
          <h2 className="title">Born to Game</h2>
          <Link href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I" className="video-btn ripple video-popup">
            <i className="fa-solid fa-play"></i>
          </Link>
        </div>
      </section>

      {/* Marque Section */}
      <div className="marque-section section-padding fix pb-0">
        <div className="marquee-wrapper text-slider">
          <div className="marquee-inner to-left">
            <ul className="marqee-list d-flex">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <li key={num} className="marquee-item">
                  <span className="text-slider">
                    <Image src={`/assets/img/home-1/gaming-logo/logo-${num}.jpg`} alt="" width={150} height={80} />
                  </span>
                </li>
              ))}
            </ul>
            <ul className="marqee-list d-flex">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <li key={num} className="marquee-item">
                  <span className="text-slider">
                    <Image src={`/assets/img/home-1/gaming-logo/logo-${num}.jpg`} alt="" width={150} height={80} />
                  </span>
                </li>
              ))}
            </ul>
            <ul className="marqee-list d-flex">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <li key={num} className="marquee-item">
                  <span className="text-slider">
                    <Image src={`/assets/img/home-1/gaming-logo/logo-${num}.jpg`} alt="" width={150} height={80} />
                  </span>
                </li>
              ))}
            </ul>
            <ul className="marqee-list d-flex">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <li key={num} className="marquee-item">
                  <span className="text-slider">
                    <Image src={`/assets/img/home-1/gaming-logo/logo-${num}.jpg`} alt="" width={150} height={80} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="cta-contact-section section-padding pb-0">
        <div className="container">
          <div className="cta-wrapper">
            <div className="content wow fadeInUp" data-wow-delay=".3s">
              <p>Pull the Trigger!</p>
              <h3>
                Let&apos;s Bring Your <br />
                Vision To Life
              </h3>
            </div>
            <div className="cta-image wow fadeInUp" data-wow-delay=".5s">
              <Image src="/assets/img/home-1/cta-img.png" alt="img" width={400} height={500} />
            </div>
            <div className="contact-right wow fadeInUp" data-wow-delay=".7s">
              <div className="contact-info">
                <h3>call us</h3>
                <p><Link href="tel:+91032145609870">+91 0321 4560 9870</Link></p>
              </div>
              <Link href="/contact" className="theme-btn">
                get started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
