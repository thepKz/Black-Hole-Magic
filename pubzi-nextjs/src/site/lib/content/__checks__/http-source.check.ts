/**
 * Fixture check of the generic http content source + the http contact sink.
 *
 *   npx tsx src/site/lib/content/__checks__/http-source.check.ts
 *
 * Starts a tiny local "CMS" (node:http) that serves ./fixtures/cms.json in the
 * shape of the DEFAULT mapping (src/site/lib/content/http/mapping.ts), then
 * runs every NewsSource method against it and asserts the mapped DTOs:
 * pagination + clamping, published-only, dropped malformed items, category /
 * accent-insensitive search, HTML sanitizing + outline ids, media URLs +
 * `unoptimized`, related / adjacent / categories / slugs, draft preview auth,
 * preview tokens, HTTP errors -> throw. Exit code 1 on the first failure.
 * No database, no Next server, no network beyond 127.0.0.1.
 */
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { foldText } from '@/shared/text';
import { createHttpContactSink } from '@site/lib/contact/sinks/http';
import { readHttpConfig } from '@site/lib/content/http/config';
import { CmsHttpError } from '@site/lib/content/http/client';
import { createHttpNewsSource } from '@site/lib/content/http/news-source';
import { sanitizeArticleHtml } from '@site/lib/content/html';
import type { NewsSource } from '@site/lib/content/source';

type L = 'vi' | 'en';
type FixtureNews = {
  id: number;
  slug?: string;
  status: 'published' | 'draft';
  title: Partial<Record<L, string>>;
  excerpt?: Partial<Record<L, string>>;
  content: Partial<Record<L, string>>;
  publishedAt: string;
  updatedAt: string;
  category: number;
  related?: number[];
  [k: string]: unknown;
};
type Fixture = {
  categories: { id: number; slug: string; name: Record<L, string>; order: number }[];
  news: FixtureNews[];
};

const here = dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(readFileSync(join(here, 'fixtures', 'cms.json'), 'utf8')) as Fixture;

const READ_TOKEN = 'qa-read-token';
const PREVIEW_TOKEN = 'qa-preview-token';
const PREVIEW_SECRET = 'qa-preview-secret';
const SINK_SECRET = 'qa-sink-secret';

let failNext500 = false;
const sinkHits: { body: string; headers: IncomingMessage['headers'] }[] = [];

// ---------------------------------------------------------------------------
// Fake CMS (implements the query contract of the default mapping)
// ---------------------------------------------------------------------------

function localized(n: FixtureNews, locale: L) {
  const cat = fixture.categories.find((c) => c.id === n.category);
  const pick = (v?: Partial<Record<L, string>>) => v?.[locale] ?? v?.vi;
  return {
    ...n,
    title: pick(n.title),
    excerpt: pick(n.excerpt),
    content: pick(n.content),
    category: cat ? { id: cat.id, slug: cat.slug, name: cat.name[locale], order: cat.order } : null,
    related: (n.related ?? []).map((id) => fixture.news.find((x) => x.id === id)).filter(Boolean).map((r) => ({ ...r!, title: pick(r!.title), content: undefined })),
  };
}

function handle(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? '/', 'http://x');
  const send = (status: number, body: unknown) => {
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  if (url.pathname === '/hooks/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      sinkHits.push({ body, headers: req.headers });
      send(sinkHits.length === 1 ? 503 : 201, { id: 'crm-42' }); // first attempt fails -> retry
    });
    return;
  }

  const auth = req.headers.authorization;
  if (auth !== `Bearer ${READ_TOKEN}` && auth !== `Bearer ${PREVIEW_TOKEN}`) return send(401, { error: 'unauthorized' });
  if (failNext500) {
    failNext500 = false;
    return send(500, { error: 'boom' });
  }
  const locale = (url.searchParams.get('locale') === 'en' ? 'en' : 'vi') as L;

  if (url.pathname === '/api/news-categories') {
    return send(200, { data: fixture.categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name[locale], order: c.order })) });
  }
  if (url.pathname !== '/api/news') return send(404, { error: 'not found' });

  const draft = url.searchParams.get('draft') === '1' && auth === `Bearer ${PREVIEW_TOKEN}`;
  let rows = fixture.news.filter((n) => draft || n.status === 'published');
  const slug = url.searchParams.get('slug');
  if (slug) rows = rows.filter((n) => n.slug === slug);
  const cat = url.searchParams.get('category');
  if (cat) rows = rows.filter((n) => fixture.categories.find((c) => c.id === n.category)?.slug === cat);
  const q = url.searchParams.get('search');
  if (q) rows = rows.filter((n) => foldText(n.title[locale] ?? n.title.vi).includes(foldText(q)));
  if (url.searchParams.get('featured') === 'true') rows = rows.filter((n) => n.featured === true);
  const before = url.searchParams.get('publishedBefore');
  if (before) rows = rows.filter((n) => n.publishedAt < before);
  const after = url.searchParams.get('publishedAfter');
  if (after) rows = rows.filter((n) => n.publishedAt > after);
  const asc = url.searchParams.get('sort') === 'publishedAt';
  rows = [...rows].sort((a, b) => (asc ? a.publishedAt.localeCompare(b.publishedAt) : b.publishedAt.localeCompare(a.publishedAt)));
  const page = Number(url.searchParams.get('page') ?? 1);
  const limit = Number(url.searchParams.get('limit') ?? 10);
  const slice = rows.slice((page - 1) * limit, page * limit);
  return send(200, { data: slice.map((n) => localized(n, locale)), meta: { total: rows.length } });
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

const results: string[] = [];
async function check(name: string, fn: () => Promise<void> | void) {
  await fn();
  results.push(`ok  ${name}`);
}

async function run(source: NewsSource, base: string) {
  await check('list: published only, newest first, malformed item dropped', async () => {
    const res = await source.list('vi', { cat: null, q: null, page: 1, perPage: 2 });
    assert.deepEqual(res.items.map((i) => i.slug), ['kiem-the-cap-nhat-lon', 'su-kien-trung-thu']);
    assert.equal(res.totalItems, 4); // 4 published rows incl. the slug-less one (counted by the CMS)
    assert.equal(res.totalPages, 2);
    assert.equal(res.hasNext, true);
    const first = res.items[0];
    assert.equal(first.category?.slug, 'game');
    assert.equal(first.cover?.src, `${base}/uploads/kiem-the.webp`); // relative -> CMS_MEDIA_BASE
    assert.equal(first.cover?.sizes.card?.src, `${base}/uploads/kiem-the-md.webp`);
    assert.deepEqual(first.cover?.focal, { x: 40, y: 30 });
    assert.equal(first.cover?.unoptimized, undefined); // 127.0.0.1 is in CONTENT_MEDIA_ORIGINS
    assert.equal(res.items[1].cover?.unoptimized, undefined); // cdn.example.com/media allowed
    const p2 = await source.list('vi', { cat: null, q: null, page: 2, perPage: 2 });
    assert.deepEqual(p2.items.map((i) => i.slug), ['bao-tri-may-chu']); // slug-less row dropped
  });

  await check('list: out-of-range page is clamped to the last page', async () => {
    const res = await source.list('vi', { cat: null, q: null, page: 99, perPage: 2 });
    assert.equal(res.page, 2);
    assert.ok(res.items.length > 0);
  });

  await check('list: category filter + accent-insensitive search', async () => {
    const byCat = await source.list('vi', { cat: 'event', q: null, page: 1, perPage: 9 });
    assert.deepEqual(byCat.items.map((i) => i.slug), ['su-kien-trung-thu']);
    const search = await source.list('vi', { cat: null, q: 'kiem the', page: 1, perPage: 9 });
    assert.deepEqual(search.items.map((i) => i.slug), ['kiem-the-cap-nhat-lon']);
  });

  await check('featured', async () => {
    assert.equal((await source.featured('vi'))?.slug, 'kiem-the-cap-nhat-lon');
  });

  await check('bySlug: DTO mapping (seo, author, tags, locales, related, reading time)', async () => {
    const post = await source.bySlug('vi', 'kiem-the-cap-nhat-lon');
    assert.ok(post);
    assert.equal(post.title, 'Kiếm Thế ra mắt bản cập nhật lớn');
    assert.equal(post.seo.title, 'Kiếm Thế cập nhật | Black Hole Game');
    assert.equal(post.author?.name, 'Ban biên tập');
    assert.equal(post.author?.avatar?.unoptimized, true); // other-cdn.example.net not allowed
    assert.deepEqual(post.tags, ['Kiếm Thế', 'cập nhật']);
    assert.deepEqual(post.locales, ['vi', 'en']);
    assert.deepEqual(post.related.map((r) => r.slug), ['su-kien-trung-thu']);
    assert.ok(post.readingTime >= 1);
    assert.equal(post.content?.format, 'html');
    const en = await source.bySlug('en', 'su-kien-trung-thu');
    assert.deepEqual(en?.locales, ['vi']); // not translated -> hreflang only vi
  });

  await check('bySlug: HTML sanitized, ids match the outline', async () => {
    const post = await source.bySlug('vi', 'kiem-the-cap-nhat-lon');
    assert.ok(post && post.content?.format === 'html');
    const html = post.content.html;
    for (const bad of ['<script', 'onclick', 'onerror', 'style=', 'class="x"', 'javascript:', 'data:image', 'evil.example', '<h1', '<h5']) {
      assert.ok(!html.includes(bad), `sanitized HTML still contains ${bad}`);
    }
    assert.ok(html.includes('<h2 id="tieu-de-phu">'), 'h1 demoted to h2 with id');
    assert.ok(html.includes('<h2 id="mon-phai-moi">') && html.includes('<h2 id="mon-phai-moi-2">'), 'duplicate headings de-duplicated');
    assert.ok(html.includes('<h3 id="ky-nang-trang-bi">'));
    assert.ok(html.includes('<h4>Ghi chú</h4>'), 'h5 -> h4');
    assert.ok(html.includes('href="https://example.com/x" target="_blank" rel="noopener noreferrer nofollow"'));
    assert.ok(html.includes('<a href="/vi/games">trong</a>'));
    assert.ok(html.includes(`src="${base}/uploads/inline.webp"`) && html.includes('loading="lazy"'));
    assert.ok(html.includes('youtube-nocookie.com/embed/abc'));
    assert.ok(html.includes('<div class="table-scroll" role="region" tabindex="0"'));
    assert.deepEqual(
      post.outline.headings.map((h) => `${h.level}:${h.id}`),
      ['2:tieu-de-phu', '2:mon-phai-moi', '2:mon-phai-moi-2', '3:ky-nang-trang-bi'],
    );
    assert.ok(post.outline.wordCount > 5);
  });

  await check('bySlug: drafts need the preview token; unknown slug -> null', async () => {
    assert.equal(await source.bySlug('vi', 'ban-nhap-bi-mat'), null);
    assert.equal((await source.bySlug('vi', 'ban-nhap-bi-mat', { draft: true }))?.title, 'Bản nháp bí mật');
    assert.equal(await source.bySlug('vi', 'khong-ton-tai'), null);
  });

  await check('related: picks, then same category, then latest; never itself', async () => {
    const post = await source.bySlug('vi', 'kiem-the-cap-nhat-lon');
    assert.ok(post);
    const rel = await source.related('vi', { id: post.id, slug: post.slug, category: 'game', picks: post.related }, 3);
    assert.deepEqual(rel.map((r) => r.slug), ['su-kien-trung-thu', 'bao-tri-may-chu']);
  });

  await check('adjacent: older = prev, newer = next', async () => {
    const adj = await source.adjacent('vi', 'su-kien-trung-thu', '2026-09-20T03:00:00.000Z');
    assert.equal(adj.prev?.slug, 'bao-tri-may-chu');
    assert.equal(adj.next?.slug, 'kiem-the-cap-nhat-lon');
  });

  await check('categories sorted by order, localized', async () => {
    const cats = await source.categories('en');
    assert.deepEqual(cats.map((c) => `${c.order}:${c.slug}:${c.name}`), ['1:game:Game news', '2:event:Events', '3:notice:Notices']);
  });

  await check('slugs: every published slug with its real locales', async () => {
    const slugs = await source.slugs();
    const map = Object.fromEntries(slugs.map((s) => [s.slug, s.locales.join(',')]));
    assert.deepEqual(Object.keys(map).sort(), ['bao-tri-may-chu', 'kiem-the-cap-nhat-lon', 'su-kien-trung-thu']);
    // The fake CMS falls back to VI for untranslated rows, so every row appears in both passes.
    assert.ok(map['kiem-the-cap-nhat-lon'].includes('en'));
  });

  await check('preview: token and HMAC signature', async () => {
    const path = '/vi/news/ban-nhap-bi-mat';
    const req = (q: Record<string, string>) => ({ headers: new Headers(), searchParams: new URLSearchParams({ path, ...q }) });
    assert.equal(await source.verifyPreview?.(req({ token: PREVIEW_SECRET })), true);
    assert.equal(await source.verifyPreview?.(req({ token: 'wrong' })), false);
    const exp = String(Math.floor(Date.now() / 1000) + 300);
    const sig = createHmac('sha256', PREVIEW_SECRET).update(`${path}:${exp}`).digest('hex');
    assert.equal(await source.verifyPreview?.(req({ exp, sig })), true);
    assert.equal(await source.verifyPreview?.(req({ exp: String(Math.floor(Date.now() / 1000) - 5), sig })), false);
  });

  await check('HTTP 500 from the CMS throws (the facade turns it into an empty state / ISR keep)', async () => {
    failNext500 = true;
    await assert.rejects(() => source.list('vi', { cat: null, q: null, page: 1, perPage: 9 }), CmsHttpError);
  });
}

async function runSink(base: string) {
  await check('contact http sink: signed JSON, retry on 5xx, id from response', async () => {
    const sink = createHttpContactSink({ url: `${base}/hooks/contact`, token: 'qa-sink-token', secret: SINK_SECRET });
    const res = await sink.submit({
      data: { name: 'qa- Người thử', email: 'qa@example.test', type: 'press', subject: 'qa- Chủ đề', message: 'qa- Nội dung đủ dài để hợp lệ.' },
      meta: { locale: 'vi', ipHash: 'abc', userAgent: 'qa', submittedAt: new Date().toISOString() },
    });
    assert.deepEqual(res, { ok: true, id: 'crm-42' });
    assert.equal(sinkHits.length, 2);
    const hit = sinkHits[1];
    assert.equal(hit.headers.authorization, 'Bearer qa-sink-token');
    assert.equal(hit.headers['idempotency-key'], sinkHits[0].headers['idempotency-key']);
    const expected = `sha256=${createHmac('sha256', SINK_SECRET).update(hit.body).digest('hex')}`;
    assert.equal(hit.headers['x-signature'], expected);
    const body = JSON.parse(hit.body) as { type: string; data: { type: string } };
    assert.equal(body.type, 'contact.created');
    assert.equal(body.data.type, 'press');
  });
}

async function main() {
  // Pure sanitizer edge case: empty input.
  assert.equal(sanitizeArticleHtml('').html, '');

  const server = createServer(handle);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  const base = `http://127.0.0.1:${port}`;
  try {
    const config = readHttpConfig({
      CMS_BASE_URL: `${base}/api`,
      CMS_TOKEN: READ_TOKEN,
      CMS_PREVIEW_TOKEN: PREVIEW_TOKEN,
      CMS_PREVIEW_SECRET: PREVIEW_SECRET,
      CMS_TIMEOUT_MS: '3000',
      CONTENT_MEDIA_ORIGINS: `${base}, https://cdn.example.com/media`,
    } as unknown as NodeJS.ProcessEnv);
    const warnings: string[] = [];
    const source = createHttpNewsSource({ config, warn: (m) => warnings.push(m) });
    await run(source, base);
    assert.ok(warnings.some((w) => w.includes('dropped 1 item')), 'malformed item reported');
    await runSink(base);
  } finally {
    server.close();
  }
  console.log(results.join('\n'));
  console.log(`\nhttp-source check: ${results.length} checks passed`);
}

main().catch((err) => {
  console.log(results.join('\n'));
  console.error('\nFAILED:', err instanceof Error ? err.message : err);
  process.exit(1);
});
