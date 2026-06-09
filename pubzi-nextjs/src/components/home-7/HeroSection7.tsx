'use client';

export default function HeroSection7() {
  return (
    <div className="hero-section hero-7 fix bg-cover section-glow" style={{ backgroundImage: 'url(/assets/img/home-3/hero/bg.jpg)' }}>
      <div className="left-image wow img-custom-anim-left">
        <img src="/assets/img/home-3/hero/02.png" alt="img" />
      </div>
      <div className="left-image-2 wow img-custom-anim-right">
        <img src="/assets/img/home-3/hero/04.png" alt="img" />
      </div>
      <div className="right-image wow img-custom-anim-right">
        <img src="/assets/img/home-3/hero/03.png" alt="img" />
      </div>
      <div className="right-image-2 wow img-custom-anim-left">
        <img src="/assets/img/home-3/hero/05.png" alt="img" />
      </div>
      <div className="blur-shape">
        <img src="/assets/img/home-3/hero/blur.png" alt="img" />
      </div>
      <div className="blur-shape-2">
        <img src="/assets/img/home-3/hero/blur-2.png" alt="img" />
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-12">
            <div className="hero-content">
              <h6 className="wow fadeInUp">WHERE DIGITAL WORLDS CONVERGE</h6>
              <h1 className="wow fadeInUp" data-wow-delay=".3s">
                Building the Future of<br />Digital Ecosystems
              </h1>
              <p className="wow fadeInUp" data-wow-delay=".5s">
                Black Hole unifies game publishing, fintech payments, digital platforms,
                and B2B tech solutions into one powerful ecosystem for global growth.
              </p>
              <div className="hero-button wow fadeInUp" data-wow-delay=".3s">
                <a href="/contact" className="gt-theme-btn">
                  Explore Ecosystem
                </a>
                <a href="/about" className="gt-theme-btn gt-style-border">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
