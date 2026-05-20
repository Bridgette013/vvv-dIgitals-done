import { getLiveProducts, products as allProducts } from "../config/products";
import ProductCard from "../components/store/ProductCard";

/**
 * /store — store landing page.
 *
 * Editorial layout: oversized typography, asymmetric grid, dominant black-and-cream
 * with copper accent. Veteran-rooted gravitas without being military-cliche.
 *
 * Style note: this is intentionally restrained so it absorbs into your existing
 * VVV Digitals brand. Restyle via tailwind.config.js theme tokens — colors used:
 *   stone-50/900 (cream + ink)
 *   amber-700 (copper accent)
 * Swap to your own brand palette by changing those classes globally, or add
 * a CSS variable layer.
 */
export default function Store() {
  const live = getLiveProducts();
  const upcoming = allProducts.filter((p) => p.status === "coming_soon");

  return (
    <div className="bg-stone-50 text-stone-900 min-h-screen">
      {/* Header band */}
      <section className="border-b-2 border-stone-900">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-6">
            VVV Digitals — Store
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-6 max-w-3xl">
            Tools built by operators, sold to operators.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl text-stone-700">
            Self-service digital toolkits drawn from real operations work.
            Calculators, templates, and decision frameworks for the problems
            most people pay consultants to solve.
          </p>
        </div>
      </section>

      {/* Live products */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="flex items-baseline justify-between mb-10 border-b border-stone-300 pb-4">
          <h2 className="font-serif text-3xl">Available now</h2>
          <span className="text-xs uppercase tracking-widest text-stone-500">
            {live.length} {live.length === 1 ? "product" : "products"}
          </span>
        </div>

        {live.length === 0 ? (
          <p className="text-stone-500">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {live.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Coming soon */}
      {upcoming.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 md:px-12 pb-16">
          <div className="flex items-baseline justify-between mb-10 border-b border-stone-300 pb-4">
            <h2 className="font-serif text-3xl">In development</h2>
            <span className="text-xs uppercase tracking-widest text-stone-500">
              {upcoming.length} upcoming
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcoming.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Footer band */}
      <section className="bg-stone-900 text-stone-200">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 text-sm leading-relaxed">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-3">
            Educational use only
          </p>
          <p className="max-w-2xl">
            Products in this store are educational tools and templates. They are
            not legal advice, financial advice, or representation. Specific
            disclaimers for each product are listed on its detail page.
          </p>
          <p className="mt-6 text-stone-400 text-xs">
            VVV Digitals LLC · 4140 W Irma Ln, Glendale, AZ 85308
          </p>
        </div>
      </section>
    </div>
  );
}
