'use client';

import { useEffect } from 'react';
import { getLocaleFromPathname } from '@/i18n/config';
import { runtimeTranslations } from '@/i18n/runtime-translations';

const translatedAttributes = ['aria-label', 'placeholder', 'title', 'alt'];
const ignoredTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CANVAS', 'SVG']);

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function translateValue(value: string, dictionary: Record<string, string>) {
  const normalized = normalizeText(value);
  const exact = dictionary[normalized];
  if (exact) return exact;

  let translated = normalized;
  const fragmentKeys = Object.keys(dictionary)
    .filter((key) => key.length >= 12)
    .sort((a, b) => b.length - a.length);

  for (const key of fragmentKeys) {
    if (translated.includes(key)) {
      translated = translated.split(key).join(dictionary[key]);
    }
  }

  return translated !== normalized ? translated : null;
}

function translateDocument(dictionary: Record<string, string>) {
  const root = document.body;
  if (!root) return;

  const elements = Array.from(root.querySelectorAll<HTMLElement>('*'));

  for (const element of elements) {
    if (ignoredTags.has(element.tagName)) continue;

    for (const attr of translatedAttributes) {
      const current = element.getAttribute(attr);
      if (!current) continue;
      const translated = translateValue(current, dictionary);
      if (translated && translated !== current) element.setAttribute(attr, translated);
    }

    const elementText = normalizeText(element.textContent ?? '');
    const translatedElementText = dictionary[elementText];
    if (
      translatedElementText &&
      translatedElementText !== elementText &&
      element.children.length > 0 &&
      element.tagName !== 'FOOTER' &&
      elementText.length < 220
    ) {
      element.textContent = translatedElementText;
    }
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ignoredTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (!normalizeText(node.nodeValue ?? '')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  for (const node of textNodes) {
    const current = node.nodeValue ?? '';
    const translated = translateValue(current, dictionary);
    if (!translated || translated === normalizeText(current)) continue;
    node.nodeValue = current.replace(normalizeText(current), translated);
  }
}

export default function LegacyI18n() {
  useEffect(() => {
    const apply = () => {
      const locale = getLocaleFromPathname(window.location.pathname);
      document.documentElement.lang = locale;
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
      translateDocument(runtimeTranslations[locale]);
    };

    apply();

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(apply);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: translatedAttributes,
    });

    window.addEventListener('popstate', apply);

    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', apply);
    };
  }, []);

  return null;
}
