'use client';

export default function HeroSection7() {
  return (
    <div className="hero-section hero-7" style={{
      ['--bh-purple' as string]: '#6C5CE7',
      ['--bh-ink' as string]: '#06060A',
      position: 'relative',
      minHeight: '110vh',
      overflow: 'visible',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '100px',
      paddingBottom: '0',
      marginBottom: '-10vh',
    }}>
      {/* Video Background */}
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
          filter: 'contrast(1.2) brightness(0.85)',
        }}
      >
        <source src="/assets/video/background_1_pingpong.webm" type="video/webm" />
        <source src="/assets/video/background_1_pingpong.mp4" type="video/mp4" />
      </video>

      {/* Simple frame lines - purple only */}
      <svg style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        <path d="M 0,150 L 0,0 L 200,0" stroke="var(--bh-purple)" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M 100%,calc(100% - 150) L 100%,100% L calc(100% - 200),100%" stroke="var(--bh-purple)" strokeWidth="2" fill="none" opacity="0.6" />
      </svg>

      {/* Controller image - BOTTOM LEFT */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        width: 'clamp(200px, 22vw, 350px)',
        zIndex: 3,
        filter: 'drop-shadow(0 20px 40px rgba(108, 92, 231, 0.5))',
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
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-20%',
          width: '140%',
          height: '140%',
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: -1,
        }} />
      </div>

      {/* Person image - RIGHT SIDE */}
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
            filter: 'drop-shadow(0 24px 34px rgba(0, 0, 0, 0.6))',
          }}
        />
      </div>

      {/* Main content */}
      <div className="container" style={{ position: 'relative', zIndex: 4 }}>
        <div className="row">
          <div className="col-lg-7 col-md-10">
            {/* Small tagline */}
            <div style={{
              fontSize: 'clamp(11px, 1.1vw, 13px)',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--bh-purple)',
              marginBottom: 'clamp(20px, 3vh, 35px)',
            }}>
              Digital Gaming Platform
            </div>

            {/* Main heading - clean, no effects */}
            <h1 style={{
              fontSize: 'clamp(40px, 6.5vw, 90px)',
              fontWeight: 900,
              fontFamily: 'Orbitron, sans-serif',
              lineHeight: 1.1,
              marginBottom: 'clamp(25px, 4vh, 40px)',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}>
              <span style={{
                display: 'block',
                color: 'var(--bh-purple)',
              }}>
                BLACK HOLE GAME
              </span>

            </h1>

            {/* Single button */}
            <div style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              paddingLeft: 'clamp(320px, 50vw, 80px)',
              marginTop: 'clamp(30px, 4vh, 45px)',
            }}>
              <a
                href="/contact"
                className="hero-cta"
                style={{
                  background: '#5546D4',
                  border: '2px solid #7C6EF2',
                  padding: 'clamp(16px, 2vh, 20px) clamp(40px, 4.5vw, 60px)',
                  fontSize: 'clamp(13px, 1.3vw, 15px)',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#fff',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(92, 70, 228, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#6C5CE7';
                  e.currentTarget.style.borderColor = '#9A8CFF';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(108, 92, 231, 0.6), inset 0 -2px 8px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#5546D4';
                  e.currentTarget.style.borderColor = '#7C6EF2';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(92, 70, 228, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.2)';
                }}
              >
                <span>EXPLORE NOW</span>
                <span style={{ fontSize: '20px' }}>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style jsx>{`
        @media (max-width: 991px) {
          .hero-character {
            display: none !important;
          }

          .hero-section {
            padding-top: 80px !important;
            min-height: 100vh !important;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 100vh !important;
          }
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 15vh;
          background: linear-gradient(to bottom, transparent 0%, var(--bh-ink) 100%);
          pointer-events: none;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
