'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';

import 'swiper/css';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Chun Qing',
    role: 'gaming artist',
    image: '/assets/img/home-3/team/team-01.jpg',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 2,
    name: 'Chun Qing',
    role: 'gaming artist',
    image: '/assets/img/home-3/team/team-02.jpg',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 3,
    name: 'Chun Qing',
    role: 'gaming artist',
    image: '/assets/img/home-3/team/team-03.jpg',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 4,
    name: 'Chun Qing',
    role: 'gaming artist',
    image: '/assets/img/home-3/team/team-04.jpg',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 5,
    name: 'Chun Qing',
    role: 'gaming artist',
    image: '/assets/img/home-3/team/team-02.jpg',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 6,
    name: 'Chun Qing',
    role: 'gaming artist',
    image: '/assets/img/home-3/team/team-04.jpg',
    socialLinks: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
];

const TeamSection7: React.FC = () => {
  return (
    <section className="gt-team-section-3 fix section-padding bg-cover">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title">
            <h6>great team</h6>
            <h2>
              great team player
            </h2>
          </div>
          <div className="dot-number">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <span key={num} className={`dot-num ${num === 1 ? 'active' : ''}`}>
                <span>{num.toString().padStart(2, '0')}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="ellipse-bg-shape">
        <Image
          src="/assets/img/home-3/team/ellipse.png"
          alt="img"
          width={1920}
          height={800}
        />
      </div>
      <Swiper
        className="gt-team-slider-3"
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={1000}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          576: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          992: {
            slidesPerView: 4,
          },
        }}
      >
        {teamMembers.map((member) => (
          <SwiperSlide key={member.id}>
            <div className="gt-team-image-3 team-card">
              <Image
                src={member.image}
                alt={member.name}
                width={400}
                height={500}
              />
              <div className="gt-content">
                <h3>
                  <Link href="/team-details">{member.name}</Link>
                </h3>
                <p>{member.role}</p>
              </div>
              <div className="gt-social-icon d-flex align-items-center">
                {member.socialLinks.facebook && (
                  <Link href={member.socialLinks.facebook}>
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                )}
                {member.socialLinks.twitter && (
                  <Link href={member.socialLinks.twitter}>
                    <i className="fab fa-twitter"></i>
                  </Link>
                )}
                {member.socialLinks.linkedin && (
                  <Link href={member.socialLinks.linkedin}>
                    <i className="fa-brands fa-linkedin-in"></i>
                  </Link>
                )}
                {member.socialLinks.instagram && (
                  <Link href={member.socialLinks.instagram}>
                    <i className="fa-brands fa-instagram"></i>
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TeamSection7;
