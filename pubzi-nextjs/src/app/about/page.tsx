import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      {/* GT Breadcrunb Section Start */}
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/breadcrumb.png')" }}>
        <div className="gt-left-shape">
          <Image src="/assets/img/shape-1.png" alt="img" width={200} height={200} />
        </div>
        <div className="gt-right-shape">
          <Image src="/assets/img/shape-2.png" alt="img" width={200} height={200} />
        </div>
        <div className="gt-blur-shape">
          <Image src="/assets/img/breadcrumb-shape.png" alt="img" width={500} height={500} />
        </div>
        <div className="container">
          <div className="gt-page-heading">
            <div className="gt-breadcrumb-sub-title">
              <h1 className="wow fadeInUp" data-wow-delay=".3s">about us</h1>
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
                about us
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* About Section Start */}
      <section className="about-section-2 section-padding fix">
        <div className="about-shape-1">
          <Image src="/assets/img/home-2/about/about-shape-1.png" alt="img" width={300} height={300} />
        </div>
        <div className="container">
          <div className="about-wrapper-2">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="about-iamge wow fadeInUp" data-wow-delay=".3s">
                  <Image src="/assets/img/home-2/about/aout-01.jpg" alt="img" width={600} height={700} />
                  <div className="line-shape">
                    <Image src="/assets/img/home-2/about/line-shape.png" alt="img" width={200} height={200} />
                  </div>
                  <div className="text-shape float-bob-y">
                    <Image src="/assets/img/home-2/about/text-shape.png" alt="img" width={150} height={150} />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-content">
                  <div className="section-title mb-0">
                    <h6 className="wow fadeInUp">about our gaming zone</h6>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      More Than Just a Game We Design the Moments That Matter
                    </h2>
                  </div>
                  <p className="about-text wow fadeInUp" data-wow-delay=".5s">
                    Emerging trends in the esports industry include the growth of mobile esports, the integration of virtual reality in gaming experiences, and the increasing involvement of traditional sports.
                  </p>
                  <div className="counter-wrap-2">
                    <div className="counter-item-2 wow fadeInUp" data-wow-delay=".2s">
                      <h2>
                        <span className="gt-count">320</span> +
                      </h2>
                      <p>GAME PLAYED</p>
                    </div>
                    <div className="counter-item-2 wow fadeInUp" data-wow-delay=".4s">
                      <h2>
                        <span className="gt-count">175</span> +
                      </h2>
                      <p>FLAGS TAKEN</p>
                    </div>
                    <div className="counter-item-2 wow fadeInUp" data-wow-delay=".6s">
                      <h2>
                        <span className="gt-count">79</span> +
                      </h2>
                      <p>DEATH MATCHES</p>
                    </div>
                    <div className="counter-item-2 style-2 wow fadeInUp" data-wow-delay=".8s">
                      <h2>
                        <span className="gt-count">99</span> %
                      </h2>
                      <p>DEATH MATCHES</p>
                    </div>
                  </div>
                  <Link href="/about" className="theme-btn boder-10">
                    About More Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GT Top Feature Section Start */}
      <section className="gt-top-feature-section fix">
        <div className="container">
          <div className="gt-top-feature-wrapper">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="gt-top-feature-image">
                  <Image src="/assets/img/home-3/top-feature.png" alt="img" width={600} height={600} />
                  <div className="gt-bg-shape">
                    <Image src="/assets/img/home-3/ellipse-bg.png" alt="img" width={500} height={500} />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="gt-top-feature-content">
                  <div className="section-title mb-0">
                    <h6 className="wow fadeInUp">top features</h6>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      Powerful Features, Perfect Gameplay
                    </h2>
                  </div>
                  <p className="gt-feature-text">
                    We are specialized in developing out-of-the-box solutions using emerging technologies
                  </p>
                  <ul className="gt-feature-icon">
                    <li>
                      <div className="gt-icon">
                        <Image src="/assets/img/home-3/icon/12.svg" alt="img" width={60} height={60} />
                      </div>
                      <div className="gt-content">
                        <h3>Graphics & Performance</h3>
                        <p>
                          We're passionate about what we do and always seek new opportunities. We are also flexible and proactive in business.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="gt-icon">
                        <Image src="/assets/img/home-3/icon/13.svg" alt="img" width={60} height={60} />
                      </div>
                      <div className="gt-content">
                        <h3>Audio & Sound Design</h3>
                        <p>
                          We're passionate about what we do and always seek new opportunities. We are also flexible and proactive in business.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="gt-icon">
                        <Image src="/assets/img/home-3/icon/14.svg" alt="img" width={60} height={60} />
                      </div>
                      <div className="gt-content">
                        <h3>Story & World-Building</h3>
                        <p>
                          We're passionate about what we do and always seek new opportunities. We are also flexible and proactive in business.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GT Video Section Start */}
      <div className="gt-video-section section-padding fix">
        <div className="container">
          <div className="gt-video-wrapper gt-style-3 bg-cover" style={{ backgroundImage: "url(/assets/img/home-1/feature/video-bg.jpg)" }}>
            <div className="gt-video-content">
              <h6 className="wow fadeInUp" data-wow-delay=".3s">Love To Play</h6>
              <h2 className="wow fadeInUp" data-wow-delay=".5s">
                Sweet Revenge <br />
                Gameplay
              </h2>
            </div>
            <Link href="/game-details" className="theme-btn boder-10 wow fadeInUp" data-wow-delay=".5s">
              play now
            </Link>
          </div>
        </div>
      </div>

      {/* GT Testimonial Section Start */}
      <section className="gt-testimonial-section-3 fix section-padding pt-0">
        <div className="container">
          <div className="gt-testimonial-wrapper-3">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="testimonial-content">
                  <div className="section-title-2">
                    <h6 className="wow fadeInUp">Our Testimonials</h6>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      Our Testimonials
                    </h2>
                  </div>
                  <div className="swiper gt-testimonial-slider">
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <div className="gt-testimonial-card-item">
                          <div className="gt-client-info">
                            <div className="image">
                              <Image src="/assets/img/home-3/testimonial/client-1.png" alt="img" width={60} height={60} />
                            </div>
                            <div className="text">
                              <h6>Daniel Smith</h6>
                              <p>Senior engineer</p>
                            </div>
                          </div>
                          <div className="gt-testi-content">
                            <div className="icon">
                              <Image src="/assets/img/home-3/icon/quate.svg" alt="img" width={40} height={40} />
                            </div>
                            <p>
                              This digital agency completely transformed our online presence. Their expertise, creativity, and attention to detail exceeded all our expectations. We highly rtheir...
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="gt-testimonial-card-item">
                          <div className="gt-client-info">
                            <div className="image">
                              <Image src="/assets/img/home-3/testimonial/client-1.png" alt="img" width={60} height={60} />
                            </div>
                            <div className="text">
                              <h6>Daniel Smith</h6>
                              <p>Senior engineer</p>
                            </div>
                          </div>
                          <div className="gt-testi-content">
                            <div className="icon">
                              <Image src="/assets/img/home-3/icon/quate.svg" alt="img" width={40} height={40} />
                            </div>
                            <p>
                              This digital agency completely transformed our online presence. Their expertise, creativity, and attention to detail exceeded all our expectations. We highly rtheir...
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="gt-testimonial-card-item">
                          <div className="gt-client-info">
                            <div className="image">
                              <Image src="/assets/img/home-3/testimonial/client-1.png" alt="img" width={60} height={60} />
                            </div>
                            <div className="text">
                              <h6>Daniel Smith</h6>
                              <p>Senior engineer</p>
                            </div>
                          </div>
                          <div className="gt-testi-content">
                            <div className="icon">
                              <Image src="/assets/img/home-3/icon/quate.svg" alt="img" width={40} height={40} />
                            </div>
                            <p>
                              This digital agency completely transformed our online presence. Their expertise, creativity, and attention to detail exceeded all our expectations. We highly rtheir...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-dot mt-3">
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="gt-testimonial-image">
                  <Image src="/assets/img/home-3/testimonial-image.png" alt="img" width={600} height={600} />
                  <a href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I" className="video-btn ripple video-popup">
                    <i className="fa-solid fa-play"></i>
                  </a>
                  <div className="gt-ratting-content">
                    <p>1200+ Clients Rating.</p>
                    <div className="gt-star">
                      <i className="fa-solid fa-star-sharp"></i>
                      <i className="fa-solid fa-star-sharp"></i>
                      <i className="fa-solid fa-star-sharp"></i>
                      <i className="fa-solid fa-star-sharp"></i>
                      <i className="fa-solid fa-star-sharp"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section Start */}
      <div className="instagram-section-3 fix section-padding pt-0">
        <div className="swiper instagram-slider">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="instagram-image">
                <Image src="/assets/img/home-5/instagram/instagram-01.jpg" alt="img" width={300} height={300} />
                <Link href="/" className="icon">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="instagram-image">
                <Image src="/assets/img/home-5/instagram/instagram-02.jpg" alt="img" width={300} height={300} />
                <Link href="/" className="icon">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="instagram-image">
                <Image src="/assets/img/home-5/instagram/instagram-03.jpg" alt="img" width={300} height={300} />
                <Link href="/" className="icon">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="instagram-image">
                <Image src="/assets/img/home-5/instagram/instagram-04.jpg" alt="img" width={300} height={300} />
                <Link href="/" className="icon">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="instagram-image">
                <Image src="/assets/img/home-5/instagram/instagram-05.jpg" alt="img" width={300} height={300} />
                <Link href="/" className="icon">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="instagram-image">
                <Image src="/assets/img/home-5/instagram/instagram-06.jpg" alt="img" width={300} height={300} />
                <Link href="/" className="icon">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
              </div>
            </div>
            <div className="swiper-slide">
              <div className="instagram-image">
                <Image src="/assets/img/home-5/instagram/instagram-07.jpg" alt="img" width={300} height={300} />
                <Link href="/" className="icon">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GT Brand Section Start */}
      <div className="brand-section fix">
        <div className="container">
          <div className="swiper brand-slider">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="brand-box">
                  <div className="brand-image-5 text-center">
                    <Image src="/assets/img/home-5/brand/b-1.png" alt="img" width={150} height={80} />
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="brand-box">
                  <div className="brand-image-5 text-center">
                    <Image src="/assets/img/home-5/brand/b-2.png" alt="img" width={150} height={80} />
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="brand-box">
                  <div className="brand-image-5 text-center">
                    <Image src="/assets/img/home-5/brand/b-3.png" alt="img" width={150} height={80} />
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="brand-box">
                  <div className="brand-image-5 text-center">
                    <Image src="/assets/img/home-5/brand/b-4.png" alt="img" width={150} height={80} />
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="brand-box">
                  <div className="brand-image-5 text-center">
                    <Image src="/assets/img/home-5/brand/b-5.png" alt="img" width={150} height={80} />
                  </div>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="brand-box">
                  <div className="brand-image-5 text-center">
                    <Image src="/assets/img/home-5/brand/b-6.png" alt="img" width={150} height={80} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cta Section Start */}
      <section className="cta-contact-section section-padding pb-0">
        <div className="container">
          <div className="cta-wrapper">
            <div className="content wow fadeInUp" data-wow-delay=".3s">
              <p>Pull the Trigger!</p>
              <h3>
                Let's Bring Your <br />
                Vision To Life
              </h3>
            </div>
            <div className="cta-image wow fadeInUp" data-wow-delay=".5s">
              <Image src="/assets/img/home-1/cta-img.png" alt="img" width={300} height={300} />
            </div>
            <div className="contact-right wow fadeInUp" data-wow-delay=".7s">
              <div className="contact-info">
                <h3>call us</h3>
                <p><a href="tel:+910321456098710">+91 0321 4560 9870</a></p>
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
