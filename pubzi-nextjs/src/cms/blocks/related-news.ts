import type { Block, Where } from 'payload';

/**
 * Block `relatedNews`: "Đọc thêm" box with 1-3 other articles, inserted between
 * paragraphs. Only published articles (other than the current one) can be picked.
 *
 * Renderer contract: `posts` are populated news docs (maxDepth 1 -> `cover` is
 * an id; fetch covers separately if a thumbnail is wanted). Skip posts that are
 * not objects or not published (they may have been unpublished later).
 */
export const RelatedNewsBlock: Block = {
  slug: 'relatedNews',
  interfaceName: 'RelatedNewsBlock',
  labels: {
    singular: { vi: 'Đọc thêm (bài liên quan)', en: 'Read more (related)' },
    plural: { vi: 'Đọc thêm', en: 'Read more' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 60,
      label: { vi: 'Tiêu đề hộp', en: 'Box title' },
      defaultValue: ({ locale }: { locale?: string }) => (locale === 'en' ? 'Read more' : 'Đọc thêm'),
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'news',
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 3,
      maxDepth: 1,
      label: { vi: 'Bài viết', en: 'Articles' },
      filterOptions: ({ id }): Where => {
        const published: Where = { _status: { equals: 'published' } };
        return id ? { and: [published, { id: { not_equals: id } }] } : published;
      },
      admin: {
        allowCreate: false,
        placeholder: 'Tìm bài để gắn…',
        description: { vi: 'Chọn 1–3 bài đã xuất bản.', en: 'Pick 1-3 published articles.' },
      },
    },
  ],
};
