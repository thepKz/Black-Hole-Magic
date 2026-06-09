# Pubzi - eSports and Gaming Next.js

Chuyển đổi template HTML Pubzi sang Next.js với TypeScript và App Router.

## 🎯 Features

- ✅ **2 Homepage Variants**: index-2 (default /) và index-7 (/home-7)
- ✅ **10+ Pages**: About, Contact, Team, Game, Match, News, Service, Pricing, Gallery, FAQ
- ✅ **Component-Based Architecture**: 40+ React components được extract từ HTML
- ✅ **jQuery Integration**: Giữ nguyên 100% animations và plugins
- ✅ **GSAP Animations**: ScrollTrigger, SplitText, WOW.js
- ✅ **TypeScript**: Type-safe components
- ✅ **Responsive Design**: Mobile-first approach từ template gốc

## 📁 Project Structure

```
pubzi-nextjs/
├── src/
│   ├── app/
│   │   ├── (home-2)/          # Default homepage (index-2)
│   │   ├── home-7/            # Alternative homepage
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── team/page.tsx
│   │   └── ... (10+ pages)
│   ├── components/
│   │   ├── shared/
│   │   ├── home-2/            # 10 components
│   │   └── home-7/            # 9 components
│   └── lib/                   # jQuery & GSAP setup
└── public/assets/             # CSS, JS, images
```

## 🚀 Quick Start

```bash
cd pubzi-nextjs
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Routing

- `/` - Homepage (index-2)
- `/home-7` - Homepage variant 7
- `/about`, `/contact`, `/team`, `/game`, `/match`, `/news`, `/service`, `/pricing`, `/gallery`, `/faq`

## ⚙️ Technical Stack

- Next.js 15 + App Router
- TypeScript
- jQuery + GSAP (client-side)
- Bootstrap CSS
- Swiper.js

---

**Created by AI-assisted migration**
