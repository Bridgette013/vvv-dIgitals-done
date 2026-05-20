import { useParams, Navigate } from "react-router-dom";
import { getProductBySlug } from "../config/products";
import BuyButton from "../components/store/BuyButton";

/**
 * /store/:slug — product detail page.
 *
 * Reusable template: any product in products.js renders here automatically.
 *
 * Layout: editorial single-column with sticky pricing rail on desktop.
 * Pricing block intentionally bold — the conversion driver.
 */
export default function ProductPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  if (!product) {
    return <Navigate to="/store" replace />;
  }

  const priceDisplay = formatPrice(product.priceCents, product.currency);
  const isLive = product.status === "live";

  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-8 text-xs uppercase tracking-[0.3em] text-stone-500">
        <a href="/store" className="hover:text-amber-700">Store</a>
        <span className="mx-2">/</span>
        <span className="text-stone-900">{product.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-12">
          <header>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-4">
              {product.category?.replace(/-/g, " ") || "Digital toolkit"}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl leading-[1.0] mb-6">
              {product.name}
            </h1>
            <p className="text-xl leading-relaxed text-stone-700">
              {product.tagline}
            </p>
          </header>

          {/* Image */}
          {product.image && (
            <div className="aspect-[16/10] border-2 border-stone-900 overflow-hidden">
              <img
                src={product.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* What's inside */}
          {product.bullets && product.bullets.length > 0 && (
            <section>
              <h2 className="font-serif text-3xl mb-6 border-b border-stone-300 pb-3">
                What's inside
              </h2>
              <ul className="space-y-4">
                {product.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex gap-4 leading-relaxed text-stone-800"
                  >
                    <span className="text-amber-700 font-mono text-sm pt-1 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Description */}
          <section>
            <h2 className="font-serif text-3xl mb-6 border-b border-stone-300 pb-3">
              Overview
            </h2>
            <p className="text-stone-800 leading-relaxed">
              {product.description}
            </p>
          </section>

          {/* Disclaimers */}
          {product.disclaimers && product.disclaimers.length > 0 && (
            <section className="bg-stone-100 border-l-4 border-amber-700 p-6">
              <h3 className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-4">
                Important
              </h3>
              <ul className="space-y-2 text-sm text-stone-700">
                {product.disclaimers.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sticky purchase rail */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-8 bg-stone-900 text-stone-50 p-8 border-2 border-stone-900">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-4">
              {product.recurring ? "Subscription" : "One-time purchase"}
            </p>
            <div className="font-mono text-5xl mb-2">{priceDisplay}</div>
            {product.recurring && (
              <p className="text-stone-400 text-sm mb-6">
                per {product.recurring.interval}
              </p>
            )}

            <div className="my-8 border-t border-stone-700" />

            {isLive ? (
              <BuyButton
                slug={product.slug}
                className="w-full bg-amber-700 border-amber-700 text-stone-50 hover:bg-stone-50 hover:text-stone-900 hover:border-stone-50"
              >
                Buy now
              </BuyButton>
            ) : (
              <button
                disabled
                className="w-full px-8 py-4 bg-stone-700 text-stone-300 uppercase tracking-widest text-sm font-semibold cursor-not-allowed"
              >
                Coming soon
              </button>
            )}

            <ul className="mt-8 space-y-3 text-sm text-stone-300">
              <li className="flex gap-3">
                <span className="text-amber-500">→</span>
                Instant delivery to your inbox
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500">→</span>
                Lifetime access to current version
              </li>
              {product.toolAccess && (
                <li className="flex gap-3">
                  <span className="text-amber-500">→</span>
                  Includes access to interactive tool
                </li>
              )}
              <li className="flex gap-3">
                <span className="text-amber-500">→</span>
                Secure checkout via Stripe
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatPrice(cents, currency) {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
  }).format(dollars);
}
