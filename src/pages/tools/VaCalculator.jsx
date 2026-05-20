import { useMemo, useState } from 'react';
import {
  computeEffectiveDate,
  estimateRetro,
  pathDecision,
  formatUSD,
} from '../../lib/va-calculator.js';
import Disclaimer from '../../components/store/Disclaimer.jsx';

/**
 * VA Benefits Calculator
 *
 * Three connected tools in one screen:
 *   1. Effective Date estimator (ITF logic, increase rules, general rule)
 *   2. Retro Pay calculator (uses effective date + award date + rating)
 *   3. HLR vs Supplemental decision tree
 *
 * 100% client-side. No PII transmission. No data persistence.
 *
 * Wrap this with <LicenseGate slug="va-toolkit"> in your router.
 */
export default function VaCalculator() {
  // ----- Effective date inputs -----
  const [claimType, setClaimType] = useState('original');
  const [itfDate, setItfDate] = useState('');
  const [formalClaimDate, setFormalClaimDate] = useState('');
  const [entitlementArose, setEntitlementArose] = useState('');

  const effectiveDateResult = useMemo(
    () =>
      computeEffectiveDate({
        claimType,
        itfDate: itfDate || null,
        formalClaimDate: formalClaimDate || null,
        entitlementArose: entitlementArose || null,
      }),
    [claimType, itfDate, formalClaimDate, entitlementArose]
  );

  // ----- Retro pay inputs -----
  const [awardDate, setAwardDate] = useState('');
  const [rating, setRating] = useState(70);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [hasOneChild, setHasOneChild] = useState(false);
  const [additionalChildren, setAdditionalChildren] = useState(0);
  const [schoolChildren, setSchoolChildren] = useState(0);
  const [hasParents, setHasParents] = useState(false);
  const [spouseAA, setSpouseAA] = useState(false);

  const retroResult = useMemo(
    () =>
      estimateRetro({
        effectiveDate: effectiveDateResult.effectiveDate,
        awardDate: awardDate || null,
        rating: Number(rating),
        dependents: {
          hasSpouse,
          hasOneChild,
          hasParents,
          additionalChildren: Number(additionalChildren) || 0,
          schoolChildren: Number(schoolChildren) || 0,
          spouseAA,
        },
      }),
    [
      effectiveDateResult.effectiveDate,
      awardDate,
      rating,
      hasSpouse,
      hasOneChild,
      hasParents,
      additionalChildren,
      schoolChildren,
      spouseAA,
    ]
  );

  // ----- Decision tree inputs -----
  const [hasNewEvidence, setHasNewEvidence] = useState(null);
  const [isLegalOrFactualError, setIsLegalOrFactualError] = useState(null);
  const [withinOneYear, setWithinOneYear] = useState(null);
  const [decisionFinality, setDecisionFinality] = useState('non-final');

  const decisionResult = useMemo(
    () =>
      hasNewEvidence === null && isLegalOrFactualError === null
        ? null
        : pathDecision({
            hasNewEvidence,
            isLegalOrFactualError,
            withinOneYear,
            decisionFinality,
          }),
    [hasNewEvidence, isLegalOrFactualError, withinOneYear, decisionFinality]
  );

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900">
      <Disclaimer variant="banner" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-4">
          VA Benefits Decision Toolkit
        </p>
        <h1 className="font-serif text-4xl md:text-5xl mb-2 leading-tight">
          Calculator
        </h1>
        <p className="text-stone-600 mb-12 max-w-2xl">
          Enter what you know. Estimates update live. All calculations run in
          your browser — nothing is sent to a server.
        </p>

        {/* ============ EFFECTIVE DATE ============ */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6 border-b border-stone-300 pb-3">
            1 · Effective Date
          </h2>

          <Field label="Type of claim">
            <select
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
              className="w-full border border-stone-400 px-3 py-2 bg-white"
            >
              <option value="original">Original claim</option>
              <option value="increase">Increase / re-evaluation</option>
              <option value="hlr">Higher-Level Review (HLR)</option>
              <option value="supplemental">Supplemental Claim</option>
            </select>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Intent to File (ITF) date — if any">
              <input
                type="date"
                value={itfDate}
                onChange={(e) => setItfDate(e.target.value)}
                className="w-full border border-stone-400 px-3 py-2 bg-white"
              />
            </Field>
            <Field label="Formal claim date (Form 21-526EZ submission)">
              <input
                type="date"
                value={formalClaimDate}
                onChange={(e) => setFormalClaimDate(e.target.value)}
                className="w-full border border-stone-400 px-3 py-2 bg-white"
              />
            </Field>
          </div>

          <Field
            label="Date entitlement arose"
            hint="Date your symptoms reached the rated severity. For increases, when your condition worsened to the higher level."
          >
            <input
              type="date"
              value={entitlementArose}
              onChange={(e) => setEntitlementArose(e.target.value)}
              className="w-full border border-stone-400 px-3 py-2 bg-white"
            />
          </Field>

          <ResultBox
            label="Estimated effective date"
            value={
              effectiveDateResult.effectiveDate
                ? formatLongDate(effectiveDateResult.effectiveDate)
                : '—'
            }
            note={effectiveDateResult.rationale}
          />
        </section>

        {/* ============ RETRO PAY ============ */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6 border-b border-stone-300 pb-3">
            2 · Retro Pay Estimator
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Award / decision date">
              <input
                type="date"
                value={awardDate}
                onChange={(e) => setAwardDate(e.target.value)}
                className="w-full border border-stone-400 px-3 py-2 bg-white"
              />
            </Field>
            <Field label="Final rating (%)">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border border-stone-400 px-3 py-2 bg-white"
              >
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((r) => (
                  <option key={r} value={r}>
                    {r}%
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <fieldset className="mt-2 p-4 bg-stone-100 border border-stone-200">
            <legend className="text-xs uppercase tracking-widest text-stone-600 px-2">
              Dependents
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Check label="Spouse" value={hasSpouse} onChange={setHasSpouse} />
              <Check
                label="One child under 18"
                value={hasOneChild}
                onChange={setHasOneChild}
              />
              <Check
                label="Dependent parent(s)"
                value={hasParents}
                onChange={setHasParents}
              />
              <Check
                label="Spouse receives Aid & Attendance"
                value={spouseAA}
                onChange={setSpouseAA}
              />
              <Field label="Additional children under 18" inline>
                <input
                  type="number"
                  min="0"
                  value={additionalChildren}
                  onChange={(e) => setAdditionalChildren(e.target.value)}
                  className="w-20 border border-stone-400 px-2 py-1 bg-white"
                />
              </Field>
              <Field label="Schoolchildren (18–23)" inline>
                <input
                  type="number"
                  min="0"
                  value={schoolChildren}
                  onChange={(e) => setSchoolChildren(e.target.value)}
                  className="w-20 border border-stone-400 px-2 py-1 bg-white"
                />
              </Field>
            </div>
          </fieldset>

          <ResultBox
            label="Estimated retro pay"
            value={formatUSD(retroResult.totalRetro)}
            note={retroResult.breakdown}
          />
          <Disclaimer variant="inline" className="mt-2" />
        </section>

        {/* ============ DECISION TREE ============ */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl mb-6 border-b border-stone-300 pb-3">
            3 · HLR vs Supplemental Decision
          </h2>

          <Field label="Do you have new and relevant evidence not previously of record?">
            <RadioGroup
              value={hasNewEvidence}
              onChange={setHasNewEvidence}
              options={[
                { v: true, label: 'Yes' },
                { v: false, label: 'No' },
              ]}
            />
          </Field>

          <Field label="Do you believe VA misapplied the law or misweighed the existing evidence?">
            <RadioGroup
              value={isLegalOrFactualError}
              onChange={setIsLegalOrFactualError}
              options={[
                { v: true, label: 'Yes' },
                { v: false, label: 'No' },
              ]}
            />
          </Field>

          <Field label="Are you within 1 year of the prior decision?">
            <RadioGroup
              value={withinOneYear}
              onChange={setWithinOneYear}
              options={[
                { v: true, label: 'Yes' },
                { v: false, label: 'No' },
              ]}
            />
          </Field>

          <Field label="Decision finality">
            <select
              value={decisionFinality}
              onChange={(e) => setDecisionFinality(e.target.value)}
              className="w-full border border-stone-400 px-3 py-2 bg-white"
            >
              <option value="non-final">Not yet final</option>
              <option value="final">Final (more than 1 year old)</option>
            </select>
          </Field>

          {decisionResult && (
            <ResultBox
              label="Recommended path"
              value={decisionResult.recommended}
              note={decisionResult.reasoning}
            />
          )}
        </section>

        <Disclaimer />
      </div>
    </div>
  );
}

// ----- subcomponents -----

function Field({ label, children, hint, inline }) {
  return (
    <div className={`mb-4 ${inline ? 'flex items-center gap-3' : ''}`}>
      <label className="block text-sm font-medium text-stone-800 mb-1">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-stone-500 mt-1">{hint}</p>}
    </div>
  );
}

function Check({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-stone-800 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 border-stone-400"
      />
      {label}
    </label>
  );
}

function RadioGroup({ value, onChange, options }) {
  return (
    <div className="flex gap-4 mt-1">
      {options.map((opt) => (
        <label
          key={String(opt.v)}
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <input
            type="radio"
            checked={value === opt.v}
            onChange={() => onChange(opt.v)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function ResultBox({ label, value, note }) {
  return (
    <div className="mt-6 bg-stone-900 text-stone-50 p-6 border-l-4 border-amber-700">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-2">
        {label}
      </p>
      <p className="font-mono text-3xl mb-2">{value}</p>
      {note && (
        <p className="text-stone-300 text-sm leading-relaxed">{note}</p>
      )}
    </div>
  );
}

function formatLongDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
