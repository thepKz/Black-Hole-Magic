---
status: pending
created: 2026-06-10
brainstorm: brainstorm-2026-06-10_fixed-screen-height.md
---

# Implementation Plan: Fixed Screen Height for HeroSection7

## Overview
Thay đổi HeroSection7 từ viewport-based height (vh) sang physical screen-based height (px) sử dụng `window.screen.height`.

## Problem
- Current: `minHeight: '110vh'` phụ thuộc viewport browser
- Desktop resize window → section thay đổi
- Mobile toolbar ẩn/hiện → section nhảy
- Browser zoom → layout shift

## Solution
JavaScript + window.screen.height để lấy physical screen height và set fixed pixel height.

---

## Implementation Steps

### Step 1: Add React Hooks Import
**File:** `pubzi-nextjs/src/components/home-7/HeroSection7.tsx`  
**Line:** 1

**Current:**
```tsx
'use client';
```

**Change to:**
```tsx
'use client';
import { useEffect, useState } from 'react';
```

**Why:** Cần useState để store height value và useEffect để run client-side code.

---

### Step 2: Add State Management
**File:** `pubzi-nextjs/src/components/home-7/HeroSection7.tsx`  
**Location:** Đầu function component (sau line 3)

**Add:**
```tsx
export default function HeroSection7() {
  const [sectionHeight, setSectionHeight] = useState('100vh');
  
  // rest of component...
```

**Why:** 
- Default '100vh' là SSR fallback
- Client-side sẽ update thành actual screen height

---

### Step 3: Add useEffect for Screen Height Detection
**File:** `pubzi-nextjs/src/components/home-7/HeroSection7.tsx`  
**Location:** Sau state declaration

**Add:**
```tsx
useEffect(() => {
  // Get physical screen height
  const screenH = window.screen.height;
  setSectionHeight(`${screenH}px`);
  
  // Set CSS variable for potential global usage
  document.documentElement.style.setProperty('--real-screen-height', `${screenH}px`);
}, []);
```

**Why:**
- `window.screen.height` returns physical screen height in pixels
- Empty dependency array `[]` means run once on mount
- CSS variable allows other components to reuse if needed

---

### Step 4: Update minHeight Style
**File:** `pubzi-nextjs/src/components/home-7/HeroSection7.tsx`  
**Line:** 9

**Current:**
```tsx
minHeight: '110vh',
```

**Change to:**
```tsx
minHeight: sectionHeight,
```

**Why:** Dynamic value from state instead of static vh unit.

---

### Step 5: Update marginBottom (Optional Cleanup)
**File:** `pubzi-nextjs/src/components/home-7/HeroSection7.tsx`  
**Line:** 15

**Current:**
```tsx
marginBottom: '-10vh',
```

**Consider:** Có thể giữ nguyên hoặc cũng convert sang fixed px nếu cần consistency.

**Decision:** Giữ nguyên `-10vh` vì:
- Chỉ là overlap effect nhỏ
- vh ở đây không gây vấn đề như minHeight
- YAGNI - không cần thay đổi thêm

---

## Complete Changed Code Preview

```tsx
'use client';
import { useEffect, useState } from 'react';

export default function HeroSection7() {
  const [sectionHeight, setSectionHeight] = useState('100vh');
  
  useEffect(() => {
    const screenH = window.screen.height;
    setSectionHeight(`${screenH}px`);
    document.documentElement.style.setProperty('--real-screen-height', `${screenH}px`);
  }, []);

  return (
    <div className="hero-section hero-7" style={{
      ['--bh-purple' as string]: '#6C5CE7',
      ['--bh-ink' as string]: '#06060A',
      position: 'relative',
      minHeight: sectionHeight, // CHANGED: was '110vh'
      overflow: 'visible',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '100px',
      paddingBottom: '0',
      marginBottom: '-10vh',
    }}>
      {/* Rest unchanged */}
    </div>
  );
}
```

---

## Testing Plan

### Test Case 1: Desktop Resize
**Steps:**
1. Open app in Chrome desktop (1920x1080)
2. Open DevTools, check section height = 1080px
3. Resize browser window to 800x600
4. Check section height remains 1080px (not changing)

**Expected:** Section height không đổi dù window resize

---

### Test Case 2: Browser Zoom
**Steps:**
1. Open app, check initial height
2. Press Ctrl+ (zoom in) several times
3. Check section height remains same px value
4. Press Ctrl- (zoom out)
5. Verify height unchanged

**Expected:** Section giữ nguyên physical pixel height

---

### Test Case 3: Mobile Toolbar
**Steps:**
1. Open on iOS Safari or Chrome mobile
2. Note initial section height
3. Scroll down (toolbar hides)
4. Scroll up (toolbar shows)
5. Verify section height không nhảy

**Expected:** Stable height, no jump when toolbar toggles

---

### Test Case 4: Hydration (SSR → Client)
**Steps:**
1. Hard refresh page (Cmd+Shift+R)
2. Watch for any layout shift during preloader → content transition
3. Check console for hydration warnings

**Expected:** 
- Smooth transition (preloader che)
- No React hydration errors
- Flash acceptable (< 100ms)

---

### Test Case 5: Different Screen Sizes
**Devices to test:**
- Laptop 1366x768 → expect 768px
- Desktop 1920x1080 → expect 1080px
- iPhone 15 Pro → expect ~852px
- iPad Pro → expect ~1668px

**Expected:** Each device uses its own screen.height

---

## Rollback Plan

If issues occur:

**Revert Change:**
```tsx
// Remove useState and useEffect
// Change back to:
minHeight: '110vh',
```

**Why simple:** Single file change, easy to revert.

---

## Edge Cases Handled

### 1. SSR Rendering
- ✅ Default state '100vh' prevents undefined during SSR
- ✅ useEffect only runs client-side

### 2. Window Undefined
- ✅ useEffect ensures window.screen available
- ✅ No server-side access to window

### 3. Multi-Monitor Setup
- ⚠️ window.screen returns primary monitor
- Acceptable: User rarely moves browser between monitors mid-session

### 4. Screen Rotation (Tablet/Mobile)
- ⚠️ Height locked to initial orientation
- Consider: Could add window resize listener if needed (not in scope)

---

## Files Modified

1. **HeroSection7.tsx** - Main implementation
   - Add imports
   - Add state
   - Add useEffect
   - Change minHeight value

**Total:** 1 file, ~10 lines changed

---

## Success Criteria

✅ Section height cố định theo screen vật lý  
✅ Desktop resize không ảnh hưởng  
✅ Mobile toolbar toggle không ảnh hưởng  
✅ Browser zoom không ảnh hưởng  
✅ No hydration errors  
✅ Smooth transition với Preloader  

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Hydration flash | High | Low | Preloader covers it |
| Multi-monitor inconsistency | Low | Low | Edge case, acceptable |
| Screen rotation issue | Medium | Low | Out of scope, can add later |
| SSR mismatch | Low | Low | Proper fallback |

**Overall Risk:** LOW

---

## Timeline Estimate

- Implementation: 5 minutes
- Testing (all cases): 15 minutes
- **Total: 20 minutes**

---

## Future Enhancements (Out of Scope)

1. **Clamp height for better UX:**
   ```tsx
   const clampedH = Math.min(Math.max(screenH, 700), 1200);
   setSectionHeight(`${clampedH}px`);
   ```

2. **Handle screen rotation:**
   ```tsx
   useEffect(() => {
     const handleResize = () => {
       setSectionHeight(`${window.screen.height}px`);
     };
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
   }, []);
   ```

3. **Responsive multiplier per device type:**
   ```tsx
   const multiplier = window.innerWidth < 768 ? 1 : 1.1;
   setSectionHeight(`${screenH * multiplier}px`);
   ```

**Decision:** Keep it simple for now (YAGNI). Add only if user feedback requires.
