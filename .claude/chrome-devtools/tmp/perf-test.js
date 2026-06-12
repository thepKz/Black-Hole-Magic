import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/minthep/.claude/skills/chrome-devtools/scripts/lib/browser.js';

const SHOT_DIR = '/Users/minthep/Downloads/pubzi-esports-and-gaming-html-template-2025-09-22-12-44-07-utc/.claude/chrome-devtools/screenshots';

async function measureFPS(page, ms = 2000) {
  return page.evaluate(async (duration) => {
    return new Promise((resolve) => {
      let frames = 0;
      const t0 = performance.now();
      const tick = () => {
        frames++;
        if (performance.now() - t0 < duration) requestAnimationFrame(tick);
        else resolve(Math.round((frames / (performance.now() - t0)) * 1000));
      };
      requestAnimationFrame(tick);
    });
  }, ms);
}

async function run() {
  const browser = await getBrowser();
  const page = await getPage(browser);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 150)));

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 9000));

  const aboutTop = await page.evaluate(() => {
    const el = document.querySelector('.about-story');
    return el.getBoundingClientRect().top + window.scrollY;
  });

  // FPS idle in hero
  const fpsHero = await measureFPS(page);

  // mid hero-exit transition (curtain half-way)
  await page.evaluate((y) => window.scrollTo(0, Math.round(y - 540)), aboutTop);
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${SHOT_DIR}/perf-exit-mid.png` });
  const fpsExitMid = await measureFPS(page);

  // story mid, idle
  await page.evaluate((y) => window.scrollTo(0, Math.round(y + 1800)), aboutTop);
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `${SHOT_DIR}/perf-story-mid.png` });
  const fpsStoryIdle = await measureFPS(page);

  // FPS while continuously scrolling through the story
  const fpsScrolling = await page.evaluate(async (top) => {
    return new Promise((resolve) => {
      let frames = 0;
      const t0 = performance.now();
      const duration = 2500;
      const startY = top + 400;
      const tick = () => {
        frames++;
        const t = performance.now() - t0;
        window.scrollTo(0, startY + (t / duration) * 2400);
        if (t < duration) requestAnimationFrame(tick);
        else resolve(Math.round((frames / t) * 1000));
      };
      requestAnimationFrame(tick);
    });
  }, aboutTop);

  // seam screenshot after exit completes
  await page.evaluate((y) => window.scrollTo(0, Math.round(y - 80)), aboutTop);
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${SHOT_DIR}/perf-seam.png` });

  outputJSON({ success: true, fpsHero, fpsExitMid, fpsStoryIdle, fpsScrolling, errors });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
