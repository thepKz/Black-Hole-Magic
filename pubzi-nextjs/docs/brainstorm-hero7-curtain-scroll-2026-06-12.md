# Brainstorm: Hero7 Curtain Scroll Effect — 2026-06-12

## Problem
`src/app/home-7/page.tsx`: HeroSection7 must stay pinned on page load; scrolling makes all following sections slide UP over it (curtain reveal). All other sections behave as normal flow sections.

## Decisions (user-confirmed)
- Hero stays **static** while covered (no fade/scale/parallax exit)
- About glass overlap: **keep glass** — hero showing blurred through About's backdrop-filter is acceptable, adjust later if messy
- Pin duration: **until fully covered**, then hero releases (no permanent pin)

## Key codebase facts
- Hero root: `position: relative; minHeight: max(760px, 100dvh)` (`HeroSection7.tsx:167`)
- Fixed video bg is a **sibling** of hero div (before `heroRef` div), shared w/ About glass — pinning hero won't break it
- Video pause uses IntersectionObserver on hero + `.about-story` — tolerates curtain (hero leaves viewport after release)
- GSAP + ScrollTrigger already in use (ServiceSection7, AboutSection7) but NOT needed here
- Hero entrance anims run on mount via gsap context — unaffected by sticky

## Approaches evaluated

### A. CSS sticky curtain — CHOSEN
```
.hero-curtain   { /* wrapper */ height: calc(max(760px, 100dvh) + 100dvh); }
.hero-curtain > .hero-7 { position: sticky; top: 0; }  /* relative → sticky */
.curtain-content { position: relative; z-index: 1; margin-top: -100dvh; }
```
- Wrapper height = heroH + 100dvh; content pulled up by -100dvh → content travels one viewport over the stuck hero, then wrapper ends → hero releases naturally (already covered)
- Pros: zero JS, native scroll perf, no DOM mutation, no resize bookkeeping. KISS.
- Cons: calc math must mirror hero's `max(760px, 100dvh)`; screens <760px tall = hero taller than viewport (sticky still works, verify overlap distance)

### B. GSAP ScrollTrigger pin — rejected
`pin: true, pinSpacing: false, end: '+=100%'` — same visual, auto-measures hero height. Rejected: pin-spacer DOM mutation, position:fixed toggling, refresh/resize handling — all redundant vs 4 lines CSS. YAGNI. Keep as fallback if short-screen calc gets fiddly.

### C. position:fixed + spacer — rejected
Fragile, manual scroll sync, worst of both.

## Implementation notes
- Page restructure in `page.tsx`: wrap `<HeroSection7/>` in `.hero-curtain`, wrap remaining 8 sections in `.curtain-content`
- Hero `position: relative` → `sticky; top: 0` (internal absolute children unaffected — sticky is still a containing block)
- Content wrapper `position: relative; z-index: 1` is enough — later positioned sibling paints above sticky hero (z-index auto)
- Content wrapper should carry page background so opaque sections cover hero; About stays glass intentionally
- Use `100dvh` (not `vh`) to match hero's own unit — avoids mobile URL-bar mismatch
- Hero has `overflow: hidden` — fine, stays on hero itself

## Risks
1. <760px-tall screens: hero taller than viewport; test overlap distance, may need `calc(-1 * max(...))` margin instead of flat -100dvh
2. Video stays "visible" ~1 extra viewport (IO sees pinned hero) — harmless, About glass needs video anyway
3. If any future ancestor gets `transform`/`filter`, sibling fixed video breaks — unrelated to this change but note

## Success criteria
- Load: hero fills viewport, no layout shift
- Scroll: About slides over static hero; hero doesn't move until fully covered
- After cover: all sections scroll 100% normally
- No jank on scroll (no JS on scroll path), mobile + desktop
- Hero entrance animations still play on load

## Next steps
- Implement (single-file change in `page.tsx` + 1-line hero position change + ~10 lines CSS)
- Test at 1440p, 13" laptop, mobile, and a short window (<760px height)
