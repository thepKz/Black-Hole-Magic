# Brainstorm — Portal Intro v2: video xuyên cổng + full-bleed cho /about

**Ngày:** 2026-06-16 (kế thừa `brainstorm-about-portal-2026-06-15.md`)
**Trang đích:** `/about` → component `src/components/about/AboutPortalIntro.tsx`
**Asset ảnh:** `public/assets/img/landing-page/trasparent_bg.png` (1448×1086, RGBA)
**Asset video:** `public/assets/video/background_1_pingpong.{webm,mp4}` (1280×720, 16s ping-pong loop, ~9-11MB)

---

## 1. Yêu cầu mới (user, 2026-06-16)
1. Ảnh portal phải **full-width** (cover, không contain — hiện đang contain nên hở 2 bên).
2. **Zoom căn đúng tâm ring**.
3. Trong **lỗ ring có VIDEO** ("xuyên khe") — user khẳng định ảnh có vùng trong suốt.
4. Tự thiết kế cách **nối tiếp sang section About mượt mà**.

## 2. Phát hiện then chốt — ĐÃ VERIFY bằng sharp (quan trọng)

Đọc alpha channel thật của `trasparent_bg.png`:
- **Vùng đĩa ring: alpha = 97/255 (~38% đục)** → BÁN trong suốt, KHÔNG phải đặc, cũng KHÔNG phải lỗ 0%.
- Góc đen: alpha 255 (đặc). Người ngồi: alpha 255 (đặc). Chữ We/Create/Future: đặc.
- → Ảnh = **vignette đen + "cửa kính" bán trong suốt ở ring + silhouette người đặc nằm trước**.

**Hệ quả:** User ĐÚNG — có thể cho video xuyên qua ring. Nhưng ở 38% video sẽ **mờ, ám tím**. → Cần xử lý alpha.

**Đã prototype & verify (composite ảnh đã xử lý lên nền hồng):** hồng hiện **rõ, sáng** qua ring; viền đen vẫn khung; người vẫn đặc; chữ còn nguyên. ✅ Đúng hiệu ứng "người xem video qua cổng".

→ File đã tạo: `public/assets/img/landing-page/trasparent_bg.png` (~1.4MB) — bản ảnh đã "mở" cửa kính.

## 3. Quyết định đã chốt (qua hỏi đáp)

| Hạng mục | Lựa chọn |
|---|---|
| Strength lỗ | **Boost ring → gần trong suốt hẳn** (video rõ), giữ viền đen + người đặc |
| Video | **background_1_pingpong** (loop liền mạch, đã dùng ở HeroSection7) |
| Layout ảnh | **Full-bleed cover**, căn `object-position` vào tâm ring |
| Zoom | Căn **transform-origin = tâm ring** |

## 4. Giải pháp khuyến nghị (cơ chế đầy đủ)

### 4.1 Image-prep (một lần, bằng sharp — KHÔNG làm runtime)
Script remap alpha: `a>=200` giữ (người/đặc); `a<=150` (kính ~97) ép xuống ~12%; band 150–200 ramp mượt giữ anti-alias. Output: `trasparent_bg.png`. **Đã chạy thử OK.**
> Lưu ý: đây là bước build-asset, lưu file tĩnh. Không phụ thuộc sharp lúc chạy web.

### 4.2 DOM (layer từ dưới lên)
```
<section class="apx">                 height ~250vh (scroll runway)
  <div class="apx-fixed">             fixed inset:0, 100vh, overflow:hidden
    <video class="apx-video" />        LỚP DƯỚI — bg video (pingpong, muted/loop/playsInline/autoPlay)
    <img class="apx-art" trasparent_bg /> LỚP TRÊN — ảnh đã mở cửa kính, full-bleed cover
    <span class="apx-flash" />         radial bloom, fill cuối để giấu seam
  </div>
</section>
```
- `apx-video`: `object-fit:cover; width/height:100%`. Đặt sau ảnh → chỉ thấy video QUA cửa kính ring (vùng đục thấp). Phần viền đen của ảnh (alpha 255) che video → tự khung.
- `apx-art` (`trasparent_bg.png`): `object-fit:cover`, `object-position` ~ tâm ring để ring nằm giữa viewport sau khi cover-crop. `transform-origin` = tâm ring.

### 4.3 Animation (GSAP ScrollTrigger scrub, start `top top` → end `bottom top`)
1. **Load:** ảnh + video fade-in; glow thở nhẹ (giữ pattern cũ). Video `.play()` khi vào view (observer như HeroSection7), pause khi rời (tiết kiệm pin).
2. **Scroll scrub:**
   - `apx-art` + `apx-video` **cùng** `scale` 1 → ~6–8, **cùng transform-origin = tâm ring** → cả khung lao vào tâm, video phóng to lấp đầy (cảm giác "chui qua cổng vào thế giới video").
   - brightness ảnh 1 → ~1.25 về cuối.
   - `apx-flash` opacity 0→1 ở ~70–100% (bloom tím/trắng giấu điểm cắt).
   - ~88–100%: fade `apx-art` (ảnh) → 0 để chỉ còn **video full-screen** (đã phóng kín) → đây là "đã qua cổng".
3. **Handoff sang About — VIDEO LÀM NỀN HERO (chốt 2026-06-16):**
   - KHÔNG fade video ra. Video **giữ lại làm background của `.ab-hero`**.
   - Cuối timeline (~85–100%): fade `apx-art` (trasparent_bg.png) + `apx-flash` → 0, để lại **video full-screen**; nội dung hero fade-in ĐÈ lên video.
   - Cơ chế giữ video sang hero: **video render 1 lần, dùng chung** cho cả portal-zoom lẫn nền hero (DRY, tránh tải 2 video). Video sống xuyên suốt; portal section chỉ là lớp ảnh + flash phủ scroll, fade ra để lộ video làm nền hero.
   - **Chi phí (đã chấp nhận):** `.ab-hero` hiện có gradient nền riêng + plate ảnh bên phải. Để video sau hero → nền hero đổi thành **scrim tối bán trong** (vd `linear-gradient(rgba(8,6,15,.55), rgba(8,6,15,.82))`) cho chữ đọc rõ trên video động. Cần tinh chỉnh contrast. Cân nhắc bỏ/ẩn plate ảnh bên phải hero để tránh rối (tùy mắt).
   - Video `muted loop playsInline autoPlay` + observer pause khi cuộn xa khỏi hero (tiết kiệm pin). Scrub điều khiển scale/opacity end-to-end, KHÔNG thêm ScrollTrigger.create rời (bài học vòng trước).

### 4.4 Full-bleed cover + căn tâm (yêu cầu 1 & 2)
- Bỏ `width:min(96vw,1448px)` + `object-fit:contain`.
- Dùng `.apx-art, .apx-video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }`.
- `object-position`: ngang ~ vị trí ring (≈ để ring vào giữa viewport sau crop; tinh chỉnh bằng mắt, ước lượng `62% 38%`).
- `transform-origin` khớp `object-position` để zoom đi đúng tâm ring.

## 5. Phương án đã loại
- **Dùng cửa kính 38% as-is** (không xử lý alpha): video mờ, ám tím, underwhelming → loại.
- **Video as destination (cut sau bloom, không xuyên hole)**: crisp nhất, đơn giản nhất, nhưng KHÔNG cho video "trong lỗ" lúc scroll → user muốn xuyên khe nên loại.
- **CSS-mask hình tròn cho video**: thừa, vì ảnh đã tự làm mask (viền đặc + kính trong) → KISS, loại.

## 6. Rủi ro & giảm thiểu
| Rủi ro | Giảm thiểu |
|---|---|
| Video 1280×720 phóng 6-8x → vỡ nét | Tâm ring lúc cuối bị flash phủ + ảnh fade; video chỉ cần rõ ở scale nhỏ→vừa. Chấp nhận. Nếu cần nét hơn: dùng gaming-play.mp4 1080p (22MB, nặng hơn). |
| Alpha-clean ăn lẹm vào người/chữ | Threshold đã tách: chỉ vùng ≤150 mở; người/chữ ≥200 giữ. Đã verify ảnh hồng OK. Tinh chỉnh threshold nếu lộ. |
| Autoplay video chặn / tốn pin | `muted playsInline autoPlay loop` + observer play/pause theo viewport (DRY từ HeroSection7). |
| Mobile lag (video + scrub scale) | Mobile: bỏ scroll-zoom; show ảnh tĩnh trasparent_bg + video nhẹ hoặc poster tĩnh. Reduced-motion: ảnh tĩnh, không video autoplay. |
| Seam khi cắt sang About | Lớp `apx-flash`/`apx-out` màu nền About phủ cuối timeline → không thấy mép. |
| Xung đột scrub vs trigger rời | CHỈ scrub điều khiển `apx-fixed` end-to-end (bài học vòng trước). |
| trasparent_bg.png thêm asset | 1 file ~1.4MB, thay cho trasparent_bg.png ở /about. Chấp nhận. |

## 7. Tiêu chí thành công
- Ảnh full-width, không hở mép; ring nằm giữa.
- Video chạy RÕ trong lỗ ring lúc load + scroll (không mờ tím).
- Scroll: cả khung lao vào tâm ring, video phóng lấp đầy → cảm giác xuyên cổng.
- Cắt sang hero "Black Hole" mượt, không lộ seam.
- Mobile nhẹ; reduced-motion tĩnh, dùng được.

## 8. Bước tiếp theo
1. Chạy script sharp tạo `trasparent_bg.png` (đã prototype — chỉ cần chốt threshold).
2. Sửa `AboutPortalIntro.tsx`: thêm `<video>` lớp dưới (pattern HeroSection7), đổi ảnh sang `trasparent_bg.png`, full-bleed cover + object-position tâm ring, zoom video+ảnh đồng bộ, flash/out giấu seam, observer play/pause.
3. Tinh chỉnh trên `localhost:3000/about`: object-position, transform-origin, scale cuối, điểm flash, chiều cao section.
4. Mobile + reduced-motion.
