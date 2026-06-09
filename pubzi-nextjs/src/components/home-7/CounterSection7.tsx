'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay: string;
}

const counterData: CounterItem[] = [
  {
    value: 200,
    suffix: '+',
    label: 'years on the market',
    delay: '.2s',
  },
  {
    value: 95,
    suffix: '+',
    label: 'highly skilled specialists',
    delay: '.4s',
  },
  {
    value: 1.2,
    suffix: 'k+',
    label: 'games completed',
    delay: '.6s',
  },
  {
    value: 3.5,
    suffix: 'k+',
    label: 'clients recommend us',
    delay: '.8s',
  },
];

const CounterSection7 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="gt-counter-section-3 fix bg-cover"
      style={{ backgroundImage: "url('/assets/img/home-3/counter-bg.jpg')" }}
    >
      <div className="container">
        <div className="row g-4">
          {counterData.map((item, index) => (
            <div
              key={index}
              className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay={item.delay}
            >
              <div className="gt-counter-box-3">
                <div className="gt-content">
                  <h2>
                    {item.prefix && <span>{item.prefix}</span>}
                    <Counter
                      end={item.value}
                      duration={2000}
                      isVisible={isVisible}
                    />
                    {item.suffix && <span>{item.suffix}</span>}
                  </h2>
                  <p>{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface CounterProps {
  end: number;
  duration: number;
  isVisible: boolean;
}

const Counter = ({ end, duration, isVisible }: CounterProps) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    hasAnimated.current = true;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = startValue + (end - startValue) * easeOutQuart;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  // Format the number to handle decimals
  const formattedCount = end % 1 !== 0 ? count.toFixed(1) : Math.floor(count);

  return <span className="gt-count">{formattedCount}</span>;
};

export default CounterSection7;
