import Image from 'next/image';
import Link from 'next/link';

const teamMembers = [
  {
    id: 1,
    name: 'Jammey Hanson',
    role: 'Game Artist',
    image: '/assets/img/home-2/team/team-02.png',
    socials: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 2,
    name: 'Jammey Hanson',
    role: 'Game Artist',
    image: '/assets/img/home-2/team/team-03.png',
    socials: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 3,
    name: 'Jammey Hanson',
    role: 'Game Artist',
    image: '/assets/img/home-2/team/team-04.png',
    socials: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 4,
    name: 'Jammey Hanson',
    role: 'Game Artist',
    image: '/assets/img/home-2/team/team-05.png',
    socials: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 5,
    name: 'Jammey Hanson',
    role: 'Game Artist',
    image: '/assets/img/home-2/team/team-06.png',
    socials: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    id: 6,
    name: 'Jammey Hanson',
    role: 'Game Artist',
    image: '/assets/img/home-2/team/team-07.png',
    socials: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
];

export default function TeamPage() {
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
          <Image src="/assets/img/breadcrumb-shape.png" alt="shape" width={600} height={400} />
        </div>
        <div className="container">
          <div className="gt-page-heading">
            <div className="gt-breadcrumb-sub-title">
              <h1 className="wow fadeInUp" data-wow-delay=".3s">
                our teams
              </h1>
            </div>
            <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <i className="fa-solid fa-house"></i>
              </li>
              <li>
                <Link href="/">home :</Link>
              </li>
              <li className="color">our teams</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="gt-team-section section-padding fix">
        <div className="container">
          <div className="gt-team-wrapper gt-style-2">
            <div className="row g-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="col-xl-4 col-lg-6 col-md-6">
                  <div className="team-single-style-2 mt-0">
                    <div className="team-bg">
                      <Image
                        src="/assets/img/home-2/team/team-bg.png"
                        alt="background"
                        width={400}
                        height={400}
                      />
                    </div>
                    <div className="social-icon align-items-center">
                      <a href={member.socials.facebook}>
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href={member.socials.twitter}>
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href={member.socials.linkedin}>
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                      <a href={member.socials.instagram}>
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                    <div className="thumb">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={400}
                        height={500}
                      />
                      <div className="team-content">
                        <h3>
                          <Link href={`/team/${member.id}`}>{member.name}</Link>
                        </h3>
                        <p>{member.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Contact Section */}
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
              <Image src="/assets/img/home-1/cta-img.png" alt="CTA" width={300} height={300} />
            </div>
            <div className="contact-right wow fadeInUp" data-wow-delay=".7s">
              <div className="contact-info">
                <h3>call us</h3>
                <p>
                  <a href="tel:+910321456098700">+91 0321 4560 9870</a>
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
