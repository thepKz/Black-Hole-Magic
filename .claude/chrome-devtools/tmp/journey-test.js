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

  const { aboutTop, range, caseTop } = await page.evaluate(() => {
    const about = document.querySelector('.about-story');
    const r = about.getBoundingClientRect();
    const cs = document.querySelector('.gt-game-case-study-section');
    return {
      aboutTop: r.top + window.scrollY,
      range: r.height - innerHeight,
      caseTop: cs ? cs.getBoundingClientRect().top + window.scrollY : null,
    };
  });

  const spots = [
    { name: 'j-exit-30', y: innerHeight => 0.3 * innerHeight },
    { name: 'j-exit-70', y: innerHeight => 0.7 * innerHeight },
    { name: 'j-glass-early', y: () => aboutTop + range * 0.15 },
    { name: 'j-glass-mid', y: () => aboutTop + range * 0.5 },
    { name: 'j-wipe', y: () => aboutTop + range * 0.93 },
    { name: 'j-casestudy', y: () => caseTop - 540 },
  ];

  for (const s of spots) {
    await page.evaluate((yy) => window.scrollTo(0, Math.round(yy)), s.y(1080));
    await new Promise((r) => setTimeout(r, 1900));
    await page.screenshot({ path: `${SHOT_DIR}/${s.name}.png` });
  }

  outputJSON({ success: true, errors });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
