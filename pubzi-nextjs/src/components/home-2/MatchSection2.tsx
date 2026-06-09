'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MatchCardProps {
  team1Image: string;
  team2Image: string;
  date: string;
  time: string;
  title: string;
  description: string;
  matchDate: Date;
  reverse?: boolean;
  noBorder?: boolean;
  delay?: string;
}

const MatchCard = ({
  team1Image,
  team2Image,
  date,
  time,
  title,
  description,
  matchDate,
  reverse = false,
  noBorder = false,
  delay = '.3s'
}: MatchCardProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = matchDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [matchDate]);

  const content = (
    <div className="trending-match-content">
      <ul className="gt-date-list">
        <li>
          <i className="fa-light fa-calendar"></i>
          {date}
        </li>
        <li>
          <i className="fa-regular fa-clock"></i>
          {time}
        </li>
      </ul>
      <h3>
        <Link href="/match-details">
          {title}
        </Link>
      </h3>
      <p>
        {description}
      </p>
      <div className="countdown-timer">
        <div className="timer-item">
          <span className="timer-value">{timeLeft.days}</span>
          <span className="timer-label">Days</span>
        </div>
        <div className="timer-item">
          <span className="timer-value">{timeLeft.hours}</span>
          <span className="timer-label">Hours</span>
        </div>
        <div className="timer-item">
          <span className="timer-value">{timeLeft.minutes}</span>
          <span className="timer-label">Minutes</span>
        </div>
        <div className="timer-item">
          <span className="timer-value">{timeLeft.seconds}</span>
          <span className="timer-label">Seconds</span>
        </div>
      </div>
    </div>
  );

  const matchInfo = (
    <div className="trending-match-left">
      <div className="gt-match-logo">
        <Image
          src={team1Image}
          alt="team 1"
          width={120}
          height={120}
          className="gt-match-thumb"
        />
        <Image
          src="/assets/img/home-2/match/vs.png"
          alt="vs"
          width={60}
          height={60}
        />
        <Image
          src={team2Image}
          alt="team 2"
          width={120}
          height={120}
          className="gt-match-thumb"
        />
      </div>
      <div className="gt-watch-now-items">
        <span>Watch live on</span>
        <ul className="gt-watch-now-list">
          <li>
            <Link href="#">
              <i className="fa-brands fa-youtube"></i> you tube
            </Link>
            <Link href="#">
              <i className="fa-brands fa-discord"></i>
              discord
            </Link>
          </li>
          <li>
            <Link href="#">
              <i className="fa-brands fa-twitch"></i>
              twitch
            </Link>
            <Link href="#">
              <i className="fa-solid fa-eyes"></i>
              GeForce
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className={`trending-match-items ${noBorder ? 'bb-none' : ''} wow fadeInUp`} data-wow-delay={delay}>
      {reverse ? (
        <>
          {content}
          {matchInfo}
        </>
      ) : (
        <>
          {matchInfo}
          {content}
        </>
      )}
    </div>
  );
};

export default function MatchSection2() {
  const matches = [
    {
      team1Image: '/assets/img/home-2/match/match-01.jpg',
      team2Image: '/assets/img/home-2/match/match-02.jpg',
      date: '30 May, 2025',
      time: '10:00 am - 12:30 pm',
      title: 'Aggressive & War-Themed',
      description: 'A game studio crafting exciting, high-quality video immersive gameplay and mechanics.',
      matchDate: new Date('2025-05-30T10:00:00'),
      reverse: false,
      delay: '.3s'
    },
    {
      team1Image: '/assets/img/home-2/match/match-03.jpg',
      team2Image: '/assets/img/home-2/match/match-04.jpg',
      date: '30 May, 2025',
      time: '10:00 am - 12:30 pm',
      title: 'The Cognitive Crusade',
      description: 'A game studio crafting exciting, high-quality video immersive gameplay and mechanics.',
      matchDate: new Date('2025-05-30T10:00:00'),
      reverse: true,
      delay: '.5s'
    },
    {
      team1Image: '/assets/img/home-2/match/match-01.jpg',
      team2Image: '/assets/img/home-2/match/match-02.jpg',
      date: '30 May, 2025',
      time: '10:00 am - 12:30 pm',
      title: 'The Machine Uprising',
      description: 'A game studio crafting exciting, high-quality video immersive gameplay and mechanics.',
      matchDate: new Date('2025-05-30T10:00:00'),
      reverse: false,
      noBorder: true,
      delay: '.7s'
    }
  ];

  return (
    <section className="trending-match-section fix section-padding pt-0">
      <div className="left-shape float-bob-y1">
        <Image
          src="/assets/img/home-2/match/left-shape.png"
          alt="shape"
          width={200}
          height={200}
        />
      </div>
      <div className="right-shape">
        <Image
          src="/assets/img/home-2/match/right-shape.png"
          alt="shape"
          width={200}
          height={200}
        />
      </div>
      <div className="container">
        <div className="section-title-2 text-center">
          <h6 className="wow fadeInUp" data-wow-delay=".3s">top trending matches</h6>
          <h2 className="wow fadeInUp" data-wow-delay=".5s">
            Upcoming Trending Matches
          </h2>
        </div>
        <div className="trending-match-wrapper">
          <div className="vec-arrow">
            <Image
              src="/assets/img/home-2/match/vec-arrow.png"
              alt="arrow"
              width={100}
              height={100}
            />
          </div>
          <div className="linear-shape">
            <Image
              src="/assets/img/home-2/match/linear-bg-1.png"
              alt="shape"
              width={600}
              height={400}
            />
          </div>
          <div className="linear-shape-2">
            <Image
              src="/assets/img/home-2/match/linear-bg-2.png"
              alt="shape"
              width={600}
              height={400}
            />
          </div>
          {matches.map((match, index) => (
            <MatchCard key={index} {...match} />
          ))}
        </div>
      </div>
    </section>
  );
}
