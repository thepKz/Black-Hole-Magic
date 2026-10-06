# Nối site với một CMS khác

Tài liệu này dành cho dev sẽ chuyển phần **Tin tức** và **form Liên hệ** của site công khai (`/vi`, `/en`) từ Payload (`/admin`) sang một CMS khác, ví dụ CMS sẵn có của công ty, Strapi, Directus, WordPress hay một headless SaaS.

Bạn **không phải sửa trang hay component nào**. Chỉ cần đặt biến môi trường và sửa đúng một file mapping.

---

## 1. Kiến trúc: site chỉ biết "hợp đồng", không biết CMS

```
Trang (app/(site)/**)  ──>  src/site/lib/news.ts  (facade: cache, lỗi, draft)
                                   │
                                   ▼
                       src/site/lib/content/index.ts   chọn nguồn theo CONTENT_SOURCE
                     ┌─────────────┼──────────────┐
                     ▼             ▼              ▼
              payload/         http/            mock/
          (Payload Local API) (REST/JSON bất kỳ) (dữ liệu mẫu / rỗng)

Form liên hệ  ──>  src/site/lib/contact/submit.ts  ──>  sinks/{payload|http|log}
```

- **Hợp đồng dữ liệu** là các DTO trong `src/site/lib/types.ts`, phần *News*: `NewsListItem`, `NewsDetail`, `NewsImage`, `ArticleContent`… Mọi nguồn đều phải trả về đúng các kiểu này.
- **Hợp đồng nguồn tin** là interface `NewsSource` trong `src/site/lib/content/source.ts`, gồm `list`, `featured`, `bySlug`, `related`, `adjacent`, `categories`, `slugs` và `verifyPreview` (tuỳ chọn).
- **Hợp đồng liên hệ** là interface `ContactSink` trong `src/site/lib/contact/sink.ts`.
- ESLint chặn mọi import `payload`, `@payloadcms/*`, `@payload-config` hay `@/cms/*` trong `src/site/**` và `src/app/(site)/**`. Ngoại lệ là các file adapter Payload. Các hàm tiện ích dùng chung (`slugify`, `foldText`, parser video/embed, cache tags) nằm ở `src/shared/`.

## 2. Biến môi trường

### Chọn nguồn tin

| Biến | Giá trị | Ý nghĩa |
|---|---|---|
| `CONTENT_SOURCE` | `payload` \| `http` \| `mock` | Không đặt: dùng `payload` nếu có `DATABASE_URI`, ngược lại dùng `mock` rỗng. |
| `CONTENT_MOCK_FIXTURES` | `true` | Cho nguồn `mock` dùng dữ liệu mẫu trong `src/site/data/news.ts`. Bài mẫu có tiền tố `[Demo]`. **Không bật ở production.** |

Nếu thiếu cấu hình bắt buộc (ví dụ `payload` mà không có `DATABASE_URI`/`PAYLOAD_SECRET`, hay `http` mà không có `CMS_BASE_URL`), site **không lỗi 500**. Trang tin hiện trạng thái trống, bài viết trả 404, và log ghi một dòng `[content] source "…" disabled: …`.

### Nguồn `http`

| Biến | Bắt buộc | Ghi chú |
|---|---|---|
| `CMS_BASE_URL` | Có | Ví dụ `https://cms.congty.vn/api`. Các endpoint trong mapping được nối vào sau URL này. |
| `CMS_TOKEN` | Không | Token chỉ đọc, gửi qua header `Authorization: Bearer …`. |
| `CMS_PREVIEW_TOKEN` | Không | Token có quyền đọc bản nháp. Mặc định dùng lại `CMS_TOKEN`. |
| `CMS_PREVIEW_SECRET` | Để xem trước | Bí mật chung để CMS mở chế độ xem trước (mục 5). |
| `CMS_TIMEOUT_MS` | Không | Mặc định 6000 ms, tối đa 30000 ms. |
| `CMS_MEDIA_BASE` | Không | Tiền tố cho URL ảnh tương đối (`/uploads/x.jpg`). Mặc định là origin của `CMS_BASE_URL`. |
| `CONTENT_MEDIA_ORIGINS` | Nên đặt | Danh sách host ảnh được tối ưu qua `next/image`, cách nhau bằng dấu phẩy: `https://cdn.congty.vn,https://cms.congty.vn/uploads`. Xem mục 6. |

### Liên hệ

| Biến | Ghi chú |
|---|---|
| `CONTACT_SINK` | `payload` \| `http` \| `log`. Không đặt: dùng `http` nếu có `CONTACT_SINK_URL`, ngược lại `payload` nếu có `DATABASE_URI`. Nếu không có cả hai thì dùng `log` ở dev; ở production form **báo lỗi** để không âm thầm làm mất yêu cầu. |
| `CONTACT_SINK_URL` | Webhook nhận yêu cầu (CMS/CRM/Zapier/Make…). |
| `CONTACT_SINK_TOKEN` | Gửi qua header `Authorization: Bearer …`. |
| `CONTACT_SINK_SECRET` | Ký body bằng HMAC: `X-Signature: sha256=<hex>`. |

### Cache và xem trước

| Biến | Ghi chú |
|---|---|
| `REVALIDATE_SECRET` | **Bắt buộc khi dùng CMS ngoài.** Nếu không đặt, giá trị được suy ra từ `PAYLOAD_SECRET`, mà CMS ngoài không biết giá trị đó. |
| `PREVIEW_COOKIE_SECRET` | Khoá ký cookie xem trước. Mặc định dùng `REVALIDATE_SECRET`. |
| `PREVIEW_MAX_AGE_SECONDS` | Thời hạn phiên xem trước. Mặc định 3600 giây. |

## 3. File mapping: file duy nhất cần sửa

Mở `src/site/lib/content/http/mapping.ts`. Mỗi trường là một `Getter`, có thể là:

- **đường dẫn chấm**: `'attributes.title'`, `'cover.formats.medium.url'`, `'data.0'` (số là chỉ mục mảng);
- **hàm** `(obj) => giá trị`, khi cần biến đổi;
- `null` nếu CMS không có trường đó, khi ấy site dùng giá trị mặc định ở bảng dưới.

| Trường site | Bắt buộc | Mặc định khi thiếu |
|---|---|---|
| `id`, `slug`, `title`, `publishedAt` | Có | Thiếu thì bài **bị bỏ qua** (có log cảnh báo). Slug phải khớp `^[a-z0-9][a-z0-9-]{0,127}$`. |
| `updatedAt` | | `publishedAt` |
| `excerpt` | | `''` |
| `content` + `contentFormat` | | `contentFormat` nhận `'html'` (khuyên dùng) hoặc `'lexical'`. HTML được làm sạch tự động. |
| `readingTime` (phút) | | Tự tính từ số chữ, ảnh và video. |
| `category.{slug,name,order}` | | `order` = 0 |
| `cover` / `seo.image` / `author.avatar` | | Ảnh: `url`, `width`, `height`, `alt`, `focalX/Y` (%), `sizes.{thumb,card,news,og}` |
| `locales` | | Mảng ngôn ngữ đã thật sự dịch, ví dụ `['vi','en']`. Thiếu thì coi như chỉ có ngôn ngữ đang xem. Trường này quyết định hreflang và noindex. |
| `tags` | | `string[]` hoặc `[{name}]` |
| `related` | | Mảng bài liên quan (cùng shape với bài). Thiếu thì site lấy bài cùng danh mục, rồi bài mới nhất. |

`query` khai báo **tên tham số** CMS dùng cho locale, phân trang, lọc danh mục, tìm kiếm, sắp xếp, lọc trước/sau ngày (dùng cho nút bài trước/sau), lọc bài nổi bật, bản nháp và trạng thái đã đăng. Đặt `null` cho tham số CMS không hỗ trợ:

- Thiếu `q` (tìm kiếm): site tải 100 bài mới nhất rồi lọc không dấu.
- Thiếu `publishedBefore/After`: tắt nút bài trước/sau.
- Thiếu `featured`: site chọn bài nổi bật mới nhất trong 20 bài.

**Ảnh `sizes` là vai trò của site, không phải tên size của CMS:**

| Vai trò | Kích thước gợi ý | Dùng ở |
|---|---|---|
| `thumb` | ~160–400w | Danh sách liên quan, poster |
| `card` | ~800w (4:3 hoặc 16:9) | Thẻ tin |
| `news` | ~1600w | Ảnh bìa bài, thẻ nổi bật |
| `og` | 1200×630 | Ảnh chia sẻ mạng xã hội |

Có thể để trống `sizes`. Khi đó mọi chỗ dùng ảnh gốc `url`.

### Ví dụ: Strapi v5 (REST)

```ts
endpoints: { list: '/articles', bySlug: '/articles?filters[slug][$eq]={slug}&populate=*', categories: '/categories' },
query: { locale: 'locale', page: 'pagination[page]', perPage: 'pagination[pageSize]',
  cat: 'filters[category][slug][$eq]', q: 'filters[title][$containsi]',
  sortNewest: ['sort', 'publishedAt:desc'], sortOldest: ['sort', 'publishedAt:asc'],
  publishedBefore: 'filters[publishedAt][$lt]', publishedAfter: 'filters[publishedAt][$gt]',
  draft: ['status', 'draft'], featured: ['filters[featured][$eq]', 'true'], published: null },
list: { items: 'data', total: 'meta.pagination.total' },
detail: { item: 'data.0' },
// item.cover.url = 'url', sizes.card.url = 'formats.medium.url' ... (Strapi có sẵn formats)
```

### Ví dụ: WordPress REST

Danh sách bài là mảng gốc, tổng số nằm ở header (`X-WP-Total`). Hãy dùng một proxy/endpoint nhỏ trả về `{ data, meta: { total } }`, hoặc `?_embed` cùng `Getter` dạng hàm cho `title.rendered`, `content.rendered` và `_embedded['wp:featuredmedia'][0]`.

### Kiểm tra mapping không cần CMS thật

```bash
npx tsx src/site/lib/content/__checks__/http-source.check.ts
```

Script dựng một "CMS giả" tại 127.0.0.1 từ `__checks__/fixtures/cms.json`, chạy mọi hàm của nguồn `http` (danh sách, phân trang, tìm kiếm, chi tiết, làm sạch HTML, liên quan, trước/sau, slug, xem trước, lỗi 500) và kiểm tra webhook liên hệ. Khi đổi mapping, hãy sửa fixture theo đúng JSON thật của CMS rồi chạy lại.

## 4. Webhook xoá cache: `POST /api/revalidate`

Các trang tin được cache (`unstable_cache` với tag `news`, `news:{slug}`, `news-categories`, `media`; tối đa 1 giờ). Mỗi khi đăng, gỡ hoặc sửa bài, CMS phải gọi webhook này thì site mới cập nhật ngay.

**Xác thực**, chọn một trong hai:

- `Authorization: Bearer <REVALIDATE_SECRET>`
- `X-Webhook-Signature: sha256=<hex HMAC-SHA256(raw body, REVALIDATE_SECRET)>` (cũng nhận `X-Signature` và `X-Hub-Signature-256`)

**Body**, CMS không cần biết tag hay đường dẫn nội bộ:

```json
{ "event": "news.published", "slug": "ten-bai-viet" }
{ "event": "news.updated", "slug": "slug-moi", "previousSlug": "slug-cu" }
{ "event": "news.unpublished", "slug": "ten-bai-viet" }
{ "event": "news.deleted", "slug": "ten-bai-viet" }
{ "event": "category.changed" }
{ "event": "media.changed" }
{ "event": "all" }
```

Có thể gửi một mảng nhiều sự kiện, hoặc dùng `slugs: [...]` để đăng hàng loạt. Bảng ánh xạ sự kiện sang tag và đường dẫn nằm trong `src/shared/cache.ts` (`eventToTargets`).

Phản hồi: `{ "ok": true, "tags": n, "paths": m }`. Lỗi `401` là sai bí mật; `400` là JSON hoặc sự kiện không hợp lệ.

```bash
BODY='{"event":"news.published","slug":"ten-bai-viet"}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$REVALIDATE_SECRET" | sed 's/^.* //')
curl -X POST https://blackholegame.vn/api/revalidate \
  -H "content-type: application/json" -H "X-Webhook-Signature: sha256=$SIG" -d "$BODY"
```

Payload hiện tại vẫn dùng dạng cấp thấp `{ tags, paths }` qua hook `src/cms/hooks/revalidateNews.ts`. Dạng này vẫn được hỗ trợ.

## 5. Xem trước bản nháp

```
GET /api/draft?path=/{vi|en}/news/{slug}&token=<CMS_PREVIEW_SECRET>
GET /api/draft?path=/vi/news/{slug}&exp=<unix giây>&sig=<hex HMAC-SHA256("<path>:<exp>", CMS_PREVIEW_SECRET)>
```

1. Nguồn đang hoạt động kiểm tra quyền qua `verifyPreview`. Với Payload, đó là cookie đăng nhập `/admin`; với `http`, là token hoặc chữ ký ở trên. Chữ ký có hạn tối đa 24 giờ và được ưu tiên dùng, vì token nằm lộ trên URL.
2. Khi hợp lệ, site bật Next Draft Mode và đặt cookie `bh_preview`: httpOnly, có ký, mặc định hết hạn sau 1 giờ, `SameSite=None; Secure` ở production để CMS nhúng được trong iframe. Sau đó site chuyển hướng tới `/{locale}/news/{slug}?preview=1`.
3. Trang bài viết chỉ hiện bản nháp khi có **cả** Draft Mode **và** cookie `bh_preview` hợp lệ cho đúng nguồn. Với Payload, phiên `/admin` cũng phải còn hiệu lực. Nguồn `http` đọc nháp bằng `CMS_PREVIEW_TOKEN` và tham số `query.draft`.
4. Nút "Thoát xem trước" (`/api/draft/exit`) xoá cả hai cookie.
5. Tự làm mới khi lưu (live preview) chỉ có với Payload. Với CMS khác, biên tập viên tải lại trang.

`path` chỉ nhận dạng `/{vi|en}/news/{slug}`, nên không thể bị lợi dụng để chuyển hướng ra ngoài.

## 6. Quy tắc URL ảnh và media

- **URL tương đối** (`/uploads/x.webp`) được nối với `CMS_MEDIA_BASE`.
- **URL tuyệt đối** phải là `https://` (hoặc `http://` ở dev). Mọi scheme khác (`data:`, `javascript:`…) bị loại.
- Chỉ host có trong `CONTENT_MEDIA_ORIGINS` mới đi qua bộ tối ưu `next/image` (WebP, srcset). `next.config.ts` và adapter cùng đọc biến này. Ảnh từ host khác vẫn hiển thị nhưng có cờ `unoptimized`, tức tải thẳng và không lỗi 400. Hãy thêm CDN của CMS vào biến này để được tối ưu.
- Đổi `CONTENT_MEDIA_ORIGINS` cần **build lại**, vì `next.config` được đọc lúc build.
- Ảnh trên host khác không chịu `robots.txt` của site. Host đó tự quyết.
- Ảnh trong thân bài HTML có `loading="lazy"` và `decoding="async"`. Iframe chỉ được nhận từ YouTube (`youtube.com`, `youtube-nocookie.com`) và Vimeo (`player.vimeo.com`).

## 7. Làm sạch HTML từ CMS

`sanitizeArticleHtml()` (`src/site/lib/content/html.ts`, dùng thư viện `sanitize-html`) chạy trong adapter, **trước** khi nội dung vào cache:

- Chỉ giữ các thẻ `p`, `h2–h4`, danh sách, `blockquote`, `figure`/`figcaption`, `img`, `a`, bảng, `pre`/`code`, định dạng chữ, `hr`/`br`, và iframe YouTube/Vimeo.
- `h1` hạ thành `h2` (h1 dành cho tiêu đề bài); `h5`/`h6` hạ thành `h4`.
- `h2`/`h3` ở cấp gốc được gắn `id` bằng đúng thuật toán của Lexical (`slugify`, thêm hậu tố `-2`, `-3` khi trùng), nên mục lục khớp với nội dung.
- Link ngoài có `rel="noopener noreferrer"`. `target="_blank"` chỉ giữ khi CMS đặt sẵn. Giữ `nofollow`, `sponsored` và `ugc`.
- Bảng được bọc trong `div.table-scroll` để cuộn ngang trên mobile.
- Bỏ mọi `style`, `class`, `on*`, `data-*` và `script`.

Kiểu hiển thị dùng chung `.prose-site` với bài Payload.

## 8. Liên hệ: webhook `CONTACT_SINK=http`

```
POST $CONTACT_SINK_URL
Content-Type: application/json
Authorization: Bearer $CONTACT_SINK_TOKEN
X-Signature: sha256=<hex HMAC-SHA256(body, $CONTACT_SINK_SECRET)>
Idempotency-Key: <uuid>   (giữ nguyên khi thử lại)

{ "type": "contact.created",
  "data": { "name", "email", "type": "biz|support|press|other", "subject", "message" },
  "meta": { "locale": "vi|en", "ipHash", "userAgent", "submittedAt" } }
```

- Phản hồi `2xx` (tuỳ chọn `{ "id": "…" }`) nghĩa là thành công.
- Lỗi mạng hoặc `5xx` được thử lại 1 lần. `4xx` không thử lại, và form báo lỗi.
- Timeout 8 giây. Log không bao giờ ghi nội dung hay email (Nghị định 13/2023).
- **Giới hạn tần suất**: với sink `payload`, giới hạn đếm trong DB (dùng chung mọi instance). Với `http` và `log`, chỉ có bộ đếm trong RAM, tính riêng từng instance serverless. Nên bật Turnstile (`TURNSTILE_*`) khi dùng webhook ở production.

## 9. Checklist chuyển CMS

1. Viết mapping, sửa fixture theo JSON thật, rồi chạy `npx tsx src/site/lib/content/__checks__/http-source.check.ts`.
2. Đặt `CONTENT_SOURCE=http`, các biến `CMS_*`, `CONTENT_MEDIA_ORIGINS` và `REVALIDATE_SECRET`, rồi build lại.
3. Cấu hình webhook trong CMS: đăng, gỡ, sửa, xoá bài → `POST /api/revalidate` (mục 4).
4. Cấu hình nút Preview của CMS → `/api/draft?...` (mục 5).
5. Đặt `CONTACT_SINK=http` cùng `CONTACT_SINK_URL`, `CONTACT_SINK_TOKEN` và `CONTACT_SINK_SECRET`, hoặc giữ `payload`.
6. Kiểm tra `/vi/news`, một bài có bảng/ảnh/video, `/vi/news/rss.xml`, `/sitemap.xml`, bản `/en` của một bài chưa dịch (phải noindex), xem trước một bản nháp, gửi thử form liên hệ.
7. Cache key có chứa id của nguồn (kèm biến thể: `mock` có/không `CONTENT_MOCK_FIXTURES`, host của `CMS_BASE_URL`), nên sau khi đổi nguồn không còn dữ liệu cũ bị trả nhầm. Trang đã prerender lúc build vẫn giữ tới lần revalidate: trên Vercel đổi biến môi trường là deploy lại nên không ảnh hưởng. Có thể gửi thêm `{ "event": "all" }` cho chắc.
