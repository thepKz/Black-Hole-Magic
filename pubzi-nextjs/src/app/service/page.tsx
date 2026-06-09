import Image from 'next/image';
import Link from 'next/link';

export default function ServicePage() {
  const services = [
    {
      id: 1,
      title: 'PC Game Development',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
          <g clipPath="url(#clip0_106_311)">
            <path d="M21.7439 0.626953H9.25561C8.0519 0.626953 7.07178 1.60708 7.07178 2.81079V28.1884C7.07178 29.3926 8.0519 30.3727 9.25561 30.3727H21.7434C22.9476 30.3727 23.9277 29.3926 23.9277 28.1889V2.81079C23.9277 1.60708 22.9476 0.626953 21.7439 0.626953ZM8.0633 4.59305H22.9362V23.432H8.0633V4.59305ZM9.25561 1.61848H21.7434C22.4013 1.61848 22.9362 2.15341 22.9362 2.81079V3.60153H8.0633V2.81079C8.0633 2.15341 8.59823 1.61848 9.25561 1.61848ZM21.7439 29.3812H9.25561C8.59823 29.3812 8.0633 28.8463 8.0633 28.1889V24.4236H22.9362V28.1889C22.9362 28.8463 22.4013 29.3812 21.7439 29.3812Z" fill="#6C5CE7"/>
            <path d="M15.4999 24.9189C14.4062 24.9189 13.5168 25.8083 13.5168 26.902C13.5168 27.9956 14.4062 28.885 15.4999 28.885C16.5935 28.885 17.4829 27.9956 17.4829 26.902C17.4829 25.8083 16.5935 24.9189 15.4999 24.9189ZM15.4999 27.8935C14.9531 27.8935 14.5084 27.4488 14.5084 26.902C14.5084 26.3552 14.9531 25.9105 15.4999 25.9105C16.0467 25.9105 16.4914 26.3552 16.4914 26.902C16.4914 27.4488 16.0467 27.8935 15.4999 27.8935Z" fill="#6C5CE7"/>
          </g>
          <defs>
            <clipPath id="clip0_106_311">
              <rect width="29.7458" height="29.7458" fill="white" transform="translate(0.626953 0.626953)"/>
            </clipPath>
          </defs>
        </svg>
      ),
      link: '/service-details'
    },
    {
      id: 2,
      title: 'Mobile Game Development',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <g clipPath="url(#clip0_106_330)">
            <path d="M2.66253 12.7801C2.80406 12.7809 2.9401 12.7254 3.04059 12.6257L5.17054 10.4957C5.37934 10.2869 5.37934 9.94841 5.17054 9.73961C4.96174 9.53081 4.62321 9.53081 4.41441 9.73961L2.28446 11.8696C2.18366 11.9695 2.12695 12.1056 2.12695 12.2476C2.12695 12.3896 2.18366 12.5257 2.28446 12.6257C2.38495 12.7254 2.52099 12.7809 2.66253 12.7801Z" fill="#6C5CE7"/>
            <path d="M30.3517 0H16.5071C15.6248 0 14.9096 0.715206 14.9096 1.59746V7.4548H2.66243C1.19201 7.4548 0 8.64681 0 10.1172V23.9619C0 25.4323 1.19201 26.6243 2.66243 26.6243H8.51977V28.7542H6.92232C6.04006 28.7542 5.32486 29.4694 5.32486 30.3517C5.32486 31.2339 6.04006 31.9492 6.92232 31.9492H30.3517C31.2339 31.9492 31.9492 31.2339 31.9492 30.3517V1.59746C31.9492 0.715206 31.2339 0 30.3517 0Z" fill="#6C5CE7"/>
          </g>
          <defs>
            <clipPath id="clip0_106_330">
              <rect width="31.9492" height="31.9492" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ),
      link: '/service-details'
    },
    {
      id: 3,
      title: 'AR/VR Solutions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <g clipPath="url(#clip0_106_372)">
            <path d="M18.5671 23.9052C16.8811 24.4678 15.0213 24.4677 13.3305 23.9049C12.8567 23.7472 12.3452 24.0034 12.1876 24.477C12.03 24.9506 12.2861 25.4623 12.7597 25.6199C13.7894 25.9626 14.8703 26.1339 15.9509 26.1339C17.0316 26.1339 18.1119 25.9624 19.1392 25.6197C19.6126 25.4617 19.8684 24.9498 19.7103 24.4763C19.5524 24.003 19.0406 23.7473 18.5671 23.9052Z" fill="#6C5CE7"/>
            <path d="M26.4768 6.53129C26.0921 3.77249 23.7232 1.59497 20.7892 1.59497H19.7568V1.53069C19.7568 1.03158 19.3522 0.626953 18.8531 0.626953H13.0451C12.546 0.626953 12.1414 1.03158 12.1414 1.53069V1.59491H11.1091C8.19966 1.59491 5.82747 3.74206 5.42405 6.53063C3.72997 6.91616 2.46143 8.43353 2.46143 10.2426V17.9867C2.46143 20.4633 4.47874 21.4726 5.39507 21.6904C5.80886 27.2658 10.4904 31.4744 15.9491 31.4744C21.5159 31.4744 26.0925 27.1543 26.5027 21.6906C28.878 21.1267 29.4368 18.9717 29.4368 17.9867V10.2427C29.4369 8.43449 28.1695 6.91773 26.4768 6.53129Z" fill="#6C5CE7"/>
          </g>
          <defs>
            <clipPath id="clip0_106_372">
              <rect width="30.8475" height="30.8475" fill="white" transform="translate(0.525391 0.626953)"/>
            </clipPath>
          </defs>
        </svg>
      ),
      link: '/service-details'
    },
    {
      id: 4,
      title: 'AR/ VR design',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
          <g clipPath="url(#clip0_106_386)">
            <path d="M29.7203 2.17773H4.38132C2.25276 2.18016 0.527819 3.9051 0.525391 6.03367V28.0676C0.527819 30.1961 2.25276 31.9211 4.38132 31.9235H29.7203C31.8489 31.9211 33.5738 30.1961 33.5762 28.0676V6.03367C33.5738 3.9051 31.8489 2.18016 29.7203 2.17773Z" fill="#6C5CE7"/>
            <path d="M29.7203 6.58496H4.3813C3.46863 6.58496 2.72876 7.32483 2.72876 8.2375V28.068C2.72876 28.9807 3.46863 29.7206 4.3813 29.7206H29.7203C30.633 29.7206 31.3728 28.9807 31.3728 28.068V8.2375C31.3728 7.32483 30.633 6.58496 29.7203 6.58496Z" fill="#6C5CE7"/>
          </g>
          <defs>
            <clipPath id="clip0_106_386">
              <rect width="33.0508" height="33.0508" fill="white" transform="translate(0.525391 0.525391)"/>
            </clipPath>
          </defs>
        </svg>
      ),
      link: '/service-details'
    },
    {
      id: 5,
      title: 'PS4 Game Development',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <g clipPath="url(#clip0_106_353)">
            <path d="M8.40549 14.2412H0.220215V16.5651H8.40549C9.04619 16.5651 9.56743 17.0863 9.56743 17.727C9.56743 18.3677 9.04619 18.889 8.40549 18.889H3.70605C1.78396 18.889 0.220215 20.4527 0.220215 22.3748V25.8606H2.5441V22.3748C2.5441 21.7341 3.06535 21.2129 3.70605 21.2129H8.40549C10.3276 21.2129 11.8913 19.6491 11.8913 17.727C11.8913 15.805 10.3276 14.2412 8.40549 14.2412Z" fill="#6C5CE7"/>
            <path d="M20.6316 14.2412C18.7095 14.2412 17.1457 15.805 17.1457 17.727V22.3748C17.1457 23.0155 16.6245 23.5368 15.9838 23.5368H10.7292V25.8606H15.9838C17.9059 25.8606 19.4696 24.2969 19.4696 22.3748V17.727C19.4696 17.0863 19.9909 16.5651 20.6316 16.5651H25.8861V14.2412H20.6316Z" fill="#6C5CE7"/>
            <path d="M37.5573 21.2127V16.5651C37.5573 15.2837 36.5148 14.2412 35.2334 14.2412C34.7933 14.2412 34.3645 14.3652 33.9933 14.5996L26.6344 19.2473C25.9557 19.6759 25.5505 20.4107 25.5505 21.2129C25.5505 22.4943 26.593 23.5368 27.8744 23.5368H35.2334V25.8606H37.5573V23.5368H39.8812V21.2129L37.5573 21.2127Z" fill="#6C5CE7"/>
          </g>
          <defs>
            <clipPath id="clip0_106_353">
              <rect width="39.661" height="39.661" fill="white" transform="translate(0.220215 0.220703)"/>
            </clipPath>
          </defs>
        </svg>
      ),
      link: '/service-details'
    },
    {
      id: 6,
      title: '3D Modelings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <g clipPath="url(#clip0_106_404)">
            <path d="M31.3522 27.4493L30.6906 24.9802C30.6045 24.6588 30.274 24.4678 29.9527 24.5542C29.6312 24.6403 29.4405 24.9707 29.5266 25.2921L29.8163 26.373L25.5885 23.9614V13.9382C25.5885 13.7225 25.4732 13.5233 25.2863 13.4158L16.5507 8.39345V3.62075L17.3297 4.39976C17.565 4.63504 17.9465 4.63504 18.1818 4.39976C18.4171 4.16447 18.4171 3.78295 18.1818 3.54761L16.3742 1.74004C16.1387 1.50355 15.753 1.50831 15.5221 1.74004L13.7145 3.54761C13.4792 3.78289 13.4792 4.16441 13.7145 4.39976C13.9498 4.63498 14.3313 4.63498 14.5667 4.39976L15.3457 3.62075V8.39454L6.66869 13.4167C6.48258 13.5244 6.36798 13.7232 6.36798 13.9382V23.864L2.08073 26.3002L2.37084 25.2173C2.45694 24.8959 2.26618 24.5655 1.94474 24.4794C1.62323 24.3931 1.29293 24.584 1.20683 24.9055L0.545259 27.3752C0.461508 27.6879 0.648772 28.0359 0.989378 28.1179L3.4405 28.7747C3.76454 28.8615 4.09303 28.6674 4.17847 28.3486C4.26463 28.0272 4.07387 27.6969 3.75243 27.6107L2.70687 27.3306L6.96194 24.9126L15.6804 30.0465C15.867 30.1564 16.0988 30.1579 16.2871 30.0493L18.4973 28.7752C18.7856 28.609 18.8845 28.2405 18.7184 27.9523C18.5522 27.664 18.1837 27.5651 17.8954 27.7312L15.9894 28.83L8.1706 24.2259L15.9102 19.8278L23.799 24.3279L22.5921 25.0237C22.3038 25.1898 22.2049 25.5583 22.371 25.8465C22.5373 26.1349 22.9058 26.2339 23.194 26.0676L25.0118 25.0196L29.1922 27.4044L28.1452 27.6849C27.8238 27.771 27.633 28.1014 27.7192 28.4228C27.8049 28.7426 28.1342 28.9355 28.4571 28.8488L30.8719 28.2019C31.2167 28.141 31.4447 27.7944 31.3522 27.4493Z" fill="#6C5CE7"/>
          </g>
          <defs>
            <clipPath id="clip0_106_404">
              <rect width="30.8475" height="30.8475" fill="white" transform="translate(0.525391 0.423828)"/>
            </clipPath>
          </defs>
        </svg>
      ),
      link: '/service-details'
    }
  ];

  const testimonials = [
    {
      id: 1,
      text: 'This digital agency completely transformed our online presence. Their expertise, creativity, and attention to detail exceeded all our expectations. We highly rtheir...',
      author: 'Daniel Smith',
      role: 'Senior engineer',
      image: '/assets/img/home-2/client1.png',
      rating: 5
    }
  ];

  return (
    <div className="service-page">
      {/* Breadcrumb Section */}
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/breadcrumb.png')" }}>
        <div className="gt-left-shape">
          <Image src="/assets/img/shape-1.png" alt="shape" width={200} height={200} />
        </div>
        <div className="gt-right-shape">
          <Image src="/assets/img/shape-2.png" alt="shape" width={200} height={200} />
        </div>
        <div className="gt-blur-shape">
          <Image src="/assets/img/breadcrumb-shape.png" alt="shape" width={800} height={400} />
        </div>
        <div className="container">
          <div className="gt-page-heading">
            <div className="gt-breadcrumb-sub-title">
              <h1 className="wow fadeInUp" data-wow-delay=".3s">our services</h1>
            </div>
            <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <i className="fa-solid fa-house"></i>
              </li>
              <li>
                <Link href="/">home :</Link>
              </li>
              <li className="color">our services</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="game-feature-section-8 fix section-padding">
        <div className="container">
          <div className="row px-exclusive-wrap">
            {services.map((service, index) => {
              // Special layout for items 3 and 6
              if (index === 2) {
                return (
                  <div key={service.id} className="col-xl-3 col-lg-6 col-md-6">
                    <div className="game-feature-box-2 px-exclusive-item">
                      <Image
                        src="/assets/img/home-1/game/game-controll.png"
                        alt="Game Controller"
                        width={300}
                        height={300}
                      />
                    </div>
                  </div>
                );
              }

              if (index === 4) {
                return (
                  <div key={service.id} className="col-xl-3 col-lg-6 col-md-6">
                    <div className="superhero-feature-box bg-cover px-exclusive-item" style={{ backgroundImage: "url('/assets/img/home-1/game/bg.jpg')" }}>
                      <div className="thumb">
                        <Image
                          src="/assets/img/home-1/game/superhero.png"
                          alt="Superhero"
                          width={300}
                          height={400}
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={service.id} className="col-xl-3 col-lg-6 col-md-6">
                  <div className="game-feature-box-items px-exclusive-item">
                    <div className="shape-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="27" viewBox="0 0 30 27" fill="none">
                        <path d="M1 27V6C1 3.23858 3.23858 1 6 1H30" stroke="white" strokeOpacity="0.2"/>
                      </svg>
                    </div>
                    <div className="shape-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="27" viewBox="0 0 30 27" fill="none">
                        <path d="M29 -9.53674e-07L29 21C29 23.7614 26.7614 26 24 26L-5.96046e-08 26" stroke="white" strokeOpacity="0.2"/>
                      </svg>
                    </div>
                    <div className="icon">
                      {service.icon}
                    </div>
                    <h4>
                      <Link href={service.link}>{service.title}</Link>
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section-2 parallaxie fix section-padding bg-cover" style={{ backgroundImage: "url('/assets/img/home-2/video-bg.jpg')" }}>
        <div className="video-info-items">
          <h2 className="title">Born to Game</h2>
          <a href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I" className="video-btn ripple video-popup">
            <i className="fa-solid fa-play"></i>
          </a>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section-2 section-padding">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-xl-6">
              <div className="testimonial-box-items-2">
                <div className="border-shape">
                  <Image src="/assets/img/home-2/border-shape.png" alt="border" width={600} height={400} />
                </div>
                <div className="swiper tetsimonial-slider-2">
                  <div className="swiper-wrapper">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="swiper-slide">
                        <div className="testimonial-box-slider">
                          <div className="quote-icon">
                            <Image src="/assets/img/home-2/quote.png" alt="quote" width={50} height={50} />
                          </div>
                          <p>{testimonial.text}</p>
                          <div className="client-info-items">
                            <div className="client-info">
                              <Image src={testimonial.image} alt={testimonial.author} width={60} height={60} />
                              <div className="content">
                                <h4>{testimonial.author}</h4>
                                <span>{testimonial.role}</span>
                              </div>
                            </div>
                            <div className="star">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <i key={i} className="fa-solid fa-star"></i>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="testimonial-right-items">
                <div className="section-title mb-4">
                  <h6 className="wow fadeInUp">our testimonials</h6>
                  <h2 className="wow fadeInUp" data-wow-delay=".3s">
                    Peoples Talk About Us
                  </h2>
                </div>
                <div className="row g-4 mt-3">
                  <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
                    <div className="testimonial-image-1">
                      <div className="overlay-style"></div>
                      <Image src="/assets/img/home-2/testi-1.jpg" alt="testimonial" width={300} height={400} />
                      <div className="testimonial-counter">
                        <Image src="/assets/img/home-2/testi-count.png" alt="counter" width={100} height={100} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 wow fadeInUp" data-wow-delay=".5s">
                    <div className="testimonial-image-1">
                      <Image src="/assets/img/home-2/testi-2.jpg" alt="testimonial" width={300} height={400} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-contact-section">
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
              <Image src="/assets/img/home-1/cta-img.png" alt="CTA" width={200} height={200} />
            </div>
            <div className="contact-right wow fadeInUp" data-wow-delay=".7s">
              <div className="contact-info">
                <h3>call us</h3>
                <p>
                  <a href="tel:+91032145609870">+91 0321 4560 9870</a>
                </p>
              </div>
              <Link href="/contact" className="theme-btn">
                get started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
