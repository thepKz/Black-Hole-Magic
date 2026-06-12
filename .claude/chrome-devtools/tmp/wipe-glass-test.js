import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/minthep/.claude/skills/chrome-devtools/scripts/lib/browser.js';

const SHOT_DIR = '/Users/minthep/Downloads/pubzi-esports-and-gaming-html-template-2025-09-22-12-44-07-utc/.claude/chrome-devtools/screenshots';

async function run() {
  const browser = await getBrowser();
  const page = await getPage(browser);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 150)));

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 9000));

  const { aboutTop, range } = await page.evaluate(() => {
    const el = document.querySelector('.about-story');
    const r = el.getBoundingClientRect();
    return { aboutTop: r.top + window.scrollY, range: r.height - innerHeight };
  });

  const spots = [
    { name: 'v2-glass-mid', p: 0.5 },
    { name: 'v2-stage3', p: 0.82 },
    { name: 'v2-wipe-mid', p: 0.9 },
    { name: 'v2-wipe-end', p: 0.995 },
  ];
  for (const s of spots) {
    await page.evaluate((y) => window.scrollTo(0, Math.round(y)), aboutTop + range * s.p);
    await new Promise((r) => setTimeout(r, 1700));
    await page.screenshot({ path: `${SHOT_DIR}/${s.name}.png` });
  }

  // idle FPS at story mid (sanity check for the perf fixes)
  await page.evaluate((y) => window.scrollTo(0, Math.round(y)), aboutTop + range * 0.5);
  await new Promise((r) => setTimeout(r, 1600));
  const fpsIdle = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let frames = 0;
        const t0 = performance.now();
        const tick = () => {
          frames++;
          if (performance.now() - t0 < 2000) requestAnimationFrame(tick);
          else resolve(Math.round((frames / (performance.now() - t0)) * 1000));
        };
        requestAnimationFrame(tick);
      })
  );

  outputJSON({ success: true, fpsIdle, errors });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
