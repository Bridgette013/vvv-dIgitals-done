# Deploy Runbook — VVV Digitals Store + VA Toolkit

One-page reference for taking the store from "code on `main`" to "buyers can purchase and download." Domain is **vvvdigitals.com**, already live in Netlify.

---

## 1. Generate the license signing secret (do this once, never rotate casually)

```bash
openssl rand -hex 32
```

Copy the 64-char output. This becomes `LICENSE_HMAC_SECRET` in Netlify. If you ever change this value, **every license token you've issued becomes invalid** — buyers lose calculator access and download links break. Keep a copy in a password manager.

---

## 2. Set Netlify environment variables

**Netlify Dashboard → vvvdigitals.com site → Site settings → Environment variables → Add variable**

### Required

| Variable | Value | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` (testing) or `sk_live_…` (production) | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | From Stripe webhook setup, step 3 below |
| `SENDGRID_API_KEY` | `SG.…` | SendGrid → Settings → API Keys → create with "Full Access" or scoped to Mail Send |
| `SENDGRID_FROM_EMAIL` | `support@vvvdigitals.com` | Domain `vvvdigitals.com` is already domain-authenticated in SendGrid, so any `@vvvdigitals.com` address works |
| `LICENSE_HMAC_SECRET` | 64-char hex from step 1 | Never rotate without re-issuing all customer licenses |
| `SITE_URL` | `https://vvvdigitals.com` | No trailing slash |

### Optional (defaults work)

| Variable | Default |
|---|---|
| `SENDGRID_FROM_NAME` | `VVV Digitals` |
| `SUPPORT_EMAIL` | `support@vvvdigitals.com` |

### Scope each variable

Set scope to **All deploy contexts** unless you want different keys per branch (e.g. `sk_test_…` on deploy previews, `sk_live_…` on production). For first launch, all-contexts is simplest.

---

## 3. Register the Stripe webhook

**Stripe Dashboard → Developers → Webhooks (or "Event destinations") → Add endpoint**

| Field | Value |
|---|---|
| Endpoint URL | `https://vvvdigitals.com/.netlify/functions/stripe-webhook` |
| Events to send | `checkout.session.completed` (only this one — adding more is fine, the handler ignores them) |
| Payload style | Snapshot (default) |
| API version | Whatever Stripe defaults to is fine |

After saving, click into the endpoint and **Reveal signing secret**. Copy the `whsec_…` value and paste it into Netlify env var `STRIPE_WEBHOOK_SECRET` (step 2). Save the Netlify env var.

---

## 4. SendGrid sender verification

**Already done** — `vvvdigitals.com` is domain-authenticated in SendGrid, so any `@vvvdigitals.com` address (`support@`, `store@`, `hello@`, etc.) can send without further setup.

If you ever change the SendGrid account or rotate the domain authentication: see SendGrid → Settings → Sender Authentication. Without an authenticated sender, delivery emails fail silently — the Stripe webhook returns 200, but nothing reaches the buyer's inbox.

---

## 5. Trigger a deploy

Two ways:

- **Easy:** Netlify Dashboard → Deploys → Trigger deploy → Deploy site.
- **Automatic:** push any commit to `main`. Netlify auto-deploys from `main` (your existing setup).

The deploy runs `npm run build`, which now also runs `npm run sync:products` first. That regenerates `netlify/functions/_lib/products-server.js` from `src/config/products.js`, then builds the Vite SPA into `dist/`, then bundles the 6 PDFs in `products/` into the function package.

Watch the deploy logs. Build should finish in ~30–60 seconds.

---

## 6. Smoke-test in production (use Stripe TEST mode)

While `STRIPE_SECRET_KEY=sk_test_…`, run this end-to-end:

1. **Visit** `https://vvvdigitals.com/store` — store landing page renders with the VA Toolkit card.
2. **Click into** `https://vvvdigitals.com/store/va-toolkit` — pricing shows $39, "Buy now" button visible.
3. **Click Buy now** — redirects to Stripe Checkout (hosted page).
4. **Pay with test card:** `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP, any email you control.
5. **Land on** `https://vvvdigitals.com/store/va-toolkit/thank-you?session_id=cs_test_…` — "You're in." confirmation.
6. **Within ~1 min, check the email inbox** — you should receive a `Your VA Benefits Decision Toolkit is ready` email with:
   - One "Calculator access" link (calculator URL + `?license=…`)
   - Six download links (one per PDF)
   - The license token in a code block (fallback)
7. **Click the calculator link** — URL should briefly contain `?license=…`, then strip itself. The calculator page should load with the live decision tree.
8. **Click any PDF download link** — PDF should download (e.g. `hlr-walkthrough.pdf`).
9. **Close the browser, reopen, navigate directly to** `https://vvvdigitals.com/tools/va-calculator` (no `?license=…`) — calculator should still load because the token is now in `localStorage` under `vvv_license_va-toolkit`.

If any step fails, check **Netlify Dashboard → Functions** — every function logs invocations there. Common failure modes are at the bottom of this doc.

---

## 7. Flip to LIVE mode

When the test purchase works end-to-end:

1. **Stripe Dashboard** → top-right toggle from **Test mode** to **Live mode**.
2. **Developers → API keys** → copy the live `sk_live_…` secret key.
3. **Netlify env vars** → update `STRIPE_SECRET_KEY` to `sk_live_…`.
4. **Stripe live mode → Webhooks** → repeat step 3 of this runbook in live mode (live mode has its own webhook list and its own signing secret). Update `STRIPE_WEBHOOK_SECRET` in Netlify.
5. **Trigger deploy** in Netlify (env changes don't apply to already-running functions).
6. Run one real purchase with a real card on yourself to confirm — refund yourself in Stripe Dashboard afterwards.

---

## When something changes

### Adding a new product or changing a price

1. Edit `src/config/products.js`.
2. Commit + push to `main`.
3. Netlify auto-deploys. `npm run build` regenerates the server-side mirror automatically.

**No Stripe Dashboard changes needed.** Prices are inline in checkout sessions.

### Updating a PDF

1. Edit the source markdown in `vvv-store/pdfs/`.
2. Run `npm run render:pdfs` locally to regenerate the PDF.
3. Commit both the `.md` change and the regenerated `.pdf` in `products/`.
4. Push. Netlify redeploys with the new PDF bundled into the function.

### Annual VA rate update (each Dec 1)

1. Open `src/lib/va-rates.js`.
2. Update `VA_BASE_RATES_2026` and `VA_DEPENDENT_ADDITIONS_2026` against [VA's published rates](https://www.va.gov/disability/compensation-rates/veteran-rates/).
3. Rename the constants to the new year (e.g. `VA_BASE_RATES_2027`). Update the import in `va-calculator.js` too. Grep for the old year to catch stragglers.
4. Update the comment headers with the new effective dates.
5. Commit, push, deploy.

### Re-sending a buyer's delivery email

Quickest path: **Stripe Dashboard → Developers → Webhooks → click the endpoint → find the `checkout.session.completed` event → "Send" or "Resend"**. The webhook handler is idempotent at the email level (it just sends another email; doesn't double-charge or re-issue duplicate licenses since the same email gets the same signed token).

If the original Stripe event has aged out (90 days), look up the session by email in Stripe and manually trigger a test event with the same session ID.

### Issuing a refund

1. **Stripe Dashboard** → find the payment → Refund.
2. **Email the buyer** at `support@vvvdigitals.com` confirming the refund.
3. **Optional:** revoke the license. There's no revocation endpoint built yet — for v1, the license stays valid until natural expiry (1 year from issue). Refund volume is expected to be low; build a revocation flow if it becomes a pattern.

---

## Common failure modes (check function logs first)

| Symptom | Likely cause | Where to look |
|---|---|---|
| Buyer clicks "Buy now" and nothing happens | Browser console shows `500` from create-checkout-session | Netlify Functions log for `create-checkout-session` — usually `STRIPE_SECRET_KEY` missing or wrong mode |
| Payment succeeds but no email arrives | SendGrid sender not verified, or `SENDGRID_API_KEY` missing | Netlify Functions log for `stripe-webhook` — look for `[webhook] SENDGRID_API_KEY not set` |
| Payment succeeds, but email links 404 | `SITE_URL` env var wrong | Netlify env vars — must be `https://vvvdigitals.com` |
| Buyer opens calculator link, sees "Access required" | Token in URL is invalid OR `LICENSE_HMAC_SECRET` changed since the token was issued | If the secret was rotated, all old tokens are dead. Re-trigger the Stripe webhook to issue a fresh token. |
| Stripe shows "Webhook returned 400" | `STRIPE_WEBHOOK_SECRET` mismatch — usually because you copied the test-mode secret into a live deploy or vice versa | Stripe Dashboard → Webhooks → endpoint → "Signing secret" — confirm it matches Netlify env var for the correct mode |
| PDFs download as 0 bytes or "File not found" | `products/` directory wasn't bundled into the function | Check Netlify deploy log — should mention `included_files = ["products/**"]`. Confirm `npm run render:pdfs` was run before commit. |

---

## Health check

You can run this anytime from your laptop to confirm the license + download path is wired correctly without spending Stripe API calls:

```bash
node scripts/smoke-license-flow.cjs
```

Should print `Total: 23 passed, 0 failed`. If it fails, something local is wrong (usually a missing dep or a renamed product slug) — don't deploy until it passes.

---

## Quick reference

**Webhook URL** (production):
`https://vvvdigitals.com/.netlify/functions/stripe-webhook`

**The 6 env vars Netlify needs:**
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `LICENSE_HMAC_SECRET`, `SITE_URL`

**Test card for Stripe Checkout test mode:**
`4242 4242 4242 4242` · any future expiry · any CVC · any ZIP
