'use client';

export default function AboutSection7() {
  return (
    <section className="about-section fix section-padding">
      <div className="container">
        <div className="about-wrapper-7">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <div className="about-image-2 wow animated-image">
                <img src="assets/img/home-7/about/about-01.png" alt="img" />
                <div className="bg-shape">
                  <img src="assets/img/home-7/about/bg-shape.png" alt="img" />
                </div>
                <div className="ellipse-shape">
                  <img src="assets/img/home-7/about/ellipse.png" alt="img" />
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="about-content">
                <div className="section-title mb-0">
                  <h6 className="wow fadeInUp">ABOUT BLACK HOLE</h6>
                  <h2 className="wow fadeInUp" data-wow-delay=".3s">
                    Converging Digital Worlds<br />Into One Ecosystem
                  </h2>
                </div>
                <p className="about-text wow fadeInUp" data-wow-delay=".5s">
                  Black Hole is a next-generation digital ecosystem that brings together game publishing,
                  fintech infrastructure, platform solutions, and enterprise technology under one unified framework.
                  We empower businesses to thrive in the digital economy.
                </p>
                <div className="about-box-wrapper wow fadeInUp" data-wow-delay=".3s">
                  <div className="about-box-item">
                    <div className="about-box bg-color">
                      <div className="icon">
                        <span style={{ fontSize: '32px' }}>🛡️</span>
                      </div>
                      <div className="content">
                        <h5>Enterprise Security</h5>
                        <p>
                          Bank-grade security protocols protecting your digital assets
                        </p>
                      </div>
                    </div>
                    <div className="about-box border-none">
                      <div className="icon">
                        <span style={{ fontSize: '32px' }}>⚡</span>
                      </div>
                      <div className="content">
                        <h5>Lightning Fast</h5>
                        <p>
                          Optimized performance at scale for global operations
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="about-box-item">
                    <div className="about-box">
                      <div className="icon">
                        <span style={{ fontSize: '32px' }}>🌍</span>
                      </div>
                      <div className="content">
                        <h5>Global Reach</h5>
                        <p>
                          Operate seamlessly in 150+ countries worldwide
                        </p>
                      </div>
                    </div>
                    <div className="about-box border-none bg-color">
                      <div className="icon">
                        <span style={{ fontSize: '32px' }}>✓</span>
                      </div>
                      <div className="content">
                        <h5>Compliance Ready</h5>
                        <p>
                          Meet international standards and regulatory requirements
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
