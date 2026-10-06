/**
 * `npm run bootstrap:admin`  (payload run src/cms/seed/bootstrap-admin.ts)
 *
 * PRODUCTION-SAFE first admin + base categories. Run it from a trusted machine
 * (never from the web) after `npm run migrate` created the tables:
 *
 *   NODE_ENV=production \
 *   DATABASE_URI=<unpooled prod url> PAYLOAD_SECRET=<prod secret> \
 *   BOOTSTRAP_ADMIN_EMAIL=ban-bien-tap@blackholegame.vn \
 *   BOOTSTRAP_ADMIN_PASSWORD='<12+ ky tu>' \
 *   npm run bootstrap:admin
 *
 * Idempotent - safe to run again:
 * - creates the admin only if that email does not exist yet;
 * - creates the three news categories only if missing (never renames them);
 * - never pushes the schema (refuses to run when migrations were not applied).
 *
 * Account recovery (there is no email adapter yet, "Quên mật khẩu" cannot send mail):
 * - BOOTSTRAP_RESET_PASSWORD=true  -> sets BOOTSTRAP_ADMIN_PASSWORD on the existing
 *   account and unlocks it (after 5 failed logins Payload locks for 10 minutes);
 * - BOOTSTRAP_PROMOTE=true         -> gives the existing account the admin role.
 *
 * Secrets are never printed. Do NOT store BOOTSTRAP_ADMIN_PASSWORD in Vercel env.
 */
import config from '@payload-config';
import { getPayload, type Payload } from 'payload';

import { allowSchemaPush, databaseHost, databaseUri } from '../lib/runtime-env';
import { prepareSeedEnv, SEED_CATEGORIES } from './base';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD = 12;

const maskEmail = (email: string) => email.replace(/^(.).*(@.*)$/, '$1***$2');

class BootstrapError extends Error {}

function readInput() {
  const email = (process.env.BOOTSTRAP_ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || '';
  const name = (process.env.BOOTSTRAP_ADMIN_NAME || 'Ban biên tập Black Hole').trim();
  if (!databaseUri() || !process.env.PAYLOAD_SECRET) {
    throw new BootstrapError('Thiếu DATABASE_URI hoặc PAYLOAD_SECRET.');
  }
  if (!EMAIL_RE.test(email)) throw new BootstrapError('BOOTSTRAP_ADMIN_EMAIL chưa đặt hoặc không hợp lệ.');
  // Weak passwords are tolerated only against the local dev database.
  const localDb = allowSchemaPush();
  if (!password || (!localDb && password.length < MIN_PASSWORD)) {
    throw new BootstrapError(`BOOTSTRAP_ADMIN_PASSWORD phải có ít nhất ${MIN_PASSWORD} ký tự.`);
  }
  return { email, password, name };
}

/** Refuse to write into a database whose schema did not come from migrations. */
async function assertMigrated(payload: Payload) {
  if (allowSchemaPush()) return; // local dev DB: schema is pushed
  let ran = 0;
  try {
    ran = (await payload.count({ collection: 'payload-migrations', overrideAccess: true })).totalDocs;
  } catch {
    ran = 0;
  }
  if (ran === 0) {
    throw new BootstrapError('Cơ sở dữ liệu chưa có bảng. Chạy "npm run migrate" (NODE_ENV=production) trước.');
  }
}

async function ensureAdmin(payload: Payload, input: ReturnType<typeof readInput>) {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: input.email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    showHiddenFields: true,
  });
  const user = existing.docs[0];
  const who = maskEmail(input.email);

  if (!user) {
    await payload.create({
      collection: 'users',
      locale: 'vi',
      overrideAccess: true,
      data: { email: input.email, password: input.password, name: input.name, roles: ['admin'] },
    });
    payload.logger.info(`Bootstrap: đã tạo quản trị viên ${who}.`);
    return;
  }

  const data: Record<string, unknown> = {};
  if (process.env.BOOTSTRAP_PROMOTE === 'true' && !user.roles?.includes('admin')) {
    data.roles = [...new Set([...(user.roles ?? []), 'admin'])];
  }
  if (process.env.BOOTSTRAP_RESET_PASSWORD === 'true') data.password = input.password;
  if (Object.keys(data).length) {
    await payload.update({ collection: 'users', id: user.id, data, overrideAccess: true });
  }
  if (process.env.BOOTSTRAP_RESET_PASSWORD === 'true') {
    // (generated auth types require `password` here; unlock only reads the email)
    await payload.unlock({
      collection: 'users',
      data: { email: input.email, password: input.password },
      overrideAccess: true,
    });
  }
  payload.logger.info(
    `Bootstrap: tài khoản ${who} đã tồn tại${data.roles ? ', đã cấp quyền admin' : ''}${data.password ? ', đã đặt lại mật khẩu và mở khoá' : ''}.`,
  );
}

async function ensureCategories(payload: Payload) {
  let created = 0;
  for (const cat of SEED_CATEGORIES) {
    const found = await payload.find({
      collection: 'news-categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (found.docs[0]) continue;
    const doc = await payload.create({
      collection: 'news-categories',
      locale: 'vi',
      overrideAccess: true,
      data: { name: cat.vi, slug: cat.slug, order: cat.order },
    });
    await payload.update({
      collection: 'news-categories',
      id: doc.id,
      locale: 'en',
      overrideAccess: true,
      data: { name: cat.en },
    });
    created++;
  }
  payload.logger.info(`Bootstrap: danh mục tin - tạo mới ${created}, đã có ${SEED_CATEGORIES.length - created}.`);
}

async function run() {
  prepareSeedEnv();
  const input = readInput();
  const payload = await getPayload({ config });
  payload.logger.info(`Bootstrap: cơ sở dữ liệu ${databaseHost() ?? '?'}${allowSchemaPush() ? ' (dev, push)' : ''}.`);
  await assertMigrated(payload);
  await ensureAdmin(payload, input);
  await ensureCategories(payload);
}

// Top-level await: `payload run` exits as soon as the imported module has evaluated.
try {
  await run();
  await new Promise((r) => setTimeout(r, 200));
  process.exit(0);
} catch (err) {
  if (err instanceof BootstrapError) console.error(`Bootstrap thất bại: ${err.message}`);
  else console.error(err);
  process.exit(1);
}
