/**
 * VVV Digitals Store — Product Catalog
 *
 * Single source of truth. Add a product = add an object to PRODUCTS array.
 * Stripe Dashboard stays clean — line items are inline at checkout.
 *
 * Schema:
 *   slug              — URL slug for /store/<slug>
 *   name              — public product name
 *   tagline           — one-liner for cards / hero
 *   description       — long-form for product page
 *   category          — 'va-claims' | 'identity' | etc. (display label)
 *   priceCents        — price in cents (3900 = $39.00)
 *   currency          — 'usd'
 *   recurring         — null | { interval: 'month' | 'year', intervalCount: 1 }
 *   stripeProductName — what appears on Stripe checkout / receipt (neutralized)
 *   pdfBundle         — PDF filenames delivered after purchase
 *   toolAccess        — license-gated tool route (or null)
 *   bullets           — feature bullets shown on product page
 *   faq               — Q/A pairs for FAQ section
 *   disclaimers       — compliance disclaimers shown on product page
 *   status            — 'live' | 'coming_soon' | 'archived'
 *   image             — hero image URL (optional)
 *   launchDate        — ISO date for sorting
 *   badges            — display badges ('New', 'Updated', etc.)
 */

export const PRODUCTS = [
  {
    slug: 'va-toolkit',
    name: 'VA Benefits Decision Toolkit',
    tagline:
      'Navigate your VA claim like the pros — without paying 25% of your retro to one.',
    description:
      'An interactive calculator and template pack for veterans navigating Higher-Level Reviews, Supplemental Claims, and effective date corrections. Built by a veteran who used these exact tools on her own claim.',
    category: 'va-claims',
    priceCents: 3900,
    currency: 'usd',
    recurring: null,
    stripeProductName: 'VVV Digitals — Educational Toolkit',
    pdfBundle: [
      'hlr-walkthrough.pdf',
      'supplemental-claim-walkthrough.pdf',
      'effective-date-playbook.pdf',
      'decision-tree-cheat-sheet.pdf',
      'evidence-tracker.pdf',
      'va-terms-glossary.pdf',
    ],
    toolAccess: '/tools/va-calculator',
    bullets: [
      'Interactive effective date calculator (ITF logic + 1-year backdating)',
      'Retro pay estimator (rate × months × dependents + SMC modifier)',
      'HLR vs Supplemental Claim decision tree',
      'Form 20-0996 (HLR) step-by-step walkthrough PDF',
      'Form 20-0995 (Supplemental) step-by-step walkthrough PDF',
      'Effective date correction playbook with sample personal statement language',
      'One-page decision tree cheat sheet',
      'Evidence tracker template for organizing your C-file',
      'Plain-English glossary of VA terms',
    ],
    faq: [
      {
        q: 'Is this legal advice?',
        a: 'No. This toolkit is educational only. Not legal or claims advice. Not affiliated with the U.S. Department of Veterans Affairs.',
      },
      {
        q: 'Can you file my claim for me?',
        a: 'No. Federal law (38 U.S.C. § 5901–5905) restricts paid claim representation to accredited attorneys, claims agents, and VSOs. This toolkit equips you to file your own claim with confidence.',
      },
      {
        q: 'How accurate is the retro pay calculator?',
        a: 'It uses current VA disability rate tables and standard effective date rules. Results are estimates only. Always verify final figures with VA before relying on them.',
      },
      {
        q: 'How do I get the toolkit after purchase?',
        a: 'Immediately after checkout you receive an email with your license key, signed download links for all six PDFs, and access to the calculator. Links are valid for 7 days; request fresh links anytime.',
      },
      {
        q: 'What is the refund policy?',
        a: 'Full refund within 7 days of purchase if the toolkit does not meet your needs. Contact support@vvvdigitals.com.',
      },
    ],
    disclaimers: [
      'Educational use only. Not legal or claims advice.',
      'Not affiliated with the U.S. Department of Veterans Affairs.',
      'All calculator outputs are estimates. Verify with VA before filing.',
      'VVV Digitals is not an accredited VA claims agent.',
    ],
    status: 'live',
    image: null,
    launchDate: '2026-05-09',
    badges: ['New'],
  },
];

// ----- helper exports (multiple aliases for downstream component flexibility) -----
export const products = PRODUCTS;
export const getProductBySlug = (slug) => PRODUCTS.find((p) => p.slug === slug);
export const getLiveProducts = () =>
  PRODUCTS.filter((p) => p.status === 'live').sort(
    (a, b) => new Date(b.launchDate) - new Date(a.launchDate)
  );
export const getActiveProducts = getLiveProducts;

export const formatPrice = (cents, currency = 'usd') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
