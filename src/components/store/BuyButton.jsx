import { useState } from "react";

/**
 * <BuyButton slug="va-toolkit" />
 *
 * Calls the Netlify function to create a Stripe Checkout Session,
 * then redirects the browser to the returned Stripe-hosted URL.
 *
 * No products configured in Stripe Dashboard — the slug drives everything.
 */
export default function BuyButton({ slug, children, className = "" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Checkout failed (${res.status})`);
      }

      const { url } = await res.json();
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url;
    } catch (err) {
      console.error("[BuyButton] error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          relative inline-flex items-center justify-center
          px-8 py-4
          bg-stone-900 text-stone-50
          font-semibold tracking-wide uppercase text-sm
          border-2 border-stone-900
          transition-all duration-200
          hover:bg-amber-700 hover:border-amber-700
          disabled:opacity-60 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2
          ${className}
        `.trim()}
      >
        {loading ? "Redirecting to checkout…" : children || "Get the toolkit"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
