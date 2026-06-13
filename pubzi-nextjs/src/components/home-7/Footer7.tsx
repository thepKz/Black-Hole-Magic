'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Helper: wrap words in spans
function Words(text: string) {
  return text.split(' ').map((w, i) => (
    <span key={i} className="sw">{w}{' '}</span>
  ))
}

export default function Footer7() {
  const footerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<{
    particles: Float32Array | null
    N: number
    C: { x: number; y: number }
    horizonR: number
    maxR: number
    horizonSprite: HTMLCanvasElement | null
    pull: number
    ignite: number
    feed: number
    pointer: { x: number; y: number; lastX: number; lastY: number; lastT: number }
    quickTos: Map<Element, { x: (v: number) => void; y: (v: number) => void }>
  }>({
    particles: null, N: 0, C: { x: 0, y: 0 }, horizonR: 0, maxR: 0,
    horizonSprite: null, pull: 0, ignite: 0.9, feed: 0,
    pointer: { x: 0, y: 0, lastX: 0, lastY: 0, lastT: 0 },
    quickTos: new Map()
  })

  useEffect(() => {
    const footer = footerRef.current
    const canvas = canvasRef.current
    if (!footer || !canvas) return

    // Early return for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if ((navigator as any).connection?.saveData === true) return

    const state = stateRef.current
    let ctx: CanvasRenderingContext2D | null = null
    let gsapCtx: gsap.Context | null = null
    let obsA: IntersectionObserver | null = null
    let obsB: IntersectionObserver | null = null
    let resizeObs: ResizeObserver | null = null
    let tickerFn: gsap.TickerCallback | null = null
    let lastT = 0
    let frameAvg: number[] = []
    let frame60Hz = true

    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const isTouch = window.matchMedia('(hover: none)').matches
    const isSmall = window.matchMedia('(max-width: 480px)').matches

    const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.75)

    function init() {
      try {
        if (!canvas) return
        ctx = canvas.getContext('2d', { alpha: false })
        if (!ctx) throw new Error('no 2d context')

        // Size canvas
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * DPR
        canvas.height = rect.height * DPR
        canvas.style.width = rect.width + 'px'
        canvas.style.height = rect.height + 'px'

        // Horizon center and radius
        state.C = { x: canvas.width * 0.5, y: canvas.height * 1.15 }
        state.horizonR = Math.min(Math.max(canvas.height * 0.16, 60), 110)
        state.maxR = Math.hypot(canvas.width, canvas.height) * 0.5

        // Particle count
        state.N = isSmall ? 180 : isMobile ? 300 : 900

        // Seed particles
        state.particles = new Float32Array(state.N * 7)
        for (let i = 0; i < state.N; i++) {
          const idx = i * 7
          state.particles[idx] = state.horizonR + Math.random() * (state.maxR - state.horizonR)
          state.particles[idx + 1] = Math.random() * Math.PI * 2
          state.particles[idx + 2] = Math.random()
          state.particles[idx + 3] = Math.random()
          state.particles[idx + 4] = 0
          state.particles[idx + 5] = 0
          state.particles[idx + 6] = Math.random()
        }

        // Pre-render horizon sprite
        const spriteCanvas = document.createElement('canvas')
        spriteCanvas.width = 512
        spriteCanvas.height = 512
        const spriteCtx = spriteCanvas.getContext('2d')
        if (spriteCtx) {
          const grad = spriteCtx.createRadialGradient(256, 256, 0, 256, 256, 256)
          grad.addColorStop(0, '#000000')
          grad.addColorStop(0.35, '#000000')
          grad.addColorStop(0.45, '#8b7ae8')
          grad.addColorStop(0.62, 'rgba(108,92,231,0.4)')
          grad.addColorStop(1, 'rgba(108,92,231,0)')
          spriteCtx.fillStyle = grad
          spriteCtx.fillRect(0, 0, 512, 512)
          state.horizonSprite = spriteCanvas
        }

        // GSAP context
        gsapCtx = gsap.context(() => {
          const proxy = { pull: 0, ignite: 0.9 }
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: footer,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.8,
              onUpdate: (self) => {
                state.pull = proxy.pull
                state.ignite = proxy.ignite
              }
            }
          })

          tl.to(proxy, { pull: 1, duration: 0.6, ease: 'none' }, 0)
            .to(proxy, { pull: 0.15, duration: 0.4, ease: 'none' }, 0.6)
            .to(proxy, { ignite: 1, duration: 1, ease: 'none' }, 0)

          // Lens filter scrub
          if (!isMobile && !isTouch) {
            const filter = footer.querySelector('#bhf-lens feDisplacementMap')
            if (filter) {
              tl.fromTo(filter, { attr: { scale: 14 } }, { attr: { scale: 0 }, ease: 'none' }, 0)
            }
          }

          // Content capture vectors
          const onRefresh = () => {
            const pulls = footer.querySelectorAll('[data-bhf-pull]')
            pulls.forEach((el, i) => {
              const rect = el.getBoundingClientRect()
              const cx = rect.left + rect.width * 0.5
              const cy = rect.top + rect.height * 0.5
              const canvasRect = canvas.getBoundingClientRect()
              const targetX = canvasRect.left + state.C.x / DPR
              const targetY = canvasRect.top + state.C.y / DPR
              const dx = targetX - cx
              const dy = targetY - cy
              const len = Math.hypot(dx, dy)
              const vx = len > 0 ? dx / len : 0
              const vy = len > 0 ? dy / len : 0

              gsap.fromTo(el,
                { x: vx * 28, y: 48 + vy * 18, autoAlpha: 0.35 },
                { x: 0, y: 0, autoAlpha: 1, ease: 'none', delay: i * 0.06 }
              )
            })
          }

          ScrollTrigger.create({
            trigger: footer,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.8,
            onRefresh
          })

          // Word light-up
          const words = footer.querySelectorAll('.bhf-desc .sw')
          if (words.length) {
            gsap.fromTo(words,
              { opacity: 0.14 },
              {
                opacity: 1,
                stagger: 0.055,
                ease: 'none',
                scrollTrigger: {
                  trigger: footer,
                  start: 'top 92%',
                  end: 'top 55%',
                  scrub: 0.6
                }
              }
            )
          }

          // Magnetic links
          gsap.matchMedia().add('(hover: hover) and (pointer: fine)', () => {
            const inner = footer.querySelector('.bhf-inner')
            if (!inner) return

            const handleMove = (e: PointerEvent) => {
              // Update pointer state for sim
              const canvasRect = canvas.getBoundingClientRect()
              state.pointer.x = (e.clientX - canvasRect.left) * DPR
              state.pointer.y = (e.clientY - canvasRect.top) * DPR

              // Compute speed for feed
              const now = Date.now()
              const dt = Math.max(1, now - state.pointer.lastT)
              const dx = e.clientX - state.pointer.lastX
              const dy = e.clientY - state.pointer.lastY
              const speed = Math.hypot(dx, dy) / (dt / 1000)
              state.feed = Math.min(1, speed / 2500)
              state.pointer.lastX = e.clientX
              state.pointer.lastY = e.clientY
              state.pointer.lastT = now

              // Magnetic displacement
              const targets = inner.querySelectorAll<HTMLElement>('.bhf-link, .bhf-soc')
              targets.forEach((el) => {
                const rect = el.getBoundingClientRect()
                const cx = rect.left + rect.width * 0.5
                const cy = rect.top + rect.height * 0.5
                const dx = e.clientX - cx
                const dy = e.clientY - cy
                const dist = Math.hypot(dx, dy)

                if (dist < 80) {
                  if (!state.quickTos.has(el)) {
                    state.quickTos.set(el, {
                      x: gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' }),
                      y: gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
                    })
                  }
                  const qt = state.quickTos.get(el)!
                  const pull = Math.min(6, (dx / dist) * 0.25 * 80)
                  const pullY = Math.min(6, (dy / dist) * 0.25 * 80)
                  qt.x(pull)
                  qt.y(pullY)
                }
              })
            }

            const handleLeave = () => {
              state.quickTos.forEach((qt) => {
                qt.x(0)
                qt.y(0)
              })
            }

            inner.addEventListener('pointermove', handleMove, { passive: true })
            inner.addEventListener('pointerleave', handleLeave)

            return () => {
              inner.removeEventListener('pointermove', handleMove)
              inner.removeEventListener('pointerleave', handleLeave)
            }
          })

          // Social icon burst
          gsap.matchMedia().add('(hover: hover) and (pointer: fine)', () => {
            const socials = footer.querySelectorAll('.bhf-soc')
            socials.forEach((soc) => {
              soc.addEventListener('pointerenter', (e) => {
                if (!state.particles) return
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                const canvasRect = canvas.getBoundingClientRect()
                const cx = (rect.left + rect.width * 0.5 - canvasRect.left) * DPR
                const cy = (rect.top + rect.height * 0.5 - canvasRect.top) * DPR
                const dx = cx - state.C.x
                const dy = cy - state.C.y
                const r = Math.hypot(dx, dy)
                const theta = Math.atan2(dy, dx)

                for (let i = 0; i < 12; i++) {
                  const idx = (Math.floor(Math.random() * state.N)) * 7
                  state.particles[idx] = r + (Math.random() - 0.5) * 30
                  state.particles[idx + 1] = theta + (Math.random() - 0.5) * 0.4
                }
              }, { passive: true })
            })
          })
        }, footer)

        // Ticker
        tickerFn = () => {
          if (!ctx || !state.particles) return

          const now = performance.now()
          let dt = lastT > 0 ? Math.min((now - lastT) / 1000, 0.05) : 0.016
          lastT = now

          // Adaptive governor
          frameAvg.push(dt * 1000)
          if (frameAvg.length > 60) frameAvg.shift()
          const avg = frameAvg.reduce((a, b) => a + b, 0) / frameAvg.length
          if (avg > 12 && state.N > 400) {
            state.N = Math.max(400, state.N - 100)
          } else if (avg > 24 && isMobile) {
            frame60Hz = false
          }

          // 30fps mobile throttle
          if (!frame60Hz && Math.floor(now / 16.67) % 2 !== 0) {
            // integrate dt but skip render
            dt *= 2
          }

          // Decay feed
          state.feed *= Math.exp(-1.8 * dt)

          const k1 = 0.8
          const k2 = 45

          // Physics
          for (let i = 0; i < state.N; i++) {
            const idx = i * 7
            let r = state.particles[idx]
            let theta = state.particles[idx + 1]
            const omegaSeed = state.particles[idx + 2]

            const omega = (0.5 + omegaSeed) * k1 * Math.pow(r, -1.45)
            const dr = -(k2 + 2.2 * state.pull * k2 + 1.5 * state.feed * k2) * (1 / Math.max(r, state.horizonR)) * dt

            theta += omega * dt * (1 + 1.4 * state.pull + 0.6 * state.feed)
            r += dr

            // Pointer well
            if (!isMobile && !isTouch) {
              const wellR = 140 + 80 * state.feed
              const dx = state.pointer.x - (state.C.x + r * Math.cos(theta))
              const dy = state.pointer.y - (state.C.y + r * Math.sin(theta))
              const dist = Math.hypot(dx, dy)
              if (dist < wellR) {
                const strength = Math.pow(1 - dist / wellR, 2)
                const vx = (dx / dist) * strength * 80 * dt
                const vy = (dy / dist) * strength * 80 * dt
                const x = state.C.x + r * Math.cos(theta) + vx
                const y = state.C.y + r * Math.sin(theta) + vy
                const newDx = x - state.C.x
                const newDy = y - state.C.y
                r = Math.hypot(newDx, newDy)
                theta = Math.atan2(newDy, newDx)
              }
            }

            // Respawn
            if (r < state.horizonR * 1.02) {
              r = state.maxR * (0.75 + Math.random() * 0.5)
              theta = Math.random() * Math.PI * 2
            }

            state.particles[idx] = r
            state.particles[idx + 1] = theta
          }

          // Render
          ctx.globalCompositeOperation = 'source-over'
          ctx.fillStyle = 'rgba(8,6,20,0.26)'
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Bucket particles by radius
          const outer: number[] = []
          const mid: number[] = []
          const inner: number[] = []

          for (let i = 0; i < state.N; i++) {
            const idx = i * 7
            const r = state.particles[idx]
            const theta = state.particles[idx + 1]
            const x = state.C.x + r * Math.cos(theta)
            const y = state.C.y + r * Math.sin(theta)

            state.particles[idx + 4] = x
            state.particles[idx + 5] = y

            const ratio = r / state.maxR
            if (ratio > 0.6) outer.push(i)
            else if (ratio > 0.3) mid.push(i)
            else inner.push(i)
          }

          ctx.globalCompositeOperation = 'lighter'

          // Outer band
          ctx.strokeStyle = 'rgba(216,216,224,0.18)'
          ctx.lineWidth = 1
          ctx.beginPath()
          outer.forEach((i) => {
            const idx = i * 7
            const prevX = state.particles[idx + 4]
            const prevY = state.particles[idx + 5]
            const x = state.C.x + state.particles[idx] * Math.cos(state.particles[idx + 1])
            const y = state.C.y + state.particles[idx] * Math.sin(state.particles[idx + 1])
            if (prevX !== 0 || prevY !== 0) {
              ctx.moveTo(prevX, prevY)
              ctx.lineTo(x, y)
            }
          })
          ctx.stroke()

          // Mid band
          ctx.strokeStyle = 'rgba(108,92,231,0.45)'
          ctx.lineWidth = 1.25
          ctx.beginPath()
          mid.forEach((i) => {
            const idx = i * 7
            const prevX = state.particles[idx + 4]
            const prevY = state.particles[idx + 5]
            const x = state.C.x + state.particles[idx] * Math.cos(state.particles[idx + 1])
            const y = state.C.y + state.particles[idx] * Math.sin(state.particles[idx + 1])
            if (prevX !== 0 || prevY !== 0) {
              ctx.moveTo(prevX, prevY)
              ctx.lineTo(x, y)
            }
          })
          ctx.stroke()

          // Inner band
          ctx.strokeStyle = 'rgba(139,122,232,0.85)'
          ctx.lineWidth = 1.6
          ctx.beginPath()
          inner.forEach((i) => {
            const idx = i * 7
            const prevX = state.particles[idx + 4]
            const prevY = state.particles[idx + 5]
            const x = state.C.x + state.particles[idx] * Math.cos(state.particles[idx + 1])
            const y = state.C.y + state.particles[idx] * Math.sin(state.particles[idx + 1])
            if (prevX !== 0 || prevY !== 0) {
              ctx.moveTo(prevX, prevY)
              ctx.lineTo(x, y)
            }
          })
          ctx.stroke()

          // Horizon sprite
          if (state.horizonSprite) {
            ctx.globalCompositeOperation = 'source-over'
            const scale = state.ignite
            const feedFlicker = state.feed > 0.15 ? 0.25 * state.feed : 0
            const alpha = Math.min(1, (state.ignite - 0.9) / 0.1 * 0.75 + 0.25 + feedFlicker)
            ctx.globalAlpha = alpha
            ctx.drawImage(
              state.horizonSprite,
              state.C.x - 256 * scale,
              state.C.y - 256 * scale,
              512 * scale,
              512 * scale
            )
            ctx.globalAlpha = 1
          }
        }

        // Resize observer
        resizeObs = new ResizeObserver(() => {
          setTimeout(() => {
            if (!canvas || !ctx) return
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width * DPR
            canvas.height = rect.height * DPR
            canvas.style.width = rect.width + 'px'
            canvas.style.height = rect.height + 'px'
            state.C = { x: canvas.width * 0.5, y: canvas.height * 1.15 }
            state.horizonR = Math.min(Math.max(canvas.height * 0.16, 60), 110)
            state.maxR = Math.hypot(canvas.width, canvas.height) * 0.5
            ctx.fillStyle = '#080614'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }, 200)
        })
        resizeObs.observe(canvas)

      } catch (err) {
        console.error('Footer init error:', err)
        footer.classList.add('bhf-nogl')
      }
    }

    // Lazy arm
    obsA = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          obsA?.disconnect()
          if (window.requestIdleCallback) {
            requestIdleCallback(() => init())
          } else {
            setTimeout(init, 1)
          }
        }
      },
      { rootMargin: '150% 0px' }
    )
    obsA.observe(footer)

    // Sleep observer
    obsB = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (tickerFn) gsap.ticker.add(tickerFn)
        } else {
          if (tickerFn) gsap.ticker.remove(tickerFn)
        }
      },
      { threshold: 0, rootMargin: '200px 0px' }
    )
    obsB.observe(footer)

    // Visibility change
    const handleVisibility = () => {
      if (document.hidden) {
        if (tickerFn) gsap.ticker.remove(tickerFn)
      } else {
        if (tickerFn) gsap.ticker.add(tickerFn)
        lastT = 0
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Cleanup
    return () => {
      gsapCtx?.revert()
      if (tickerFn) gsap.ticker.remove(tickerFn)
      obsA?.disconnect()
      obsB?.disconnect()
      resizeObs?.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      state.quickTos.clear()
    }
  }, [])

  return (
    <footer ref={footerRef} className="bhf-footer">
      <div className="bhf-stage" aria-hidden="true">
        <canvas className="bhf-canvas" ref={canvasRef} />
        <div className="bhf-still" />
      </div>
      <div className="bhf-scrim" aria-hidden="true" />
      <div className="bhf-inner">
        <div className="bhf-grid">
          <div className="bhf-col bhf-brand" data-bhf-pull>
            <Link href="/" className="bhf-lens">
              <Image src="/assets/img/logo/white-logo-3.svg" alt="Black Hole Logo" width={150} height={50} />
            </Link>
            <p className="bhf-desc">
              {Words('Black Hole unifies game publishing, fintech payments, digital platforms, and B2B tech solutions into one powerful ecosystem for global growth.')}
            </p>
          </div>
          <nav className="bhf-col" data-bhf-pull aria-label="Ecosystem">
            <h5 className="bhf-h">Ecosystem</h5>
            <ul className="bhf-links">
              <li><Link href="/game-publishing" className="bhf-link">Game Publishing</Link></li>
              <li><Link href="/fintech" className="bhf-link">Fintech Payment</Link></li>
              <li><Link href="/platform" className="bhf-link">Digital Platform</Link></li>
              <li><Link href="/b2b-tech" className="bhf-link">B2B Tech Solutions</Link></li>
            </ul>
          </nav>
          <nav className="bhf-col" data-bhf-pull aria-label="Company">
            <h5 className="bhf-h">Company</h5>
            <ul className="bhf-links">
              <li><Link href="/about" className="bhf-link">About Us</Link></li>
              <li><Link href="/partnerships" className="bhf-link">Partnerships</Link></li>
              <li><Link href="/community" className="bhf-link">Community</Link></li>
              <li><Link href="/contact" className="bhf-link">Contact</Link></li>
            </ul>
          </nav>
          <nav className="bhf-col" data-bhf-pull aria-label="Resources">
            <h5 className="bhf-h">Resources</h5>
            <ul className="bhf-links">
              <li><Link href="/documentation" className="bhf-link">Documentation</Link></li>
              <li><Link href="/api" className="bhf-link">API Reference</Link></li>
              <li><Link href="/support" className="bhf-link">Support Center</Link></li>
              <li><Link href="/legal" className="bhf-link">Legal & Privacy</Link></li>
            </ul>
          </nav>
        </div>
        <div className="bhf-bottom" data-bhf-pull>
          <p className="bhf-copy">© 2025 Black Hole. All Rights Reserved.</p>
          <div className="bhf-social">
            <a href="#" className="bhf-soc" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="bhf-soc" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" className="bhf-soc" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
            <a href="#" className="bhf-soc" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <svg width="0" height="0" className="bhf-defs" aria-hidden="true">
        <defs>
          <filter id="bhf-lens">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="1" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="0"/>
          </filter>
        </defs>
      </svg>
      <style jsx global>{`
        .bhf-footer {
          position: relative;
          z-index: 9;
          overflow: hidden;
          isolation: isolate;
          background: #080614 !important;
        }
        .bhf-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(180deg, #0A0A0C 0%, rgba(8,6,20,0) 100%);
          pointer-events: none;
          z-index: 1;
        }
        .bhf-footer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 1520px;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(139,122,232,0.55) 50%, transparent 100%);
          box-shadow: 0 0 18px rgba(139,122,232,0.4);
          pointer-events: none;
          z-index: 1;
        }
        .bhf-stage {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .bhf-canvas {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
        }
        .bhf-still {
          display: none;
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 120%, rgba(108,92,231,0.20), rgba(139,122,232,0.06) 40%, transparent 65%);
        }
        @media (prefers-reduced-motion: reduce) {
          .bhf-still { display: block; }
        }
        .bhf-nogl .bhf-still { display: block; }
        .bhf-nogl .bhf-canvas { display: none; }
        .bhf-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(8,6,20,0) 0%, rgba(8,6,20,0.35) 55%, rgba(8,6,20,0) 100%);
        }
        .bhf-inner {
          position: relative;
          z-index: 2;
          max-width: 1520px;
          margin: 0 auto;
          padding: 110px 24px 0;
        }
        .bhf-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 48px;
        }
        @media (max-width: 991px) {
          .bhf-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .bhf-grid { grid-template-columns: 1fr; gap: 36px; }
          .bhf-inner { padding: 80px 20px 0; }
        }
        .bhf-col { display: flex; flex-direction: column; gap: 18px; }
        .bhf-lens {
          display: inline-block;
          filter: url(#bhf-lens);
        }
        @media (max-width: 767px), (hover: none) {
          .bhf-lens { filter: none; }
        }
        .bhf-h {
          color: #8b7ae8 !important;
          text-shadow: none !important;
          font-family: 'Chakra Petch', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin: 0;
        }
        .bhf-desc, .bhf-copy {
          color: #D8D8E0;
          text-transform: none;
          font-size: 15px;
          line-height: 1.7;
          margin: 0;
        }
        .bhf-desc .sw {
          opacity: 0.14;
        }
        .bhf-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .bhf-link {
          color: rgba(216,216,224,0.78) !important;
          text-transform: none;
          font-size: 14px;
          text-decoration: none;
          position: relative;
          display: inline-block;
          background: linear-gradient(90deg, #8b7ae8, #8b7ae8) no-repeat left bottom;
          background-size: 0% 1px;
          transition: background-size 0.3s ease;
          will-change: transform;
        }
        .bhf-link:hover,
        .bhf-link:focus-visible {
          color: #8b7ae8 !important;
          background-size: 100% 1px;
        }
        .bhf-link:focus-visible {
          outline: 2px solid #8b7ae8;
          outline-offset: 3px;
        }
        .bhf-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 0 34px;
          border-top: 1px solid rgba(139,122,232,0.18);
          margin-top: 48px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .bhf-social {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .bhf-soc {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid;
          color: rgba(139,122,232,0.35);
          text-decoration: none;
          transition: color 0.3s ease, border-color 0.3s ease;
          will-change: transform;
        }
        .bhf-soc i {
          color: #D8D8E0 !important;
          transition: color 0.3s ease;
        }
        .bhf-soc:hover,
        .bhf-soc:focus-visible {
          color: rgba(139,122,232,0.8);
        }
        .bhf-soc:hover i,
        .bhf-soc:focus-visible i {
          color: #fff !important;
        }
        .bhf-soc:focus-visible {
          outline: 2px solid #8b7ae8;
          outline-offset: 3px;
        }
        .bhf-defs {
          position: absolute;
          width: 0;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </footer>
  )
}

