'use client';

import Link from 'next/link';
import Image from 'next/image';

interface NewsCard {
  id: number;
  title: string;
  date: string;
  image: string;
  link: string;
  imagePosition?: 'top' | 'bottom';
}

const newsCards: NewsCard[] = [
  {
    id: 1,
    title: 'The Rise of Online Gaming in the Age of AI',
    date: '11 March 2025',
    image: '/assets/img/home-2/news/news-01.jpg',
    link: '/news-details',
    imagePosition: 'bottom',
  },
  {
    id: 2,
    title: 'The evolution of online gaming and its rise',
    date: '11 March 2025',
    image: '/assets/img/home-2/news/news-02.jpg',
    link: '/news-details',
    imagePosition: 'top',
  },
  {
    id: 3,
    title: 'The Rise of Online Gaming in the Age of AI',
    date: '11 March 2025',
    image: '/assets/img/home-2/news/news-03.jpg',
    link: '/news-details',
    imagePosition: 'bottom',
  },
  {
    id: 4,
    title: 'The evolution of online gaming and its rise',
    date: '11 March 2025',
    image: '/assets/img/home-2/news/news-04.jpg',
    link: '/news-details',
    imagePosition: 'top',
  },
];

export default function NewsSection2() {
  return (
    <section className="news-section-2 section-padding">
      <div className="game-controll-shape">
        <Image
          src="/assets/img/home-2/news/game-controll-shape.png"
          alt="Game Controller Shape"
          width={500}
          height={500}
          className="w-auto h-auto"
        />
      </div>
      <div className="container">
        <div className="section-title">
          <h6 className="wow fadeInUp">latest news</h6>
          <h2 className="wow fadeInUp" data-wow-delay=".3s">
            our latest news & Blog Archive
          </h2>
        </div>
        <div className="news-wrapper">
          <div className="row g-4 align-items-center">
            <div className="col-xl-6">
              <div className="news-left-items">
                <div className="row g-4">
                  {newsCards.map((card, index) => (
                    <div
                      key={card.id}
                      className="col-lg-6 col-md-6 wow fadeInUp"
                      data-wow-delay={index % 2 === 0 ? '.3s' : '.5s'}
                    >
                      <div className="news-box-items mt-0">
                        {card.imagePosition === 'top' && (
                          <div className="thumb">
                            <Image
                              src={card.image}
                              alt={card.title}
                              width={400}
                              height={300}
                              className="w-100 h-auto"
                            />
                            <Image
                              src={card.image}
                              alt={card.title}
                              width={400}
                              height={300}
                              className="w-100 h-auto"
                            />
                          </div>
                        )}
                        <div className="content">
                          <h3>
                            <Link href={card.link}>{card.title}</Link>
                          </h3>
                          <span className="gt-date">
                            <i className="fa-solid fa-calendar-days"></i> {card.date}
                          </span>
                        </div>
                        {card.imagePosition === 'bottom' && (
                          <div className="thumb style-2">
                            <Image
                              src={card.image}
                              alt={card.title}
                              width={400}
                              height={300}
                              className="w-100 h-auto"
                            />
                            <Image
                              src={card.image}
                              alt={card.title}
                              width={400}
                              height={300}
                              className="w-100 h-auto"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="news-right-items">
                <div className="section-title mb-0">
                  <h6 className="wow fadeInUp">latest news</h6>
                  <h2 className="wow fadeInUp" data-wow-delay=".3s">
                    our latest news & Blog Archive
                  </h2>
                </div>
                <p className="news-text wow fadeInUp" data-wow-delay=".5s">
                  Emerging trends in the esports industry include the growth of mobile esports, the integration of virtual reality in gaming experiences, and the increasing involvement of traditional sports.
                </p>
                <Link href="/news" className="theme-btn style-2 wow fadeInUp" data-wow-delay=".7s">
                  <span className="left-line"></span>
                  view all news
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.41099 8.46917L1.88219 16L0 14.1166L7.53013 6.58846L0.941096 0H16V15.0576L9.41099 8.46917Z" fill="#0B0E13"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
