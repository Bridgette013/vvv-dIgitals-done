/**
 * License + Download token utility (CommonJS, Netlify Functions context)
 *
 * Two token types signed with HMAC-SHA256:
 *
 *   LICENSE TOKEN — long-lived (1 year default), bound to buyer email + product slugs
 *     Format: base64url(payload).base64url(sig)
 *     Payload: { type: 'license', email, slugs: [...], iat, exp }
 *     Used for: unlocking gated tools (e.g. /tools/va-calculator)
 *
 *   DOWNLOAD TOKEN — short-lived (7 days default), bound to a single file
 *     Format: base64url(payload).base64url(sig)
 *     Payload: { type: 'download', file, email, iat, exp }
 *     Used for: signed PDF download links in delivery email
 *
 * Both use the same HMAC secret (LICENSE_HMAC_SECRET) and signing scheme.
 */

const crypto = require('crypto');

const SECRET =
  process.env.LICENSE_HMAC_SECRET || process.env.LICENSE_SIGNING_SECRET;

if (!SECRET) {
  console.warn(
    '[license] LICENSE_HMAC_SECRET not set — token issuance will fail'
  );
}

const ONE_YEAR = 60 * 60 * 24 * 365;
const SEVEN_DAYS = 60 * 60 * 24 * 7;

function b64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function b64urlDecode(str) {
  let s = String(str).replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64');
}

function signPayload(payloadObj) {
  const payloadB64 = b64url(JSON.stringify(payloadObj));
  const sig = crypto.createHmac('sha256', SECRET).update(payloadB64).digest();
  return `${payloadB64}.${b64url(sig)}`;
}

function verifyAndDecode(token) {
  if (!SECRET) return null;
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  const expected = crypto.createHmac('sha256', SECRET).update(payloadB64).digest();
  let given;
  try {
    given = b64urlDecode(sigB64);
  } catch {
    return null;
  }
  if (
    expected.length !== given.length ||
    !crypto.timingSafeEqual(expected, given)
  ) {
    return null;
  }
  let payload;
  try {
    payload = JSON.parse(b64urlDecode(payloadB64).toString('utf8'));
  } catch {
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) return null;
  return payload;
}

// ============================================================
// LICENSE TOKENS
// ============================================================

function issueLicense(email, slugs, ttlSeconds = ONE_YEAR) {
  if (!SECRET) throw new Error('LICENSE_HMAC_SECRET not configured');
  const now = Math.floor(Date.now() / 1000);
  return signPayload({
    type: 'license',
    email: String(email).toLowerCase().trim(),
    slugs: slugs.map((s) => String(s).toLowerCase()),
    iat: now,
    exp: now + ttlSeconds,
  });
}

function validateLicense(token) {
  const payload = verifyAndDecode(token);
  if (!payload) return { valid: false, reason: 'invalid_or_expired' };
  if (payload.type && payload.type !== 'license') {
    return { valid: false, reason: 'wrong_token_type' };
  }
  return { valid: true, payload };
}

// ============================================================
// DOWNLOAD TOKENS
// ============================================================

function issueDownloadToken(file, email, ttlSeconds = SEVEN_DAYS) {
  if (!SECRET) throw new Error('LICENSE_HMAC_SECRET not configured');
  const now = Math.floor(Date.now() / 1000);
  return signPayload({
    type: 'download',
    file,
    email: String(email).toLowerCase().trim(),
    iat: now,
    exp: now + ttlSeconds,
  });
}

function verifyToken(token) {
  // Returns the payload if valid (any token type), or null
  return verifyAndDecode(token);
}

function buildDownloadUrl(siteUrl, file, email, ttlSeconds = SEVEN_DAYS) {
  const token = issueDownloadToken(file, email, ttlSeconds);
  return `${siteUrl}/.netlify/functions/get-download-link?token=${encodeURIComponent(token)}`;
}

module.exports = {
  // License API
  issueLicense,
  validateLicense,
  // Download API
  issueDownloadToken,
  verifyToken,
  buildDownloadUrl,
};
