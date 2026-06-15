import { HOME_VERSION } from '@/config/home';

// Home 2 Components
import HeroSection2 from '@/components/home-2/HeroSection2';
import AboutSection2 from '@/components/home-2/AboutSection2';
import VideoSection2 from '@/components/home-2/VideoSection2';
import GameSection2 from '@/components/home-2/GameSection2';
import MatchSection2 from '@/components/home-2/MatchSection2';
import TestimonialSection2 from '@/components/home-2/TestimonialSection2';
import TeamSection2 from '@/components/home-2/TeamSection2';
import NewsSection2 from '@/components/home-2/NewsSection2';
import NewsletterSection from '@/components/home-2/NewsletterSection';

// Home 7 Components
import HeroSection7 from '@/components/home-7/HeroSection7';
import AboutSection7 from '@/components/home-7/AboutSection7';
import ServiceSection7 from '@/components/home-7/ServiceSection7';
import GameCaseStudySection from '@/components/home-7/GameCaseStudySection';
import TeamSection7 from '@/components/home-7/TeamSection7';
import TestimonialSection7 from '@/components/home-7/TestimonialSection7';
import CounterSection7 from '@/components/home-7/CounterSection7';


export default function HomePage() {
  // Render home-2 or home-7 based on config
  if (HOME_VERSION === 'home-7') {
    // Same curtain structure as app/home-7/page.tsx: the sticky hero needs the
    // spacer + pulled-up block to release after one viewport — without it the
    // hero stays pinned (and composited) for the entire page.
    return (
      <>
        <div className="hero-pin-range">
          <HeroSection7 />
          {/* 150dvh = tight handoff: pieces exit in ~40vh, the About panel
              starts rising at 50vh — no long empty stretch in between */}
          <div className="hero-scroll-spacer" aria-hidden="true" />
        </div>
        <div style={{ position: 'relative', zIndex: 1, marginTop: '-100dvh' }}>
          <AboutSection7 />
          <ServiceSection7 />
          <GameCaseStudySection />
          <CounterSection7 />
          <TestimonialSection7 />
          <TeamSection7 />

        
        </div>
      </>
    );
  }

  return (
    <>
      <HeroSection2 />
      <AboutSection2 />
      <VideoSection2 />
      <GameSection2 />
      <MatchSection2 />
      <TestimonialSection2 />
      <TeamSection2 />
      <NewsSection2 />
      <NewsletterSection />
    </>
  );
}
