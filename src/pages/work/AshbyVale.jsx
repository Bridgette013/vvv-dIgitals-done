import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

/**
 * Ashby Vale Estate Counsel — Interactive Practice Walkthrough
 * Route: /work/ashby-vale
 *
 * A self-contained interactive walkthrough of a signing/execution ceremony
 * for a (fictional) small estate-planning practice. All styles are scoped
 * under `.av-cs` so the firm's brand identity does NOT leak into VVV global
 * styles. Walkthrough state lives in React; no storage, no backend.
 */

const SITE_URL = 'https://vvvdigitals.com';
const PAGE_URL = `${SITE_URL}/work/ashby-vale`;

const STAGES = [
  { n: 1, label: 'Open Session' },
  { n: 2, label: 'Participants' },
  { n: 3, label: 'Execution' },
  { n: 4, label: 'Close' },
];

const DOCS = [
  {
    id: 'will',
    title: 'Last Will and Testament',
    blurb: "Names Margaret's executor and distributes her estate.",
    note: 'Two witnesses, notary, self-proving affidavit',
    signers: ['Margaret Chen', 'Daniel Ruiz', 'Priya Anand', 'Counsel (notary)'],
    affidavit: true,
  },
  {
    id: 'trust',
    title: 'Revocable Living Trust',
    blurb: 'Holds assets during life and directs them after.',
    note: 'Notary, no witnesses required',
    signers: ['Margaret Chen (grantor & trustee)', 'Counsel (notary)'],
    affidavit: false,
  },
  {
    id: 'poa',
    title: 'Durable Power of Attorney',
    blurb: 'Lets a trusted agent act on financial matters if needed.',
    note: 'Notary, witness customary',
    signers: ['Margaret Chen', 'Counsel (notary)', 'Daniel Ruiz (witness)'],
    affidavit: false,
  },
  {
    id: 'ahcd',
    title: 'Advance Healthcare Directive',
    blurb: 'Records medical wishes and names a healthcare agent.',
    note: 'Two witnesses, notary customary',
    signers: ['Margaret Chen', 'Daniel Ruiz', 'Priya Anand', 'Counsel (notary)'],
    affidavit: false,
  },
];

const WITNESS_POOL = [
  { id: 'evan', name: 'Evan Chen', role: 'Son · here with mother',
    disinterested: false,
    conflict: 'Named as a beneficiary in the will and as successor trustee in the trust.' },
  { id: 'rosa', name: 'Rosa Mendez', role: 'Firm receptionist',
    disinterested: true, conflict: null },
  { id: 'james', name: 'James Okafor', role: 'Visiting paralegal',
    disinterested: true, conflict: null },
];

// -- tour script -------------------------------------------------------------
// Each step has a target (data-tour attr), a required stage, copy, an
// advancement mode, and a placement hint. Visitor either clicks Next on
// the coachmark, or clicks the highlighted UI element to advance.
const TOUR = [
  { id: 'today-signing', stage: 1, target: 'today-signing', placement: 'bottom',
    title: "Today's appointment",
    body: "Margaret Chen is here for her estate plan. Four documents are queued in the correct signing order. The system already knows what each one needs.",
    action: 'next' },
  { id: 'order-note', stage: 1, target: 'order-note', placement: 'top',
    title: 'The order is locked',
    body: "Out of order, the affidavit gets deferred and the witnesses scatter. The system locks the order so the lawyer does not have to remember.",
    action: 'next' },
  { id: 'begin-signing', stage: 1, target: 'begin-signing', placement: 'top',
    title: 'Open the session',
    body: 'Click the button to begin.',
    action: 'click-target' },

  { id: 'participants', stage: 2, target: 'participants', placement: 'bottom',
    title: 'Check everyone in',
    body: 'Testator, two witnesses, notary. The system runs witness eligibility against every named party in the document set in the background.',
    action: 'next' },
  { id: 'witness-check', stage: 2, target: 'witness-check', placement: 'top',
    title: 'A quiet safeguard',
    body: "Try substituting in someone present. If the candidate is a beneficiary or fiduciary, the system flags it before the first signature. None of today's witnesses are interested parties.",
    action: 'next' },
  { id: 'everyone-here', stage: 2, target: 'everyone-here', placement: 'top',
    title: 'Continue',
    body: 'Witnesses are verified. Move into the signing.',
    action: 'click-target' },

  { id: 'signing-order', stage: 3, target: 'signing-order', placement: 'bottom',
    title: 'Will first, then the rest',
    body: "The will signs first so the self-proving affidavit happens in the same sitting. The system will not let the order break.",
    action: 'next' },
  { id: 'capture-rail', stage: 3, target: 'capture-rail', placement: 'left',
    title: 'Captured in the room',
    body: 'Each signature is timestamped and the witnesses recorded as it happens. No paperwork after the fact. Sign each row to advance.',
    action: 'next' },
  { id: 'close-session', stage: 3, target: 'close-session', placement: 'top',
    title: 'The plan is executed',
    body: 'All four documents are signed. Close the session.',
    action: 'click-target' },

  { id: 'preserved-record', stage: 4, target: 'preserved-record', placement: 'top',
    title: 'The proof already exists',
    body: 'This is the execution record. Locked, dated, retrievable. If the plan is ever challenged in probate, the evidence is here.',
    action: 'next' },
  { id: 'tagline', stage: 4, target: 'tagline', placement: 'top',
    title: 'What the system did',
    body: 'Automated compliance, so audit day no longer needs fire drills.',
    action: 'finish' },
];

// -- coachmark + dim mask ----------------------------------------------------

function Coachmark({ step, index, total, onNext, onSkip, targetRect }) {
  if (!targetRect) return null;

  // position the card relative to the target's bounding rect
  const PADDING = 14;
  const CARD_W = 320;
  const cardStyle = {};
  const arrowSide = step.placement || 'bottom';

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let top = 0; let left = 0;
  if (arrowSide === 'bottom') {
    top = targetRect.bottom + PADDING;
    left = targetRect.left + targetRect.width / 2 - CARD_W / 2;
  } else if (arrowSide === 'top') {
    top = targetRect.top - PADDING - 8;
    left = targetRect.left + targetRect.width / 2 - CARD_W / 2;
  } else if (arrowSide === 'left') {
    top = targetRect.top + targetRect.height / 2;
    left = targetRect.left - CARD_W - PADDING;
  } else if (arrowSide === 'right') {
    top = targetRect.top + targetRect.height / 2;
    left = targetRect.right + PADDING;
  }
  // clamp inside viewport
  left = Math.max(12, Math.min(left, vw - CARD_W - 12));
  top = Math.max(12, Math.min(top, vh - 220));
  // for 'top' placement, push card up by its height (approx) instead of down
  const useTransformY = arrowSide === 'top' ? 'translateY(-100%)' : '';
  Object.assign(cardStyle, {
    top: `${top}px`,
    left: `${left}px`,
    width: `${CARD_W}px`,
    transform: useTransformY,
  });

  return (
    <div className="av-cm" style={cardStyle} role="dialog" aria-labelledby="av-cm-title">
      <div className={`av-cm-tail av-cm-tail-${arrowSide}`} />
      <div className="av-cm-head">
        <span className="av-cm-step">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <button type="button" className="av-cm-skip" onClick={onSkip}>Skip tour</button>
      </div>
      <div className="av-cm-title" id="av-cm-title">{step.title}</div>
      <p className="av-cm-body">{step.body}</p>
      <div className="av-cm-actions">
        {step.action === 'click-target' && (
          <span className="av-cm-hint">Click the highlighted button</span>
        )}
        {step.action === 'next' && (
          <button type="button" className="av-cm-next" onClick={onNext}>Next →</button>
        )}
        {step.action === 'finish' && (
          <button type="button" className="av-cm-next" onClick={onNext}>Finish ✓</button>
        )}
      </div>
    </div>
  );
}

// Floating mini-card pinned to bottom-right when the target isn't on
// screen yet. Keeps the visitor oriented and offers skip/next without
// blocking the system UI.
function CoachmarkFallback({ step, index, total, onNext, onSkip }) {
  return (
    <div className="av-cm av-cm-floating" role="dialog">
      <div className="av-cm-head">
        <span className="av-cm-step">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <button type="button" className="av-cm-skip" onClick={onSkip}>Skip tour</button>
      </div>
      <div className="av-cm-title">{step.title}</div>
      <p className="av-cm-body">{step.body}</p>
      <div className="av-cm-actions">
        {step.action === 'click-target' && (
          <span className="av-cm-hint">Keep going in the system</span>
        )}
        {step.action !== 'click-target' && (
          <button type="button" className="av-cm-next" onClick={onNext}>
            {step.action === 'finish' ? 'Finish ✓' : 'Next →'}
          </button>
        )}
      </div>
    </div>
  );
}

function DimMask({ targetRect }) {
  if (!targetRect) {
    // full screen dim before target locks in
    return <div className="av-dim av-dim-full" />;
  }
  const PAD = 10;
  const r = {
    top: Math.max(0, targetRect.top - PAD),
    left: Math.max(0, targetRect.left - PAD),
    width: targetRect.width + PAD * 2,
    height: targetRect.height + PAD * 2,
  };
  return (
    <>
      <div className="av-dim" style={{ top: 0, left: 0, right: 0, height: r.top }} />
      <div className="av-dim" style={{ top: r.top, left: 0, width: r.left, height: r.height }} />
      <div className="av-dim" style={{ top: r.top, left: r.left + r.width, right: 0, height: r.height }} />
      <div className="av-dim" style={{ top: r.top + r.height, left: 0, right: 0, bottom: 0 }} />
      <div className="av-cm-ring" style={{ top: r.top, left: r.left, width: r.width, height: r.height }} />
    </>
  );
}

// hook: tracks bounding rect of element matching [data-tour=name] across
// scroll, resize, and stage changes. Polls briefly until target mounts.
function useTargetRect(targetName, deps = []) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!targetName) { setRect(null); return; }
    let mounted = true;
    let raf = 0;
    let pollTimer = 0;

    const measure = () => {
      const el = document.querySelector(`[data-tour="${targetName}"]`);
      if (!mounted) return;
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height });
      } else {
        setRect(null);
      }
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    // initial poll (target may mount after stage transitions)
    let tries = 0;
    const poll = () => {
      measure();
      tries += 1;
      if (!document.querySelector(`[data-tour="${targetName}"]`) && tries < 30) {
        pollTimer = window.setTimeout(poll, 50);
      }
    };
    poll();

    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(pollTimer);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetName, ...deps]);

  return rect;
}

// -- tiny visual primitives --------------------------------------------------

function Tooltip({ label, children }) {
  return (
    <span className="av-tt">
      {children}
      <span className="av-tt-body" role="tooltip">{label}</span>
    </span>
  );
}

function Tick() {
  return (
    <svg className="av-tick" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7.5" fill="none" stroke="currentColor"
            strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Seal() {
  return (
    <svg className="av-seal" viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="36" cy="36" r="26" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <text x="36" y="33" textAnchor="middle" fontFamily="Fraunces, serif"
            fontWeight="600" fontSize="11" fill="currentColor" letterSpacing="0.06em">
        ON FILE
      </text>
      <text x="36" y="48" textAnchor="middle" fontFamily="JetBrains Mono, monospace"
            fontSize="5.5" fill="currentColor" letterSpacing="0.22em">
        AV · 2026
      </text>
    </svg>
  );
}

// signer row inside a document panel
function SignerRow({ name, signed, active, ts, onSign }) {
  return (
    <li className={`av-signrow ${signed ? 'is-signed' : ''} ${active ? 'is-active' : ''}`}>
      <span className="av-signrow-name">{name}</span>
      <span className="av-signline">
        <span className="av-signline-draw" />
        {signed && <span className="av-signline-script">{firstName(name)}</span>}
      </span>
      <span className="av-signrow-ts">{ts || ''}</span>
      {active && !signed ? (
        <button type="button" className="av-btn av-btn-sign" onClick={onSign}>
          Sign
        </button>
      ) : (
        <span className="av-signrow-status">{signed ? 'Signed' : 'Waiting'}</span>
      )}
    </li>
  );
}

function firstName(n) {
  return n.split(' ')[0];
}

// In-product practice note. Reads as if the firm's system wrote it for
// the lawyer: calm, no rules talk, just the practical stakes.
function WhyNote({ title, children }) {
  return (
    <div className="av-whynote">
      <div className="av-whynote-head">
        <span className="av-whynote-eyebrow">Practice note</span>
        <span className="av-whynote-title">{title}</span>
      </div>
      <div className="av-whynote-body">{children}</div>
    </div>
  );
}

// -- main component ----------------------------------------------------------

export default function AshbyVale() {
  const [stage, setStage] = useState(1);

  // tour state
  const [tourIndex, setTourIndex] = useState(0);
  const [tourActive, setTourActive] = useState(true);
  const currentTour = tourActive ? TOUR[tourIndex] : null;
  const targetName = currentTour && currentTour.stage === stage ? currentTour.target : null;
  const targetRect = useTargetRect(targetName, [stage, tourIndex, tourActive]);

  const nextTour = useCallback(() => {
    setTourIndex((i) => {
      if (i + 1 >= TOUR.length) {
        setTourActive(false);
        return i;
      }
      return i + 1;
    });
  }, []);
  const skipTour = useCallback(() => setTourActive(false), []);

  // click-target steps: when the visitor clicks the highlighted element,
  // advance the tour at the same time the real handler fires. Re-query on
  // each render in case the target re-mounts after a stage transition.
  useEffect(() => {
    if (!currentTour || currentTour.action !== 'click-target') return;
    if (currentTour.stage !== stage) return;
    let cleanup = null;
    let attempts = 0;
    const tryAttach = () => {
      const el = document.querySelector(`[data-tour="${currentTour.target}"]`);
      if (el) {
        const handler = () => setTimeout(() => nextTour(), 60);
        el.addEventListener('click', handler, { once: true });
        cleanup = () => el.removeEventListener('click', handler);
      } else if (attempts < 20) {
        attempts += 1;
        window.setTimeout(tryAttach, 50);
      }
    };
    tryAttach();
    return () => { if (cleanup) cleanup(); };
  }, [currentTour, stage, nextTour]);

  // participants
  const [present, setPresent] = useState({
    testator: true, w1: true, w2: true, notary: true,
  });
  const [witness1, setWitness1] = useState({
    id: 'daniel', name: 'Daniel Ruiz', role: 'Paralegal · firm',
    disinterested: true, conflict: null,
  });
  const [showSubstitute, setShowSubstitute] = useState(false);
  const [substituteCandidate, setSubstituteCandidate] = useState(null);
  const [substituteCatch, setSubstituteCatch] = useState(null);

  // execution
  const [docIndex, setDocIndex] = useState(0);
  const [docState, setDocState] = useState(() => DOCS.map(() => ({
    sigs: [], affidavitSigs: [], complete: false,
  })));
  const [showAffidavit, setShowAffidavit] = useState(false);

  // on file rail
  const [onFile, setOnFile] = useState([
    { t: '09:58 AM', label: 'Session opened by counsel' },
    { t: '09:58 AM', label: 'Document set loaded — 4 of 4 in signing order' },
  ]);

  const railRef = useRef(null);
  useEffect(() => {
    if (railRef.current) railRef.current.scrollTop = railRef.current.scrollHeight;
  }, [onFile]);

  const addFile = (entries) => setOnFile((prev) => [...prev, ...entries]);

  // ----- stage 2: substitute witness logic ---------------------------------
  const pickSubstitute = (cand) => {
    setSubstituteCandidate(cand);
    if (!cand.disinterested) {
      setSubstituteCatch({
        title: 'Heads up.',
        body: `${cand.name} ${cand.conflict.toLowerCase()} Choosing a disinterested witness avoids putting that interest at risk. We'd suggest staying with Daniel or Priya.`,
      });
    } else {
      setSubstituteCatch(null);
      setWitness1({ ...cand });
      addFile([
        { t: nowStamp(), label: `Witness 1 substituted — ${cand.name}` },
        { t: nowStamp(), label: 'Disinterested status verified' },
      ]);
      setShowSubstitute(false);
    }
  };
  const keepDaniel = () => {
    setSubstituteCatch(null);
    setSubstituteCandidate(null);
    setShowSubstitute(false);
  };

  // ----- stage 3: signing actions ------------------------------------------
  const currentDoc = DOCS[docIndex];
  const currentState = docState[docIndex];

  const nextSignerIndex = currentState.sigs.length;
  const nextAffidavitIndex = currentState.affidavitSigs.length;

  const docSignersResolved = currentDoc.signers.map((s) => {
    if (s === 'Daniel Ruiz') return witness1.name + ' (witness)';
    if (s === 'Daniel Ruiz (witness)') return witness1.name + ' (witness)';
    return s;
  });

  const signNext = () => {
    const idx = currentState.sigs.length;
    const name = docSignersResolved[idx];
    const ts = nowStamp();
    const newSig = { name, ts };
    setDocState((prev) => prev.map((d, i) =>
      i === docIndex ? { ...d, sigs: [...d.sigs, newSig] } : d,
    ));
    addFile([{ t: ts, label: `${currentDoc.title} — ${name} signed` }]);

    // when last signer signs:
    if (idx + 1 === docSignersResolved.length) {
      if (currentDoc.affidavit) {
        setShowAffidavit(true);
        addFile([{ t: ts, label: `${currentDoc.title} — affidavit opened in session` }]);
      } else {
        markDocComplete();
      }
    }
  };

  const affidavitSigners = ['Margaret Chen', witness1.name, 'Priya Anand', 'Counsel (notary)'];

  const signNextAffidavit = () => {
    const idx = currentState.affidavitSigs.length;
    const name = affidavitSigners[idx];
    const ts = nowStamp();
    const newSig = { name, ts };
    setDocState((prev) => prev.map((d, i) =>
      i === docIndex ? { ...d, affidavitSigs: [...d.affidavitSigs, newSig] } : d,
    ));
    addFile([{ t: ts, label: `Self-proving affidavit — ${name} signed` }]);

    if (idx + 1 === affidavitSigners.length) {
      setShowAffidavit(false);
      markDocComplete(true);
    }
  };

  const markDocComplete = (withAffidavit = false) => {
    setDocState((prev) => prev.map((d, i) =>
      i === docIndex ? { ...d, complete: true } : d,
    ));
    const ts = nowStamp();
    if (currentDoc.id === 'will') {
      addFile([{ t: ts, label: 'Will executed · two witnesses present · affidavit completed in session' }]);
    } else if (currentDoc.id === 'trust') {
      addFile([{ t: ts, label: 'Trust executed · notarized' }]);
    } else if (currentDoc.id === 'poa') {
      addFile([{ t: ts, label: 'POA executed · notarized' }]);
    } else if (currentDoc.id === 'ahcd') {
      addFile([{ t: ts, label: 'Healthcare directive executed · two witnesses present' }]);
    }
  };

  const moveToNextDoc = () => {
    if (docIndex < DOCS.length - 1) {
      setDocIndex(docIndex + 1);
    }
  };

  const allDocsDone = docState.every((d) => d.complete);

  // ----- stage transitions --------------------------------------------------
  const goToStage = (n) => {
    setStage(n);
    if (n === 2) {
      addFile([{ t: nowStamp(), label: 'Participants check-in begun' }]);
    } else if (n === 3) {
      addFile([
        { t: nowStamp(), label: 'Participants confirmed (4)' },
        { t: nowStamp(), label: 'Witnesses verified disinterested' },
      ]);
    } else if (n === 4) {
      addFile([
        { t: nowStamp(), label: 'Session closed' },
        { t: nowStamp(), label: 'Execution record sealed · ID AVS-2026-05-28-1147' },
        { t: nowStamp(), label: 'Originals queued for vault · conformed copies queued for client' },
      ]);
    }
  };

  return (
    <div className="av-cs">
      <Helmet>
        <title>Ashby Vale Estate Counsel — Signing Session | VVV Digitals</title>
        <meta name="description" content="A walkthrough of the signing-ceremony system VVV Digitals built for Ashby Vale Estate Counsel, a small estate-planning practice." />
        <link rel="canonical" href={PAGE_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </Helmet>

      <AshbyStyles />

      <header className="av-mast">
        <div className="av-mast-inner">
          <div className="av-brand">
            <div className="av-brand-name">Ashby Vale</div>
            <div className="av-brand-rule" />
            <div className="av-brand-sub">Estate Counsel</div>
          </div>
          <nav className="av-mast-nav">
            <span className="av-mast-link">Matters</span>
            <span className="av-mast-link">Calendar</span>
            <span className="av-mast-link is-current">Signing</span>
            <span className="av-mast-link">Vault</span>
          </nav>
          <div className="av-mast-user">
            <span className="av-mast-user-name">S. Ashby</span>
            <span className="av-mast-user-role">Counsel</span>
          </div>
        </div>
      </header>

      <div className="av-stagebar">
        <div className="av-stagebar-inner">
          {STAGES.map((s) => (
            <div
              key={s.n}
              className={`av-stagepip ${stage === s.n ? 'is-now' : ''} ${stage > s.n ? 'is-done' : ''}`}
            >
              <span className="av-stagepip-n">{String(s.n).padStart(2, '0')}</span>
              <span className="av-stagepip-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <main className="av-shell">
        <section className="av-work">
          {stage === 1 && (
            <Stage1 onAdvance={() => goToStage(2)} />
          )}
          {stage === 2 && (
            <Stage2
              witness1={witness1}
              showSubstitute={showSubstitute}
              substituteCandidate={substituteCandidate}
              substituteCatch={substituteCatch}
              onOpenSubstitute={() => setShowSubstitute(true)}
              onPick={pickSubstitute}
              onKeepDaniel={keepDaniel}
              onAdvance={() => goToStage(3)}
            />
          )}
          {stage === 3 && (
            <Stage3
              docIndex={docIndex}
              docs={DOCS}
              docState={docState}
              currentDoc={currentDoc}
              currentState={currentState}
              docSignersResolved={docSignersResolved}
              affidavitSigners={affidavitSigners}
              showAffidavit={showAffidavit}
              onSignNext={signNext}
              onSignNextAffidavit={signNextAffidavit}
              onMoveToNext={moveToNextDoc}
              allDocsDone={allDocsDone}
              onAdvance={() => goToStage(4)}
            />
          )}
          {stage === 4 && (
            <Stage4 onFile={onFile} />
          )}
        </section>

        <aside className="av-rail" aria-label="On File" data-tour="capture-rail">
          <div className="av-rail-head">
            <Seal />
            <div>
              <div className="av-rail-title">On File</div>
              <div className="av-rail-sub">Matter · Chen, M.</div>
            </div>
          </div>
          <ol className="av-rail-list" ref={railRef}>
            {onFile.map((e, i) => (
              <li key={i} className="av-rail-item">
                <span className="av-rail-tick"><Tick /></span>
                <span className="av-rail-t">{e.t}</span>
                <span className="av-rail-label">{e.label}</span>
              </li>
            ))}
          </ol>
        </aside>
      </main>

      <footer className="av-foot">
        <div className="av-foot-inner">
          <div className="av-foot-firm">
            <span className="av-foot-mark">Ashby Vale Estate Counsel</span>
            <span className="av-foot-meta">Wills · Trusts · Legacy Planning</span>
          </div>
          <div className="av-foot-tag" data-tour="tagline">
            Automated compliance, so audit day no longer needs fire drills.
          </div>
          <div className="av-foot-back">
            <Link to="/" className="av-foot-link">Return to vvvdigitals.com</Link>
          </div>
        </div>
      </footer>

      {tourActive && currentTour && createPortal(
        <div className="av-cs av-tour-layer" aria-live="polite">
          {/* Only dim when target is available AND on the right stage,
              so an out-of-sync tour never blackholes the page. */}
          {currentTour.stage === stage && targetRect && (
            <DimMask targetRect={targetRect} />
          )}
          {currentTour.stage === stage && targetRect ? (
            <Coachmark
              step={currentTour}
              index={tourIndex}
              total={TOUR.length}
              onNext={nextTour}
              onSkip={skipTour}
              targetRect={targetRect}
            />
          ) : (
            // Floating fallback card if the target isn't on screen yet.
            // Lets the visitor continue interacting with the system to
            // bring the element into being, with skip/next still available.
            <CoachmarkFallback
              step={currentTour}
              index={tourIndex}
              total={TOUR.length}
              onNext={nextTour}
              onSkip={skipTour}
            />
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}

// -- stage 1 ------------------------------------------------------------------

function Stage1({ onAdvance }) {
  return (
    <div className="av-card av-anim-fade">
      <div className="av-card-head" data-tour="today-signing">
        <div>
          <div className="av-eyebrow">Today's signing</div>
          <h1 className="av-h1">Margaret Chen <span className="av-h1-meta">· Estate plan · Conference Room 2</span></h1>
        </div>
        <div className="av-card-time">
          <span className="av-card-time-t">9:58 AM</span>
          <span className="av-card-time-d">Thursday, May 28</span>
        </div>
      </div>

      <p className="av-lead">
        Margaret is here for the execution of her estate plan. Four documents are queued in signing order. Everything she drafted with us over the last six weeks lives in this folder.
      </p>

      <div data-tour="order-note">
        <WhyNote title="Why the order matters">
          The will signs first so the self-proving affidavit can be witnessed in the same sitting, while everyone is still in the room. Out of that order, the affidavit gets deferred, the witnesses scatter, and the will becomes harder to admit to probate years from now. The system locks the order so it does not have to be remembered.
        </WhyNote>
      </div>

      <div className="av-doclist">
        <div className="av-doclist-head">
          <span>Documents queued</span>
          <Tooltip label="The will is executed first so the self-proving affidavit can be witnessed in the same sitting. Everything else follows.">
            <span className="av-doclist-why">why this order</span>
          </Tooltip>
        </div>
        <ol className="av-doclist-list">
          {DOCS.map((d, i) => (
            <li key={d.id} className="av-doclist-item">
              <span className="av-doclist-n">{i + 1}</span>
              <span className="av-doclist-body">
                <span className="av-doclist-title">{d.title}</span>
                <span className="av-doclist-note">{d.note}</span>
              </span>
              <span className="av-doclist-open">open</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="av-cta-row">
        <button type="button" className="av-btn av-btn-primary" onClick={onAdvance} data-tour="begin-signing">
          Begin the signing →
        </button>
      </div>
    </div>
  );
}

// -- stage 2 ------------------------------------------------------------------

function Stage2({
  witness1, showSubstitute, substituteCandidate, substituteCatch,
  onOpenSubstitute, onPick, onKeepDaniel, onAdvance,
}) {
  const cards = [
    { role: 'Testator', name: 'Margaret Chen', meta: 'Client', sub: 'Of sound mind. Has reviewed all four documents with counsel.' },
    { role: 'Witness 1', name: witness1.name, meta: witness1.role, sub: 'Disinterested. Not named in any document in this set.' },
    { role: 'Witness 2', name: 'Priya Anand', meta: 'Paralegal · firm', sub: 'Disinterested. Not named in any document in this set.' },
    { role: 'Notary', name: 'S. Ashby', meta: 'Commissioned', sub: 'Will administer the acknowledgment for each instrument.' },
  ];

  return (
    <div className="av-card av-anim-fade">
      <div className="av-card-head">
        <div>
          <div className="av-eyebrow">Who is present</div>
          <h1 className="av-h1">Check everyone in before the first signature.</h1>
        </div>
      </div>

      <WhyNote title="Why we care who witnesses">
        A witness who stands to inherit under the will, or who serves as a fiduciary in it, is an interested witness. In many states an interested witness loses their gift; in some, the will itself is at risk. Using two disinterested witnesses, both present, keeps Margaret's plan intact decades from now. The system checks each candidate against the document set before the first signature.
      </WhyNote>

      <div className="av-pcards" data-tour="participants">
        {cards.map((c) => (
          <div key={c.role} className="av-pcard">
            <div className="av-pcard-role">{c.role}</div>
            <div className="av-pcard-name">{c.name}</div>
            <div className="av-pcard-meta">{c.meta}</div>
            <div className="av-pcard-sub">{c.sub}</div>
            <div className="av-pcard-checkin">
              <span className="av-pcard-checkin-tick"><Tick /></span>
              <span>Checked in</span>
            </div>
          </div>
        ))}
      </div>

      <div className="av-substitute" data-tour="witness-check">
        {!showSubstitute && (
          <button type="button" className="av-link-subtle" onClick={onOpenSubstitute}>
            Need to substitute a witness?
          </button>
        )}
        {showSubstitute && (
          <div className="av-substitute-panel">
            <div className="av-substitute-head">
              <span>Others present in the room</span>
              <button type="button" className="av-link-subtle" onClick={onKeepDaniel}>close</button>
            </div>
            <ul className="av-substitute-list">
              {WITNESS_POOL.map((p) => (
                <li key={p.id} className="av-substitute-row">
                  <div>
                    <div className="av-substitute-name">{p.name}</div>
                    <div className="av-substitute-role">{p.role}</div>
                  </div>
                  <button type="button" className="av-btn av-btn-ghost" onClick={() => onPick(p)}>
                    Use as Witness 1
                  </button>
                </li>
              ))}
            </ul>

            {substituteCatch && (
              <div className="av-catch av-anim-fade">
                <div className="av-catch-title">{substituteCatch.title}</div>
                <p className="av-catch-body">{substituteCatch.body}</p>
                <div className="av-catch-actions">
                  <button type="button" className="av-btn av-btn-primary" onClick={onKeepDaniel}>
                    Keep Daniel as Witness 1
                  </button>
                  <Tooltip label="A witness who stands to inherit can invalidate their gift in many states and, in some, the entire will. Disinterested witnesses keep the plan intact.">
                    <span className="av-catch-why">why this matters</span>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="av-cta-row">
        <button
          type="button"
          className="av-btn av-btn-primary"
          onClick={onAdvance}
          disabled={!witness1.disinterested}
          data-tour="everyone-here"
        >
          Everyone is here →
        </button>
      </div>
    </div>
  );
}

// -- stage 3 ------------------------------------------------------------------

function Stage3({
  docIndex, docs, docState, currentDoc, currentState,
  docSignersResolved, affidavitSigners, showAffidavit,
  onSignNext, onSignNextAffidavit, onMoveToNext, allDocsDone, onAdvance,
}) {
  const nextIdx = currentState.sigs.length;
  const nextAffIdx = currentState.affidavitSigs.length;

  return (
    <div className="av-card av-anim-fade">
      <div className="av-card-head">
        <div>
          <div className="av-eyebrow">Signing in order</div>
          <h1 className="av-h1">
            Document {docIndex + 1} of {docs.length}
            <span className="av-h1-meta"> · stay seated until each instrument is complete</span>
          </h1>
        </div>
        <div className="av-docnav" data-tour="signing-order">
          {docs.map((d, i) => (
            <span
              key={d.id}
              className={`av-docnav-pip ${i === docIndex ? 'is-now' : ''} ${docState[i].complete ? 'is-done' : ''}`}
              title={d.title}
            >
              {docState[i].complete ? <Tick /> : i + 1}
            </span>
          ))}
        </div>
      </div>

      <WhyNote title="Why this signature, in this seat, right now">
        Each document has its own formalities. The will needs two witnesses and a notary in the room together, signing in order, with the self-proving affidavit completed in the same sitting. The trust needs a notary but no witnesses. The power of attorney is notarized with a customary witness. The healthcare directive needs two witnesses. The system walks each one in the correct order so nothing gets skipped under the social pressure of a real ceremony.
      </WhyNote>

      <div className="av-docpanel">
        <div className="av-docpanel-head">
          <div>
            <div className="av-docpanel-title">{currentDoc.title}</div>
            <div className="av-docpanel-blurb">{currentDoc.blurb}</div>
          </div>
          <div className="av-docpanel-note">{currentDoc.note}</div>
        </div>

        <ul className="av-signlist">
          {docSignersResolved.map((name, i) => {
            const sig = currentState.sigs[i];
            return (
              <SignerRow
                key={i}
                name={name}
                signed={!!sig}
                active={i === nextIdx && !currentState.complete}
                ts={sig?.ts}
                onSign={onSignNext}
              />
            );
          })}
        </ul>

        {showAffidavit && (
          <div className="av-affidavit av-anim-fade">
            <div className="av-affidavit-head">
              <span className="av-affidavit-eyebrow">Self-proving affidavit</span>
              <Tooltip label="The affidavit is signed in the same sitting. Done now, it makes the will admissible later without tracking the witnesses down again, potentially decades from now.">
                <span className="av-affidavit-why">why now</span>
              </Tooltip>
            </div>
            <p className="av-affidavit-blurb">
              Same four people, signed while everyone is still in the room.
            </p>
            <ul className="av-signlist">
              {affidavitSigners.map((name, i) => {
                const sig = currentState.affidavitSigs[i];
                return (
                  <SignerRow
                    key={i}
                    name={name}
                    signed={!!sig}
                    active={i === nextAffIdx}
                    ts={sig?.ts}
                    onSign={onSignNextAffidavit}
                  />
                );
              })}
            </ul>
          </div>
        )}

        {currentState.complete && docIndex < docs.length - 1 && (
          <div className="av-docfoot">
            <span className="av-docfoot-rule" />
            <span className="av-docfoot-msg">Moving to the next document. Everyone stays seated.</span>
            <button type="button" className="av-btn av-btn-primary" onClick={onMoveToNext}>
              Next document →
            </button>
          </div>
        )}

        {allDocsDone && (
          <div className="av-docfoot">
            <span className="av-docfoot-rule" />
            <span className="av-docfoot-msg">All four documents are executed.</span>
            <button type="button" className="av-btn av-btn-primary" onClick={onAdvance} data-tour="close-session">
              Close the session →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// -- stage 4 ------------------------------------------------------------------

function Stage4({ onFile }) {
  return (
    <div className="av-card av-anim-fade">
      <div className="av-card-head">
        <div>
          <div className="av-eyebrow">The plan is signed</div>
          <h1 className="av-h1">Margaret Chen <span className="av-h1-meta">· Estate plan · Executed in full</span></h1>
        </div>
        <div className="av-seal-wrap"><Seal /></div>
      </div>

      <p className="av-lead">
        Margaret's estate plan is fully and validly executed. She leaves today with her will, her trust, her power of attorney, and her healthcare directive in force. Originals go in the vault. Conformed copies go home with her.
      </p>

      <WhyNote title="Why the record matters now">
        Probate happens after Margaret is gone. By then, witnesses have moved, memories have faded, and a challenger only needs to introduce doubt. A complete execution record captured in the room is the difference between a will that gets admitted in an afternoon and an estate that gets contested for years. The record below was built while the lawyer ran the ceremony, not assembled afterward.
      </WhyNote>

      <div className="av-preserved" data-tour="preserved-record">
        <div className="av-preserved-head">The record is preserved.</div>
        <p className="av-preserved-body">
          Every signer, the order, every timestamp, the witnesses' attestations, the self-proving affidavit, and the notary's acknowledgment, already on file under this matter.
        </p>

        <ol className="av-preserved-list">
          {onFile.map((e, i) => (
            <li key={i} className="av-preserved-item">
              <span className="av-preserved-t">{e.t}</span>
              <span className="av-preserved-label">{e.label}</span>
            </li>
          ))}
        </ol>

        <p className="av-payoff">
          If this plan is ever challenged, the proof that it was executed correctly already exists.
        </p>
      </div>
    </div>
  );
}

// -- helpers ------------------------------------------------------------------

function nowStamp() {
  // synthesized timestamps progressing through the morning
  const t = stampClock.next();
  return t;
}

const stampClock = (() => {
  // simple incrementing clock starting at 10:02 AM
  let minutes = 10 * 60 + 2;
  return {
    next() {
      minutes += 1 + Math.floor(Math.random() * 2);
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      const h12 = ((h + 11) % 12) + 1;
      const ampm = h < 12 ? 'AM' : 'PM';
      return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
    },
  };
})();

// -- scoped styles ------------------------------------------------------------

function AshbyStyles() {
  return (
    <style>{`
.av-cs {
  --ink: #1B2331;
  --ink-soft: #3A4454;
  --parchment: #F4EFE6;
  --vellum: #FBF7F0;
  --paper: #FFFDF7;
  --sage: #5C7363;
  --sage-soft: #7A8F80;
  --brass: #A8814B;
  --brass-soft: #C5A06A;
  --rule: #D9D1C2;
  --rule-soft: #E7E0CF;
  --danger: #A8523C;
  --shadow: 0 1px 2px rgba(27,35,49,0.04), 0 6px 18px rgba(27,35,49,0.04);

  font-family: 'Inter', system-ui, sans-serif;
  color: var(--ink);
  background: var(--parchment);
  min-height: 100vh;
  letter-spacing: -0.005em;
  font-size: 15px;
  line-height: 1.55;
}

.av-cs *, .av-cs *::before, .av-cs *::after { box-sizing: border-box; }
.av-cs button { font: inherit; cursor: pointer; }

/* ------ masthead ------ */
.av-mast {
  background: var(--vellum);
  border-bottom: 1px solid var(--rule);
}
.av-mast-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 22px 28px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 32px;
}
.av-brand { display: flex; flex-direction: column; align-items: flex-start; line-height: 1; }
.av-brand-name {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 28px;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.av-brand-rule {
  width: 100%;
  height: 1px;
  background: var(--brass);
  margin: 6px 0;
  opacity: 0.7;
}
.av-brand-sub {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--ink-soft);
}
.av-mast-nav {
  display: flex;
  gap: 28px;
  justify-content: center;
  font-size: 13px;
}
.av-mast-link {
  color: var(--ink-soft);
  letter-spacing: 0.04em;
}
.av-mast-link.is-current {
  color: var(--ink);
  border-bottom: 1px solid var(--brass);
  padding-bottom: 4px;
}
.av-mast-user {
  text-align: right;
  font-size: 12px;
  line-height: 1.3;
}
.av-mast-user-name {
  display: block;
  font-weight: 500;
  color: var(--ink);
  font-family: 'Fraunces', serif;
  font-size: 15px;
}
.av-mast-user-role {
  color: var(--ink-soft);
  letter-spacing: 0.04em;
}

/* ------ stage bar ------ */
.av-stagebar {
  background: var(--paper);
  border-bottom: 1px solid var(--rule);
}
.av-stagebar-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 16px 28px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.av-stagepip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-top: 1px solid var(--rule);
  color: var(--ink-soft);
  font-size: 12px;
  letter-spacing: 0.04em;
}
.av-stagepip-n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--sage);
}
.av-stagepip-label { color: var(--ink-soft); }
.av-stagepip.is-now { border-top-color: var(--brass); }
.av-stagepip.is-now .av-stagepip-label { color: var(--ink); font-weight: 500; }
.av-stagepip.is-now .av-stagepip-n { color: var(--brass); }
.av-stagepip.is-done { border-top-color: var(--sage); }
.av-stagepip.is-done .av-stagepip-n { color: var(--sage); }

/* ------ shell ------ */
.av-shell {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 28px 56px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 32px;
}
@media (max-width: 880px) {
  .av-shell { grid-template-columns: 1fr; }
}

/* ------ card ------ */
.av-card {
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 6px;
  box-shadow: var(--shadow);
  padding: 36px 38px;
}
@media (max-width: 600px) { .av-card { padding: 24px; } }

.av-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 18px;
}
.av-eyebrow {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--sage);
  margin-bottom: 8px;
}
.av-h1 {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: 30px;
  line-height: 1.15;
  color: var(--ink);
  margin: 0;
  letter-spacing: -0.015em;
}
.av-h1-meta {
  font-weight: 400;
  color: var(--ink-soft);
  font-size: 18px;
  font-style: italic;
}
.av-card-time {
  text-align: right;
  font-size: 12px;
  line-height: 1.3;
  color: var(--ink-soft);
}
.av-card-time-t {
  font-family: 'JetBrains Mono', monospace;
  color: var(--ink);
  display: block;
  font-size: 13px;
}
.av-lead {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.55;
  color: var(--ink-soft);
  margin: 0 0 28px;
}

/* ------ doclist (stage 1) ------ */
.av-doclist {
  border: 1px solid var(--rule);
  border-radius: 4px;
  background: var(--vellum);
  padding: 18px 20px;
  margin-bottom: 28px;
}
.av-doclist-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--ink-soft);
  margin-bottom: 14px;
}
.av-doclist-why {
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--brass);
  border-bottom: 1px dashed var(--brass-soft);
  padding-bottom: 1px;
}
.av-doclist-list { list-style: none; padding: 0; margin: 0; }
.av-doclist-item {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: baseline;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--rule-soft);
}
.av-doclist-item:last-child { border-bottom: none; }
.av-doclist-n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--sage);
}
.av-doclist-title {
  font-family: 'Fraunces', serif;
  font-size: 17px;
  color: var(--ink);
  display: block;
}
.av-doclist-note {
  font-size: 12px;
  color: var(--ink-soft);
  font-style: italic;
}
.av-doclist-open {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brass);
  border: 1px solid var(--rule);
  border-radius: 3px;
  padding: 4px 10px;
}

/* ------ buttons ------ */
.av-cta-row { margin-top: 32px; display: flex; gap: 14px; }
.av-btn {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 12px 22px;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: transform 120ms ease, background 120ms ease, color 120ms ease;
}
.av-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.av-btn-primary {
  background: var(--ink);
  color: var(--vellum);
  border-color: var(--ink);
}
.av-btn-primary:hover:not(:disabled) {
  background: var(--brass);
  border-color: var(--brass);
}
.av-btn-ghost {
  background: transparent;
  color: var(--ink);
  border-color: var(--rule);
}
.av-btn-ghost:hover { background: var(--vellum); }
.av-btn-sign {
  background: var(--brass);
  color: var(--vellum);
  border-color: var(--brass);
  font-size: 11px;
  padding: 6px 14px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.av-btn-sign:hover { background: var(--ink); border-color: var(--ink); }

/* ------ participants (stage 2) ------ */
.av-pcards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 12px;
}
@media (max-width: 600px) { .av-pcards { grid-template-columns: 1fr; } }
.av-pcard {
  border: 1px solid var(--rule);
  background: var(--vellum);
  border-radius: 4px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.av-pcard-role {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--sage);
}
.av-pcard-name {
  font-family: 'Fraunces', serif;
  font-size: 20px;
  color: var(--ink);
}
.av-pcard-meta {
  font-size: 12px;
  color: var(--ink-soft);
}
.av-pcard-sub {
  font-size: 12px;
  color: var(--ink-soft);
  font-style: italic;
  margin-top: 6px;
  border-top: 1px solid var(--rule-soft);
  padding-top: 8px;
}
.av-pcard-checkin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sage);
}
.av-pcard-checkin-tick {
  display: inline-flex;
  width: 14px; height: 14px;
  color: var(--sage);
}

.av-substitute { margin-top: 22px; }
.av-link-subtle {
  background: none;
  border: none;
  color: var(--brass);
  font-size: 12px;
  letter-spacing: 0.06em;
  border-bottom: 1px dashed var(--brass-soft);
  padding: 0 0 1px;
}
.av-substitute-panel {
  margin-top: 14px;
  border: 1px solid var(--rule);
  background: var(--vellum);
  border-radius: 4px;
  padding: 18px 20px;
}
.av-substitute-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--ink-soft);
  margin-bottom: 12px;
}
.av-substitute-list { list-style: none; margin: 0; padding: 0; }
.av-substitute-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--rule-soft);
}
.av-substitute-row:last-child { border-bottom: none; }
.av-substitute-name {
  font-family: 'Fraunces', serif;
  font-size: 16px;
  color: var(--ink);
}
.av-substitute-role {
  font-size: 12px;
  color: var(--ink-soft);
}

.av-catch {
  margin-top: 18px;
  border: 1px solid var(--sage);
  background: rgba(92,115,99,0.06);
  border-radius: 4px;
  padding: 16px 18px;
}
.av-catch-title {
  font-family: 'Fraunces', serif;
  font-size: 16px;
  color: var(--sage);
  margin-bottom: 6px;
}
.av-catch-body { font-size: 14px; color: var(--ink); margin: 0 0 12px; }
.av-catch-actions {
  display: flex; align-items: center; gap: 16px;
}
.av-catch-why {
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--sage);
  border-bottom: 1px dashed var(--sage-soft);
  padding-bottom: 1px;
}

/* ------ execution (stage 3) ------ */
.av-docnav {
  display: flex;
  gap: 8px;
}
.av-docnav-pip {
  width: 26px; height: 26px;
  border-radius: 50%;
  border: 1px solid var(--rule);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--ink-soft);
  background: var(--vellum);
}
.av-docnav-pip.is-now {
  border-color: var(--brass);
  color: var(--brass);
}
.av-docnav-pip.is-done {
  border-color: var(--sage);
  color: var(--sage);
  background: rgba(92,115,99,0.08);
}

.av-docpanel {
  border: 1px solid var(--rule);
  background: var(--vellum);
  border-radius: 4px;
  padding: 24px 26px;
  margin-top: 12px;
}
.av-docpanel-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 20px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--rule);
}
.av-docpanel-title {
  font-family: 'Fraunces', serif;
  font-size: 22px;
  color: var(--ink);
}
.av-docpanel-blurb {
  font-size: 13px;
  color: var(--ink-soft);
  font-style: italic;
}
.av-docpanel-note {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sage);
  text-align: right;
  max-width: 220px;
}

.av-signlist { list-style: none; margin: 0; padding: 0; }
.av-signrow {
  display: grid;
  grid-template-columns: 200px 1fr 80px 90px;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--rule-soft);
}
@media (max-width: 600px) {
  .av-signrow { grid-template-columns: 1fr; gap: 6px; }
}
.av-signrow:last-child { border-bottom: none; }
.av-signrow-name {
  font-family: 'Fraunces', serif;
  font-size: 15px;
  color: var(--ink);
}
.av-signline {
  position: relative;
  height: 26px;
  border-bottom: 1px solid var(--ink-soft);
  overflow: hidden;
}
.av-signline-draw {
  position: absolute;
  inset: 0 100% 0 0;
  border-bottom: 1.5px solid var(--brass);
  transition: inset 700ms ease-out;
}
.av-signrow.is-signed .av-signline-draw { inset: 0 0 0 0; }
.av-signline-script {
  position: absolute;
  left: 6px; bottom: 2px;
  font-family: 'Fraunces', serif;
  font-style: italic;
  color: var(--ink);
  font-size: 18px;
  opacity: 0;
  animation: av-fade-in 600ms 250ms forwards;
}
.av-signrow-ts {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--ink-soft);
}
.av-signrow-status {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-align: right;
}
.av-signrow.is-signed .av-signrow-status { color: var(--sage); }
.av-signrow.is-active .av-signrow-name { color: var(--brass); }

.av-affidavit {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px dashed var(--rule);
}
.av-affidavit-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.av-affidavit-eyebrow {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--brass);
}
.av-affidavit-why {
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--brass);
  border-bottom: 1px dashed var(--brass-soft);
  padding-bottom: 1px;
}
.av-affidavit-blurb {
  font-size: 13px;
  color: var(--ink-soft);
  font-style: italic;
  margin: 0 0 12px;
}

.av-docfoot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
  padding-top: 18px;
}
.av-docfoot-rule {
  width: 40%;
  height: 1px;
  background: var(--rule);
}
.av-docfoot-msg {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-soft);
}

/* ------ stage 4 ------ */
.av-seal-wrap { width: 72px; height: 72px; color: var(--sage); }
.av-seal { width: 100%; height: 100%; }
.av-preserved {
  border: 1px solid var(--sage);
  background: rgba(92,115,99,0.05);
  border-radius: 4px;
  padding: 24px 26px;
  margin-top: 22px;
}
.av-preserved-head {
  font-family: 'Fraunces', serif;
  font-size: 20px;
  color: var(--sage);
  margin-bottom: 8px;
}
.av-preserved-body {
  font-size: 14px;
  color: var(--ink);
  margin: 0 0 18px;
}
.av-preserved-list {
  list-style: none;
  margin: 0 0 18px;
  padding: 12px 16px;
  background: var(--vellum);
  border: 1px solid var(--rule-soft);
  border-radius: 4px;
  max-height: 260px;
  overflow-y: auto;
}
.av-preserved-item {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 12px;
  padding: 5px 0;
  font-size: 12px;
  border-bottom: 1px dotted var(--rule-soft);
}
.av-preserved-item:last-child { border-bottom: none; }
.av-preserved-t {
  font-family: 'JetBrains Mono', monospace;
  color: var(--sage);
}
.av-preserved-label { color: var(--ink); }
.av-payoff {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 16px;
  color: var(--ink);
  margin: 0;
  text-align: center;
}

/* ------ on file rail ------ */
.av-rail {
  background: var(--vellum);
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 22px 22px;
  position: sticky;
  top: 24px;
  align-self: start;
  height: fit-content;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}
@media (max-width: 880px) {
  .av-rail { position: static; max-height: none; }
}
.av-rail-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--rule);
  margin-bottom: 14px;
  color: var(--sage);
}
.av-rail-head .av-seal { width: 44px; height: 44px; }
.av-rail-title {
  font-family: 'Fraunces', serif;
  font-size: 18px;
  color: var(--ink);
  line-height: 1;
}
.av-rail-sub {
  font-size: 11px;
  color: var(--ink-soft);
  letter-spacing: 0.04em;
  margin-top: 4px;
}
.av-rail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}
.av-rail-item {
  display: grid;
  grid-template-columns: 16px 70px 1fr;
  gap: 8px;
  align-items: start;
  padding: 8px 0;
  border-bottom: 1px dotted var(--rule-soft);
  font-size: 12px;
}
.av-rail-item:last-child { border-bottom: none; }
.av-rail-tick { color: var(--brass); width: 14px; height: 14px; margin-top: 2px; }
.av-rail-t {
  font-family: 'JetBrains Mono', monospace;
  color: var(--sage);
  font-size: 11px;
}
.av-rail-label { color: var(--ink); line-height: 1.4; }

/* ------ footer ------ */
.av-foot {
  background: var(--vellum);
  border-top: 1px solid var(--rule);
  padding: 26px 28px;
}
.av-foot-inner {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
}
@media (max-width: 720px) {
  .av-foot-inner { grid-template-columns: 1fr; text-align: center; gap: 12px; }
}
.av-foot-firm { display: flex; flex-direction: column; gap: 4px; }
.av-foot-mark {
  font-family: 'Fraunces', serif;
  font-size: 14px;
  color: var(--ink);
}
.av-foot-meta {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.av-foot-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--sage);
  text-align: center;
}
.av-foot-back { text-align: right; }
@media (max-width: 720px) { .av-foot-back { text-align: center; } }
.av-foot-link {
  font-size: 12px;
  color: var(--brass);
  border-bottom: 1px dashed var(--brass-soft);
  padding-bottom: 1px;
  text-decoration: none;
}

/* ------ tooltips ------ */
.av-tt {
  position: relative;
  display: inline-block;
  cursor: help;
}
.av-tt-body {
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--ink);
  color: var(--vellum);
  font-size: 12px;
  font-style: normal;
  line-height: 1.45;
  padding: 8px 12px;
  border-radius: 3px;
  width: 240px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease;
  z-index: 10;
  text-align: left;
  letter-spacing: 0;
}
.av-tt:hover .av-tt-body,
.av-tt:focus-within .av-tt-body { opacity: 1; }

/* ------ icons ------ */
.av-tick { width: 100%; height: 100%; display: block; }

/* ------ in-product practice note ------ */
.av-whynote {
  border: 1px solid var(--brass-soft);
  background: rgba(168,129,75,0.05);
  border-radius: 4px;
  padding: 16px 20px 18px;
  margin: 8px 0 24px;
}
.av-whynote-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.av-whynote-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--brass);
}
.av-whynote-title {
  font-family: 'Fraunces', serif;
  font-size: 15px;
  color: var(--ink);
}
.av-whynote-body {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--ink);
}

/* ------ tour layer (portal at body) ------ */
.av-tour-layer { position: fixed; inset: 0; z-index: 9999; pointer-events: none; }
.av-tour-layer .av-cm,
.av-tour-layer .av-dim,
.av-tour-layer .av-cm-ring { pointer-events: auto; }
.av-dim {
  position: fixed;
  background: rgba(11, 16, 22, 0.58);
  transition: opacity 200ms ease;
}
.av-dim-full { inset: 0; }
.av-cm-ring {
  position: fixed;
  border: 1.5px solid var(--brass);
  border-radius: 6px;
  box-shadow: 0 0 0 9999px rgba(0,0,0,0), 0 8px 28px rgba(168,129,75,0.25);
  pointer-events: none;
  animation: av-ring-pulse 1800ms ease-out infinite;
}
@keyframes av-ring-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(168,129,75,0.45); }
  60%  { box-shadow: 0 0 0 10px rgba(168,129,75,0); }
  100% { box-shadow: 0 0 0 0 rgba(168,129,75,0); }
}

.av-cm {
  position: fixed;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 6px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.35);
  padding: 18px 20px 16px;
  font-family: 'Inter', sans-serif;
  color: var(--ink);
  animation: av-cm-in 240ms ease-out both;
}
@keyframes av-cm-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.av-cm-tail {
  position: absolute;
  width: 12px; height: 12px;
  background: var(--paper);
  border: 1px solid var(--rule);
  transform: rotate(45deg);
}
.av-cm-tail-bottom { top: -7px; left: 50%; margin-left: -6px; border-right: none; border-bottom: none; }
.av-cm-tail-top    { bottom: -7px; left: 50%; margin-left: -6px; border-left: none; border-top: none; }
.av-cm-tail-left   { top: 50%; right: -7px; margin-top: -6px; border-left: none; border-bottom: none; }
.av-cm-tail-right  { top: 50%; left: -7px; margin-top: -6px; border-right: none; border-top: none; }

.av-cm-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.av-cm-step {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--sage);
}
.av-cm-skip {
  background: none;
  border: none;
  color: var(--ink-soft);
  font-size: 11px;
  letter-spacing: 0.08em;
  border-bottom: 1px dashed var(--rule);
  padding: 0 0 1px;
  cursor: pointer;
}
.av-cm-skip:hover { color: var(--ink); border-bottom-color: var(--ink-soft); }
.av-cm-title {
  font-family: 'Fraunces', serif;
  font-size: 18px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}
.av-cm-body {
  font-size: 13px;
  line-height: 1.55;
  color: var(--ink-soft);
  margin: 0 0 14px;
}
.av-cm-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.av-cm-hint {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brass);
  font-family: 'JetBrains Mono', monospace;
}
.av-cm-next {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  background: var(--ink);
  color: var(--vellum);
  border: 1px solid var(--ink);
  padding: 8px 16px;
  border-radius: 3px;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
}
.av-cm-next:hover { background: var(--brass); border-color: var(--brass); }

.av-cm-floating {
  position: fixed;
  bottom: 24px;
  right: 24px;
  left: auto !important;
  top: auto !important;
  width: 320px !important;
  transform: none !important;
}
.av-cm-floating .av-cm-tail { display: none; }

@media (max-width: 600px) {
  .av-cm { width: calc(100vw - 24px) !important; left: 12px !important; }
  .av-cm-floating { right: 12px; bottom: 12px; }
}

/* ------ animations ------ */
.av-anim-fade { animation: av-fade-in 280ms ease-out both; }
@keyframes av-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
`}</style>
  );
}
