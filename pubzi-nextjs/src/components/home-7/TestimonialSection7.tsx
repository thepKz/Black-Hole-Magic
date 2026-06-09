'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';

interface Testimonial {
  id: number;
  clientImage: string;
  clientName: string;
  clientRole: string;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    clientImage: '/assets/img/home-3/testimonial/client-1.png',
    clientName: 'Daniel Smith',
    clientRole: 'Senior engineer',
    content: 'This digital agency completely transformed our online presence. Their expertise, creativity, and attention to detail exceeded all our expectations. We highly rtheir...',
  },
  {
    id: 2,
    clientImage: '/assets/img/home-3/testimonial/client-1.png',
    clientName: 'Daniel Smith',
    clientRole: 'Senior engineer',
    content: 'This digital agency completely transformed our online presence. Their expertise, creativity, and attention to detail exceeded all our expectations. We highly rtheir...',
  },
  {
    id: 3,
    clientImage: '/assets/img/home-3/testimonial/client-1.png',
    clientName: 'Daniel Smith',
    clientRole: 'Senior engineer',
    content: 'This digital agency completely transformed our online presence. Their expertise, creativity, and attention to detail exceeded all our expectations. We highly rtheir...',
  },
];

export default function TestimonialSection7() {
  return (
    <section className="gt-testimonial-section-3 fix section-padding">
      <div className="container">
        <div className="gt-testimonial-wrapper-3">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="testimonial-content">
                <div className="section-title-2">
                  <h6 className="wow fadeInUp">Our testimonials</h6>
                  <h2 className="wow fadeInUp" data-wow-delay=".3s">
                    Our testimonials
                  </h2>
                </div>
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={30}
                  slidesPerView={1}
                  pagination={{
                    el: '.swiper-dot',
                    clickable: true,
                  }}
                  className="gt-testimonial-slider"
                >
                  {testimonials.map((testimonial) => (
                    <SwiperSlide key={testimonial.id}>
                      <div className="gt-testimonial-card-item">
                        <div className="gt-client-info">
                          <div className="image">
                            <Image
                              src={testimonial.clientImage}
                              alt={testimonial.clientName}
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className="text">
                            <h6>{testimonial.clientName}</h6>
                            <p>{testimonial.clientRole}</p>
                          </div>
                        </div>
                        <div className="gt-testi-content">
                          <div className="icon">
                            <Image
                              src="/assets/img/home-3/icon/quate.svg"
                              alt="quote"
                              width={40}
                              height={40}
                            />
                          </div>
                          <p>{testimonial.content}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="swiper-dot mt-3">
                  <div className="dot"></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="gt-testimonial-image">
                <Image
                  src="/assets/img/home-3/testimonial-image.png"
                  alt="testimonial"
                  width={600}
                  height={500}
                />
                <a
                  href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I"
                  className="video-btn ripple video-popup"
                >
                  <i className="fa-solid fa-play"></i>
                </a>
                <div className="gt-ratting-content">
                  <p>1200+ Clients Rating.</p>
                  <div className="gt-star">
                    <i className="fa-solid fa-star-sharp"></i>
                    <i className="fa-solid fa-star-sharp"></i>
                    <i className="fa-solid fa-star-sharp"></i>
                    <i className="fa-solid fa-star-sharp"></i>
                    <i className="fa-solid fa-star-sharp"></i>
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
