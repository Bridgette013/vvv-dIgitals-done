/**
 * Client-side license helper.
 *
 * - Reads license from URL (?license=...) on tool page entry
 * - Falls back to localStorage (per-slug key: vvv_license_<slug>)
 * - Calls /api/validate-license to verify before unlocking gated UI
 * - Persists validated license to localStorage for return visits
 * - Strips the ?license= param from history once validated
 *
 * Storage scheme: ONE key per product slug — `vvv_license_<slug>`.
 * A single user can hold multiple entitlements simultaneously without
 * one overwriting another.
 */

const storageKey = (slug) => `vvv_license_${slug}`;

export function readLicenseFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('license');
}

export function readLicenseFromStorage(slug) {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(storageKey(slug));
  } catch {
    return null;
  }
}

export function persistLicense(slug, token) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(slug), token);
  } catch {
    // ignore (private browsing, etc.)
  }
}

export function clearLicense(slug) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(storageKey(slug));
  } catch {
    // ignore
  }
}

/**
 * Validate a license against the backend.
 * @param {string} token
 * @param {string} slug — required entitlement slug
 * @returns {Promise<{ valid: boolean, email?: string, reason?: string }>}
 */
export async function validateLicense(token, slug) {
  if (!token) return { valid: false, reason: 'missing_token' };
  try {
    const res = await fetch('/.netlify/functions/validate-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, slug }),
    });
    if (!res.ok) return { valid: false, reason: `http_${res.status}` };
    return await res.json();
  } catch {
    return { valid: false, reason: 'network_error' };
  }
}

/**
 * Composed flow: find a license (URL or storage), validate it server-side,
 * persist on success, and strip the URL param so the token doesn't sit in
 * browser history / Referer headers.
 *
 * @param {string} slug
 * @returns {Promise<{ valid: boolean, email?: string, reason?: string }>}
 */
export async function resolveLicense(slug) {
  const fromUrl = readLicenseFromUrl();
  const fromStorage = readLicenseFromStorage(slug);
  const token = fromUrl || fromStorage;
  if (!token) return { valid: false, reason: 'no_license' };

  const result = await validateLicense(token, slug);
  if (result.valid) {
    persistLicense(slug, token);
    if (fromUrl && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('license');
      window.history.replaceState({}, '', url.toString());
    }
  }
  return result;
}
