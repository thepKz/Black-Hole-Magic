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

  const probe = await page.evaluate(() => {
    const video = document.querySelector('video');
    const c = document.createElement('canvas');
    c.width = 64; c.height = 36;
    const ctx = c.getContext('2d');
    ctx.drawImage(video, 0, 0, 64, 36);
    const d = ctx.getImageData(0, 0, 64, 36).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
    const avgLuma = Math.round(sum / (d.length / 4));

    const st = getComputedStyle(video);
    return {
      avgLuma,
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      paused: video.paused,
      currentTime: video.currentTime,
      visibility: st.visibility,
      rect: JSON.parse(JSON.stringify(video.getBoundingClientRect())),
      stackAtTopArea: document.elementsFromPoint(960, 200).map((e) => (e.className || e.tagName).toString().slice(0, 60)).slice(0, 8),
    };
  });

  await page.screenshot({ path: `${SHOT_DIR}/probe-mid.png` });
  outputJSON({ success: true, probe });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
