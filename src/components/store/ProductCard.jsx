import { Link } from "react-router-dom";

/**
 * <ProductCard product={...} />
 * Editorial-style product card for the store grid.
 */
export default function ProductCard({ product }) {
  const isComingSoon = product.status === "coming_soon";
  const priceDisplay = formatPrice(product.priceCents, product.currency);

  return (
    <article
      className={`
        group relative flex flex-col
        bg-stone-50 border-2 border-stone-900
        transition-all duration-300
        hover:bg-stone-900 hover:text-stone-50
        ${isComingSoon ? "opacity-60" : ""}
      `}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-stone-900">
        {product.image ? (
          <img
            src={product.image}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-stone-200 flex items-center justify-center">
            <span className="text-stone-500 text-sm uppercase tracking-widest">
              {product.category}
            </span>
          </div>
        )}
        {isComingSoon && (
          <div className="absolute top-3 left-3 bg-amber-700 text-stone-50 text-xs uppercase tracking-widest px-2 py-1">
            Coming soon
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-serif text-2xl leading-tight mb-2">{product.name}</h3>
        <p className="text-sm leading-relaxed mb-6 flex-1">{product.tagline}</p>

        <div className="flex items-end justify-between mt-auto">
          <span className="font-mono text-2xl">{priceDisplay}</span>
          <Link
            to={`/store/${product.slug}`}
            className="text-xs uppercase tracking-widest font-semibold border-b-2 border-current pb-0.5 hover:border-amber-700"
          >
            {isComingSoon ? "Notify me" : "View →"}
          </Link>
        </div>
      </div>
    </article>
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
