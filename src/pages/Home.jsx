import React, { useState, useEffect, useRef } from 'react';
const logo = '/logo.png';

const A = '#5366F3';
const AL = '#7B8AF7';
const MID = '#4F4F4F';
const TXT = '#EBEBEB';
const BG = '#0a0a0a';
const BG2 = '#0e0e0e';
const BGC = '#111111';
const BDR = '#1c1c1c';

const GRADER_QS = [
  { id: 1, q: "How do new clients first contact your firm?", opts: [
    { t: "They call and whoever answers takes notes on paper", s: 1 },
    { t: "They email or call — I manually enter info into a spreadsheet", s: 2 },
    { t: "They fill out a basic form on my website", s: 3 },
    { t: "Automated online form that routes to my case management system", s: 4 },
  ]},
  { id: 2, q: "How quickly do new leads get a response?", opts: [
    { t: "When I get around to it — sometimes days", s: 1 },
    { t: "Within 24 hours, usually", s: 2 },
    { t: "Same business day — I try to prioritize it", s: 3 },
    { t: "Automated acknowledgment within minutes, follow-up within hours", s: 4 },
  ]},
  { id: 3, q: "What happens with client documents during intake?", opts: [
    { t: "They bring physical copies — I keep a paper folder", s: 1 },
    { t: "They email docs and I save them in folders on my computer", s: 2 },
    { t: "They upload to a shared drive or portal", s: 3 },
    { t: "Secure client portal with automated document requests and tracking", s: 4 },
  ]},
  { id: 4, q: "How do you screen for conflicts of interest?", opts: [
    { t: "I rely on memory", s: 1 },
    { t: "I search my email and old files manually", s: 2 },
    { t: "I have a spreadsheet or database I check", s: 3 },
    { t: "Automated conflict check integrated with my intake process", s: 4 },
  ]},
  { id: 5, q: "What does your fee agreement process look like?", opts: [
    { t: "I explain fees verbally and sometimes follow up with a letter", s: 1 },
    { t: "I have a standard template I edit and email for signature", s: 2 },
    { t: "Clients sign digitally via DocuSign or similar", s: 3 },
    { t: "Auto-generated from intake data, e-signed, and filed — no manual steps", s: 4 },
  ]},
  { id: 6, q: "How do you track where each new matter stands in the intake pipeline?", opts: [
    { t: "I keep it in my head", s: 1 },
    { t: "Sticky notes, a notebook, or a to-do list", s: 2 },
    { t: "A spreadsheet with statuses", s: 3 },
    { t: "CRM or practice management software with pipeline stages", s: 4 },
  ]},
];

function getGrade(score) {
  const pct = (score / 24) * 100;
  if (pct >= 85) return { l: 'A', lb: 'Excellent', c: '#22c55e', s: "Your intake system is well-built. You're ahead of 90% of solo practitioners. Minor optimizations could still save you hours per month.", r: ["Consider adding automated follow-up sequences for leads that don't convert immediately.", "Audit your process quarterly — even good systems drift.", "Look into client satisfaction surveys post-intake to catch friction points."] };
  if (pct >= 70) return { l: 'B', lb: 'Solid', c: '#84cc16', s: "You've got the bones of a good system, but there are gaps costing you time and probably clients. The leads that slip through those gaps? They're hiring your competitors.", r: ["Automate your initial response — every hour of delay drops conversion rates by 10%.", "Move document collection to a secure portal. Email attachments are a liability risk.", "Build a conflict check into your intake form so it happens before you invest time in a consultation."] };
  if (pct >= 50) return { l: 'C', lb: 'Needs Work', c: '#eab308', s: "You're running on manual effort and it's costing you. Every hour you spend on admin intake tasks is an hour you're not billing.", r: ["Priority one: automate your first response.", "Get your fee agreements into a digital signature workflow — this alone saves 2-3 hours per week.", "Track your pipeline somewhere other than your head.", "Consider a full intake system audit to identify exactly where your process breaks down."] };
  if (pct >= 30) return { l: 'D', lb: 'At Risk', c: '#f97316', s: "Your intake process has serious gaps that are actively costing you revenue and creating compliance risk.", r: ["You need a structured intake workflow — not a better to-do list, an actual system.", "Document collection via email is a malpractice risk. Move to a secure portal immediately.", "Your response time is likely your biggest revenue leak.", "A full operational audit would identify exactly how much revenue you're leaving on the table.", "This is fixable — the ones who fix it see 20-40% more conversions."] };
  return { l: 'F', lb: 'Critical', c: '#ef4444', s: "Your intake process needs immediate attention. You're almost certainly losing more clients than you're signing.", r: ["Stop everything and build a basic intake form. Even a Google Form is better than what you have now.", "Set up an auto-responder today. It takes 15 minutes and it's the single highest-ROI change you can make.", "You need professional help rebuilding this from the ground up. A proper intake system pays for itself within 60 days.", "Every week you operate like this costs you 3-5 potential clients."] };
}

const IntakeGrader = () => {
  const [cq, setCq] = useState(0);
  const [ans, setAns] = useState({});
  const [done, setDone] = useState(false);
  const [sel, setSel] = useState(null);
  const ref = useRef(null);

  const pick = (id, sc) => {
    setSel(sc);
    setTimeout(() => {
      const na = { ...ans, [id]: sc };
      setAns(na); setSel(null);
      if (cq < GRADER_QS.length - 1) setCq(cq + 1);
      else { setDone(true); setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }
    }, 300);
  };

  const total = Object.values(ans).reduce((a, b) => a + b, 0);
  const g = getGrade(total);
  const pct = ((cq + (done ? 1 : 0)) / GRADER_QS.length) * 100;
  const reset = () => { setCq(0); setAns({}); setDone(false); setSel(null); };

  if (done) return (
    <div ref={ref} style={{ animation: 'fadeUp 0.6s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 120, height: 120, borderRadius: '50%', border: `3px solid ${g.c}`, background: `${g.c}11`, marginBottom: 16 }}>
          <span style={{ fontSize: 56, fontWeight: 800, color: g.c, fontFamily: "'Playfair Display', serif" }}>{g.l}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: g.c, marginBottom: 8 }}>{g.lb}</div>
        <div style={{ fontSize: 13, color: MID, fontFamily: "'DM Mono', monospace" }}>{total} / 24 points</div>
      </div>
      <div style={{ padding: '28px 32px', marginBottom: 32, borderLeft: `2px solid ${g.c}`, background: BG }}><p style={{ fontSize: 16, lineHeight: 1.7, color: '#ccc', margin: 0 }}>{g.s}</p></div>
      <div style={{ marginBottom: 32 }}>
        <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: MID, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>Recommendations</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {g.r.map((rec, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 20px', background: BG, borderRadius: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: g.c, fontFamily: "'DM Mono', monospace", flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: '#bbb', margin: 0 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '32px', background: BG, border: `1px solid ${BDR}`, textAlign: 'center' }}>
        <p style={{ fontSize: 18, fontWeight: 600, color: TXT, marginBottom: 8 }}>Want to fix this?</p>
        <p style={{ fontSize: 14, color: MID, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>I build intake systems for solo practitioners that actually work. Most of my clients see results within 30 days.</p>
        <a href="#contact" style={{ display: 'inline-block', padding: '14px 40px', background: A, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>Request an Audit</a>
      </div>
      <button onClick={reset} style={{ display: 'block', margin: '24px auto 0', padding: '10px 24px', background: 'transparent', border: `1px solid #333`, color: MID, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Retake Assessment</button>
    </div>
  );

  const q = GRADER_QS[cq];
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: MID, fontFamily: "'DM Mono', monospace" }}>QUESTION {cq + 1} OF {GRADER_QS.length}</span>
          <span style={{ fontSize: 11, color: '#444', fontFamily: "'DM Mono', monospace" }}>{Math.round(pct)}%</span>
        </div>
        <div style={{ height: 2, background: '#1a1a1a', borderRadius: 1 }}><div style={{ height: '100%', background: `linear-gradient(90deg, ${A}, ${AL})`, borderRadius: 1, width: `${pct}%`, transition: 'width 0.4s ease' }} /></div>
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 600, color: TXT, marginBottom: 28, lineHeight: 1.5, fontFamily: "'Playfair Display', serif" }}>{q.q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.opts.map((o, i) => (
          <button key={i} onClick={() => pick(q.id, o.s)} style={{ padding: '16px 20px', background: sel === o.s ? `${A}15` : BG, border: sel === o.s ? `1px solid ${A}` : `1px solid #1a1a1a`, color: sel === o.s ? AL : '#bbb', fontSize: 14, lineHeight: 1.5, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', borderRadius: 2 }} onMouseEnter={e => { if (sel !== o.s) { e.target.style.borderColor = '#333'; e.target.style.color = TXT; }}} onMouseLeave={e => { if (sel !== o.s) { e.target.style.borderColor = '#1a1a1a'; e.target.style.color = '#bbb'; }}}>{o.t}</button>
        ))}
      </div>
    </div>
  );
};

const PayPalButton = () => {
  const containerRef = useRef(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    const interval = setInterval(() => {
      if (window.paypal && window.paypal.HostedButtons && containerRef.current) {
        clearInterval(interval);
        rendered.current = true;
        window.paypal.HostedButtons({
          hostedButtonId: "XPWQ88B2QH35W"
        }).render(containerRef.current);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} style={{ minHeight: 52 }} />;
};

const ContactForm = () => {
  const [f, setF] = useState({ name: '', email: '', practice: '', pain: '', message: '' });
  const [st, setSt] = useState('idle');
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault(); setSt('sending');
    try {
      const r = await fetch('https://formspree.io/f/xpwdjqkn', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: f.name, email: f.email, practice_area: f.practice, biggest_pain_point: f.pain, message: f.message }) });
      if (r.ok) { setSt('sent'); setF({ name: '', email: '', practice: '', pain: '', message: '' }); } else setSt('error');
    } catch { setSt('error'); }
  };

  const inp = { width: '100%', padding: '14px 18px', background: '#111', border: `1px solid #222`, color: TXT, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s', borderRadius: 2 };
  const lbl = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MID, marginBottom: 8, fontFamily: "'DM Mono', monospace" };
  const selStyle = { ...inp, color: '#888', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234F4F4F' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' };

  if (st === 'sent') return (
    <div style={{ textAlign: 'center', padding: '48px 32px' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${A}22`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <span style={{ color: A, fontSize: 28 }}>{'✓'}</span>
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 700, color: TXT, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>Message received.</h3>
      <p style={{ fontSize: 15, color: MID, lineHeight: 1.6 }}>I will be in touch within one business day.</p>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label style={lbl}>Name</label><input required type="text" value={f.name} onChange={e => u('name', e.target.value)} placeholder="Your name" style={inp} onFocus={e => e.target.style.borderColor = A} onBlur={e => e.target.style.borderColor = '#222'} /></div>
        <div><label style={lbl}>Email</label><input required type="email" value={f.email} onChange={e => u('email', e.target.value)} placeholder="you@firm.com" style={inp} onFocus={e => e.target.style.borderColor = A} onBlur={e => e.target.style.borderColor = '#222'} /></div>
      </div>
      <div><label style={lbl}>Practice Area</label>
        <select value={f.practice} onChange={e => u('practice', e.target.value)} style={{ ...selStyle, color: f.practice ? TXT : '#666' }} onFocus={e => e.target.style.borderColor = A} onBlur={e => e.target.style.borderColor = '#222'}>
          <option value="" disabled>Select your practice area</option>
          {['Family Law','Criminal Defense','Personal Injury','Estate Planning','Immigration','Business / Corporate','Real Estate','Employment Law','Bankruptcy','General Practice','Other'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div><label style={lbl}>Biggest Pain Point</label>
        <select value={f.pain} onChange={e => u('pain', e.target.value)} style={{ ...selStyle, color: f.pain ? TXT : '#666' }} onFocus={e => e.target.style.borderColor = A} onBlur={e => e.target.style.borderColor = '#222'}>
          <option value="" disabled>What keeps you up at night?</option>
          {['Client intake is a mess','Losing leads / slow response time','Drowning in admin work','No systems / everything is manual','Tech stack is confusing or underused','Document management / compliance gaps','Billing and collections','Growing but cannot scale','Other'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div><label style={lbl}>Message</label><textarea required value={f.message} onChange={e => u('message', e.target.value)} placeholder="Tell me about your practice and what you need help with..." rows={5} style={{ ...inp, resize: 'vertical', minHeight: 120 }} onFocus={e => e.target.style.borderColor = A} onBlur={e => e.target.style.borderColor = '#222'} /></div>
      <button type="submit" disabled={st === 'sending'} style={{ padding: '16px 48px', background: A, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', border: 'none', cursor: st === 'sending' ? 'wait' : 'pointer', transition: 'all 0.25s', borderRadius: 2, opacity: st === 'sending' ? 0.7 : 1, alignSelf: 'flex-start' }} onMouseEnter={e => { if (st !== 'sending') e.target.style.background = AL; }} onMouseLeave={e => e.target.style.background = A}>{st === 'sending' ? 'Sending...' : 'Send Message'}</button>
      {st === 'error' && <p style={{ fontSize: 13, color: '#ef4444' }}>Something went wrong. Try emailing admin@vvvdigitals.com directly.</p>}
    </form>
  );
};

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet'; document.head.appendChild(link);
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  const sx = { maxWidth: 960, margin: '0 auto', padding: '0 24px' };

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TXT, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        ::selection { background: ${A}; color: #fff; }
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; margin: 0; }
        select option { background: #111; color: ${TXT}; }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-toggle { display: block !important; } .about-grid, .form-row { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) { .mobile-toggle { display: none !important; } .mobile-menu { display: none !important; } }
      `}</style>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? `1px solid ${BDR}` : '1px solid transparent', transition: 'all 0.3s', overflow: 'visible' }}>
        <div style={{ ...sx, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px' }}>
          <a href="#"><img src={logo} alt="VVV Digitals" style={{ height: 72, display: 'block' }} /></a>
          <nav className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {['Services','Tools','Products','About'].map(i => <a key={i} href={`#${i.toLowerCase()}`} style={{ color: MID, fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s', fontFamily: "'DM Mono', monospace" }} onMouseEnter={e => e.target.style.color = TXT} onMouseLeave={e => e.target.style.color = MID}>{i}</a>)}
            <a href="#contact" style={{ padding: '10px 24px', background: A, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2, fontFamily: "'DM Mono', monospace", transition: 'background 0.25s' }} onMouseEnter={e => e.target.style.background = AL} onMouseLeave={e => e.target.style.background = A}>Contact</a>
          </nav>
          <button className="mobile-toggle" onClick={() => setMobileNav(!mobileNav)} style={{ background: 'none', border: 'none', color: MID, fontSize: 24, cursor: 'pointer', padding: 8 }}>{mobileNav ? '✕' : '☰'}</button>
        </div>
        {mobileNav && <div className="mobile-menu" style={{ padding: '16px 24px', borderTop: `1px solid ${BDR}`, display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(10,10,10,0.97)' }}>
          {['Services','Tools','Products','About'].map(i => <a key={i} href={`#${i.toLowerCase()}`} onClick={() => setMobileNav(false)} style={{ color: '#bbb', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: "'DM Mono', monospace" }}>{i}</a>)}
          <a href="#contact" onClick={() => setMobileNav(false)} style={{ color: A, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Contact</a>
        </div>}
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 100, paddingBottom: 120 }}>
        <div style={{ ...sx, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: A, marginBottom: 32, fontFamily: "'DM Mono', monospace", animation: 'fadeIn 1s' }}>Operational Consulting for Legal Professionals</div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28, color: TXT, fontFamily: "'Playfair Display', serif", animation: 'fadeUp 0.8s' }}>Your practice runs on systems.<br /><span style={{ color: A, fontStyle: 'italic' }}>Most of them are broken.</span></h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: MID, maxWidth: 580, margin: '0 auto 48px', animation: 'fadeUp 0.8s 0.15s both' }}>15 years in banking, insurance, and risk assessment — now applied to the firms that need it most. I fix the operational chaos that keeps solo attorneys buried in admin instead of practicing law.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.8s 0.3s both' }}>
            <a href="#tools" style={{ padding: '16px 40px', background: TXT, color: '#111', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2, transition: 'all 0.25s' }} onMouseEnter={e => { e.target.style.background = A; e.target.style.color = '#fff'; }} onMouseLeave={e => { e.target.style.background = TXT; e.target.style.color = '#111'; }}>Grade Your Intake System</a>
            <a href="#services" style={{ padding: '16px 40px', background: 'transparent', border: `1px solid ${MID}`, color: '#bbb', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2, transition: 'all 0.25s' }} onMouseEnter={e => { e.target.style.borderColor = TXT; e.target.style.color = TXT; }} onMouseLeave={e => { e.target.style.borderColor = MID; e.target.style.color = '#bbb'; }}>View Services</a>
          </div>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section style={{ borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}`, padding: '40px 0', background: BG2 }}>
        <div style={{ ...sx, display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {['15+ Years Financial Services','U.S. Army Veteran','Woman-Owned Business','Arizona-Based'].map((t, i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: MID, fontFamily: "'DM Mono', monospace" }}>{t}</span>)}
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: '100px 0' }}>
        <div style={sx}><div style={{ maxWidth: 680 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: MID, marginBottom: 24, fontFamily: "'DM Mono', monospace" }}>THE PROBLEM</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.35, color: TXT, marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>You went to law school to practice law. Not to troubleshoot your CRM at 11pm.</h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: MID, marginBottom: 20 }}>Solo practitioners lose an average of 10-15 hours per week on operational tasks that should be automated. That is $15,000-$30,000 in unbilled time every month.</p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: MID, marginBottom: 20 }}>Your intake process leaks clients. Your document management creates liability. Your billing workflow costs you money you do not even know you are losing.</p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: TXT, fontWeight: 600 }}>I have spent 15 years finding exactly these kinds of operational failures in banking and insurance. Now I find them in your practice — and I fix them.</p>
        </div></div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 0', background: BG2, borderTop: `1px solid ${BDR}` }}>
        <div style={sx}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: A, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>SERVICES</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: TXT, fontFamily: "'Playfair Display', serif" }}>How I Help</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { tag: 'OPERATIONS', title: 'Workflow Optimization', desc: 'Full audit and rebuild of your practice operations — client intake, document management, billing, and case tracking.', price: 'From $2,500' },
              { tag: 'SYSTEMS', title: 'Intake System Design', desc: 'Custom-built client intake workflows that automate first contact through signed engagement. Reduce intake admin by 40-60%.', price: 'From $3,500' },
              { tag: 'CONTRACTS', title: 'Contract Review', desc: 'Plain-English translation and risk analysis of business contracts. 15 years finding where money disappears in fine print.', price: 'From $200' },
              { tag: 'COMPLIANCE', title: 'Risk & Compliance Audit', desc: 'Operational risk assessment for your practice. Compliance gaps, document vulnerabilities, and process failures identified.', price: 'From $1,500' },
              { tag: 'TECHNOLOGY', title: 'Tech Stack Setup', desc: 'I select, configure, and integrate the right practice management tools for your firm.', price: 'From $2,000' },
              { tag: 'ONGOING', title: 'Monthly Retainer', desc: 'Ongoing operational support. I keep your systems running and continuously improve workflows as your practice grows.', price: '$500–1,500/mo' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '36px 32px', background: BGC, border: `1px solid ${BDR}`, transition: 'border-color 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'} onMouseLeave={e => e.currentTarget.style.borderColor = BDR}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: A, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>{s.tag}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: TXT, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: MID, marginBottom: 20 }}>{s.desc}</p>
                <div style={{ fontSize: 13, fontWeight: 600, color: TXT, fontFamily: "'DM Mono', monospace" }}>{s.price}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="#contact" style={{ display: 'inline-block', padding: '16px 48px', background: TXT, color: '#111', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2, transition: 'all 0.25s' }} onMouseEnter={e => { e.target.style.background = A; e.target.style.color = '#fff'; }} onMouseLeave={e => { e.target.style.background = TXT; e.target.style.color = '#111'; }}>Request a Consultation</a>
          </div>
        </div>
      </section>

      {/* GRADER */}
      <section id="tools" style={{ padding: '100px 0', borderTop: `1px solid ${BDR}` }}>
        <div style={sx}><div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', border: `1px solid ${A}33`, color: A, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>Free Assessment</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: TXT, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Intake System Grader</h2>
            <p style={{ fontSize: 15, color: MID, lineHeight: 1.7 }}>Six questions. Sixty seconds. Find out if your client intake process is costing you cases.</p>
          </div>
          <div style={{ padding: '40px 36px', background: BGC, border: `1px solid ${BDR}` }}><IntakeGrader /></div>
        </div></div>
      </section>

      {/* PRODUCTS */}
      <section id="products" style={{ padding: '100px 0', background: BG2, borderTop: `1px solid ${BDR}` }}>
        <div style={sx}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: A, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>DIGITAL PRODUCTS</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: TXT, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Self-Service Solutions</h2>
            <p style={{ fontSize: 15, color: MID, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>Not ready for a full engagement? These tools give you a head start.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{ padding: '36px 32px', background: BGC, border: `1px solid ${BDR}`, transition: 'border-color 0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'} onMouseLeave={e => e.currentTarget.style.borderColor = BDR}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: A, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>THE MISSING GUIDES</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: TXT, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Step-by-Step Recovery Guides</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: MID, marginBottom: 20 }}>Personalized guides for navigating insurance claims, housing recovery, legal self-representation, and more.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {['Insurance Claims','Housing Recovery','LLC Formation','VA Claims'].map((t, i) => <span key={i} style={{ padding: '4px 12px', background: '#161616', fontSize: 11, color: MID, fontFamily: "'DM Mono', monospace" }}>{t}</span>)}
              </div>
              <a href="https://themissingguides.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 28px', border: `1px solid ${MID}`, color: '#bbb', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.25s' }} onMouseEnter={e => { e.target.style.borderColor = A; e.target.style.color = A; }} onMouseLeave={e => { e.target.style.borderColor = MID; e.target.style.color = '#bbb'; }}>Visit Site</a>
            </div>
            <div style={{ padding: '36px 32px', background: BGC, border: `1px solid ${BDR}`, transition: 'border-color 0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'} onMouseLeave={e => e.currentTarget.style.borderColor = BDR}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: A, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>TRUTHSEEKER</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: TXT, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>AI Forensic Analysis</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: MID, marginBottom: 20 }}>Romance scam detection and digital evidence authentication for victims and legal professionals.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {['Scam Detection','Evidence Auth','Legal Analysis','AI-Powered'].map((t, i) => <span key={i} style={{ padding: '4px 12px', background: '#161616', fontSize: 11, color: MID, fontFamily: "'DM Mono', monospace" }}>{t}</span>)}
              </div>
              <span style={{ display: 'inline-block', padding: '12px 28px', border: '1px solid #222', color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '100px 0', borderTop: `1px solid ${BDR}` }}>
        <div style={sx}>
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: A, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>ABOUT</div>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: TXT, marginBottom: 20, lineHeight: 1.3, fontFamily: "'Playfair Display', serif" }}>I have spent my career finding where systems fail.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: MID, marginBottom: 16 }}>15 years in banking and insurance taught me one thing: every business bleeds money through bad processes.</p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: MID, marginBottom: 16 }}>As a U.S. Army veteran, I bring that discipline to every engagement. As someone who has navigated the legal system as a pro se litigant, I understand the exact pain points solo attorneys face.</p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: TXT, fontWeight: 500 }}>I do not just consult. I build the systems, implement the tools, and make sure they work before I leave.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[{ n: '15+', l: 'Years in Financial Services' }, { n: '40–60%', l: 'Avg. Admin Time Reduction' }, { n: '30', l: 'Days to See Results' }, { n: '3', l: 'Revenue Streams, One Firm' }].map((s, i) => (
                <div key={i} style={{ padding: '24px 28px', background: BGC, border: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: A, fontFamily: "'Playfair Display', serif", minWidth: 80 }}>{s.n}</span>
                  <span style={{ fontSize: 14, color: MID }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '100px 0', background: BG2, borderTop: `1px solid ${BDR}` }}>
        <div style={sx}><div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: A, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>GET IN TOUCH</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: TXT, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Start a Conversation</h2>
            <p style={{ fontSize: 15, color: MID, lineHeight: 1.7 }}>No pitch, no pressure — just an honest assessment of what is working and what is not.</p>
          </div>
          <div style={{ padding: '40px 36px', background: BGC, border: `1px solid ${BDR}` }}><ContactForm /></div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <p style={{ fontSize: 12, color: '#444', fontFamily: "'DM Mono', monospace" }}>Or email directly: <a href="mailto:admin@vvvdigitals.com" style={{ color: A, textDecoration: 'none' }}>admin@vvvdigitals.com</a></p>
          </div>
        </div></div>
      </section>

      {/* PAY ME */}
      <section id="pay" style={{ padding: '80px 0', borderTop: `1px solid ${BDR}` }}>
        <div style={{ ...sx, maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: A, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>PAYMENT</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: TXT, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Send a Payment</h2>
          <p style={{ fontSize: 14, color: MID, lineHeight: 1.7, marginBottom: 32 }}>Ready to get started? Use the button below to submit a payment securely via PayPal or Venmo.</p>
          <div style={{ padding: '32px', background: BGC, border: `1px solid ${BDR}`, borderRadius: 4 }}>
            <PayPalButton />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BDR}`, padding: '48px 0', background: BG }}>
        <div style={sx}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div><img src={logo} alt="VVV Digitals" style={{ height: 56, marginBottom: 8 }} /><p style={{ fontSize: 12, color: '#444', fontFamily: "'DM Mono', monospace" }}>Operational Consulting & Digital Solutions</p></div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="/docs/privacy-policy.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#444', textDecoration: 'none', fontFamily: "'DM Mono', monospace" }}>Privacy</a>
              <a href="/docs/terms-of-service.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#444', textDecoration: 'none', fontFamily: "'DM Mono', monospace" }}>Terms</a>
              <a href="mailto:admin@vvvdigitals.com" style={{ fontSize: 11, color: A, textDecoration: 'none', fontFamily: "'DM Mono', monospace" }}>admin@vvvdigitals.com</a>
            </div>
          </div>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${BDR}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 11, color: '#333', fontFamily: "'DM Mono', monospace" }}>{'©'} {new Date().getFullYear()} VVV Digitals LLC. All rights reserved.</p>
            <p style={{ fontSize: 11, color: '#333', fontFamily: "'DM Mono', monospace" }}>Glendale, Arizona</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
