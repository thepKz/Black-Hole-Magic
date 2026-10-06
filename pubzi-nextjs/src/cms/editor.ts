import type { Field, FilterOptions, Where } from 'payload';

import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical';

import { NEWS_BLOCKS } from './blocks';
import { TableFeatureVi } from './lexical/tableVi';

/**
 * Rich-text editors.
 *
 * `defaultEditor` (config-wide fallback): Payload defaults + image caption,
 *   fixed toolbar and tables.
 * `newsEditor` (news.content): the full newsroom toolkit, features listed
 *   explicitly (order = toolbar order):
 *   - text: paragraph, H2-H4 (H1 = article title; H2/H3 feed the table of
 *     contents), bold / italic / underline / strike, sub / superscript, inline code
 *   - layout: align (left/center/right/justify), indent, bullet / numbered /
 *     checklist, blockquote, horizontal rule, table
 *   - links: external URL or internal link to another article, "open in new tab",
 *     rel options (nofollow / sponsored / ugc)
 *   - inline image (upload node, media library only) with caption + display size
 *     (full / medium / small) + alignment for non-full images
 *   - blocks (src/cms/blocks): gallery, videoEmbed (link or upload), socialEmbed,
 *     quote (pull quote with source), callout, relatedNews, cta, code
 *   - fixed toolbar on top + floating inline toolbar on selection
 *   - relationship node removed (not rendered on the site; use "Đọc thêm" block).
 */

/* ------------------------------------------------------------------ */
/* Inline image (upload node) fields                                    */
/* ------------------------------------------------------------------ */

/** Values of the upload node's `size` field (renderer maps them to widths). */
export const IMAGE_DISPLAY_SIZES = ['full', 'medium', 'small'] as const;
export type ImageDisplaySize = (typeof IMAGE_DISPLAY_SIZES)[number];
/** Values of the upload node's `align` field (only used when size !== 'full'). */
export const IMAGE_ALIGNMENTS = ['center', 'left', 'right'] as const;
export type ImageAlignment = (typeof IMAGE_ALIGNMENTS)[number];

const inlineImageFields: Field[] = [
  {
    name: 'caption',
    type: 'text',
    label: { vi: 'Chú thích ảnh', en: 'Caption' },
    admin: {
      description: {
        vi: 'Hiện dưới ảnh. Để trống sẽ dùng chú thích trong Thư viện ảnh.',
        en: 'Shown under the image. Empty = the caption from the media library.',
      },
    },
  },
  {
    type: 'row',
    fields: [
      {
        name: 'size',
        type: 'select',
        defaultValue: 'full',
        label: { vi: 'Kích thước hiển thị', en: 'Display size' },
        options: [
          { label: { vi: 'Toàn khung', en: 'Full width' }, value: 'full' },
          { label: { vi: 'Vừa', en: 'Medium' }, value: 'medium' },
          { label: { vi: 'Nhỏ', en: 'Small' }, value: 'small' },
        ],
        admin: { width: '50%' },
      },
      {
        name: 'align',
        type: 'select',
        defaultValue: 'center',
        label: { vi: 'Căn ảnh', en: 'Alignment' },
        options: [
          { label: { vi: 'Căn giữa', en: 'Center' }, value: 'center' },
          { label: { vi: 'Căn trái (chữ bao quanh)', en: 'Left (text wraps)' }, value: 'left' },
          { label: { vi: 'Căn phải (chữ bao quanh)', en: 'Right (text wraps)' }, value: 'right' },
        ],
        admin: {
          width: '50%',
          condition: (_, siblingData) => (siblingData as { size?: string } | undefined)?.size !== 'full',
        },
      },
    ],
  },
];

const inlineImage = () =>
  UploadFeature({
    enabledCollections: ['media'],
    collections: { media: { fields: inlineImageFields } },
    // the media doc itself is all the site needs (url, alt, sizes, caption, credit)
    maxDepth: 1,
  });

/* ------------------------------------------------------------------ */
/* Links                                                                */
/* ------------------------------------------------------------------ */

/**
 * Internal links may only target PUBLISHED articles other than the current one
 * (a draft or trashed target 404s on the site), and the picker cannot create a
 * new article from inside the link drawer.
 */
const publishedOtherNews: FilterOptions = ({ id }) => {
  const published: Where = { _status: { equals: 'published' } };
  return id ? { and: [published, { id: { not_equals: id } }] } : published;
};

const restrictInternalDoc = <T extends { name?: string; type?: string; admin?: object }>(fields: T[]): T[] =>
  fields.map((field) =>
    field.name === 'doc' && field.type === 'relationship'
      ? ({ ...field, filterOptions: publishedOtherNews, admin: { ...field.admin, allowCreate: false } } as T)
      : field,
  );

const newsLink = () =>
  LinkFeature({
    enabledCollections: ['news'],
    maxDepth: 1,
    fields: ({ defaultFields }) => [
      ...restrictInternalDoc(defaultFields),
      {
        name: 'rel',
        type: 'select',
        hasMany: true,
        label: { vi: 'Thuộc tính rel', en: 'Rel attribute' },
        options: [
          { label: { vi: 'nofollow (không tin cậy)', en: 'nofollow' }, value: 'nofollow' },
          { label: { vi: 'sponsored (quảng cáo/tài trợ)', en: 'sponsored' }, value: 'sponsored' },
          { label: { vi: 'ugc (nội dung người dùng)', en: 'ugc' }, value: 'ugc' },
        ],
        admin: {
          condition: (_, siblingData) => (siblingData as { linkType?: string } | undefined)?.linkType !== 'internal',
          description: {
            vi: 'Chỉ dùng cho link ra ngoài. Link quảng cáo/tài trợ hãy chọn "sponsored".',
            en: 'External links only. Use "sponsored" for paid links.',
          },
        },
      },
    ],
  });

/* ------------------------------------------------------------------ */
/* Editors                                                              */
/* ------------------------------------------------------------------ */

export const defaultEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((f) => f.key !== 'upload'),
    inlineImage(),
    FixedToolbarFeature(),
    TableFeatureVi(),
  ],
});

export const newsEditor = lexicalEditor({
  features: () => [
    // text
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    InlineCodeFeature(),
    newsLink(),
    // layout
    AlignFeature(),
    IndentFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    ChecklistFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    TableFeatureVi(),
    // media + blocks
    inlineImage(),
    BlocksFeature({ blocks: NEWS_BLOCKS }),
    // toolbars
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
});

export { CODE_LANGUAGES, NEWS_BLOCKS, NEWS_BLOCK_SLUGS, type NewsBlockSlug } from './blocks';
