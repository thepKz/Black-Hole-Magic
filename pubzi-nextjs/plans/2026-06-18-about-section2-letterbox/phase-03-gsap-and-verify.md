# Phase 03 — GSAP retarget + verification

**File:** `src/app/about/page.tsx`
**Goal:** Reveal lines on scroll; verify nothing in section 1 changed.

## Step 3.1 — Retarget reveal tween (lines 180-196)

Current tween animates `.ab2-word` (stagger per word). Change selector to `.ab2-line` and adjust stagger for fewer, larger units. Replace [page.tsx:180-196](../../src/app/about/page.tsx#L180-L196) with:

```tsx
gsap.fromTo(
  '.ab2-line',
  { opacity: 0, y: 28, filter: 'blur(10px)' },
  {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    stagger: 0.18,
    ease: 'none',
    scrollTrigger: {
      trigger: '.ab2-manifesto',
      start: 'top 70%',
      end: 'top 22%',
      scrub: 0.7,
    },
  }
);
```

Notes:
- Was `opacity: 0.16` start (words stayed faintly visible). Lines start at `0` for a cleaner subtitle wipe-in — they sit over video, so fully-hidden→in reads better.
- `stagger 0.18` (vs 0.035) — 4 lines, slower cadence = cinematic.
- Trigger unchanged (`.ab2-manifesto`); only selector + values differ.

## Step 3.2 — Confirm no stray `.ab2-word`

```
grep -n "ab2-word" src/app/about/page.tsx   # expect: ZERO hits after edits
```

If any remain → leftover; remove/convert.

## Step 3.3 — Build + lint

```
npm run build      # must pass clean (TS + Next build)
```

Fix any type error on `MANIFESTO_LINES` (ensure `React.ReactNode[]` annotation present).

## Step 3.4 — Browser verification (REQUIRED — per memory: verify in real browser, not on paper)

Run dev server, open `http://localhost:3000/about`. Check:

1. **Bug fixed:** sentence reads "chúng tôi đưa game quốc tế vào nhịp sống của người chơi Việt." WITH spaces. Resize narrow → still spaced, no glued words.
2. **Lowercase** confirmed.
3. **Letterbox:** film frame visible, portal video MOVING inside it, text overlaid and readable.
4. **Highlights:** "game quốc tế" + "người chơi Việt" purple gradient.
5. **Scroll reveal:** lines wipe in one-by-one as section enters.
6. **Section 1 UNCHANGED:** scroll the hero portal→video zoom; must look identical to before. This is the hard constraint — verify explicitly.
7. **Mobile:** DevTools ≤767px — frame 4:5, text fits, video plays.
8. **Reduced-motion:** toggle OS setting / emulate — text fully visible, video paused.

## Acceptance (phase)

- [ ] `grep ab2-word` → 0 hits.
- [ ] `npm run build` clean.
- [ ] All 8 browser checks pass.
- [ ] Section 1 visually identical (most important).

## Rollback

Single-file change. `git checkout src/app/about/page.tsx` reverts everything if needed.
