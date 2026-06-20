---
status: pending
date: 2026-06-20
owner: thepKz
---

# Plan — /game 3D companion: page-coordinate model + bigger + cosmic tumble + hero GSAP

## Context

The 3D warrior on `/game` was built as a GLOBAL `position:fixed` overlay (`GlobalCompanion.tsx`, mounted in root `layout.tsx`). Three problems surfaced in use:

1. **"Đi theo scroll"** — being `fixed`, it stands still mid-screen while the page scrolls, so it floats *over every section* on every route. User does not want that.
2. **Too small** (600px box still reads small).
3. Rotation is single-axis (only spins around vertical); user wants free **multi-axis tumble** "like an object in space."
4. The `/game` hero (section 1) feels static; user wants GSAP motion.

**User's mental model (the key reframe):** *"the page is a road; drop it and it stays there. At 1,1 throw it to 30,30 (section 3); scroll down to 100,100 (section 10) and it's still at 30,30; scroll back up and it's right there."*

→ This is **document/page coordinates** (`position:absolute` within the page), NOT viewport `fixed`. Dropped where released *in the page*; scrolling moves past it naturally.

**Outcome:** the companion lives ONLY on `/game`, positioned in page coordinates inside `.gm-root`, much bigger, tumbling gently on 3 axes; plus the hero gets entry GSAP + drifting starfield.

### Confirmed decisions (2 rounds of Q&A)
- **Scope:** ONLY `/game` (remove the global mount). Sword model stays `3d_9.glb`.
- **Positioning:** `position:absolute` relative to `.gm-root` → page coordinates. Drag/throw/drop-and-stay within the page. Scrolling does not drag it over other sections.
- **Size:** big — fills/overflows the portal ring (~`min(86vh, 820px)` desktop, ~420px mobile).
- **Rotation:** gentle 3-axis tumble + bob.
- **Hero GSAP:** (a) title/subtitle/buttons stagger in on load (smoother), (b) drifting stars/particles in the hero background.

### Verified codebase facts
- **Lenis is OFF on `/game`** — `SmoothScroll.tsx:28` `if (pathname?.startsWith('/game')) return`. `/game` uses **native scroll**. Lenis elsewhere eases native scroll, no body transform (`SmoothScroll.tsx:19-21`). → `position:absolute` scrolls correctly with no per-frame JS; **drop the Lenis `stop()/start()` integration entirely**.
- `.gm-hero` is a normal 2-col layout, **no pin/sticky** → page coords are simple.
- `.gm-root` has **`position:relative; overflow:hidden`** (`game/page.tsx:747-748`) — it is the containing block for the absolute companion. `overflow:hidden` clips anything beyond the page box, so **clamp Y to `.gm-root` scroll height** and clamp X to its width.
- `.gm-portal-shell` (`game/page.tsx:496`, currently halo-rings-only after the earlier dedupe) sits in the **right column** of the hero. Companion home = centre of that shell, not screen centre.
- `.gm-root` gets/loses class `gm-pending`; hero entry GSAP lives in the `gsap.context` at `game/page.tsx:285+`; reduced-motion path early-returns at `:262-265`.
- Preloader is per-route; not relevant once the companion is local to `/game` (it can simply fade in when the model loads).

---

## Approach

### File changes
1. **`src/app/layout.tsx`** — remove `import GlobalCompanion` + the `<GlobalCompanion />` mount. (Reverts the global mount.)
2. **`src/components/shared/GlobalCompanion.tsx`** → **rename to `src/components/game/GameCompanion3D.tsx`** (correct home; it is no longer global). Rewrite positioning from `fixed`/viewport to `absolute`/page coords. Keep the three.js scene, dispose, reduced-motion fallback, drag-with-pointer-capture, idle bob, visibilitychange pause. Remove: Lenis stop/start, preloader-gating, route-recenter, the global module guard's cross-route role (a simple mounted guard is still fine).
3. **`src/app/game/page.tsx`** — mount `<GameCompanion3D />` inside `.gm-portal-shell` (or as a direct child of `.gm-root`; see Positioning); extend the hero entry GSAP; add a `.gm-hero-stars` particle layer + its loop.

### Positioning model (the core change)
Companion is `position:absolute` inside `.gm-root` (the relative, page-tall container). Its `top/left` are **page coordinates** (px from the top/left of `.gm-root`), so it scrolls with the page for free.

- **Home** = centre of `.gm-portal-shell` in page coords:
  `rect = shell.getBoundingClientRect(); homeX = rect.left + scrollX - rootRect.left + rect.w/2 - box/2; homeY = rect.top + scrollY - rootRect.top + rect.h/2 - box/2` (convert viewport rect → page coords relative to `.gm-root`). Measure after layout settles (rAF after mount + the page's `gm-pending` removal).
- **Drag:** pointer events on the grip with `setPointerCapture`. On `pointermove`, add the **viewport delta** (`clientX/Y` diff) directly to `pos` — because `/game` is native scroll and the page doesn't move during a normal drag, viewport delta == page delta. Set `el.style.left/top = pos.x/y + 'px'` (absolute page coords). (If we keep `translate3d`, base it on page-coord `pos`; either works — prefer `left/top` for clarity since there's no per-frame transform needed.)
- **Drop:** stays put (no inertia — confirmed earlier). Resume idle bob around the dropped anchor.
- **Clamp:** X ∈ `[EDGE_PAD, rootWidth - box - EDGE_PAD]`; Y ∈ `[EDGE_PAD, rootScrollHeight - box - EDGE_PAD]`. Recompute on resize and when `.gm-root` height changes (catalog filter changes height) via `ResizeObserver` on `.gm-root`.
- **No `fixed`, no scrollY math in RAF** — absolute + native scroll handles scroll. RAF only does idle bob (on `pos.y` anchor) + renders three.js.

> Containing-block note: `.gm-root` is `position:relative` so `absolute` resolves against it. The companion must be a DOM child of `.gm-root`. Mounting it as a child of `.gm-portal-shell` would clip it to the hero; instead mount it as a **direct child of `.gm-root`** (sibling of the sections) so it can be dropped anywhere down the page. Home still measured from `.gm-portal-shell`.

### Size (#2)
- Box `min(86vh, 820px)` desktop, `min(70vh, 420px)` mobile (still capped to viewport min-dimension). Square.
- Camera bounding-sphere fit (already implemented) with `MARGIN ≈ 1.02` so the warrior nearly fills the box; `3d_9.glb`; sword stays framed (constant aspect).

### Rotation (#4) — gentle 3-axis tumble
In the RAF, replace single-axis spin with:
```
modelGroup.rotation.y = phase * 0.18;
modelGroup.rotation.x = Math.sin(phase * 0.32) * 0.25;
modelGroup.rotation.z = Math.sin(phase * 0.22) * 0.18;
```
Slow, de-synced per axis → floating-in-space tumble, not dizzying. Box still bobs vertically (`IDLE_BOB`).

### Hero GSAP (#2)
- **Entry**: in the existing `gsap.context` (`game/page.tsx:285+`), add/strengthen a stagger reveal for `.gm-hero-copy > *` (title, sub, facts, actions) — `fromTo({autoAlpha:0, y:28}, {autoAlpha:1, y:0, stagger:0.08, ease:'power3.out'})`. Respect the existing reduced-motion early-return (`:262`) so it only runs with motion.
- **Stars**: add `<div className="gm-hero-stars" aria-hidden="true">` with ~24 small dots inside `.gm-hero`; CSS `position:absolute; inset:0; pointer-events:none; z-index` below copy. GSAP loop: each dot drifts slowly + opacity twinkles (`repeat:-1, yoyo`), mirroring the particle idea in `Preloader.tsx:190-218`. Seed positions by index (no `Math.random` needed; or use it — this is client-only, fine). Kill in `ctx.revert()`.

---

## Edge cases
| Case | Handling |
|------|----------|
| Scroll down past the drop point | Companion is absolute in page → naturally scrolls out of view; reappears in place on scroll up. No code needed. |
| `.gm-root overflow:hidden` clipping | Clamp Y to `rootScrollHeight - box`; X to `rootWidth - box`. |
| Catalog filter changes page height | `ResizeObserver` on `.gm-root` → re-clamp; if not yet grabbed, re-measure home. |
| Drag while page mid-scroll | Native scroll doesn't move during a pointer drag with capture; viewport delta == page delta. Safe. |
| Mobile native scroll vs drag | `touch-action:none` ONLY on the grip; touches elsewhere scroll the page normally. |
| Reduced motion | Static fallback image centred in portal, non-interactive, no WebGL (keep existing path). |
| WebGL context loss | Existing `webglcontextlost` → fallback image. |
| Tab hidden | Existing `visibilitychange` → pause RAF. |
| Leaving /game | Component unmounts with the page → existing full dispose runs. No global persistence needed now. |
| Box too big on short viewport | Size uses `vh` cap + min-dimension cap; clamp keeps it on-page. |
| Home overlaps hero copy | Home = portal-shell centre (right column), not screen centre → clears the left-aligned copy. |

## Out of scope (YAGNI)
- Inertia/throw physics (user chose drop-and-stay).
- Cross-route persistence / global presence (now /game-only).
- Auto-scroll when dragging to screen edge.
- Keyboard drag / a11y interaction (decorative, `aria-hidden`).

---

## Task breakdown
1. **Unmount global**: edit `layout.tsx` (remove import + `<GlobalCompanion />`).
2. **Rename + relocate**: move `GlobalCompanion.tsx` → `components/game/GameCompanion3D.tsx`; update component name.
3. **Rewrite positioning**: `fixed`→`absolute` page coords; home from `.gm-portal-shell` in page coords; clamp to `.gm-root` width/scrollHeight; drag sets `left/top`; drop-and-stay; remove Lenis + preloader-gating + route-recenter.
4. **Size up**: box `min(86vh,820px)` / `min(70vh,420px)`; `MARGIN≈1.02`.
5. **3-axis tumble** in RAF.
6. **Mount in `/game`**: `<GameCompanion3D />` as direct child of `.gm-root`.
7. **Hero GSAP**: strengthen `.gm-hero-copy` entry stagger; add `.gm-hero-stars` layer + drift/twinkle loop; kill on revert.
8. **ResizeObserver on `.gm-root`** for height changes (filter) → re-clamp.
9. **Type-check + verify** (below).

## Verification
- `/game`: warrior is large (fills/overflows portal), tumbles gently on 3 axes + bobs. Grab → throw toward a lower section → release → it stays there in the page; scroll down further → it scrolls out of view (does NOT hover over other sections); scroll back → it's exactly where dropped. ✓
- Hero title/sub/buttons stagger in on load; stars drift/twinkle in the background. ✓
- Other routes (`/about`, `/news`, …): **no companion at all**. ✓
- Mobile `/game`: drag the warrior works; scrolling elsewhere on the page works (touch-action only on grip). Reduced-motion: static image in portal.
- Change catalog filter (page height changes): companion clamps back into the page, not stuck off-screen.
- `npx tsc --noEmit` clean; dev server `/game` returns 200 with no build/runtime errors; React Profiler shows no commits during drag (refs, not state).
