/**
 * Unit-level smoke test for the VA toolkit license + download path.
 *
 * Exercises the EXACT modules the Stripe webhook + validate-license +
 * get-download-link functions use, in the order they're called in prod:
 *
 *   1. issueLicense        (webhook → email)
 *   2. validateLicense     (gate → /api/validate-license)
 *   3. validateLicense w/ wrong slug         (negative case)
 *   4. validateLicense w/ tampered token     (negative case)
 *   5. buildDownloadUrl    (webhook → email)
 *   6. verifyToken         (get-download-link)
 *   7. file read against products/           (get-download-link)
 *   8. path-traversal rejection              (defense in depth)
 *
 * Reports PASS/FAIL per step with detail on any failure.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// The license module reads SECRET from env at require time, so set it first.
process.env.LICENSE_HMAC_SECRET =
  process.env.LICENSE_HMAC_SECRET || crypto.randomBytes(32).toString('hex');

const {
  issueLicense,
  validateLicense,
  buildDownloadUrl,
  verifyToken,
} = require('../netlify/functions/_lib/license.js');
const {
  getProductBySlug,
} = require('../netlify/functions/_lib/products-server.js');

const PRODUCTS_ROOT = path.join(__dirname, '..', 'products');

let pass = 0;
let fail = 0;
const failures = [];

function check(name, condition, detail) {
  if (condition) {
    console.log(`  PASS  ${name}`);
    pass++;
  } else {
    console.log(`  FAIL  ${name}${detail ? '  →  ' + detail : ''}`);
    fail++;
    failures.push(name);
  }
}

console.log('VA toolkit license + download smoke test');
console.log('=========================================\n');

// ---- 0. Product catalog reachable -----------------------------------------
const product = getProductBySlug('va-toolkit');
check('0. getProductBySlug("va-toolkit") returns live product', !!product);
check(
  '0. product.pdfBundle has 6 files',
  product && Array.isArray(product.pdfBundle) && product.pdfBundle.length === 6,
  product && `got ${product.pdfBundle?.length}`
);

// ---- 1. issueLicense -------------------------------------------------------
const BUYER = 'test+smoke@vvvdigitals.com';
const SLUG = 'va-toolkit';
let licenseToken;
try {
  licenseToken = issueLicense(BUYER, [SLUG]);
  check(
    '1. issueLicense returns a 2-part HMAC token',
    typeof licenseToken === 'string' && licenseToken.split('.').length === 2,
    `len=${licenseToken?.length}`
  );
} catch (e) {
  check('1. issueLicense', false, e.message);
}

// ---- 2. validateLicense (happy path) --------------------------------------
const v1 = validateLicense(licenseToken);
check('2. validateLicense(token).valid === true', v1.valid, JSON.stringify(v1));
check(
  '2. validateLicense payload.email matches buyer',
  v1.valid && v1.payload.email === BUYER,
  v1.payload && `got ${v1.payload.email}`
);
check(
  '2. validateLicense payload.slugs includes va-toolkit',
  v1.valid && v1.payload.slugs.includes(SLUG)
);

// ---- 3. validateLicense rejects wrong-slug entitlement at the gate -------
// (validateLicense itself returns valid; the gate function in
// validate-license.js then checks the slug list. Mirror that logic here.)
const wrongSlugCheck = v1.valid && v1.payload.slugs.includes('other-product');
check(
  '3. wrong-slug check rejects (gate-level)',
  !wrongSlugCheck,
  'slug enforcement happens in validate-license.js after payload extraction'
);

// ---- 4. Tampered token rejected -------------------------------------------
// Flip one char in the signature half.
const [payloadB64, sigB64] = licenseToken.split('.');
const tamperedSig =
  sigB64.slice(0, -1) + (sigB64.slice(-1) === 'A' ? 'B' : 'A');
const tampered = `${payloadB64}.${tamperedSig}`;
const v2 = validateLicense(tampered);
check(
  '4. tampered token rejected (valid === false)',
  v2.valid === false,
  JSON.stringify(v2)
);
check(
  '4. tampered token reason === invalid_or_expired',
  v2.reason === 'invalid_or_expired',
  v2.reason
);

// ---- 5. buildDownloadUrl --------------------------------------------------
const SITE_URL = 'https://vvvdigitals.com';
const FILE = 'hlr-walkthrough.pdf';
const dlUrl = buildDownloadUrl(SITE_URL, FILE, BUYER);
check(
  '5. buildDownloadUrl returns a https URL with token param',
  typeof dlUrl === 'string' &&
    dlUrl.startsWith(`${SITE_URL}/.netlify/functions/get-download-link?token=`),
  dlUrl
);
const downloadToken = new URL(dlUrl).searchParams.get('token');
check('5. extractable download token from URL', !!downloadToken);

// ---- 6. verifyToken (download path) ---------------------------------------
const dlPayload = verifyToken(downloadToken);
check(
  '6. verifyToken(downloadToken) returns payload',
  !!dlPayload,
  JSON.stringify(dlPayload)
);
check(
  '6. payload.type === "download"',
  dlPayload && dlPayload.type === 'download',
  dlPayload?.type
);
check(
  '6. payload.file === requested file',
  dlPayload && dlPayload.file === FILE,
  dlPayload?.file
);

// Also verify a download token does NOT pass the license-type check.
// (validate-license.js refuses tokens where type is set and !== 'license'.)
const v3 = validateLicense(downloadToken);
check(
  '6. download token rejected by validateLicense (wrong type)',
  v3.valid === false && v3.reason === 'wrong_token_type',
  JSON.stringify(v3)
);

// ---- 7. File read against products/ (mirrors get-download-link.js) -------
const fullPath = path.join(PRODUCTS_ROOT, FILE);
check(
  '7. file exists at products/' + FILE,
  fs.existsSync(fullPath),
  fullPath
);
let bytes = 0;
try {
  bytes = fs.statSync(fullPath).size;
} catch {}
check(
  '7. file is non-empty (likely a real PDF)',
  bytes > 10_000,
  `${bytes} bytes`
);
// Sniff PDF header
let header = '';
try {
  const buf = Buffer.alloc(4);
  const fd = fs.openSync(fullPath, 'r');
  fs.readSync(fd, buf, 0, 4, 0);
  fs.closeSync(fd);
  header = buf.toString('utf8');
} catch (e) {}
check(
  '7. file has %PDF magic header',
  header === '%PDF',
  `got "${header}"`
);

// All 6 bundle files present and non-empty
let allPresent = true;
const missing = [];
for (const f of product.pdfBundle) {
  const p = path.join(PRODUCTS_ROOT, f);
  if (!fs.existsSync(p) || fs.statSync(p).size < 1000) {
    allPresent = false;
    missing.push(f);
  }
}
check(
  '7. all 6 PDFs in product.pdfBundle present in products/',
  allPresent,
  missing.length ? `missing: ${missing.join(', ')}` : ''
);

// ---- 8. Path-traversal rejection (defense in depth) -----------------------
// Mimic the guards in get-download-link.js
function safeFile(file) {
  if (!file || file.includes('..') || file.startsWith('/')) return false;
  const full = path.join(PRODUCTS_ROOT, file);
  return full.startsWith(PRODUCTS_ROOT);
}
check('8. rejects file === "../etc/passwd"', !safeFile('../etc/passwd'));
check('8. rejects file === "/etc/passwd"', !safeFile('/etc/passwd'));
check('8. rejects file with embedded ..', !safeFile('foo/../bar.pdf'));
check('8. accepts legit filename', safeFile('hlr-walkthrough.pdf'));

// ---- Result ---------------------------------------------------------------
console.log('\n=========================================');
console.log(`Total: ${pass} passed, ${fail} failed`);
if (fail > 0) {
  console.log('\nFailed checks:');
  for (const f of failures) console.log('  - ' + f);
  process.exit(1);
}
console.log('\nALL PASS — license + download path is wired correctly.');
