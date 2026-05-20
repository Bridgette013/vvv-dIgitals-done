import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getProductBySlug } from '../../config/products.js';
import Disclaimer from '../../components/store/Disclaimer.jsx';

/**
 * /store/:slug/thank-you?session_id=cs_xxx
 *
 * Stripe redirects buyers here after successful checkout.
 * No critical logic runs here — the actual entitlement is delivered via the
 * webhook → email pipeline. This page just confirms and reassures.
 */
export default function ThankYou() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const product = getProductBySlug(slug);
  const [showFallback, setShowFallback] = useState(false);

  // After 90s, if the email hasn't arrived, surface a fallback message.
  useEffect(() => {
    const t = setTimeout(() => setShowFallback(true), 90_000);
    return () => clearTimeout(t);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 flex items-center justify-center px-6">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="max-w-2xl mx-auto px-6 md:px-12 py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-4">
          Order confirmed
        </p>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-6">
          You're in.
        </h1>
        <p className="text-lg text-stone-700 leading-relaxed mb-8">
          Thank you for purchasing the <strong>{product.name}</strong>. Your
          delivery email is on its way — usually within a minute or two.
        </p>

        <div className="bg-white border border-stone-200 p-8 mb-8">
          <h2 className="font-serif text-xl mb-4">What happens next</h2>
          <ol className="space-y-4 text-stone-800">
            <li className="flex gap-4">
              <span className="text-amber-700 font-mono text-sm pt-1 shrink-0">
                01
              </span>
              <span>
                Check your inbox for an email from{' '}
                <strong>support@vvvdigitals.com</strong>. (Check spam if you
                don't see it.)
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-amber-700 font-mono text-sm pt-1 shrink-0">
                02
              </span>
              <span>
                The email contains your license key, signed download links for
                all six PDFs, and a one-click access link to the calculator.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-amber-700 font-mono text-sm pt-1 shrink-0">
                03
              </span>
              <span>
                Bookmark the calculator link — your license is attached, so you
                won't need to log in.
              </span>
            </li>
          </ol>
        </div>

        {showFallback && (
          <div className="bg-amber-50 border border-amber-200 p-6 mb-8">
            <p className="text-sm text-amber-900">
              <strong>Email not arriving?</strong> Reach out to{' '}
              <a
                href="mailto:support@vvvdigitals.com"
                className="underline"
              >
                support@vvvdigitals.com
              </a>
              {sessionId && (
                <>
                  {' '}with reference{' '}
                  <code className="text-xs bg-white px-2 py-0.5 rounded">
                    {sessionId.slice(0, 16)}…
                  </code>
                </>
              )}{' '}
              and we'll resend within the hour.
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Link
            to="/store"
            className="text-sm uppercase tracking-widest border-b border-stone-900 pb-0.5 hover:text-amber-700 hover:border-amber-700"
          >
            ← Back to store
          </Link>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
