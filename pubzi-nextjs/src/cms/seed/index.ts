/**
 * `npm run seed` (payload run src/cms/seed/index.ts)
 * Idempotent: creates the first admin (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)
 * and the three news categories. Sample articles: `npm run seed:news`.
 */
import config from '@payload-config';
import { getPayload } from 'payload';

import { prepareSeedEnv, seedBase } from './base';

async function seed() {
  prepareSeedEnv();
  const payload = await getPayload({ config });
  await seedBase(payload);
}

// Top-level await: `payload run` exits as soon as the imported module has evaluated.
try {
  await seed();
  // Give pino a tick to flush before exiting.
  await new Promise((r) => setTimeout(r, 200));
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
