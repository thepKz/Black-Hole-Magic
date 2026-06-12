import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/minthep/.claude/skills/chrome-devtools/scripts/lib/browser.js';

const SHOT_DIR = '/Users/minthep/Downloads/pubzi-esports-and-gaming-html-template-2025-09-22-12-44-07-utc/.claude/chrome-devtools/screenshots';

async function run() {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  // wait out the preloader + model load
  await new Promise((r) => setTimeout(r, 9000));

  const aboutTop = await page.evaluate(() => {
    const el = document.querySelector('.about-story');
    return el ? el.getBoundingClientRect().top + window.scrollY : null;
  });

  if (aboutTop == null) {
    outputJSON({ success: false, error: 'about-story not found' });
    await disconnectBrowser();
    return;
  }

  const wrapperH = await page.evaluate(() => document.querySelector('.about-story').getBoundingClientRect().height);
  const scrollRange = wrapperH - 1080; // sticky scroll distance

  const samples = [];
  for (const p of [0, 0.1, 0.25, 0.45, 0.65, 0.85, 1.0]) {
    const y = Math.round(aboutTop + scrollRange * p);
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await new Promise((r) => setTimeout(r, 1600)); // let scrub catch up
    const state = await page.evaluate(() => {
      const st = window.getComputedStyle;
      const track = document.querySelector('.about-model-track');
      const stages = [0, 1, 2, 3].map((i) => {
        const el = document.querySelector(`.stage-${i} .stage-inner`);
        return el ? { opacity: st(el).opacity, rect: el.getBoundingClientRect().left } : null;
      });
      const canvas = document.querySelector('.about-3d-stage canvas');
      const mount = document.querySelector('.about-model-mount');
      return {
        scrollY: window.scrollY,
        trackTransform: track ? st(track).transform : null,
        trackLeft: track ? track.getBoundingClientRect().left : null,
        stages,
        canvasExists: !!canvas,
        mountOpacity: mount ? st(mount).opacity : null,
      };
    });
    const file = `${SHOT_DIR}/story-${Math.round(p * 100)}.png`;
    await page.screenshot({ path: file });
    samples.push({ progress: p, ...state, screenshot: file });
  }

  outputJSON({ success: true, aboutTop, wrapperH, samples });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
