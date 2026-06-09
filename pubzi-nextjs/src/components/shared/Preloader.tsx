'use client';

import { useEffect, useState } from 'react';

export default function Preloader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoaded) return null;

  return (
    <div id="preloader" className="preloader">
      <div className="animation-preloader">
        <div className="spinner"></div>
        <div className="txt-loading">
          <span data-text-preloader="B" className="letters-loading">B</span>
          <span data-text-preloader="L" className="letters-loading">L</span>
          <span data-text-preloader="A" className="letters-loading">A</span>
          <span data-text-preloader="C" className="letters-loading">C</span>
          <span data-text-preloader="K" className="letters-loading">K</span>
          <span data-text-preloader=" " className="letters-loading"> </span>
          <span data-text-preloader="H" className="letters-loading">H</span>
          <span data-text-preloader="O" className="letters-loading">O</span>
          <span data-text-preloader="L" className="letters-loading">L</span>
          <span data-text-preloader="E" className="letters-loading">E</span>
        </div>
        <p className="text-center">Loading</p>
      </div>
      <div className="loader">
        <div className="row">
          <div className="col-3 loader-section section-left">
            <div className="bg"></div>
          </div>
          <div className="col-3 loader-section section-left">
            <div className="bg"></div>
          </div>
          <div className="col-3 loader-section section-right">
            <div className="bg"></div>
          </div>
          <div className="col-3 loader-section section-right">
            <div className="bg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
