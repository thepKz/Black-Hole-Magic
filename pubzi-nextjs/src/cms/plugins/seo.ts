import { seoPlugin } from '@payloadcms/plugin-seo';
import type { GenerateDescription, GenerateImage, GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types';
import type { Field } from 'payload';

/**
 * @payloadcms/plugin-seo wiring for news. Adds a `meta` group
 * ({ title, description, image }) to `news`, with length indicators, a SERP
 * preview and "Auto-generate" buttons driven by the generators below.
 * The CMS agent may tune `fields` / `tabbedUI` here.
 */
const SITE_NAME = 'Black Hole Game';
const TITLE_SUFFIX = ` | ${SITE_NAME}`;

/**
 * ONE set of length targets, used by the SEO tab indicators (title/description
 * fields + overview checklist), the generators below and the field hints in
 * src/cms/collections/News.ts. Indicators only guide: nothing blocks saving.
 */
export const SEO_LENGTHS = {
  title: { minLength: 40, maxLength: 70 },
  description: { minLength: 70, maxLength: 160 },
} as const;
const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

type NewsLike = {
  title?: string | null;
  excerpt?: string | null;
  slug?: string | null;
  cover?: number | string | { id: number | string } | null;
};

const clip = (text: string, max: number) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
};

/** Clips only the article title so the brand suffix always stays whole. */
const generateTitle: GenerateTitle<NewsLike> = ({ doc }) =>
  doc?.title ? `${clip(doc.title, SEO_LENGTHS.title.maxLength - TITLE_SUFFIX.length)}${TITLE_SUFFIX}` : SITE_NAME;

const generateDescription: GenerateDescription<NewsLike> = ({ doc }) =>
  doc?.excerpt ? clip(doc.excerpt, SEO_LENGTHS.description.maxLength) : '';

const noLengthValidation = () => true as const;

/** Plugin default fields with our length targets (defaults are 50-60 / 100-150). */
const withLengths = (fields: Field[]): Field[] =>
  fields.map((field) => {
    if (!('name' in field)) return field;
    if (field.name === 'title' && field.type === 'text') {
      return { ...field, ...SEO_LENGTHS.title, validate: noLengthValidation } as Field;
    }
    if (field.name === 'description' && field.type === 'textarea') {
      return { ...field, ...SEO_LENGTHS.description, validate: noLengthValidation } as Field;
    }
    if (field.name === 'overview' && field.type === 'ui') {
      const Comp = field.admin?.components?.Field;
      if (Comp && typeof Comp === 'object' && 'path' in Comp) {
        return {
          ...field,
          admin: {
            ...field.admin,
            components: {
              ...field.admin?.components,
              Field: {
                ...Comp,
                clientProps: {
                  ...(Comp.clientProps as Record<string, unknown> | undefined),
                  titleOverrides: SEO_LENGTHS.title,
                  descriptionOverrides: SEO_LENGTHS.description,
                },
              },
            },
          },
        } as Field;
      }
    }
    return field;
  });

const generateImage: GenerateImage<NewsLike> = ({ doc }) => {
  const cover = doc?.cover;
  if (!cover) return '';
  return typeof cover === 'object' ? cover.id : cover;
};

const generateURL: GenerateURL<NewsLike> = ({ doc, locale }) =>
  `${siteUrl()}/${locale === 'en' ? 'en' : 'vi'}/news/${doc?.slug ?? ''}`;

export const seo = seoPlugin({
  collections: ['news'],
  uploadsCollection: 'media',
  tabbedUI: true,
  fields: ({ defaultFields }) => withLengths(defaultFields),
  generateTitle,
  generateDescription,
  generateImage,
  generateURL,
});
