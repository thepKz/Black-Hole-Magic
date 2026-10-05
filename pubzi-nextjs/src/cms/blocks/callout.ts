import type { Block } from 'payload';

import {
  BoldFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical';

/** Values of `callout.variant` (stable - the renderer maps them to styles). */
export const CALLOUT_VARIANTS = ['note', 'important', 'warning'] as const;
export type CalloutVariant = (typeof CALLOUT_VARIANTS)[number];

/** Small editor for short boxed content: paragraphs, basic marks, links, lists. */
const calloutEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    LinkFeature({ enabledCollections: ['news'] }),
    InlineToolbarFeature(),
  ],
});

/**
 * Block `callout`: highlighted info box ("Box thông tin") inside an article -
 * key facts, event info, reward codes, warnings.
 */
export const CalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  labels: {
    singular: { vi: 'Hộp ghi chú', en: 'Callout' },
    plural: { vi: 'Hộp ghi chú', en: 'Callouts' },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'note',
          label: { vi: 'Loại', en: 'Type' },
          options: [
            { label: { vi: 'Ghi chú', en: 'Note' }, value: 'note' },
            { label: { vi: 'Lưu ý', en: 'Important' }, value: 'important' },
            { label: { vi: 'Cảnh báo', en: 'Warning' }, value: 'warning' },
          ],
          admin: { width: '34%' },
        },
        {
          name: 'title',
          type: 'text',
          maxLength: 120,
          label: { vi: 'Tiêu đề hộp', en: 'Title' },
          admin: { width: '66%', placeholder: 'VD: Thông tin sự kiện' },
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: calloutEditor,
      label: { vi: 'Nội dung', en: 'Content' },
      admin: {
        description: { vi: 'Nên ngắn gọn, 1–5 dòng.', en: 'Keep it short, 1-5 lines.' },
      },
    },
  ],
};
