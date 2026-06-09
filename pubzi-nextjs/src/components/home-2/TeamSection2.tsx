'use client';

import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  socials: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Jammey hanson',
    role: 'Game artist',
    image: '/assets/img/home-2/team/team-01.png',
    socials: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 2,
    name: 'Jammey hanson',
    role: 'Game artist',
    image: '/assets/img/home-2/team/team-02.png',
    socials: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 3,
    name: 'Jammey hanson',
    role: 'Game artist',
    image: '/assets/img/home-2/team/team-03.png',
    socials: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 4,
    name: 'Jammey hanson',
    role: 'Game artist',
    image: '/assets/img/home-2/team/team-04.png',
    socials: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
];

const TeamSection2: React.FC = () => {
  const swiperRef = useRef<Swiper | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      swiperRef.current = new Swiper('.team-slider-2', {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: {
          prevEl: prevButtonRef.current,
          nextEl: nextButtonRef.current,
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        },
      });
    }

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy();
      }
    };
  }, []);

  return (
    <section className="team-section-2 fix section-padding pt-0">
      <div className="team-shape">
        <img src="/assets/img/home-2/team/team-shape.png" alt="img" />
      </div>
      <div className="container">
        <div className="section-title-2 text-center">
          <h6 className="wow fadeInUp">team members</h6>
          <h2 className="wow fadeInUp" data-wow-delay=".3s">
            Our Team Player
          </h2>
        </div>
        <div className="swiper team-slider-2">
          <div className="swiper-wrapper">
            {teamMembers.map((member) => (
              <div key={member.id} className="swiper-slide">
                <div className="team-single-style-2">
                  <div className="team-bg">
                    <img src="/assets/img/home-2/team/team-bg.png" alt="img" />
                  </div>
                  <div className="social-icon align-items-center">
                    {member.socials.facebook && (
                      <a href={member.socials.facebook}>
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a href={member.socials.twitter}>
                        <i className="fab fa-twitter"></i>
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin}>
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a href={member.socials.instagram}>
                        <i className="fab fa-instagram"></i>
                      </a>
                    )}
                  </div>
                  <div className="thumb">
                    <img src={member.image} alt={member.name} />
                    <div className="team-content">
                      <h3>
                        <a href="/team-details">{member.name}</a>
                      </h3>
                      <p>{member.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="array-button d-grid align-items-center">
        <button ref={prevButtonRef} className="array-prev">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
          >
            <g clipPath="url(#clip0_46_137)">
              <path
                d="M0.499999 1.16006L0.5 14.762C0.5 15.4019 1.02031 15.9222 1.66016 15.9222C2.3 15.9222 2.82031 15.4019 2.82031 14.762L2.82031 3.96553L16.5172 17.6589C16.9707 18.1124 17.7055 18.1124 18.159 17.6589C18.6125 17.2054 18.6125 16.4706 18.159 16.0171L4.46211 2.32373L15.2586 2.32373C15.8984 2.32373 16.4187 1.80342 16.4187 1.16357C16.4187 0.523731 15.8984 0.0034173 15.2586 0.00341732L1.66016 0.00341792C1.02031 -9.72975e-05 0.499999 0.520214 0.499999 1.16006Z"
                fill="#0B0E13"
              />
            </g>
            <defs>
              <clipPath id="clip0_46_137">
                <rect
                  width="18"
                  height="18"
                  fill="white"
                  transform="translate(0.5 18) rotate(-90)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
        <button ref={nextButtonRef} className="array-next">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
          >
            <g clipPath="url(#clip0_46_130)">
              <path
                d="M18.5 16.8399L18.5 3.23799C18.5 2.59814 17.9797 2.07783 17.3398 2.07783C16.7 2.07783 16.1797 2.59814 16.1797 3.23799L16.1797 14.0345L2.48281 0.341113C2.0293 -0.112403 1.29453 -0.112403 0.841017 0.341112C0.387501 0.794628 0.387501 1.52939 0.841017 1.98291L14.5379 15.6763L3.74141 15.6763C3.10156 15.6763 2.58125 16.1966 2.58125 16.8364C2.58125 17.4763 3.10156 17.9966 3.74141 17.9966L17.3398 17.9966C17.9797 18.0001 18.5 17.4798 18.5 16.8399Z"
                fill="#0B0E13"
              />
            </g>
            <defs>
              <clipPath id="clip0_46_130">
                <rect
                  width="18"
                  height="18"
                  fill="white"
                  transform="translate(18.5) rotate(90)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default TeamSection2;
