---
title: "Redesign /about Section 2 — Letterbox Portal manifesto"
description: "Replace the broken manifesto section with a cinematic letterbox-portal layout, fixing word-spacing bug and adding line-based scroll reveal over an embedded portal video."
status: pending
priority: P2
effort: 3h
branch: main
tags: [frontend, bugfix, refactor]
created: 2026-06-18
---

# Redesign /about Section 2 — Letterbox Portal

## Overview

Rebuild `.ab2-manifesto` in `src/app/about/page.tsx` into a cinematic "letterbox portal": a 2.39:1 film frame holding its own portal video, with the manifesto sentence (lowercase, line-by-line scroll reveal) laid over it and two purple-highlighted phrases. Simultaneously fix the word-dinh bug (`display:inline-block` eating `{' '}`).

Single file. Single section. Hard constraint: **do not touch** the hero (section 1), the fixed background video, or `.ab2-content` stacking context.

## Context (self-contained)

**Bug root cause:** `Words` component ([page.tsx:112-122](../../src/app/about/page.tsx#L112-L122)) wraps each word in `<span class="ab2-word">` styled `display:inline-block` (line 654). Inline-block collapses the trailing `{' '}` whitespace → words render glued ("CHÚNGTÔIĐƯA"). Uppercase + Extrafett font amplifies it.

**Reusable assets already in file:**
- `PortalVideoSources` ([page.tsx:103-110](../../src/app/about/page.tsx#L103-L110)) — emits webm+mp4 `<source>` for `background_1_pingpong`. **Reuse as-is** for the letterbox `<video>` (DRY).
- Video play/pause `useEffect` ([page.tsx:127-155](../../src/app/about/page.tsx#L127-L155)) selects `.ab2-motion-video` and handles IntersectionObserver + reduced-motion pause. **Adding the letterbox video with class `ab2-motion-video` auto-wires it** — zero new video-lifecycle JS.
- GSAP word tween ([page.tsx:180-196](../../src/app/about/page.tsx#L180-L196)) targets `.ab2-word`. Retarget to `.ab2-line`.

**Current manifesto JSX:** lines 320-330. **CSS:** `.ab2-manifesto*` 610-657; mobile `@media (max-width:767px)` 1180-1207; reduced-motion 1296-1300.

**Layering fact (why embedded video, not hole-punch):** `.ab2-content` has `isolation:isolate` + opaque gradient bg (line 562-566) → the page's `fixed` video (z-index 1) cannot show through it. Embedding a second `<video>` inside the frame sidesteps this entirely. Browser caches the file → no extra bandwidth.

## Tech approach

| Decision | Choice | Why |
|---|---|---|
| Video source | 2nd `<video class="ab2-motion-video">` reusing `PortalVideoSources` | No stacking-context risk; auto-wired to existing play/pause; DRY |
| Reveal unit | Per-LINE (`.ab2-line`), not per-word | Fixes whitespace bug + cleaner cinematic cadence |
| Case | lowercase (drop `text-transform`) | Brand sections all lowercase; Extrafett reads softer |
| Highlight | wrap "game quốc tế" / "người chơi Việt" in `.ab2-hl` | gradient text via `--ab2-accent` |
| Readability | scrim gradient inside frame + text-shadow on lines | text legible over moving video |
| Element type | raw `<video>` (mirror `ab2-fixed-video`) | no new Next.js surface; this file already uses raw video |

## Phases

- [phase-01-fix-words-and-jsx.md](phase-01-fix-words-and-jsx.md) — Replace `Words` (line-split), rewrite manifesto JSX with letterbox + video + highlights.
- [phase-02-css-letterbox.md](phase-02-css-letterbox.md) — Letterbox/scrim/line/highlight CSS + responsive + reduced-motion.
- [phase-03-gsap-and-verify.md](phase-03-gsap-and-verify.md) — Retarget GSAP reveal to `.ab2-line`; verify in browser; confirm section 1 untouched.

## Affected files

| File | Action | Change |
|---|---|---|
| `src/app/about/page.tsx` | modify | `Words`→line-split; manifesto JSX; manifesto CSS; GSAP `.ab2-word`→`.ab2-line` |

No new files. No deletions. No other files touched.

## Hard constraints (do NOT violate)

1. No edits to `.ab2-hero`, `.ab2-hero-sticky`, `.ab2-portal*`, `.ab2-portal-frame` JSX/CSS/GSAP.
2. No edits to `.ab2-fixed-video` or `.ab2-root::before`.
3. No edits to `.ab2-content` background / `isolation` / z-index.
4. Changes confined to: `Words` fn, `.ab2-manifesto` JSX block, `.ab2-manifesto*` CSS, the single `.ab2-word` GSAP tween.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Text unreadable over bright video frames | Med | scrim gradient + text-shadow; **verify in browser** |
| 2nd video perf cost | Low | same cached file; existing IO lazy play; `muted loop playsInline` |
| Line-split breaks on narrow widths (manual line breaks look wrong) | Med | use semantic phrase lines + `text-wrap:balance`; verify mobile |
| GSAP retarget misses (`.ab2-word` referenced elsewhere) | Low | grep confirms `.ab2-word` only at 180-196 + CSS 653-657; both updated |

## Acceptance criteria

- [ ] Sentence renders WITH correct spaces at all breakpoints (bug gone).
- [ ] Lowercase, not uppercase.
- [ ] Letterbox frame shows moving portal video; text overlaid & legible.
- [ ] "game quốc tế" + "người chơi Việt" highlighted purple.
- [ ] Line-by-line reveal on scroll (desktop); full text shown under reduced-motion.
- [ ] Mobile ≤767px: frame + text scale correctly, video plays.
- [ ] Section 1 (hero portal→video) visually identical to before — verified in browser.
- [ ] No TypeScript/lint errors; `npm run build` clean.
