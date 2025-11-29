const puppeteer = require('puppeteer');

(async () => {
  // change port if your dev server uses a different port
  const base = 'http://localhost:5173';
  const pages = [
    { url: base + '/docs/privacy-policy.html', out: 'public/docs/privacy-policy.pdf' },
    { url: base + '/docs/terms-of-service.html', out: 'public/docs/terms-of-service.pdf' }
  ];

  const browser = await puppeteer.launch();
  for (const p of pages) {
    const page = await browser.newPage();
    await page.goto(p.url, {waitUntil: 'networkidle0'});
    await page.pdf({path: p.out, format: 'A4', printBackground: true});
    console.log(`Wrote ${p.out}`);
  }
  await browser.close();
})();
