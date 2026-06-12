# Brainstorm: Smooth Transition Between HeroSection7 ↔ AboutSection7

**Date:** 2026-06-12
**Status:** ✅ Implemented + verified (Chromium 1440×900, scroll sweep)
**Files:** `pubzi-nextjs/src/components/home-7/AboutSection7.tsx`, `pubzi-nextjs/src/components/home-7/HeroSection7.tsx`, `pubzi-nextjs/src/app/home-7/page.tsx`

## Implementation Discovery (important)

Curtain reveal was DEAD in production — the hard seam was a plain scroll cut, not a curtain-edge problem. Killed by global override CSS:

1. `force-brand-colors.css:154` — `.hero-section { position: relative !important }` defeated inline sticky → hero never pinned.
2. `force-brand-colors.css:329` — `section { background-color: ... !important }` painted About section opaque black → glass blurred black instead of video.
3. `force-brand-colors.css:158-167` — kills all `[class*="hero"]::before/::after` → hero ink fade (and character glow pseudos) never rendered.
4. `page.tsx` content block was missing the `-100dvh` pull-up its own comment describes.

Fixes applied (scoped, global CSS untouched):
- HeroSection7: `position: sticky !important` on `.hero-section.hero-7`; deleted dead `::after` ink-fade block.
- AboutSection7: `background: transparent !important` on `.about-story` (story mode); `!important` on stacked-mode `#0a0718` bg; mask feather on `.about-sticky`.
- page.tsx: `marginTop: '-100dvh'` on content block.

Verified: mask + backdrop-filter compose correctly in Chromium (blur ramps smoothly); hero visible through frosted curtain edge; no hard line at any scroll position; 3D model clear of fade zone at 900px viewport. Outstanding: eyeball Safari/Firefox once.

## Problem

Hard horizontal seam where About glass panel slides over pinned hero (curtain reveal). Seam = 2 stacked hard edges:

1. **Tint edge** — `.about-sticky` background gradient starts abruptly at panel top (`AboutSection7.tsx` ~L300).
2. **Blur edge** — `backdrop-filter: blur(14px)` boundary cuts visible line over vivid black-hole video.

Plus hero's own `.hero-section::after` 120px fade-to-ink (`HeroSection7.tsx` L804–814) permanently darkens hero bottom, fighting the curtain.

## Constraints (user-confirmed)

- Keep curtain mechanism (sticky hero + 100dvh spacer + sliding panel) — works, don't restructure.
- Desktop story mode only concern; stacked mode (mobile / reduced-motion) uses solid `#0a0718` bg, no glass.

## Evaluated Approaches

### Smoothness direction
| Option | Verdict |
|---|---|
| **Feathered seam** | ✅ CHOSEN — CSS-only, low risk |
| Hero recedes (GSAP scroll-scrub depth) | Rejected — more code, motion not the ask |
| Both combined | Rejected — YAGNI for now, can layer later |
| Themed event-horizon wipe | Rejected — highest effort, scope creep |

### Feather technique (blur edge is the hard part)
| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Mask whole panel** (`mask-image` gradient on `.about-sticky`) | 1-line CSS, feathers tint+blur together, perfect melt | Top ~200px shows raw un-blurred video during pinned story; needs browser check (mask + backdrop-filter composition) | ✅ CHOSEN |
| Tint ramp above blur (`::before` gradient ramp, blur line lands on pre-darkened area) | Zero risk, zero GPU cost | Blur line softened, not eliminated | Fallback #1 |
| Masked edge strip (separate element, own masked backdrop-filter) | True blur ramp 0→14px | +1 backdrop-filter layer on already-heavy page (video + WebGL + glass) | Fallback #2 |

## Final Solution

On `.about-sticky` (desktop story-mode media query only):

```css
-webkit-mask-image: linear-gradient(to bottom, transparent 0, black 200px);
mask-image: linear-gradient(to bottom, transparent 0, black 200px);
```

Plus cleanup:
- **Remove or heavily soften** `.hero-section::after` fade-to-ink — redundant once curtain edge feathers; currently darkens hero permanently (visible dark band in screenshot).
- Tune fade height 160–240px against the 3D model track (`top: 11vh`) — model canvas top enters the fade zone on short viewports; verify model sphere (centered in 78vh track) stays clear of it.

## Risks / Verification

1. **mask + backdrop-filter composition** — verify in Chrome + Safari + Firefox that mask actually feathers the backdrop blur (historic Chromium quirks). If broken anywhere → fallback to tint-ramp option.
2. **Raw video strip at viewport top** during the 500vh pinned story — by design (video is the brand backdrop), but eyeball it; if distracting, shrink fade to ~140px or switch to masked-edge-strip.
3. **3D model clipping into fade** on short/landscape viewports — check ~700px height viewports.
4. Stacked mode (mobile/reduced-motion) must stay untouched — mask only inside `@media (min-width: 768px) and (prefers-reduced-motion: no-preference)`.

## Success Criteria

- No visible horizontal line at curtain edge at any scroll position (check scroll positions: curtain entering, half-covered, fully pinned).
- No new GPU layers; Lighthouse/devtools FPS unchanged.
- Mobile + reduced-motion render identical to before.

## Next Steps

1. Implement mask on `.about-sticky` (story-mode media query).
2. Remove/soften hero `::after` ink fade.
3. Cross-browser + short-viewport verification.
