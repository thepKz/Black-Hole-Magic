'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const games = [
  {
    id: 1,
    image: '/assets/img/home-2/game/game-01.jpg',
    category: 'metaverse',
    title: 'Sweet revenge gameplay',
    link: '/game-details',
  },
  {
    id: 2,
    image: '/assets/img/home-2/game/game-02.jpg',
    category: 'metaverse',
    title: 'Sweet revenge gameplay',
    link: '/game-details',
  },
  {
    id: 3,
    image: '/assets/img/home-2/game/game-03.jpg',
    category: 'metaverse',
    title: 'Sweet revenge gameplay',
    link: '/game-details',
  },
  {
    id: 4,
    image: '/assets/img/home-2/game/game-04.jpg',
    category: 'metaverse',
    title: 'Sweet revenge gameplay',
    link: '/game-details',
  },
  {
    id: 5,
    image: '/assets/img/home-2/game/game-05.jpg',
    category: 'metaverse',
    title: 'Sweet revenge gameplay',
    link: '/game-details',
  },
];

export default function GameSection2() {
  return (
    <section className="game-section-2 fix section-padding">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title mb-0">
            <h6 className="wow fadeInUp">our best games</h6>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Our High Regulation <br /> Games For You
            </h2>
          </div>
          <Link href="/game" className="theme-btn style-2 wow fadeInUp" data-wow-delay=".5s">
            <span className="left-line"></span>
            view all games
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M9.41099 8.46917L1.88219 16L0 14.1166L7.53013 6.58846L0.941096 0H16V15.0576L9.41099 8.46917Z" fill="#0B0E13"></path>
            </svg>
          </Link>
        </div>
      </div>
      <div className="swiper game-slider-2">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          navigation={{
            nextEl: '.array-next',
            prevEl: '.array-prev',
          }}
          pagination={{
            el: '.game-swiper-pagination',
            type: 'progressbar',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1200: {
              slidesPerView: 5,
            },
          }}
        >
          {games.map((game) => (
            <SwiperSlide key={game.id}>
              <div className="gt-gaming-card-item">
                <div className="gt-gaming-image">
                  <img src={game.image} alt={game.title} />
                  <Link href={game.link} className="icon">
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                  <div className="gt-gaming-content">
                    <h6>{game.category}</h6>
                    <h3>
                      <Link href={game.link}>{game.title}</Link>
                    </h3>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="container">
        <div className="game-slider-pagination">
          <div className="game-progress p-relative">
            <div className="game-swiper-pagination"></div>
          </div>
          <div className="array-button d-flex align-items-center">
            <button className="array-prev">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <g clipPath="url(#clip0_0_434)">
                  <path d="M1.16006 18L14.762 18C15.4019 18 15.9222 17.4797 15.9222 16.8398C15.9222 16.2 15.4019 15.6797 14.762 15.6797L3.96553 15.6797L17.6589 1.98281C18.1124 1.5293 18.1124 0.794531 17.6589 0.341017C17.2054 -0.112499 16.4706 -0.112499 16.0171 0.341017L2.32373 14.0379L2.32373 3.24141C2.32373 2.60156 1.80342 2.08125 1.16357 2.08125C0.52373 2.08125 0.00341662 2.60156 0.00341668 3.24141L0.00341787 16.8398C-9.73203e-05 17.4797 0.520214 18 1.16006 18Z" fill="#0B0E13"/>
                </g>
                <defs>
                  <clipPath id="clip01_0_434">
                    <rect width="18" height="18" fill="white" transform="translate(18 18) rotate(180)"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button className="array-next">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <g clipPath="url(#clip0_0_427)">
                  <path d="M16.8399 0H3.23799C2.59814 0 2.07783 0.520312 2.07783 1.16016C2.07783 1.8 2.59814 2.32031 3.23799 2.32031H14.0345L0.341113 16.0172C-0.112402 16.4707 -0.112402 17.2055 0.341113 17.659C0.794629 18.1125 1.52939 18.1125 1.98291 17.659L15.6763 3.96211V14.7586C15.6763 15.3984 16.1966 15.9187 16.8364 15.9187C17.4763 15.9187 17.9966 15.3984 17.9966 14.7586V1.16016C18.0001 0.520312 17.4798 0 16.8399 0Z" fill="#0B0E13"/>
                </g>
                <defs>
                  <clipPath id="clip02_0_427">
                    <rect width="18" height="18" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
