import type { Block } from 'payload';

import { parseSocialUrl, validateSocialUrl } from './embed-url';

/**
 * Block `socialEmbed`: a single post from Facebook, X (Twitter), TikTok or
 * Instagram. Only the URL is stored (normalised on save); the renderer derives
 * provider + iframe via `parseSocialUrl(url)` (src/cms/blocks/embed-url.ts).
 * X has no script-free iframe: render a link card or load widgets.js on demand.
 */
export const SocialEmbedBlock: Block = {
  slug: 'socialEmbed',
  interfaceName: 'SocialEmbedBlock',
  labels: {
    singular: { vi: 'Nhúng mạng xã hội', en: 'Social post' },
    plural: { vi: 'Nhúng mạng xã hội', en: 'Social posts' },
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: { vi: 'Link bài đăng', en: 'Post link' },
      validate: (value: string | null | undefined) => validateSocialUrl(value),
      hooks: {
        beforeChange: [
          ({ value }) => (typeof value === 'string' && value.trim() ? (parseSocialUrl(value)?.url ?? value.trim()) : value),
        ],
      },
      admin: {
        placeholder: 'https://www.facebook.com/blackholegame/posts/…',
        description: {
          vi: 'Dán link một bài cụ thể trên Facebook, X (Twitter), TikTok hoặc Instagram. Bài phải ở chế độ công khai.',
          en: 'Paste the link of a single public post on Facebook, X (Twitter), TikTok or Instagram.',
        },
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: { vi: 'Chú thích', en: 'Caption' },
    },
  ],
};
