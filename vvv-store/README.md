# VVV Digitals Store — Integration Package

Drop-in storefront for **vvvdigitals.com/store** with dynamic Stripe checkout, license-gated tools, signed PDF delivery, and a working VA Benefits Calculator.

Built for the existing VVV Digitals stack: **React + Vite + Tailwind + Netlify + Stripe + SendGrid**.

---

## What's in here

```
vvv-store/
├── src/
│   ├── config/
│   │   └── products.js                    # single source of truth for catalog
│   ├── components/store/
│   │   ├── BuyButton.jsx                  # triggers Stripe checkout
│   │   ├── ProductCard.jsx                # store grid card
│   │   ├── LicenseGate.jsx                # wraps gated routes
│   │   └── Disclaimer.jsx                 # site-wide compliance disclaimer
│   ├── lib/
│   │   ├── va-rates.js                    # VA disability rate tables
│   │   ├── va-calculator.js               # effective date + retro pay math
│   │   └── license-client.js              # client-side license helper
│   └── pages/
│       ├── Store.jsx                      # /store landing page
│       ├── ProductPage.jsx                # /store/:slug product detail
│       ├── store/ThankYou.jsx             # /store/:slug/thank-you
│       └── tools/VaCalculator.jsx         # /tools/va-calculator (gated)
│
├── netlify/
│   └── functions/
│       ├── create-checkout-session.js     # creates dynamic Stripe sessions
│       ├── stripe-webhook.js              # handles checkout.session.completed
│       ├── validate-license.js            # API for client license validation
│       ├── get-download-link.js           # serves signed PDF downloads
│       └── _lib/
│           ├── license.js                 # HMAC license + download tokens
│           ├── products-server.js         # CommonJS mirror of products.js
│           └── email-templates.js         # SendGrid receipt template
│
├── pdfs/                                  # markdown drafts of the 6 PDFs
│   ├── hlr-walkthrough.md
│   ├── supplemental-claim-walkthrough.md
│   ├── effective-date-playbook.md
│   ├── decision-tree-cheat-sheet.md
│   ├── evidence-tracker.md
│   └── va-terms-glossary.md
│
├── netlify.toml                           # routing + function config
├── package.dependencies.json              # deps to add to your project
├── .env.example                           # required env vars
└── README.md                              # this file
```

---

## Deployment checklist (in order)

### 1 · Drop the files into your existing project
```bash
# From your vvvdigitals.com project root:
cp -r /path/to/vvv-store/src/* ./src/
cp -r /path/to/vvv-store/netlify/* ./netlify/
cp /path/to/vvv-store/netlify.toml ./
cp /path/to/vvv-store/.env.example ./.env.example
```
If `netlify.toml` already exists, **merge** the new sections rather than overwriting.

### 2 · Install deps
```bash
npm install stripe @sendgrid/mail react-router-dom
```

### 3 · Add routes to your existing React Router config
```jsx
import Store from "./pages/Store";
import ProductPage from "./pages/ProductPage";
import ThankYou from "./pages/store/ThankYou";
import VaCalculator from "./pages/tools/VaCalculator";
import LicenseGate from "./components/store/LicenseGate";

// inside <Routes>
<Route path="/store" element={<Store />} />
<Route path="/store/:slug" element={<ProductPage />} />
<Route path="/store/:slug/thank-you" element={<ThankYou />} />
<Route
  path="/tools/va-calculator"
  element={
    <LicenseGate slug="va-toolkit">
      <VaCalculator />
    </LicenseGate>
  }
/>
```

### 4 · Generate signing secrets
```bash
openssl rand -hex 32   # use this for LICENSE_HMAC_SECRET
```

### 5 · Set environment variables in Netlify
Site settings → Environment variables. Required:

| Variable | Source |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks (after step 6) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API keys |
| `SENDGRID_API_KEY` | SendGrid → Settings → API Keys |
| `SENDGRID_FROM_EMAIL` | `support@vvvdigitals.com` (must be verified sender) |
| `SENDGRID_FROM_NAME` | `VVV Digitals` |
| `LICENSE_HMAC_SECRET` | Output of `openssl rand -hex 32` |
| `VITE_SITE_URL` | `https://vvvdigitals.com` |
| `SUPPORT_EMAIL` | `support@vvvdigitals.com` |

### 6 · Configure the Stripe webhook
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://vvvdigitals.com/.netlify/functions/stripe-webhook`
3. Events to send: **`checkout.session.completed`** (just that one)
4. After creating, copy the signing secret → set as `STRIPE_WEBHOOK_SECRET` in Netlify
5. Also set the merchant business description in Stripe to **"Digital educational products"** (neutral framing)

### 7 · Verify SendGrid sender
- SendGrid → Settings → Sender Authentication
- Verify `support@vvvdigitals.com` (or domain authenticate `vvvdigitals.com` for better deliverability)

### 8 · Drop final PDFs into `/products/` at repo root
The markdown drafts in `pdfs/` need to become real PDFs. Workflow:
1. Edit the markdown drafts (add your voice, anecdotes, polish)
2. Convert to PDF (Pandoc, Google Docs export, or any markdown→PDF tool)
3. Save final PDFs to `/products/` at the repo root with these exact filenames:
   - `hlr-walkthrough.pdf`
   - `supplemental-claim-walkthrough.pdf`
   - `effective-date-playbook.pdf`
   - `decision-tree-cheat-sheet.pdf`
   - `evidence-tracker.pdf`
   - `va-terms-glossary.pdf`

The download function bundles `/products/**` into the function package via `netlify.toml`.

### 9 · Test in Stripe test mode first
1. Set `STRIPE_SECRET_KEY` to a `sk_test_…` key
2. Run a $0.01 test purchase through `/store/va-toolkit`
3. Check that:
   - You're redirected to Stripe Checkout
   - Payment completes
   - You land on `/store/va-toolkit/thank-you`
   - The webhook fires (Stripe Dashboard → Webhooks → check delivery log)
   - SendGrid sends the email (SendGrid → Activity)
   - Download links open the PDFs
   - The calculator link unlocks the tool
4. Then switch to live keys.

### 10 · Pre-launch legal review
Before going live: pay a vet-law attorney $200 to review the product page copy, FAQ, and disclaimers. Specifically validate:
- VA accreditation framing (no claims agent / representation language)
- FTC outcome guarantees (no "we'll get you" copy)
- Refund policy is enforceable
- Stripe merchant description aligns with sold goods

---

## Operational notes

### Adding a new product later
1. Add the product object to `src/config/products.js`
2. Mirror it in `netlify/functions/_lib/products-server.js`
3. Drop PDFs into `/products/`
4. (Optional) Add a license-gated route + `<LicenseGate>` wrap
5. Deploy

**No Stripe Dashboard changes needed.** All product data lives in code.

### Updating VA rates each Dec 1
Open `src/lib/va-rates.js`. Update the `VA_BASE_RATES_2026` and `VA_DEPENDENT_ADDITIONS_2026` constants against [VA's published rate tables](https://www.va.gov/disability/compensation-rates/veteran-rates/). Rename the constants to match the new rate year (e.g. `_2027`) when you do, and grep the repo for any remaining references to the old year.

### Refunds and re-sending links
- Refund: do it in Stripe Dashboard, then email the buyer
- Re-send links: the simplest path is to manually re-trigger the webhook from Stripe (Webhooks → Send test → checkout.session.completed for the original session). For v2, build an `/account/resend` endpoint.

---

## Compliance baked in

- **Stripe products are dynamic.** No VA-themed catalog in your Stripe Dashboard. The Stripe receipt shows "VVV Digitals — Educational Toolkit" (`stripeProductName` in products.js).
- **Disclaimers render on:** product page, calculator banner, calculator footer, every PDF, every email.
- **Zero PII storage.** Calculator runs client-side. No database, no user accounts.
- **Download links expire** (default 7 days) and are HMAC-signed.
- **License tokens are HMAC-signed** and slug-bound — one product's license can't unlock another.

---

## Risk items still open

- [ ] **Pre-launch legal review** ($200, vet-law attorney) — before going live
- [ ] **PayPal backup processor** — wire as a parallel BuyButton variant if Stripe pattern-matches the product as risky
- [ ] **E&O insurance** ($300–600/yr) — once revenue justifies, before you're past 50 sales
- [ ] **Audit log** — current logging is `console.log` to Netlify Function logs. For v2, write download events to a database for audit trail.

---

## VVV Digitals · Glendale, AZ
**Educational use only. Not legal or claims advice. Not affiliated with the U.S. Department of Veterans Affairs.**
