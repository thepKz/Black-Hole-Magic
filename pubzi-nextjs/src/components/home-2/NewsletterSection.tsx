'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Add your newsletter signup logic here
    console.log('Newsletter signup:', email);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      alert('Thank you for subscribing!');
    }, 1000);
  };

  return (
    <section className="gt-newsletter-section fix">
      <div className="container">
        <div
          className="gt-newsletter-wrapper bg-cover"
          style={{ backgroundImage: 'url(/assets/img/home-2/newsletter-bg.jpg)' }}
        >
          <h4 className="wow fadeInUp" data-wow-delay=".3s">
            Sign Up Today To Get The Latest <br />
            Inspiration & Insights
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="form-clt">
              <Image
                src="/assets/img/home-3/icon/10.svg"
                alt="email icon"
                width={24}
                height={24}
                className="input-icon"
              />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <button type="submit" className="theme-btn" disabled={isSubmitting}>
                {isSubmitting ? 'subscribing...' : 'subscribe now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
