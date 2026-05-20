import React from 'react';

/**
 * Site-wide compliance disclaimer.
 * Use on every page in /store and /tools to keep copy clean of accreditation risk.
 *
 * Three variants:
 *   - 'footer'  — full-paragraph footer (default)
 *   - 'inline'  — short single line, e.g. for calculator output
 *   - 'banner'  — top-of-page warning band (for tools)
 */
export default function Disclaimer({ variant = 'footer', className = '' }) {
  if (variant === 'inline') {
    return (
      <p className={`text-xs text-stone-500 italic ${className}`}>
        Estimates only. Educational use. Verify with VA. Not legal or claims advice.
      </p>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={`bg-amber-50 border-y border-amber-200 px-4 py-2 text-center text-xs text-amber-900 ${className}`}
      >
        Educational tool only. Estimates are not guarantees. Verify all figures with VA.
      </div>
    );
  }

  return (
    <div
      className={`border-t border-stone-200 pt-8 mt-12 text-xs text-stone-500 leading-relaxed ${className}`}
    >
      <p className="mb-2">
        <strong className="text-stone-700">Educational use only.</strong> The
        VVV Digitals Toolkit is not legal or claims advice. It is not affiliated
        with the U.S. Department of Veterans Affairs. For representation in your
        VA claim, consult an accredited attorney, claims agent, or recognized
        Veterans Service Organization (VSO).
      </p>
      <p>
        VVV Digitals LLC · Glendale, AZ ·{' '}
        <a
          href="mailto:support@vvvdigitals.com"
          className="underline hover:text-stone-700"
        >
          support@vvvdigitals.com
        </a>
      </p>
    </div>
  );
}
