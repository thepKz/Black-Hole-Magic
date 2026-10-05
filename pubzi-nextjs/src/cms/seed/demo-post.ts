/**
 * `npm run seed:demo-post` (payload run src/cms/seed/demo-post.ts)
 *
 * Upserts ONE published demo article (slug `bai-mau-cong-cu-bien-tap`, VI + EN)
 * that shows every newsroom editor feature as the site renders it: gallery
 * (grid + slider), YouTube video, callout, pull quote with source, CTA button,
 * "Đọc thêm" box, inline images (medium-left / small-right with text wrap),
 * table, lists, checklist, blockquote, links (nofollow / new tab), alignment,
 * indent and a code block.
 *
 * Safe to re-run: it only touches the article with that slug (created, or
 * overwritten if it already exists) and reuses the `seed-*.webp` media from
 * `npm run seed:news` (uploaded here if missing). Nothing else is changed or
 * deleted.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import config from '@payload-config';
import { getPayload, type Payload } from 'payload';

import { lx } from '../lib/lexical';
import { prepareSeedEnv } from './base';
import { SEED_ART_ALT, type SeedGameArt } from './news-data';

const SLUG = 'bai-mau-cong-cu-bien-tap';
const ARTS: SeedGameArt[] = ['vo-lam-truyen-ky-2', 'thien-long-bat-bo', 'kiem-the', 'tieu-ngao-giang-ho', 'con-duong-to-lua'];
/** Blender Foundation "Big Buck Bunny" (official upload, CC-BY). */
const DEMO_YOUTUBE = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';

type Node = Record<string, unknown>;
type Text = ReturnType<typeof lx.text>;

const nodeId = () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

/* ------------------------------------------------------------------ */
/* Node builders (serialized Lexical JSON)                             */
/* ------------------------------------------------------------------ */

const block = (blockType: string, fields: Node): Node => ({
  type: 'block',
  version: 2,
  format: '',
  fields: { id: nodeId(), blockName: '', blockType, ...fields },
});

const para = (children: (string | Text | Node)[], opts: { format?: string; indent?: number } = {}): Node => ({
  ...lx.paragraph(),
  format: opts.format ?? '',
  indent: opts.indent ?? 0,
  children: children.map((c) => (typeof c === 'string' ? lx.text(c) : c)),
});

const link = (text: string, url: string, opts: { newTab?: boolean; rel?: string[] } = {}): Node => ({
  type: 'link',
  version: 3,
  format: '',
  indent: 0,
  direction: 'ltr',
  id: nodeId(),
  fields: { linkType: 'custom', url, newTab: Boolean(opts.newTab), ...(opts.rel ? { rel: opts.rel } : {}) },
  children: [lx.text(text)],
});

const image = (mediaId: number, fields: { caption?: string; size?: 'full' | 'medium' | 'small'; align?: string }): Node => ({
  ...lx.upload(mediaId),
  fields: { size: 'full', align: 'center', ...fields },
});

const cell = (text: string, header = false): Node => ({
  type: 'tablecell',
  version: 1,
  headerState: header ? 1 : 0,
  colSpan: 1,
  rowSpan: 1,
  backgroundColor: null,
  children: [para([header ? lx.text(text, 'bold') : text])],
});

const table = (head: string[], rows: string[][]): Node => ({
  type: 'table',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children: [head, ...rows].map((r, i) => ({
    type: 'tablerow',
    version: 1,
    children: r.map((c) => cell(c, i === 0)),
  })),
});

const checklist = (items: [string, boolean][]): Node => ({
  ...lx.list('bullet', []),
  listType: 'check',
  children: items.map(([text, checked], i) => ({
    type: 'listitem',
    value: i + 1,
    checked,
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
    children: [lx.text(text)],
  })),
});

const richRoot = (...children: Node[]) => lx.root(...children);

/* ------------------------------------------------------------------ */
/* Copy                                                                */
/* ------------------------------------------------------------------ */

interface Copy {
  title: string;
  excerpt: string;
  tags: string[];
  build: (m: Record<SeedGameArt, number>, related: number[]) => ReturnType<typeof lx.root>;
}

const vi: Copy = {
  title: 'Bài mẫu: toàn bộ công cụ biên tập trong một bài viết',
  excerpt:
    'Bài mẫu dành cho ban biên tập: bộ ảnh, video, hộp ghi chú, trích dẫn, bảng, nút kêu gọi và khối "Đọc thêm" hiển thị trên trang tin như thế nào.',
  tags: ['bài mẫu', 'hướng dẫn biên tập'],
  build: (m, related) =>
    richRoot(
      para([
        'Đây là bài viết mẫu để ban biên tập xem trước cách từng công cụ trong trình soạn thảo hiển thị trên trang tin. ',
        lx.text('Mọi khối dưới đây đều tạo được trong /admin', 'bold'),
        ' mà không cần viết mã.',
      ]),
      lx.heading('h2', 'Ảnh trong bài: kích thước và căn lề'),
      image(m['kiem-the'], { caption: 'Ảnh cỡ "Vừa", căn trái: chữ chạy bao quanh ảnh trên máy tính.', size: 'medium', align: 'left' }),
      para([
        'Ảnh cỡ Vừa hoặc Nhỏ có thể căn trái hay căn phải để chữ chạy bao quanh. Trên điện thoại, ảnh tự xếp lại thành một cột để dễ đọc. Chú thích và nguồn ảnh lấy từ Thư viện ảnh nếu bài không nhập riêng.',
      ]),
      para([
        'Liên kết ra ngoài có thể mở tab mới và gắn thuộc tính rel, ví dụ ',
        link('trang chủ Blender', 'https://www.blender.org', { newTab: true, rel: ['nofollow'] }),
        ' (mở tab mới, nofollow).',
      ]),
      image(m['tieu-ngao-giang-ho'], { caption: 'Ảnh cỡ "Nhỏ", căn phải.', size: 'small', align: 'right' }),
      para([
        'Đoạn này được căn giữa bằng nút căn lề trên thanh công cụ.',
      ], { format: 'center' }),
      para(['Đoạn này được thụt lề một bậc, hữu ích cho phần giải thích phụ.'], { indent: 1 }),
      lx.heading('h2', 'Bộ ảnh'),
      block('gallery', {
        images: [m['vo-lam-truyen-ky-2'], m['thien-long-bat-bo'], m['kiem-the'], m['tieu-ngao-giang-ho'], m['con-duong-to-lua']],
        layout: 'grid',
        columns: '3',
        ratio: '16:9',
        showCaptions: false,
        caption: 'Bộ ảnh dạng lưới 3 cột, cắt 16:9. Bấm vào ảnh để xem cỡ lớn.',
      }),
      block('gallery', {
        images: [m['con-duong-to-lua'], m['vo-lam-truyen-ky-2'], m['thien-long-bat-bo']],
        layout: 'slider',
        ratio: 'auto',
        showCaptions: true,
        caption: 'Bộ ảnh dạng trình chiếu: vuốt hoặc dùng mũi tên.',
      }),
      lx.heading('h2', 'Video'),
      para(['Dán link YouTube, Vimeo, Facebook, TikTok hoặc tải video lên Thư viện video. Trình phát chỉ tải khi bạn đọc bấm phát.']),
      block('videoEmbed', {
        source: 'url',
        url: DEMO_YOUTUBE,
        aspectRatio: 'auto',
        title: 'Big Buck Bunny (Blender Foundation)',
        caption: 'Video mẫu nhúng từ YouTube.',
        credit: 'Blender Foundation, CC BY 3.0',
      }),
      lx.heading('h2', 'Hộp ghi chú và trích dẫn'),
      block('callout', {
        variant: 'important',
        title: 'Lưu ý khi xuất bản',
        content: richRoot(
          para(['Bài cần có ảnh bìa, sapo 50–300 ký tự và mô tả ảnh (alt) trước khi xuất bản.']),
          lx.list('bullet', ['Kiểm tra lại chính tả tiêu đề.', 'Chọn đúng danh mục.']),
        ),
      }),
      block('callout', {
        variant: 'warning',
        content: richRoot(para(['Hộp "Lưu ý" dùng cho cảnh báo, ví dụ lịch bảo trì hoặc thay đổi quan trọng.'])),
      }),
      block('quote', {
        text: 'Một bài tin tốt trả lời được ai, cái gì, khi nào, ở đâu và vì sao ngay trong vài câu đầu.',
        author: 'Ban biên tập Black Hole',
        role: 'Sổ tay biên tập',
        sourceUrl: '/vi/news',
      }),
      lx.quote('Trích dẫn thường (Blockquote) vẫn dùng được cho đoạn trích ngắn trong bài.'),
      lx.heading('h2', 'Bảng'),
      table(
        ['Khối', 'Dùng khi', 'Ghi chú'],
        [
          ['Bộ ảnh', 'Nhiều ảnh cùng chủ đề', '2–40 ảnh, lưới hoặc trình chiếu'],
          ['Video', 'Clip, trailer, livestream đã lưu', 'Link hoặc tải lên (tối đa 300 MB)'],
          ['Hộp ghi chú', 'Thông tin cần nổi bật', 'Ghi chú / Quan trọng / Lưu ý'],
          ['Đọc thêm', 'Dẫn sang bài liên quan', '1–3 bài đã xuất bản'],
        ],
      ),
      lx.heading('h3', 'Danh sách việc cần làm'),
      checklist([
        ['Viết tiêu đề 40–90 ký tự', true],
        ['Chọn ảnh bìa 16:9', true],
        ['Gửi duyệt', false],
      ]),
      lx.list('number', ['Soạn bài', 'Gửi duyệt', 'Biên tập viên xuất bản']),
      ...(related.length ? [block('relatedNews', { title: 'Đọc thêm', posts: related })] : []),
      block('cta', {
        label: 'Xem danh sách game',
        url: '/vi/games',
        note: 'Nút kêu gọi hành động dẫn tới trang trong site hoặc link ngoài.',
        variant: 'primary',
        newTab: false,
        nofollow: false,
      }),
      block('code', { language: 'json', code: '{\n  "block": "code",\n  "language": "json"\n}' }),
      para(['Hết bài mẫu.'], { format: 'right' }),
    ),
};

const en: Copy = {
  title: 'Sample post: every editor tool in one article',
  excerpt:
    'A sample for the editorial team: how galleries, videos, callouts, quotes, tables, call-to-action buttons and "Read more" boxes look on the news page.',
  tags: ['sample', 'editor guide'],
  build: (m, related) =>
    richRoot(
      para([
        'This sample article previews how each editor tool renders on the news page. ',
        lx.text('Every block below can be created in /admin', 'bold'),
        ' without writing code.',
      ]),
      lx.heading('h2', 'Inline images: size and alignment'),
      image(m['kiem-the'], { caption: 'Medium image aligned left: text wraps around it on desktop.', size: 'medium', align: 'left' }),
      para([
        'Medium or small images can be aligned left or right so text wraps around them. On phones they stack into a single column. Caption and credit come from the media library unless the article sets its own.',
      ]),
      para([
        'External links can open in a new tab and carry rel attributes, for example ',
        link('the Blender website', 'https://www.blender.org', { newTab: true, rel: ['nofollow'] }),
        ' (new tab, nofollow).',
      ]),
      image(m['tieu-ngao-giang-ho'], { caption: 'Small image aligned right.', size: 'small', align: 'right' }),
      para(['This paragraph is centred with the alignment button.'], { format: 'center' }),
      para(['This paragraph is indented one level, handy for side notes.'], { indent: 1 }),
      lx.heading('h2', 'Gallery'),
      block('gallery', {
        images: [m['vo-lam-truyen-ky-2'], m['thien-long-bat-bo'], m['kiem-the'], m['tieu-ngao-giang-ho'], m['con-duong-to-lua']],
        layout: 'grid',
        columns: '3',
        ratio: '16:9',
        showCaptions: false,
        caption: 'Three-column grid cropped to 16:9. Click an image to enlarge it.',
      }),
      block('gallery', {
        images: [m['con-duong-to-lua'], m['vo-lam-truyen-ky-2'], m['thien-long-bat-bo']],
        layout: 'slider',
        ratio: 'auto',
        showCaptions: true,
        caption: 'Slider gallery: swipe or use the arrows.',
      }),
      lx.heading('h2', 'Video'),
      para(['Paste a YouTube, Vimeo, Facebook or TikTok link, or upload to the video library. The player only loads when the reader presses play.']),
      block('videoEmbed', {
        source: 'url',
        url: DEMO_YOUTUBE,
        aspectRatio: 'auto',
        title: 'Big Buck Bunny (Blender Foundation)',
        caption: 'Sample video embedded from YouTube.',
        credit: 'Blender Foundation, CC BY 3.0',
      }),
      lx.heading('h2', 'Callouts and quotes'),
      block('callout', {
        variant: 'important',
        title: 'Before publishing',
        content: richRoot(
          para(['An article needs a cover, a 50-300 character summary and alt text before it can be published.']),
          lx.list('bullet', ['Proofread the title.', 'Pick the right category.']),
        ),
      }),
      block('callout', {
        variant: 'warning',
        content: richRoot(para(['Use the "Heads up" box for warnings such as maintenance windows or major changes.'])),
      }),
      block('quote', {
        text: 'A good news story answers who, what, when, where and why within its first few sentences.',
        author: 'Black Hole editorial team',
        role: 'Style guide',
        sourceUrl: '/en/news',
      }),
      lx.quote('The plain blockquote still works for short excerpts.'),
      lx.heading('h2', 'Table'),
      table(
        ['Block', 'Use it for', 'Notes'],
        [
          ['Gallery', 'Several photos on one topic', '2-40 images, grid or slider'],
          ['Video', 'Clips, trailers, saved streams', 'Link or upload (up to 300 MB)'],
          ['Callout', 'Information that must stand out', 'Note / Important / Heads up'],
          ['Read more', 'Pointing to related stories', '1-3 published articles'],
        ],
      ),
      lx.heading('h3', 'Checklist'),
      checklist([
        ['Write a 40-90 character title', true],
        ['Pick a 16:9 cover', true],
        ['Submit for review', false],
      ]),
      lx.list('number', ['Draft', 'Submit for review', 'Editor publishes']),
      ...(related.length ? [block('relatedNews', { title: 'Read more', posts: related })] : []),
      block('cta', {
        label: 'Browse our games',
        url: '/en/games',
        note: 'A call-to-action button links to a page on the site or an external URL.',
        variant: 'primary',
        newTab: false,
        nofollow: false,
      }),
      block('code', { language: 'json', code: '{\n  "block": "code",\n  "language": "json"\n}' }),
      para(['End of the sample.'], { format: 'right' }),
    ),
};

/* ------------------------------------------------------------------ */
/* Upsert                                                              */
/* ------------------------------------------------------------------ */

async function ensureMedia(payload: Payload, art: SeedGameArt): Promise<number> {
  const found = await payload.find({
    collection: 'media',
    where: { filename: { like: `seed-${art}` } },
    limit: 1,
    depth: 0,
  });
  if (found.docs[0]) return found.docs[0].id;
  const data = await readFile(path.resolve(process.cwd(), 'public/site/games', `${art}-wide.webp`));
  const created = await payload.create({
    collection: 'media',
    locale: 'vi',
    data: { alt: SEED_ART_ALT[art].vi, credit: 'Black Hole Game' },
    file: { data, mimetype: 'image/webp', name: `seed-${art}.webp`, size: data.byteLength },
  });
  await payload.update({ collection: 'media', id: created.id, locale: 'en', data: { alt: SEED_ART_ALT[art].en } });
  return created.id;
}

async function seedDemoPost() {
  prepareSeedEnv();
  const payload = await getPayload({ config });

  const media = {} as Record<SeedGameArt, number>;
  for (const art of ARTS) media[art] = await ensureMedia(payload, art);

  const category =
    (await payload.find({ collection: 'news-categories', where: { slug: { equals: 'notice' } }, limit: 1, depth: 0 })).docs[0] ??
    (await payload.find({ collection: 'news-categories', sort: 'order', limit: 1, depth: 0 })).docs[0];
  if (!category) throw new Error('No news category yet - run `npm run seed` first.');

  const email = process.env.SEED_ADMIN_EMAIL;
  const author =
    (email
      ? (await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0 })).docs[0]
      : undefined) ?? (await payload.find({ collection: 'users', sort: 'createdAt', limit: 1, depth: 0 })).docs[0];

  const related = (
    await payload.find({
      collection: 'news',
      where: { and: [{ _status: { equals: 'published' } }, { slug: { not_equals: SLUG } }] },
      sort: '-publishedAt',
      limit: 2,
      depth: 0,
    })
  ).docs.map((d) => d.id);

  const existing = (
    await payload.find({
      collection: 'news',
      where: { slug: { equals: SLUG } },
      limit: 1,
      depth: 0,
      draft: true,
      trash: true,
    })
  ).docs[0];

  const shared = {
    slug: SLUG,
    generateSlug: false,
    category: category.id,
    cover: media['thien-long-bat-bo'],
    author: author?.id ?? null,
    featured: false,
    publishedAt: existing?.publishedAt ?? new Date().toISOString(),
    deletedAt: null,
    _status: 'published' as const,
  };
  const localized = (copy: Copy) => ({
    title: copy.title,
    excerpt: copy.excerpt,
    tags: copy.tags,
    content: copy.build(media, related) as never,
  });

  const id = existing
    ? (await payload.update({ collection: 'news', id: existing.id, locale: 'vi', trash: true, data: { ...shared, ...localized(vi) } as never }))
        .id
    : (await payload.create({ collection: 'news', locale: 'vi', data: { ...shared, ...localized(vi) } as never })).id;
  await payload.update({ collection: 'news', id, locale: 'en', data: { ...localized(en), _status: 'published' } as never });

  payload.logger.info(`Seed: demo post ${existing ? 'updated' : 'created'} (id ${id}) -> /vi/news/${SLUG}`);
}

try {
  await seedDemoPost();
  await new Promise((r) => setTimeout(r, 200));
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
