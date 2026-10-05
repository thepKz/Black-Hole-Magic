import type { Block, Where } from 'payload';

import { MB, VIDEO_MAX_BYTES } from '../lib/uploads';
import { VIDEO_ASPECT_RATIOS } from '../lib/video';
import { parseEmbedVideoUrl, validateEmbedVideoUrl } from './embed-url';

/** Upload collection that holds uploaded video files (src/cms/collections/Videos.ts). */
export const VIDEO_UPLOAD_COLLECTION = 'videos' as const;

const onlyImages: Where = { mimeType: { contains: 'image' } };

type VideoSibling = { source?: string | null; url?: string | null } | undefined;

const isUpload = (siblingData: unknown) => (siblingData as VideoSibling)?.source === 'upload';

/**
 * Block `videoEmbed` (slug kept from v1 so existing content keeps rendering).
 *
 * Two sources:
 * - `url`    : YouTube / Vimeo / Facebook video-reel / TikTok / direct .mp4 link.
 *              Validated + normalised on save (tracking params removed,
 *              canonical form stored).
 * - `upload` : a file from the video library (`videos` collection: mp4/webm).
 * Old v1 nodes have no `source` -> treated as `url`.
 *
 * Renderer contract (src/site/components/news/rich-blocks):
 * - source !== 'upload' -> `parseEmbedVideoUrl(url)` from src/cms/blocks/embed-url.ts
 * - aspectRatio 'auto' (or missing) -> 9:16 when parsed.vertical, else the file's
 *   width/height when known, else 16:9.
 * - poster: block `poster` ?? (file as Video).poster ?? provider thumbnail.
 * - autoplay (upload / direct file only) -> <video autoplay muted loop playsinline>.
 */
export const VideoBlock: Block = {
  slug: 'videoEmbed',
  interfaceName: 'VideoEmbedBlock',
  labels: {
    singular: { vi: 'Video', en: 'Video' },
    plural: { vi: 'Video', en: 'Videos' },
  },
  fields: [
    {
      name: 'source',
      type: 'radio',
      defaultValue: 'url',
      label: { vi: 'Nguồn video', en: 'Video source' },
      options: [
        {
          label: { vi: 'Dán link (YouTube, Vimeo, Facebook, TikTok)', en: 'Paste a link (YouTube, Vimeo, Facebook, TikTok)' },
          value: 'url',
        },
        { label: { vi: 'Tải video lên', en: 'Upload a video file' }, value: 'upload' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'url',
      type: 'text',
      label: { vi: 'Link video', en: 'Video link' },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: unknown }) =>
        isUpload(siblingData) ? true : validateEmbedVideoUrl(value),
      hooks: {
        beforeChange: [
          ({ value }) => (typeof value === 'string' && value.trim() ? (parseEmbedVideoUrl(value)?.url ?? value.trim()) : value),
        ],
      },
      admin: {
        condition: (_, siblingData) => !isUpload(siblingData),
        placeholder: 'https://www.youtube.com/watch?v=…',
        description: {
          vi: 'Hỗ trợ YouTube (cả Shorts), Vimeo, video/reel Facebook, TikTok và file .mp4/.webm. Link được làm gọn khi lưu.',
          en: 'YouTube (incl. Shorts), Vimeo, Facebook video/reel, TikTok and .mp4/.webm files. The link is cleaned up on save.',
        },
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: VIDEO_UPLOAD_COLLECTION,
      label: { vi: 'File video', en: 'Video file' },
      validate: (value: unknown, { siblingData }: { siblingData: unknown }) =>
        !isUpload(siblingData) || value ? true : 'Vui lòng chọn hoặc tải lên một file video.',
      admin: {
        condition: (_, siblingData) => isUpload(siblingData),
        description: {
          vi: `Chọn từ Thư viện video hoặc kéo thả file .mp4, .webm, .mov (tối đa ${VIDEO_MAX_BYTES / MB} MB). Nên nén về 1080p để trang tải nhanh.`,
          en: `Pick from the video library or drop an .mp4, .webm, .mov file (max ${VIDEO_MAX_BYTES / MB} MB). Prefer 1080p.`,
        },
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: { vi: 'Ảnh đại diện video', en: 'Poster image' },
      filterOptions: onlyImages,
      admin: {
        description: {
          vi: 'Không bắt buộc. Hiện trước khi bấm phát. Để trống: YouTube tự lấy ảnh, video tải lên dùng ảnh đại diện trong Thư viện video.',
          en: 'Optional. Shown before playback. Empty: YouTube uses its thumbnail, uploads use the poster from the video library.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'aspectRatio',
          type: 'select',
          defaultValue: 'auto',
          label: { vi: 'Tỉ lệ khung', en: 'Aspect ratio' },
          options: [
            { label: { vi: 'Tự động', en: 'Auto' }, value: 'auto' },
            ...VIDEO_ASPECT_RATIOS.map((r) => ({ label: r === '9:16' ? { vi: '9:16 (dọc)', en: '9:16 (vertical)' } : r, value: r })),
          ],
          admin: {
            width: '50%',
            description: {
              vi: 'Tự động: Shorts, TikTok, Reels hiển thị dọc; còn lại 16:9.',
              en: 'Auto: Shorts, TikTok, Reels vertical; others 16:9.',
            },
          },
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: false,
          label: { vi: 'Tự phát, tắt tiếng, lặp lại (clip ngắn)', en: 'Autoplay muted and loop (short clips)' },
          admin: {
            width: '50%',
            condition: (_, siblingData) =>
              isUpload(siblingData) || parseEmbedVideoUrl((siblingData as VideoSibling)?.url)?.provider === 'file',
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: { vi: 'Tên video (cho trình đọc màn hình)', en: 'Title (for screen readers)' },
    },
    {
      type: 'row',
      fields: [
        { name: 'caption', type: 'text', label: { vi: 'Chú thích', en: 'Caption' }, admin: { width: '66%' } },
        {
          name: 'credit',
          type: 'text',
          label: { vi: 'Nguồn', en: 'Credit' },
          admin: { width: '34%', placeholder: 'VD: Black Hole Game' },
        },
      ],
    },
  ],
};
