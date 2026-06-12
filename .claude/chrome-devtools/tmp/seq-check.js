import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/minthep/.claude/skills/chrome-devtools/scripts/lib/browser.js';

const SHOT_DIR = '/Users/minthep/Downloads/pubzi-esports-and-gaming-html-template-2025-09-22-12-44-07-utc/.claude/chrome-devtools/screenshots';

async function run() {
  const browser = await getBrowser();
  const page = await getPage(browser);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 150)));

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 9000));

  // exit mid (50vh): pieces leaving, video crisp, NO about content yet
  await page.evaluate(() => window.scrollTo(0, Math.round(innerHeight * 0.5)));
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: `${SHOT_DIR}/s-exit-mid.png` });

  // 150vh: pieces gone, about panel halfway up over frosted video
  await page.evaluate(() => window.scrollTo(0, Math.round(innerHeight * 1.5)));
  await new Promise((r) => setTimeout(r, 1800));
  await page.screenshot({ path: `${SHOT_DIR}/s-about-arrives.png` });

  // values reveal: scroll to just before, then into it
  const valuesTop = await page.evaluate(() => {
    const el = document.querySelector('.values-section');
    return el.getBoundingClientRect().top + window.scrollY;
  });
  await page.evaluate((y) => window.scrollTo(0, Math.round(y - 1000)), valuesTop);
  await new Promise((r) => setTimeout(r, 900));
  await page.evaluate((y) => window.scrollTo(0, Math.round(y - 300)), valuesTop);
  await new Promise((r) => setTimeout(r, 1100));
  await page.screenshot({ path: `${SHOT_DIR}/s-values-revealing.png` });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${SHOT_DIR}/s-values-done.png` });

  // games strip + hover second panel
  const gamesTop = await page.evaluate(() => {
    const el = document.querySelector('.games-strip');
    return el.getBoundingClientRect().top + window.scrollY;
  });
  await page.evaluate((y) => window.scrollTo(0, Math.round(y - 380)), gamesTop);
  await new Promise((r) => setTimeout(r, 2200));
  const panel = await page.evaluate(() => {
    const p = document.querySelectorAll('.game-panel')[1];
    const r = p.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.mouse.move(panel.x, panel.y);
  await new Promise((r) => setTimeout(r, 1100));
  await page.screenshot({ path: `${SHOT_DIR}/s-games-hover.png` });

  outputJSON({ success: true, errors });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
