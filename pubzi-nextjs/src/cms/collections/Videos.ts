import type { CollectionBeforeChangeHook, CollectionBeforeValidateHook, CollectionConfig } from 'payload';

import { anyone, authenticated, editorOrAdmin, ownUploadOrEditor } from '../access';
import { createdByField, revalidateUploadUsage } from '../fields/createdBy';
import { preventVideoDeleteInUse } from '../hooks/preventDeleteInUse';
import { CACHE_TAGS } from '../lib/tags';
import {
  formatDuration,
  humanizeIncoming,
  MB,
  pasteAllowList,
  probeVideo,
  uploadGuard,
  VIDEO_MAX_BYTES,
  VIDEO_MIME_TYPES,
} from '../lib/uploads';

/** Title defaults to the humanized file name so bulk uploads never block. */
const prefillTitle: CollectionBeforeValidateHook = ({ data, operation, originalDoc, req }) => {
  if (!data) return data;
  if (operation !== 'create' && !('title' in data)) return data;
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  data.title = title || humanizeIncoming(req, data, originalDoc) || 'Video không tên';
  return data;
};

/**
 * Payload stores no width/height/duration for non-image uploads: read them from
 * the MP4/MOV header (moov box) whenever a new file is attached. WebM stays empty.
 */
const probeOnUpload: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!req.file) return data;
  const info = await probeVideo(req.file);
  data.duration = info.duration;
  data.width = info.width;
  data.height = info.height;
  return data;
};

/**
 * Video library: short clips / trailers uploaded straight into articles
 * (Lexical "Video" block, source "Tải video lên"). Files are served by Payload at
 * /api/videos/file/<name> with HTTP range support (seeking works).
 * No transcoding: editors should upload web-ready MP4 (H.264 + AAC).
 */
export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: {
    singular: { vi: 'Video', en: 'Video' },
    plural: { vi: 'Thư viện video', en: 'Videos' },
  },
  admin: {
    group: { vi: 'Nội dung', en: 'Content' },
    useAsTitle: 'title',
    description: {
      vi: `Tải video ngắn, trailer để chèn vào bài. Nhận MP4, WebM, MOV, tối đa ${VIDEO_MAX_BYTES / MB} MB; nên dùng MP4 (H.264) dưới 50 MB để người đọc xem mượt trên di động. Video dài hãy đăng YouTube rồi dán link.`,
      en: `Short clips and trailers for articles. MP4, WebM, MOV up to ${VIDEO_MAX_BYTES / MB} MB; prefer MP4 (H.264) under 50 MB. Long videos: upload to YouTube and paste the link.`,
    },
    defaultColumns: ['title', 'filename', 'durationLabel', 'filesize', 'poster', 'createdAt'],
    listSearchableFields: ['title', 'filename', 'caption', 'credit'],
    pagination: { defaultLimit: 40, limits: [20, 40, 80] },
  },
  defaultSort: '-createdAt',
  folders: true,
  access: {
    read: anyone,
    create: authenticated,
    // Authors edit / replace only their own uploads.
    update: ownUploadOrEditor,
    // Editors/admins only, and never while an article still uses the video.
    delete: editorOrAdmin,
  },
  hooks: {
    ...revalidateUploadUsage(CACHE_TAGS.media, CACHE_TAGS.news),
    beforeDelete: [preventVideoDeleteInUse],
    beforeOperation: [
      uploadGuard({
        maxBytes: VIDEO_MAX_BYTES,
        mimeTypes: VIDEO_MIME_TYPES,
        formats: `MP4, WebM, MOV (tối đa ${VIDEO_MAX_BYTES / MB} MB)`,
        wrongKindHint: (mime) => (mime.startsWith('image/') ? 'Ảnh hãy tải vào mục "Thư viện ảnh".' : null),
      }),
    ],
    beforeValidate: [prefillTitle],
    beforeChange: [probeOnUpload],
  },
  upload: {
    // Sub-folder of the image library dir; Payload serves it at /api/videos/file/*.
    staticDir: 'media/videos',
    mimeTypes: VIDEO_MIME_TYPES,
    bulkUpload: true,
    displayPreview: true,
    pasteURL: { allowList: pasteAllowList() },
    // List/drawer thumbnail = poster's thumb when the poster is populated.
    adminThumbnail: ({ doc }) => {
      const poster = doc.poster as { url?: string | null; sizes?: { thumb?: { url?: string | null } } } | null;
      return (typeof poster === 'object' && (poster?.sizes?.thumb?.url || poster?.url)) || null;
    },
  },
  fields: [
    // Base upload field, only re-rendered as "158 KB" in the list (merged by Payload).
    {
      name: 'filesize',
      type: 'number',
      label: { vi: 'Dung lượng', en: 'File size' },
      admin: { components: { Cell: '/cms/admin/cells/FileSizeCell#FileSizeCell' } },
    },
    {
      name: 'title',
      type: 'text',
      maxLength: 200,
      label: { vi: 'Tên video', en: 'Title' },
      admin: {
        description: {
          vi: 'Dùng để tìm trong thư viện và làm tiêu đề cho trình đọc màn hình. Để trống sẽ lấy theo tên tệp.',
          en: 'Used for search and as the accessible title. Left empty, it is taken from the file name.',
        },
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: { vi: 'Ảnh đại diện (poster)', en: 'Poster image' },
      admin: {
        description: {
          vi: 'Ảnh hiện trước khi bấm phát. Nên dùng ảnh cùng tỉ lệ với video (thường 16:9).',
          en: 'Shown before playback. Use the same aspect ratio as the video (usually 16:9).',
        },
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      maxLength: 300,
      label: { vi: 'Chú thích', en: 'Caption' },
    },
    {
      name: 'credit',
      type: 'text',
      maxLength: 120,
      label: { vi: 'Nguồn video', en: 'Credit' },
      admin: { placeholder: { vi: 'VD: Trailer chính thức của NPH', en: 'e.g. Official publisher trailer' } },
    },
    {
      name: 'duration',
      type: 'number',
      label: { vi: 'Thời lượng (giây)', en: 'Duration (s)' },
      // Raw seconds for the site (<video> metadata, JSON-LD); editors see durationLabel.
      admin: { hidden: true },
    },
    {
      name: 'durationLabel',
      type: 'text',
      virtual: true,
      label: { vi: 'Thời lượng', en: 'Duration' },
      admin: {
        position: 'sidebar',
        readOnly: true,
        disableListFilter: true,
        description: { vi: 'Tự đọc từ tệp MP4/MOV khi tải lên.', en: 'Read from the MP4/MOV file on upload.' },
      },
      hooks: {
        afterRead: [({ siblingData }) => formatDuration(siblingData?.duration as number | null | undefined)],
      },
    },
    createdByField,
  ],
};
