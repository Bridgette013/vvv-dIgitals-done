/**
 * VA Effective Date + Retro Pay Calculator
 *
 * All logic client-side. No PII transmission.
 * Math grounded in 38 CFR § 3.400 (effective dates) and standard
 * VA rate tables in va-rates.js.
 *
 * ⚠️ Educational tool. Estimates only. Verify with VA.
 */

import { getMonthlyRate } from './va-rates.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Compute the effective date for a claim.
 *
 * Rules implemented (simplified):
 *   - Original claim: later of (date claim received) and (date entitlement arose)
 *   - Intent to File (ITF): preserves the ITF date if formal claim filed within 1 year
 *   - Increased compensation: facts-found date if within 1 year of claim;
 *     otherwise the date of claim
 *   - Reopened claim w/ new evidence: date of new claim (or earlier if CUE established — not modeled)
 *
 * @param {object} input
 * @param {string} input.claimType — 'original' | 'increase' | 'supplemental' | 'hlr'
 * @param {string} input.itfDate — ISO date or null
 * @param {string} input.formalClaimDate — ISO date
 * @param {string} input.entitlementArose — ISO date (when symptoms reached the rated level)
 * @returns {{ effectiveDate: string, rationale: string }}
 */
export function computeEffectiveDate({
  claimType,
  itfDate,
  formalClaimDate,
  entitlementArose,
}) {
  if (!formalClaimDate) {
    return {
      effectiveDate: null,
      rationale: 'Formal claim date is required.',
    };
  }

  const claim = new Date(formalClaimDate);
  const entitle = entitlementArose ? new Date(entitlementArose) : null;
  const itf = itfDate ? new Date(itfDate) : null;

  // ITF preservation: formal claim must be within 1 year of ITF
  let claimReceiveDate = claim;
  let usedItf = false;
  if (itf) {
    const oneYearAfterItf = new Date(itf);
    oneYearAfterItf.setFullYear(oneYearAfterItf.getFullYear() + 1);
    if (claim <= oneYearAfterItf) {
      claimReceiveDate = itf;
      usedItf = true;
    }
  }

  if (claimType === 'increase') {
    // Increased rating: facts-found if within 1 year prior to claim, else claim date
    if (entitle) {
      const oneYearBeforeClaim = new Date(claimReceiveDate);
      oneYearBeforeClaim.setFullYear(oneYearBeforeClaim.getFullYear() - 1);
      if (entitle >= oneYearBeforeClaim && entitle <= claimReceiveDate) {
        return {
          effectiveDate: entitle.toISOString().slice(0, 10),
          rationale: `Increased rating: facts-found date (${formatDate(entitle)}) is within 1 year before claim. 38 CFR § 3.400(o)(2).${usedItf ? ' ITF preserved earlier claim date.' : ''}`,
        };
      }
    }
    return {
      effectiveDate: claimReceiveDate.toISOString().slice(0, 10),
      rationale: `Increased rating: claim date (${formatDate(claimReceiveDate)}). Facts-found not within 1 year prior.${usedItf ? ' ITF used to preserve claim date.' : ''}`,
    };
  }

  // Original / supplemental / HLR (general rule):
  // Effective date = later of (claim received) and (entitlement arose)
  let effective = claimReceiveDate;
  if (entitle && entitle > effective) effective = entitle;

  let rationale = `General rule: effective date is later of claim received (${formatDate(claimReceiveDate)})`;
  if (entitle) rationale += ` and entitlement arose (${formatDate(entitle)})`;
  rationale += '. 38 CFR § 3.400.';
  if (usedItf) rationale += ' ITF preserved earlier claim date.';
  if (claimType === 'hlr') {
    rationale +=
      ' HLR generally preserves the original effective date (no new evidence allowed).';
  }
  if (claimType === 'supplemental') {
    rationale +=
      ' Supplemental claim within 1 year of prior decision can preserve original effective date.';
  }

  return {
    effectiveDate: effective.toISOString().slice(0, 10),
    rationale,
  };
}

/**
 * Estimate retro pay between effective date and award/decision date.
 *
 * @param {object} input
 * @param {string} input.effectiveDate — ISO
 * @param {string} input.awardDate — ISO
 * @param {number} input.rating — final rating awarded
 * @param {object} input.dependents — passed to getMonthlyRate
 * @returns {{ months: number, monthlyRate: number, totalRetro: number, breakdown: string }}
 */
export function estimateRetro({
  effectiveDate,
  awardDate,
  rating,
  dependents = {},
}) {
  if (!effectiveDate || !awardDate || !rating) {
    return { months: 0, monthlyRate: 0, totalRetro: 0, breakdown: '' };
  }
  const from = new Date(effectiveDate);
  const to = new Date(awardDate);
  if (to < from) {
    return {
      months: 0,
      monthlyRate: 0,
      totalRetro: 0,
      breakdown: 'Award date is before effective date.',
    };
  }

  // Pay window:
  //   First check: the month after the effective date (VA pays from the 1st
  //   of the month FOLLOWING the effective date).
  //   Last check: the month BEFORE the award date (the award month rolls into
  //   the regular pay cycle, not retro).
  //
  // The integer-month diff `(toYear-startYear)*12 + (toMonth-startMonth)` is
  // 0-indexed on both ends and so naturally excludes the award month, which
  // is exactly what we want — no day-of-month adjustment needed.
  //
  // Worked example (matches va.gov retro calc):
  //   effective 2023-08-15, award 2024-11-04, 70% with spouse ($1,961.45/mo)
  //   → start = 2023-09-01, last paid month = Oct 2024
  //   → months = (2024-2023)*12 + (10-8) = 14
  //   → retro  = 14 × 1961.45 = 27,460.30
  const start = new Date(from);
  start.setMonth(start.getMonth() + 1);
  start.setDate(1);

  let months = 0;
  if (to >= start) {
    months =
      (to.getFullYear() - start.getFullYear()) * 12 +
      (to.getMonth() - start.getMonth());
  }
  if (months < 0) months = 0;

  const monthlyRate = getMonthlyRate(rating, dependents);
  const totalRetro = Math.round(monthlyRate * months * 100) / 100;

  const breakdown = `${months} months × $${monthlyRate.toFixed(2)}/mo at ${rating}% = $${totalRetro.toFixed(2)}`;

  return { months, monthlyRate, totalRetro, breakdown };
}

/**
 * HLR vs Supplemental Claim decision tree.
 * Returns recommended path with reasoning.
 */
export function pathDecision({
  hasNewEvidence,
  isLegalOrFactualError,
  withinOneYear,
  decisionFinality,
}) {
  const reasons = [];

  // Hard bars
  if (decisionFinality === 'final' && !hasNewEvidence) {
    return {
      recommended: 'CUE only',
      reasoning:
        'Decision is final and no new evidence exists. Only Clear and Unmistakable Error (CUE) can re-open it. Consult an accredited representative.',
    };
  }

  if (hasNewEvidence && isLegalOrFactualError) {
    reasons.push(
      'You have BOTH new evidence AND a legal/factual error to argue. Most veterans pick one path; some file Supplemental and HLR sequentially.'
    );
  }

  let recommended;
  if (hasNewEvidence) {
    recommended = 'Supplemental Claim (Form 20-0995)';
    reasons.push(
      'Supplemental Claim is required when submitting "new and relevant" evidence not previously of record.'
    );
    if (withinOneYear) {
      reasons.push(
        'Filed within 1 year of prior decision: original effective date can be preserved.'
      );
    }
  } else if (isLegalOrFactualError) {
    recommended = 'Higher-Level Review (Form 20-0996)';
    reasons.push(
      'HLR is for arguing the existing record was misapplied or misweighed. No new evidence allowed.'
    );
    reasons.push(
      'You can request an informal phone conference with the senior reviewer.'
    );
  } else {
    recommended = 'Re-evaluate before filing';
    reasons.push(
      'Without new evidence or an identifiable legal/factual error, neither path is likely to succeed. Consider gathering additional evidence first.'
    );
  }

  return { recommended, reasoning: reasons.join(' ') };
}

function formatDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

export const formatUSD = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    n || 0
  );
