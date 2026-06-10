import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const fadeUp = (selector: string) => {
  gsap.from(selector, {
    y: 100,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
    },
  });
};

export const fadeIn = (selector: string) => {
  gsap.from(selector, {
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
    },
  });
};

export const splitTextReveal = (selector: string) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    const split = new SplitText(el, { type: 'chars' });
    gsap.from(split.chars, {
      opacity: 0,
      y: 50,
      stagger: 0.02,
      duration: 0.8,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
    });
  });
};

export const initScrollAnimations = () => {
  fadeUp('.fade-up');
  fadeIn('.fade-in');
  splitTextReveal('.split-text');
};
