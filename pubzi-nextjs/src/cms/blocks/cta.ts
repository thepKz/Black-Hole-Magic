import type { Block } from 'payload';

import { validateLink } from './embed-url';

/**
 * Block `cta`: a link button inside the article (event page, fanpage, pre-order...).
 * Renderer: external URLs get rel="noopener" (+ "nofollow sponsored" when
 * `nofollow`), target=_blank when `newTab`; site paths use next/link.
 */
export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: {
    singular: { vi: 'Nút liên kết', en: 'Button link' },
    plural: { vi: 'Nút liên kết', en: 'Button links' },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          maxLength: 60,
          label: { vi: 'Chữ trên nút', en: 'Button text' },
          admin: { width: '40%', placeholder: 'VD: Xem chi tiết sự kiện' },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: { vi: 'Đường dẫn', en: 'URL' },
          validate: (value: string | null | undefined) => validateLink(value, { required: true }),
          admin: { width: '60%', placeholder: 'https://… hoặc /vi/news/…' },
        },
      ],
    },
    {
      name: 'note',
      type: 'text',
      maxLength: 160,
      label: { vi: 'Dòng mô tả ngắn', en: 'Short description' },
      admin: { description: { vi: 'Không bắt buộc. Hiện phía trên nút.', en: 'Optional. Shown above the button.' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'primary',
          label: { vi: 'Kiểu nút', en: 'Style' },
          options: [
            { label: { vi: 'Nổi bật', en: 'Primary' }, value: 'primary' },
            { label: { vi: 'Nhẹ', en: 'Secondary' }, value: 'secondary' },
          ],
          admin: { width: '34%' },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: true,
          label: { vi: 'Mở tab mới', en: 'Open in new tab' },
          admin: { width: '33%' },
        },
        {
          name: 'nofollow',
          type: 'checkbox',
          defaultValue: false,
          label: { vi: 'Link tài trợ (nofollow)', en: 'Sponsored (nofollow)' },
          admin: { width: '33%' },
        },
      ],
    },
  ],
};
