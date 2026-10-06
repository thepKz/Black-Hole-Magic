import type { CollectionConfig } from 'payload';

import { adminOnly, anyone, editorOrAdmin } from '../access';
import { slugField } from '../fields/slug';
import { preventCategoryDeleteInUse } from '../hooks/preventDeleteInUse';
import { revalidateCollection } from '../hooks/revalidate';
import { CACHE_TAGS } from '../lib/tags';

/**
 * News categories (segmented filter on /{locale}/news?cat={slug}).
 * Fields: name (localized), slug (unique, shared, auto from name), description
 * (localized, optional - used as meta description of the filtered list), order.
 * Seeded values: game (Tin game), event (Sự kiện), notice (Thông báo).
 * Editors may rename; only admins create/delete (slugs are part of URLs).
 */
export const NewsCategories: CollectionConfig = {
  slug: 'news-categories',
  labels: {
    singular: { vi: 'Danh mục tin', en: 'News category' },
    plural: { vi: 'Danh mục tin', en: 'News categories' },
  },
  admin: {
    group: { vi: 'Nội dung', en: 'Content' },
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    description: {
      vi: 'Nhóm tin hiển thị thành bộ lọc trên trang Tin tức. Chỉ Quản trị viên thêm / xoá (slug nằm trong URL); Biên tập viên có thể đổi tên.',
      en: 'Groups shown as filters on the News page. Only admins add / delete (the slug is part of the URL); editors may rename.',
    },
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: adminOnly,
    update: editorOrAdmin,
    delete: adminOnly,
  },
  hooks: {
    ...revalidateCollection(CACHE_TAGS.newsCategories, CACHE_TAGS.news),
    // Category is required on every article: refuse to delete one still in use.
    beforeDelete: [preventCategoryDeleteInUse],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: { vi: 'Tên', en: 'Name' },
    },
    slugField('name'),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      maxLength: 200,
      label: { vi: 'Mô tả ngắn', en: 'Short description' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: { vi: 'Thứ tự', en: 'Order' },
      admin: {
        position: 'sidebar',
        description: { vi: 'Số nhỏ đứng trước.', en: 'Lower numbers come first.' },
      },
    },
  ],
};
