import type { Field, FieldHook } from 'payload';

import { foldText, slugify } from '../lib/text';

/**
 * Shared, non-localized slug used in URLs for both languages (/vi/news/x and /en/news/x).
 * Auto-generated from `sourceField` (VI value when created in VI) if left empty.
 */
export function slugField(sourceField: string, overrides: Partial<Field> = {}): Field {
  const formatSlug: FieldHook = ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value);
    const source = data?.[sourceField] ?? originalDoc?.[sourceField];
    if (typeof source === 'string' && source.trim()) return slugify(source);
    return value;
  };

  return {
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    label: { vi: 'Đường dẫn (slug)', en: 'Slug' },
    admin: {
      position: 'sidebar',
      description: {
        vi: 'Để trống để tự tạo từ tiêu đề. Dùng chung cho VI và EN.',
        en: 'Leave empty to generate from the title. Shared by VI and EN.',
      },
    },
    hooks: { beforeValidate: [formatSlug] },
    ...overrides,
  } as Field;
}

/**
 * Hidden accent-folded copy of a text field so the public search
 * ("kiem" matches "Kiếm") works with a simple `like` query.
 */
export function searchField(sourceField: string, localized: boolean): Field {
  const compute: FieldHook = ({ data, siblingData, originalDoc }) => {
    const source = siblingData?.[sourceField] ?? data?.[sourceField] ?? originalDoc?.[sourceField];
    return typeof source === 'string' ? foldText(source) : undefined;
  };
  return {
    name: 'searchText',
    type: 'text',
    localized,
    index: true,
    admin: { hidden: true },
    hooks: { beforeChange: [compute] },
  };
}
