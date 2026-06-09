import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

export function initGSAPAnimations() {
  if (typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  // GSAP Scroll Animations
  const smoother = ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  });

  // Text Animations
  const splitTextElements = document.querySelectorAll('.split-text');
  splitTextElements.forEach((element) => {
    const split = new SplitText(element, { type: 'chars, words' });
    gsap.from(split.chars, {
      duration: 0.8,
      opacity: 0,
      y: 50,
      stagger: 0.02,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
      },
    });
  });

  // Fade Up Animations
  gsap.utils.toArray('.fade-up').forEach((element: any) => {
    gsap.from(element, {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
      },
    });
  });

  // Fade In Animations
  gsap.utils.toArray('.fade-in').forEach((element: any) => {
    gsap.from(element, {
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
      },
    });
  });

  return smoother;
}
