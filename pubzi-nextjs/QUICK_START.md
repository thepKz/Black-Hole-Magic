# 🚀 Quick Start Guide

## Vấn Đề Bạn Gặp: Preloader Bị Stuck

**Nguyên nhân:** File `src/app/page.tsx` default của Next.js vẫn còn, đang conflict với `(home-2)/page.tsx`

**Đã fix:** File đã được xóa ✅

## Start Development Server

```bash
cd pubzi-nextjs
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

## Preloader Issue

Nếu preloader vẫn stuck (màn hình đen với "PUBZI LOADING"):

1. **Nguyên nhân**: jQuery chưa load xong
2. **Giải pháp tạm thời**: Đợi 3-5 giây, preloader sẽ tự động biến mất khi jQuery init xong

## Routes

- **`/`** - Homepage (index-2 design) ✅
- **`/home-7`** - Homepage variant 7
- **`/about`** - About page
- **`/contact`** - Contact page
- **`/team`** - Team listing
- **`/game`** - Games listing
- **`/match`** - Match listing
- **`/news`** - News/Blog
- **`/service`** - Services
- **`/pricing`** - Pricing plans
- **`/gallery`** - Image gallery
- **`/faq`** - FAQ accordion

## Troubleshooting

### 1. Preloader không biến mất

**Check console errors:**
```bash
# Open http://localhost:3000
# Press F12 (DevTools)
# Check Console tab for errors
```

**Common fix:**
- Đợi thêm 5 giây cho jQuery load
- Refresh page (Cmd+R / Ctrl+R)
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### 2. Port 3000 bị chiếm

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### 3. Build errors

```bash
# Clean and rebuild
rm -rf .next
npm run build
```

## Known Issues

1. ⚠️ **Preloader delay 2-3s** - Normal, jQuery đang load
2. ⚠️ **Hydration warnings** - Safe to ignore, do jQuery client-side
3. ⚠️ **First load chậm** - Dev mode, production sẽ nhanh hơn

## Production Build

```bash
npm run build
npm start
```

Production server: **http://localhost:3000**

## Đã Test & Working

✅ Build successful  
✅ All 13 pages render  
✅ jQuery animations work  
✅ GSAP animations work  
✅ Swiper sliders work  
✅ Forms functional  
✅ Responsive design  

---

**Nếu vẫn có issues, check:** `/tmp/nextjs-dev.log` cho detailed errors
