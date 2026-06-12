import { getBrowser, getPage, disconnectBrowser, outputJSON } from '/Users/minthep/.claude/skills/chrome-devtools/scripts/lib/browser.js';

async function sample(page) {
  return page.evaluate(() => {
    const track = document.querySelector('.about-model-track');
    const canvas = document.querySelector('.about-3d-stage canvas');
    return {
      scrollY: window.scrollY,
      trackX: track ? new DOMMatrixReadOnly(getComputedStyle(track).transform).e : null,
      canvasRect: canvas ? { x: canvas.getBoundingClientRect().x, y: canvas.getBoundingClientRect().y, w: canvas.getBoundingClientRect().width, h: canvas.getBoundingClientRect().height } : null,
    };
  });
}

async function run() {
  const browser = await getBrowser();
  const page = await getPage(browser);
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message.slice(0, 200)));

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 9000));

  const aboutTop = await page.evaluate(() => {
    const el = document.querySelector('.about-story');
    return el.getBoundingClientRect().top + window.scrollY;
  });

  // scroll into the story so the canvas is on screen
  await page.evaluate((y) => window.scrollTo(0, Math.round(y + 600)), aboutTop);
  await new Promise((r) => setTimeout(r, 1800));

  const before = await sample(page);

  // CONTROL: wheel scroll without touching the canvas
  await page.mouse.move(1500, 540);
  await page.mouse.wheel({ deltaY: 400 });
  await new Promise((r) => setTimeout(r, 1600));
  const afterControlWheel = await sample(page);

  // TOUCH the 3D: pointer down + drag on canvas center, release
  const c = before.canvasRect;
  const cx = c ? c.x + c.w / 2 : 400;
  const cy = c ? c.y + c.h / 2 : 540;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 120, cy + 40, { steps: 8 });
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 500));

  const afterTouch = await sample(page);

  // Now scroll again — wheel over the canvas area
  await page.mouse.wheel({ deltaY: 400 });
  await new Promise((r) => setTimeout(r, 1600));
  const afterWheelOnCanvas = await sample(page);

  // and scroll via window.scrollBy (simulates scrollbar drag)
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise((r) => setTimeout(r, 1600));
  const afterProgrammatic = await sample(page);

  outputJSON({
    success: true,
    aboutTop,
    before,
    afterControlWheel,
    afterTouch,
    afterWheelOnCanvas,
    afterProgrammatic,
    errors,
  });
  await disconnectBrowser();
}

run().catch((e) => {
  outputJSON({ success: false, error: e.message });
  process.exit(1);
});
