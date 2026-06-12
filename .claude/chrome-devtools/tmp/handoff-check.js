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

  const spots = [
    { name: 'h-25vh', f: 0.25 },  // exit in progress, video crisp
    { name: 'h-60vh', f: 0.6 },   // pieces gone, panel about to rise
    { name: 'h-90vh', f: 0.9 },   // panel rising, frost behind it
    { name: 'h-130vh', f: 1.3 },  // panel nearly covering
  ];
  const states = [];
  for (const s of spots) {
    await page.evaluate((f) => window.scrollTo(0, Math.round(innerHeight * f)), s.f);
    await new Promise((r) => setTimeout(r, 1600));
    const st = await page.evaluate(() => {
      const v = document.querySelector('.hero-video-bg');
      const about = document.querySelector('.about-story');
      return {
        scrollY: window.scrollY,
        frosted: v.classList.contains('is-frosted'),
        aboutViewportTop: Math.round(about.getBoundingClientRect().top),
      };
    });
    await page.screenshot({ path: `${SHOT_DIR}/${s.name}.png` });
    states.push({ ...s, ...st });
  }

  outputJSON({ success: true, states, errors });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
