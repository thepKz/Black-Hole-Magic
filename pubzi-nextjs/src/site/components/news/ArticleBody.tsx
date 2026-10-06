import type { Locale } from '@site/i18n';
import type { ArticleContent } from '@site/lib/types';

import { HtmlBody } from './body/HtmlBody';
import { LexicalBody } from './body/LexicalBody';

/**
 * Article body, whatever CMS it came from (ArticleContent in src/site/lib/types):
 * - lexical -> ./body/LexicalBody (Payload converters + newsroom blocks)
 * - html    -> ./body/HtmlBody (already sanitized by the content adapter)
 * Both render inside `.prose-site` with the same heading-id algorithm, so the
 * table of contents (post.outline.headings) links match either way.
 */
export function ArticleBody({ content, locale }: { content: ArticleContent | null; locale: Locale }) {
  if (!content) return null;
  switch (content.format) {
    case 'lexical':
      return <LexicalBody doc={content.doc} locale={locale} />;
    case 'html':
      return <HtmlBody html={content.html} />;
    default:
      return null;
  }
}
