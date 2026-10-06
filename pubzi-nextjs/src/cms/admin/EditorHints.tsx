'use client';

import { useEffect, type ReactNode } from 'react';

/**
 * Admin-wide provider (`admin.components.providers`). Purely presentational:
 * nothing is saved, nothing re-renders.
 *
 * 1. Toolbar hints. The Lexical toolbar renders icon-only buttons with no
 *    tooltip or accessible name (bold, italic, link, indent...) and dropdowns
 *    labelled "add dropdown", "blocks dropdown". Editors coming from Word /
 *    Google Docs need to see what each icon does and its shortcut, so this fills
 *    in `title` and `aria-label` (Vietnamese) from the buttons' stable
 *    `data-button-key` / class names.
 *
 * 2. Hard-coded English in Payload / Lexical that no translation key reaches
 *    (checked in node_modules for 3.90): block / link / drag handles, the table
 *    drawer title, bulk-upload and paste-URL toasts, the live-preview
 *    "Responsive" size, datepicker month buttons, version-diff block names, and
 *    the "Chỉnh sửa: [object Object]" label of inline images. Exact-match
 *    replacement of attributes and short text nodes, NEVER inside the editor's
 *    content (contenteditable), inputs or textareas. English admin is untouched.
 */
const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

const BUTTONS: Record<string, [label: string, shortcut?: string]> = {
  bold: ['Chữ đậm', 'B'],
  italic: ['Chữ nghiêng', 'I'],
  underline: ['Gạch chân', 'U'],
  strikethrough: ['Gạch ngang'],
  subscript: ['Chỉ số dưới (H₂O)'],
  superscript: ['Chỉ số trên (m²)'],
  inlineCode: ['Mã trong dòng'],
  link: ['Chèn / sửa liên kết', 'K'],
  indentDecrease: ['Giảm thụt lề'],
  indentIncrease: ['Tăng thụt lề'],
};

const DROPDOWNS: Record<string, string> = {
  add: 'Chèn: ảnh, bảng, đường kẻ ngang',
  blocks: 'Chèn khối: video, bộ ảnh, nhúng mạng xã hội, trích dẫn, hộp ghi chú…',
  text: 'Kiểu đoạn: đoạn văn, tiêu đề, danh sách, trích dẫn',
  align: 'Căn lề đoạn văn',
  format: 'Định dạng chữ',
};

function label(el: HTMLElement): string | null {
  const key = el.dataset.buttonKey;
  if (key && BUTTONS[key]) {
    const [text, shortcut] = BUTTONS[key];
    return shortcut ? `${text} (${isMac() ? '⌘' : 'Ctrl+'}${shortcut})` : text;
  }
  const group = /toolbar-popup__dropdown-([a-z]+)/i.exec(el.className)?.[1];
  return group && DROPDOWNS[group] ? DROPDOWNS[group] : null;
}

function annotate(root: ParentNode) {
  root
    .querySelectorAll<HTMLElement>(
      '.toolbar-popup__button[data-button-key]:not([data-bh-hint]), button.toolbar-popup__dropdown:not([data-bh-hint])',
    )
    .forEach((el) => {
      el.dataset.bhHint = '1';
      const text = label(el);
      if (!text) return;
      el.title = text;
      el.setAttribute('aria-label', text);
    });
}

/* ------------------------------------------------------------------ */
/* Hard-coded English -> Vietnamese                                    */
/* ------------------------------------------------------------------ */

const PASTE_REFUSED =
  'Không lấy được ảnh từ link này. "Dán URL" chỉ nhận link ảnh từ YouTube, Steam, App Store, Google Play, Wikimedia, Unsplash, X/Twitter và CDN của công ty. Ảnh từ nguồn khác (Facebook, TikTok…): lưu ảnh về máy rồi kéo thả vào đây.';

const BLOCK_NAMES: Record<string, string> = {
  gallery: 'Bộ ảnh',
  videoEmbed: 'Video',
  socialEmbed: 'Nhúng mạng xã hội',
  quote: 'Trích dẫn',
  callout: 'Hộp ghi chú',
  relatedNews: 'Đọc thêm',
  cta: 'Nút liên kết',
  code: 'Đoạn mã',
};

/** Exact strings (trimmed) used as aria-label / title / tooltip / text. */
const EXACT: Record<string, string> = {
  'Remove Block': 'Xoá khối',
  'Drag to move': 'Kéo để di chuyển',
  'Add block': 'Thêm khối bên dưới',
  'Edit link': 'Sửa liên kết',
  'Remove link': 'Gỡ liên kết',
  'Insert Paragraph': 'Thêm đoạn văn ở cuối',
  'Create Table': 'Chèn bảng',
  Responsive: 'Vừa khung',
  'Next Month': 'Tháng sau',
  'Previous Month': 'Tháng trước',
  'Next Year': 'Năm sau',
  'Previous Year': 'Năm trước',
  'Notifications alt+T': 'Thông báo (Alt+T)',
  'Editor content': 'Nội dung bài viết',
  'Click to collapse the range.': 'Bấm để thu gọn đoạn này.',
  'The provided URL is not allowed.': PASTE_REFUSED,
  'Failed to fetch the file.': 'Không tải được tệp từ link này. Hãy lưu ảnh về máy rồi kéo thả vào đây.',
};

const PATTERNS: [RegExp, (m: RegExpExecArray) => string][] = [
  [/^Successfully saved (\d+) files?$/, (m) => `Đã lưu ${m[1]} tệp.`],
  [/^Failed to save (\d+) files?$/, (m) => `Không lưu được ${m[1]} tệp. Xem lỗi ghi ở từng tệp.`],
  [/^(\w+) Block$/, (m) => (BLOCK_NAMES[m[1]] ? `Khối ${BLOCK_NAMES[m[1]]}` : m[0])],
];

function translate(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 80) return null;
  if (EXACT[trimmed]) return EXACT[trimmed];
  for (const [re, fn] of PATTERNS) {
    const m = re.exec(trimmed);
    if (m) {
      const out = fn(m);
      return out !== trimmed ? out : null;
    }
  }
  return null;
}

/**
 * User content is never touched: text inside an editable region (the nearest
 * `contenteditable` ancestor is not "false" - Lexical block UIs sit in
 * contenteditable="false" islands and ARE translated), inputs and textareas.
 */
function isProtected(node: Node): boolean {
  const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  if (!el) return true;
  if (el.closest('textarea, input, select')) return true;
  const editable = el.closest('[contenteditable]');
  return Boolean(editable && editable.getAttribute('contenteditable') !== 'false');
}

/** Attributes of the editable root itself (its aria-label) are UI, not content. */
const attrsProtected = (el: Element) => !el.matches('[contenteditable="true"]') && isProtected(el);

function fixAttributes(el: Element) {
  for (const attr of ['aria-label', 'title'] as const) {
    const v = el.getAttribute(attr);
    if (!v) continue;
    if (v.includes('[object Object]')) {
      el.setAttribute(attr, v.replace('[object Object]', 'ảnh'));
      continue;
    }
    const t = translate(v);
    if (t) el.setAttribute(attr, t);
  }
}

function fixTextNode(node: Text) {
  if (isProtected(node)) return;
  const t = translate(node.nodeValue ?? '');
  if (t) node.nodeValue = t;
}

/** "All" (all locales) in the schedule drawer's language select. */
function fixScheduleLocale(root: ParentNode) {
  root.querySelectorAll('.schedule-publish .rs__single-value, .schedule-publish .rs__option').forEach((el) => {
    if (el.childNodes.length === 1 && el.textContent === 'All') el.textContent = 'Tất cả ngôn ngữ';
  });
}

function fixTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    fixTextNode(root as Text);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  if (!attrsProtected(el)) fixAttributes(el);
  el.querySelectorAll('[aria-label], [title]').forEach((child) => {
    if (!attrsProtected(child)) fixAttributes(child);
  });
  if (isProtected(el)) return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => ((n.nodeValue?.trim().length ?? 0) > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) fixTextNode(n as Text);
}

export function EditorHints({ children }: { children?: ReactNode }) {
  useEffect(() => {
    const vi = () => (document.documentElement.lang || 'vi').toLowerCase().startsWith('vi');
    let frame = 0;
    const pending = new Set<Node>();
    const pendingAttrs = new Set<Element>();
    const flush = () => {
      frame = 0;
      annotate(document);
      if (!vi()) {
        pending.clear();
        pendingAttrs.clear();
        return;
      }
      for (const node of pending) if (node.isConnected) fixTree(node);
      for (const el of pendingAttrs) if (el.isConnected && !attrsProtected(el)) fixAttributes(el);
      pending.clear();
      pendingAttrs.clear();
      fixScheduleLocale(document);
    };
    annotate(document);
    if (vi()) fixTree(document.body);
    const observer = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'childList') r.addedNodes.forEach((n) => pending.add(n));
        else if (r.type === 'attributes') pendingAttrs.add(r.target as Element);
        else pending.add(r.target);
      }
      if (!frame) frame = requestAnimationFrame(flush);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-label', 'title'],
    });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return <>{children}</>;
}

export default EditorHints;
