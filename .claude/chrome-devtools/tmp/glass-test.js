import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/minthep/.claude/skills/chrome-devtools/scripts/lib/browser.js';

const SHOT_DIR = '/Users/minthep/Downloads/pubzi-esports-and-gaming-html-template-2025-09-22-12-44-07-utc/.claude/chrome-devtools/screenshots';

async function run() {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 9000));

  const layout = await page.evaluate(() => {
    const about = document.querySelector('.about-story');
    const values = document.querySelector('.values-section');
    const video = document.querySelector('video');
    const st = window.getComputedStyle;
    return {
      aboutTop: about.getBoundingClientRect().top + window.scrollY,
      aboutH: about.getBoundingClientRect().height,
      valuesTop: values ? values.getBoundingClientRect().top + window.scrollY : null,
      videoPosition: video ? st(video).position : null,
      stickyBackdrop: st(document.querySelector('.about-sticky')).backdropFilter,
    };
  });

  const spots = [
    { name: 'glass-hero-about-seam', y: layout.aboutTop - 540 },
    { name: 'glass-story-start', y: layout.aboutTop + 200 },
    { name: 'glass-story-mid', y: layout.aboutTop + (layout.aboutH - 1080) * 0.62 },
    { name: 'glass-story-end-overlap', y: layout.aboutTop + (layout.aboutH - 1080) * 0.97 },
    { name: 'glass-values', y: layout.valuesTop - 200 },
  ];

  const results = [];
  for (const s of spots) {
    await page.evaluate((sy) => window.scrollTo(0, Math.round(sy)), s.y);
    await new Promise((r) => setTimeout(r, 1800));
    const state = await page.evaluate(() => {
      const video = document.querySelector('video');
      return {
        videoVisibility: video ? video.style.visibility || 'visible' : null,
        videoPaused: video ? video.paused : null,
        scrollY: window.scrollY,
      };
    });
    const file = `${SHOT_DIR}/${s.name}.png`;
    await page.screenshot({ path: file });
    results.push({ ...s, ...state, screenshot: file });
  }

  outputJSON({ success: true, layout, results });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
