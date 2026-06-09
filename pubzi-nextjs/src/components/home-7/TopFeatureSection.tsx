'use client';

import Image from 'next/image';

export default function TopFeatureSection() {
  const features = [
    {
      icon: '/assets/img/home-3/icon/12.svg',
      title: 'Graphics & Performance',
      description:
        "We're passionate about what we do and always seek new opportunities. We are also flexible and proactive in business.",
      delay: '.3s',
    },
    {
      icon: '/assets/img/home-3/icon/13.svg',
      title: 'Audio & Sound Design',
      description:
        "We're passionate about what we do and always seek new opportunities. We are also flexible and proactive in business.",
      delay: '.5s',
    },
    {
      icon: '/assets/img/home-3/icon/14.svg',
      title: 'Story & World-Building',
      description:
        "We're passionate about what we do and always seek new opportunities. We are also flexible and proactive in business.",
      delay: '.3s',
    },
  ];

  return (
    <section className="gt-top-feature-section fix section-padding pt-0">
      <div className="container">
        <div className="gt-top-feature-wrapper">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="gt-top-feature-image">
                <Image
                  src="/assets/img/home-3/top-feature.png"
                  alt="img"
                  width={600}
                  height={600}
                  className="w-100 h-auto"
                />
                <div className="gt-bg-shape">
                  <Image
                    src="/assets/img/home-3/ellipse-bg.png"
                    alt="img"
                    width={800}
                    height={800}
                  />
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
                  We are specialized in developing out-of-the-box solutions
                  using emerging technologies
                </p>
                <ul className="gt-feature-icon">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="wow fadeInUp"
                      data-wow-delay={feature.delay}
                    >
                      <div className="gt-icon">
                        <Image
                          src={feature.icon}
                          alt="img"
                          width={60}
                          height={60}
                        />
                      </div>
                      <div className="gt-content">
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
