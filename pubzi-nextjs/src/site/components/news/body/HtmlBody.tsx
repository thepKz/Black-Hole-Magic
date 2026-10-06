/**
 * HTML article body from an external CMS. `html` MUST come from
 * sanitizeArticleHtml() (src/site/lib/content/html.ts), which the content
 * adapter runs: allow-listed tags/attributes, safe URLs, heading ids,
 * `.table-scroll` wrappers, lazy images. Same `.prose-site` styles as the
 * Lexical renderer.
 */
export function HtmlBody({ html }: { html: string }) {
  if (!html.trim()) return null;
  return <div className="prose-site" dangerouslySetInnerHTML={{ __html: html }} />;
}
