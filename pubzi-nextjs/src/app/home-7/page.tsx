import HeroSection7 from '@/components/home-7/HeroSection7';
import AboutSection7 from '@/components/home-7/AboutSection7';
import ServiceSection7 from '@/components/home-7/ServiceSection7';
import GameCaseStudySection from '@/components/home-7/GameCaseStudySection';
import TopFeatureSection from '@/components/home-7/TopFeatureSection';
import TeamSection7 from '@/components/home-7/TeamSection7';
import TestimonialSection7 from '@/components/home-7/TestimonialSection7';
import CounterSection7 from '@/components/home-7/CounterSection7';
import NewsSection7 from '@/components/home-7/NewsSection7';

export default function Home7Page() {
  return (
    <>
      {/* Curtain reveal: the hero is position: sticky and pins at the top
          while the content block below (pulled up by -100dvh) slides over it.
          150dvh spacer = tight handoff: pieces exit over the first ~40vh,
          the About panel starts rising at 50vh and has covered the screen
          by 150vh — no long empty stretch in between. */}
      <div>
        <HeroSection7 />
        <div style={{ height: '150dvh' }} aria-hidden="true" />
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginTop: '-100dvh' }}>
        <AboutSection7 />
        <ServiceSection7 />
        <GameCaseStudySection />
        <TopFeatureSection />
        <TeamSection7 />
        <TestimonialSection7 />
        <CounterSection7 />
        <NewsSection7 />
      </div>
    </>
  );
}
