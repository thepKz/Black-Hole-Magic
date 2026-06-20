# Brainstorm — Companion /game: zero-g fling physics + soft bounds + tumble

**Date:** 2026-06-20
**File:** `pubzi-nextjs/src/components/game/GameCompanion3D.tsx`
**Trạng thái:** Chốt — triển khai ngay

## Problem (user test bản page-coords absolute)
1. **Clamp cứng** — kéo ra mép dừng khựng.
2. **Ném không trôi** — đảo quyết định cũ (drop-and-stay) → muốn fling bay tiếp (inertia).
3. **Xoay đều nhàm** — `rotation = sin/phase` cố định, đoán trước được.
4. **Mong muốn:** cảm giác **phi hành gia trôi vũ trụ** (theme blackhole) — ném bay tiếp + lộn theo đà.

## Quyết định (hỏi user)
- **Trôi:** zero-gravity, **trôi LÂU ~2-4s** rồi tắt (damping ~0.985). Không hút về tâm (chọn trôi tự do).
- **Biên:** **mép mềm đàn hồi** (lò xo kéo lại), không khựng, không mất nhân vật.
- **Xoay:** **lộn theo đà ném** (fling→angular velocity) + **trôi xoay nhẹ ngẫu nhiên** khi đứng yên. Bỏ xoay sin cố định.

## Mô hình vật lý (linear + angular momentum)
Refs: `vel{x,y}` (px/frame), `spin{x,y}` (rad/frame), sample buffer cho fling velocity.

**Hằng số (đã tune):**
```
LINEAR_DAMPING   = 0.985   // zero-g, trôi 2-4s
STOP_SPEED       = 0.02    // px/frame → dừng, về idle
MAX_FLING_SPEED  = 60      // px/frame clamp
VELOCITY_WINDOW  = 90      // ms sample cho fling
EDGE_SOFT        = 0.018   // độ cứng lò xo mép (accel = -k*overshoot)
EDGE_DAMP_OUT    = 0.86    // damping mạnh khi ngoài biên (kéo về nhanh)
SPIN_DAMPING     = 0.97    // spin tắt dần chậm
SPIN_FROM_FLING  = 0.00018 // rad/frame mỗi px/frame vel (fling→spin)
SPIN_MAX         = 0.16    // rad/frame clamp
IDLE_SPIN_Y      = 0.0016  // spin nền khi đứng yên (trôi nhẹ)
IDLE_BOB_AMP/HZ  = 8 / 0.15
```

**Drift loop (mode='drifting'):**
- `pos += vel*f; vel *= LINEAR_DAMPING^f`
- **Mép mềm** (theo VIEWPORT hiện tại, không phải mép trang — vì absolute page-coords, vùng nhìn = scrollX/Y..+innerW/H): tính overshoot ngoài `[viewLeft+PAD, viewRight-box-PAD]` & tương tự Y; nếu vượt → `vel += -EDGE_SOFT*overshoot`; nếu đang ngoài biên → `vel *= EDGE_DAMP_OUT`. Không hard-clamp pos → mượt, đàn hồi.
- Dừng khi `|vel| < STOP_SPEED` & spin nhỏ → mode='idle', anchor=pos.

**Angular (mọi mode):**
- Fling: `spin.x += clamp(vel.x * SPIN_FROM_FLING ...)` (ném ngang→lộn quanh trục Y... map: vel.x→rotation.y spin; vel.y→rotation.x spin). `spin *= SPIN_DAMPING^f`.
- Idle: spin tiến về nền nhỏ (`IDLE_SPIN_Y` quanh y + dao động rất nhẹ x/z theo seed). Bob box.
- `modelGroup.rotation.{x,y,z} += spin.*` (tích luỹ, không set tuyệt đối) → tumbling thật, không lặp.

**Drag:** sample vận tốc con trỏ; thả → vel = fling velocity, spin += theo fling. Không clamp cứng lúc kéo (cho kéo sát/qua mép mềm).

## Lý do (three.js / game feel)
- Damping cao = ít "ma sát" = cảm giác chân không. 0.985^60 ≈ 0.4 → sau 1s còn 40% tốc độ → trôi 2-4s tự nhiên.
- Tích luỹ rotation bằng angular velocity (không set `=sin`) → không bao giờ lặp y hệt → "sống".
- Mép mềm bằng lò xo (accel tỉ lệ overshoot) → biên vô hình, vật luôn quay lại, không khựng.
- Biên theo viewport (không theo trang) → nhân vật luôn trong tầm nhìn dù đang ở page-coord nào.

## Giữ nguyên (không đụng)
- `position:absolute` page-coords trong `.gm-root`, /game-only, native scroll, không Lenis.
- three.js scene, dispose, reduced-motion fallback, visibilitychange, grip pad hẹp, size 820/420, model 3d_9.
- Double-click = về home portal.

## Risks
- Trôi + cuộn trang đồng thời: biên theo viewport hiện tại nên vẫn đúng tầm nhìn; pos là page-coord nên khi cuộn vật "ở lại trang" — đúng mô hình cũ. OK.
- Fling cực mạnh: clamp MAX_FLING_SPEED + mép mềm chặn bay mất.
- Mobile: spin/inertia nhẹ hơn (vận tốc touch khác) — clamp lo; test lại.

## Verify
- Ném mạnh → trôi 2-4s, lộn theo hướng ném, chậm dần dừng. Kéo ra mép → đàn hồi đẩy lại, không khựng, không mất. Đứng yên → trôi xoay nhẹ tự nhiên (không lặp cứng). Double-click → về portal. Mobile kéo/ném OK, cuộn chỗ khác OK.
