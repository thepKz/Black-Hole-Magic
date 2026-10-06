/**
 * UI-facing types of the new publisher site. Plain JSON-serialisable shapes,
 * safe to pass to Client Components. Components depend on these types only -
 * never on Payload's generated types (src/cms/payload-types.ts).
 *
 * Mock data (src/site/data/*) and the news data layer (src/site/lib/news.ts)
 * both produce these shapes.
 *
 * The News section below is the CMS BOUNDARY: every content source
 * (src/site/lib/content/{payload,http,mock}) maps its own documents to these
 * DTOs, and nothing in here may depend on a CMS package. See docs/CONNECT-CMS.md.
 */

export type Locale = 'vi' | 'en';

/** A string in both site languages. Resolve with `pick(value, locale)` from '@site/i18n'. */
export type Localized<T = string> = Record<Locale, T>;

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

/** Static image (public/site/**) or CMS image. Use with next/image. */
export interface SiteImage {
  /** Root-relative URL, e.g. /site/games/kiem-the.webp or /api/media/file/x.webp */
  src: string;
  width: number;
  height: number;
  alt: Localized | string;
  /**
   * Focal point in percent (0-100). Apply as
   * `object-position: ${focal.x}% ${focal.y}%` when the image is cropped
   * (banner 8:3 desktop / 16:9 mobile, cards).
   */
  focal?: { x: number; y: number };
}

// ---------------------------------------------------------------------------
// Games
// ---------------------------------------------------------------------------

export type GameStatus = 'none' | 'new' | 'soon' | 'hot';
export type Platform = 'pc' | 'ios' | 'android' | 'h5';

export interface Genre {
  slug: string;
  name: Localized;
}

export interface Game {
  slug: string;
  name: string;
  /** Short code / abbreviation (VLTK2, TLBB...). */
  code: string;
  /** Genre slugs (see `genres` in @site/data/games). */
  genres: string[];
  status: GameStatus;
  /** Display label of release timing, e.g. "2026" or "Q4/2026"; empty = unknown. */
  release: Localized;
  platforms: Platform[];
  /** One-line hook for cards. */
  tagline: Localized;
  description: Localized;
  /** 4:3 card image (1200x900). */
  cover: SiteImage;
  /** 16:9 key art (1400x788). */
  keyArt: SiteImage;
  /** Portrait poster (600w). */
  poster: SiteImage;
  /** Brand accent of the game (hex), optional decoration. */
  accent: string;
  /** Card buttons "Trang chủ game" / "Fanpage" (absolute URLs, new tab). null = "Sắp cập nhật". */
  links: {
    homepage: string | null;
    fanpage: string | null;
  };
  featured: boolean;
  order: number;
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------

export interface Banner {
  id: string;
  /** Desktop source, cropped to 8:3 with object-fit: cover + focal. */
  image: SiteImage;
  /** Optional dedicated mobile (16:9) source. */
  mobileImage?: SiteImage;
  /** Internal path WITHOUT locale ('/games') or absolute URL; null = not clickable. */
  href: string | null;
  /** Optional overlay copy - render the overlay only when `title` is set. */
  title?: Localized;
  subtitle?: Localized;
  ctaLabel?: Localized;
  /** Game this banner promotes (slug), for analytics. */
  gameSlug?: string;
}

export type ServiceIcon = 'scales' | 'credit-card' | 'translate' | 'users-three';

export interface Service {
  id: string;
  /** Phosphor icon name hint (component maps it to @phosphor-icons/react). */
  icon: ServiceIcon;
  title: Localized;
  description: Localized;
}

export interface Partner {
  id: string;
  name: string;
  logo: SiteImage;
  url: string | null;
}

// ---------------------------------------------------------------------------
// Company / site
// ---------------------------------------------------------------------------

export type SocialPlatform = 'facebook' | 'youtube' | 'tiktok' | 'discord' | 'zalo';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  url: string;
}

export type ContactType = 'biz' | 'support' | 'press' | 'other';

export interface SiteInfo {
  name: string;
  /** Default site title (home). */
  title: Localized;
  description: Localized;
  url: string;
  logo: { mark: SiteImage; markWhite: SiteImage; square: SiteImage };
  ogImage: SiteImage;
  company: {
    legalName: Localized;
    shortName: string;
    address: Localized;
    /** Address parts for JSON-LD PostalAddress. */
    postal: { street: string; locality: string; region: string; country: 'VN' };
    /** Short HQ city label (contact page HQ block heading). */
    hqCity: Localized;
    /** Google Maps query for the contact page map. */
    mapQuery: string;
    taxId: string;
    /** Display form, e.g. "1900 0000". */
    phone: string;
    /** Dialable form for `tel:` links / JSON-LD (digits, "+84..." for mobiles; 1900 numbers have no country code). */
    phoneE164: string;
  };
  emails: Record<ContactType, string>;
  /** Footer legal lines (license, business registration, responsible person...). */
  legalLines: Localized<string[]>;
  /**
   * "Người chịu trách nhiệm nội dung" (required on Vietnamese game sites):
   * full name, rendered in the footer as "{label}: {name}". Empty = hidden.
   */
  contentOwner: string;
  healthWarning: Localized;
  /** Official fanpage: `label` is the short display form (no protocol). */
  fanpage: { url: string; label: string };
  socials: SocialLink[];
  /** Top-up portal (external, opens in a new tab). */
  topupUrl: string;
  foundingYear: number;
}

export interface LegalSection {
  id: string;
  heading: string;
  /** Paragraphs; a paragraph starting with "- " lines renders as a list. */
  body: string[];
}

export interface LegalPage {
  slug: 'terms' | 'privacy';
  title: Localized;
  description: Localized;
  /** ISO date. */
  updatedAt: string;
  sections: Localized<LegalSection[]>;
}

// ---------------------------------------------------------------------------
// News (content source -> @site/lib/news). CMS-neutral contract.
// ---------------------------------------------------------------------------
//
// What every adapter must provide (docs/CONNECT-CMS.md):
// - Dates: ISO 8601 strings. `publishedAt` falls back to updatedAt.
// - `locales`: languages that are REALLY translated. Unknown -> [requested locale].
//   Drives hreflang + noindex of untranslated pages.
// - `readingTime`: minutes >= 1; compute with estimateReadingTime(outline.wordCount)
//   when the CMS has none.
// - Category `order`: default 0 (then sorted by name).
// - Search (`q`) is accent-insensitive (foldText) - pass it to the CMS search or
//   fold-filter client side.
// - Image `sizes` keys are SITE ROLES, not CMS size names (see NewsImage).

export interface NewsCategory {
  id: number | string;
  /** 'game' | 'event' | 'notice' (seeded) - but any slug is allowed. */
  slug: string;
  name: string;
  /** Sort order of the category tabs (0 when the CMS has no such field). */
  order: number;
}

/**
 * Size ROLES (fill from whatever transforms the CMS offers, or leave empty -
 * every consumer falls back to `src`):
 * - thumb : ~160-400w (related lists, video posters)
 * - card  : ~800w, 4:3 or 16:9 (news cards)
 * - news  : ~1600w content width (article cover, featured card)
 * - og    : 1200x630 (social cards)
 */
export type NewsImageRole = 'thumb' | 'card' | 'news' | 'og';

export interface NewsImage {
  /** Root-relative (/api/media/file/x.webp) or absolute https URL (CDN, see CONTENT_MEDIA_ORIGINS). */
  src: string;
  width: number;
  height: number;
  alt: string;
  focal: { x: number; y: number };
  caption?: string | null;
  /** Pre-cropped variants (may be missing). */
  sizes: Partial<Record<NewsImageRole, { src: string; width: number; height: number }>>;
  /**
   * true = host not allowed for next/image optimisation (not in
   * CONTENT_MEDIA_ORIGINS): render with `unoptimized` instead of failing.
   */
  unoptimized?: boolean;
}

export interface NewsAuthor {
  id: number | string;
  name: string;
  avatar: NewsImage | null;
  bio?: string | null;
}

export interface NewsListItem {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string;
  category: NewsCategory | null;
  /** ISO datetime. */
  publishedAt: string;
  /** ISO datetime. */
  updatedAt: string;
  cover: NewsImage | null;
  featured: boolean;
  readingTime: number;
}

export interface NewsSeo {
  title: string | null;
  description: string | null;
  image: NewsImage | null;
}

/**
 * Lexical editor JSON (Payload rich text), kept OPAQUE/structural here so the
 * DTO boundary imports no CMS package. Only the Lexical renderer
 * (src/site/components/news/body/LexicalBody.tsx) looks inside.
 */
export interface LexicalDoc {
  root: { type: string; children: unknown[]; [k: string]: unknown };
  [k: string]: unknown;
}

/**
 * Portable article body:
 * - `lexical`: Payload / any Lexical-based CMS (rendered with Payload's converters).
 * - `html`   : any other CMS. MUST already be sanitized by the adapter with
 *              sanitizeArticleHtml() (src/site/lib/content/html.ts) - the
 *              renderer injects it as-is.
 */
export type ArticleContent = { format: 'lexical'; doc: LexicalDoc } | { format: 'html'; html: string };

/** @deprecated use ArticleContent. */
export type RichTextContent = ArticleContent;

export interface ArticleHeading {
  /** Anchor id; the body renderer emits the SAME ids (slugify + de-dup in document order). */
  id: string;
  text: string;
  level: 2 | 3;
}

/** Derived from the body by the adapter (TOC, JSON-LD wordCount, reading time). */
export interface ArticleOutline {
  /** Root-level h2/h3 only. */
  headings: ArticleHeading[];
  plainText: string;
  wordCount: number;
}

export interface NewsDetail extends NewsListItem {
  content: ArticleContent | null;
  outline: ArticleOutline;
  author: NewsAuthor | null;
  seo: NewsSeo;
  /** Locales that have a translated title (for hreflang). */
  locales: Locale[];
  /** Manually picked related posts (already resolved, published only). */
  related: NewsListItem[];
  /** Localized keywords (CMS `tags`): OG article:tag + JSON-LD keywords. */
  tags: string[];
}

/** Previous (older) / next (newer) published article around an article. */
export interface AdjacentPost {
  slug: string;
  title: string;
}

export interface AdjacentPosts {
  prev: AdjacentPost | null;
  next: AdjacentPost | null;
}

export interface Paginated<T> {
  items: T[];
  /** 1-based current page (clamped to [1, totalPages]). */
  page: number;
  perPage: number;
  totalItems: number;
  /** >= 1 even when empty. */
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface NewsListQuery {
  /** Category slug; undefined / 'all' = no filter. */
  cat?: string | null;
  /** Title search, accent-insensitive. */
  q?: string | null;
  /** 1-based. */
  page?: number;
  /** Default 9. */
  perPage?: number;
}

export interface NewsSlugEntry {
  slug: string;
  /** ISO datetime of last modification (sitemap lastmod). */
  updatedAt: string;
  publishedAt: string;
  /** Locales with a translated title. */
  locales: Locale[];
}
