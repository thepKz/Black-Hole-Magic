import type { Block, TextFieldSingleValidation } from 'payload';

import {
  BlocksFeature,
  CodeBlock,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical';

import { parseVideoUrl, VIDEO_ASPECT_RATIOS } from './lib/video';

/**
 * Rich-text editors.
 *
 * Payload's default features already include: paragraph, headings h1-h6,
 * bold/italic/underline/strikethrough/sub/sup/inline code, ordered/unordered/
 * checklist, link, relationship, blockquote, upload, horizontal rule,
 * text alignment, indent and the floating inline toolbar.
 *
 * `defaultEditor` (config-wide) = defaults + upload caption + fixed toolbar + tables.
 * `newsEditor` (news.content)   = the full article toolkit:
 *   - upload node with a localized `caption` (alt comes from the media doc)
 *   - links: external URL or internal link to another news article, "open in new tab",
 *     plus `rel` options (nofollow / sponsored / ugc)
 *   - EXPERIMENTAL_TableFeature (tables with header rows, cell merge)
 *   - blocks: `videoEmbed` (YouTube / Vimeo / mp4) and `code` (syntax-highlighted)
 *   - relationship node removed (not rendered on the site)
 *   - headings limited to h2-h4 (h1 = article title)
 */

const uploadWithCaption = () =>
  UploadFeature({
    collections: {
      media: {
        fields: [
          {
            name: 'caption',
            type: 'text',
            label: { vi: 'Chú thích ảnh', en: 'Caption' },
            admin: {
              description: {
                vi: 'Hiển thị dưới ảnh. Để trống sẽ dùng chú thích trong thư viện ảnh.',
                en: 'Shown under the image. Empty = use the caption from the media library.',
              },
            },
          },
        ],
      },
    },
  });

export const defaultEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((f) => f.key !== 'upload'),
    uploadWithCaption(),
    FixedToolbarFeature(),
    EXPERIMENTAL_TableFeature(),
  ],
});

const validateVideoUrl: TextFieldSingleValidation = (value) => {
  if (!value) return 'Vui lòng nhập URL video / Video URL is required.';
  return parseVideoUrl(value)
    ? true
    : 'Chỉ hỗ trợ YouTube, Vimeo hoặc file .mp4/.webm / Only YouTube, Vimeo or .mp4/.webm URLs.';
};

/** Lexical block: responsive video embed. Rendered by the site's RichText converter `blocks.videoEmbed`. */
export const VideoEmbedBlock: Block = {
  slug: 'videoEmbed',
  interfaceName: 'VideoEmbedBlock',
  labels: {
    singular: { vi: 'Video (YouTube / Vimeo)', en: 'Video (YouTube / Vimeo)' },
    plural: { vi: 'Video', en: 'Videos' },
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: { vi: 'URL video', en: 'Video URL' },
      validate: validateVideoUrl,
      admin: {
        placeholder: 'https://www.youtube.com/watch?v=…',
        description: {
          vi: 'Dán link YouTube (watch, youtu.be, shorts), Vimeo hoặc file .mp4/.webm.',
          en: 'Paste a YouTube (watch, youtu.be, shorts), Vimeo or .mp4/.webm link.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'aspectRatio',
          type: 'select',
          defaultValue: '16:9',
          label: { vi: 'Tỉ lệ khung', en: 'Aspect ratio' },
          options: VIDEO_ASPECT_RATIOS.map((r) => ({ label: r, value: r })),
          admin: { width: '50%' },
        },
        {
          name: 'title',
          type: 'text',
          label: { vi: 'Tiêu đề (cho trình đọc màn hình)', en: 'Title (for screen readers)' },
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'caption',
      type: 'text',
      label: { vi: 'Chú thích', en: 'Caption' },
    },
  ],
};

/** Languages offered by the code block (kept short on purpose). */
export const CODE_LANGUAGES = {
  plaintext: 'Plain text',
  bash: 'Bash / Shell',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  html: 'HTML',
  css: 'CSS',
  sql: 'SQL',
  python: 'Python',
} as const;

export const newsEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((f) => !['upload', 'link', 'relationship', 'heading'].includes(f.key)),
    // h1 is the article title; h5/h6 are not useful in news. h2/h3 feed the table of contents.
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    uploadWithCaption(),
    LinkFeature({
      enabledCollections: ['news'],
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'rel',
          type: 'select',
          hasMany: true,
          label: { vi: 'Thuộc tính rel', en: 'Rel attribute' },
          options: ['nofollow', 'sponsored', 'ugc'],
          admin: {
            description: {
              vi: 'Dùng "sponsored" cho link quảng cáo/tài trợ, "nofollow" cho link không tin cậy.',
              en: 'Use "sponsored" for paid links, "nofollow" for untrusted links.',
            },
          },
        },
      ],
    }),
    BlocksFeature({
      blocks: [
        VideoEmbedBlock,
        CodeBlock({
          slug: 'code',
          defaultLanguage: 'plaintext',
          languages: { ...CODE_LANGUAGES },
        }),
      ],
    }),
    FixedToolbarFeature(),
    EXPERIMENTAL_TableFeature(),
  ],
});
