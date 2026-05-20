/**
 * POST /.netlify/functions/stripe-webhook
 *
 * Handles Stripe webhook events. Primary: checkout.session.completed.
 * On successful payment:
 *   1. Look up product from session metadata.product_slug
 *   2. Issue HMAC license token for the buyer (email + slug entitlement)
 *   3. Generate signed 7-day download URLs for each PDF
 *   4. Send delivery email via SendGrid
 *
 * Stripe webhook setup:
 *   Dashboard → Developers → Webhooks → Add endpoint
 *   URL: https://vvvdigitals.com/.netlify/functions/stripe-webhook
 *   Events: checkout.session.completed
 *   Copy signing secret → STRIPE_WEBHOOK_SECRET
 *
 * Required env:
 *   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 *   SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, (SENDGRID_FROM_NAME)
 *   LICENSE_HMAC_SECRET
 *   SITE_URL (or VITE_SITE_URL)
 */

const Stripe = require('stripe');
const sgMail = require('@sendgrid/mail');
const { getProductBySlug } = require('./_lib/products-server.js');
const { issueLicense, buildDownloadUrl } = require('./_lib/license.js');
const { renderReceiptEmail } = require('./_lib/email-templates.js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const SITE_URL =
  process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://vvvdigitals.com';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  if (!sig) return { statusCode: 400, body: 'Missing signature' };

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[webhook] sig verification failed:', err.message);
    return { statusCode: 400, body: `Webhook signature failed: ${err.message}` };
  }

  try {
    if (stripeEvent.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(stripeEvent.data.object);
    }
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('[webhook] handler error:', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};

async function handleCheckoutCompleted(session) {
  const slug = session.metadata?.product_slug;
  if (!slug) {
    console.error('[webhook] no product_slug in metadata');
    return;
  }
  const product = getProductBySlug(slug);
  if (!product) {
    console.error('[webhook] product not found:', slug);
    return;
  }

  const email =
    session.customer_details?.email || session.customer_email || '';
  if (!email) {
    console.error('[webhook] no customer email on session', session.id);
    return;
  }

  const customerName = session.customer_details?.name || 'Veteran';
  const licenseToken = issueLicense(email, [slug]);

  const downloads = (product.pdfBundle || []).map((filename) => ({
    filename,
    url: buildDownloadUrl(SITE_URL, filename, email),
  }));

  const toolUrl = product.toolAccess
    ? `${SITE_URL}${product.toolAccess}?license=${encodeURIComponent(licenseToken)}`
    : null;

  const { subject, html, text } = renderReceiptEmail({
    customerName,
    productName: product.name,
    downloads,
    toolUrl,
    licenseToken,
    siteUrl: SITE_URL,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@vvvdigitals.com',
  });

  if (!process.env.SENDGRID_API_KEY) {
    console.warn('[webhook] SENDGRID_API_KEY not set — would have emailed', {
      to: email,
      subject,
    });
    return;
  }

  await sgMail.send({
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || 'support@vvvdigitals.com',
      name: process.env.SENDGRID_FROM_NAME || 'VVV Digitals',
    },
    subject,
    html,
    text,
  });

  console.log('[webhook] delivery sent', {
    slug,
    email,
    sessionId: session.id,
  });
}
