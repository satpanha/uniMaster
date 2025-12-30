const playwright = require('playwright');

(async () => {
  const base = 'http://localhost:3000';
  const pages = [
    '/dashboard',
    '/dashboard/events',
    '/dashboard/athletes',
    '/dashboard/medals',
    '/dashboard/provinces',
    '/dashboard/events/event-1',
    '/dashboard/events/event-1/athletes',
  ];
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1024, height: 768 },
    { name: 'wide', width: 1366, height: 768 },
  ];

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const results = [];

  for (const pagePath of pages) {
    const page = await context.newPage();
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      try {
        await page.goto(base + pagePath, { waitUntil: 'networkidle' });
      } catch (e) {
        results.push({ page: pagePath, vp: vp.name, error: e.message });
        continue;
      }

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
        const clientW = doc.clientWidth;
        const over = scrollW > clientW;
        const overAmount = scrollW - clientW;
        return { over, overAmount, scrollW, clientW };
      });

      // count images with missing naturalWidth
      const badImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter(i => !i.naturalWidth || i.naturalWidth === 0).map(i => i.src || i.getAttribute('src'));
      });

      // find long words that may cause overflow
      const longText = await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const found = [];
        let node;
        while ((node = walker.nextNode())) {
          if (node.nodeValue && node.nodeValue.trim().length > 30 && /\S{30,}/.test(node.nodeValue)) {
            found.push(node.nodeValue.trim().slice(0,60));
          }
        }
        return found.slice(0,5);
      });

      results.push({ page: pagePath, vp: vp.name, overflow, badImages, longText });
    }
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
})();
