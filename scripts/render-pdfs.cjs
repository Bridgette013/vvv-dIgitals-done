const puppeteer = require('puppeteer');

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const pages = [
  { url: `${BASE}/docs/privacy-policy.html`, out: 'public/docs/privacy-policy.pdf' },
  { url: `${BASE}/docs/terms-of-service.html`, out: 'public/docs/terms-of-service.pdf' },
];

(async () => {
  console.log('Using base URL:', BASE);
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    for (const p of pages) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      console.log('Rendering', p.url);
      await page.goto(p.url, { waitUntil: 'networkidle0' });
      await page.pdf({ path: p.out, format: 'A4', printBackground: true });
      console.log(`Wrote ${p.out}`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log('All done.');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
