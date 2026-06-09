'use client';

import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="gt-breadcrumb-wrapper bg-cover" style={{ backgroundImage: "url('/assets/img/breadcrumb.png')" }}>
        <div className="gt-left-shape">
          <img src="/assets/img/shape-1.png" alt="img" />
        </div>
        <div className="gt-right-shape">
          <img src="/assets/img/shape-2.png" alt="img" />
        </div>
        <div className="gt-blur-shape">
          <img src="/assets/img/breadcrumb-shape.png" alt="img" />
        </div>
        <div className="container">
          <div className="gt-page-heading">
            <div className="gt-breadcrumb-sub-title">
              <h1 className="wow fadeInUp" data-wow-delay=".3s">Contact Us</h1>
            </div>
            <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <i className="fa-solid fa-house"></i>
              </li>
              <li>
                <a href="/">
                  home :
                </a>
              </li>
              <li className="color">
                Contact Us
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="gt-contact-us-section section-padding fix">
        <div className="container">
          <div className="gt-contact-us-wrapper">
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="gt-comment-form-wrap">
                  <h4>We&apos;re Here to Help!</h4>
                  <p>Your email address will not be published. Required fields are marked *</p>

                  {submitStatus === 'success' && (
                    <div className="alert alert-success mb-4">
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="alert alert-danger mb-4">
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <span>Your Name</span>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <span>Your Email</span>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-clt">
                          <span>write message</span>
                          <textarea
                            name="message"
                            id="message"
                            placeholder="Type your message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <button
                          type="submit"
                          className="theme-btn boder-10"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="gt-contact-bg bg-cover" style={{ backgroundImage: "url(/assets/img/inner-page/match-details/bg.jpg)" }}>
                  <div className="gt-contact-content">
                    <h3>Need Any Help</h3>
                    <p>Nees Any Help, Call Us  24/7 Full Support</p>
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
                        <li><a href="mailto:infor@xridergamil.com">
                          infor@xridergamil.com
                        </a></li>
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
                <div className="gt-bg-image">
                  <img src="/assets/img/inner-page/contact-bg.jpg" alt="img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="gt-map-section fix">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="gt-map-items">
                <div className="googpemap">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
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
              <img src="/assets/img/home-1/cta-img.png" alt="img" />
            </div>
            <div className="contact-right wow fadeInUp" data-wow-delay=".7s">
              <div className="contact-info">
                <h3>call us</h3>
                <p><a href="tel:+910321456098710">+91 0321 4560 9870</a></p>
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
