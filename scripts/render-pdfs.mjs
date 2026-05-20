/**
 * Render vvv-store/pdfs/*.md → products/*.pdf
 *
 * Usage: npm run render:pdfs
 *
 * The /products folder is what netlify.toml bundles into the
 * get-download-link function. Filenames must match the pdfBundle
 * arrays in src/config/products.js and netlify/functions/_lib/products-server.js.
 *
 * Re-run any time a markdown source changes.
 */

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const SOURCE_DIR = path.join(REPO_ROOT, 'vvv-store', 'pdfs');
const OUTPUT_DIR = path.join(REPO_ROOT, 'products');

const PRINT_CSS = `
  @page { size: Letter; margin: 0.85in 0.75in; }
  html { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; }
  body { font-size: 11.5pt; line-height: 1.55; }
  h1 { font-family: Georgia, serif; font-size: 22pt; font-weight: 400;
       margin: 0 0 0.2em; line-height: 1.15; border-bottom: 2px solid #b45309; padding-bottom: 0.3em; }
  h2 { font-family: Georgia, serif; font-size: 15pt; font-weight: 400;
       margin: 1.4em 0 0.4em; border-bottom: 1px solid #d6d3d1; padding-bottom: 0.2em; }
  h3 { font-family: Georgia, serif; font-size: 12.5pt; font-weight: 600;
       margin: 1.1em 0 0.3em; color: #292524; }
  h4 { font-family: Georgia, serif; font-size: 11.5pt; font-weight: 700;
       margin: 0.9em 0 0.2em; color: #44403c; }
  p { margin: 0 0 0.7em; }
  ul, ol { margin: 0 0 0.8em 1.4em; padding: 0; }
  li { margin-bottom: 0.25em; }
  li > p { margin-bottom: 0.25em; }
  strong { color: #1a1a1a; }
  em { color: #44403c; }
  hr { border: none; border-top: 1px solid #d6d3d1; margin: 1.6em 0; }
  blockquote { margin: 1em 0; padding: 0.6em 1em; border-left: 4px solid #b45309;
               background: #fafaf9; color: #292524; font-style: italic; }
  blockquote p:last-child { margin-bottom: 0; }
  code { font-family: 'Courier New', monospace; font-size: 10pt;
         background: #f4f1ea; padding: 0.1em 0.35em; border-radius: 2px; }
  pre { font-family: 'Courier New', monospace; font-size: 9.5pt;
        background: #f4f1ea; padding: 0.9em 1em; border-radius: 2px;
        overflow-x: auto; line-height: 1.45; }
  pre code { background: transparent; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 10.5pt; }
  th, td { border: 1px solid #d6d3d1; padding: 0.45em 0.6em; text-align: left; vertical-align: top; }
  th { background: #f5f5f4; font-weight: 600; }
  a { color: #b45309; text-decoration: none; }
  /* GFM-style task list checkboxes (rendered as plain checkbox by marked) */
  input[type="checkbox"] { transform: scale(1.1); margin-right: 0.4em; }
  /* Footer marker */
  .doc-footer { margin-top: 2.5em; padding-top: 0.8em; border-top: 1px solid #d6d3d1;
                font-size: 9pt; color: #78716c; }
`;

function htmlShell(title, bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>${PRINT_CSS}</style>
</head>
<body>
${bodyHtml}
<div class="doc-footer">
  Educational use only. Not legal or claims advice. Not affiliated with the U.S. Department of Veterans Affairs.<br/>
  VVV Digitals LLC · Glendale, AZ · vvvdigitals.com
</div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function titleFromMarkdown(md, fallback) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const entries = (await readdir(SOURCE_DIR)).filter((f) => f.endsWith('.md'));
  if (entries.length === 0) {
    console.error(`No .md files in ${SOURCE_DIR}`);
    process.exit(1);
  }

  marked.setOptions({ gfm: true, breaks: false });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const filename of entries) {
      const srcPath = path.join(SOURCE_DIR, filename);
      const outName = filename.replace(/\.md$/, '.pdf');
      const outPath = path.join(OUTPUT_DIR, outName);

      const md = await readFile(srcPath, 'utf8');
      const title = titleFromMarkdown(md, outName);
      const bodyHtml = marked.parse(md);
      const html = htmlShell(title, bodyHtml);

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      await page.emulateMediaType('print');
      const pdfBuffer = await page.pdf({
        format: 'Letter',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: '0.85in', bottom: '0.85in', left: '0.75in', right: '0.75in' },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate:
          '<div style="font-family:Georgia,serif;font-size:8pt;color:#78716c;width:100%;text-align:center;padding:0 0.5in;">' +
          '<span class="pageNumber"></span> / <span class="totalPages"></span>' +
          '</div>',
      });
      await page.close();

      await writeFile(outPath, pdfBuffer);
      console.log(`  ✓ ${filename}  →  products/${outName}  (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
    }
  } finally {
    await browser.close();
  }

  console.log(`\nWrote ${entries.length} PDFs to ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
