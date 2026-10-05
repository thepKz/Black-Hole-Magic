'use client';

import { useEffect, type ReactNode } from 'react';

/**
 * Admin-wide provider (`admin.components.providers`).
 *
 * The Lexical toolbar renders icon-only buttons with no tooltip or accessible
 * name (bold, italic, link, indent...) and dropdowns labelled "add dropdown",
 * "blocks dropdown" in English. Editors coming from Word / Google Docs need
 * to see what each icon does and its shortcut, so this fills in `title` and
 * `aria-label` (Vietnamese) from the buttons' stable `data-button-key` /
 * class names. Purely presentational: nothing is saved, nothing re-renders.
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

export function EditorHints({ children }: { children?: ReactNode }) {
  useEffect(() => {
    let frame = 0;
    annotate(document);
    // Toolbars mount when an editor (or a block's nested editor) renders.
    const observer = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        annotate(document);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return <>{children}</>;
}

export default EditorHints;
