import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/minthep/.claude/skills/chrome-devtools/scripts/lib/browser.js';

const SHOT_DIR = '/Users/minthep/Downloads/pubzi-esports-and-gaming-html-template-2025-09-22-12-44-07-utc/.claude/chrome-devtools/screenshots';

async function run() {
  const browser = await getBrowser();
  const page = await getPage(browser);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 150)));

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 10000));

  const gamesTop = await page.evaluate(() => {
    const el = document.querySelector('.games-section');
    return el.getBoundingClientRect().top + window.scrollY;
  });
  await page.evaluate((y) => window.scrollTo(0, Math.round(y - 720)), gamesTop);
  await new Promise((r) => setTimeout(r, 1000));
  await page.evaluate((y) => window.scrollTo(0, Math.round(y - 120)), gamesTop);
  await new Promise((r) => setTimeout(r, 2400));
  await page.screenshot({ path: `${SHOT_DIR}/g2-default.png` });

  const panel = await page.evaluate(() => {
    const p = document.querySelectorAll('.game-panel')[3];
    const r = p.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.mouse.move(panel.x, panel.y);
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${SHOT_DIR}/g2-hover.png` });

  outputJSON({ success: true, errors });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
