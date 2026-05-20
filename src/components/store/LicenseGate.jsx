import { useEffect, useState } from "react";
import { resolveLicense } from "../../lib/license-client.js";

/**
 * <LicenseGate slug="va-toolkit">{children}</LicenseGate>
 *
 * Wraps a license-gated route. Validates the buyer's token server-side
 * via /api/validate-license. Token sources, in order:
 *   1. URL query string ?license=... (from the delivery email)
 *   2. localStorage (vvv_license_<slug>, set after first validated visit)
 *
 * Persistence and URL cleanup only happen after the server confirms the
 * token is valid for THIS slug. A forged or wrong-slug token is denied
 * and nothing is written to localStorage or history.
 */
export default function LicenseGate({ slug, children, fallback }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const result = await resolveLicense(slug);
      if (cancelled) return;
      setStatus(result.valid ? "granted" : "denied");
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === "checking") {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-stone-500">
        Verifying access…
      </div>
    );
  }

  if (status === "denied") {
    return (
      fallback || (
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h1 className="font-serif text-3xl mb-4">Access required</h1>
          <p className="text-stone-700 mb-6">
            This tool is included with your purchase. Open the access link from
            your delivery email, or purchase the toolkit to continue.
          </p>
          <a
            href={`/store/${slug}`}
            className="inline-block bg-stone-900 text-stone-50 px-6 py-3 uppercase tracking-widest text-sm font-semibold"
          >
            View product →
          </a>
        </div>
      )
    );
  }

  return children;
}
