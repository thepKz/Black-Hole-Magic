import sanitizeHtml from 'sanitize-html';

import type { ArticleHeading, ArticleOutline } from '../types';
import { buildOutline, createHeadingIds } from './util';

/**
 * Article HTML from an external CMS -> safe HTML for `.prose-site`.
 *
 * Runs in the ADAPTER (src/site/lib/content/http), never at render time: the
 * HTML body renderer injects `content.html` as-is. Uses sanitize-html
 * (allow-list), then a second pass on its normalised output for heading ids
 * and table wrappers.
 *
 * - Allowed: p, h2-h4, lists, blockquote, figure/figcaption, img, a, tables,
 *   pre/code, inline formatting, hr/br, iframes of YouTube / Vimeo only.
 * - h1 -> h2 (h1 is the article title), h5/h6 -> h4.
 * - Root h2/h3 get ids with the SAME slugify + de-dup algorithm as the Lexical
 *   renderer, so the table of contents (outline.headings) links match.
 * - Links: http(s)/mailto/tel/root-relative/#hash only; external links get
 *   rel="noopener noreferrer"; target=_blank only when the source set it.
 * - Images: loading=lazy + decoding=async; relative src resolved with
 *   `resolveUrl` (CMS_MEDIA_BASE).
 * - <table> wrapped in <div class="table-scroll" role="region" tabindex="0">.
 * - style / class / on* / data-* attributes are dropped.
 */

export interface SanitizeOptions {
  /** Resolve relative asset URLs (img src) against the CMS media base. */
  resolveUrl?: (src: string) => string;
  /** aria-label of the scrollable table wrapper. */
  tableLabel?: string;
}

export interface SanitizedArticle {
  html: string;
  outline: ArticleOutline;
  /** Images + iframes (reading-time estimate). */
  mediaCount: number;
}

const IFRAME_HOSTS = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com', 'player.vimeo.com'];
const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;
const SAFE_SRC = /^(https?:\/\/|\/(?!\/))/i;

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, code: string) => {
    if (code[0] === '#') {
      const n = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[code.toLowerCase()] ?? m;
  });
}

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Plain text of (sanitized) HTML, one line per block. */
export function htmlToPlainText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|h[1-6]|li|blockquote|figcaption|td|th|pre|div)>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

export function sanitizeArticleHtml(dirty: string | null | undefined, options: SanitizeOptions = {}): SanitizedArticle {
  const resolve = options.resolveUrl ?? ((s: string) => s);
  let mediaCount = 0;

  const clean = sanitizeHtml(dirty ?? '', {
    allowedTags: [
      'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'figure', 'figcaption', 'img', 'a',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'pre', 'code',
      'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark', 'small', 'span', 'hr', 'br', 'iframe',
    ],
    allowedAttributes: {
      a: ['href', 'rel', 'target'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
      th: ['colspan', 'rowspan', 'scope'],
      td: ['colspan', 'rowspan'],
      ol: ['start', 'reversed'],
      iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy'],
      code: [],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'], iframe: ['https'] },
    allowProtocolRelative: false,
    allowedIframeHostnames: IFRAME_HOSTS,
    allowIframeRelativeUrls: false,
    nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript', 'template'],
    transformTags: {
      h1: 'h2',
      h5: 'h4',
      h6: 'h4',
      a: (tagName, attribs) => {
        const href = (attribs.href ?? '').trim();
        if (!href || !SAFE_HREF.test(href)) return { tagName: 'span', attribs: {} };
        const external = /^https?:\/\//i.test(href);
        const newTab = attribs.target === '_blank';
        const editorRel = (attribs.rel ?? '').split(/\s+/).filter((r) => ['nofollow', 'sponsored', 'ugc'].includes(r));
        const rel = [...new Set([...(external || newTab ? ['noopener', 'noreferrer'] : []), ...editorRel])];
        const out: Record<string, string> = { href };
        if (newTab) out.target = '_blank';
        if (rel.length) out.rel = rel.join(' ');
        return { tagName: 'a', attribs: out };
      },
      img: (tagName, attribs) => {
        const src = resolve((attribs.src ?? '').trim());
        if (!SAFE_SRC.test(src)) return { tagName: 'img', attribs: {} };
        mediaCount += 1;
        const out: Record<string, string> = { src, alt: attribs.alt ?? '', loading: 'lazy', decoding: 'async' };
        if (/^\d{1,5}$/.test(attribs.width ?? '')) out.width = attribs.width;
        if (/^\d{1,5}$/.test(attribs.height ?? '')) out.height = attribs.height;
        return { tagName: 'img', attribs: out };
      },
      iframe: (tagName, attribs) => {
        // Non-allow-listed hosts are dropped by sanitize-html afterwards: count only real embeds.
        try {
          if (IFRAME_HOSTS.includes(new URL(attribs.src ?? '').hostname)) mediaCount += 1;
        } catch {
          // invalid src -> removed
        }
        return {
          tagName: 'iframe',
          attribs: {
            ...attribs,
            loading: 'lazy',
            referrerpolicy: 'strict-origin-when-cross-origin',
            allow: 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen',
          },
        };
      },
    },
    // Images whose src was rejected above, and empty links/spans, are dropped.
    exclusiveFilter: (frame) => (frame.tag === 'img' && !frame.attribs.src) || (frame.tag === 'iframe' && !frame.attribs.src),
  });

  // Pass 2 on sanitize-html's normalised output (attribute-less h2/h3, no nesting).
  const nextId = createHeadingIds();
  const headings: ArticleHeading[] = [];
  let html = clean.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (whole, tag: string, inner: string) => {
    const text = htmlToPlainText(inner).replace(/\n/g, ' ').trim();
    if (!text) return whole;
    const id = nextId(text);
    headings.push({ id, text, level: tag === 'h2' ? 2 : 3 });
    return `<${tag} id="${escapeAttr(id)}">${inner}<a href="#${escapeAttr(id)}" class="heading-anchor" aria-hidden="true" tabindex="-1">#</a></${tag}>`;
  });

  const label = escapeAttr(options.tableLabel ?? 'Table');
  html = html
    .replace(/<table>/g, `<div class="table-scroll" role="region" tabindex="0" aria-label="${label}"><table>`)
    .replace(/<\/table>/g, '</table></div>');

  return { html, outline: buildOutline(headings, htmlToPlainText(clean)), mediaCount };
}
