'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface GameCase {
  id: number;
  image: string;
  category: string;
  title: string;
  description: string;
  number: string;
  link: string;
}

const gameCases: GameCase[] = [
  {
    id: 1,
    image: '/assets/img/home-3/game-case-study/game-01.jpg',
    category: 'adventure',
    title: 'candy crush',
    description: 'A game studio crafting exciting, high-quality video games, prioritizing immersive gameplay and mechanics.',
    number: '01',
    link: '/game-details',
  },
  {
    id: 2,
    image: '/assets/img/home-3/game-case-study/game-02.jpg',
    category: 'adventure',
    title: 'candy crush',
    description: 'A game studio crafting exciting, high-quality video games, prioritizing immersive gameplay and mechanics.',
    number: '02',
    link: '/game-details',
  },
  {
    id: 3,
    image: '/assets/img/home-3/game-case-study/game-03.jpg',
    category: 'adventure',
    title: 'candy crush',
    description: 'A game studio crafting exciting, high-quality video games, prioritizing immersive gameplay and mechanics.',
    number: '03',
    link: '/game-details',
  },
  {
    id: 4,
    image: '/assets/img/home-3/game-case-study/game-04.jpg',
    category: 'adventure',
    title: 'candy crush',
    description: 'A game studio crafting exciting, high-quality video games, prioritizing immersive gameplay and mechanics.',
    number: '04',
    link: '/game-details',
  },
  {
    id: 5,
    image: '/assets/img/home-3/game-case-study/game-05.jpg',
    category: 'adventure',
    title: 'candy crush',
    description: 'A game studio crafting exciting, high-quality video games, prioritizing immersive gameplay and mechanics.',
    number: '05',
    link: '/game-details',
  },
  {
    id: 6,
    image: '/assets/img/home-3/game-case-study/game-06.jpg',
    category: 'adventure',
    title: 'candy crush',
    description: 'A game studio crafting exciting, high-quality video games, prioritizing immersive gameplay and mechanics.',
    number: '05',
    link: '/game-details',
  },
];

export default function GameCaseStudySection() {
  const progressLineRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const updateProgressLine = () => {
      if (swiperRef.current && progressLineRef.current) {
        const swiper = swiperRef.current;
        const progress = ((swiper.activeIndex + 1) / swiper.slides.length) * 100;
        progressLineRef.current.style.width = `${progress}%`;
      }
    };

    if (swiperRef.current) {
      swiperRef.current.on('slideChange', updateProgressLine);
      updateProgressLine();
    }

    return () => {
      if (swiperRef.current) {
        swiperRef.current.off('slideChange', updateProgressLine);
      }
    };
  }, []);

  return (
    <section className="gt-game-case-study-section section-padding">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title">
            <h6 className="wow fadeInUp">big bang matched</h6>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              complete case study
            </h2>
          </div>
          <Link href="/game" className="gt-theme-btn gt-style-border">
            view more games
          </Link>
        </div>

        <div className="gt-game-case-study-wrapper">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            speed={1000}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="gt-game-case-slider"
          >
            {gameCases.map((gameCase) => (
              <SwiperSlide key={gameCase.id}>
                <div className="gt-game-case-image">
                  <Image
                    src={gameCase.image}
                    alt={gameCase.title}
                    width={400}
                    height={500}
                    className="w-full h-auto"
                  />
                  <div className="gt-game-case-content">
                    <Link href={gameCase.link} className="gt-box">
                      {gameCase.category}
                    </Link>
                    <h3>
                      <Link href={gameCase.link}>{gameCase.title}</Link>
                    </h3>
                    <p>{gameCase.description}</p>
                  </div>
                  <span className="gt-number">{gameCase.number}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Progress Line Below Dots */}
          <div className="progress-bar-wrapper">
            <div className="progress-line" id="progressLine" ref={progressLineRef}></div>
          </div>

          {/* Dots for slide navigation */}
          <div className="dots-container">
            {gameCases.map((_, index) => (
              <span
                key={index}
                className="dot"
                onClick={() => swiperRef.current?.slideTo(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
