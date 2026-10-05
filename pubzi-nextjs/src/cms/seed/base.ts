import type { Payload } from 'payload';

export const SEED_CATEGORIES = [
  { slug: 'game', order: 1, vi: 'Tin game', en: 'Game news' },
  { slug: 'event', order: 2, vi: 'Sự kiện', en: 'Events' },
  { slug: 'notice', order: 3, vi: 'Thông báo', en: 'Notices' },
] as const;

export type SeedCategorySlug = (typeof SEED_CATEGORIES)[number]['slug'];

/**
 * Idempotent base seed: first admin (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)
 * and the three news categories (VI + EN). Returns the admin id (if any) and
 * a slug -> id map of the categories.
 */
export async function seedBase(payload: Payload): Promise<{
  adminId: number | null;
  categories: Record<SeedCategorySlug, number>;
}> {
  let adminId: number | null = null;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    });
    if (existing.totalDocs === 0) {
      const created = await payload.create({
        collection: 'users',
        locale: 'vi',
        data: {
          email,
          password,
          name: 'Ban biên tập Black Hole',
          roles: ['admin'],
          bio: 'Đội ngũ biên tập tin tức của Black Hole Game.',
        },
      });
      await payload.update({
        collection: 'users',
        id: created.id,
        locale: 'en',
        data: { bio: 'The Black Hole Game editorial team.' },
      });
      adminId = created.id;
      payload.logger.info('Seed: admin user created.');
    } else {
      adminId = existing.docs[0].id;
      payload.logger.info('Seed: admin user already exists.');
    }
  } else {
    payload.logger.warn('Seed: SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set - skipping admin.');
  }

  const categories = {} as Record<SeedCategorySlug, number>;
  for (const cat of SEED_CATEGORIES) {
    const found = await payload.find({
      collection: 'news-categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
      depth: 0,
    });
    const id =
      found.docs[0]?.id ??
      (
        await payload.create({
          collection: 'news-categories',
          locale: 'vi',
          data: { name: cat.vi, slug: cat.slug, order: cat.order },
        })
      ).id;
    await payload.update({ collection: 'news-categories', id, locale: 'en', data: { name: cat.en } });
    categories[cat.slug] = id;
  }
  payload.logger.info('Seed: news categories ready.');
  return { adminId, categories };
}

/** Common setup for CLI seed scripts: no job autorun, no Next revalidation. */
export function prepareSeedEnv() {
  process.env.PAYLOAD_DISABLE_AUTORUN = 'true';
  process.env.PAYLOAD_DISABLE_REVALIDATE = 'true';
}
