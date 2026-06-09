'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function FAQPage() {
  const [openAccordion, setOpenAccordion] = useState<string>('faq2')

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id)
  }

  const faqItems = [
    {
      id: 'faq1',
      number: '01',
      title: 'The Legend of Zelda: Breath of the Wild',
      content: 'Nam aliquam et quam vitae lobortis. Duis placerat, turpis ut accumsan mollis, diam diam lobortis diam, id mollis nunc ex in justo. Donec sit amet contain helpful information like walkthroughs, tips, secrets, and troubleshooting.',
      image: '/assets/img/inner-page/faq/faq-1.jpg'
    },
    {
      id: 'faq2',
      number: '02',
      title: 'Tips for hunting, camp upgrades, and managing your horse.',
      content: 'Nam aliquam et quam vitae lobortis. Duis placerat, turpis ut accumsan mollis, diam diam lobortis diam, id mollis nunc ex in justo. Donec sit amet contain helpful information like walkthroughs, tips, secrets, and troubleshooting.',
      image: '/assets/img/inner-page/faq/faq-1.jpg'
    },
    {
      id: 'faq3',
      number: '03',
      title: 'Side quests, collectibles, and crafting tips.',
      content: 'Nam aliquam et quam vitae lobortis. Duis placerat, turpis ut accumsan mollis, diam diam lobortis diam, id mollis nunc ex in justo. Donec sit amet contain helpful information like walkthroughs, tips, secrets, and troubleshooting.',
      image: '/assets/img/inner-page/faq/faq-1.jpg'
    }
  ]

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/breadcrumb.png')" }}>
        <div className="gt-left-shape">
          <Image src="/assets/img/shape-1.png" alt="img" width={200} height={200} />
        </div>
        <div className="gt-right-shape">
          <Image src="/assets/img/shape-2.png" alt="img" width={200} height={200} />
        </div>
        <div className="gt-blur-shape">
          <Image src="/assets/img/breadcrumb-shape.png" alt="img" width={800} height={400} />
        </div>
        <div className="container">
          <div className="gt-page-heading">
            <div className="gt-breadcrumb-sub-title">
              <h1 className="wow fadeInUp" data-wow-delay=".3s">faq</h1>
            </div>
            <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <i className="fa-solid fa-house"></i>
              </li>
              <li>
                <a href="/">home :</a>
              </li>
              <li className="color">faq</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="gt-faq-section section-padding fix pb-0">
        <div className="container">
          <div className="gt-faq-wrapper">
            <div className="row">
              <div className="col-lg-8">
                <div className="gt-faq-item">
                  <div className="gt-faq-content">
                    <h4>frequently ask questions</h4>
                    <p>
                      Nam aliquam et quam vitae lobortis. Duis placerat, turpis ut accumsan mollis, diam diam lobortis diam, id mollis nunc ex in justo. Donec sit amet
                    </p>
                    <div className="faq-accordion">
                      <div className="accordion" id="accordion">
                        {faqItems.map((item) => (
                          <div key={item.id} className={`accordion-item ${item.id === 'faq3' ? 'mb-0' : 'mb-3'}`}>
                            <h5 className="accordion-header">
                              <button
                                className={`accordion-button d-flex gap-2 flex-wrap ${openAccordion !== item.id ? 'collapsed' : ''}`}
                                type="button"
                                onClick={() => toggleAccordion(item.id)}
                                aria-expanded={openAccordion === item.id}
                                aria-controls={item.id}
                              >
                                <span>{item.number}</span>
                                {item.title}
                              </button>
                            </h5>
                            <div
                              id={item.id}
                              className={`accordion-collapse collapse ${openAccordion === item.id ? 'show' : ''}`}
                            >
                              <div className="accordion-body">
                                {item.content}
                              </div>
                              <div className="thumb">
                                <Image src={item.image} alt="img" width={800} height={450} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="gt-contact-bg bg-cover" style={{ backgroundImage: "url(/assets/img/inner-page/match-details/bg.jpg)" }}>
                  <div className="gt-contact-content">
                    <h3>Need Any Help</h3>
                    <p>Nees Any Help, Call Us 24/7 Full Support</p>
                    <div className="gt-contact-item">
                      <div className="gt-icon">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <ul className="gt-list">
                        <li><span>Call Us:</span></li>
                        <li><a href="tel:+0094382229540">+009 438 222 9540</a></li>
                      </ul>
                    </div>
                    <div className="gt-contact-item">
                      <div className="gt-icon">
                        <i className="fa-regular fa-envelope"></i>
                      </div>
                      <ul className="gt-list">
                        <li><span>Mail Us</span></li>
                        <li><a href="mailto:infor@xridergamil.com">infor@xridergamil.com</a></li>
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
      </section>

      {/* CTA Section */}
      <section className="cta-contact-section section-padding pb-0">
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
              <Image src="/assets/img/home-1/cta-img.png" alt="img" width={400} height={400} />
            </div>
            <div className="contact-right wow fadeInUp" data-wow-delay=".7s">
              <div className="contact-info">
                <h3>call us</h3>
                <p><a href="tel:+91032145609870">+91 0321 4560 9870</a></p>
              </div>
              <a href="/contact" className="theme-btn">
                get started
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
