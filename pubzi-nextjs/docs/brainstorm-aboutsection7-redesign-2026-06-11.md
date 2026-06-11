# Brainstorm: AboutSection7 Redesign - Blackhole Game

**Ngày:** 2026-06-11  
**Component:** `src/components/home-7/AboutSection7.tsx`

## Yêu cầu

### Content mới
- **Tầm nhìn 2030:** Blackhole Game định vị là Hệ sinh thái Co-Publishing tiêu chuẩn, Local Partner top-of-mind cho dev game quốc tế tại Đông Nam Á
- **Sứ mệnh:** Cổng kết nối game quốc tế với 100M người chơi SEA, đặt VN lên bản đồ gaming toàn cầu

### Technical requirements
1. **GSAP ScrollTrigger + SplitText:** Chữ hiện từng ký tự khi scroll với stagger effect
2. **3D Model loading:** Circular progress spinner % (0-100%), không giật lag
3. **Layout:** 2 cột - 3D trái, content phải
4. **Background:** Section 2 giảm opacity để thấy video Hero mờ mờ
5. **Giữ nguyên 3D model** (không xóa)

## Giải pháp đã chọn

### 1. GSAP Animation
**Plugin:** `gsap-trial/SplitText` (GSAP Club plugin)
- Split text thành `chars` và `words`
- Stagger animation: 0.02s delay giữa các ký tự
- Effect: `opacity: 0 → 1`, `y: 20 → 0`, `rotateX: -90 → 0`
- Ease: `back.out(1.2)` cho bouncy effect
- ScrollTrigger: start `top 80%`, play once

**Tại sao:**
- SplitText cho phép animate từng ký tự mượt mà
- Không cần xử lý DOM thủ công
- Performance tốt với GSAP engine

### 2. 3D Loading Indicator
**Style:** Circular SVG progress ring
- SVG circle với `stroke-dasharray` động
- Hiển thị % text ở center
- GLTFLoader progress callback: `xhr.loaded / xhr.total * 100`
- Fade out khi load complete (100%)

**Tại sao:**
- Circular design phù hợp gaming aesthetic
- SVG native, không cần library
- Smooth progress tracking từ THREE.js loader
- Không blocking render

### 3. Layout Architecture
**Structure:** Bootstrap grid 2 cột (col-lg-5 + col-lg-7)
- **Trái:** 3D model + background shapes
- **Phải:** Tầm nhìn + Sứ mệnh (vertical stack)

**Content hierarchy:**
```
- Tagline: "VỀ BLACKHOLE GAME" (uppercase, purple)
- H2: "Tầm nhìn 2030" (32px, bold)
- P: Vision text (16px, opacity 0.85)
- H2: "Sứ mệnh" (32px, bold)
- P: Mission text (16px, opacity 0.85)
```

**Tại sao:**
- Maintain existing responsive behavior
- Clear visual hierarchy
- 3D vẫn prominent nhưng không át content

### 4. Background Transparency
**Implementation:**
```css
background: 
  radial-gradient(rgba(108,92,231,0.12) ...), 
  linear-gradient(rgba(18,10,50,0.7) → rgba(6,6,10,0.8));
background-color: rgba(11,7,29,0.4);
```

**Effect:**
- Section 2 semi-transparent (opacity 0.4-0.8)
- Hero video visible nhưng subtle
- Gradient overlay giữ depth

**Tại sao:**
- Video Hero fixed → thấy xuyên qua section 2
- Opacity layers tạo depth hierarchy
- Không làm content khó đọc

## Implementation Details

### Dependencies
```json
{
  "gsap": "^3.15.0",
  "gsap-trial": "^latest"
}
```

### Key Files
- `AboutSection7.tsx`: Main component
- `gsap-trial.d.ts`: TypeScript declarations cho SplitText

### Performance Optimizations
1. **3D Loading:** Progressive loading với requestAnimationFrame
2. **GSAP Context:** Cleanup với `ctx.revert()` tránh memory leak
3. **ScrollTrigger:** Lazy init, chỉ play once
4. **useState:** Track loading progress minimal re-renders

## Validation Criteria

✅ **Build success:** `npm run build` pass  
✅ **TypeScript:** No errors  
✅ **Animation:** Split text scroll trigger hoạt động  
✅ **3D Loading:** Circular progress 0-100%  
✅ **Background:** Video Hero visible mờ qua section 2  
✅ **Content:** Tầm nhìn + Sứ mệnh hiển thị đúng  

## Next Steps
- Test trên mobile (responsive)
- Verify animation performance trên slow devices
- A/B test readability với background opacity variations

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| gsap-trial license | Trial OK cho dev, cần GSAP Club cho production |
| SplitText perf trên long text | Limit animation đến 2-3 đoạn text |
| 3D loading lag | Progressive loading, fallback skeleton |
| Video background distraction | Opacity 0.4-0.7, subtle motion |

---
**Status:** ✅ Implemented  
**Build:** ✅ Pass  
**TypeScript:** ✅ No errors
