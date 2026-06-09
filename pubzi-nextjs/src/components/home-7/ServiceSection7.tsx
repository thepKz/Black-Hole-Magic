'use client';

import Link from 'next/link';

const ServiceSection7 = () => {
  const services = [
    { id: '01', title: 'full game development', link: '/service-details' },
    { id: '02', title: '3d art & animations', link: '/service-details' },
    { id: '03', title: 'character design model', link: '/service-details' },
    { id: '04', title: 'art design direction', link: '/service-details' },
    { id: '05', title: 'gaming fild design', link: '/service-details' },
  ];

  return (
    <section
      className="service-section-7 bg-cover"
      style={{ backgroundImage: "url('/assets/img/home-7/service-bg.jpg')" }}
    >
      <div className="service-wrapper-7">
        {services.map((service) => (
          <div key={service.id} className="service-box">
            <span>{service.id}</span>
            <h3 className="title">
              <Link href={service.link}>{service.title}</Link>
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceSection7;
