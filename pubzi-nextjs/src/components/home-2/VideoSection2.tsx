'use client';

import React from 'react';

const VideoSection2: React.FC = () => {
  return (
    <section
      className="video-section-2 parallaxie fix section-padding bg-cover"
      style={{ backgroundImage: "url('assets/img/home-2/video-bg.jpg')" }}
    >
      <div className="video-info-items">
        <h2 className="title">Born to Game</h2>
        <a
          href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I"
          className="video-btn ripple video-popup"
        >
          <i className="fa-solid fa-play"></i>
        </a>
      </div>
    </section>
  );
};

export default VideoSection2;
