# Brainstorm — Thiết kế lại Section 2 (Manifesto) trang /about

**Ngày:** 2026-06-18
**File mục tiêu:** `src/app/about/page.tsx` → section `.ab2-manifesto` (dòng 320–330)
**Ràng buộc cứng:** KHÔNG động vào section 1 (hero portal scroll-ra-video), video fixed nền, layering `.ab2-content`.

---

## 1. Vấn đề

Section manifesto hiện tại bị chê toàn diện:

| Triệu chứng | Nguyên nhân gốc | Loại |
|---|---|---|
| Chữ dính "CHÚNGTÔIĐƯA GAMEQUỐC..." | `.ab2-word { display:inline-block }` nuốt khoảng trắng `{' '}` sau mỗi span (whitespace collapse kinh điển) | 🔴 Bug |
| Chữ HOA thô, nặng | Font Extrafett @4.65rem + uppercase + wrap 21ch → khối chữ đặc, bí | 🟡 Style |
| Layout nhàm | Grid 2 cột generic: mark nhỏ trái + title to phải | 🟡 Style |
| Thiếu sức sống | Chỉ 1 hiệu ứng (chữ mờ→nét theo scroll), không có lớp/nhịp/điểm nhấn | 🟡 Style |

Text dữ liệu GỐC đúng (có dấu cách): `"chúng tôi đưa game quốc tế vào nhịp sống của người chơi Việt."`. Lỗi chỉ ở render.

## 2. Các hướng đã cân nhắc

- **A — Cinematic Reveal:** typography-led, chữ thường cỡ lớn reveal theo dòng, highlight từ khóa tím. An toàn, sang, nhẹ đô.
- **B — Letterbox Portal (CHỌN):** khung phim 2.39:1 giữa manifesto để lộ video portal chuyển động, chữ đè lên reveal theo dòng. Cinematic thật, nối mạch section 1.
- **C — Kinetic Manifesto:** cụm từ trượt ngang xen kẽ. Loại — nghiêng động/esports, ngược tông "tinh tế".

## 3. Giải pháp chốt: Hướng B — Letterbox Portal

**Tông:** cinematic, tinh tế. **Chữ:** thường (bỏ uppercase). **Video nguồn:** thẻ `<video>` RIÊNG trong khung (Cách 2 — không đụng layering trang).

### Quyết định kỹ thuật cốt lõi
`.ab2-content` có `isolation: isolate` + nền mờ đục → video `fixed` (z-index toàn cục) KHÔNG xuyên qua được. Thay vì đục thủng stacking context (rủi ro cao), đặt **video thứ 2** cùng nguồn `background_1_pingpong` ngay trong khung letterbox. Độc lập, an toàn, browser cache lại file → không tốn thêm băng thông.

### Đặc tả thiết kế
1. **Bố cục mới (1 cột, căn trái):**
   - Kicker: `— về BlackHole` + đường kẻ mảnh (thay grid 2 cột).
   - **Khung letterbox** (aspect ~2.39:1) chứa video portal, có 2 scrim đen mép trên/dưới mềm.
   - Câu manifesto chữ thường, font Extrafett, ĐÈ lên khung phim, reveal theo TỪNG DÒNG (không phải từng chữ).
   - Note phụ phía dưới khung.
2. **Sửa bug chữ dính:** đổi component `Words` (split theo chữ + inline-block) → split theo DÒNG, mỗi dòng là block. Khoảng cách từ giữ tự nhiên.
3. **Highlight:** 2 cụm "game quốc tế" + "người chơi Việt" tô accent tím gradient (`--ab2-accent`).
4. **Độ đọc trên video:** scrim gradient + text-shadow đảm bảo contrast.
5. **Animation:** từng dòng trượt lên + làm nét theo scroll (mask kiểu phụ đề phim), giữ scrub mượt.

### Responsive & a11y
- Mobile (≤767px): khung letterbox co lại, chữ giảm cỡ, video vẫn chạy (đã có pattern IntersectionObserver pause/play sẵn trong page).
- `prefers-reduced-motion`: video pause + chữ hiện full (đã có khối `@media reduce` sẵn — chỉ cần phủ rule mới vào).

## 4. Rủi ro & giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Video thứ 2 ngốn hiệu năng | Thấp | Cùng file đã cache; lazy play qua IO sẵn có; `playsInline muted loop` |
| Chữ khó đọc trên video sáng | TB | Scrim gradient + text-shadow; test thực tế trong browser |
| Vỡ layering / đụng section 1 | Thấp | Video TỰ CHỨA trong khung, KHÔNG sờ `.ab2-content`/fixed video/hero |
| Janky scroll khi reveal theo dòng | Thấp | Reuse pattern scrub GSAP đang chạy ổn ở các section khác |

## 5. Tiêu chí nghiệm thu

- [ ] Chữ KHÔNG còn dính — "chúng tôi đưa game..." hiển thị đúng dấu cách ở mọi breakpoint.
- [ ] Chữ thường, không uppercase.
- [ ] Khung letterbox hiện video portal chuyển động, chữ đè lên đọc rõ.
- [ ] 2 cụm từ khóa highlight tím.
- [ ] Section 1 (hero portal→video) KHÔNG đổi gì — verify trong browser thật.
- [ ] Mobile + reduced-motion hoạt động đúng.

## 6. Bước tiếp theo

Implement trong `src/app/about/page.tsx`: (a) viết lại JSX `.ab2-manifesto` + thêm khung video, (b) đổi `Words` → split theo dòng, (c) thêm/chỉnh CSS-in-JS cho letterbox + reveal + responsive + reduced-motion, (d) cập nhật GSAP timeline cho reveal theo dòng. CHỈ trong phạm vi manifesto.
