import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/minthep/.claude/skills/chrome-devtools/scripts/lib/browser.js';
import sharp from '/Users/minthep/.claude/skills/chrome-devtools/scripts/node_modules/sharp/lib/index.js';

const SHOT_DIR = '/Users/minthep/Downloads/pubzi-esports-and-gaming-html-template-2025-09-22-12-44-07-utc/.claude/chrome-devtools/screenshots';

async function luma(file) {
  const s = await sharp(file).stats();
  return Math.round((s.channels[0].mean + s.channels[1].mean + s.channels[2].mean) / 3);
}

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

  const ancestors = await page.evaluate(() => {
    const list = [];
    let el = document.querySelector('.about-sticky');
    while (el) {
      const s = getComputedStyle(el);
      list.push({
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 40),
        bgColor: s.backgroundColor,
        bgImage: s.backgroundImage === 'none' ? 'none' : s.backgroundImage.slice(0, 60),
      });
      el = el.parentElement;
    }
    return list;
  });

  const steps = [
    ['e-baseline', () => {}],
    ['e-hide-about', () => { document.querySelector('.about-story').style.visibility = 'hidden'; }],
    ['e-hide-wrapper', () => {
      document.querySelector('.about-story').style.visibility = '';
      document.querySelector('.about-story').parentElement.style.visibility = 'hidden';
    }],
    ['e-clear-bodybg', () => {
      document.querySelector('.about-story').parentElement.style.visibility = '';
      document.body.style.background = 'transparent';
      document.documentElement.style.background = 'transparent';
    }],
  ];

  const results = [];
  for (const [name, fn] of steps) {
    await page.evaluate(fn);
    await new Promise((r) => setTimeout(r, 400));
    const file = `${SHOT_DIR}/${name}.png`;
    await page.screenshot({ path: file });
    results.push({ name, luma: await luma(file) });
  }

  outputJSON({ success: true, ancestors, results });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
