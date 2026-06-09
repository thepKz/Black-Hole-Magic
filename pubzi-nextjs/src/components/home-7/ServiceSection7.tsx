'use client';

import Link from 'next/link';

const ServiceSection7 = () => {
  const ecosystems = [
    {
      id: '01',
      title: 'Game Publishing',
      icon: '🎮',
      link: '/game-publishing',
      description: 'Launch and scale your games globally with comprehensive publishing solutions'
    },
    {
      id: '02',
      title: 'Fintech Payment',
      icon: '💳',
      link: '/fintech',
      description: 'Seamless payment infrastructure for digital transactions worldwide'
    },
    {
      id: '03',
      title: 'Digital Platform',
      icon: '🌐',
      link: '/platform',
      description: 'Build and grow your digital presence with cutting-edge technology'
    },
    {
      id: '04',
      title: 'B2B Tech Solutions',
      icon: '⚡',
      link: '/b2b-tech',
      description: 'Enterprise-grade technology stack for business transformation'
    },
    {
      id: '05',
      title: 'Partnership',
      icon: '🤝',
      link: '/partnerships',
      description: 'Strategic alliances and integrations for exponential growth'
    },
    {
      id: '06',
      title: 'Community',
      icon: '👥',
      link: '/community',
      description: 'Connect with innovators and builders worldwide'
    },
    {
      id: '07',
      title: 'Growth',
      icon: '📈',
      link: '/growth',
      description: 'Scale your business with data-driven strategies and insights'
    },
  ];

  return (
    <section className="service-section-7 section-padding section-glow">
      <div className="container">
        <div className="section-title text-center mb-60">
          <h6 className="wow fadeInUp">OUR ECOSYSTEM</h6>
          <h2 className="wow fadeInUp" data-wow-delay=".3s">
            Seven Pillars of Digital Excellence
          </h2>
          <p className="wow fadeInUp" data-wow-delay=".5s" style={{ maxWidth: '700px', margin: '20px auto 0', color: 'var(--color-lunar-silver)' }}>
            Comprehensive solutions across game publishing, fintech, platforms, and enterprise technology—all unified in one powerful ecosystem.
          </p>
        </div>
        <div className="row g-4">
          {ecosystems.map((eco, index) => (
            <div key={eco.id} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${index * 2}s`}>
              <div className="service-box-items" style={{ padding: '40px 30px', minHeight: '280px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>{eco.icon}</div>
                <span style={{
                  color: 'var(--color-blackhole-cyan)',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.1em'
                }}>{eco.id}</span>
                <h3 className="title" style={{ margin: '15px 0', fontSize: '24px' }}>
                  <Link href={eco.link} style={{ color: 'var(--color-pure-white)' }}>
                    {eco.title}
                  </Link>
                </h3>
                <p style={{ color: 'var(--color-lunar-silver)', fontSize: '15px', lineHeight: '1.6' }}>
                  {eco.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection7;
