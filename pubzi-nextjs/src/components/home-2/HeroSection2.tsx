'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection2() {
  return (
    <section className="hero-section hero-2 bg-cover" style={{ backgroundImage: "url('/assets/img/home-2/hero/hero-bg.jpg')" }}>
      <div className="top-shape">
        <Image src="/assets/img/home-2/hero/left-shape.png" alt="img" width={500} height={500} />
      </div>
      <div className="top-line">
        <Image src="/assets/img/home-2/hero/top-line.png" alt="img" width={500} height={500} />
      </div>
      <div className="bottom-shape">
        <Image src="/assets/img/home-2/hero/bottom-shape.png" alt="img" width={500} height={500} />
      </div>
      <div className="left-shape float-bob-y">
        <Image src="/assets/img/home-2/hero/left-2.png" alt="img" width={500} height={500} />
      </div>
      <div className="right-shape">
        <Image src="/assets/img/home-2/hero/right-shape.png" alt="img" width={500} height={500} />
      </div>
      <div className="right-shape2 float-bob-y">
        <Image src="/assets/img/home-2/hero/right-shape2.png" alt="img" width={500} height={500} />
      </div>
      <div className="game-controll float-bob-x">
        <Image src="/assets/img/home-2/hero/game-controll.png" alt="" width={500} height={500} />
      </div>
      <div className="game-controll-bg">
        <Image src="/assets/img/home-2/hero/game-controll-bg.png" alt="img" width={500} height={500} />
      </div>
      <div className="right-shape-3">
        <Image src="/assets/img/home-2/hero/shape-5.png" alt="img" width={500} height={500} />
      </div>
      <div className="blur-shape">
        <Image src="/assets/img/home-2/hero/blur.png" alt="img" width={500} height={500} />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="hero-content">
              <span className="sub-title wow fadeInUp">your future ultimate gaming world . .</span>
              <h1 className="wow fadeInUp" data-wow-delay=".3s">
                gaming vibe <span>Legends</span>
              </h1>
              <div className="hero-sub-content">
                <p className="wow fadeInUp" data-wow-delay=".5s">
                  A game studio crafting exciting, high-quality
                  video games, prioritizing immersive
                  gameplay and mechanics.
                </p>
                <Link href="/contact" className="theme-btn style-2 wow fadeInUp" data-wow-delay=".7s">
                  <span className="left-line"></span>
                  know more
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.41099 8.46917L1.88219 16L0 14.1166L7.53013 6.58846L0.941096 0H16V15.0576L9.41099 8.46917Z" fill="#0B0E13"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-image wow bounceInRight" data-wow-delay="700ms" data-wow-duration="1000ms">
        <Image src="/assets/img/home-2/hero/hero1.png" alt="img" width={800} height={800} />
      </div>
    </section>
  )
}
