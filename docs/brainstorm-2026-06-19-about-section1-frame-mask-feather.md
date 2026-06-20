# Brainstorm — Viền chữ nhật section 1 (/about)

**Date:** 2026-06-19
**File liên quan:** `pubzi-nextjs/src/app/about/page.tsx`
**Trạng thái:** Đã chốt giải pháp (chưa implement)

---

## 1. Problem statement

Section 1 trang `/about` có khung video portal (xoáy tím). Quanh mép video xuất hiện **viền chữ nhật tối** làm user khó chịu — video trông bị "đóng khung" thay vì hoà liền vào nền vũ trụ đen.

User xác nhận (qua hỏi đáp):
- Thủ phạm = **dải feather quanh mép video** → phần tử `.ab2-frame-mask`.
- Kết quả mong muốn = **mép video hoà tan mềm vào nền đen** (feather thật, không viền).

## 2. Root cause (đã verify bằng đọc code + git)

`.ab2-frame-mask` dùng 4 `linear-gradient` đổ màu nền `#08060f` vào trong; độ rộng dải hoà tan = biến CSS `--feather`.

- `--feather` khởi tạo `0px` ở CSS default (page.tsx ~L701) VÀ ở `gsap.set(frame, {... '--feather':'0px'})` (page.tsx ~L285).
- **Không có animation nào tăng `--feather` > 0.** Comment trong code ("--feather grows during the morph", "GSAP animates the four --f-* insets") mô tả hành vi KHÔNG tồn tại.
- Với feather=0: mọi color-stop dồn về 0px → dải hoà tan biến mất, chỉ còn **viền `#08060f` mảnh ~1px sát 4 cạnh** (anti-alias mép `inset:0`) = đúng cái viền gây khó chịu.

**Git:** `git log -S feather` → chỉ commit `868f081` ("Refine about page scroll transitions") động tới. Diff cho thấy commit này **tạo MỚI** `.ab2-frame-mask` với `--feather:0px` ngay từ đầu.
→ Feather **CHƯA TỪNG hoạt động**. Đây là **feature dở dang / dead code**, KHÔNG phải regression. Không có "giá trị đẹp cũ" để khôi phục → phải đề xuất giá trị mới.

## 3. Approaches

### A. Hồi sinh feather bằng giá trị tĩnh ✅ (CHỌN)
Set `--feather` về giá trị thật cố định (vd `clamp(80px, 12vw, 220px)`) ở CSS default + dòng `gsap.set` L285. Xoá comment lỗi thời.
- **Pros:** Đúng 100% ý đồ "hoà tan mềm". Tái dùng cơ chế đã có (DRY). Nhỏ, KISS — chỉ sửa giá trị ở 2 chỗ. `pointer-events:none` + nằm trên wrap không-transform → KHÔNG ảnh hưởng scroll/zoom/layout.
- **Cons:** Cần canh giá trị cho đẹp. Đây là *triển khai mới* (feather chưa từng chạy) nên phải test, không phải sửa-lỗi-1-dòng.

### B. Đổi sang vignette radial-mask
Thay 4 gradient thẳng bằng `mask-image: radial-gradient(...)` trên `.ab2-stage` (pattern đã có ở L627, L1276).
- **Pros:** Mép tan đều, không lo viền 1px.
- **Cons:** Đổi "khung chữ nhật mềm" → "oval", lệch ý đồ squared. Đụng cấu trúc nhiều hơn A.

### C. Xoá hẳn frame-mask
Bỏ `<span className="ab2-frame-mask" />` + CSS → full-bleed sạch, chạm sát biên.
- **Pros:** Đơn giản nhất, hết viền tức thì.
- **Cons:** Mất hiệu ứng "hoà vào không gian" → KHÔNG khớp lựa chọn "hoà tan mềm" của user.

## 4. Recommended solution: **A**

Khớp đúng mong muốn của user, nhỏ gọn, an toàn, tái dùng cơ chế thiết kế sẵn.

**Điểm sửa (cho bước implement):**
1. CSS `.ab2-frame-mask` (~L696-701): `--feather: 0px` → giá trị thật, vd `clamp(80px, 12vw, 220px)`. Có thể tách feather mép trên/đáy nhỏ hơn trái/phải nếu cần.
2. `gsap.set(frame, {...})` (~L285): cập nhật `--feather` cho khớp (hoặc bỏ override `--feather` ở đây để CSS default cầm trịch — nhưng vẫn giữ `--f-*` insets = 0).
3. Xoá/sửa comment lỗi thời L692-710 (mô tả animation không tồn tại).
4. Kiểm tra block mobile (`!important` ở L1478-1483, L1698-1703) — đảm bảo không vô tình bật feather to trên mobile gây tối màn nhỏ.

## 5. Risks & validation

- **Risk:** Feather mép trên quá to → làm tối tiêu đề "Sẵn sàng đưa game...". → Mitigate: feather mép trên/đáy nhỏ hơn, hoặc test giá trị đồng đều trước rồi tinh chỉnh.
- **Risk:** Feather chưa từng render → cần mắt nhìn thật. → Validation: `npm run dev`, vào /about, Ctrl+Shift+R; chỉnh con số `clamp()` tới khi mép tan mượt, không còn đường viền cứng.
- **Không** ảnh hưởng: scroll-zoom (đã tách `--feather` khỏi mọi timeline), fade-in section (cơ chế `.ab2-ready` độc lập), layout (pointer-events:none).

## 6. Next steps

- [ ] Implement theo Phương án A (4 điểm sửa trên).
- [ ] Tinh chỉnh giá trị `clamp()` bằng mắt trên desktop + mobile.
- [ ] (Tuỳ chọn) Nếu sau này muốn feather "lớn dần khi morph" như comment mô tả → thêm tween `--feather` vào `portalTl`. KHÔNG làm bây giờ (YAGNI).
