/**
 * POST /.netlify/functions/validate-license
 *
 * Frontend calls this with a license token to verify entitlement.
 * Body: { token: string, slug?: string }
 * Returns: { valid: boolean, email?, slugs?, exp?, reason? }
 */

const { validateLicense } = require('./_lib/license.js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return resp(405, { error: 'Method not allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return resp(400, { error: 'Invalid JSON' });
  }

  const { token, slug } = body;
  if (!token) return resp(400, { error: 'Missing token' });

  const result = validateLicense(token);
  if (!result.valid) {
    return resp(200, { valid: false, reason: result.reason });
  }

  if (slug && !result.payload.slugs.includes(String(slug).toLowerCase())) {
    return resp(200, {
      valid: false,
      reason: 'not_entitled',
      email: result.payload.email,
    });
  }

  return resp(200, {
    valid: true,
    email: result.payload.email,
    slugs: result.payload.slugs,
    exp: result.payload.exp,
  });
};

function resp(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}
