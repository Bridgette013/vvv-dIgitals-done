/**
 * VA Disability Rate Tables
 *
 * ⚠️ VERIFY BEFORE LAUNCH: VA rates update each Dec 1 with the COLA.
 * Source of truth: https://www.va.gov/disability/compensation-rates/veteran-rates/
 *
 * Rates below reflect the Dec 1, 2025 schedule (effective through Nov 30, 2026).
 * 2.8% COLA applied over the 2025 rate year (SSA-announced Oct 24, 2025).
 * Transcribed from VA.gov published 2026 tables — not computed from a multiplier.
 * Update on launch and each Dec 1.
 *
 * Table keys: rating percentage (10-100, in 10% steps)
 * Each entry: monthly USD amount by dependent status.
 *
 * NOTE: 30%+ ratings have dependent additions. <30% is flat (no dependents).
 */

// Effective Dec 1, 2025 — 2026 rate year. Source: VA.gov, verified 2026-05-20.
export const VA_BASE_RATES_2026 = {
  10: { alone: 180.42 },
  20: { alone: 356.66 },
  30: {
    alone: 552.47,
    spouse: 617.47,
    spouseChild: 666.47,
    oneChild: 596.47,
    parentOnly: 604.47,
  },
  40: {
    alone: 795.84,
    spouse: 882.84,
    spouseChild: 947.84,
    oneChild: 853.84,
    parentOnly: 865.84,
  },
  50: {
    alone: 1132.90,
    spouse: 1241.90,
    spouseChild: 1322.90,
    oneChild: 1205.90,
    parentOnly: 1220.90,
  },
  60: {
    alone: 1435.02,
    spouse: 1566.02,
    spouseChild: 1663.02,
    oneChild: 1523.02,
    parentOnly: 1540.02,
  },
  70: {
    alone: 1808.45,
    spouse: 1961.45,
    spouseChild: 2074.45,
    oneChild: 1910.45,
    parentOnly: 1931.45,
  },
  80: {
    alone: 2102.15,
    spouse: 2277.15,
    spouseChild: 2406.15,
    oneChild: 2219.15,
    parentOnly: 2242.15,
  },
  90: {
    alone: 2362.30,
    spouse: 2559.30,
    spouseChild: 2704.30,
    oneChild: 2494.30,
    parentOnly: 2520.30,
  },
  100: {
    alone: 3938.58,
    spouse: 4158.17,
    spouseChild: 4318.99,
    oneChild: 4085.43,
    parentOnly: 4114.82,
  },
};

// TDIU pays at the 100% rate
export const TDIU_RATE_KEY = 100;

// Additional amounts per dependent (added to base rates above)
// Effective Dec 1, 2025 — 2026 rate year. Source: VA.gov, verified 2026-05-20.
export const VA_DEPENDENT_ADDITIONS_2026 = {
  // Each additional child under 18, by rating
  childUnder18: {
    30: 32, 40: 43, 50: 54, 60: 65, 70: 76, 80: 87, 90: 98, 100: 109.11,
  },
  // Each additional schoolchild 18-23
  schoolChild: {
    30: 105, 40: 140, 50: 176, 60: 211, 70: 246, 80: 281, 90: 317, 100: 352.45,
  },
  // Spouse receiving Aid & Attendance
  spouseAA: {
    30: 61, 40: 81, 50: 101, 60: 121, 70: 141, 80: 161, 90: 181, 100: 201.41,
  },
};

/**
 * Calculate monthly compensation rate.
 * @param {number} rating — disability rating (10..100 in steps of 10)
 * @param {object} deps — { hasSpouse, hasOneChild, hasParents, additionalChildren, schoolChildren, spouseAA }
 * @returns {number} monthly USD
 */
export function getMonthlyRate(rating, deps = {}) {
  const r = VA_BASE_RATES_2026[rating];
  if (!r) return 0;

  const {
    hasSpouse = false,
    hasOneChild = false,
    hasParents = false,
    additionalChildren = 0,
    schoolChildren = 0,
    spouseAA = false,
  } = deps;

  let base = r.alone;

  // Pick most-applicable base bracket
  if (rating >= 30) {
    if (hasSpouse && hasOneChild) base = r.spouseChild;
    else if (hasSpouse) base = r.spouse;
    else if (hasOneChild) base = r.oneChild;
    else if (hasParents) base = r.parentOnly;
  }

  // Add per-additional-child amounts (rating-specific)
  if (rating >= 30) {
    base += additionalChildren * (VA_DEPENDENT_ADDITIONS_2026.childUnder18[rating] || 0);
    base += schoolChildren * (VA_DEPENDENT_ADDITIONS_2026.schoolChild[rating] || 0);
    if (spouseAA) base += VA_DEPENDENT_ADDITIONS_2026.spouseAA[rating] || 0;
  }

  return Math.round(base * 100) / 100;
}
