/**
 * POST /api/create-checkout-session
 *
 * Creates a Stripe Checkout Session dynamically from the product slug.
 * No products configured in Stripe Dashboard — line items are inline.
 *
 * Request body: { slug: string }
 * Response: { url: string, sessionId: string }
 *
 * Required env: STRIPE_SECRET_KEY, VITE_SITE_URL (or SITE_URL)
 */

const Stripe = require('stripe');
const { getProductBySlug } = require('./_lib/products-server.js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const SITE_URL =
  process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://vvvdigitals.com';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON' });
  }

  const { slug } = body;
  if (!slug) return jsonResponse(400, { error: 'Missing product slug' });

  const product = getProductBySlug(slug);
  if (!product) return jsonResponse(404, { error: 'Product not found' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: product.recurring ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.priceCents,
            product_data: {
              name: product.stripeProductName || product.name,
              description: product.tagline,
            },
            ...(product.recurring && {
              recurring: {
                interval: product.recurring.interval,
                interval_count: product.recurring.intervalCount || 1,
              },
            }),
          },
        },
      ],
      success_url: `${SITE_URL}/store/${slug}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/store/${slug}`,
      metadata: { product_slug: slug },
      ...(product.recurring && {
        subscription_data: { metadata: { product_slug: slug } },
      }),
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      customer_creation: product.recurring ? undefined : 'if_required',
      custom_text: {
        submit: {
          message:
            'Educational use only. Not legal or claims advice. 7-day refund policy at support@vvvdigitals.com.',
        },
      },
    });

    return jsonResponse(200, { url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('[create-checkout-session]', err);
    return jsonResponse(500, {
      error: 'Failed to create checkout session',
      detail: err.message,
    });
  }
};

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}
