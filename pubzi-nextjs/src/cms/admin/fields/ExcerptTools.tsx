'use client';

import { useField, useFormFields, useTranslation } from '@payloadcms/ui';

import { lexicalToPlainText } from '../../lib/lexical';

/**
 * Under the "Sapo" textarea (`admin.components.afterInput`): live character
 * counter against the publish rule (50–300, ideally 120–200) and a
 * "Lấy từ đoạn đầu" button that drafts a sapo from the first paragraphs of
 * the content. Nothing is saved until the editor saves the article.
 */
const MIN = 50;
const MAX = 300;
const IDEAL_MIN = 120;
const IDEAL_MAX = 200;

type LexicalNode = { type?: string; children?: LexicalNode[] };

/**
 * Text of the opening paragraphs only: headings, lists, tables, images and
 * blocks are skipped, and collection stops once there is enough for a sapo.
 */
function openingText(content: unknown): string {
  const nodes = (content as { root?: LexicalNode } | null | undefined)?.root?.children ?? [];
  const parts: string[] = [];
  let length = 0;
  for (const node of nodes) {
    if (node.type !== 'paragraph') continue;
    const text = lexicalToPlainText({ root: node } as never).replace(/\s+/g, ' ').trim();
    if (!text) continue;
    parts.push(text);
    length += text.length + 1;
    if (length >= IDEAL_MIN) break;
  }
  return parts.join(' ');
}

/** First sentences of the article, clipped on a sentence / word boundary. */
function suggestExcerpt(content: unknown): string {
  const text = openingText(content);
  if (text.length <= IDEAL_MAX) return text;
  const sentences = text.match(/[^.!?…]+[.!?…]+["”»)]?\s*/g) ?? [];
  let out = '';
  for (const s of sentences) {
    if ((out + s).trim().length > IDEAL_MAX + 40) break;
    out += s;
    if (out.trim().length >= IDEAL_MIN) break;
  }
  out = out.trim();
  if (out.length >= MIN) return out;
  const cut = text.slice(0, IDEAL_MAX);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > IDEAL_MIN ? cut.slice(0, lastSpace) : cut).replace(/[,;:\s]+$/, '')}…`;
}

export function ExcerptTools() {
  const { i18n } = useTranslation();
  const en = i18n.language === 'en';
  const { value, setValue, disabled } = useField<string>({ path: 'excerpt' });
  const content = useFormFields(([fields]) => fields?.content?.value);

  const length = (value ?? '').replace(/\s+/g, ' ').trim().length;
  const tone =
    length === 0 ? 'muted' : length < MIN || length > MAX ? 'error' : length < IDEAL_MIN || length > IDEAL_MAX ? 'warn' : 'ok';
  const hint = en
    ? `${length}/${MAX} characters · publish needs ${MIN}–${MAX}, ideal ${IDEAL_MIN}–${IDEAL_MAX}`
    : `${length}/${MAX} ký tự · cần ${MIN}–${MAX} để xuất bản, đẹp nhất ${IDEAL_MIN}–${IDEAL_MAX}`;

  const onSuggest = () => {
    const next = suggestExcerpt(content);
    if (!next) return;
    if (value?.trim() && !window.confirm(en ? 'Replace the current excerpt?' : 'Thay sapo hiện tại bằng đoạn đầu bài?')) return;
    setValue(next.slice(0, MAX));
  };

  return (
    <div className="bh-field-tools">
      <span className={`bh-field-tools__count bh-field-tools__count--${tone}`} aria-live="polite">
        {hint}
      </span>
      {!disabled && (
        <button type="button" className="bh-field-tools__btn" onClick={onSuggest} disabled={!content}>
          {en ? 'Use first paragraph' : 'Lấy từ đoạn đầu'}
        </button>
      )}
    </div>
  );
}

export default ExcerptTools;
