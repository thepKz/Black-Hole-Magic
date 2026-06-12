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

  // Lenis present? (it adds a class to <html>)
  const lenisActive = await page.evaluate(() => document.documentElement.classList.contains('lenis'));

  // wheel-scroll (goes through Lenis) — verify smooth easing carries the page
  await page.mouse.move(960, 540);
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel({ deltaY: 600 });
    await new Promise((r) => setTimeout(r, 120));
  }
  await new Promise((r) => setTimeout(r, 1800));
  const afterWheel = await page.evaluate(() => window.scrollY);

  // values word-scrub: scroll into the values title region and sample word opacities
  const valuesTop = await page.evaluate(() => {
    const el = document.querySelector('.values-section');
    return el.getBoundingClientRect().top + window.scrollY;
  });
  await page.evaluate((y) => window.scrollTo(0, Math.round(y - 460)), valuesTop);
  await new Promise((r) => setTimeout(r, 1800));
  const wordSample = await page.evaluate(() => {
    const words = document.querySelectorAll('.values-title .sw');
    return [...words].map((w) => parseFloat(getComputedStyle(w).opacity).toFixed(2));
  });
  await page.screenshot({ path: `${SHOT_DIR}/m-words-mid.png` });

  outputJSON({ success: true, lenisActive, afterWheel, wordSample, errors });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
