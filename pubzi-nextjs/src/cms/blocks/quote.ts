import type { Block } from 'payload';

import { validateLink } from './embed-url';

/**
 * Block `quote`: pull quote with attribution (who said it + role + optional
 * source link). The plain Lexical blockquote stays available for short inline
 * quotes; this block is for highlighted statements.
 */
export const QuoteBlock: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: {
    singular: { vi: 'Trích dẫn có nguồn', en: 'Pull quote' },
    plural: { vi: 'Trích dẫn có nguồn', en: 'Pull quotes' },
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      maxLength: 600,
      label: { vi: 'Nội dung trích dẫn', en: 'Quote' },
      admin: { rows: 3, description: { vi: 'Không cần gõ dấu ngoặc kép, hệ thống tự thêm.', en: 'No quotation marks needed.' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          type: 'text',
          label: { vi: 'Người phát biểu', en: 'Speaker' },
          admin: { width: '50%', placeholder: 'VD: Nguyễn Văn A' },
        },
        {
          name: 'role',
          type: 'text',
          label: { vi: 'Chức danh / đơn vị', en: 'Role / organisation' },
          admin: { width: '50%', placeholder: 'VD: Giám đốc sản phẩm, Black Hole' },
        },
      ],
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: { vi: 'Link nguồn', en: 'Source link' },
      validate: (value: string | null | undefined) => validateLink(value),
      admin: { placeholder: 'https://…', description: { vi: 'Không bắt buộc.', en: 'Optional.' } },
    },
  ],
};
