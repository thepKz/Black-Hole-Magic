# Implementation Roadmap - Home-7 Remaining Tasks

**Session**: 2026-06-13  
**Completed**: Hero scroll choreography, blur frost fix, Vietnamese font  
**Remaining**: 4 tasks (Footer > Testimonials > Mobile Perf > 3D/Seams)

---

## TASK 1: Footer Animation — EVENT HORIZON Particle Vortex ⭐⭐⭐⭐⭐

**Priority**: CRITICAL (signature showpiece, client wants "craziest footer animation never seen")  
**File**: `src/components/home-7/Footer7.tsx` (REWRITE completely, 128→~650 lines)  
**Spec source**: `/tmp/footer-spec.json` → `.finalSpec` field (95 lines)

### Summary
Replace generic template footer with a 2D canvas particle accretion vortex:
- 900 particles (desktop) orbiting toward a black-hole singularity at bottom center
- GSAP scrubbed "gravity surge" — content pulled toward singularity, locks at scroll-bottom
- Magnetic links react to pointer with unified field (one handler drives canvas + DOM)
- GRAFTED "feeds on motion" — fast mouse flicks deepen the well + photon-ring flicker
- Lazy init (IntersectionObserver), sleeps offscreen, 30fps mobile governor
- CSS warfare: `!important` rules to beat `force-brand-colors.css`

### Key Technical Specs
- **State**: `Float32Array(N*7)` — `[r, theta, omegaSeed, hueSeed, prevX, prevY, sizeSeed]`
- **Physics**: Keplerian falloff `omega ∝ r^-1.45`, `dr` with `pull` (scrubbed 0→1) + `feed` (velocity-derived, decays)
- **Render**: 3 batched canvas strokes (outer/mid/inner color bands), `gco='lighter'` additive, pre-rendered horizonSprite
- **GSAP timeline**: scrubbed across `trigger: footer, start: 'top bottom', end: 'bottom bottom'`
  - Phase 1: `pull` proxy 0→1 (first 60%), then →0.15 (stable orbit)
  - Phase 2: `[data-bhf-pull]` elements drift toward C via computed vectors, stagger 0.06
  - Phase 3: `.bhf-desc .sw` word light-up (opacity 0.14→1, stagger 0.055) — house pattern
- **Magnetic links**: `gsap.quickTo` x/y per link, displacement = vectorToCursor*0.25 when <80px
- **Seam**: `::before` gradient dissolves `News(#0A0A0C) → footer(#080614)`, `::after` purple hairline
- **Mobile/reduced-motion**: static CSS radial nebula, no canvas/GSAP

### DOM Structure (bhf-* classes avoid force-brand substring traps)
```tsx
<footer className="bhf-footer">
  <div className="bhf-stage"><canvas className="bhf-canvas" /><div className="bhf-still" /></div>
  <div className="bhf-scrim" />
  <div className="bhf-inner">
    <div className="bhf-grid"> {/* 4 cols: brand + 3 nav */}
      <div className="bhf-col bhf-brand" data-bhf-pull>
        <a className="bhf-lens"><Image logo /></a>
        <p className="bhf-desc">{Words(description)}</p>
      </div>
      <nav className="bhf-col" data-bhf-pull>...</nav> {/* Ecosystem/Company/Resources */}
    </div>
    <div className="bhf-bottom" data-bhf-pull">
      <p className="bhf-copy">© 2025 Black Hole...</p>
      <div className="bhf-social">{4x <a className="bhf-soc">social icons</a>}</div>
    </div>
  </div>
  <svg className="bhf-defs"><filter id="bhf-lens">feTurbulence + feDisplacementMap</filter></svg>
</footer>
```

### Content to Keep
- Logo: `white-logo-3.svg` 150x50
- Description: current paragraph (wrap words in `<span className="sw">` via local `Words()` helper)
- Links: Ecosystem (4), Company (4), Resources (4) — keep verbatim
- Socials: 4 icons (facebook-f, twitter, linkedin-in, instagram) with `fa-brands` classes
- Copyright: "© 2025 Black Hole. All Rights Reserved."

### Critical Implementation Notes
1. **Render both layout paths**: `src/app/home-7/layout.tsx:17` AND `src/app/(home-2)/layout.tsx:27`
2. **CSS !important cascade**: `.bhf-footer { background:#080614 !important }` beats global footer rule; `.bhf-link { color:... !important }` beats cyan link force; never use `.theme-btn` (infinite purple pulse)
3. **Lifecycle guards**: init in `requestIdleCallback`, Observer A (150% margin) fires init, Observer B (0 threshold) gates ticker
4. **Feed graft**: `pointermove` computes `speed = hypot(dx,dy) / dt`; `feed` approaches `min(1, speed/2500)`, decays `*= exp(-1.8*dt)`; horizon alpha += `0.25*feed`
5. **Particle respawn**: when `r < horizonR*1.02` → `r = maxR*(0.75 + rand*0.5)`, random `theta`
6. **DPR cap**: 1.75 desktop, 1.0 mobile; 30fps accumulator on mobile (skip render every other frame, still integrate dt)

### Validation
- Canvas renders particles in 3 color bands (white→purple→inner glow)
- Scroll to footer: content drifts toward bottom-center singularity, locks at scroll-floor
- Mouse move: nearby particles bend toward cursor, fast flick = deeper well + ring flare
- Mobile: static radial gradient nebula, no canvas
- Build: 0 TypeScript errors, 0 hydration warnings

---

## TASK 2: Testimonials Redesign — Dark Luxe ⭐⭐⭐⭐

**Priority**: HIGH (client wants "đỉnh hơn" / far better)  
**File**: `src/components/home-7/TestimonialSection7.tsx` (REDESIGN, 342→~550 lines)  
**Spec source**: workflow output `.result.testimonialSpec.spec` (extract from `/private/tmp/.../wfq2rqma0.output`)

### Summary
Redesign testimonials section applying Dark Luxe craft (controlled light, material darkness, filmic motion) while keeping brand purple (#6C5CE7/#8b7ae8) and existing 3 Vietnamese quotes (NDA-anonymous authors intentional).

### Key Design Direction (from spec)
- One **cinematic featured quote** with mask/text reveal (larger, hero treatment)
- **Staggered stack** or **orbit/constellation layout** tying into black-hole motif
- **Signal strip** of partner metrics (optional enhancement)
- **Magnetic hover** on cards (not generic scale-105)
- Vietnamese text uses **Chakra Petch** headlines (never Orbitron on Vietnamese)
- Avoid: equal cards, generic carousel, AI-slop patterns

### Current Content (KEEP)
```tsx
FEATURED = {
  quote: 'Blackhole Game hiểu người chơi Việt hơn bất kỳ đối tác nào...',
  name: 'Giám đốc Phát hành',
  org: 'Studio quốc tế · NDA',
  initials: 'GP'
}
QUOTES = [
  { quote: 'Quy trình bản địa hóa...', name: 'Trưởng dự án', org: 'NPH Hàn Quốc', initials: 'TD' },
  { quote: 'Một đội ngũ nói chuyện bằng số liệu...', name: 'Quản lý đầu tư', org: 'Quỹ game khu vực', initials: 'QD' }
]
```

### Technical Requirements
- **styled-jsx global** (like neighbors) — no external CSS, keep `.tsm-*` prefix or new dark-luxe prefix
- **GSAP ScrollTrigger** entrances consistent with page motion (word scrub, stagger clip reveals)
- **Words() helper** for `.sw` word-span text reveals (house pattern, opacity 0.14→1)
- **Mobile collapse**: single column <1199px, clean reading order
- **prefers-reduced-motion**: skip all GSAP, content SSRs visible (fromTo pattern)

### Layout Constraints
- Section background: `#080614` (declared, but force-brand-colors.css forces `#0A0A0C` — address with `!important` or accept)
- z-index: 9 (mid-page band convention)
- Must not reuse generic class names that collide with global `.sw` (4 other sections already use it scoped)

### Dark Luxe Craft Checklist (from design-system)
- ✅ Material darkness: near-black with stepped surfaces, luminous hairlines
- ✅ Controlled light: one focal highlight per card, no neon gamer glow
- ✅ Typography: elegant sans (Chakra Petch), tight hierarchy, optically corrected on dark
- ✅ Motion: slow fades, mask reveals, weighted hover (not playful/sci-fi)
- ❌ Avoid: glass cards floating, generic dashboard modules, purple AI fog

### Spec Extraction Task
**ACTION REQUIRED**: Extract `testimonialSpec.spec` from workflow output JSON — it's inside the 31k-token file at `/private/tmp/.../wfq2rqma0.output` under `.result.testimonialSpec.spec`. Use `jq` or grep to pull it:
```bash
cat /private/tmp/claude-501/.../wfq2rqma0.output | jq -r '.result.testimonialSpec.spec' > /tmp/testimonial-spec.md
```

---

## TASK 3: Mobile Performance Optimization (Sections 1-2) ⭐⭐⭐⭐

**Priority**: HIGH (mobile traffic majority, current lag reported)  
**Files**: `HeroSection7.tsx`, `AboutSection7.tsx`, global CSS  
**Spec source**: Survey risks (from workflow `.result.surveys[*].risks`)

### Current Performance Issues (from survey)
1. **Hero (section 1)**:
   - Fixed video decode + GSAP scrub on mobile (no width gate, only reduced-motion)
   - Heavy drop-shadows on `.hero-title-stars` text with `will-change: clip-path, transform` (wasted layers)
   - Perpetual idle animations (phone float, character float) — unnecessary on mobile

2. **About (section 2)**:
   - 44MB GLB model boots on <768px despite static fallback existing
   - Word-scrub ScrollTriggers run on mobile (only reduced-motion gates)
   - `backdrop-filter: blur()` on glass panel (GPU melter, already noted as removed but verify)
   - Permanent `will-change` on cards/elements

### Optimization Checklist

#### Hero (HeroSection7.tsx)
- ✅ Already done: videos `display:none` <768px, gradient backdrop
- ✅ Already done: mobile matchMedia skips scrub timeline
- **TODO**: Remove stale `will-change` from `.hero-title-block` if not actually animated in mobile mode
- **TODO**: Verify idle float animation gated by `(min-width: 992px)` matchMedia

#### About (AboutSection7.tsx)
- **TODO**: Gate GLB init by `(min-width: 768px)` — the `shouldInit` lazy observer already exists, add width check before `setShouldInit(true)`
- **TODO**: Show static fallback <768px: existing `ellipse.png` + CSS glow (currently hidden), no canvas mount
- **TODO**: Audit `will-change` — cards at line 211, track at 329 — clear on mobile or remove entirely (dirty-flag rendering already optimizes)

#### Global CSS
- **TODO**: `gsap-animations.css:196-198` — universal `* { transition: color/bg/border 0.3s }` reflows everything; consider scoping or removing
- **TODO**: Infinite animations running offscreen:
  - `.hero-cta` purple-pulse + border-spin (hero file) — OK, hero-local
  - `borderAnim` on section-title h6 pseudos (main.css) — runs in News section, consider pausing offscreen
  - `.gt-theme-btn` purple-pulse (all buttons) — global, runs everywhere

#### Video Management
- **TODO**: Verify frost video never decodes <768px (check the visibility effect's mobile bail-out)

### Mobile-Specific Fallbacks
- Hero: gradient backdrop (already done)
- About: static image + glow (needs CSS tweak to show ellipse.png when canvas is skipped)
- Testimonials: single-column stack (ensure new design handles this)
- Footer: static nebula (spec already includes this)

### Performance Budget (mobile)
- **Target**: 60fps scroll in hero/about on mid-tier Android (Snapdragon 6xx series)
- **Hero**: <5ms/frame (scrub is gated, videos hidden, no heavy work)
- **About**: <3ms/frame when visible (GLB skipped, word-scrub may run but is cheap)
- **Validation**: Test on throttled CPU in Chrome DevTools (4x slowdown), check ScrollTrigger onUpdate flamegraph

---

## TASK 4: 3D Accents + Section Seams ⭐⭐ (OPTIONAL / LOW PRIORITY)

**Priority**: LOW (nice-to-have, "cho vui", NO SPEC due to agent failure)  
**Status**: ⚠️ **DESIGN NEEDED** — workflow agent hit rate limit, no spec exists  
**Assets**: 4 unused GLB files (18MB, 21MB, 36MB, 44MB) at `public/assets/img/home-7/3d/`

### Client Brief
- "mấy section sau gắn thêm 3d chuyển động vậy cho vui" — add MOVING 3D to later sections for fun
- "các section cần kết nối với nhau hợp lý" — sections must flow/connect logically
- "hong ổn thì vứt 3D ra" — if not good, throw 3D out (permission to skip)

### Constraints
- Mobile is already laggy (sections 1-2) — adding 3D will worsen unless heavily gated
- AboutSection7 already uses one 44MB model — pattern exists, but large file sizes
- No spec = no implementation detail — would need to design from scratch

### Recommended Approach
**DEFER or SKIP** this task because:
1. No spec (design agent failed)
2. Perf risk on mobile (already addressing lag in Task 3)
3. Client said "cho vui" (for fun) — not critical
4. 3 other tasks are higher ROI

**Alternative**: If time permits after Tasks 1-3, create a minimal spec:
- Reusable `<Floating3D>` component (props: glbPath, size, idle motion type)
- 2-3 placements max (candidates: ServiceSection7, NewsSection7)
- Desktop-only `(min-width: 992px)`, lazy init, sleep offscreen
- Section seams: unify backgrounds to one dark ramp (#080614 → #0A0A0C), add gradient bridges

---

## Implementation Order & Token Budget

| Task | Priority | Est. Time | Est. Tokens | Files |
|------|----------|-----------|-------------|-------|
| 1. Footer | ⭐⭐⭐⭐⭐ | 30 min | ~15k | Footer7.tsx (rewrite) |
| 2. Testimonials | ⭐⭐⭐⭐ | 20 min | ~12k | TestimonialSection7.tsx (redesign) |
| 3. Mobile Perf | ⭐⭐⭐⭐ | 15 min | ~8k | Hero/About (edits), CSS audit |
| 4. 3D/Seams | ⭐⭐ | SKIP | — | (no spec, defer) |
| **TOTAL** | | **65 min** | **~35k** | **3 tasks** |

**Remaining budget**: 71k tokens → spend 35k → **36k buffer** for fixes/verification

---

## Validation Checklist (after all tasks)

### Build
- [ ] `npm run build` — 0 errors
- [ ] `npx tsc --noEmit` — 0 TypeScript errors
- [ ] No hydration warnings in console

### Visual (run dev server, manual check)
- [ ] Hero: phone zooms centered, title blooms in, fades out by About panel rise
- [ ] Footer: particles orbit toward singularity, content drifts on scroll, magnetic links
- [ ] Testimonials: dark-luxe aesthetic, Vietnamese text renders with diacritics
- [ ] Mobile <768px: hero gradient (no video), about static (no 3D), smooth 60fps scroll

### Cross-browser (if time)
- [ ] Chrome/Edge (primary)
- [ ] Safari (WebKit video codec, filter syntax)
- [ ] Firefox (GSAP ScrollTrigger, canvas compositing)

---

## Next Steps

1. **Extract testimonial spec**: `jq -r '.result.testimonialSpec.spec' < /private/tmp/.../wfq2rqma0.output > /tmp/testimonial-spec.md`
2. **Implement in order**: Footer → Testimonials → Mobile Perf
3. **Skip 3D/Seams** (no spec, low priority, perf risk)
4. **Verify build + visual** (checklist above)
5. **Document any deferred work** for future sessions
