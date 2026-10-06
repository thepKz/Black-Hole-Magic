/**
 * Regression checks for the news workflow hooks + CMS helpers (no DB, no server):
 *
 *   npx tsx src/cms/hooks/__checks__/newsWorkflow.check.ts
 *
 * - F01: restoring a version saved BEFORE the first publish onto a live article
 *   keeps it live AND keeps its publishedAt (a null date sorted first on
 *   `-publishedAt` and pinned the article to the top of /news).
 * - computeDerived never leaves a published article without publishedAt.
 * - Publish checklist: alt generated from the file name (altAuto) and a sapo
 *   identical to the first paragraph are refused.
 * - humanizeFilename keeps "-1" / "-2" of uploaded names (distinct alts).
 * - Password policy + per-IP login limiter.
 * Exit code 1 on the first failure.
 */
import assert from 'node:assert/strict';

import type { PayloadRequest } from 'payload';

import { _resetAllAuthLimits, hitAuthLimit, passwordProblem } from '../../lib/authGuard';
import { humanizeFilename } from '../../lib/uploads';
import { computeDerived, keepLiveOnRestore, validateBeforePublish } from '../newsWorkflow';

type Hook = (args: Record<string, unknown>) => unknown;
const run = async (hook: unknown, args: Record<string, unknown>) =>
  (await (hook as Hook)(args)) as Record<string, unknown>;

const editor = { id: 2, roles: ['editor'] };
const LIVE_DATE = '2026-10-06T04:27:47.000Z';

function fakeReq(opts: {
  live?: { _status: string; publishedAt: string | null };
  media?: { id: number; alt: string; altAuto: boolean; filename: string }[];
  context?: Record<string, unknown>;
  query?: Record<string, unknown>;
}): PayloadRequest {
  return {
    user: editor,
    context: opts.context ?? {},
    query: opts.query ?? {},
    locale: 'vi',
    t: ((k: string) => k) as never,
    payloadAPI: 'REST',
    headers: new Headers(),
    payload: {
      findByID: async () => opts.live ?? null,
      find: async () => ({ docs: opts.media ?? [] }),
    },
  } as unknown as PayloadRequest;
}

const para = (text: string) => ({
  type: 'paragraph',
  children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
});
const doc = (...texts: string[]) => ({ root: { type: 'root', children: texts.map(para) } });

let passed = 0;
async function check(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    passed += 1;
    console.log(`ok   ${name}`);
  } catch (err) {
    console.error(`FAIL ${name}`);
    console.error(err);
    process.exit(1);
  }
}

await check('F01 restore of a pre-publish version keeps the article live + its publishedAt', async () => {
  const req = fakeReq({ live: { _status: 'published', publishedAt: LIVE_DATE }, context: { isRestoringVersion: true } });
  const restored = { title: 'Bản nháp cũ', _status: 'draft', publishedAt: null };
  const out = await run(keepLiveOnRestore, { data: { ...restored }, originalDoc: { id: 25 }, operation: 'update', req });
  assert.equal(out._status, 'published');
  assert.equal(out.publishedAt, LIVE_DATE);
  const derived = await run(computeDerived, { data: out, originalDoc: { id: 25, publishedAt: LIVE_DATE }, req });
  assert.equal(derived.publishedAt, LIVE_DATE);
});

await check('F01 "Khôi phục thành bản nháp" (?draft=true) does not touch the live doc', async () => {
  const req = fakeReq({
    live: { _status: 'published', publishedAt: LIVE_DATE },
    context: { isRestoringVersion: true },
    query: { draft: 'true' },
  });
  const out = await run(keepLiveOnRestore, { data: { _status: 'draft', publishedAt: null }, originalDoc: { id: 25 }, operation: 'update', req });
  assert.equal(out._status, 'draft');
});

await check('computeDerived: a published save never ends with publishedAt null', async () => {
  const req = fakeReq({});
  const kept = await run(computeDerived, { data: { _status: 'published', publishedAt: null }, originalDoc: { publishedAt: LIVE_DATE }, req });
  assert.equal(kept.publishedAt, LIVE_DATE);
  const first = await run(computeDerived, { data: { _status: 'published' }, originalDoc: {}, req });
  assert.ok(typeof first.publishedAt === 'string' && !Number.isNaN(Date.parse(first.publishedAt as string)));
  const draft = await run(computeDerived, { data: { _status: 'draft', publishedAt: null }, originalDoc: {}, req });
  assert.equal(draft.publishedAt, null);
});

const validArticle = {
  _status: 'published',
  title: 'Máy chủ mới ra mắt',
  slug: 'may-chu-moi-ra-mat',
  category: 1,
  cover: 45,
  excerpt: 'Sapo viết riêng, tóm tắt ý chính của bài về máy chủ mới ra mắt tháng 10.',
  content: doc('Đoạn mở đầu của bài viết, khác với sapo ở trên để không bị lặp lại.'),
};

await check('checklist: reviewed alt + distinct sapo publishes', async () => {
  const req = fakeReq({ media: [{ id: 45, alt: 'Ảnh máy chủ', altAuto: false, filename: 'a.webp' }] });
  await run(validateBeforePublish, { data: { ...validArticle }, originalDoc: {}, req });
});

await check('F13 checklist refuses a cover whose alt is auto-generated', async () => {
  const req = fakeReq({ media: [{ id: 45, alt: 'Qa gallery', altAuto: true, filename: 'qa-gallery.webp' }] });
  await assert.rejects(run(validateBeforePublish, { data: { ...validArticle }, originalDoc: {}, req }), /tự sinh/);
});

await check('F08 checklist refuses a sapo identical to the first paragraph', async () => {
  const req = fakeReq({ media: [{ id: 45, alt: 'Ảnh máy chủ', altAuto: false, filename: 'a.webp' }] });
  const same = 'Bản cập nhật lớn tháng 10 mang đến máy chủ mới cùng nhiều sự kiện cho người chơi.';
  await assert.rejects(
    run(validateBeforePublish, { data: { ...validArticle, excerpt: same, content: doc(same, 'Đoạn hai.') }, originalDoc: {}, req }),
    /trùng nguyên văn/,
  );
});

await check('F13 humanizeFilename keeps -1/-2 of uploaded names, drops it for stored names', () => {
  assert.equal(humanizeFilename('qa-gallery-1.jpg'), 'Qa gallery 1');
  assert.equal(humanizeFilename('qa-gallery-2.jpg'), 'Qa gallery 2');
  assert.equal(humanizeFilename('tlbb-server-moi-1.webp', { storedName: true }), 'Tlbb server moi');
  assert.equal(humanizeFilename('IMG_1234.JPG'), null);
});

await check('SEC-07 password policy', () => {
  assert.ok(passwordProblem('abc'));
  assert.ok(passwordProblem('password1234'));
  assert.ok(passwordProblem('nguyenvana-2026!', 'nguyenvana@blackholegame.vn'));
  assert.equal(passwordProblem('may-chu-moi-thang-10'), null);
});

await check('SEC-09 per-IP login limit: 10 attempts, then 429', () => {
  _resetAllAuthLimits();
  const req = { payloadAPI: 'REST', headers: new Headers({ 'x-forwarded-for': '203.0.113.9' }) } as unknown as PayloadRequest;
  for (let i = 0; i < 10; i++) hitAuthLimit('login', req);
  assert.throws(() => hitAuthLimit('login', req), (e: { status?: number }) => e.status === 429);
  const other = { payloadAPI: 'REST', headers: new Headers({ 'x-forwarded-for': '203.0.113.10' }) } as unknown as PayloadRequest;
  hitAuthLimit('login', other);
});

console.log(`\n${passed} checks passed`);
