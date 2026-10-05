import type { CollectionConfig } from 'payload';

import { adminOnly, anyone, authenticated } from '../access';
import { slugField } from '../fields/slug';
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
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: adminOnly,
    update: authenticated,
    delete: adminOnly,
  },
  hooks: revalidateCollection(CACHE_TAGS.newsCategories, CACHE_TAGS.news),
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
      admin: { position: 'sidebar' },
    },
  ],
};
