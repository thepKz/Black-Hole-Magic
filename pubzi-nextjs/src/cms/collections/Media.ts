import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';
import { revalidateCollection } from '../hooks/revalidate';
import { CACHE_TAGS } from '../lib/tags';

const webp = { format: 'webp' as const, options: { quality: 82 } };

/**
 * Upload library for news (covers, inline images, SEO images).
 * Image sizes (all crops honour the focal point set in the admin):
 * - thumb 400w        : admin list + small related-post thumbnails
 * - card  800x450     : news card 16:9
 * - news  1200x675    : article cover / inline image 16:9
 * - og    1200x630    : Open Graph / Twitter large card (JPEG for max compatibility)
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { vi: 'Ảnh', en: 'Media' },
    plural: { vi: 'Thư viện ảnh', en: 'Media' },
  },
  admin: {
    group: { vi: 'Nội dung', en: 'Content' },
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'width', 'height', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: revalidateCollection(CACHE_TAGS.media, CACHE_TAGS.news),
  upload: {
    // Relative to process.cwd() (project root) - works for Next and the Payload CLI.
    staticDir: 'media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    crop: true,
    adminThumbnail: 'thumb',
    imageSizes: [
      { name: 'thumb', width: 400, formatOptions: webp },
      {
        name: 'card',
        width: 800,
        height: 450,
        position: 'centre',
        withoutEnlargement: false,
        formatOptions: webp,
      },
      {
        name: 'news',
        width: 1200,
        height: 675,
        position: 'centre',
        withoutEnlargement: false,
        formatOptions: webp,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        withoutEnlargement: false,
        formatOptions: { format: 'jpeg', options: { quality: 82 } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
      label: { vi: 'Mô tả ảnh (alt)', en: 'Alt text' },
      admin: {
        description: {
          vi: 'Bắt buộc. Mô tả ngắn nội dung ảnh cho trình đọc màn hình và SEO.',
          en: 'Required. Short description for screen readers and SEO.',
        },
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      label: { vi: 'Chú thích', en: 'Caption' },
    },
    {
      name: 'credit',
      type: 'text',
      label: { vi: 'Nguồn ảnh', en: 'Credit' },
    },
  ],
};
