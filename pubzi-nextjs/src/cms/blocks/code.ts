import type { Block } from 'payload';

import { CodeBlock as payloadCodeBlock } from '@payloadcms/richtext-lexical';

/** Languages offered by the code block (kept short on purpose). */
export const CODE_LANGUAGES = {
  plaintext: 'Văn bản thường',
  bash: 'Bash / Shell',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  html: 'HTML',
  css: 'CSS',
  sql: 'SQL',
  python: 'Python',
} as const;

/** Block `code` (slug kept from v1): Payload's premade syntax-highlighted code block. */
export const CodeBlock: Block = payloadCodeBlock({
  slug: 'code',
  defaultLanguage: 'plaintext',
  languages: { ...CODE_LANGUAGES },
  fieldOverrides: {
    interfaceName: 'CodeBlock',
    labels: {
      singular: { vi: 'Đoạn mã', en: 'Code' },
      plural: { vi: 'Đoạn mã', en: 'Code' },
    },
  },
});
