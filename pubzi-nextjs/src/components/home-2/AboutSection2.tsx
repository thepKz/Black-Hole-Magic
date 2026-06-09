'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutSection2() {
  return (
    <section className="about-section-2 section-padding pt-0 fix">
      <div className="about-shape-1">
        <Image src="/assets/img/home-2/about/about-shape-1.png" alt="img" width={500} height={500} />
      </div>
      <div className="container">
        <div className="about-wrapper-2">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="about-iamge wow fadeInUp" data-wow-delay=".3s">
                <Image src="/assets/img/home-2/about/aout-01.jpg" alt="img" width={600} height={600} />
                <div className="line-shape">
                  <Image src="/assets/img/home-2/about/line-shape.png" alt="img" width={300} height={300} />
                </div>
                <div className="text-shape float-bob-y">
                  <Image src="/assets/img/home-2/about/text-shape.png" alt="img" width={200} height={200} />
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
                    <p>WINING GAME</p>
                  </div>
                </div>
                <Link href="/about" className="theme-btn style-2 wow fadeInUp" data-wow-delay=".9s">
                  <span className="left-line"></span>
                  About More Us
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.41099 8.46917L1.88219 16L0 14.1166L7.53013 6.58846L0.941096 0H16V15.0576L9.41099 8.46917Z" fill="#0B0E13"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
