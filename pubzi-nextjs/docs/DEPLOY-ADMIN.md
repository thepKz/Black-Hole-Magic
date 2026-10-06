# Đưa trang quản trị (/admin) lên production — Vercel

Tài liệu từng bước để `/admin` (Payload CMS) chạy được trên Vercel tại `https://blackholegame.vn`.
Làm theo thứ tự. Mỗi bước có phần **Kiểm tra** để biết đã xong chưa.

> Vì sao hiện tại `/admin` và `/api/*` trả lỗi 500 "There was an error initializing Payload":
> Vercel chưa có `PAYLOAD_SECRET` và `DATABASE_URI`, cơ sở dữ liệu production chưa có bảng,
> ảnh đang lưu vào ổ đĩa (Vercel không giữ file), và lịch đăng bài hẹn giờ cần một cron.
> Trang công khai vẫn chạy vì phần tin tức tự rút về trạng thái rỗng khi không có CMS.

---

## 0. Tổng quan

| Thành phần | Local (máy dev) | Production (Vercel) |
|---|---|---|
| Cơ sở dữ liệu | Docker Postgres `127.0.0.1:5440` | **Neon Postgres** (qua Vercel Marketplace) |
| Cấu trúc bảng | tự đồng bộ (drizzle push) | **migration** trong `src/cms/migrations`, chạy lúc build |
| Ảnh / video | thư mục `media/` | **Vercel Blob** (trình duyệt tải thẳng lên Blob) |
| Đăng bài hẹn giờ | chạy trong tiến trình mỗi phút | cron gọi `/api/payload-jobs/run` (Vercel Cron trên Pro, hoặc cron ngoài — mục 6) |
| Email "Quên mật khẩu" | in ra console | SMTP (tuỳ chọn, mục 8) |
| Tài khoản admin đầu tiên | `npm run seed` | `npm run bootstrap:admin` (mục 5) |

Các file liên quan: `vercel.json`, `scripts/vercel-build.mjs`, `src/cms/payload.config.ts`,
`src/cms/lib/runtime-env.ts`, `src/cms/seed/bootstrap-admin.ts`, `src/app/(site)/api/health/route.ts`,
`.env.example` (danh sách biến đầy đủ).

**Gói Vercel:** `vercel.json` trong repo để cron **1 lần/ngày** (`0 0 * * *`) để deploy chạy được
trên mọi gói (Hobby từ chối mọi lịch dày hơn 1 lần/ngày và **làm hỏng deploy**). Muốn bài hẹn giờ
lên đúng phút: gói **Pro** thì đổi thành `* * * * *`; gói Hobby thì dùng cron ngoài — xem mục 6.
(Website doanh nghiệp theo điều khoản của Vercel cũng thuộc diện dùng Pro.)

---

## 1. Tạo cơ sở dữ liệu Neon

1. Vercel → Project → **Storage** → **Create Database** → chọn **Neon** (Serverless Postgres).
   - Region: **Singapore (ap-southeast-1)** cho gần người dùng Việt Nam, và đặt
     Vercel Functions cùng region (Project → Settings → Functions → Region: `sin1`).
   - Kết nối với môi trường **Production**. Với **Preview**, nên bật "Create database branch for
     deployment" (mỗi preview một nhánh DB riêng) — tuyệt đối không cho Preview dùng DB production.
2. Integration sẽ tạo sẵn các biến `DATABASE_URL` (pooled) và `DATABASE_URL_UNPOOLED`.
   Dự án này đọc tên **`DATABASE_URI`**, nên thêm (Settings → Environment Variables, Production):
   - `DATABASE_URI` = giá trị của `DATABASE_URL` (chuỗi có `-pooler` trong host, kèm `?sslmode=require`).
   - `DATABASE_URI_UNPOOLED` = giá trị của `DATABASE_URL_UNPOOLED` (không có `-pooler`).
     Chỉ dùng để chạy migration lúc build. Nếu bỏ trống, script build tự dùng `DATABASE_URL_UNPOOLED`.

Vì sao hai chuỗi: lúc chạy, nhiều function cùng mở kết nối → dùng cổng pooler (PgBouncer).
Migration chạy DDL và khoá → dùng kết nối trực tiếp.

**Kiểm tra:** Neon Console → Tables trống (bảng sẽ được tạo ở bước 4).

## 2. Tạo kho lưu ảnh Vercel Blob

1. Vercel → Project → **Storage** → **Create** → **Blob** → kết nối với Production (và Preview nếu muốn).
2. Vercel tự thêm `BLOB_READ_WRITE_TOKEN`. Không cần sửa code: khi có biến này, CMS tự chuyển
   ảnh/video sang Blob; không có thì lưu ổ đĩa như local.

Khi bật Blob:
- Biên tập viên kéo thả ảnh/video như cũ; trình duyệt tải **thẳng lên Blob** nên không bị giới hạn
  4,5 MB của Vercel Functions (ảnh tối đa 15 MB, video tối đa 300 MB theo giới hạn của CMS).
- Đường dẫn ảnh có dạng `https://<store>.public.blob.vercel-storage.com/media/...`, phục vụ qua CDN.
  `next.config.ts` tự cho phép đúng host của store này (lấy từ token).
- Ảnh đang có trong thư mục `media/` ở máy dev **không** tự lên production (thư mục này không
  được commit). Production bắt đầu với thư viện ảnh trống; ảnh cần dùng thì tải lại trong admin.

## 3. Biến môi trường

Vercel → Project → Settings → **Environment Variables**. Đánh dấu **Sensitive** cho mọi bí mật.

### Production (bắt buộc)

| Biến | Giá trị | Ghi chú |
|---|---|---|
| `DATABASE_URI` | chuỗi **pooled** của Neon | mục 1 |
| `DATABASE_URI_UNPOOLED` | chuỗi **trực tiếp** của Neon | mục 1, chỉ dùng khi build |
| `PAYLOAD_SECRET` | 64 ký tự ngẫu nhiên | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Đổi giá trị = mọi người bị đăng xuất |
| `NEXT_PUBLIC_SITE_URL` | `https://blackholegame.vn` | dùng cho canonical, sitemap, OG, xem trước bài, CSRF. Gắn vào bản build: **đổi phải deploy lại** |
| `BLOB_READ_WRITE_TOKEN` | (Vercel tự thêm) | mục 2 |
| `CRON_SECRET` | 32+ ký tự ngẫu nhiên | Vercel Cron tự gửi `Authorization: Bearer $CRON_SECRET` |
| `REVALIDATE_SECRET` | 32+ ký tự ngẫu nhiên | khoá cho `POST /api/revalidate`; đặt riêng để đổi `PAYLOAD_SECRET` không ảnh hưởng |
| `CONTACT_IP_SALT` | 32+ ký tự ngẫu nhiên | muối băm IP của form liên hệ |
| `CLIENT_IP_HEADER` | `x-real-ip` | Vercel đặt header này; dùng cho chống spam form và giới hạn đăng nhập |

### Production (tuỳ chọn)

| Biến | Khi nào cần |
|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | muốn "Quên mật khẩu" gửi được email (mục 8) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | captcha cho form liên hệ |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager |
| `MEDIA_PASTE_HOSTS` | thêm host được phép "Dán URL" ảnh (CDN game) |
| `HEALTH_TOKEN` | token riêng để xem `/api/health` chi tiết (không thì dùng `CRON_SECRET`) |
| `DB_POOL_MAX` | số kết nối mỗi instance (mặc định 3 trên Vercel) |

### Preview

- `DATABASE_URI` / `DATABASE_URI_UNPOOLED`: nhánh DB Neon của preview (KHÔNG dùng DB production).
- `PAYLOAD_SECRET`: giá trị khác production.
- `NEXT_PUBLIC_NOINDEX=true` (chặn Google index bản preview).
- Để trống `NEXT_PUBLIC_SITE_URL`: bản build tự dùng URL của preview.
- Muốn preview tự chạy migration trên nhánh DB của nó: `MIGRATE_ON_BUILD=true`.

### Không bao giờ đặt trên Vercel

`BOOTSTRAP_ADMIN_PASSWORD`, `SEED_ADMIN_PASSWORD`, `ALLOW_FIRST_REGISTER` (trừ khi tạm thời, mục 5).

## 4. Deploy: migration chạy tự động

`vercel.json` đặt Build Command = `npm run vercel-build` (`scripts/vercel-build.mjs`):

1. Nếu là deploy **Production** (hoặc `MIGRATE_ON_BUILD=true`) và có `DATABASE_URI` + `PAYLOAD_SECRET`:
   chạy `payload migrate` qua kết nối trực tiếp. **Migration lỗi thì build dừng**, nên code mới không
   bao giờ chạy trên cấu trúc bảng cũ.
2. `next build`.

Vì sao chạy migration lúc build thay vì lúc server khởi động (`prodMigrations`): chỉ chạy một lần cho
mỗi deploy; không có nhiều function lạnh cùng chạy migration một lúc; lỗi chặn deploy thay vì làm
site trả 500.

Thao tác: Deployments → **Redeploy** (hoặc push lên nhánh production).

**Kiểm tra:** log build có dòng `[vercel-build] payload migrate ...` và `Migrated: 2026..._initial`.
Neon Console → Tables có `news`, `users`, `media`, `payload_migrations`...

## 5. Tạo tài khoản quản trị đầu tiên

Trang `/admin/create-first-user` **cố ý bị chặn** (nếu không, ai vào trước khi có tài khoản sẽ thành
admin). Tạo admin từ máy tin cậy bằng script, kết nối thẳng vào DB production:

PowerShell (Windows):

```powershell
cd pubzi-nextjs
$env:NODE_ENV = 'production'
$env:DATABASE_URI = '<chuỗi UNPOOLED của Neon>'
$env:PAYLOAD_SECRET = '<PAYLOAD_SECRET production>'
$env:BOOTSTRAP_ADMIN_EMAIL = 'ten@blackholegame.vn'
$env:BOOTSTRAP_ADMIN_PASSWORD = '<mật khẩu mạnh, từ 12 ký tự>'
npm run bootstrap:admin
Remove-Item Env:BOOTSTRAP_ADMIN_PASSWORD, Env:PAYLOAD_SECRET, Env:DATABASE_URI
```

bash (macOS/Linux):

```bash
cd pubzi-nextjs
NODE_ENV=production DATABASE_URI='<unpooled>' PAYLOAD_SECRET='<secret>' \
BOOTSTRAP_ADMIN_EMAIL='ten@blackholegame.vn' BOOTSTRAP_ADMIN_PASSWORD='<12+ ký tự>' \
npm run bootstrap:admin
```

Script này:
- tạo admin nếu email chưa tồn tại, tạo 3 danh mục tin (Tin game, Sự kiện, Thông báo) nếu chưa có;
- chạy lại bao nhiêu lần cũng an toàn; không in mật khẩu;
- **từ chối chạy** nếu DB chưa có bảng (chưa qua bước 4), và không bao giờ tự sửa cấu trúc bảng.

Sau đó đăng nhập `/admin`, vào **Hệ thống → Người dùng** để tạo tài khoản cho biên tập viên
(vai trò: Quản trị viên / Biên tập viên / Phóng viên).

**Không dùng `npm run seed` / `seed:news` / `seed:demo-post` cho production** (dữ liệu mẫu).

Không có máy để chạy script? Tạm đặt `ALLOW_FIRST_REGISTER=true` trên Vercel, deploy lại, vào
`/admin/create-first-user` tạo admin, rồi **xoá biến và deploy lại ngay**.

### Quên mật khẩu / bị khoá tài khoản

- Có SMTP (mục 8): bấm "Quên mật khẩu?" ở trang đăng nhập.
- Chưa có SMTP: một admin khác vào Người dùng → mở tài khoản → đổi mật khẩu.
- Admin duy nhất bị mất mật khẩu: chạy lại lệnh trên với `BOOTSTRAP_RESET_PASSWORD=true`
  (đặt mật khẩu mới và mở khoá). `BOOTSTRAP_PROMOTE=true` cấp quyền admin cho email đã có.
- Nhập sai 5 lần → tài khoản tự khoá vài phút rồi mở lại.

## 6. Đăng bài hẹn giờ (cron)

Trên Vercel, cron trong tiến trình tự tắt. `vercel.json` khai báo Vercel Cron, mặc định **1 lần/ngày**
(chạy được cả trên Hobby, chỉ là lưới an toàn):

```json
{ "path": "/api/payload-jobs/run?queue=default&limit=20", "schedule": "0 0 * * *" }
```

**Gói Pro:** đổi `schedule` thành `"* * * * *"` (mỗi phút) rồi deploy lại.

Vercel gửi `Authorization: Bearer $CRON_SECRET`; CMS chỉ chấp nhận khoá này (hoặc biên tập viên/admin
đã đăng nhập). Cần đặt `CRON_SECRET` (mục 3).

**Gói Hobby:** giữ `"0 0 * * *"` và dùng dịch vụ cron bên ngoài gọi mỗi 1–5 phút:

- cron-job.org: URL `https://blackholegame.vn/api/payload-jobs/run?queue=default&limit=20`,
  method GET, header `Authorization: Bearer <CRON_SECRET>`.
- hoặc GitHub Actions (`schedule: - cron: '*/5 * * * *'`) chạy
  `curl -fsS -H "Authorization: Bearer $CRON_SECRET" "https://blackholegame.vn/api/payload-jobs/run?queue=default&limit=20"`.

Khi đó báo biên tập viên: giờ đăng có thể lệch tối đa bằng chu kỳ cron.

**Kiểm tra:** Vercel → Project → **Cron Jobs** thấy job; hẹn giờ một bài thử 2 phút sau, bài tự lên
trang. `/api/health` (chi tiết, mục 9) báo `overdueJobs: 0`.

## 7. Tên miền

- Vercel → Domains: chọn **một** tên miền chính (`blackholegame.vn`) và đặt `www.blackholegame.vn`
  **Redirect 308** về tên miền chính. Hiện `www` đang trả một bản cũ thay vì chuyển hướng.
- `NEXT_PUBLIC_SITE_URL` phải đúng tên miền chính. Phiên đăng nhập admin chỉ chấp nhận các origin:
  tên miền chính, bản `www` của nó, URL deploy của Vercel và các origin trong `PAYLOAD_CSRF_ORIGINS`.

## 8. Email (tuỳ chọn, nên có)

Đặt `SMTP_HOST`, `SMTP_PORT` (587 hoặc 465), `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
(địa chỉ thuộc tên miền đã xác thực SPF/DKIM). Dùng được Google Workspace, Amazon SES,
Resend (SMTP), Mailgun... Không đặt thì "Quên mật khẩu" báo người dùng liên hệ quản trị viên.

## 9. Kiểm tra sau khi deploy

1. `curl https://blackholegame.vn/api/health` → `{"ok":true,"cms":"up"}` (200).
   Chi tiết (không lộ giá trị bí mật):
   `curl -H "Authorization: Bearer <CRON_SECRET>" https://blackholegame.vn/api/health` →
   `checks.database = up`, `migrations >= 1`, `storage = vercel-blob`, `jobsCron = vercel-cron`, `overdueJobs = 0`.
   Gắn một dịch vụ giám sát (BetterStack, UptimeRobot...) vào URL này: trang công khai vẫn 200 kể cả
   khi CMS hỏng, nên chỉ health check mới phát hiện được.
2. `/admin` → trang đăng nhập tiếng Việt; đăng nhập, F5 vẫn còn đăng nhập.
3. Tải một ảnh JPG > 5 MB và một video ngắn → thành công, ảnh hiển thị (URL `blob.vercel-storage.com`).
4. Viết bài thử, xuất bản → xuất hiện ở `/vi/news`; xem trước (live preview) hoạt động.
5. Hẹn giờ một bài → tự lên đúng giờ (mục 6).
6. `https://blackholegame.vn/sitemap.xml` và `robots.txt` dùng `https://blackholegame.vn` (không còn `localhost`).
7. Xoá các bài/ảnh thử.

Nếu `/admin` hiện trang "Hệ thống quản trị tạm thời không khởi động được": xem Vercel → Logs,
dòng `[cms] CMS is NOT configured - missing env: ...` cho biết thiếu biến nào.

## 10. Thay đổi cấu trúc dữ liệu (dành cho lập trình viên)

Mỗi lần thêm/sửa/xoá field hoặc collection trong `src/cms/**`:

```bash
npm run migrate:create ten-thay-doi   # tạo file trong src/cms/migrations
npm run generate:types                # cập nhật src/cms/payload-types.ts
npm run generate:importmap            # nếu thêm component admin
```

Commit file migration **cùng** thay đổi code. Lần deploy production tiếp theo tự áp dụng.
Kiểm tra trên DB tạm trước khi deploy: tạo một database trống, chạy
`NODE_ENV=production DATABASE_URI=<db tạm> npm run migrate`, rồi `npm run migrate:status`.

Kiểm tra "quên tạo migration" (máy dev dùng push nên DB local luôn khớp code, còn production
chỉ có migration): `npm run migrate:create kiem-tra -- --skip-empty` không tạo file nào nghĩa là
migration đã khớp schema hiện tại; nếu nó tạo file mới thì đó chính là migration còn thiếu.
Đối chiếu kỹ hơn: so `information_schema.columns`, `pg_indexes`, `pg_enum` giữa DB dev và DB tạm
vừa migrate (lần kiểm tra 06/10/2026: 276 cột, 161 index, 37 giá trị enum — trùng khớp).

Lưu ý an toàn:
- `push` (tự đồng bộ bảng) chỉ bật với DB ở `localhost`/`127.0.0.1`. Script chạy từ laptop vào DB
  production không bao giờ tự sửa bảng. Ép bật/tắt: `PAYLOAD_DB_PUSH=true|false`.
- Không chạy `npm run migrate` vào DB production từ laptop khi chưa chắc chắn; để bước build làm.

## 11. Sự cố thường gặp

| Hiện tượng | Nguyên nhân / cách xử lý |
|---|---|
| `/api/*` trả 500 "There was an error initializing Payload" | thiếu `PAYLOAD_SECRET`/`DATABASE_URI`, DB không kết nối được, hoặc chưa migrate. Xem `/api/health` chi tiết và Vercel Logs |
| Log `relation "..." does not exist` | migration chưa chạy: deploy lại Production, kiểm tra log build (mục 4) |
| Đăng nhập xong bị văng ra | `NEXT_PUBLIC_SITE_URL` sai tên miền (www/không www) → sửa và deploy lại; hoặc thêm origin vào `PAYLOAD_CSRF_ORIGINS` |
| Tải ảnh lỗi 413 / "FUNCTION_PAYLOAD_TOO_LARGE" | chưa có `BLOB_READ_WRITE_TOKEN` (mục 2) |
| Ảnh không hiện, lỗi `/_next/image` 400 | token Blob đổi store → deploy lại để `next.config` cập nhật host |
| Bài hẹn giờ không lên | thiếu `CRON_SECRET`, gói Hobby (mục 6), hoặc cron bị tắt; `/api/health` chi tiết báo `overdueJobs > 0` |
| Deploy lỗi "cron ... Hobby" | đã đổi `schedule` thành mỗi phút trên gói Hobby → trả lại `0 0 * * *` và dùng cron ngoài (mục 6) |
| Hết kết nối DB (`too many clients`) | dùng chuỗi **pooled** cho `DATABASE_URI`; giảm `DB_POOL_MAX` |
| Sitemap/canonical ra `localhost` | thiếu `NEXT_PUBLIC_SITE_URL` lúc build → đặt và deploy lại |

## 12. Sẵn sàng đổi CMS sau này

- `POST /api/revalidate` nhận sự kiện trung lập (không cần biết tag nội bộ):
  `{ "event": "news.published", "slug": "..." }` (cũng có `news.updated`, `news.unpublished`,
  `news.deleted`, `category.changed`, `media.changed`, `all`), xác thực bằng
  `Authorization: Bearer $REVALIDATE_SECRET` hoặc chữ ký `X-Webhook-Signature: sha256=<HMAC>`.
  Một CMS khác chỉ cần cấu hình webhook này.
- Ảnh từ CDN của CMS khác: thêm origin vào `CONTENT_MEDIA_ORIGINS`.
- Nguồn tin và nơi nhận form liên hệ chọn bằng biến môi trường (xem `src/site/lib/content` và
  `src/site/lib/contact`).
