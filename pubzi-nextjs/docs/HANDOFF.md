# Bàn giao mã nguồn — Black Hole Game website + CMS

Tài liệu này dành cho người nhận dự án (hoặc khi chuyển sang repo mới). Đọc từ trên xuống là đủ
để chạy được ở máy, hiểu cấu trúc, deploy và tiếp tục phát triển.

- Trạng thái tại thời điểm bàn giao: nhánh `main`, commit `1ab849b` (06/10/2026).
- Production: https://blackholegame.vn (Vercel). Trang công khai chạy được; `/admin` cần làm
  xong mục 6 (biến môi trường + database trên Vercel) mới hoạt động.
- Tài liệu chi tiết đi kèm (cùng thư mục `docs/`):
  - [`DEPLOY-ADMIN.md`](DEPLOY-ADMIN.md) — đưa `/admin` lên Vercel từng bước.
  - [`CONNECT-CMS.md`](CONNECT-CMS.md) — đổi nguồn tin tức / hộp thư liên hệ sang CMS khác.

---

## 1. Tóm tắt dự án

| Đường dẫn | Là gì | Mã nguồn |
|---|---|---|
| `/` | Tự chuyển sang `/vi` hoặc `/en` (cookie `NEXT_LOCALE` → Accept-Language → `vi`) | `src/proxy.ts` |
| `/vi`, `/en` | Trang chủ: banner Kiếm Thế, Dịch vụ phát hành, Game nổi bật, Tin tức mới | `src/app/(site)/[locale]/(home)` |
| `/[locale]/games` | Danh sách game (hiện 1 game: Kiếm Thế) | `src/app/(site)/[locale]/games` |
| `/[locale]/news`, `/[locale]/news/[slug]` | Tin tức: lọc, tìm, phân trang, trang chi tiết, RSS | `src/app/(site)/[locale]/news` |
| `/[locale]/contact` | Form liên hệ (lưu vào `/admin` → Hộp thư) | `src/app/(site)/[locale]/contact` |
| `/[locale]/terms`, `/[locale]/privacy` | Điều khoản, Chính sách (nội dung tĩnh) | `src/site/data/legal.ts` |
| `/admin` | CMS cho biên tập viên: chỉ quản lý Tin tức, Danh mục, Ảnh, Video, Liên hệ, Người dùng | `src/app/(payload)`, `src/cms` |
| `/api/*` | REST của Payload + `/api/health`, `/api/draft`, `/api/revalidate` | `src/app/(payload)/api`, `src/app/(site)/api` |
| `/v2/vi`, `/v2/en`, … | Site cũ, giữ để tham khảo, `noindex`, **không sửa** | `src/app/(v2)`, `src/components`, `src/i18n`, `src/hooks`, `src/lib` |
| `/sitemap.xml`, `/robots.txt` | SEO | `src/app/sitemap.ts`, `src/app/robots.ts` |

Nguyên tắc quan trọng:
- **Ba root layout tách biệt** (route group `(site)`, `(payload)`, `(v2)`). CSS của site cũ có rất nhiều
  `!important` toàn cục; không bao giờ import CSS/component của site cũ vào site mới hoặc ngược lại.
- **Dữ liệu tĩnh (mock)** cho game, banner, dịch vụ, đối tác, thông tin công ty nằm trong
  `src/site/data/*.ts`. **Chỉ tin tức và liên hệ** đi qua CMS.
- Không link nào trên site trỏ tới `/admin`; chỉ gõ tay mới vào được.

## 2. Công nghệ và phiên bản

| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| Node.js | ≥ 20.9 (đã chạy với 24.x) | `engines` trong `package.json` |
| Next.js | 16.3.8 (App Router, Turbopack) | **Có thay đổi lớn so với Next 13–15**: đọc `node_modules/next/dist/docs/` trước khi sửa (xem `AGENTS.md`) |
| React | 19.2 | |
| Payload CMS | 3.90.2 (mọi gói `@payloadcms/*` phải **cùng một phiên bản chính xác**) | yêu cầu Next ≥ 16.3.3 |
| Database | PostgreSQL 17 (dev: Docker; prod: Neon) | adapter `@payloadcms/db-postgres` |
| Lưu ảnh/video | Ổ đĩa `media/` (dev) hoặc Vercel Blob (prod) | `@payloadcms/storage-vercel-blob`, tự bật khi có token |
| CSS | Tailwind CSS v4 | mỗi file CSS dùng `@import "tailwindcss" source(none)` + `@source` (xem mục 9) |
| Icon | `@phosphor-icons/react` | |
| Font | Inter qua `next/font` (latin + vietnamese) | |

Package manager: **npm** (`package-lock.json`). Repo hiện tại: ứng dụng nằm trong thư mục con
`pubzi-nextjs/` của repo `Black-Hole-Magic` → trên Vercel **Root Directory = `pubzi-nextjs`**.

## 3. Cấu trúc thư mục

```
pubzi-nextjs/
├─ docs/                    HANDOFF.md (file này), DEPLOY-ADMIN.md, CONNECT-CMS.md
├─ scripts/vercel-build.mjs build trên Vercel: chạy migration (production) rồi next build
├─ vercel.json              buildCommand + cron đăng bài hẹn giờ
├─ docker-compose.yml       Postgres 17 cho dev (cổng 5440)
├─ .env.example             danh sách ĐẦY ĐỦ biến môi trường, có chú thích
├─ public/
│  ├─ site/                 ảnh của site mới (banners/, games/, brand/, partners/)
│  └─ assets/               ảnh, font, js của site cũ /v2
├─ media/                   ảnh/video upload khi chạy ở máy (KHÔNG commit, đã .gitignore)
└─ src/
   ├─ proxy.ts              (Next 16 "middleware") locale redirect, /v2, header noindex cho /admin
   ├─ app/
   │  ├─ (site)/[locale]/   site mới (root layout riêng): trang chủ, games, news, contact, terms, privacy
   │  ├─ (site)/api/        draft (xem trước), revalidate (webhook xoá cache), health
   │  ├─ (payload)/         admin + REST/GraphQL của Payload (sinh từ template Payload)
   │  ├─ (v2)/              site cũ (root layout + CSS riêng), URL /v2/{vi|en}/...
   │  ├─ sitemap.ts, robots.ts, global-error.tsx
   ├─ site/                 code site mới (alias @site/*)
   │  ├─ data/              MOCK DATA: site.ts, games.ts, banners.ts, services.ts, partners.ts, legal.ts, news.ts (demo)
   │  ├─ i18n/              từ điển vi.ts / en.ts, href(locale, path)
   │  ├─ lib/content/       nguồn tin: payload | http | mock (chọn bằng CONTENT_SOURCE)
   │  ├─ lib/contact/       form liên hệ: schema zod, rate limit, Turnstile, sink payload | http | log
   │  ├─ lib/news.ts        lớp dữ liệu tin (cache, lỗi, bản nháp) mà các trang gọi
   │  ├─ lib/seo.ts         metadata, canonical, hreflang, JSON-LD
   │  ├─ components/        ui/ (bộ component), layout/ (header, footer, chọn ngôn ngữ),
   │  │                     home/, games/, news/ (+ rich-blocks/ render khối bài viết), contact/, motion/, analytics/
   │  └─ styles/site.css    token màu, typography, motion
   ├─ cms/                  Payload (alias @payload-config → src/cms/payload.config.ts)
   │  ├─ payload.config.ts  cấu hình chính
   │  ├─ collections/       News, NewsCategories, Media, Videos, ContactRequests, Users
   │  ├─ editor.ts, blocks/ trình soạn thảo Lexical + 8 khối tuỳ biến
   │  ├─ hooks/             quy trình duyệt bài, chặn xoá khi đang dùng, xoá cache
   │  ├─ access.ts          phân quyền admin / editor / author
   │  ├─ admin/             logo, dashboard, bộ lọc nhanh, nút Gửi duyệt/Trả lại, bản dịch tiếng Việt
   │  ├─ migrations/        migration Postgres (production chỉ dùng cái này)
   │  ├─ seed/              seed dev (index.ts, news.ts, demo-post.ts), bootstrap-admin.ts (prod)
   │  └─ payload-types.ts   type sinh tự động (không sửa tay)
   ├─ shared/               tiện ích dùng chung site + cms (embed URL, cache, preview path)
   └─ components/, i18n/, hooks/, lib/   ← THUỘC SITE CŨ /v2, không dùng cho site mới
```

## 4. Chạy ở máy (lần đầu)

Yêu cầu: Node ≥ 20.9, npm, Docker Desktop, Git.

```bash
cd pubzi-nextjs
npm install
cp .env.example .env
```

Sửa `.env` tối thiểu (xem bảng đầy đủ ở mục 5):

| Biến | Giá trị cho máy dev |
|---|---|
| `DATABASE_URI` | `postgres://dev:dev@127.0.0.1:5440/blackhole` (khớp `docker-compose.yml`) |
| `PAYLOAD_SECRET` | chuỗi ngẫu nhiên: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | tài khoản admin dev bạn tự chọn |

```bash
npm run db:up        # Postgres 17 trong Docker, cổng 5440
npm run seed         # tạo admin + danh mục + bài mẫu
npm run dev          # http://localhost:3000  (admin: http://localhost:3000/admin)
```

Ghi chú khi chạy ở máy:
- Schema DB **tự đồng bộ** (push mode) chỉ khi DB là localhost và không phải production.
- Lỗi khi chạy dev bằng Turbopack thì thử `npm run dev:webpack`.
- Cổng 5440 bị chiếm: đổi cổng trong `docker-compose.yml` và `DATABASE_URI` cho khớp.
- Đăng bài hẹn giờ ở máy chạy tự động mỗi phút (cron trong tiến trình).
- Không cần Docker vẫn chạy được site: bỏ trống `DATABASE_URI` → site hiện trang tin rỗng,
  `/admin` không dùng được. Hoặc `CONTENT_SOURCE=mock` + `CONTENT_MOCK_FIXTURES=true` để xem tin demo.

## 5. Biến môi trường — đầy đủ

Danh sách gốc có chú thích: `.env.example`. Bảng dưới gom theo mục đích.
Cột **Prod** = cần trên Vercel production. **Bí mật** = đánh dấu "Sensitive" trên Vercel, không commit.

### 5.1 Database và CMS

| Biến | Prod | Bí mật | Ý nghĩa |
|---|---|---|---|
| `DATABASE_URI` | **Bắt buộc** | ✔ | Chuỗi Postgres. Prod: chuỗi **pooled** của Neon (host có `-pooler`, kèm `?sslmode=require`) |
| `DATABASE_URI_UNPOOLED` | **Bắt buộc** | ✔ | Chuỗi Neon **trực tiếp**, chỉ dùng chạy migration lúc build |
| `PAYLOAD_SECRET` | **Bắt buộc** | ✔ | Ký phiên đăng nhập. Đổi giá trị = mọi người bị đăng xuất |
| `NEXT_PUBLIC_SITE_URL` | **Bắt buộc** | | `https://blackholegame.vn`. Dùng cho canonical, sitemap, OG, CSRF, xem trước. Gắn vào bản build → đổi phải deploy lại |
| `DB_POOL_MAX` | tuỳ chọn | | số kết nối mỗi instance (mặc định 3 trên Vercel, 10 nơi khác) |
| `DB_CONNECT_TIMEOUT_MS` | tuỳ chọn | | timeout kết nối DB |
| `PAYLOAD_DB_PUSH` | không | | ép bật/tắt push mode (mặc định chỉ bật với DB localhost) |
| `PAYLOAD_CSRF_ORIGINS` | tuỳ chọn | | thêm origin được dùng `/admin` (ví dụ domain admin riêng), cách nhau dấu phẩy |
| `NEXT_PUBLIC_NOINDEX` | Preview | | `true` trên bản preview/staging: robots chặn index |
| `MIGRATE_ON_BUILD` | Preview | | `true` để bản preview chạy migration trên nhánh DB riêng |
| `SKIP_MIGRATE` | không | | `true` để bỏ qua migration khi build |

### 5.2 Tài khoản admin

| Biến | Prod | Bí mật | Ý nghĩa |
|---|---|---|---|
| `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD` | **Không đặt trên Vercel** | ✔ | Chỉ dùng khi chạy `npm run bootstrap:admin` từ máy tin cậy để tạo admin production |
| `ALLOW_FIRST_REGISTER` | **Không** | | cửa thoát tạm: cho phép màn create-first-user khi bảng users trống |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | **Không** | ✔ | chỉ cho `npm run seed` ở máy dev |

### 5.3 Ảnh / video

| Biến | Prod | Bí mật | Ý nghĩa |
|---|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | **Bắt buộc** trên Vercel | ✔ | Vercel tự thêm khi nối Blob store. Có biến này → ảnh/video lên Blob; không có → lưu ổ đĩa `media/` |
| `MEDIA_PASTE_HOSTS` | tuỳ chọn | | thêm host https được phép "Dán URL" ảnh trong admin |
| `CONTENT_MEDIA_ORIGINS` | tuỳ chọn | | thêm origin ảnh cho `next/image` (CDN của CMS ngoài) |

### 5.4 Cache, cron, health

| Biến | Prod | Bí mật | Ý nghĩa |
|---|---|---|---|
| `REVALIDATE_SECRET` | **Nên có** | ✔ | khoá cho `POST /api/revalidate`. Trống = suy ra từ `PAYLOAD_SECRET` |
| `REVALIDATE_ORIGIN` | tuỳ chọn | | địa chỉ server tự gọi chính nó (trống = tự động) |
| `CRON_SECRET` | **Bắt buộc** | ✔ | Vercel Cron gửi `Authorization: Bearer $CRON_SECRET` tới `/api/payload-jobs/run` |
| `PAYLOAD_DISABLE_AUTORUN` | tự động | | trên Vercel cron trong tiến trình tự tắt; đặt `true` nếu tự host nhiều instance |
| `HEALTH_TOKEN` | tuỳ chọn | ✔ | token xem chi tiết `/api/health` (không thì dùng `CRON_SECRET`) |

### 5.5 Form liên hệ và chống spam

| Biến | Prod | Bí mật | Ý nghĩa |
|---|---|---|---|
| `CLIENT_IP_HEADER` | **Nên có** | | Vercel: `x-real-ip`. Nguồn IP thật cho giới hạn gửi form và đăng nhập |
| `TRUSTED_PROXY_HOPS` | tuỳ chọn | | số proxy phía trước khi không dùng header trên (mặc định 1) |
| `CONTACT_IP_SALT` | **Nên có** | ✔ | muối băm IP người gửi |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | tuỳ chọn | secret ✔ | captcha Cloudflare Turnstile. Trống = tắt captcha (vẫn có honeypot + validate) |
| `CONTACT_SINK` | tuỳ chọn | | `payload` \| `http` \| `log`. Trống = payload khi có DB |
| `CONTACT_SINK_URL`, `CONTACT_SINK_TOKEN`, `CONTACT_SINK_SECRET` | khi `CONTACT_SINK=http` | ✔ | gửi form liên hệ sang hệ thống khác (webhook ký HMAC) |

### 5.6 Email (tuỳ chọn, nên có)

| Biến | Ý nghĩa |
|---|---|
| `SMTP_HOST`, `SMTP_PORT` (587 STARTTLS / 465 TLS), `SMTP_USER`, `SMTP_PASS` | máy chủ gửi mail. `SMTP_HOST` trống = không gửi mail |
| `EMAIL_FROM`, `EMAIL_FROM_NAME` | người gửi, mặc định `no-reply@blackholegame.vn`, "Black Hole Admin" |

Không có SMTP thì "Quên mật khẩu" không gửi được thư; admin đặt lại mật khẩu thủ công trong
**Hệ thống → Người dùng → Đổi mật khẩu**.

### 5.7 Nguồn tin từ CMS khác (khi đổi CMS)

| Biến | Ý nghĩa |
|---|---|
| `CONTENT_SOURCE` | `payload` \| `http` \| `mock`. Trống = `payload` khi có `DATABASE_URI`, không có thì trang tin rỗng |
| `CONTENT_MOCK_FIXTURES` | `true` với `mock`: hiện bài demo trong `src/site/data/news.ts` (không dùng ở prod) |
| `CMS_BASE_URL`, `CMS_TOKEN`, `CMS_PREVIEW_TOKEN`, `CMS_PREVIEW_SECRET`, `CMS_TIMEOUT_MS`, `CMS_MEDIA_BASE` | cấu hình nguồn `http` (xem `CONNECT-CMS.md`) |
| `PREVIEW_COOKIE_SECRET`, `PREVIEW_MAX_AGE_SECONDS` | ký cookie xem trước bản nháp |

### 5.8 Tracking (tuỳ chọn)

| Biến | Ý nghĩa |
|---|---|
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (khuyến nghị: cấu hình GA4 + Facebook Pixel bên trong GTM) |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_FB_PIXEL_ID` | dùng trực tiếp khi không có GTM |

Tạo chuỗi bí mật ngẫu nhiên:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 6. Deploy production (Vercel)

Chi tiết từng bước: [`DEPLOY-ADMIN.md`](DEPLOY-ADMIN.md). Tóm tắt:

1. **Project settings:** Framework = Next.js, **Root Directory = `pubzi-nextjs`**, Build Command lấy từ
   `vercel.json` (`npm run vercel-build`). Functions region `sin1` (Singapore).
2. **Database:** Storage → Neon (region Singapore) → thêm `DATABASE_URI` (pooled) và `DATABASE_URI_UNPOOLED`.
3. **Ảnh:** Storage → Blob → Vercel tự thêm `BLOB_READ_WRITE_TOKEN`.
4. **Biến môi trường** theo mục 5 (tối thiểu: `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `CRON_SECRET`,
   `REVALIDATE_SECRET`, `CONTACT_IP_SALT`, `CLIENT_IP_HEADER=x-real-ip`).
5. **Deploy:** `scripts/vercel-build.mjs` chạy `payload migrate` (chỉ production, khi có DB + secret) rồi `next build`.
   Thiếu DB thì build vẫn thành công, site chạy, `/admin` báo chưa cấu hình.
6. **Tạo admin đầu tiên** từ máy tin cậy, trỏ vào DB production:

   ```bash
   DATABASE_URI="<chuỗi Neon>" PAYLOAD_SECRET="<giống Vercel>" \
   BOOTSTRAP_ADMIN_EMAIL="..." BOOTSTRAP_ADMIN_PASSWORD="..." npm run bootstrap:admin
   ```

7. **Cron đăng bài hẹn giờ:** `vercel.json` để `0 0 * * *` (1 lần/ngày) cho chạy được cả gói Hobby.
   Gói Pro: đổi thành `* * * * *`. Gói Hobby: dùng cron ngoài (cron-job.org, GitHub Actions) gọi
   `GET https://blackholegame.vn/api/payload-jobs/run?queue=default` với header
   `Authorization: Bearer <CRON_SECRET>` mỗi phút.
8. **Kiểm tra:** `https://blackholegame.vn/api/health` trả 200; đăng nhập `/admin`; đăng 1 bài thử và xem trên `/vi/news`.

## 7. Chuyển sang repo mới — checklist

### 7.1 Mã nguồn

```bash
# trong thư mục repo hiện tại (Black-Hole-Magic)
git remote add new <URL-repo-mới>
git push new --all        # mọi nhánh
git push new --tags
```

- Muốn repo mới chỉ chứa ứng dụng (không có thư mục `pubzi-nextjs/` lồng bên trong):
  `git subtree split --prefix=pubzi-nextjs -b app-only` rồi `git push new app-only:main`.
  Khi đó trên Vercel đặt **Root Directory = `.`** (để trống).
- Kiểm tra repo mới **không** chứa: `.env`, `media/`, `.next/`, `node_modules/` (đã có trong `.gitignore`).
- Cập nhật link repo trong README nếu có, và quyền truy cập cho người cần.

### 7.2 Vercel

- **Giữ project Vercel cũ, đổi repo:** Project → Settings → Git → Disconnect → Connect repo mới.
  Biến môi trường, domain, Neon, Blob **giữ nguyên**. Kiểm tra lại Root Directory cho đúng với cấu trúc repo mới.
- **Tạo project Vercel mới:** phải làm lại toàn bộ mục 6 (biến môi trường, nối Neon + Blob, domain
  `blackholegame.vn`, region). Chuyển domain: gỡ ở project cũ rồi thêm ở project mới.

### 7.3 Dữ liệu (nếu đổi database hoặc tài khoản Neon/Blob)

- **Database:** `pg_dump` từ DB cũ → `pg_restore`/`psql` vào DB mới (dùng chuỗi kết nối trực tiếp,
  không qua pooler). Sau đó `npm run migrate:status` phải báo không còn migration chờ.
- **Ảnh/video trên Blob:** URL ảnh lưu trong DB trỏ vào store cũ. Nếu đổi store, cần copy file sang
  store mới và cập nhật URL; giữ store cũ thì không phải làm gì.
- **`PAYLOAD_SECRET`:** giữ nguyên giá trị nếu không muốn mọi người bị đăng xuất.

### 7.4 Bí mật cần chuyển giao (qua kênh an toàn, không gửi trong repo/chat)

`DATABASE_URI`, `DATABASE_URI_UNPOOLED`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, `CRON_SECRET`,
`REVALIDATE_SECRET`, `CONTACT_IP_SALT`, khoá Turnstile, SMTP, tài khoản admin `/admin`,
quyền vào Vercel / Neon / GitHub / domain.

## 8. Làm việc hằng ngày

### Lệnh

| Lệnh | Việc |
|---|---|
| `npm run dev` / `npm run dev:webpack` | chạy dev |
| `npm run typecheck`, `npm run lint` | kiểm tra TypeScript / ESLint |
| `npm run build` | build production ở máy |
| `npm run db:up` / `npm run db:down` | bật / tắt Postgres dev |
| `npm run seed`, `seed:news`, `seed:demo-post` | dữ liệu mẫu (chỉ dev) |
| `npm run migrate:create <tên>` | tạo migration sau khi đổi collection/field — **commit cùng thay đổi** |
| `npm run migrate`, `migrate:status` | chạy / xem migration |
| `npm run generate:types` | sinh lại `src/cms/payload-types.ts` |
| `npm run generate:importmap` | sinh lại import map admin (sau khi thêm component admin hoặc khối editor) |
| `npm run bootstrap:admin` | tạo / đặt lại admin (production) |

### Sửa nội dung không qua CMS (mock data)

| Muốn sửa | File |
|---|---|
| Banner trang chủ | `src/site/data/banners.ts` (ảnh trong `public/site/banners/`) |
| Danh sách game, link Trang chủ game / Fanpage | `src/site/data/games.ts` (ảnh trong `public/site/games/`) |
| Dịch vụ phát hành | `src/site/data/services.ts` |
| Đối tác (đang ẩn trên trang chủ) | `src/site/data/partners.ts`; bật lại bằng cách render `PartnersSection` trong `src/app/(site)/[locale]/(home)/page.tsx` |
| Email, hotline, địa chỉ, pháp lý, link Nạp, fanpage | `src/site/data/site.ts` |
| Điều khoản, Chính sách | `src/site/data/legal.ts` |
| Chữ giao diện VI/EN | `src/site/i18n/vi.ts`, `en.ts` |
| Màu, font, spacing | `src/site/styles/site.css` |

### Khi đổi cấu trúc CMS

1. Sửa collection/field trong `src/cms/collections/*`.
2. `npm run generate:types` và (nếu có component admin mới) `npm run generate:importmap`.
3. `npm run migrate:create <tên-ngắn>` → commit file trong `src/cms/migrations/`.
4. Deploy: migration tự chạy trên production.

## 9. Bẫy đã gặp — đọc trước khi sửa

| Bẫy | Cách tránh |
|---|---|
| Next 16 khác Next 13–15 (middleware đổi tên `proxy.ts`, `revalidateTag(tag, 'max')` 2 tham số, `PageProps`…) | đọc `node_modules/next/dist/docs/` |
| Tailwind quét cả cache nhị phân trong `.next` → lỗi "Parsing CSS source code failed" | giữ `@import "tailwindcss" source(none)` + `@source` trong **mọi** file CSS |
| CSS site cũ phá site mới | không gộp root layout; site cũ chỉ sống trong `(v2)` |
| `cn()` trong `src/site/lib/cn.ts` chỉ nối class, **không** gộp class Tailwind trùng | chọn một class bằng điều kiện, đừng truyền 2 class xung đột |
| Không bật `cacheComponents` trong `next.config.ts` | cờ toàn app, làm vỡ admin và site cũ |
| Bài đăng sau khi build bị 404 | trang bài dùng `dynamicParams = true` + revalidate khi đăng (đã làm) |
| Upload JPEG lỗi trên Windows | đã sửa (đọc file tạm vào bộ nhớ trước khi xử lý) |
| Media URL phải là đường dẫn tương đối `/api/media/file/...` ở dev | không đặt `serverURL` trong Payload config |
| Mọi gói `@payloadcms/*` phải cùng phiên bản với `payload` | nâng cấp cùng lúc |

## 10. Việc còn dở / cần công ty cung cấp

Nội dung (tìm `TODO(company)` trong code):
- Link thật Trang chủ game / Fanpage cho Kiếm Thế (`src/site/data/games.ts`); hiện nút "Trang chủ game" ẩn.
- Tên người chịu trách nhiệm nội dung (`site.contentOwner` trong `src/site/data/site.ts`), link YouTube/TikTok.
- 10 logo đối tác thật (`src/site/data/partners.ts`), sau đó bật lại khối Đối tác.
- Banner xuất đúng 1920×720 có vùng an toàn (`src/site/data/banners.ts`).
- Pháp chế duyệt nội dung Điều khoản / Chính sách (`src/site/data/legal.ts`).
- Xác nhận email/hotline thật: `biz@blackhole.vn`, `hotro@blackhole.vn`, `1900 0000`, địa chỉ trụ sở.

Hạ tầng:
- Làm mục 6 trên Vercel (DB, Blob, biến môi trường, admin đầu tiên, cron).
- SMTP để có "Quên mật khẩu" và thông báo.
- Chưa có thông báo cho biên tập viên khi có bài chờ duyệt (cần email trước).
- Chưa tối ưu tìm kiếm full-text (pg_trgm) cho số lượng bài lớn.

Kiểm thử chưa chạy trên production thật: đăng bài hẹn giờ qua cron, upload qua Vercel Blob.

## 11. Liên quan

- Kế hoạch & quyết định thiết kế ban đầu (light theme theo design v2, tỉ lệ tham chiếu corp.funtap.vn):
  thiết kế gốc ở thư mục "Trang chủ BH" (file `Trang chu v2.dc.html`), không nằm trong repo.
- `BRAND_COLORS.md` là bảng màu của **site cũ** /v2, không áp dụng cho site mới (màu site mới trong `src/site/styles/site.css`).
