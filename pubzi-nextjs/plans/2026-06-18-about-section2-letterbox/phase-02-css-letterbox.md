# Phase 02 — Letterbox CSS, responsive, reduced-motion

**File:** `src/app/about/page.tsx` (CSS-in-JS `<style jsx global>`)
**Goal:** Style letterbox frame + overlaid lowercase lines + purple highlights; handle mobile + reduced-motion.

## Step 2.1 — Replace desktop manifesto CSS (lines 610-657)

Current block 610-657 covers `.ab2-manifesto`, `.ab2-manifesto-mark`, `.ab2-manifesto-copy`, `.ab2-manifesto p`, `.ab2-manifesto-note`, `.ab2-word`. Replace that whole range with:

```css
.ab2-manifesto {
  min-height: 100dvh;
  padding-top: clamp(100px, 13vh, 168px);
  padding-bottom: clamp(86px, 11vh, 140px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(22px, 3vw, 38px);
}

.ab2-manifesto-mark {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  color: var(--ab2-accent-strong);
  font-family: var(--font-subtitle-krafting, Arial, sans-serif);
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: 0.04em;
}

/* Stage = the film frame; copy is absolutely overlaid on top of it. */
.ab2-manifesto-stage {
  position: relative;
  width: min(100%, 1180px);
}

.ab2-letterbox {
  position: relative;
  width: 100%;
  aspect-ratio: 2.39 / 1;       /* cinematic letterbox */
  overflow: hidden;
  border-radius: var(--ab2-radius);
  border: 1px solid var(--ab2-line);
  background: #05040a;
  box-shadow: 0 36px 120px rgba(0, 0, 0, 0.46);
}

.ab2-letterbox-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  filter: contrast(1.22) brightness(0.82) saturate(1.24);
}

/* Darkens video so overlaid text stays legible; stronger at bottom-left. */
.ab2-letterbox-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(105deg, rgba(7, 5, 15, 0.86) 0%, rgba(7, 5, 15, 0.42) 46%, rgba(7, 5, 15, 0.2) 72%),
    linear-gradient(0deg, rgba(7, 5, 15, 0.62), rgba(7, 5, 15, 0.08) 60%);
}

/* Manifesto sentence overlaid on the frame, lowercase, line-by-line. */
.ab2-manifesto-copy {
  position: absolute;
  left: clamp(20px, 4vw, 56px);
  bottom: clamp(22px, 5vh, 56px);
  right: clamp(20px, 4vw, 56px);
  margin: 0;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.ab2-line {
  display: block;
  color: #fff;
  font-family: var(--font-title-extra, Arial, sans-serif);
  font-size: clamp(2.1rem, 5.2vw, 4.4rem);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: 0;
  text-wrap: balance;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.74), 0 0 48px rgba(0, 0, 0, 0.4);
  will-change: opacity, transform, filter;
}

/* Purple accent on key phrases. */
.ab2-hl {
  background: linear-gradient(120deg, var(--ab2-accent), var(--ab2-accent-strong));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  /* fallback if text-fill unsupported: keep readable */
  text-shadow: none;
}

.ab2-manifesto-note {
  display: block;
  max-width: 58ch;
  color: rgba(255, 255, 255, 0.74);
  font-size: 1rem;
  line-height: 1.8;
}
```

Notes:
- `.ab2-word` rule is GONE (replaced by `.ab2-line`). Phase 03 retargets GSAP accordingly.
- `-webkit-text-fill-color:transparent` + `background-clip:text` = gradient text. Fallback handled by leaving `color:transparent` last; supported in all target browsers.
- Mark now uses a leading "—" from JSX text; optional: add a `::before` rule line if a drawn rule is wanted (skip — KISS).

## Step 2.2 — Mobile overrides (within `@media (max-width:767px)`, near lines 1180-1207)

The existing mobile block sets `.ab2-manifesto` grid + `.ab2-manifesto p` font-size. Remove the now-invalid `.ab2-manifesto p { font-size; max-width }` (line ~1186-1189) and `gap`/grid leftovers that reference the old 2-col layout. Add:

```css
.ab2-manifesto {
  padding-top: 74px;
  padding-bottom: 64px;
  gap: 20px;
}

.ab2-letterbox {
  /* taller frame on phones so 4 big lines fit without overflow */
  aspect-ratio: 4 / 5;
}

.ab2-manifesto-copy {
  left: 18px;
  right: 18px;
  bottom: 20px;
}

.ab2-manifesto-mark {
  font-size: 0.95rem;
}
```

(Keep existing `.ab2-manifesto-note` font-size override at line ~1204-1207 — still valid.)

## Step 2.3 — Reduced-motion (within `@media (prefers-reduced-motion: reduce)`, lines 1296-1300)

Existing block resets `.ab2-word`. Replace `.ab2-word` selector there with `.ab2-line`:

```css
.ab2-line {
  opacity: 1 !important;
  filter: none !important;
  transform: none !important;
}
```

Video pause under reduced-motion already handled by the play/pause `useEffect` (line 136-137) — letterbox video inherits it via `.ab2-motion-video` class.

## Acceptance (phase)

- [ ] No `.ab2-word` selector remains in CSS.
- [ ] `.ab2-letterbox` renders 2.39:1 desktop / 4:5 mobile.
- [ ] Lines lowercase, overlaid bottom-left, legible over scrim.
- [ ] `.ab2-hl` shows purple gradient text.

## Watch-outs

- Removing old `.ab2-manifesto p` rules: confirm no other `.ab2-manifesto p` dependency. (Note copy is now `<p class="ab2-manifesto-copy">`, not bare `p` — old `.ab2-manifesto p` selector at line 634 must be deleted to avoid stale 4.65rem font fighting `.ab2-line`.)
- Verify gradient-text fallback: if a line is fully wrapped in `.ab2-hl` it must still read on dark — our lines mix plain + highlight, safe.
