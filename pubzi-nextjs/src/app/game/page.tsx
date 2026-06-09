import Image from "next/image";
import Link from "next/link";

const games = [
  {
    id: 1,
    image: "/assets/img/home-2/game/game-01.jpg",
    category: "metaverse",
    title: "Sweet revenge gameplay",
    delay: "0.3s"
  },
  {
    id: 2,
    image: "/assets/img/home-2/game/game-02.jpg",
    category: "metaverse",
    title: "Sweet revenge gameplay",
    delay: "0.4s"
  },
  {
    id: 3,
    image: "/assets/img/home-2/game/game-03.jpg",
    category: "metaverse",
    title: "Sweet revenge gameplay",
    delay: "0.6s"
  },
  {
    id: 4,
    image: "/assets/img/home-2/game/game-04.jpg",
    category: "metaverse",
    title: "Sweet revenge gameplay",
    delay: "0.8s"
  },
  {
    id: 5,
    image: "/assets/img/home-2/game/game-05.jpg",
    category: "metaverse",
    title: "Sweet revenge gameplay",
    delay: "0.2s"
  },
  {
    id: 6,
    image: "/assets/img/home-2/game/game-6.png",
    category: "metaverse",
    title: "Sweet revenge gameplay",
    delay: "0.4s"
  },
  {
    id: 7,
    image: "/assets/img/home-2/game/game-7.png",
    category: "metaverse",
    title: "Sweet revenge gameplay",
    delay: "0.6s"
  },
  {
    id: 8,
    image: "/assets/img/home-2/game/game-8.png",
    category: "metaverse",
    title: "Sweet revenge gameplay",
    delay: "0.8s"
  }
];

const aboutFeatures = [
  {
    icon: "/assets/img/home-7/icon/01.svg",
    title: "VR Supported",
    description: "A game studio crafting exciting, video games",
    bgColor: true
  },
  {
    icon: "/assets/img/home-7/icon/02.svg",
    title: "Location Tagging",
    description: "A game studio crafting exciting, video games",
    bgColor: false
  },
  {
    icon: "/assets/img/home-7/icon/03.svg",
    title: "Multi dimension",
    description: "A game studio crafting exciting, video games",
    bgColor: false
  },
  {
    icon: "/assets/img/home-7/icon/04.svg",
    title: "Console System",
    description: "A game studio crafting exciting, video games",
    bgColor: true
  }
];

const pricingPlans = [
  {
    name: "basic pack",
    price: "$19.99",
    description: "Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin",
    features: [
      "Unlimited access to core features",
      "Restricted usage limits on storage",
      "nhanced security features included",
      "Complete Ad-free gaming",
      "Multiple user accounts at discount"
    ],
    isProPack: false
  },
  {
    name: "pro pack",
    price: "$39.99",
    description: "Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin",
    features: [
      "Unlimited access to core features",
      "Restricted usage limits on storage",
      "nhanced security features included",
      "Complete Ad-free gaming",
      "Multiple user accounts at discount"
    ],
    isProPack: true
  }
];

export default function GamePage() {
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
              <h1 className="wow fadeInUp" data-wow-delay=".3s">our games</h1>
            </div>
            <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <i className="fa-solid fa-house"></i>
              </li>
              <li>
                <Link href="/">home :</Link>
              </li>
              <li className="color">our games</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Game Section */}
      <section className="gt-game-section-5 section-padding fix">
        <div className="container-fluid">
          <div className="row g-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay={game.delay}
              >
                <div className="gt-gaming-card-item-5 mt-0">
                  <div className="gt-gaming-image">
                    <Image
                      src={game.image}
                      alt={game.title}
                      width={400}
                      height={300}
                      className="w-100 h-auto"
                    />
                    <Link href="/game-details" className="icon">
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                    <div className="gt-gaming-content">
                      <h6>{game.category}</h6>
                      <h3>
                        <Link href="/game-details">{game.title}</Link>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section fix section-padding">
        <div className="container">
          <div className="about-wrapper-7">
            <div className="row g-4 align-items-center">
              <div className="col-lg-5">
                <div className="about-image-2 wow animated-image">
                  <Image
                    src="/assets/img/home-7/about/about-01.png"
                    alt="about"
                    width={500}
                    height={600}
                  />
                  <div className="bg-shape">
                    <Image
                      src="/assets/img/home-7/about/bg-shape.png"
                      alt="shape"
                      width={500}
                      height={600}
                    />
                  </div>
                  <div className="ellipse-shape">
                    <Image
                      src="/assets/img/home-7/about/ellipse.png"
                      alt="shape"
                      width={400}
                      height={400}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="about-content">
                  <div className="section-title mb-0">
                    <h6 className="wow fadeInUp">about xports</h6>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      We focus on creating beautiful games
                    </h2>
                  </div>
                  <p className="about-text wow fadeInUp" data-wow-delay=".5s">
                    A game studio crafting exciting, high-quality video games, prioritizing immersive gameplay and mechanics.
                  </p>
                  <div className="about-box-wrapper wow fadeInUp" data-wow-delay=".3s">
                    <div className="about-box-item">
                      {aboutFeatures.slice(0, 2).map((feature, index) => (
                        <div
                          key={index}
                          className={`about-box ${feature.bgColor ? 'bg-color' : ''} ${index === 1 ? 'border-none' : ''}`}
                        >
                          <div className="icon">
                            <Image
                              src={feature.icon}
                              alt={feature.title}
                              width={60}
                              height={60}
                            />
                          </div>
                          <div className="content">
                            <h5>{feature.title}</h5>
                            <p>{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="about-box-item">
                      {aboutFeatures.slice(2, 4).map((feature, index) => (
                        <div
                          key={index}
                          className={`about-box ${feature.bgColor ? 'bg-color' : ''} ${index === 1 ? 'border-none' : ''}`}
                        >
                          <div className="icon">
                            <Image
                              src={feature.icon}
                              alt={feature.title}
                              width={60}
                              height={60}
                            />
                          </div>
                          <div className="content">
                            <h5>{feature.title}</h5>
                            <p>{feature.description}</p>
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

      {/* Pricing Section */}
      <section
        className="gt-pricing-section-2 section-padding parallaxie fix bg-cover"
        style={{ backgroundImage: "url('/assets/img/home-4/pricing-bg.jpg')" }}
      >
        <div className="container">
          <div className="gt-pricing-wrapper">
            <div className="row g-4 align-items-center">
              <div className="col-xl-4 col-lg-12 col-md-12">
                <div className="gt-pricing-content">
                  <div className="section-title-2 text-center text-sm-start mb-0">
                    <h6 className="subtitle tz-sub-tilte tz-sub-anim text-uppercase tx-subTitle">
                      best plan
                    </h6>
                    <h2 className="tx-title sec_title tz-itm-title tz-itm-anim">
                      Best Pricing Plan For You!
                    </h2>
                  </div>
                  <p className="gt-pricing-text wow fadeInUp" data-wow-delay=".5s">
                    A game studio crafting exciting, high-quality video games, prioritizing immersive gameplay and mechanics.
                  </p>
                  <div className="d-flex">
                    <div className="pricing-two__tab">
                      <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                          <button
                            className="nav-link active"
                            id="pt-1-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#pt-1"
                            type="button"
                            role="tab"
                            aria-controls="pt-1"
                            aria-selected="true"
                          >
                            Monthly
                          </button>
                          <button
                            className="nav-link"
                            id="pt-2-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#pt-2"
                            type="button"
                            role="tab"
                            aria-controls="pt-2"
                            aria-selected="false"
                          >
                            Yearly
                          </button>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <div className="pricing__tab-content">
                  <div className="tab-content" id="nav-tabContent">
                    {/* Monthly Tab */}
                    <div
                      className="tab-pane fade show active"
                      id="pt-1"
                      role="tabpanel"
                      aria-labelledby="pt-1-tab"
                    >
                      <div className="row g-4">
                        {pricingPlans.map((plan, index) => (
                          <div key={index} className="col-xl-6 col-lg-6 col-md-6">
                            <div
                              className="gt-pricing-box-items-2"
                              style={{ backgroundImage: "url('/assets/img/home-4/pricing-item-bg.png')" }}
                            >
                              <span className={`gt-price-tag ${plan.isProPack ? 'gt-bg-white' : ''}`}>
                                {plan.name}
                              </span>
                              <div className="gt-pricing-header">
                                <div className="gt-icon">
                                  <Image
                                    src="/assets/img/home-4/diamond.svg"
                                    alt="diamond"
                                    width={60}
                                    height={60}
                                  />
                                </div>
                                <h2>{plan.price}</h2>
                                <p>{plan.description}</p>
                              </div>
                              <ul className="gt-pricing-list">
                                {plan.features.map((feature, idx) => (
                                  <li key={idx}>
                                    <Image
                                      src="/assets/img/home-4/check.svg"
                                      alt="check"
                                      width={20}
                                      height={20}
                                    />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <div className={`gt-pricing-btn ${plan.isProPack ? 'style-2' : ''}`}>
                                <div className="gt-bg-shape">
                                  <Image
                                    src={plan.isProPack
                                      ? "/assets/img/home-4/pricing-btn-shape-2.png"
                                      : "/assets/img/home-4/pricing-btn-shape.png"
                                    }
                                    alt="shape"
                                    width={300}
                                    height={60}
                                  />
                                </div>
                                <div className="gt-bg-shape-hover">
                                  <Image
                                    src={plan.isProPack
                                      ? "/assets/img/home-4/pricing-btn-shape.png"
                                      : "/assets/img/home-4/pricing-btn-shape-2.png"
                                    }
                                    alt="shape"
                                    width={300}
                                    height={60}
                                  />
                                </div>
                                <Link
                                  href="/pricing"
                                  className={`gt-pricing-text ${plan.isProPack ? 'color-2' : ''}`}
                                >
                                  choose plan <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Yearly Tab */}
                    <div
                      className="tab-pane fade"
                      id="pt-2"
                      role="tabpanel"
                      aria-labelledby="pt-2-tab"
                    >
                      <div className="row g-4">
                        {pricingPlans.map((plan, index) => (
                          <div key={index} className="col-xl-6 col-lg-6 col-md-6">
                            <div
                              className="gt-pricing-box-items-2"
                              style={{ backgroundImage: "url('/assets/img/home-4/pricing-item-bg.png')" }}
                            >
                              <span className={`gt-price-tag ${plan.isProPack ? 'gt-bg-white' : ''}`}>
                                {plan.name}
                              </span>
                              <div className="gt-pricing-header">
                                <div className="gt-icon">
                                  <Image
                                    src="/assets/img/home-4/diamond.svg"
                                    alt="diamond"
                                    width={60}
                                    height={60}
                                  />
                                </div>
                                <h2>{plan.price}</h2>
                                <p>{plan.description}</p>
                              </div>
                              <ul className="gt-pricing-list">
                                {plan.features.map((feature, idx) => (
                                  <li key={idx}>
                                    <Image
                                      src="/assets/img/home-4/check.svg"
                                      alt="check"
                                      width={20}
                                      height={20}
                                    />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <div className={`gt-pricing-btn ${plan.isProPack ? 'style-2' : ''}`}>
                                <div className="gt-bg-shape">
                                  <Image
                                    src={plan.isProPack
                                      ? "/assets/img/home-4/pricing-btn-shape-2.png"
                                      : "/assets/img/home-4/pricing-btn-shape.png"
                                    }
                                    alt="shape"
                                    width={300}
                                    height={60}
                                  />
                                </div>
                                <div className="gt-bg-shape-hover">
                                  <Image
                                    src={plan.isProPack
                                      ? "/assets/img/home-4/pricing-btn-shape.png"
                                      : "/assets/img/home-4/pricing-btn-shape-2.png"
                                    }
                                    alt="shape"
                                    width={300}
                                    height={60}
                                  />
                                </div>
                                <Link
                                  href="/pricing"
                                  className={`gt-pricing-text ${plan.isProPack ? 'color-2' : ''}`}
                                >
                                  choose plan <i className="fa-solid fa-arrow-right"></i>
                                </Link>
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
              <Image
                src="/assets/img/home-1/cta-img.png"
                alt="cta"
                width={300}
                height={400}
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
