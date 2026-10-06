'use client';

import { useDocumentInfo, useField, useFormFields, useTranslation } from '@payloadcms/ui';
import { useState } from 'react';

import { lexicalToPlainText } from '../../lib/lexical';

/**
 * Under the "Sapo" textarea (`admin.components.afterInput`): live character
 * counter against the publish rule (50–300, ideally 120–200) and a
 * "Gợi ý từ đoạn đầu" button that drafts a sapo from the opening paragraphs.
 *
 * The article page prints the sapo right above the body, so a sapo that IS the
 * first paragraph reads twice. The suggestion is therefore only a starting
 * point: it is selected in the textarea with a "viết lại" hint, the counter
 * turns into a warning while it still equals the first paragraph, and the
 * publish checklist refuses an identical sapo (src/cms/hooks/newsWorkflow.ts).
 * Hidden when the article is read-only for the signed-in user.
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

const norm = (text: string) =>
  text
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, ' ')
    .trim();

/** First non-empty top-level paragraph (same rule as the publish checklist). */
function firstParagraph(content: unknown): string {
  const nodes = (content as { root?: LexicalNode } | null | undefined)?.root?.children ?? [];
  for (const node of nodes) {
    if (node.type !== 'paragraph') continue;
    const text = lexicalToPlainText({ root: node } as never).replace(/\s+/g, ' ').trim();
    if (text) return text;
  }
  return '';
}

export function ExcerptTools() {
  const { i18n } = useTranslation();
  const en = i18n.language === 'en';
  const { value, setValue, disabled } = useField<string>({ path: 'excerpt' });
  const { hasSavePermission } = useDocumentInfo();
  const content = useFormFields(([fields]) => fields?.content?.value);
  const [suggested, setSuggested] = useState(false);

  const readOnly = disabled || hasSavePermission === false;
  const clean = (value ?? '').replace(/\s+/g, ' ').trim();
  const length = clean.length;
  const first = firstParagraph(content);
  const duplicate = Boolean(clean && first && norm(clean) === norm(first));
  const tone = duplicate
    ? 'warn'
    : length === 0
      ? 'muted'
      : length < MIN || length > MAX
        ? 'error'
        : length < IDEAL_MIN || length > IDEAL_MAX
          ? 'warn'
          : 'ok';
  const hint = en
    ? `${length}/${MAX} characters · publish needs ${MIN}–${MAX}, ideal ${IDEAL_MIN}–${IDEAL_MAX}`
    : `${length}/${MAX} ký tự · cần ${MIN}–${MAX} để xuất bản, đẹp nhất ${IDEAL_MIN}–${IDEAL_MAX}`;

  const onSuggest = () => {
    const next = suggestExcerpt(content);
    if (!next) return;
    if (value?.trim() && !window.confirm(en ? 'Replace the current excerpt?' : 'Thay sapo hiện tại bằng gợi ý từ đoạn đầu bài?')) return;
    setValue(next.slice(0, MAX));
    setSuggested(true);
    // Select the draft so the editor rewrites it rather than keeping it verbatim.
    requestAnimationFrame(() => {
      const el = document.getElementById('field-excerpt') as HTMLTextAreaElement | null;
      el?.focus();
      el?.select();
    });
  };

  if (readOnly) {
    return (
      <div className="bh-field-tools">
        <span className={`bh-field-tools__count bh-field-tools__count--${tone}`}>{hint}</span>
      </div>
    );
  }

  return (
    <div className="bh-field-tools">
      <span className={`bh-field-tools__count bh-field-tools__count--${tone}`} aria-live="polite">
        {duplicate
          ? en
            ? 'The excerpt repeats the first paragraph word for word - rewrite it (it is shown right above the body).'
            : 'Sapo đang trùng nguyên văn đoạn mở đầu, hãy viết lại (sapo hiện ngay trên thân bài nên sẽ bị lặp).'
          : suggested && length > 0
            ? en
              ? `${hint} · draft from the first paragraph: rewrite it in your own words`
              : `${hint} · bản nháp từ đoạn đầu: hãy viết lại cho gọn ý`
            : hint}
      </span>
      <button type="button" className="bh-field-tools__btn" onClick={onSuggest} disabled={!content}>
        {en ? 'Suggest from first paragraph' : 'Gợi ý từ đoạn đầu'}
      </button>
    </div>
  );
}

export default ExcerptTools;
