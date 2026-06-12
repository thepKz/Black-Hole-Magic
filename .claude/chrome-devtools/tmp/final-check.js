import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/minthep/.claude/skills/chrome-devtools/scripts/lib/browser.js';

const SHOT_DIR = '/Users/minthep/Downloads/pubzi-esports-and-gaming-html-template-2025-09-22-12-44-07-utc/.claude/chrome-devtools/screenshots';

async function heroState(page) {
  return page.evaluate(() => {
    const st = getComputedStyle;
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = st(el);
      return { opacity: parseFloat(s.opacity).toFixed(2), visibility: s.visibility };
    };
    return {
      phone: pick('.hero-action-cluster'),
      character: pick('.hero-character'),
      title: pick('.hero-main-title'),
      frosted: document.querySelector('.hero-video-bg')?.classList.contains('is-frosted'),
    };
  });
}

async function run() {
  const browser = await getBrowser();
  const page = await getPage(browser);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 150)));

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 9000));

  const atLoad = await heroState(page);
  await page.screenshot({ path: `${SHOT_DIR}/f-hero-load.png` });

  // the user's bug: slight scroll then pieces vanished
  await page.evaluate(() => window.scrollTo(0, 140));
  await new Promise((r) => setTimeout(r, 1500));
  const atSlightScroll = await heroState(page);
  await page.screenshot({ path: `${SHOT_DIR}/f-hero-slight.png` });

  // scroll back to top — pieces must come back
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1500));
  const backToTop = await heroState(page);

  // values section
  const valuesTop = await page.evaluate(() => {
    const el = document.querySelector('.values-section');
    return el.getBoundingClientRect().top + window.scrollY;
  });
  await page.evaluate((y) => window.scrollTo(0, Math.round(y - 700)), valuesTop);
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate((y) => window.scrollTo(0, Math.round(y - 160)), valuesTop);
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: `${SHOT_DIR}/f-values.png` });

  outputJSON({ success: true, atLoad, atSlightScroll, backToTop, errors });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
