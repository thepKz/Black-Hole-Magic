'use client';

import Link from 'next/link';
import Image from 'next/image';

interface NewsCard {
  id: number;
  image: string;
  date: string;
  comments: number;
  title: string;
  link: string;
}

const newsData: NewsCard[] = [
  {
    id: 1,
    image: '/assets/img/home-3/news/news-01.jpg',
    date: '11 March 2025',
    comments: 19,
    title: 'Motorcycle Touring vs. City Riding – Which One is for You?',
    link: '/news-details',
  },
  {
    id: 2,
    image: '/assets/img/home-3/news/news-02.jpg',
    date: '11 March 2025',
    comments: 19,
    title: 'How to Choose the Right Tires for Your Bike',
    link: '/news-details',
  },
  {
    id: 3,
    image: '/assets/img/home-3/news/news-03.jpg',
    date: '11 March 2025',
    comments: 19,
    title: 'The Difference Between Street Bikes & Racing Bikes',
    link: '/news-details',
  },
];

export default function NewsSection7() {
  return (
    <section className="gt-news-section-3 fix section-padding">
      <div className="container">
        <div className="section-title-2 text-center">
          <h6 className="wow fadeInUp">latest news</h6>
          <h2 className="wow fadeInUp" data-wow-delay=".3s">
            our latest news
          </h2>
        </div>
        <div className="row">
          {/* Featured News - Left Side */}
          <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
            <div className="gt-news-left-items">
              <div className="gt-news-image">
                <Image
                  src={newsData[0].image}
                  alt={newsData[0].title}
                  width={600}
                  height={400}
                  className="w-100"
                />
              </div>
              <div className="gt-news-content">
                <ul className="gt-date-list">
                  <li>
                    <i className="fa-solid fa-calendar-days"></i>
                    {newsData[0].date}
                  </li>
                  <li>
                    <i className="fa-solid fa-comments"></i>
                    {newsData[0].comments} Comments
                  </li>
                </ul>
                <h3>
                  <Link href={newsData[0].link}>{newsData[0].title}</Link>
                </h3>
                <Link href={newsData[0].link} className="gt-theme-btn gt-style-border">
                  READ MORE
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary News - Right Side */}
          <div className="col-lg-6">
            <div className="gt-news-right-items">
              {newsData.slice(1).map((news, index) => (
                <div
                  key={news.id}
                  className="gt-news-box-items wow fadeInUp"
                  data-wow-delay={`.${3 + index * 2}s`}
                >
                  <div className="gt-news-image">
                    <Image
                      src={news.image}
                      alt={news.title}
                      width={400}
                      height={300}
                      className="w-100"
                    />
                  </div>
                  <div className="gt-news-content">
                    <ul className="gt-date-list">
                      <li>
                        <i className="fa-solid fa-calendar-days"></i>
                        {news.date}
                      </li>
                      <li>
                        <i className="fa-solid fa-comments"></i>
                        {news.comments} Comments
                      </li>
                    </ul>
                    <h3>
                      <Link href={news.link}>{news.title}</Link>
                    </h3>
                    <Link href={news.link} className="gt-theme-btn gt-style-border">
                      READ MORE
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
