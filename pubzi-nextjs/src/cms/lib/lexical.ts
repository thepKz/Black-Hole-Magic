/**
 * Small helpers over serialized Lexical JSON (no Lexical runtime needed).
 * Used by the news `beforeChange` hook (reading time) and the seed script
 * (building sample content).
 */

type AnyNode = {
  type?: string;
  text?: string;
  children?: AnyNode[];
  fields?: Record<string, unknown>;
  [key: string]: unknown;
};

type EditorStateLike = { root?: AnyNode } | null | undefined;

/** Plain text of a Lexical document (text nodes + text-ish block fields). */
export function lexicalToPlainText(state: EditorStateLike): string {
  const out: string[] = [];
  const walk = (node: AnyNode | undefined) => {
    if (!node) return;
    if (typeof node.text === 'string') out.push(node.text);
    if (node.type === 'block' && node.fields) {
      // Code blocks count as reading material too; captions as well.
      for (const key of ['code', 'caption']) {
        const v = node.fields[key];
        if (typeof v === 'string') out.push(v);
      }
    }
    if (node.type === 'upload' && node.fields && typeof node.fields.caption === 'string') {
      out.push(node.fields.caption);
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) walk(child);
      if (node.type === 'paragraph' || node.type === 'heading' || node.type === 'listitem') out.push('\n');
    }
  };
  walk(state?.root);
  return out.join(' ').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
}

/** Words per minute used for the reading-time estimate (VN syllables ~ EN words). */
export const READING_WPM = 220;

/** Estimated reading time in minutes (>= 1) for a Lexical document. */
export function readingTimeMinutes(state: EditorStateLike): number {
  const text = lexicalToPlainText(state);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  // Each embedded image/video adds ~10s of attention.
  let media = 0;
  const walk = (node: AnyNode | undefined) => {
    if (!node) return;
    if (node.type === 'upload' || (node.type === 'block' && node.fields?.blockType === 'videoEmbed')) media += 1;
    node.children?.forEach(walk);
  };
  walk(state?.root);
  return Math.max(1, Math.round(words / READING_WPM + media / 6));
}

/** Heading outline (h2/h3) for a table of contents. `id` = slugified text. */
export function lexicalHeadings(
  state: EditorStateLike,
  slugify: (s: string) => string,
): { id: string; text: string; level: 2 | 3 }[] {
  const out: { id: string; text: string; level: 2 | 3 }[] = [];
  const seen = new Map<string, number>();
  for (const node of state?.root?.children ?? []) {
    if (node.type !== 'heading') continue;
    const tag = node.tag as string | undefined;
    if (tag !== 'h2' && tag !== 'h3') continue;
    const text = lexicalToPlainText({ root: node }).replace(/\n/g, ' ').trim();
    if (!text) continue;
    const base = slugify(text) || 'section';
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    out.push({ id: n ? `${base}-${n + 1}` : base, text, level: tag === 'h2' ? 2 : 3 });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Builders (seed / programmatic content)
// ---------------------------------------------------------------------------

type TextFormat = 'bold' | 'italic' | 'underline';
const FORMAT_BITS: Record<TextFormat, number> = { bold: 1, italic: 2, underline: 8 };

function textNode(text: string, ...formats: TextFormat[]) {
  return {
    type: 'text',
    version: 1,
    text,
    format: formats.reduce((acc, f) => acc | FORMAT_BITS[f], 0),
    style: '',
    mode: 'normal',
    detail: 0,
  };
}
type TextNode = ReturnType<typeof textNode>;

export const lx = {
  text: textNode,
  paragraph(...children: (string | TextNode)[]) {
    return {
      type: 'paragraph',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      textFormat: 0,
      textStyle: '',
      children: children.map((c) => (typeof c === 'string' ? textNode(c) : c)),
    };
  },
  heading(tag: 'h2' | 'h3', text: string) {
    return { type: 'heading', tag, version: 1, format: '', indent: 0, direction: 'ltr', children: [textNode(text)] };
  },
  quote(text: string) {
    return { type: 'quote', version: 1, format: '', indent: 0, direction: 'ltr', children: [textNode(text)] };
  },
  list(kind: 'bullet' | 'number', items: string[]) {
    return {
      type: 'list',
      listType: kind,
      tag: kind === 'bullet' ? 'ul' : 'ol',
      start: 1,
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      children: items.map((item, i) => ({
        type: 'listitem',
        value: i + 1,
        version: 1,
        format: '',
        indent: 0,
        direction: 'ltr',
        children: [textNode(item)],
      })),
    };
  },
  upload(mediaId: number | string, caption?: string) {
    return {
      type: 'upload',
      version: 3,
      format: '',
      // Lexical node ids are 24-char hex strings (ObjectId-like) in Payload.
      id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      relationTo: 'media',
      value: mediaId,
      fields: caption ? { caption } : {},
    };
  },
  hr() {
    return { type: 'horizontalrule', version: 1 };
  },
  root(...children: Record<string, unknown>[]) {
    return {
      root: { type: 'root', version: 1, format: '', indent: 0, direction: 'ltr', children },
    };
  },
};
