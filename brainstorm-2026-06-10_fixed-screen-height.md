# Brainstorm: Fixed Screen Height cho Hero Section

**Date:** 2026-06-10  
**Status:** Consensus Reached  
**Complexity:** Low

---

## Problem Statement

Section 1 (HeroSection7) hiện dùng `minHeight: '110vh'` → phụ thuộc viewport browser:
- Desktop: resize window → section thay đổi
- Mobile: toolbar ẩn/hiện → section nhảy cao/thấp
- Zoom: browser zoom in/out → layout shift

**Requirement:** Section phải cố định theo màn hình vật lý thiết bị, không đổi dù browser resize/zoom/toolbar.

---

## User Requirements

✅ **Confirmed:**
- Target devices: Desktop, Laptop, Mobile, Tablet (all)
- Zoom behavior: Giữ nguyên pixel thực, không scale theo zoom
- Full screen: 100% màn hình vật lý
- Hydration flash: Chấp nhận (đã có Preloader)

---

## Evaluated Approaches

### ❌ Approach 1: CSS dvh/svh
**Rejected** - Vẫn theo viewport, không phải screen

```css
minHeight: '100dvh'
```

**Pros:**
- Pure CSS, no JS
- Mobile toolbar auto-adjust

**Cons:**
- ❌ KHÔNG giải quyết yêu cầu cốt lõi
- ❌ Desktop resize window → vẫn thay đổi
- ❌ Vẫn phụ thuộc viewport, không phải screen vật lý

---

### ❌ Approach 2: Fixed Padding (Template gốc)
**Rejected** - Không responsive

```css
padding: 220px 0 0;
```

**Pros:**
- Đơn giản nhất

**Cons:**
- ❌ Không responsive
- ❌ Không tận dụng full màn hình

---

### ✅ Approach 3: JavaScript + window.screen.height (RECOMMENDED)
**Accepted** - Đáp ứng chính xác yêu cầu

```tsx
const [height, setHeight] = useState('100vh');
useEffect(() => {
  setHeight(`${window.screen.height}px`);
}, []);
```

**Pros:**
- ✅ Cố định tuyệt đối theo màn hình vật lý
- ✅ Không đổi dù browser resize/zoom/toolbar
- ✅ Đơn giản, dễ kiểm soát (YAGNI/KISS)
- ✅ Kiểm soát toàn bộ logic

**Cons:**
- ⚠️ SSR hydration: flash nhẹ ~100ms (chấp nhận)
- ⚠️ Multi-monitor: lấy primary screen (edge case hiếm)
- ⚠️ Màn khác nhau → height khác nhau (có thể clamp nếu cần)

---

## Final Recommended Solution

### **Implementation Code**

```tsx
'use client';
import { useEffect, useState } from 'react';

export default function HeroSection7() {
  const [sectionHeight, setSectionHeight] = useState('100vh'); // SSR fallback
  
  useEffect(() => {
    // Get physical screen height
    const screenH = window.screen.height;
    setSectionHeight(`${screenH}px`);
    
    // Optional: Set CSS variable for global usage
    document.documentElement.style.setProperty('--real-screen-height', `${screenH}px`);
  }, []);

  return (
    <div 
      className="hero-section hero-7" 
      style={{
        minHeight: sectionHeight, // Changed from '110vh'
        // ... rest of styling unchanged
      }}
    >
      {/* All content unchanged */}
    </div>
  );
}
```

### **Why This Solution?**

1. **Đáp ứng chính xác yêu cầu:** Fixed theo screen, không theo viewport
2. **YAGNI/KISS:** Minimal code, không over-engineer
3. **Template pattern:** Buyer files cũng tránh vh/vw (dùng fixed px)
4. **Preloader có sẵn:** Hydration flash không ảnh hưởng UX

---

## Implementation Considerations

### **Responsive Behavior**

| Device | Screen Height | Section Height |
|--------|---------------|----------------|
| iPhone 15 Pro | 852px | 852px |
| iPad Pro 11" | 1668px | 1668px (có thể quá cao) |
| Laptop 1366x768 | 768px | 768px |
| Desktop 1920x1080 | 1080px | 1080px |
| 4K 2560x1440 | 1440px | 1440px (có thể quá cao) |

### **Optional: Clamp cho UX tốt hơn**

Nếu thấy màn lớn quá cao, màn nhỏ quá thấp:

```tsx
useEffect(() => {
  const screenH = window.screen.height;
  const clampedH = Math.min(Math.max(screenH, 700), 1200);
  setSectionHeight(`${clampedH}px`);
}, []);
```

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hydration flash | Low | Preloader che giấu |
| Multi-monitor inconsistency | Very Low | Edge case, ít xảy ra |
| Màn hình quá lớn/nhỏ | Medium | Thêm clamp() nếu cần |
| SSR mismatch | Low | Fallback 100vh |

---

## Success Metrics

✅ **Section giữ nguyên height khi:**
- Desktop resize browser window
- Mobile scroll (toolbar ẩn/hiện)
- Browser zoom in/out
- Fullscreen mode toggle

✅ **No layout shift sau preloader**

---

## Next Steps

1. Implement solution vào `HeroSection7.tsx`
2. Test trên:
   - Desktop: resize window + zoom
   - Mobile: scroll + toolbar behavior
   - Tablet: orientation change
3. Optional: Thêm clamp nếu cần responsive
4. Deploy + monitor user feedback

---

## Decision Rationale

**Rejected alternatives:**
- `dvh/svh` - Không giải quyết desktop resize
- Fixed padding - Không responsive
- CSS aspect-ratio - Không giải quyết vấn đề gốc

**Chosen:** JS + screen.height
- Duy nhất approach đáp ứng "cố định theo màn hình vật lý"
- Trade-offs chấp nhận được (hydration, multi-monitor)
- KISS principle: đơn giản, hiệu quả

---

## References

- `/Users/minthep/.../pubzi-nextjs/src/components/home-7/HeroSection7.tsx` (current)
- `/Users/minthep/.../Buyer files/index-2.html` (template gốc - dùng fixed padding)
- Browser APIs: `window.screen.height` (physical screen, not viewport)

---

**Implementation ready:** Yes  
**Create detailed plan?** Pending user confirmation
