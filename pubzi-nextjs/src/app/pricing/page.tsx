'use client';

import { useState } from 'react';
import Image from 'next/image';

const pricingPlans = [
  {
    id: 1,
    name: 'start pack',
    price: '$19.99',
    description: 'Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin',
    features: [
      'Unlimited access to core features',
      'Restricted usage limits on storage',
      'nhanced security features included',
      'Complete Ad-free gaming',
      'Multiple user accounts at discount'
    ],
    tagStyle: 'gt-bg-black',
    buttonColor: 'color-2',
    buttonShape: '/assets/img/home-2/pricing-btn-shape-2.png'
  },
  {
    id: 2,
    name: 'basic pack',
    price: '$39.99',
    description: 'Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin',
    features: [
      'Unlimited access to core features',
      'Restricted usage limits on storage',
      'nhanced security features included',
      'Complete Ad-free gaming',
      'Multiple user accounts at discount'
    ],
    tagStyle: 'style-bg',
    buttonColor: '',
    buttonShape: '/assets/img/home-4/pricing-btn-shape.png',
    isPopular: true
  },
  {
    id: 3,
    name: 'pro pack',
    price: '$39.99',
    description: 'Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin',
    features: [
      'Unlimited access to core features',
      'Restricted usage limits on storage',
      'nhanced security features included',
      'Complete Ad-free gaming',
      'Multiple user accounts at discount'
    ],
    tagStyle: 'gt-bg-black',
    buttonColor: 'color-2',
    buttonShape: '/assets/img/home-2/pricing-btn-shape-2.png'
  }
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'monthly' | 'weekly'>('monthly');

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
              <h1 className="wow fadeInUp" data-wow-delay=".3s">pricing table</h1>
            </div>
            <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <i className="fa-solid fa-house"></i>
              </li>
              <li>
                <a href="/">home :</a>
              </li>
              <li className="color">pricing table</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="gt-pricing-section-2 section-padding fix">
        <div className="container">
          <div className="gt-pricing-wrapper-2">
            <div className="gt-pricing-content">
              <div className="d-flex justify-content-center">
                <div className="pricing-two__tab">
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
                        onClick={() => setActiveTab('monthly')}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'monthly'}
                      >
                        Monthly
                      </button>
                      <button
                        className={`nav-link ${activeTab === 'weekly' ? 'active' : ''}`}
                        onClick={() => setActiveTab('weekly')}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'weekly'}
                      >
                        weekly
                      </button>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className="gt-pricing-wrapper-2">
            <div className="row g-4 align-items-center">
              <div className="pricing__tab-content">
                <div className="tab-content pt-0 mt-0">
                  <div className={`tab-pane fade ${activeTab === 'monthly' ? 'show active' : ''}`}>
                    <div className="row">
                      {pricingPlans.map((plan) => (
                        <div key={plan.id} className="col-xl-4 col-lg-6 col-md-6">
                          <div className="gt-pricing-box-items-3 gt-style-new">
                            <span className={`gt-price-tag ${plan.tagStyle}`}>{plan.name}</span>
                            <div className="gt-pricing-header">
                              <div className="gt-icon">
                                <Image src="/assets/img/home-2/diamond.svg" alt="icon" width={50} height={50} />
                              </div>
                              <h2>{plan.price}</h2>
                              <p>{plan.description}</p>
                            </div>
                            <ul className="gt-pricing-list">
                              {plan.features.map((feature, index) => (
                                <li key={index}>
                                  <Image src="/assets/img/home-2/check.svg" alt="check" width={20} height={20} />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <div className="gt-pricing-btn">
                              <div className="gt-bg-shape">
                                <Image src={plan.buttonShape} alt="shape" width={200} height={100} />
                              </div>
                              <a href="/pricing" className={`gt-pricing-text ${plan.buttonColor}`}>
                                choose plan <i className="fa-solid fa-arrow-right"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`tab-pane fade ${activeTab === 'weekly' ? 'show active' : ''}`}>
                    <div className="row">
                      {pricingPlans.map((plan) => (
                        <div key={plan.id} className="col-xl-4 col-lg-6 col-md-6">
                          <div className="gt-pricing-box-items-3 gt-style-new">
                            <span className={`gt-price-tag ${plan.tagStyle}`}>{plan.name}</span>
                            <div className="gt-pricing-header">
                              <div className="gt-icon">
                                <Image src="/assets/img/home-2/diamond.svg" alt="icon" width={50} height={50} />
                              </div>
                              <h2>{plan.price}</h2>
                              <p>{plan.description}</p>
                            </div>
                            <ul className="gt-pricing-list">
                              {plan.features.map((feature, index) => (
                                <li key={index}>
                                  <Image src="/assets/img/home-2/check.svg" alt="check" width={20} height={20} />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <div className="gt-pricing-btn">
                              <div className="gt-bg-shape">
                                <Image src={plan.buttonShape} alt="shape" width={200} height={100} />
                              </div>
                              <a href="/pricing" className={`gt-pricing-text ${plan.buttonColor}`}>
                                choose plan <i className="fa-solid fa-arrow-right"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BG Section */}
      <div className="gt-bg-section fix">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="gt-bg-image img-custom-anim-bottom wow" data-wow-delay=".3s">
                <Image src="/assets/img/inner-page/bg.png" alt="background" width={1200} height={400} />
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <Image src="/assets/img/home-1/cta-img.png" alt="cta" width={400} height={400} />
            </div>
            <div className="contact-right wow fadeInUp" data-wow-delay=".7s">
              <div className="contact-info">
                <h3>call us</h3>
                <p>
                  <a href="tel:+91032145609870">+91 0321 4560 9870</a>
                </p>
              </div>
              <a href="/contact" className="theme-btn">
                get started
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
