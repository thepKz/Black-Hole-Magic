# Black Hole Game — website + newsroom CMS

Next.js 16 (App Router) + Payload CMS 3 (Postgres). Production: https://blackholegame.vn (Vercel).

| Đường dẫn | Là gì | Mã nguồn |
|---|---|---|
| `/vi`, `/en`, `/[locale]/news`, `/[locale]/contact`, ... | Website công khai | `src/app/(site)`, `src/site` |
| `/admin` | Trang quản trị cho biên tập viên tin game (Payload) | `src/app/(payload)`, `src/cms` |
| `/api/*` | REST của Payload + `/api/health`, `/api/draft`, `/api/revalidate` | `src/app/(payload)/api`, `src/app/(site)/api` |
| `/v2/*` | Site cũ (giữ nguyên, không sửa) | `src/app/(v2)`, `src/components`, ... |

## Chạy ở máy

```bash
npm install
cp .env.example .env      # điền DATABASE_URI, PAYLOAD_SECRET, SEED_ADMIN_* ...
npm run db:up             # Postgres trong docker (cổng 5440)
npm run seed              # tài khoản admin + danh mục + bài mẫu
npm run dev               # http://localhost:3000, admin: /admin
```

Ở máy, schema DB tự đồng bộ (push mode). Mọi nơi khác chỉ dùng migration trong `src/cms/migrations`.

## Tài liệu

- **[docs/HANDOFF.md](docs/HANDOFF.md)** — bàn giao toàn bộ dự án: cấu trúc, chạy ở máy, danh sách
  biến môi trường đầy đủ, deploy, checklist chuyển repo, việc còn dở. Người mới đọc file này trước.
- **[docs/DEPLOY-ADMIN.md](docs/DEPLOY-ADMIN.md)** — đưa `/admin` lên Vercel: Neon Postgres, Vercel Blob,
  biến môi trường, migration, tài khoản admin đầu tiên (`npm run bootstrap:admin`), cron đăng bài
  hẹn giờ, kiểm tra `/api/health`, xử lý sự cố.
- **[docs/CONNECT-CMS.md](docs/CONNECT-CMS.md)** — đổi nguồn tin tức / hộp thư liên hệ sang CMS khác
  (`CONTENT_SOURCE=payload | http | mock`) mà không sửa trang.

## Lệnh hay dùng

| Lệnh | Việc |
|---|---|
| `npm run typecheck` / `npm run lint` | kiểm tra TypeScript / ESLint |
| `npm run build` | build production |
| `npm run migrate:create <tên>` | tạo migration sau khi đổi cấu trúc collection (commit cùng thay đổi) |
| `npm run migrate` / `npm run migrate:status` | chạy / xem migration |
| `npm run generate:types` / `npm run generate:importmap` | sinh lại `payload-types.ts` / import map admin |
| `npm run bootstrap:admin` | tạo hoặc đặt lại tài khoản admin (dùng cho production) |
