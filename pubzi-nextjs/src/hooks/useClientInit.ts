'use client';

import { useEffect } from 'react';
import { initJQueryPlugins } from '@/lib/jquery-init';
import { initGSAPAnimations } from '@/lib/gsap-init';

export function useClientInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cleanup: (() => void) | undefined;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript('/assets/js/jquery-3.7.1.min.js');
        await loadScript('/assets/js/jquery.meanmenu.min.js');
        await loadScript('/assets/js/jquery.nice-select.min.js');
        await loadScript('/assets/js/jquery.magnific-popup.min.js');
        await loadScript('/assets/js/jquery.counterup.min.js');
        await loadScript('/assets/js/jquery.waypoints.js');
        await loadScript('/assets/js/parallaxie.js');
        await loadScript('/assets/js/wow.min.js');

        initJQueryPlugins();
        const smoother = initGSAPAnimations();

        cleanup = () => {
          if (smoother) smoother.kill();
        };
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadScripts();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);
}
