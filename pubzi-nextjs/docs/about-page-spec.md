# /about - Spec nhanh để giao việc

File chính: `src/app/about/page.tsx` (1 file, CSS-in-JS `<style jsx global>`, GSAP + ScrollTrigger).
Stack: Next.js 16 (Turbopack), client component. Fonts: SVN Sohne Breit Extrafett (title), SVN Martian Mono (body). Accent tím `--ab2-accent: #9f8cff`, `--ab2-accent-strong: #c2b4ff`.

## Lưu ý cứng
- `body` toàn site bị `text-transform: uppercase` (typography.css h6 + global) → mọi text mặc định HOA. Muốn chữ thường phải set `text-transform: none` thủ công.
- `.ab2-content` có `isolation: isolate` + nền đặc → video `.ab2-fixed-video` (fixed, z-index 1) KHÔNG xuyên qua được.
- GSAP effect `useEffect` return sớm nếu `prefers-reduced-motion` → reveal phải có fallback CSS hiện full.
- Reveal là scrub theo scroll position (không phải timed).

## Các section
1. `.ab2-hero` - portal scroll-ra-video. **CẤM ĐỘNG** (hero 240dvh, `.ab2-portal-frame` scale 6.4, fixed video).
2. `.ab2-manifesto` - letterbox portal, chữ thường (hoa đầu câu), clip-path line wipe + parallax video + settle. Class: `.ab2-letterbox`, `.ab2-line` (clip window), `.ab2-line-inner` (transform target), `.ab2-hl` (highlight tím).
3. `.ab2-layers` - đã đổi thành showcase: ảnh lớn + stack 4 lớp vận hành. Data: `OPERATING_LAYERS`. Reveal: scrub scale+y.
4. `.ab2-process` - sticky visual trái + 3 step vận hành. Data: `WORK_STEPS`. Parallax `.ab2-process-visual-inner`.
5. `.ab2-principles` - mosaic nguyên tắc dài hạn (`.ab2-principle-item`), không còn rail 4-col đều nhau.
6. `.ab2-proof` - portfolio board grid, caption nằm ngoài ảnh qua `.ab2-proof-media`, có parallax ảnh nội bộ.
7. `.ab2-cta` - CTA cuối, 2 nút (`.ab2-btn-primary/secondary`), copy đã đổi theo hướng local partner dài hạn.

## Hiện trạng sau lượt polish
Section 3-7 đã bớt đồng đều: layers dùng showcase, process dùng sticky visual, principles dùng mosaic, proof dùng board có caption ngoài ảnh, CTA có border top. Motion vẫn giữ GSAP + ScrollTrigger, thêm parallax nhẹ cho proof media.

## Đã có / verify
- Build sạch (`npm run build`).
- Dev server: PID 89972 trên :3000 (chạy sẵn từ trước).
- Verify browser bằng puppeteer-core (Chrome for Testing ở `~/.cache/puppeteer`).
- Brainstorm + plan: `docs/brainstorm-about-section2-letterbox-2026-06-18.md`, `plans/2026-06-18-about-section2-letterbox/`.
