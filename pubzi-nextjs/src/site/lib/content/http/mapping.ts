/**
 * FIELD MAPPING of the generic http content source - THE file to edit when the
 * site is connected to another CMS (docs/CONNECT-CMS.md).
 *
 * A `Getter` reads one value from a CMS JSON object:
 * - a dot path: 'attributes.title', 'cover.formats.medium.url', 'data.0'
 *   (numeric segments index arrays),
 * - a function (obj) => value for anything a path can't express,
 * - null = the CMS has no such field (the adapter uses the documented default).
 *
 * Templates in `endpoints` get {slug} / {locale} replaced (URL-encoded) and are
 * resolved against CMS_BASE_URL. Query parameters are appended from `query`.
 *
 * The default below targets a plain REST API shaped like
 *   GET /news?locale=vi&page=1&limit=9&category=game&search=x&sort=-publishedAt
 *     -> { "data": [ {...article} ], "meta": { "total": 12 } }
 *   GET /news?slug=my-post&locale=vi  -> same shape, first item used
 *   GET /news-categories?locale=vi     -> { "data": [ {id, slug, name, order} ] }
 * (see src/site/lib/content/__checks__/fixtures for a complete example).
 * Examples for Strapi v5 / Directus / WordPress are in docs/CONNECT-CMS.md.
 */
export type Getter = string | ((obj: unknown) => unknown) | null;

export interface ImageMapping {
  /** Where the image object sits inside the parent (null = the parent IS the image). */
  path: Getter;
  url: Getter;
  width: Getter;
  height: Getter;
  alt: Getter;
  caption: Getter;
  /** Focal point in percent 0-100 (null = centre). */
  focalX: Getter;
  focalY: Getter;
  /** Site size roles -> { url, width, height } getters (relative to the image object). */
  sizes: Partial<Record<'thumb' | 'card' | 'news' | 'og', { url: Getter; width: Getter; height: Getter }>>;
}

export interface HttpMapping {
  endpoints: {
    list: string;
    bySlug: string;
    categories: string;
  };
  /** Query parameter NAMES (null = not supported by the CMS). */
  query: {
    locale: string | null;
    page: string;
    perPage: string;
    cat: string | null;
    q: string | null;
    /** [param, value] for newest first. */
    sortNewest: [string, string] | null;
    /** [param, value] for oldest first (adjacent "next"). */
    sortOldest: [string, string] | null;
    /** Filters for prev/next navigation; null = prev/next disabled. */
    publishedBefore: string | null;
    publishedAfter: string | null;
    /** [param, value] added to bySlug when reading a draft (preview). */
    draft: [string, string] | null;
    /** [param, value] filter for featured posts; null = pick the newest featured among the latest 20. */
    featured: [string, string] | null;
    /** [param, value] added to every published read (e.g. ['status', 'published']); null = the API only returns published. */
    published: [string, string] | null;
  };
  /** Paths inside the list / categories responses. */
  list: { items: Getter; total: Getter };
  /** Path to the article inside the bySlug response. */
  detail: { item: Getter };
  categories: { items: Getter };
  item: {
    id: Getter;
    slug: Getter;
    title: Getter;
    excerpt: Getter;
    publishedAt: Getter;
    updatedAt: Getter;
    featured: Getter;
    /** Body. Its format comes from `contentFormat`. */
    content: Getter;
    /** 'html' | 'lexical', or a getter returning one of them per item. */
    contentFormat: 'html' | 'lexical' | Getter;
    readingTime: Getter;
    category: { path: Getter; id: Getter; slug: Getter; name: Getter; order: Getter };
    cover: ImageMapping;
    author: { path: Getter; id: Getter; name: Getter; bio: Getter; avatar: ImageMapping | null };
    seo: { title: Getter; description: Getter; image: ImageMapping | null };
    /** string[] or [{ name|tag|value }] */
    tags: Getter;
    /** Array of related article objects (mapped with `item`), or null. */
    related: Getter;
    /** Locales the article is really translated to (string[]); null = [requested locale]. */
    locales: Getter;
  };
  category: { id: Getter; slug: Getter; name: Getter; order: Getter };
}

const image = (path: Getter): ImageMapping => ({
  path,
  url: 'url',
  width: 'width',
  height: 'height',
  alt: 'alt',
  caption: 'caption',
  focalX: 'focalX',
  focalY: 'focalY',
  sizes: {
    thumb: { url: 'formats.thumbnail.url', width: 'formats.thumbnail.width', height: 'formats.thumbnail.height' },
    card: { url: 'formats.medium.url', width: 'formats.medium.width', height: 'formats.medium.height' },
    news: { url: 'formats.large.url', width: 'formats.large.width', height: 'formats.large.height' },
  },
});

export const mapping: HttpMapping = {
  endpoints: {
    list: '/news',
    bySlug: '/news?slug={slug}',
    categories: '/news-categories',
  },
  query: {
    locale: 'locale',
    page: 'page',
    perPage: 'limit',
    cat: 'category',
    q: 'search',
    sortNewest: ['sort', '-publishedAt'],
    sortOldest: ['sort', 'publishedAt'],
    publishedBefore: 'publishedBefore',
    publishedAfter: 'publishedAfter',
    draft: ['draft', '1'],
    featured: ['featured', 'true'],
    published: null,
  },
  list: { items: 'data', total: 'meta.total' },
  detail: { item: 'data.0' },
  categories: { items: 'data' },
  item: {
    id: 'id',
    slug: 'slug',
    title: 'title',
    excerpt: 'excerpt',
    publishedAt: 'publishedAt',
    updatedAt: 'updatedAt',
    featured: 'featured',
    content: 'content',
    contentFormat: 'html',
    readingTime: 'readingTime',
    category: { path: 'category', id: 'id', slug: 'slug', name: 'name', order: 'order' },
    cover: image('cover'),
    author: { path: 'author', id: 'id', name: 'name', bio: 'bio', avatar: image('avatar') },
    seo: { title: 'seo.title', description: 'seo.description', image: image('seo.image') },
    tags: 'tags',
    related: 'related',
    locales: 'availableLocales',
  },
  category: { id: 'id', slug: 'slug', name: 'name', order: 'order' },
};
