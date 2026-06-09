'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const galleryImages = [
    '/assets/img/inner-page/gallery/gallery-1.jpg',
    '/assets/img/inner-page/gallery/gallery-2.jpg',
    '/assets/img/inner-page/gallery/gallery-3.jpg',
    '/assets/img/inner-page/gallery/gallery-4.jpg',
    '/assets/img/inner-page/gallery/gallery-5.jpg',
    '/assets/img/inner-page/gallery/gallery-6.jpg',
    '/assets/img/inner-page/gallery/gallery-7.jpg',
    '/assets/img/inner-page/gallery/gallery-8.jpg',
  ];

  const openLightbox = (image: string) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage('');
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
              <h1 className="wow fadeInUp" data-wow-delay=".3s">epic gallery</h1>
            </div>
            <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <i className="fa-solid fa-house"></i>
              </li>
              <li>
                <a href="/">home :</a>
              </li>
              <li className="color">epic gallery</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gt-gallery-section section-padding fix">
        <div className="container">
          <div className="row g-4">
            {/* Column 1 */}
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="gt-epic-gallery-item">
                <div className="gt-gallery-iamge">
                  <img src={galleryImages[0]} alt="gallery" />
                  <button
                    onClick={() => openLightbox(galleryImages[0])}
                    className="icon img-popup2"
                    aria-label="View image"
                  >
                    <i className="fa-regular fa-arrows-up-down-left-right"></i>
                  </button>
                </div>
              </div>
              <div className="gt-epic-gallery-item mb-0">
                <div className="gt-gallery-iamge">
                  <img src={galleryImages[1]} alt="gallery" />
                  <button
                    onClick={() => openLightbox(galleryImages[1])}
                    className="icon img-popup2"
                    aria-label="View image"
                  >
                    <i className="fa-regular fa-arrows-up-down-left-right"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="gt-epic-gallery-item">
                <div className="gt-gallery-iamge">
                  <img src={galleryImages[2]} alt="gallery" />
                  <button
                    onClick={() => openLightbox(galleryImages[2])}
                    className="icon img-popup2"
                    aria-label="View image"
                  >
                    <i className="fa-regular fa-arrows-up-down-left-right"></i>
                  </button>
                </div>
              </div>
              <div className="gt-epic-gallery-item mb-0">
                <div className="gt-gallery-iamge">
                  <img src={galleryImages[3]} alt="gallery" />
                  <button
                    onClick={() => openLightbox(galleryImages[3])}
                    className="icon img-popup2"
                    aria-label="View image"
                  >
                    <i className="fa-regular fa-arrows-up-down-left-right"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="gt-epic-gallery-item">
                <div className="gt-gallery-iamge">
                  <img src={galleryImages[4]} alt="gallery" />
                  <button
                    onClick={() => openLightbox(galleryImages[4])}
                    className="icon img-popup2"
                    aria-label="View image"
                  >
                    <i className="fa-regular fa-arrows-up-down-left-right"></i>
                  </button>
                </div>
              </div>
              <div className="gt-epic-gallery-item mb-0">
                <div className="gt-gallery-iamge">
                  <img src={galleryImages[5]} alt="gallery" />
                  <button
                    onClick={() => openLightbox(galleryImages[5])}
                    className="icon img-popup2"
                    aria-label="View image"
                  >
                    <i className="fa-regular fa-arrows-up-down-left-right"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Column 4 - Full width images */}
            <div className="col-lg-6">
              <div className="gt-epic-gallery-item mb-0">
                <div className="gt-gallery-iamge">
                  <img src={galleryImages[6]} alt="gallery" />
                  <button
                    onClick={() => openLightbox(galleryImages[6])}
                    className="icon img-popup2"
                    aria-label="View image"
                  >
                    <i className="fa-regular fa-arrows-up-down-left-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="gt-epic-gallery-item mb-0">
                <div className="gt-gallery-iamge">
                  <img src={galleryImages[7]} alt="gallery" />
                  <button
                    onClick={() => openLightbox(galleryImages[7])}
                    className="icon img-popup2"
                    aria-label="View image"
                  >
                    <i className="fa-regular fa-arrows-up-down-left-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <img src="/assets/img/home-1/cta-img.png" alt="img" />
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

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '20px',
              right: '40px',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '40px',
              cursor: 'pointer',
              zIndex: 10000,
            }}
            aria-label="Close lightbox"
          >
            &times;
          </button>
          <img
            src={selectedImage}
            alt="gallery lightbox"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
