import type { CollectionBeforeValidateHook, CollectionConfig, ImageSize } from 'payload';

import { anyone, authenticated, editorOrAdmin } from '../access';
import { revalidateCollection } from '../hooks/revalidate';
import { CACHE_TAGS } from '../lib/tags';
import {
  humanizeFilename,
  IMAGE_MAX_BYTES,
  IMAGE_MIME_TYPES,
  incomingFilename,
  MB,
  pasteAllowList,
  uploadGuard,
} from '../lib/uploads';

const webp = { format: 'webp' as const, options: { quality: 82 } };

/** Derived sizes are never shown as list columns / filters (30 noisy sub-fields). */
const hiddenInList: ImageSize['admin'] = { disableListColumn: true, disableListFilter: true, disableGroupBy: true };

/**
 * Alt text never blocks an upload (bulk paste/drop of a press kit used to need
 * one alt per file before anything saved): when empty it is prefilled from the
 * file name and flagged `altAuto`, so editors - and the publish checklist - can
 * spot and refine it. An alt typed by the editor clears the flag.
 */
const prefillAlt: CollectionBeforeValidateHook = ({ data, operation, originalDoc, req }) => {
  if (!data) return data;
  const touched = operation === 'create' || 'alt' in data;
  if (!touched) return data;
  const alt = typeof data.alt === 'string' ? data.alt.trim() : '';
  if (alt) {
    data.alt = alt;
    if (operation === 'create' || alt !== originalDoc?.alt) data.altAuto = false;
    return data;
  }
  const fromName = humanizeFilename(incomingFilename(req, data, originalDoc));
  data.alt = fromName ?? (req.locale === 'en' ? 'Illustration' : 'Ảnh minh họa');
  data.altAuto = true;
  return data;
};

/**
 * Image library for news (covers, inline images, SEO images, avatars).
 *
 * Pipeline (sharp, once per upload):
 * - Accepts JPG / PNG / WebP / AVIF / GIF up to 15 MB (no SVG: script risk).
 * - The ORIGINAL is auto-rotated (EXIF), stripped of metadata (GPS...), shrunk to
 *   fit 2560x2560 (never enlarged) and re-encoded as WebP q82 - a 25 MB phone
 *   photo becomes ~400-800 KB. The site uses it for inline images via next/image.
 * - Derived sizes (crops honour the focal point set in the admin), never upscaled:
 *   - thumb 400w     : admin thumbnails, related-post thumbnails, avatars
 *   - card  800x450  : news card 16:9
 *   - news  1200x675 : article cover / large card 16:9
 *   - og    1200x630 : Open Graph / Twitter card (JPEG for max compatibility)
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { vi: 'Ảnh', en: 'Image' },
    plural: { vi: 'Thư viện ảnh', en: 'Images' },
  },
  admin: {
    group: { vi: 'Nội dung', en: 'Content' },
    useAsTitle: 'filename',
    description: {
      vi: 'Kéo thả hoặc dán nhiều ảnh cùng lúc. Nhận JPG, PNG, WebP, AVIF, GIF, tối đa 15 MB/ảnh; ảnh tự nén sang WebP và giới hạn cạnh dài 2560 px. Mô tả ảnh (alt) tự điền theo tên tệp, nên sửa lại cho đúng nội dung.',
      en: 'Drag & drop or paste several images at once. JPG, PNG, WebP, AVIF, GIF up to 15 MB each; images are converted to WebP and capped at 2560 px. Alt text is prefilled from the file name - please refine it.',
    },
    defaultColumns: ['filename', 'alt', 'credit', 'filesize', 'width', 'height', 'createdAt'],
    listSearchableFields: ['filename', 'alt', 'caption', 'credit'],
    pagination: { defaultLimit: 40, limits: [20, 40, 80, 120] },
  },
  defaultSort: '-createdAt',
  folders: true,
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    // Removing a file breaks every article that uses it: editors/admins only.
    delete: editorOrAdmin,
  },
  hooks: {
    ...revalidateCollection(CACHE_TAGS.media, CACHE_TAGS.news),
    beforeOperation: [
      uploadGuard({
        maxBytes: IMAGE_MAX_BYTES,
        mimeTypes: IMAGE_MIME_TYPES,
        formats: `JPG, PNG, WebP, AVIF, GIF (tối đa ${IMAGE_MAX_BYTES / MB} MB)`,
        wrongKindHint: (mime) =>
          mime.startsWith('video/')
            ? 'Video hãy tải vào mục "Thư viện video".'
            : mime.includes('heic') || mime.includes('heif')
              ? 'Ảnh HEIC từ iPhone: hãy xuất sang JPG trước.'
              : mime.includes('svg')
                ? 'SVG bị chặn vì lý do bảo mật, hãy xuất sang PNG.'
                : null,
      }),
    ],
    beforeValidate: [prefillAlt],
  },
  upload: {
    // Relative to process.cwd() (project root) - works for Next and the Payload CLI.
    staticDir: 'media',
    mimeTypes: IMAGE_MIME_TYPES,
    bulkUpload: true,
    displayPreview: true,
    focalPoint: true,
    crop: true,
    adminThumbnail: 'thumb',
    pasteURL: { allowList: pasteAllowList() },
    resizeOptions: { width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true },
    formatOptions: webp,
    imageSizes: [
      { name: 'thumb', width: 400, withoutEnlargement: true, formatOptions: webp, admin: hiddenInList },
      {
        name: 'card',
        width: 800,
        height: 450,
        position: 'centre',
        withoutEnlargement: true,
        formatOptions: webp,
        admin: hiddenInList,
      },
      {
        name: 'news',
        width: 1200,
        height: 675,
        position: 'centre',
        withoutEnlargement: true,
        formatOptions: webp,
        admin: hiddenInList,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        withoutEnlargement: true,
        formatOptions: { format: 'jpeg', options: { quality: 82, mozjpeg: true } },
        admin: hiddenInList,
      },
    ],
  },
  fields: [
    // Base upload field, only re-rendered as "158 KB" in the list (merged by Payload).
    {
      name: 'filesize',
      type: 'number',
      admin: { components: { Cell: '/cms/admin/cells/FileSizeCell#FileSizeCell' } },
    },
    {
      name: 'alt',
      type: 'text',
      localized: true,
      maxLength: 250,
      label: { vi: 'Mô tả ảnh (alt)', en: 'Alt text' },
      admin: {
        placeholder: { vi: 'VD: Nhân vật chính cầm kiếm trong trailer mới', en: 'e.g. Hero holding a sword in the new trailer' },
        description: {
          vi: 'Mô tả ngắn nội dung ảnh cho người khiếm thị và Google. Để trống sẽ tự điền theo tên tệp.',
          en: 'Short description for screen readers and Google. Left empty, it is filled from the file name.',
        },
      },
    },
    {
      name: 'altAuto',
      type: 'checkbox',
      localized: true,
      defaultValue: false,
      label: { vi: 'Alt tự sinh (chưa duyệt)', en: 'Auto alt (unreviewed)' },
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: {
          vi: 'Tự bật khi alt được điền theo tên tệp; tắt khi bạn sửa alt.',
          en: 'On when the alt was filled from the file name; cleared once you edit it.',
        },
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      maxLength: 300,
      label: { vi: 'Chú thích', en: 'Caption' },
      admin: {
        description: {
          vi: 'Hiện dưới ảnh trong bài (có thể ghi đè khi chèn ảnh).',
          en: 'Shown under the image in articles (can be overridden per insert).',
        },
      },
    },
    {
      name: 'credit',
      type: 'text',
      maxLength: 120,
      label: { vi: 'Nguồn ảnh / Tác giả', en: 'Credit' },
      admin: {
        placeholder: { vi: 'VD: Ảnh: Black Hole Game', en: 'e.g. Photo: Black Hole Game' },
      },
    },
  ],
};
