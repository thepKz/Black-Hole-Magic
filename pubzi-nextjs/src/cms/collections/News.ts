import type { CollectionBeforeValidateHook, CollectionConfig, FieldHook, PayloadRequest, Where } from 'payload';
import { slugField as payloadSlugField } from 'payload';

import { canPublish, editorOrAdminField, newsDelete, newsUpdate, publishedOrAuthenticated, authenticated } from '../access';
import { newsEditor } from '../editor';
import { searchField } from '../fields/slug';
import { computeDerived, EXCERPT_LIMITS, guardNewsroomRules, keepLiveOnRestore, validateBeforePublish } from '../hooks/newsWorkflow';
import { revalidateNewsAfterChange, revalidateNewsAfterDelete } from '../hooks/revalidateNews';
import { buildPreviewUrl } from '../lib/preview';
import { slugify } from '../lib/text';

/**
 * News articles - the main content type of /admin.
 *
 * Newsroom workflow (src/cms/access.ts + src/cms/hooks/newsWorkflow.ts):
 * - Roles: Phóng viên (author) writes and edits own drafts, sets
 *   "Trạng thái biên tập" to "Chờ duyệt"; Biên tập viên (editor) / Quản trị
 *   (admin) review, publish, schedule and unpublish.
 * - "Trạng thái biên tập" (reviewStatus) runs alongside Payload's _status:
 *   Bản nháp -> Chờ duyệt -> (Cần sửa) -> Đã duyệt (set automatically on publish).
 * - Publishing runs a checklist (title, slug, category, cover with alt, sapo
 *   50-300 chars, non-empty content, alt on inline images) with Vietnamese
 *   errors on the offending fields. Drafts save freely (title + category only).
 *
 * Editor toolkit: Lexical (src/cms/editor.ts), drafts + autosave (5s, after the
 * first manual save - `drafts.validate` stops "Tạo mới" from creating empty
 * rows) + "Lưu nháp" button, scheduled publish/unpublish (jobs, Vietnam time),
 * versions (50/doc, restore, diff), trash (restore deleted articles), duplicate,
 * live preview (mobile/tablet/desktop), slug auto-generated from the title with
 * lock toggle + uniqueness, sapo helper, computed reading time, featured +
 * breaking flags, tags, author + co-authors, source, last editor, SEO tab.
 *
 * Localized: title, excerpt, content, tags, readingTime, meta.*.
 * Shared: everything else (slug, cover, category, people, flags, dates).
 */

/** First free slug among ALL news docs (drafts + trash included): x, x-2, x-3... */
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
    const { totalDocs } = await req.payload.count({
      collection: 'news',
      where,
      req,
      overrideAccess: true,
      trash: true,
    });
    if (totalDocs === 0) return candidate;
    candidate = `${base}-${i}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * Wraps Payload's `generateSlug` hook (on the hidden `generateSlug` checkbox,
 * which writes `data.slug`) and then de-duplicates `data.slug`. Field hooks of
 * sibling fields run concurrently, so this must live in the same hook.
 * Autosave runs this every few seconds: skip the DB query when the slug did not
 * change (it was already unique when stored).
 */
const withUniqueSlug =
  (original: FieldHook | undefined): FieldHook =>
  async (args) => {
    const result = original ? await original(args) : args.value;
    const data = args.data as Record<string, unknown> | undefined;
    const slug = data?.slug;
    if (data && typeof slug === 'string' && slug && slug !== args.originalDoc?.slug) {
      data.slug = await uniqueSlug(args.req, slug, args.originalDoc?.id);
    }
    return result;
  };

/**
 * Drafts are validated (`drafts.validate`), and the required slug is validated
 * BEFORE Payload's generateSlug hook (beforeChange) fills it. Pre-fill it from
 * the title here so a first "Lưu nháp" / API create without a slug passes; the
 * generateSlug + withUniqueSlug hooks then refine / de-duplicate it as usual.
 */
const prefillSlug: CollectionBeforeValidateHook = ({ data, operation, originalDoc }) => {
  if (!data) return data;
  const hasSlug = typeof data.slug === 'string' && data.slug.trim() !== '';
  const title = typeof data.title === 'string' ? data.title : undefined;
  const autoMode = data.generateSlug ?? originalDoc?.generateSlug ?? true;
  if (!hasSlug && title && (operation === 'create' || autoMode !== false || data.slug !== undefined)) {
    data.slug = slugify(title) || undefined;
  }
  return data;
};

const REVIEW_OPTIONS = [
  { label: { vi: 'Bản nháp', en: 'Draft' }, value: 'draft' },
  { label: { vi: 'Chờ duyệt', en: 'Awaiting review' }, value: 'pending' },
  { label: { vi: 'Cần sửa', en: 'Needs changes' }, value: 'changes' },
  { label: { vi: 'Đã duyệt', en: 'Approved' }, value: 'approved' },
];

const people = { allowCreate: false, position: 'sidebar' as const };

// Relationship / select placeholders must be plain strings: a LabelFunction is
// not serialised to the admin client (RSC error). Vietnamese = admin default.

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: { vi: 'Bài viết', en: 'Article' },
    plural: { vi: 'Tin tức', en: 'News' },
  },
  admin: {
    group: { vi: 'Nội dung', en: 'Content' },
    useAsTitle: 'title',
    defaultColumns: ['cover', 'title', 'category', '_status', 'reviewStatus', 'author', 'publishedAt'],
    listSearchableFields: ['title', 'searchText', 'slug'],
    description: {
      vi: 'Soạn, duyệt, hẹn giờ và xuất bản tin. Bài chỉ hiện trên site khi "Đã xuất bản".',
      en: 'Write, review, schedule and publish news. Articles appear on the site only once published.',
    },
    pagination: { defaultLimit: 20, limits: [20, 50, 100] },
    // Only the visible columns are fetched (not the Lexical content of every row).
    enableListViewSelectAPI: true,
    components: {
      beforeListTable: ['/cms/admin/list/NewsQuickFilters#NewsQuickFilters'],
      // "Hẹn giờ đăng" defaults to "Xuất bản" for articles that are not live yet.
      edit: { beforeDocumentControls: ['/cms/admin/fields/ScheduleDefault#ScheduleDefault'] },
    },
    livePreview: {
      url: ({ data, locale, req }) => buildPreviewUrl(data?.slug, locale?.code, req),
      breakpoints: [
        { name: 'mobile', label: 'Điện thoại', width: 375, height: 812 },
        { name: 'tablet', label: 'Máy tính bảng', width: 768, height: 1024 },
        { name: 'desktop', label: 'Máy tính', width: 1440, height: 900 },
      ],
    },
    preview: (doc, { locale, req }) => buildPreviewUrl(doc?.slug as string | undefined, locale, req),
  },
  defaultSort: '-publishedAt',
  // Fields the list cells / hooks need even when their column is hidden.
  forceSelect: { slug: true, _status: true, author: true },
  versions: {
    drafts: {
      // `validate: true`: "Tạo mới" no longer autosaves an empty article; the
      // first save needs a title + category ("Lưu nháp"), then autosave runs.
      validate: true,
      autosave: { interval: 5000, showSaveDraftButton: true },
      schedulePublish: { timeFormat: 'HH:mm', timeIntervals: 5 },
    },
    maxPerDoc: 50,
  },
  trash: true,
  // Public list query: published, newest first.
  indexes: [{ fields: ['_status', 'publishedAt'] }],
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: newsUpdate,
    delete: newsDelete,
    readVersions: authenticated,
  },
  hooks: {
    beforeValidate: [prefillSlug],
    beforeChange: [keepLiveOnRestore, guardNewsroomRules, validateBeforePublish, computeDerived],
    afterChange: [revalidateNewsAfterChange],
    afterDelete: [revalidateNewsAfterDelete],
  },
  fields: [
    // ---- main column (plugin-seo moves these into a "Nội dung" tab) ----
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      maxLength: 160,
      label: { vi: 'Tiêu đề', en: 'Title' },
      hooks: {
        beforeDuplicate: [({ value }) => (typeof value === 'string' && value ? `${value.slice(0, 148)} (bản sao)` : value)],
      },
      admin: {
        placeholder: { vi: 'Tiêu đề bài viết', en: 'Article title' },
        description: {
          vi: 'Nên 40–90 ký tự, có từ khoá chính. Tiêu đề SEO chỉnh riêng ở tab SEO.',
          en: 'Aim for 40–90 characters with the main keyword. The SEO title is tuned in the SEO tab.',
        },
      },
    },
    searchField('title', true, { vi: 'Tiêu đề (không dấu)', en: 'Title (no accents)' }),
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      maxLength: EXCERPT_LIMITS.max,
      label: { vi: 'Sapo (tóm tắt)', en: 'Excerpt' },
      admin: {
        rows: 3,
        placeholder: {
          vi: 'Một-hai câu tóm ý chính của bài, hiện dưới tiêu đề và ở danh sách tin.',
          en: 'One or two sentences summing up the story.',
        },
        description: {
          vi: 'Bắt buộc khi xuất bản. Đồng thời là mô tả SEO mặc định (Google hiển thị ~160 ký tự đầu).',
          en: 'Required to publish. Also the default SEO description (Google shows ~160 characters).',
        },
        components: { afterInput: ['/cms/admin/fields/ExcerptTools#ExcerptTools'] },
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: { vi: 'Ảnh bìa', en: 'Cover image' },
      admin: {
        description: {
          vi: 'Bắt buộc khi xuất bản. Ảnh 16:9, tối thiểu 1200×675, có mô tả (alt). Đặt điểm lấy nét để ảnh cắt đẹp ở mọi khung.',
          en: 'Required to publish. 16:9, at least 1200×675, with alt text. Set the focal point so crops look right.',
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
        placeholder: { vi: 'Nhập thẻ rồi nhấn Enter', en: 'Type a tag and press Enter' },
        description: {
          vi: 'Tuỳ chọn, tối đa 10 thẻ. Dùng làm từ khoá của bài (article:tag, JSON-LD).',
          en: 'Optional, up to 10. Used as article keywords (article:tag, JSON-LD).',
        },
      },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'news',
      hasMany: true,
      maxRows: 3,
      label: { vi: 'Bài liên quan', en: 'Related posts' },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
      admin: {
        allowCreate: false,
        placeholder: 'Tìm bài để gắn',
        description: {
          vi: 'Tối đa 3 bài. Để trống: site tự lấy bài mới nhất cùng danh mục.',
          en: 'Up to 3. Empty: the site picks the latest posts of the same category.',
        },
      },
    },
    {
      name: 'source',
      type: 'group',
      label: { vi: 'Nguồn tin', en: 'Source' },
      admin: {
        description: {
          vi: 'Chỉ điền khi bài tổng hợp / dẫn lại từ nơi khác.',
          en: 'Only when the story is based on another outlet.',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              maxLength: 120,
              label: { vi: 'Tên nguồn', en: 'Source name' },
              admin: { width: '40%', placeholder: { vi: 'VD: Thông cáo NPH', en: 'e.g. Press release' } },
            },
            {
              name: 'url',
              type: 'text',
              maxLength: 500,
              label: { vi: 'Link gốc', en: 'Original URL' },
              validate: (value: string | null | undefined) =>
                !value || /^https?:\/\/\S+$/i.test(value) ? true : 'Link phải bắt đầu bằng http:// hoặc https://',
              admin: { width: '60%', placeholder: 'https://' },
            },
          ],
        },
      ],
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
      // The built-in SlugField component does not render `admin.description`.
      name: 'slugHint',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: {
            path: '/cms/admin/fields/FieldHint#FieldHint',
            clientProps: {
              vi: 'Tự sinh từ tiêu đề (bỏ dấu) cho tới khi xuất bản; bấm khoá để sửa tay. Dùng chung VI/EN. Đổi slug của bài đã đăng sẽ làm hỏng link cũ.',
              en: 'Generated from the title until published; unlock to edit. Shared by VI/EN. Changing a published slug breaks old links.',
            },
          },
        },
      },
    },
    {
      name: 'reviewStatus',
      type: 'select',
      // Not `required`: system writes (seed, imports) may omit it; defaults to draft.
      defaultValue: 'draft',
      hooks: { beforeDuplicate: [() => 'draft'] },
      index: true,
      label: { vi: 'Trạng thái biên tập', en: 'Review status' },
      options: REVIEW_OPTIONS,
      // Authors only see "Bản nháp" / "Chờ duyệt" (+ the current value).
      filterOptions: ({ options, req, siblingData }) =>
        canPublish(req.user as never)
          ? options
          : options.filter((o) => {
              const v = typeof o === 'string' ? o : o.value;
              return v === 'draft' || v === 'pending' || v === (siblingData as { reviewStatus?: string })?.reviewStatus;
            }),
      admin: {
        position: 'sidebar',
        description: {
          vi: 'Phóng viên chuyển sang "Chờ duyệt" khi viết xong. Biên tập viên duyệt hoặc trả "Cần sửa". Tự thành "Đã duyệt" khi xuất bản.',
          en: 'Authors set "Awaiting review" when done. Editors approve or return "Needs changes". Becomes "Approved" on publish.',
        },
        components: {
          Cell: {
            path: '/cms/admin/cells/BadgeCell#BadgeCell',
            clientProps: { tones: { draft: 'neutral', pending: 'warn', changes: 'danger', approved: 'success' } },
          },
        },
      },
    },
    {
      name: 'reviewNote',
      type: 'textarea',
      maxLength: 1000,
      label: { vi: 'Ghi chú biên tập', en: 'Editorial note' },
      admin: {
        position: 'sidebar',
        rows: 3,
        placeholder: { vi: 'Góp ý cho phóng viên / lưu ý khi duyệt', en: 'Notes between author and editor' },
        description: { vi: 'Nội bộ, không hiện trên site.', en: 'Internal, never shown on the site.' },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'news-categories',
      required: true,
      index: true,
      label: { vi: 'Danh mục', en: 'Category' },
      admin: {
        position: 'sidebar',
        allowCreate: false,
        placeholder: 'Chọn danh mục',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      // No defaultValue: it would stamp the DRAFT creation time. Filled on first
      // publish (manual or scheduled) by `computeDerived` unless set by hand.
      label: { vi: 'Ngày đăng', en: 'Published at' },
      // A copy is a new article: its date is set when it is first published.
      hooks: { beforeDuplicate: [() => null] },
      access: { update: editorOrAdminField, create: editorOrAdminField },
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm', timeFormat: 'HH:mm' },
        description: {
          vi: 'Để trống: tự điền lúc xuất bản lần đầu (kể cả đăng theo lịch). Chỉ nhập tay khi cần lùi ngày. Hẹn giờ đăng: mũi tên cạnh "Xuất bản" → "Hẹn giờ đăng".',
          en: 'Empty: filled on first publish (scheduled too). Set by hand only to back-date. To schedule: arrow next to "Publish".',
        },
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: { vi: 'Tác giả', en: 'Author' },
      defaultValue: ({ user }) => user?.id,
      index: true,
      // Authors cannot reassign (also enforced by guardNewsroomRules).
      access: { update: editorOrAdminField },
      admin: { ...people, placeholder: 'Chọn tác giả' },
    },
    {
      name: 'coAuthors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      maxRows: 5,
      label: { vi: 'Đồng tác giả', en: 'Co-authors' },
      filterOptions: ({ siblingData }) => {
        const author = (siblingData as { author?: number | string | { id: number | string } })?.author;
        const id = author && typeof author === 'object' ? author.id : author;
        return id ? { id: { not_equals: id } } : true;
      },
      admin: { ...people, placeholder: 'Thêm người cùng viết' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      label: { vi: 'Ghim nổi bật', en: 'Featured' },
      hooks: { beforeDuplicate: [() => false] },
      access: { update: editorOrAdminField, create: editorOrAdminField },
      admin: {
        position: 'sidebar',
        description: { vi: 'Ghim lên đầu trang Tin tức.', en: 'Pinned at the top of the News page.' },
        components: {
          Cell: { path: '/cms/admin/cells/FlagCell#FlagCell', clientProps: { vi: 'Nổi bật', en: 'Featured' } },
        },
      },
    },
    {
      name: 'breaking',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      label: { vi: 'Tin nóng', en: 'Breaking' },
      hooks: { beforeDuplicate: [() => false] },
      access: { update: editorOrAdminField, create: editorOrAdminField },
      admin: {
        position: 'sidebar',
        description: { vi: 'Gắn nhãn "Tin nóng" cho bài.', en: 'Marks the article as breaking news.' },
        components: {
          Cell: {
            path: '/cms/admin/cells/FlagCell#FlagCell',
            clientProps: { vi: 'Tin nóng', en: 'Breaking', tone: 'danger' },
          },
        },
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
    {
      name: 'lastEditedBy',
      type: 'relationship',
      relationTo: 'users',
      label: { vi: 'Người sửa cuối', en: 'Last edited by' },
      admin: {
        position: 'sidebar',
        readOnly: true,
        allowCreate: false,
        placeholder: 'Chưa có',
        description: { vi: 'Tự ghi khi lưu (kèm "Lần sửa cuối" phía trên).', en: 'Set on save.' },
      },
    },
  ],
};
