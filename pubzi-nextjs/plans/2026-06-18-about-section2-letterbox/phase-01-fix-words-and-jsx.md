# Phase 01 — Fix Words + rewrite manifesto JSX

**File:** `src/app/about/page.tsx`
**Goal:** Kill word-dinh bug via line-split; build letterbox JSX with embedded portal video + highlights.

## Step 1.1 — Replace `Words` component (lines 112-122)

Old splits by space → inline-block eats whitespace. New: render the sentence as discrete LINES, each a block element. Highlight phrases inline.

Replace [page.tsx:112-122](../../src/app/about/page.tsx#L112-L122) with:

```tsx
// Manifesto rendered as discrete lines so each can reveal on scroll without
// the inline-block whitespace-collapse bug that glued words together.
const MANIFESTO_LINES: React.ReactNode[] = [
  <>chúng tôi đưa</>,
  <><span className="ab2-hl">game quốc tế</span> vào</>,
  <>nhịp sống của</>,
  <><span className="ab2-hl">người chơi Việt</span>.</>,
];

function ManifestoLines() {
  return (
    <>
      {MANIFESTO_LINES.map((line, i) => (
        <span className="ab2-line" key={i}>
          {line}
        </span>
      ))}
    </>
  );
}
```

Notes:
- `.ab2-line` will be `display:block` (Phase 02) → no whitespace collapse.
- Phrase lines are semantic (not raw char wraps) → controlled breaks, no mid-word splits.
- Keep line groupings; tweak only if browser verify shows awkward wraps.

## Step 1.2 — Rewrite manifesto JSX (lines 320-330)

Replace [page.tsx:320-330](../../src/app/about/page.tsx#L320-L330) with:

```tsx
<section className="ab2-manifesto">
  <div className="ab2-manifesto-mark ab2-reveal">— về BlackHole</div>

  <div className="ab2-manifesto-stage">
    <div className="ab2-letterbox" aria-hidden="true">
      <video
        className="ab2-letterbox-video ab2-motion-video"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      >
        <PortalVideoSources />
      </video>
      <span className="ab2-letterbox-scrim" />
    </div>

    <p className="ab2-manifesto-copy">
      <ManifestoLines />
    </p>
  </div>

  <span className="ab2-manifesto-note ab2-reveal">
    BlackHole xây nhịp vận hành bản địa: thị trường, cộng đồng, creator, live ops và phản hồi người chơi.
  </span>
</section>
```

Key points:
- `ab2-motion-video` class → auto-wired into existing play/pause `useEffect` (line 131). No JS edits for video lifecycle.
- Reuses existing `PortalVideoSources` (line 103). No new source markup.
- `aria-hidden` on letterbox (decorative); text stays in real `<p>` for a11y/SEO.
- `ab2-manifesto-copy` changes from grid child to overlay — CSS handles positioning (Phase 02).

## Acceptance (phase)

- [ ] File compiles (TS happy — `React.ReactNode[]` typed).
- [ ] `Words` no longer referenced anywhere (grep `Words` → only old call site replaced).
- [ ] Manifesto markup present with `.ab2-letterbox`, `.ab2-letterbox-video.ab2-motion-video`, `.ab2-line`, `.ab2-hl`.

## Watch-outs

- Old call site was `<Words text="..." />` at line 324 — now `<ManifestoLines />`. Ensure no leftover `<Words` import/usage.
- Do NOT remove `PortalVideoSources` — now used twice (fixed video + letterbox).
