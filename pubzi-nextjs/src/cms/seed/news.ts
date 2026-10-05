/**
 * `npm run seed:news` (payload run src/cms/seed/news.ts)
 *
 * Idempotent. Runs the base seed (admin + categories), uploads the 5 game key
 * arts as media (public/site/games/{slug}-wide.webp, 16:9) and creates the 9
 * sample articles (VI + EN, published, design dates). Existing articles (same
 * slug) are left untouched; pass `--force` to overwrite their content.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import config from '@payload-config';
import { getPayload, type Payload } from 'payload';

import { lx } from '../lib/lexical';
import { prepareSeedEnv, seedBase } from './base';
import { SEED_ART_ALT, SEED_ARTICLES, type SeedArticle, type SeedArticleCopy, type SeedGameArt } from './news-data';

const FORCE = process.argv.includes('--force');

async function ensureMedia(payload: Payload, art: SeedGameArt): Promise<number> {
  const filename = `seed-${art}.webp`;
  const found = await payload.find({
    collection: 'media',
    // `like`: also matches "seed-x-1.webp" if the file already existed on disk (Payload renames).
    where: { filename: { like: `seed-${art}` } },
    limit: 1,
    depth: 0,
  });
  if (found.docs[0]) return found.docs[0].id;

  const filePath = path.resolve(process.cwd(), 'public/site/games', `${art}-wide.webp`);
  const data = await readFile(filePath);
  const created = await payload.create({
    collection: 'media',
    locale: 'vi',
    data: { alt: SEED_ART_ALT[art].vi, credit: 'Black Hole Game' },
    file: { data, mimetype: 'image/webp', name: filename, size: data.byteLength },
  });
  await payload.update({
    collection: 'media',
    id: created.id,
    locale: 'en',
    data: { alt: SEED_ART_ALT[art].en },
  });
  return created.id;
}

/** "28/09/2026" -> 2026-09-28T09:00:00+07:00 as ISO (UTC). */
function toPublishedAt(date: string): string {
  const [d, m, y] = date.split('/').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 2, 0, 0)).toISOString();
}

function buildContent(copy: SeedArticleCopy, inlineImageId: number) {
  return lx.root(
    lx.paragraph(lx.text(copy.intro)),
    lx.heading('h2', copy.heading),
    lx.paragraph(copy.body),
    lx.paragraph(lx.text(copy.listIntro, 'bold')),
    lx.list('bullet', copy.list),
    lx.upload(inlineImageId, copy.imageCaption),
    ...(copy.quote ? [lx.quote(copy.quote)] : []),
    lx.paragraph(copy.outro),
  );
}

async function upsertArticle(
  payload: Payload,
  article: SeedArticle,
  ctx: { adminId: number | null; categoryId: number; media: Record<SeedGameArt, number> },
): Promise<{ id: number; created: boolean }> {
  const existing = await payload.find({
    collection: 'news',
    where: { slug: { equals: article.slug } },
    limit: 1,
    depth: 0,
    draft: true,
  });
  if (existing.docs[0] && !FORCE) return { id: existing.docs[0].id, created: false };

  const shared = {
    slug: article.slug,
    generateSlug: false,
    category: ctx.categoryId,
    cover: article.cover ? ctx.media[article.cover] : null,
    publishedAt: toPublishedAt(article.date),
    author: ctx.adminId,
    featured: Boolean(article.featured),
    _status: 'published' as const,
  };
  const localized = (copy: SeedArticleCopy) => ({
    title: copy.title,
    excerpt: copy.excerpt,
    tags: copy.tags,
    content: buildContent(copy, ctx.media[article.inlineImage]) as never,
  });

  let id: number;
  if (existing.docs[0]) {
    id = existing.docs[0].id;
    await payload.update({ collection: 'news', id, locale: 'vi', data: { ...shared, ...localized(article.vi) } });
  } else {
    id = (await payload.create({ collection: 'news', locale: 'vi', data: { ...shared, ...localized(article.vi) } }))
      .id;
  }
  await payload.update({
    collection: 'news',
    id,
    locale: 'en',
    data: { ...localized(article.en), _status: 'published' },
  });
  return { id, created: !existing.docs[0] };
}

async function seedNews() {
  prepareSeedEnv();
  const payload = await getPayload({ config });
  const { adminId, categories } = await seedBase(payload);

  const arts = Object.keys(SEED_ART_ALT) as SeedGameArt[];
  const media = {} as Record<SeedGameArt, number>;
  for (const art of arts) media[art] = await ensureMedia(payload, art);
  payload.logger.info(`Seed: ${arts.length} media ready.`);

  const ids: Record<string, number> = {};
  let created = 0;
  for (const article of SEED_ARTICLES) {
    const res = await upsertArticle(payload, article, {
      adminId,
      categoryId: categories[article.category],
      media,
    });
    ids[article.slug] = res.id;
    if (res.created) created += 1;
  }

  // Manual related posts (second pass: all ids exist now).
  for (const article of SEED_ARTICLES) {
    if (!article.related?.length) continue;
    const relatedPosts = article.related.map((s) => ids[s]).filter((x): x is number => typeof x === 'number');
    await payload.update({
      collection: 'news',
      id: ids[article.slug],
      data: { relatedPosts, _status: 'published' },
    });
  }

  const { totalDocs } = await payload.count({ collection: 'news', where: { _status: { equals: 'published' } } });
  payload.logger.info(`Seed: ${created} article(s) created, ${totalDocs} published article(s) in total.`);
}

// Top-level await: `payload run` exits as soon as the imported module has evaluated.
try {
  await seedNews();
  // Give pino a tick to flush before exiting.
  await new Promise((r) => setTimeout(r, 200));
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
