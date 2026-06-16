# Brainstorm — Portal Zoom Intro cho trang /about

**Ngày tạo:** 2026-06-15 · **Sửa lại:** 2026-06-16 (component đã build nhưng SAI hành vi → chốt lại cơ chế)
**Trang đích:** `/about` (`src/app/about/page.tsx`)
**Component:** `src/components/about/AboutPortalIntro.tsx`
**Asset:** `public/assets/img/landing-page/trasparent_bg.png` (1448×1086, RGBA)

---

## 0. CẬP NHẬT 2026-06-16 — Vì sao bản hiện tại không chạy đúng như ảnh ref

Component `AboutPortalIntro.tsx` đã được build (zoom scale 7 + `mix-blend-mode: screen`) nhưng **không khớp** ảnh tham chiếu. Nguyên nhân gốc (đã verify):

1. **Ảnh KHÔNG có lỗ trong suốt.** Đã sample pixel tâm ring (~62% x, 38% y): ra **tím sáng đặc, opaque**. PNG có alpha channel (color type 6) nhưng tâm vẫn tô kín (vầng sáng). → Ring là **đĩa phát sáng đặc, có người ngồi trước**, KHÔNG phải cửa sổ nhìn xuyên.
2. **`mix-blend-mode: screen` là mô hình sai.** Code giả định nền đen → trong suốt để "nhìn About xuyên qua ring". Nhưng vì *toàn bộ nền đen*, screen-blend xoá luôn cả người + vùng tối của ảnh portal → lộ hero About giữa chừng = đục, vỡ ý đồ.
3. **`transform-origin: 57% 38%` + scale 7** → nếu origin lệch tâm ring, scale lớn đẩy ring văng ra rìa viewport → "bay trượt qua rìa" thay vì "xuyên qua tâm".
4. **`margin-top: -150vh` + fade ở 70%** → cắt sang hero About quá sớm, hero lòi ra sau lớp portal đang fade dở.

**Quyết định cuối (qua hỏi đáp 2026-06-16):**
→ **Zoom INTO đĩa ring → crossfade sang About.** Dùng ảnh nguyên trạng, KHÔNG sửa ảnh, KHÔNG mask giả, KHÔNG screen-blend.

Lý do chọn (brutal honesty): các phương án "nhìn xuyên lỗ" đều đòi 1 trong 2 thứ ảnh không có — (a) lỗ alpha thật (phải sửa ảnh ngoài codebase), hoặc (b) CSS-mask hình tròn bám chính xác vị trí+scale của ring khi phóng (1-2h pixel-tuning, dễ lệch). Zoom-into-disc cho đúng cảm giác "bay xuyên cổng" của ảnh ref mà rủi ro thấp, ~30 phút.

---

## 1. Cơ chế ĐÚNG (bản chốt để implement)

**Ý tưởng:** Camera lao thẳng vào tâm ring. Đĩa sáng phóng to "nuốt" viewport (vầng sáng tím/trắng tràn kín màn), rồi crossfade mượt sang hero "Black Hole". Không cần trong suốt — chính vầng sáng là "đường hầm".

**DOM (giữ nguyên cấu trúc sticky, bỏ mix-blend):**
```
<section class="apx">              height ~250vh (đường scroll cho zoom; sẽ tinh chỉnh sau)
  <div class="apx-fixed">          fixed inset:0, 100vh, overflow:hidden
    <img class="apx-art" />         ảnh portal — OPAQUE, KHÔNG mix-blend
    <span class="apx-flash" />      lớp phủ radial tím→trắng, opacity 0→1 cuối tl (che điểm cắt)
  </div>
</section>
```

**Animation (GSAP ScrollTrigger scrub, trigger=section, start `top top`, end `bottom top`):**
1. **Load (chưa scroll):** `apx-art` autoAlpha 0→1 (~1.1s) + glow thở nhẹ (`filter: brightness` yoyo). GIỮ NGUYÊN — phần này đang ổn.
2. **Scroll scrub:**
   - `apx-art`: `scale` 1 → **~6–8** với `transform-origin` đặt ĐÚNG tâm ring (`~62% 38%`, tinh chỉnh bằng mắt). brightness 1 → ~1.3 về cuối (tiến gần ánh sáng).
   - `apx-flash` (overlay radial, tâm trùng ring): opacity 0 → 1 ở khoảng **65%–100%** → vầng sáng phủ kín → che điểm crossfade.
   - Cuối: cả lớp `apx-fixed` autoAlpha → 0 (hoặc giữ flash phủ rồi hero hiện dưới). Hero About lộ ra SẠCH, không lòi sớm.
3. Qua hết section → ẩn hẳn `apx-fixed` (ScrollTrigger onEnter) để không đè phần còn lại trang.

**Khác biệt chính so với bản cũ:**
| Bản cũ (sai) | Bản mới (chốt) |
|---|---|
| `mix-blend-mode: screen` | **Bỏ** — ảnh opaque bình thường |
| Lộ About xuyên ring giữa chừng | Crossfade ở CUỐI, có flash che |
| origin 57% 38%, dễ lệch | origin ~62% 38%, tinh chỉnh bằng mắt cho khớp tâm |
| fade art ở 70% (sớm) | flash phủ 65-100% rồi mới cắt (mượt) |

## 2. Giữ nguyên (đang đúng)
- Pattern `gsap.context` + cleanup `ctx.revert()`.
- Guard `prefers-reduced-motion` → portal tĩnh.
- Mobile (`max-width:767px`) → bỏ scroll-zoom, chỉ fade-in tĩnh. (Lưu ý: bỏ luôn mix-blend ở mobile.)
- `will-change: transform, opacity, filter`.
- Tích hợp: `<AboutPortalIntro />` đặt đầu `.ab-root`, trước `.ab-hero` (đã xong).

## 3. Rủi ro & giảm thiểu
| Rủi ro | Giảm thiểu |
|---|---|
| Scale 6-8 trên ảnh 1448px → mờ/vỡ ở tâm | Vầng sáng tím ở tâm vốn ít chi tiết → phóng to ít lộ vỡ; flash phủ che phần cuối. Test thực. |
| origin lệch → không xuyên đúng tâm | Tinh chỉnh `transform-origin` bằng mắt trên localhost. |
| Crossfade lộ điểm nối | `apx-flash` radial phủ kín trước khi cắt → mắt không thấy seam. |
| Jank scrub scale lớn | Chỉ animate transform/opacity/filter (GPU); `will-change`. |
| 250vh đẩy nội dung | Chấp nhận — đường scroll cho hiệu ứng; sẽ tinh chỉnh số sau khi xem. |

## 4. Tiêu chí thành công
- Load: portal full screen, glow thở, không giật.
- Scroll: đĩa ring phóng từ TÂM, vầng sáng tràn kín màn → cảm giác xuyên cổng.
- Crossfade sang hero "Black Hole" MƯỢT, không lộ seam, không lòi hero sớm.
- Ảnh không méo/cắt (object-fit contain, căn giữa).
- Mobile nhẹ, không lag. Reduced-motion: tĩnh, dùng được.

## 5. Phương án đã loại (2026-06-16)
- **CSS-mask lỗ giả** → About xuyên qua: được nhưng mask phải bám scale+vị trí ring chính xác, 1-2h tuning, dễ lệch. Loại (KISS).
- **Sửa ảnh tạo lỗ alpha thật**: sạch nhất nhưng cần edit ảnh ngoài codebase. Để dành nếu sau muốn nâng cấp.
- **Giữ mix-blend-mode: screen**: là gốc lỗi hiện tại. Loại.

## 6. Bước tiếp theo
1. Sửa `AboutPortalIntro.tsx`: bỏ `mix-blend-mode`, đổi origin ~62% 38%, thêm `apx-flash`, dời crossfade về cuối.
2. Tinh chỉnh scale cuối / điểm flash / `transform-origin` / chiều cao section bằng mắt trên `localhost:3000/about`.
3. Test mobile + reduced-motion.
