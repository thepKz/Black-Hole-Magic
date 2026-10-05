/**
 * UI-facing types of the new publisher site. Plain JSON-serialisable shapes,
 * safe to pass to Client Components. Components depend on these types only -
 * never on Payload's generated types (src/cms/payload-types.ts).
 *
 * Mock data (src/site/data/*) and the news data layer (src/site/lib/news.ts)
 * both produce these shapes.
 */
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

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
// News (Payload CMS -> @site/lib/news)
// ---------------------------------------------------------------------------

export interface NewsCategory {
  id: number | string;
  /** 'game' | 'event' | 'notice' (seeded) - but any slug is allowed. */
  slug: string;
  name: string;
  order: number;
}

export interface NewsImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  focal: { x: number; y: number };
  caption?: string | null;
  /** Pre-cropped variants generated by Payload (may be missing). */
  sizes: Partial<Record<'thumb' | 'card' | 'news' | 'og', { src: string; width: number; height: number }>>;
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

export type RichTextContent = SerializedEditorState;

export interface NewsDetail extends NewsListItem {
  /** Lexical JSON - render with the RichText converter in src/site. */
  content: RichTextContent | null;
  author: NewsAuthor | null;
  seo: NewsSeo;
  /** Locales that have a translated title (for hreflang). */
  locales: Locale[];
  /** Manually picked related posts (already resolved, published only). */
  related: NewsListItem[];
  /** Localized keywords (CMS `tags`): OG article:tag + JSON-LD keywords. */
  tags: string[];
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
