'use client';

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';

interface Testimonial {
  id: number;
  quote: string;
  clientImage: string;
  clientName: string;
  clientPosition: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "This digital agency completely transformed our online presence. Their expertise, creativity, and attention to detail exceeded all our expectations. We highly rtheir...",
    clientImage: "/assets/img/home-2/client1.png",
    clientName: "Daniel Smith",
    clientPosition: "Senior engineer",
    rating: 5,
  },
  {
    id: 2,
    quote: "This digital agency completely transformed our online presence. Their expertise, creativity, and attention to detail exceeded all our expectations. We highly rtheir...",
    clientImage: "/assets/img/home-2/client1.png",
    clientName: "Daniel Smith",
    clientPosition: "Senior engineer",
    rating: 5,
  },
  {
    id: 3,
    quote: "This digital agency completely transformed our online presence. Their expertise, creativity, and attention to detail exceeded all our expectations. We highly rtheir...",
    clientImage: "/assets/img/home-2/client1.png",
    clientName: "Daniel Smith",
    clientPosition: "Senior engineer",
    rating: 5,
  },
];

export default function TestimonialSection2() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides] = useState(testimonials.length);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section className="testimonial-section-2 section-padding pt-0">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-xl-6">
            <div className="testimonial-box-items-2">
              <div className="border-shape">
                <Image
                  src="/assets/img/home-2/border-shape.png"
                  alt="Border Shape"
                  width={600}
                  height={600}
                />
              </div>

              <Swiper
                modules={[Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                  setCurrentSlide(swiper.activeIndex + 1);
                }}
                className="tetsimonial-slider-2"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="testimonial-box-slider">
                      <div className="quote-icon">
                        <Image
                          src="/assets/img/home-2/quote.png"
                          alt="Quote"
                          width={60}
                          height={60}
                        />
                      </div>
                      <p>{testimonial.quote}</p>
                      <div className="client-info-items">
                        <div className="client-info">
                          <Image
                            src={testimonial.clientImage}
                            alt={testimonial.clientName}
                            width={60}
                            height={60}
                          />
                          <div className="content">
                            <h4>{testimonial.clientName}</h4>
                            <span>{testimonial.clientPosition}</span>
                          </div>
                        </div>
                        <div className="star">
                          {Array.from({ length: testimonial.rating }).map((_, index) => (
                            <i key={index} className="fa-solid fa-star"></i>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="testi-pagi">
                <div className="array-button d-flex align-items-center">
                  <button className="array-prev" onClick={handlePrev} aria-label="Previous testimonial">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_0_434)">
                        <path
                          d="M1.16006 18L14.762 18C15.4019 18 15.9222 17.4797 15.9222 16.8398C15.9222 16.2 15.4019 15.6797 14.762 15.6797L3.96553 15.6797L17.6589 1.98281C18.1124 1.5293 18.1124 0.794531 17.6589 0.341017C17.2054 -0.112499 16.4706 -0.112499 16.0171 0.341017L2.32373 14.0379L2.32373 3.24141C2.32373 2.60156 1.80342 2.08125 1.16357 2.08125C0.52373 2.08125 0.00341662 2.60156 0.00341668 3.24141L0.00341787 16.8398C-9.73203e-05 17.4797 0.520214 18 1.16006 18Z"
                          fill="#0B0E13"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_0_434">
                          <rect
                            width="18"
                            height="18"
                            fill="white"
                            transform="translate(18 18) rotate(180)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                  <button className="array-next" onClick={handleNext} aria-label="Next testimonial">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_0_427)">
                        <path
                          d="M16.8399 0H3.23799C2.59814 0 2.07783 0.520312 2.07783 1.16016C2.07783 1.8 2.59814 2.32031 3.23799 2.32031H14.0345L0.341113 16.0172C-0.112402 16.4707 -0.112402 17.2055 0.341113 17.659C0.794629 18.1125 1.52939 18.1125 1.98291 17.659L15.6763 3.96211V14.7586C15.6763 15.3984 16.1966 15.9187 16.8364 15.9187C17.4763 15.9187 17.9966 15.3984 17.9966 14.7586V1.16016C18.0001 0.520312 17.4798 0 16.8399 0Z"
                          fill="#0B0E13"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_0_427">
                          <rect width="18" height="18" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
                <div className="testimonial-pagination">
                  <span className="current">{String(currentSlide).padStart(2, '0')}</span> /{' '}
                  <span className="total">{String(totalSlides).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="testimonial-right-items">
              <div className="section-title mb-4">
                <h6 className="wow fadeInUp">our testimonials</h6>
                <h2 className="wow fadeInUp" data-wow-delay=".3s">
                  Peoples Talk About Us
                </h2>
              </div>
              <div className="row g-4 mt-3">
                <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
                  <div className="testimonial-image-1">
                    <div className="overlay-style"></div>
                    <Image
                      src="/assets/img/home-2/testi-1.jpg"
                      alt="Testimonial"
                      width={300}
                      height={400}
                    />
                    <div className="testimonial-counter">
                      <Image
                        src="/assets/img/home-2/testi-count.png"
                        alt="Counter"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 wow fadeInUp" data-wow-delay=".5s">
                  <div className="testimonial-image-1">
                    <Image
                      src="/assets/img/home-2/testi-2.jpg"
                      alt="Testimonial"
                      width={300}
                      height={400}
                    />
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
