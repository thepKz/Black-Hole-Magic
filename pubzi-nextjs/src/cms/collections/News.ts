import type { CollectionBeforeChangeHook, CollectionConfig, FieldHook, PayloadRequest, Where } from 'payload';
import { slugField as payloadSlugField } from 'payload';

import { authenticated, publishedOrAuthenticated } from '../access';
import { newsEditor } from '../editor';
import { searchField } from '../fields/slug';
import { revalidateNewsAfterChange, revalidateNewsAfterDelete } from '../hooks/revalidateNews';
import { readingTimeMinutes } from '../lib/lexical';
import { buildPreviewUrl } from '../lib/preview';
import { slugify } from '../lib/text';

/**
 * News articles - the only content type edited in /admin.
 *
 * Editor toolkit: full Lexical (see src/cms/editor.ts `newsEditor`), drafts +
 * autosave (2s) + scheduled publish/unpublish (jobs, see payload.config.ts) +
 * versions (50/doc), live preview of /{locale}/news/{slug} through
 * /api/draft, slug auto-generated from the title (Vietnamese diacritics
 * stripped, de-duplicated, editable, stabilises once published), cover with
 * focal point, author, computed reading time, manual related posts (site falls
 * back to same-category posts), featured flag, tags, SEO tab (plugin-seo).
 *
 * Localized: title, excerpt, content, tags, readingTime, meta.*.
 * Shared: slug, cover, category, author, publishedAt, featured, relatedPosts.
 */

/** First free slug among ALL news docs (drafts included): x, x-2, x-3... */
async function uniqueSlug(
  req: PayloadRequest,
  value: string,
  selfId: number | string | null | undefined,
): Promise<string> {
  const base = slugify(value) || value;
  let candidate = base;
  for (let i = 2; i < 50; i += 1) {
    const where: Where = { slug: { equals: candidate } };
    if (selfId != null) where.id = { not_equals: selfId };
    const { totalDocs } = await req.payload.count({ collection: 'news', where, req, overrideAccess: true });
    if (totalDocs === 0) return candidate;
    candidate = `${base}-${i}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Wraps Payload's `generateSlug` hook (on the hidden `generateSlug` checkbox,
 * which writes `data.slug`) and then de-duplicates `data.slug`. Field hooks of
 * sibling fields run concurrently, so this must live in the same hook.
 */
const withUniqueSlug =
  (original: FieldHook | undefined): FieldHook =>
  async (args) => {
    const result = original ? await original(args) : args.value;
    const data = args.data as Record<string, unknown> | undefined;
    const slug = data?.slug;
    if (data && typeof slug === 'string' && slug) {
      data.slug = await uniqueSlug(args.req, slug, args.originalDoc?.id);
    }
    return result;
  };

/** Reading time (minutes) of the locale being saved + publishedAt on first publish. */
const computeDerived: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) return data;
  if (data.content !== undefined) {
    data.readingTime = readingTimeMinutes(data.content);
  }
  const firstPublish =
    data._status === 'published' && originalDoc?._status !== 'published' && !originalDoc?.publishedAt;
  if (firstPublish && !data.publishedAt) {
    data.publishedAt = new Date().toISOString();
  }
  return data;
};

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: { vi: 'Bài viết', en: 'Article' },
    plural: { vi: 'Tin tức', en: 'News' },
  },
  admin: {
    group: { vi: 'Nội dung', en: 'Content' },
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'publishedAt', '_status', 'updatedAt'],
    listSearchableFields: ['title', 'searchText', 'slug'],
    description: {
      vi: 'Soạn, lên lịch và xuất bản tin tức. Bài chỉ hiện trên site khi ở trạng thái "Đã xuất bản". Lưu ý: "Tạo mới" tự lưu nháp ngay (autosave) - nếu mở nhầm, hãy xoá bản nháp trống (không tiêu đề) khỏi danh sách.',
      en: 'Write, schedule and publish news. Articles appear on the site only once published. Note: "Create new" autosaves a draft immediately - delete empty (untitled) drafts you opened by mistake.',
    },
    pagination: { defaultLimit: 25 },
    livePreview: {
      url: ({ data, locale, req }) => buildPreviewUrl(data?.slug, locale?.code, req),
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 375, height: 812 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
    },
    preview: (doc, { locale, req }) => buildPreviewUrl(doc?.slug as string | undefined, locale, req),
  },
  defaultSort: '-publishedAt',
  versions: {
    drafts: {
      autosave: { interval: 2000 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
    readVersions: authenticated,
  },
  hooks: {
    beforeChange: [computeDerived],
    afterChange: [revalidateNewsAfterChange],
    afterDelete: [revalidateNewsAfterDelete],
  },
  fields: [
    // ---- main column (plugin-seo moves these into a "Content" tab) ----
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      maxLength: 160,
      label: { vi: 'Tiêu đề', en: 'Title' },
      admin: {
        description: {
          vi: 'Nên 40–90 ký tự, chứa từ khoá chính. Tiêu đề SEO (40–70 ký tự, gồm " | Black Hole Game") chỉnh riêng ở tab SEO.',
          en: 'Aim for 40–90 characters with the main keyword. The SEO title (40–70 chars incl. " | Black Hole Game") is tuned in the SEO tab.',
        },
      },
    },
    searchField('title', true),
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      maxLength: 300,
      label: { vi: 'Tóm tắt (sapo)', en: 'Excerpt' },
      admin: {
        rows: 3,
        description: {
          vi: 'Hiển thị ở danh sách tin và làm mô tả SEO mặc định (70–160 ký tự, lý tưởng ~150; phần quá 160 bị cắt trong mô tả SEO).',
          en: 'Shown in news lists and used as the default SEO description (70–160 chars, ideally ~150; clipped at 160 for SEO).',
        },
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: { vi: 'Ảnh bìa (16:9, tối thiểu 1200×675)', en: 'Cover image (16:9, min 1200×675)' },
      admin: {
        description: {
          vi: 'Đặt điểm lấy nét (focal point) trong thư viện ảnh để ảnh cắt đẹp ở mọi tỉ lệ. Không có ảnh bìa: site tự sinh ảnh OG.',
          en: 'Set the focal point in the media library so crops look right. No cover: the site auto-generates an OG image.',
        },
      },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      editor: newsEditor,
      label: { vi: 'Nội dung', en: 'Content' },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      localized: true,
      maxRows: 10,
      label: { vi: 'Thẻ (tags)', en: 'Tags' },
      admin: {
        description: {
          vi: 'Tuỳ chọn. Nhấn Enter sau mỗi thẻ. Dùng cho từ khoá bài viết (article:tag, JSON-LD keywords).',
          en: 'Optional. Press Enter after each tag. Used for article:tag and JSON-LD keywords.',
        },
      },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'news',
      hasMany: true,
      maxRows: 3,
      label: { vi: 'Bài liên quan (chọn tay)', en: 'Related posts (manual)' },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
      admin: {
        description: {
          vi: 'Tối đa 3 bài. Để trống: site tự lấy bài mới nhất cùng danh mục.',
          en: 'Up to 3. Empty: the site picks the latest posts of the same category.',
        },
      },
    },

    // ---- sidebar ----
    payloadSlugField({
      useAsSlug: 'title',
      position: 'sidebar',
      slugify: ({ valueToSlugify }) =>
        typeof valueToSlugify === 'string' ? slugify(valueToSlugify) || undefined : undefined,
      overrides: (row) => {
        for (const field of row.fields) {
          if ('name' in field && field.name === 'slug' && field.type === 'text') {
            field.label = { vi: 'Đường dẫn (slug)', en: 'Slug' };
            field.admin = {
              ...field.admin,
              description: {
                vi: 'Tự sinh từ tiêu đề (bỏ dấu tiếng Việt) cho tới khi xuất bản. Dùng chung VI/EN: /vi/news/slug và /en/news/slug. Đổi slug của bài đã đăng sẽ làm hỏng link cũ.',
                en: 'Generated from the title (diacritics stripped) until published. Shared by VI/EN. Changing a published slug breaks old links.',
              },
            };
          }
          if ('name' in field && field.name === 'generateSlug' && field.type === 'checkbox') {
            const [original, ...rest] = field.hooks?.beforeChange ?? [];
            field.hooks = { ...field.hooks, beforeChange: [withUniqueSlug(original), ...rest] };
          }
        }
        return row;
      },
    }),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'news-categories',
      required: true,
      index: true,
      label: { vi: 'Danh mục', en: 'Category' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      // No defaultValue: it would stamp the DRAFT creation time. Filled on first
      // publish (manual or scheduled) by `computeDerived` unless set by hand.
      label: { vi: 'Ngày đăng', en: 'Published at' },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
        description: {
          vi: 'Để trống: tự điền lúc xuất bản lần đầu (kể cả khi đăng theo lịch). Chỉ nhập tay khi cần lùi/đặt ngày hiển thị. Muốn hẹn giờ đăng: nút mũi tên cạnh "Xuất bản" → "Lên lịch".',
          en: 'Leave empty: filled automatically on first publish (scheduled publishes included). Set by hand only to back-date. To schedule: arrow next to "Publish" → "Schedule".',
        },
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: { vi: 'Tác giả', en: 'Author' },
      defaultValue: ({ user }) => user?.id,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      label: { vi: 'Bài nổi bật', en: 'Featured' },
      admin: {
        position: 'sidebar',
        description: { vi: 'Ghim lên đầu trang Tin tức.', en: 'Pinned at the top of the News page.' },
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      localized: true,
      min: 1,
      label: { vi: 'Thời gian đọc (phút)', en: 'Reading time (min)' },
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: { vi: 'Tự tính khi lưu.', en: 'Computed on save.' },
      },
    },
  ],
};
