# Brainstorm — Nhân vật 3D /game: toạ độ trang + to hơn + xoay vũ trụ + GSAP hero

**Date:** 2026-06-20
**File chính:** `pubzi-nextjs/src/components/shared/GlobalCompanion.tsx` (sẽ đổi vai trò), `src/app/game/page.tsx`, `src/app/layout.tsx`
**Trạng thái:** Đã chốt giải pháp (chưa implement)

---

## Problem statement (4 yêu cầu user)
1. Nhân vật **to hơn nữa** (600px chưa đủ).
2. **Section 1 (/game hero) thêm GSAP** cho động.
3. **"Đang bị đi theo scroll"** → muốn KHÔNG theo scroll.
4. Xoay **"tùm lum như hình cầu, ngoài vũ trụ"** (đa trục).

## Root cause #3 (problem-solving — tìm gốc, không vá triệu chứng)
Companion hiện `position:fixed` → nó **đứng IM giữa màn hình** khi user cuộn; portal (thuộc trang) trôi đi nhưng nó vẫn **lơ lửng đè mọi section**. User gọi đó là "đi theo scroll". Với box 600px to ở giữa → rất chướng.

**Insight từ user (đổi hẳn mô hình):** *"page là 1 đoạn đường, cầm xong thả đó luôn. Ở 1,1 ném qua 30,30 (section 3); scroll xuống 100,100 (section 10) thì nó VẪN ở 30,30; scroll lên vẫn thấy nó ở đó."*
→ Không phải `fixed` (toạ độ màn hình), không phải gắn cứng portal. Là **toạ độ DOCUMENT/TRANG** — `position:absolute` trong trang. Thả đâu thuộc về vị trí đó trong trang; cuộn là phần của trang nên trôi theo trang tự nhiên.

## Dữ kiện kỹ thuật (đã verify)
- **Lenis KHÔNG chạy trên /game** (`SmoothScroll.tsx:28` `if (pathname?.startsWith('/game')) return`). /game = **native scroll thuần**. Lenis (trang khác) cũng eases **native** scroll, không transform body (`SmoothScroll.tsx:19-21`).
  → `position:absolute` theo document **tự cuộn đúng** mà KHÔNG cần JS update theo scrollY. Bỏ được toàn bộ tích hợp Lenis stop/start.
- `.gm-hero` **không pin/sticky** (layout 2 cột thường) → toạ độ document đơn giản.
- `.gm-root` có **`overflow:hidden`** (`game/page.tsx:748`) → companion absolute là con của `.gm-root`; clamp X trong width; Y tự do trong chiều cao trang. Cao bằng cả trang nên không bị clip dọc.
- Companion hiện mount global ở `layout.tsx` → hiện trên MỌI trang (đè cả /about...). User chốt **chỉ sống ở /game**.

## Quyết định (đã hỏi user 2 vòng)
| # | Chốt |
|---|------|
| Phạm vi | **CHỈ /game** (bỏ global). Gỡ khỏi `layout.tsx`, mount trong `game/page.tsx`. |
| #3 vị trí | **`position:absolute` theo `.gm-root` (toạ độ trang)**. Kéo-ném-thả-nằm-đó-trong-trang. Cuộn không đè section khác. |
| Đổi route | Không áp dụng (chỉ /game). Companion sinh ra ở tâm portal khi vào /game. |
| #1 size | **To hẳn, tràn hơn vòng portal** (~85-95% chiều cao hero, vd ~760-820px desktop). |
| #4 xoay | **Trôi nổi nhẹ 3 trục** (tumbling chậm, tốc độ khác nhau mỗi trục) + bồng bềnh. |
| #2 GSAP hero | **(a) Chữ+nút trôi vào khi load** (stagger fade+slide, mượt hơn hiện tại) + **(b) sao/hạt bay lơ lửng trong nền hero**. |

## Giải pháp (recommended)

### A. Chuyển companion: global fixed → local /game absolute
- **Gỡ** `<GlobalCompanion/>` khỏi `layout.tsx`; bỏ import.
- **Mount trong** `game/page.tsx` (trong `.gm-root`). Đổi tên cho đúng vai trò: `GameCompanion3D` (hoặc giữ tên, nhưng nên đổi để khỏi hiểu nhầm "global").
- CSS: `position:absolute` (không fixed). Toạ độ = document px trong `.gm-root`. `z-index` vừa phải (trên nội dung hero, dưới header/popup — trong ngữ cảnh /game).
- **Bỏ**: preloader-gating phức tạp (chỉ cần fade-in khi model load xong), Lenis stop/start (native scroll), recenter-on-route.
- **Giữ**: three.js scene + dispose + reduced-motion fallback + drag (pointer capture) + idle bob + visibilitychange pause.
- **Drag với absolute + scroll**: pointermove dùng `clientX/Y` (viewport) → cộng `window.scrollY/scrollX` để ra toạ độ document khi set `top/left`. Hoặc giữ transform translate3d nhưng cộng offset scroll. Cần cẩn thận: vì native scroll, lúc kéo mà trang không cuộn thì delta viewport = delta document → đơn giản. Thả ra: lưu toạ độ document, set `top/left` tuyệt đối.
- **Clamp**: X trong `[EDGE_PAD, pageWidth - box - EDGE_PAD]`; Y trong `[EDGE_PAD, .gm-root.scrollHeight - box - EDGE_PAD]` (cho thả ở bất kỳ section nào trong trang).

### B. To hơn (#1)
- Box ~**820px desktop** (hoặc theo % chiều cao hero: `min(86vh, 820px)`), mobile ~**420px**. Camera `MARGIN ~1.0-1.04` để nhân vật tràn gần đầy. Vẫn dùng `3d_9.glb` + bounding-sphere fit (không crop kiếm).

### C. Xoay đa trục (#4)
- Trong RAF: `modelGroup.rotation.y = phase*0.18`, `.x = Math.sin(phase*0.32)*0.25`, `.z = Math.sin(phase*0.22)*0.18` (tốc độ lệch nhau → tumbling tự nhiên). + bob box như cũ. Tốc độ chậm, không chóng mặt.

### D. GSAP hero (#2)
- **Chữ+nút**: tăng cường khối `gsap.fromTo('.gm-hero-copy > *', ...)` hiện có (`game/page.tsx:455-459` cùng vùng) — stagger fade + slide-up mượt hơn, thêm ease/blur nhẹ.
- **Sao/hạt**: thêm lớp `.gm-hero-stars` (absolute, trong hero, pointer-events:none), N đốm nhỏ, GSAP loop trôi lơ lửng + nhấp nháy opacity. Pattern giống particles trong `Preloader.tsx:190-218` (tái dùng ý tưởng).

## Risks
- **`overflow:hidden` của `.gm-root`** cắt companion nếu Y vượt chiều cao trang → clamp Y theo `scrollHeight`. Cần đo lại khi catalog filter đổi (chiều cao trang thay đổi) → ResizeObserver trên `.gm-root`.
- **Box quá to (820px)** dễ đè chữ/nút hero khi ở vị trí ban đầu (tâm portal) → grip pad hẹp + có thể lệch tâm sang phải (portal vốn ở cột phải). Cân nhắc home = tâm `.gm-portal-shell` (cột phải) chứ không phải giữa màn.
- **Kéo trong lúc trang cuộn**: nếu user kéo sát mép trên/dưới, trang có auto-scroll không? KHÔNG (giữ đơn giản v1) — chỉ kéo trong vùng nhìn, clamp.
- Mobile /game: native scroll, box 420px — đảm bảo `touch-action:none` chỉ trên grip để cuộn trang vẫn được ngoài nhân vật.

## Verification
- /game: nhân vật to tràn portal, xoay đa trục nhẹ + bồng bềnh. Kéo ném sang section 3 → thả → cuộn xuống section 10 nó **trôi khỏi màn** (không đè) → cuộn lại thấy nguyên ở section 3. ✓
- Chữ+nút hero trôi vào mượt khi load; sao bay trong nền. ✓
- Trang khác (/about...): **không còn nhân vật**. ✓
- Mobile /game: kéo nhân vật được, cuộn trang chỗ khác vẫn được. Reduced-motion: ảnh tĩnh trong portal.
- Resize / đổi filter catalog (đổi chiều cao trang): clamp lại Y, không kẹt ngoài trang.

## Next
- [ ] Implement A→D.
- [ ] Tinh chỉnh size 820px + MARGIN + vị trí home (tâm portal cột phải).
- [ ] Tune tốc độ xoay 3 trục.
