'use client';

export default function HeroSection7() {
  return (
    <div className="hero-section hero-7" style={{
      ['--bh-violet' as string]: '#705AFF',
      ['--bh-violet-soft' as string]: '#9A8CFF',
      ['--bh-cyan' as string]: '#00E7E1',
      ['--bh-ink' as string]: '#06060A',
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '100px',
    }}>
      {/* Video Background - FULL brightness */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'contrast(1.3) brightness(1.1)',
        }}
      >
        <source src="/assets/video/background_1.webm" type="video/webm" />
        <source src="/assets/video/background_1.mp4" type="video/mp4" />
      </video>

      {/* SVG Angled lines */}
      <svg style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        <defs>
          <linearGradient id="purpleCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--bh-violet)" stopOpacity="0.72" />
            <stop offset="100%" stopColor="var(--bh-cyan)" stopOpacity="0.52" />
          </linearGradient>
        </defs>

        {/* Frame lines */}
        <path d="M 0,150 L 0,0 L 200,0" stroke="url(#purpleCyan)" strokeWidth="3" fill="none" />
        <path d="M 100%,calc(100% - 150) L 100%,100% L calc(100% - 200),100%" stroke="url(#purpleCyan)" strokeWidth="3" fill="none" />

        {/* Angled accent lines */}
        <path d="M 0,200 L 400,0" stroke="url(#purpleCyan)" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M calc(100% - 400),0 L 100%,300" stroke="url(#purpleCyan)" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M 0,calc(100% - 250) L 300,100%" stroke="url(#purpleCyan)" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M calc(100% - 300),100% L 100%,calc(100% - 250)" stroke="url(#purpleCyan)" strokeWidth="2" fill="none" opacity="0.6" />
      </svg>

      {/* Controller image - BOTTOM LEFT */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        width: 'clamp(200px, 22vw, 350px)',
        zIndex: 3,
        filter: 'drop-shadow(0 20px 40px rgba(112, 90, 255, 0.48))',
      }}>
        <img
          src="https://picsum.photos/400/300?random=tech-device"
          alt="Tech Device"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
        {/* Purple glow behind controller */}
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-20%',
          width: '140%',
          height: '140%',
          background: 'radial-gradient(circle, rgba(112, 90, 255, 0.48) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: -1,
        }} />
      </div>

      {/* Person image - RIGHT SIDE (full height) */}
      <div className="hero-character" style={{
        position: 'absolute',
        right: 'clamp(-58px, -2vw, 8px)',
        bottom: 0,
        height: 'min(96vh, 780px)',
        width: 'clamp(420px, 45vw, 690px)',
        zIndex: 3,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <img
          src="/assets/img/landing-page/shape-2.png"
          alt="Professional"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            display: 'block',
            filter: 'drop-shadow(0 24px 34px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 34px rgba(112, 90, 255, 0.2))',
          }}
        />
        {/* Cyan glow behind person */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          right: '-8%',
          width: '110%',
          height: '46%',
          background: 'radial-gradient(circle, rgba(0, 231, 225, 0.34) 0%, transparent 70%)',
          filter: 'blur(70px)',
          zIndex: -1,
        }} />
      </div>

      {/* Main content - CENTER LEFT */}
      <div className="container" style={{ position: 'relative', zIndex: 4 }}>
        <div className="row">
          <div className="col-lg-7 col-md-10">
            {/* Small tagline */}
            <div className="hero-kicker" style={{
              fontSize: 'clamp(11px, 1.1vw, 13px)',
              fontWeight: 700,
              letterSpacing: 'clamp(3px, 0.4vw, 5px)',
              textTransform: 'uppercase',
              color: 'var(--bh-cyan)',
              marginBottom: 'clamp(20px, 3vh, 35px)',
              textShadow: '0 0 25px rgba(0, 231, 225, 0.82)',
            }}>
              WHERE DIGITAL WORLDS CONVERGE . .
            </div>

            {/* Main heading - 2 lines only */}
            <h1 className="hero-title" style={{
              fontSize: 'clamp(40px, 6.5vw, 90px)',
              fontWeight: 900,
              fontFamily: 'Orbitron, sans-serif',
              lineHeight: 1,
              marginBottom: 'clamp(25px, 4vh, 40px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              background: 'transparent',
              filter: 'none',
            }}>
              <span className="hero-title-accent" style={{
                display: 'block',
                background: 'linear-gradient(135deg, var(--bh-violet-soft) 0%, var(--bh-cyan) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontStyle: 'italic',
                transform: 'skewY(-1deg)',
                marginBottom: '0.1em',
              }}>
                DIGITAL FUTURE
              </span>
              <span className="hero-title-solid" style={{
                display: 'block',
                color: '#FFFFFF',
                textShadow: '0 0 50px rgba(255, 255, 255, 0.3)',
              }}>
                ECOSYSTEMS
              </span>
            </h1>

            {/* Single button */}
            <div className="hero-cta-wrap" style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              paddingLeft: 'clamp(48px, 15vw, 230px)',
              marginTop: 'clamp(18px, 4vh, 34px)',
            }}>
              <a
                href="/contact"
                className="hero-cta"
                style={{
                  background: 'var(--bh-violet)',
                  border: 'none',
                  padding: 'clamp(15px, 2vh, 19px) clamp(38px, 4.5vw, 55px)',
                  fontSize: 'clamp(13px, 1.3vw, 15px)',
                  fontWeight: 700,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  color: '#fff',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '15px',
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 10px 40px rgba(112, 90, 255, 0.58)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, var(--bh-violet-soft) 0%, var(--bh-violet) 100%)';
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(112, 90, 255, 0.78)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bh-violet)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(112, 90, 255, 0.58)';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>EXPLORE NOW</span>
                <span style={{ position: 'relative', zIndex: 1, fontSize: '22px', fontWeight: 900 }}>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile hide images */}
      <style jsx>{`
        @media (max-width: 991px) {
          .hero-character {
            display: none !important;
          }

          .hero-cta-wrap {
            padding-left: 0 !important;
          }

          .hero-title {
            background: transparent !important;
            background-image: none !important;
            filter: none !important;
            -webkit-text-fill-color: initial !important;
          }

          .hero-title-accent {
            background: linear-gradient(135deg, var(--bh-violet-soft) 0%, var(--bh-cyan) 100%) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
          }

          .hero-title-solid {
            background: transparent !important;
            -webkit-text-fill-color: #ffffff !important;
          }

          .hero-section {
            padding-top: 80px !important;
            min-height: 85vh !important;
          }
        }

        .hero-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.36) 45%, transparent 68%);
          transform: translateX(-120%) skewX(-18deg);
          transition: transform 0.45s ease;
        }

        .hero-cta:hover::before {
          transform: translateX(120%) skewX(-18deg);
        }

        .hero-cta:hover {
          color: #fff !important;
          text-shadow: 0 0 16px rgba(255, 255, 255, 0.72);
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 75vh !important;
          }
        }
      `}</style>
    </div>
  );
}
