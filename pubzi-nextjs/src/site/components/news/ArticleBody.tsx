import Link from 'next/link';
import type { ReactNode } from 'react';

import { RichText, type JSXConverters, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';

import { lexicalToPlainText } from '@/cms/lib/lexical';
import { slugify } from '@/cms/lib/text';
import { parseVideoUrl } from '@/cms/lib/video';
import { format, href, type Locale } from '@site/i18n';
import { toNewsImage } from '@site/lib/news';
import type { RichTextContent } from '@site/lib/types';

import { FadeImage } from './FadeImage';
import { richBlockConverters } from './rich-blocks/converters';
import { newsStrings } from './strings';
import { VideoEmbed } from './VideoEmbed';

/**
 * Article body: Payload Lexical JSON -> JSX inside `.prose-site` (760 column).
 *
 * Custom converters:
 * - heading  : deterministic ids on root-level h2/h3 (same algorithm as
 *              `lexicalHeadings()` -> the table of contents links match) + "#" anchor.
 * - upload   : next/image (responsive srcset, lazy, fade-in on load) + <figcaption>.
 * - link     : internal news links via next/link, external links get
 *              target/rel (noopener + editor-chosen nofollow/sponsored/ugc).
 * - table    : wrapped in `.table-scroll` (horizontal scroll on mobile), th/td,
 *              col/row spans, no inline borders.
 * - blocks   : `videoEmbed` (click-to-load YouTube facade / Vimeo / mp4) and `code`.
 * Defaults cover paragraphs, text formats, lists (incl. checklists), quotes,
 * horizontal rules, alignment and indent.
 */

type AnyNode = { type?: string; tag?: string; children?: AnyNode[]; [k: string]: unknown };

interface LinkFields {
  linkType?: 'custom' | 'internal';
  url?: string | null;
  newTab?: boolean | null;
  rel?: string[] | null;
  doc?: { relationTo?: string; value?: unknown } | null;
}

type VideoFields = { url?: string; aspectRatio?: string | null; title?: string | null; caption?: string | null };
type CodeFields = { language?: string | null; code?: string | null };

function internalHref(locale: Locale, fields: LinkFields): string {
  const value = fields.doc?.value;
  if (value && typeof value === 'object' && 'slug' in value && typeof (value as { slug?: unknown }).slug === 'string') {
    return href(locale, `/news/${(value as { slug: string }).slug}`);
  }
  return href(locale, '/news');
}

function isInternalPath(url: string) {
  return url.startsWith('/') && !url.startsWith('//');
}

/** Only these link targets are rendered as <a> (no data:, vbscript:, javascript:, ...). */
const SAFE_URL = /^(https?:|mailto:|tel:|\/(?!\/)|#)/i;

function makeConverters(locale: Locale): JSXConvertersFunction {
  const s = newsStrings(locale);
  const rich = richBlockConverters(locale);
  // Fresh per render: ids are de-duplicated in document order (matches lexicalHeadings()).
  const seen = new Map<string, number>();

  const renderLink = (fields: LinkFields, children: ReactNode) => {
    const url = fields.linkType === 'internal' ? internalHref(locale, fields) : (fields.url ?? '').trim();
    if (!url || !SAFE_URL.test(url)) return <>{children}</>;
    const editorRel = (fields.rel ?? []).filter((r) => ['nofollow', 'sponsored', 'ugc'].includes(r));
    if (isInternalPath(url) && !fields.newTab) {
      return (
        <Link href={url} rel={editorRel.length ? editorRel.join(' ') : undefined}>
          {children}
        </Link>
      );
    }
    const external = /^https?:\/\//i.test(url);
    const rel = [...new Set([...(fields.newTab || external ? ['noopener', 'noreferrer'] : []), ...editorRel])];
    return (
      <a href={url} target={fields.newTab ? '_blank' : undefined} rel={rel.length ? rel.join(' ') : undefined}>
        {children}
      </a>
    );
  };

  return ({ defaultConverters }) => {
    const converters: JSXConverters = {
      ...defaultConverters,

      heading: ({ node, nodesToJSX, parent }) => {
        const n = node as unknown as AnyNode & { tag: string };
        const children = nodesToJSX({ nodes: node.children });
        const Tag = (['h2', 'h3', 'h4', 'h5', 'h6'].includes(n.tag) ? n.tag : 'h2') as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        // h1 is reserved for the article title: demote editor h1 to h2.
        const isRoot = (parent as { type?: string } | undefined)?.type === 'root';
        if (!isRoot || (n.tag !== 'h2' && n.tag !== 'h3')) return <Tag>{children}</Tag>;
        const text = lexicalToPlainText({ root: n }).replace(/\n/g, ' ').trim();
        if (!text) return <Tag>{children}</Tag>;
        const base = slugify(text) || 'section';
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        const id = count ? `${base}-${count + 1}` : base;
        return (
          <Tag id={id}>
            {children}
            <a href={`#${id}`} className="heading-anchor" aria-hidden="true" tabIndex={-1}>
              #
            </a>
          </Tag>
        );
      },

      link: ({ node, nodesToJSX }) =>
        renderLink(((node as { fields?: LinkFields }).fields ?? {}) as LinkFields, nodesToJSX({ nodes: node.children })),
      autolink: ({ node, nodesToJSX }) =>
        renderLink({ ...((node as { fields?: LinkFields }).fields ?? {}), linkType: 'custom' }, nodesToJSX({ nodes: node.children })),

      upload: ({ node }) => {
        const n = node as unknown as { value?: unknown; fields?: { caption?: string | null } | null };
        const img = toNewsImage(n.value, n.fields?.caption || null);
        if (!img) return null;
        const mime = (n.value as { mimeType?: string | null } | undefined)?.mimeType ?? 'image/';
        if (!mime.startsWith('image/')) {
          const doc = n.value as { url?: string; filename?: string };
          return doc.url ? (
            <p>
              <a href={doc.url} rel="noopener">
                {doc.filename ?? doc.url}
              </a>
            </p>
          ) : null;
        }
        const isSvg = mime === 'image/svg+xml';
        return (
          <figure>
            {/* Sized by width/height (no CLS); fades in as it arrives. */}
            <FadeImage
              src={img.src}
              width={img.width}
              height={img.height}
              alt={img.alt}
              sizes="(min-width: 800px) 760px, calc(100vw - 32px)"
              unoptimized={isSvg}
              loading="lazy"
            />
            {img.caption ? <figcaption>{img.caption}</figcaption> : null}
          </figure>
        );
      },

      table: ({ node, nodesToJSX }) => {
        const rows = (node.children ?? []) as AnyNode[];
        // Lexical marks header cells with headerState (1 = row, 2 = column, 3 = both).
        const firstRowIsHeader =
          rows.length > 1 && (rows[0]?.children ?? []).every((c) => Number((c as { headerState?: number }).headerState) & 1);
        return (
          <div className="table-scroll" tabIndex={0} role="region" aria-label={s.table}>
            <table>
              {firstRowIsHeader ? <thead>{nodesToJSX({ nodes: [rows[0]] as never })}</thead> : null}
              <tbody>{nodesToJSX({ nodes: (firstRowIsHeader ? rows.slice(1) : rows) as never })}</tbody>
            </table>
          </div>
        );
      },
      tablerow: ({ node, nodesToJSX }) => <tr>{nodesToJSX({ nodes: node.children })}</tr>,
      tablecell: ({ node, nodesToJSX }) => {
        const c = node as unknown as { headerState?: number; colSpan?: number; rowSpan?: number; backgroundColor?: string | null };
        const Cell = c.headerState && c.headerState > 0 ? 'th' : 'td';
        return (
          <Cell
            colSpan={c.colSpan && c.colSpan > 1 ? c.colSpan : undefined}
            rowSpan={c.rowSpan && c.rowSpan > 1 ? c.rowSpan : undefined}
            scope={Cell === 'th' ? (c.headerState === 2 ? 'row' : 'col') : undefined}
            style={c.backgroundColor ? { backgroundColor: c.backgroundColor } : undefined}
          >
            {nodesToJSX({ nodes: node.children })}
          </Cell>
        );
      },

      // Newsroom blocks + inline image size/alignment (src/site/components/news/rich-blocks).
      ...rich.nodes,

      blocks: {
        ...(defaultConverters as { blocks?: Record<string, unknown> }).blocks,
        videoEmbed: ({ node }) => {
          const { url, aspectRatio, title, caption } = node.fields as VideoFields;
          const video = parseVideoUrl(url);
          if (!video) return null;
          const label = title?.trim() || caption?.trim() || s.videoFallbackTitle;
          return (
            <figure>
              <VideoEmbed video={video} aspectRatio={aspectRatio} title={label} playLabel={format(s.playVideo, { title: label })} />
              {caption ? <figcaption>{caption}</figcaption> : null}
            </figure>
          );
        },
        code: ({ node }) => {
          const fields = node.fields as CodeFields;
          const lang = (fields.language || 'plaintext').replace(/[^a-z0-9+#-]/gi, '');
          const code = fields.code ?? '';
          if (!code.trim()) return null;
          return (
            <div className="relative" role="region" aria-label={`${s.code}${lang !== 'plaintext' ? ` (${lang})` : ''}`}>
              {lang !== 'plaintext' ? (
                <span className="pointer-events-none absolute top-2 right-3 text-[11px] font-medium tracking-[0.08em] text-white/45 uppercase select-none">
                  {lang}
                </span>
              ) : null}
              <pre tabIndex={0}>
                <code className={`language-${lang}`}>{code}</code>
              </pre>
            </div>
          );
        },
        ...rich.blocks,
      },
    };
    return converters;
  };
}

export function ArticleBody({ content, locale }: { content: RichTextContent | null; locale: Locale }) {
  if (!content) return null;
  return <RichText data={content} converters={makeConverters(locale)} className="prose-site" />;
}
