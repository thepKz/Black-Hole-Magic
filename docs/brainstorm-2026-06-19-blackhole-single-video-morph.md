# Brainstorm — Gộp 2 video blackhole thành 1 morph (transform-only)

**Date:** 2026-06-19
**File:** `pubzi-nextjs/src/app/about/page.tsx` (single Client Component, GSAP + ScrollTrigger, inline `<style jsx>`)
**Status:** Solution agreed — chưa implement.

---

## 1. Problem statement

AboutPage hero: blackhole VIDEO + chữ "Chúng tôi đưa game quốc tế vào đời sống của người chơi Việt."
User complaints:
- "tại sao lại phải 2 video" — muốn gộp thành 1 morph animation, "chỉ di chuyển".
- "hình như bị bo góc... không thích" — không muốn video bị ép thành oval/bo góc.
- "blackhole là blackhole rồi đừng tạo nữa" — video đã là blackhole trên nền tối; mask oval là thừa.

## 2. Root cause (verified in code)

| Triệu chứng | Nguyên nhân | Vị trí |
|---|---|---|
| 2 video | Thật sự 2 thẻ `<video>`; "morph" = **cross-fade giả** (fixed video mờ đi @0.9, letterbox hiện @0.78) | morphTl L306-307 |
| Bo góc / oval | `radial-gradient(ellipse...)` mask + `clip-path: ellipse(76% 62%)` ép cả 4 cạnh thành oval | CSS L1036; morphTl L282 |
| Tại sao tác giả dùng 2 video | Né 2 lỗi vật lý: `transform:scale` (a) làm méo `object-fit:cover`, (b) `position:fixed` không cuộn theo trang. Cross-fade là cách né rẻ tiền. | — |

## 3. User decisions (final)

1. **Edge:** rìa fade mềm vào nền, **khung CHỮ NHẬT** (không oval, không bo góc). Blackhole "trôi trong không gian".
2. **Mechanism:** **1 `<video>` duy nhất**, transform-only, bỏ cross-fade. "Chỉ di chuyển".
3. **Text:** giữ nguyên hiệu ứng trượt-lên-từng-dòng (`lineTl`).
4. **Ngưỡng morph:** chỉ chạy **≥1024px**; dưới ngưỡng = card tĩnh, không morph.

## 4. Evaluated approaches

| # | Cách giữ video trong card sau morph | Verdict |
|---|---|---|
| a | Để `position:fixed` mãi | ❌ video dính màn hình, không cuộn đi |
| b | Swap `fixed→absolute` lúc morph xong | ❌ giật sub-pixel khi scrub ngược; fragile |
| c | **Giữ fixed + ScrollTrigger#2 dịch `translateY` theo scroll** | ✅ chọn — jump-free, reversible |

| # | Cách scale geometry (giữ blackhole tròn + feather không méo) | Verdict |
|---|---|---|
| 1 | `transform:scale` wrapper + `object-fit:cover` | ❌ cover tính 1 lần → scaleX≠scaleY bóp thành oval |
| 2 | Animate `width/height/top/left` (px) | ✅ chọn — cover re-fit mỗi frame, không méo; box `fixed` + con `inset:0` nên reflow rẻ |
| 3 | Wrapper không scale + video scale bên trong + feather riêng | ⚠️ phức tạp hơn, không cần |

## 5. Recommended solution

### DOM
```
.ab2-stage-fixed    position:fixed; inset:0; z-index:2; KHÔNG transform   ← root, chỉ nhận translateY (follow)
  ├ .ab2-stage      position:absolute→fixed; box (top/left/w/h) ANIMATE   ← node duy nhất nhận geometry
  │   └ <video.ab2-fixed-video.ab2-motion-video>  inset:0; w/h:100%; object-fit:cover  ← 1 VIDEO DUY NHẤT
  └ .ab2-frame-mask position:absolute; z-index:3; pointer-events:none; KHÔNG transform ← feather chữ nhật (px)

.ab2-manifesto-stage
  ├ .ab2-card-slot  (= .ab2-letterbox cũ) aspect-ratio:16/9; min-height:min(720px,72dvh);
  │                 visibility:hidden; KHÔNG video/mask/scrim   ← giữ chỗ layout + mốc getBoundingClientRect()
  └ p.ab2-manifesto-copy  giữ nguyên (absolute, bottom-left, z trên video)
```

### Feather chữ nhật mềm (constant, không méo)
- Nằm trên `.ab2-frame-mask` — **không bao giờ scale**, chỉ animate 4 px-inset `--f-left/-top/-right/-bot`.
- 4 `linear-gradient` (mỗi cạnh) tan từ `#08060f` → transparent qua dải `--feather` (~40px, ≤48px tránh dồn góc).
- **Bỏ** `radial-gradient(ellipse)`. Không `mask-composite` (Safari quirk) → cross-browser an toàn.
- `--feather` giữ **cố định** suốt morph (không animate) để tránh "breathing edge".

### Geometry — GSAP tween
- **TWEEN** trên `.ab2-stage`: `top, left, width, height` (px, **function-based**).
- **TWEEN** trên `.ab2-frame-mask`: `--f-left/-top/-right/-bot` (px, function-based, **cùng start/duration/ease**).
- **TWEEN** trên `.ab2-stage-fixed` (follow phase): `y`.
- **CẤM**: `scale/scaleX/scaleY`, `clip-path: ellipse()`, scrubbed `filter`/vignette (repaint toàn màn → drop frame).

### morphTl (cross-fade removed)
Trigger giữ nguyên: `hero, start:'bottom bottom', end:'bottom top', scrub:0.9, invalidateOnRefresh:true`.
```
0.12  sectionBackdrop autoAlpha→1   (KEEP — giờ load-bearing, lấp chỗ video co lại)
0.10  stage.fromTo box: fullscreen → getTargetRect()   dur 0.82  ease power3.inOut
0.10  frame.fromTo --f-*: 0 → card insets               dur 0.82  ease power3.inOut  (cùng nhịp)
```
Ease `power3.inOut` cho cảm giác "glide vào slot".

### Follow phase (video ở lại card khi cuộn)
```
followTl: trigger '.ab2-manifesto', start 'top top' (== morph end), end 'bottom top', scrub:true, invalidateOnRefresh
  → stageFixed.to({ y: () => -getManifestoScrollSpan() })   // span là FUNCTION, không hard-code
exit (~0.9): stageFixed autoAlpha 1→0 (fade vào nền tối #08060f, KHÔNG cross-fade)
```
Dịch `.ab2-stage-fixed` (cha), không phải `.ab2-stage` (GSAP đang giữ box của nó) → cộng dồn sạch.

## 6. Delete / Keep

**DELETE:**
- `clip-path` trong `gsap.set` (L232) + 3 ellipse keyframes (L270-287).
- 2 cross-fade tweens (L306-307).
- Scrubbed `filter`/`--ab2-fixed-vignette` tween (L259-269) — hoặc move off-scrub.
- Video thứ 2 `.ab2-letterbox-video` (L545), `.ab2-letterbox-scrim` (L554), `--ab2-media-mask` oval + toàn bộ CSS `.ab2-letterbox*` (L1035-1097), mobile oval override (~L1750).
- Parallax tween `.ab2-letterbox-video` (L343-357) — target không còn; **KHÔNG** retarget vào video đơn (sẽ fight morph → jitter).

**KEEP (verbatim):**
- `lineTl` text reveal (L315-341). Verify `start:'top 70%'` không chồng đuôi morph trên màn cao → nudge `'top 60%'` nếu cần.
- `sectionBackdrop` fade-in (giờ load-bearing).
- `.ab2-motion-video` IntersectionObserver + class trên video sống sót.
- `getHeroEndScroll()` / `getTargetRect()` — retarget sang `.ab2-card-slot`.
- `portalTl` hero phase (chỉ động vào con của fixed wrap, an toàn).

## 7. Top risks + guards

1. **Layout-box jank / address-bar snap (≥1024px gate).** Gate morph `(min-width:1024px) and (pointer:fine)`; dưới ngưỡng card tĩnh + video `position:absolute` trong slot. Thêm `ScrollTrigger.config({ ignoreMobileResize:true })`.
2. **Follow drift / handoff jump.** Mọi khoảng cách là `() =>` function; `invalidateOnRefresh:true` cả 2 timeline; follow `start:'top top'` trùng morph `end:'bottom top'`; morph `refreshPriority` cao hơn `storyTimeline`.
3. **Legibility chữ + cleanup breakpoint.** Bỏ scrim → chữ trắng khó đọc: port scrim gradient sang `.ab2-stage-fixed::before` hoặc giữ scrim nhẹ trong slot; test ở **endpoint** morph. Mọi state qua `gsap.set`/timeline (revert được); thêm `@media (max-width:1023px)` + reduced-motion (~L1847-1912) static fallback cho 3 node mới (`transform:none; --f-*:0; --feather` cố định).

## 8. Success criteria

- [ ] Chỉ còn **1** thẻ `<video>` trong DOM.
- [ ] Blackhole **tròn** ở mọi aspect ratio (16:9, 16:10, ultrawide) — không oval khi morph.
- [ ] Rìa video **chữ nhật mềm**, không bo góc, không oval; mềm đều suốt morph.
- [ ] Không thấy seam/giật ở điểm handoff morph→follow.
- [ ] Video ở lại đúng slot card khi cuộn, fade đi mượt khi qua manifesto.
- [ ] Chữ trượt-lên-từng-dòng hoạt động y như cũ, đọc rõ trên blackhole.
- [ ] ≥1024px morph; <1024px card tĩnh, không lỗi console (no orphan ScrollTrigger).

## 9. Next steps

Chạy `/plan` với context này → tạo `plan.md` chi tiết từng phase implement.
