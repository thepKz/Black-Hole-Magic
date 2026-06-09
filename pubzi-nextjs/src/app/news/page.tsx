import Image from 'next/image';
import Link from 'next/link';

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      image: '/assets/img/inner-page/news-details/details-1.jpg',
      date: '11 March 2025',
      comments: 19,
      title: 'What is cPanel? Complete Guide Master The Control Panel',
      excerpt: 'Over the past months, Palworld, quickly gathered a following before becoming one of the most successful indie video games of all time.',
      slug: 'cpanel-complete-guide'
    },
    {
      id: 2,
      image: '/assets/img/inner-page/news-details/details-2.jpg',
      date: '11 March 2025',
      comments: 19,
      title: 'Strategies for Dominating Your Favorite Game',
      excerpt: 'Over the past months, Palworld, quickly gathered a following before becoming one of the most successful indie video games of all time.',
      slug: 'strategies-dominating-favorite-game'
    },
    {
      id: 3,
      image: '/assets/img/inner-page/news-details/details-3.jpg',
      date: '11 March 2025',
      comments: 19,
      title: 'Influential Figures in the History of Gaming',
      excerpt: 'Over the past months, Palworld, quickly gathered a following before becoming one of the most successful indie video games of all time.',
      slug: 'influential-figures-history-gaming'
    }
  ];

  const categories = [
    { name: 'LIVE GAME', count: 1 },
    { name: 'FANTASY', count: 2 },
    { name: 'GAMING', count: 3 },
    { name: 'MX-XBOX', count: 4 },
    { name: 'SHOOTING', count: 5 }
  ];

  const recentPosts = [
    {
      id: 1,
      image: '/assets/img/inner-page/news-details/post-1.jpg',
      title: 'A Day in the Life of an Esports Event',
      date: 'March 26, 2025',
      slug: 'day-in-life-esports-event'
    },
    {
      id: 2,
      image: '/assets/img/inner-page/news-details/post-2.jpg',
      title: 'Influential Figures in the History',
      date: 'March 26, 2025',
      slug: 'influential-figures-history'
    },
    {
      id: 3,
      image: '/assets/img/inner-page/news-details/post-3.jpg',
      title: 'Behind the Scenes of Your Favorite',
      date: 'March 26, 2025',
      slug: 'behind-scenes-favorite'
    }
  ];

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/breadcrumb.png')" }}>
        <div className="gt-left-shape">
          <Image src="/assets/img/shape-1.png" alt="shape" width={200} height={200} />
        </div>
        <div className="gt-right-shape">
          <Image src="/assets/img/shape-2.png" alt="shape" width={200} height={200} />
        </div>
        <div className="gt-blur-shape">
          <Image src="/assets/img/breadcrumb-shape.png" alt="shape" width={400} height={400} />
        </div>
        <div className="container">
          <div className="gt-page-heading">
            <div className="gt-breadcrumb-sub-title">
              <h1 className="wow fadeInUp" data-wow-delay=".3s">Blog Standard</h1>
            </div>
            <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <i className="fa-solid fa-house"></i>
              </li>
              <li>
                <Link href="/">home :</Link>
              </li>
              <li className="color">Blog Standard</li>
            </ul>
          </div>
        </div>
      </div>

      {/* News Standard Section */}
      <section className="news-standard-section section-padding">
        <div className="container">
          <div className="gt-news-standard-wrapper">
            <div className="row g-4">
              {/* Main Content */}
              <div className="col-12 col-lg-8">
                <div className="gt-news-standard-items">
                  {newsItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`gt-news-card-items-5 ${index === newsItems.length - 1 ? 'mb-0' : ''}`}
                    >
                      <div className="gt-news-image">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={800}
                          height={500}
                          className="w-100"
                        />
                      </div>
                      <div className="gt-news-content">
                        <ul className="gt-date-list">
                          <li>
                            <i className="fa-solid fa-calendar-days"></i>
                            {item.date}
                          </li>
                          <li>
                            <i className="fa-solid fa-comments"></i>
                            {item.comments} Comments
                          </li>
                        </ul>
                        <h3>
                          <Link href={`/news/${item.slug}`}>
                            {item.title}
                          </Link>
                        </h3>
                        <p>{item.excerpt}</p>
                        <Link href={`/news/${item.slug}`} className="theme-btn boder-10">
                          Read More
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  <div className="gt-page-nav-wrap pt-5 text-start">
                    <ul className="justify-content-start">
                      <li>
                        <a className="gt-page-numbers" href="#">
                          <i className="fa-solid fa-chevron-left"></i>
                        </a>
                      </li>
                      <li><a className="gt-page-numbers" href="#">01</a></li>
                      <li><a className="gt-page-numbers active" href="#">02</a></li>
                      <li><a className="gt-page-numbers" href="#">03</a></li>
                      <li><a className="gt-page-numbers" href="#">04</a></li>
                      <li>
                        <a className="gt-page-numbers" href="#">
                          <i className="fa-solid fa-chevron-right"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-lg-4 col-12">
                <div className="gt-main-sideber sticky-style">
                  {/* Categories Widget */}
                  <div className="gt-single-sideber-widget">
                    <div className="gt-widget-title">
                      <h3>Cetegories</h3>
                    </div>
                    <ul>
                      {categories.map((category) => (
                        <li key={category.name}>
                          <Link href={`/news/category/${category.name.toLowerCase()}`}>
                            {category.name}
                          </Link>
                          <span>({category.count.toString().padStart(2, '0')})</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recent Posts Widget */}
                  <div className="gt-single-sideber-widget">
                    <div className="gt-widget-title">
                      <h3>Recent Post</h3>
                    </div>
                    <div className="gt-recent-post-area">
                      {recentPosts.map((post) => (
                        <div key={post.id} className="gt-recent-items">
                          <div className="gt-recent-thumb">
                            <Image
                              src={post.image}
                              alt={post.title}
                              width={100}
                              height={100}
                            />
                          </div>
                          <div className="gt-recent-content">
                            <h6>
                              <Link href={`/news/${post.slug}`}>
                                {post.title}
                              </Link>
                            </h6>
                            <ul>
                              <li>{post.date}</li>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Widget */}
                  <div
                    className="gt-contact-bg bg-cover"
                    style={{ backgroundImage: "url('/assets/img/inner-page/match-details/bg.jpg')" }}
                  >
                    <div className="gt-contact-content">
                      <h3>Need Any Help</h3>
                      <p>Nees Any Help, Call Us 24/7 Full Support</p>
                      <div className="gt-contact-item">
                        <div className="gt-icon">
                          <i className="fa-solid fa-phone"></i>
                        </div>
                        <ul className="gt-list">
                          <li><span>Call Us:</span></li>
                          <li>
                            <a href="tel:+0094382229540">+009 438 222 9540</a>
                          </li>
                        </ul>
                      </div>
                      <div className="gt-contact-item">
                        <div className="gt-icon">
                          <i className="fa-regular fa-envelope"></i>
                        </div>
                        <ul className="gt-list">
                          <li><span>Mail Us</span></li>
                          <li>
                            <a href="mailto:infor@xridergamil.com">
                              infor@xridergamil.com
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="gt-contact-item mb-0">
                        <div className="gt-icon">
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <ul className="gt-list">
                          <li><span>Location:</span></li>
                          <li>Toronto, Montreal, City</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-contact-section">
        <div className="container">
          <div className="cta-wrapper">
            <div className="content wow fadeInUp" data-wow-delay=".3s">
              <p>Pull the Trigger!</p>
              <h3>
                Let&apos;s Bring Your <br />
                Vision To Life
              </h3>
            </div>
            <div className="cta-image wow fadeInUp" data-wow-delay=".5s">
              <Image
                src="/assets/img/home-1/cta-img.png"
                alt="cta"
                width={300}
                height={300}
              />
            </div>
            <div className="contact-right wow fadeInUp" data-wow-delay=".7s">
              <div className="contact-info">
                <h3>call us</h3>
                <p>
                  <a href="tel:+91032145609870">+91 0321 4560 9870</a>
                </p>
              </div>
              <Link href="/contact" className="theme-btn">
                get started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
