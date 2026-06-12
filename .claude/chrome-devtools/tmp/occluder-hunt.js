import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/minthep/.claude/skills/chrome-devtools/scripts/lib/browser.js';

const SHOT_DIR = '/Users/minthep/Downloads/pubzi-esports-and-gaming-html-template-2025-09-22-12-44-07-utc/.claude/chrome-devtools/screenshots';

async function run() {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 9000));

  await page.evaluate(() => {
    const el = document.querySelector('.about-story');
    const r = el.getBoundingClientRect();
    window.scrollTo(0, Math.round(r.top + window.scrollY + (r.height - innerHeight) * 0.5));
  });
  await new Promise((r) => setTimeout(r, 1800));

  const steps = [
    ['baseline', () => {}],
    ['no-tint', () => { document.querySelector('.about-sticky').style.background = 'transparent'; }],
    ['video-z5', () => { document.querySelector('video').style.zIndex = '5'; }],
    ['video-nofilter', () => { const v = document.querySelector('video'); v.style.filter = 'none'; v.style.transform = 'none'; }],
  ];

  for (const [name, fn] of steps) {
    await page.evaluate(fn);
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: `${SHOT_DIR}/hunt-${name}.png` });
  }

  outputJSON({ success: true });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
