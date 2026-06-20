# Brainstorm — Companion: "đi theo scroll" khi nảy mép (coord-space bug)

**Date:** 2026-06-20
**File:** `pubzi-nextjs/src/components/game/GameCompanion3D.tsx`
**Trạng thái:** Chốt — fix ngay

## Problem
Section 1 OK. Section 2+ : khi model đang **nảy mép / trôi** (sau khi ném lên-xuống) mà user **cuộn trang**, model **bị kéo đi theo scroll**. Ném lên (chưa chạm biên) thì không bị; chỉ bị khi chạm biên (đầu/cuối trang).

## Root cause (xác định chắc)
Trộn 2 hệ toạ độ:
- `pos` = **page coords** (absolute trong `.gm-root`, cố định trong trang).
- `applySoftEdges()` tính biên theo **VIEWPORT** (`window.scrollY + innerHeight`, `scrollX + innerWidth`).

Khi `drifting` và user cuộn → `scrollY` đổi → biên viewport dịch → lò xo mép (`vel += -k*overshoot`) đẩy `pos` theo viewport → **model trượt theo scroll**. Idle không lỗi (không có lực mép). Đây là lỗi do CHÍNH mình cố ý làm biên "viewport-based" để giữ vật trong tầm nhìn — nhưng nó phá mô hình page-coord.

## Quyết định (user)
**Biên theo TRANG.** `applySoftEdges` đổi từ viewport sang page bounds (khớp `clampHard`: X∈[EDGE_PAD, container.clientWidth-box-EDGE_PAD], Y∈[EDGE_PAD, container.scrollHeight-box-EDGE_PAD]). Cuộn trang không còn ảnh hưởng. Nhất quán "thả đâu nằm đó trong trang".

Đánh đổi (user chấp nhận): ném mạnh có thể trôi ra ngoài tầm nhìn hiện tại (nhưng cuộn tới sẽ thấy) — đúng bản chất page-coord.

## Fix (1 hàm)
`applySoftEdges(f)`: bỏ `window.scrollX/Y + innerW/H`; dùng:
```
const left = EDGE_PAD;
const right = container.clientWidth - boxSize.current - EDGE_PAD;
const top = EDGE_PAD;
const bottom = container.scrollHeight - boxSize.current - EDGE_PAD;
```
Phần còn lại (lò xo + damping ngoài biên) giữ nguyên. Không đụng drag/spin/idle.

## Risk
- `container.scrollHeight` đổi khi catalog filter đổi chiều cao → đã có ResizeObserver re-clamp; biên page tự đúng theo scrollHeight mới.
- Nếu box > viewport height thì `bottom` vẫn ≥ top (clamp Math.max). OK.

## Verify
- Section 2+: ném model lên/xuống cho chạm biên → trong lúc nó nảy/trôi, CUỘN trang → model KHÔNG đi theo, ở lại toạ độ trang. Thả đâu nằm đó. Cuộn qua là trôi khỏi tầm nhìn, cuộn lại thấy nguyên chỗ.
