import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Nav from '../components/Nav';

// ─── Blinking Avatar ──────────────────────────────────────────────────────────
const BlinkingAvatar = () => (
  <div style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
    <iframe
      src="/avatar.html"
      scrolling="no"
      title="Brit — Founder, VVV Digitals"
      style={{
        width: '100%',
        height: 640,
        border: 'none',
        display: 'block',
        overflow: 'hidden',
      }}
    />
  </div>
);

// ─── Tokens ───────────────────────────────────────────────────────────────────
const BG   = '#080d14';
const BG2  = '#0c1220';
const BGC  = '#0f1520';
const BDR  = '#1a2332';
const ACC  = '#3B6EF8';
const ACCL = '#6b93fa';
const MID  = '#4a5568';
const TXT  = '#E8EDF5';
const MONO = "'DM Mono', monospace";
const HEAD = "'Bebas Neue', cursive";
const SANS = "'DM Sans', sans-serif";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const FadeUp = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

const Label = ({ children }) => (
  <div style={{
    fontFamily: MONO, fontSize: 10, fontWeight: 500,
    letterSpacing: '0.22em', textTransform: 'uppercase',
    color: ACC, marginBottom: 20,
    display: 'flex', alignItems: 'center', gap: 12,
  }}>
    <span style={{ width: 32, height: 1, background: ACC, display: 'inline-block' }} />
    {children}
  </div>
);

const Divider = () => (
  <div style={{ width: '100%', height: 1, background: BDR }} />
);

// ─── Operations Grader ────────────────────────────────────────────────────────
const GRADER_QS = [
  { id: 1, q: "How do new leads first reach your business?",
    opts: [
      { t: "They call or DM — whoever answers takes notes however they can", s: 1 },
      { t: "They email or call — I manually enter info into a spreadsheet", s: 2 },
      { t: "They fill out a basic form on my website", s: 3 },
      { t: "Automated intake form that routes directly into my CRM", s: 4 },
    ]},
  { id: 2, q: "How quickly do new leads get a response?",
    opts: [
      { t: "When I get around to it — sometimes days", s: 1 },
      { t: "Within 24 hours, usually", s: 2 },
      { t: "Same business day — I try to prioritize it", s: 3 },
      { t: "Automated acknowledgment within minutes, follow-up within hours", s: 4 },
    ]},
  { id: 3, q: "How are your core business processes documented?",
    opts: [
      { t: "They're not — it lives in my head or my team's heads", s: 1 },
      { t: "Some things are written down in emails or notes", s: 2 },
      { t: "I have basic checklists or a shared doc", s: 3 },
      { t: "Full SOPs documented, versioned, and accessible to the whole team", s: 4 },
    ]},
  { id: 4, q: "How do you manage your CRM and client pipeline?",
    opts: [
      { t: "I don't have a CRM — I use my inbox", s: 1 },
      { t: "I track leads in a spreadsheet", s: 2 },
      { t: "I use a CRM but it's not fully set up or consistently used", s: 3 },
      { t: "CRM is configured, maintained, and drives my sales process", s: 4 },
    ]},
  { id: 5, q: "What does your client onboarding process look like?",
    opts: [
      { t: "I figure it out each time", s: 1 },
      { t: "I have some standard emails I send manually", s: 2 },
      { t: "Clients sign agreements digitally and get a welcome packet", s: 3 },
      { t: "Fully automated sequence — contract, onboarding, kickoff, all triggered on sign", s: 4 },
    ]},
  { id: 6, q: "How do you track where new business stands in your pipeline?",
    opts: [
      { t: "I keep it in my head", s: 1 },
      { t: "Sticky notes, a notebook, or a to-do list", s: 2 },
      { t: "A spreadsheet with statuses", s: 3 },
      { t: "CRM with pipeline stages, automations, and reporting", s: 4 },
    ]},
];

function getGrade(score) {
  const pct = (score / 24) * 100;
  if (pct >= 85) return { l:'A', lb:'Excellent', c:'#22c55e', s:"Your operations are well-built. You're ahead of 90% of small businesses at your stage.", r:["Consider automated follow-up sequences for unconverted leads.","Audit your systems quarterly as you scale.","Add client satisfaction checkpoints to your onboarding flow."] };
  if (pct >= 70) return { l:'B', lb:'Solid', c:'#84cc16', s:"Good bones, but gaps are costing you clients. The leads that slip through? They're hiring someone else.", r:["Automate initial response — every hour of delay drops conversion 10%.","Get your SOPs documented before you add headcount.","Fully configure your CRM — a half-setup CRM is worse than none."] };
  if (pct >= 50) return { l:'C', lb:'Needs Work', c:'#eab308', s:"You're running on manual effort and it's costing you. Every hour spent on admin is an hour not spent on revenue.", r:["Automate your first lead response immediately.","Document your top 3 processes this week.","Track your pipeline somewhere other than your head."] };
  if (pct >= 30) return { l:'D', lb:'At Risk', c:'#f97316', s:"Serious operational gaps — actively costing you revenue and limiting your ability to scale.", r:["You need structured workflows, not a better to-do list.","Without SOPs, every new hire is a liability.","A full systems audit would show exactly what you're leaving on the table."] };
  return { l:'F', lb:'Critical', c:'#ef4444', s:"Your operations need immediate attention. You're losing business faster than you can replace it.", r:["Build a basic intake form today — even a Google Form is a start.","Set up an auto-responder. 15 minutes of work, highest ROI change you can make.","Every week without systems costs you 3–5 potential clients."] };
}

const IntakeGrader = () => {
  const [cq,  setCq]  = useState(0);
  const [ans, setAns] = useState({});
  const [done, setDone] = useState(false);
  const [sel,  setSel]  = useState(null);
  const ref = useRef(null);

  const pick = (id, sc) => {
    setSel(sc);
    setTimeout(() => {
      const na = { ...ans, [id]: sc };
      setAns(na); setSel(null);
      if (cq < GRADER_QS.length - 1) setCq(cq + 1);
      else { setDone(true); setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }
    }, 280);
  };

  const total = Object.values(ans).reduce((a, b) => a + b, 0);
  const g     = getGrade(total);
  const pct   = ((cq + (done ? 1 : 0)) / GRADER_QS.length) * 100;
  const reset = () => { setCq(0); setAns({}); setDone(false); setSel(null); };

  const optBase = {
    padding: '14px 18px', background: BGC,
    border: `1px solid ${BDR}`, color: '#8a9ab5',
    fontSize: 13, lineHeight: 1.6, textAlign: 'left',
    cursor: 'pointer', transition: 'all 0.18s', borderRadius: 2,
    fontFamily: SANS,
  };

  if (done) return (
    <div ref={ref}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 100, height: 100, borderRadius: '50%',
                      border: `2px solid ${g.c}`, background: `${g.c}10`, marginBottom: 12 }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: g.c, fontFamily: HEAD }}>{g.l}</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: g.c, marginBottom: 4, fontFamily: MONO }}>{g.lb}</div>
        <div style={{ fontSize: 12, color: MID, fontFamily: MONO }}>{total} / 24</div>
      </div>
      <div style={{ padding: '24px 28px', marginBottom: 24, borderLeft: `2px solid ${g.c}`, background: BG }}>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: '#9aaccc', margin: 0 }}>{g.s}</p>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: MID, marginBottom: 16, fontFamily: MONO }}>Recommendations</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {g.r.map((rec, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 18px', background: BG, borderRadius: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: g.c, fontFamily: MONO, flexShrink: 0 }}>{String(i+1).padStart(2,'0')}</span>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#7a8ba8', margin: 0 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '28px', background: BG, border: `1px solid ${BDR}`, textAlign: 'center' }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: TXT, fontFamily: HEAD, letterSpacing: '0.05em', marginBottom: 6 }}>Want to fix this?</p>
        <p style={{ fontSize: 13, color: MID, marginBottom: 20 }}>I build operational systems that actually work. Most clients see results in 30 days.</p>
        <a href="#contact" style={{ display: 'inline-block', padding: '12px 36px', background: ACC, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2, fontFamily: MONO }}>Request an Audit</a>
      </div>
      <button onClick={reset} style={{ display: 'block', margin: '20px auto 0', padding: '8px 20px', background: 'transparent', border: `1px solid ${BDR}`, color: MID, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: MONO }}>Retake</button>
    </div>
  );

  const q = GRADER_QS[cq];
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: MID, fontFamily: MONO }}>Q {cq+1} / {GRADER_QS.length}</span>
          <span style={{ fontSize: 10, color: '#2d3a4a', fontFamily: MONO }}>{Math.round(pct)}%</span>
        </div>
        <div style={{ height: 1, background: '#131e2e' }}>
          <div style={{ height: '100%', background: ACC, width: `${pct}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 500, color: TXT, marginBottom: 24, lineHeight: 1.55, fontFamily: SANS }}>{q.q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.opts.map((o, i) => (
          <button key={i} onClick={() => pick(q.id, o.s)}
            style={{ ...optBase, borderColor: sel === o.s ? ACC : BDR, color: sel === o.s ? TXT : '#8a9ab5', background: sel === o.s ? `${ACC}12` : BGC }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${ACC}66`; e.currentTarget.style.color = TXT; }}
            onMouseLeave={e => { if (sel !== o.s) { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.color = '#8a9ab5'; } }}>
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── PayPal ───────────────────────────────────────────────────────────────────
const PayPalButton = () => {
  const containerRef = useRef(null);
  const rendered     = useRef(false);
  useEffect(() => {
    if (rendered.current) return;
    const interval = setInterval(() => {
      if (window.paypal?.HostedButtons && containerRef.current) {
        clearInterval(interval);
        rendered.current = true;
        window.paypal.HostedButtons({ hostedButtonId: "XPWQ88B2QH35W" }).render(containerRef.current);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);
  return <div ref={containerRef} style={{ minHeight: 52 }} />;
};

// ─── Contact Form ─────────────────────────────────────────────────────────────
const ContactForm = () => {
  const [f,  setF]  = useState({ name: '', email: '', industry: '', pain: '', message: '' });
  const [st, setSt] = useState('idle');
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault(); setSt('sending');
    try {
      const r = await fetch('https://formspree.io/f/xpwdjqkn', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.name, email: f.email, industry: f.industry, biggest_pain_point: f.pain, message: f.message }),
      });
      if (r.ok) { setSt('sent'); setF({ name: '', email: '', industry: '', pain: '', message: '' }); }
      else setSt('error');
    } catch { setSt('error'); }
  };

  const inp = { width: '100%', padding: '13px 16px', background: '#0c1220', border: `1px solid ${BDR}`, color: TXT, fontSize: 13, fontFamily: SANS, outline: 'none', borderRadius: 2, transition: 'border-color 0.2s' };
  const lbl = { display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: MID, marginBottom: 8, fontFamily: MONO };

  if (st === 'sent') return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${ACC}18`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <span style={{ color: ACC, fontSize: 22 }}>✓</span>
      </div>
      <h3 style={{ fontSize: 28, color: TXT, marginBottom: 8, fontFamily: HEAD, letterSpacing: '0.05em' }}>Message Received.</h3>
      <p style={{ fontSize: 13, color: MID }}>I'll be in touch within one business day.</p>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="vvv-form-row">
        <div>
          <label style={lbl}>Name</label>
          <input required type="text" value={f.name} onChange={e => u('name', e.target.value)} placeholder="Your name" style={inp}
            onFocus={e => e.target.style.borderColor = ACC} onBlur={e => e.target.style.borderColor = BDR} />
        </div>
        <div>
          <label style={lbl}>Email</label>
          <input required type="email" value={f.email} onChange={e => u('email', e.target.value)} placeholder="you@firm.com" style={inp}
            onFocus={e => e.target.style.borderColor = ACC} onBlur={e => e.target.style.borderColor = BDR} />
        </div>
      </div>
      <div>
        <label style={lbl}>Industry</label>
        <select value={f.industry} onChange={e => u('industry', e.target.value)}
          style={{ ...inp, color: f.industry ? TXT : '#3a4a5e', cursor: 'pointer' }}
          onFocus={e => e.target.style.borderColor = ACC} onBlur={e => e.target.style.borderColor = BDR}>
          <option value="" disabled>Select your industry</option>
          {['Legal','Real Estate','Consulting','Creative Services','Financial Services','Health & Wellness','Coaching / Training','E-Commerce','Construction / Trades','Veteran-Owned Business','Other Service Business'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={lbl}>Biggest Pain Point</label>
        <select value={f.pain} onChange={e => u('pain', e.target.value)}
          style={{ ...inp, color: f.pain ? TXT : '#3a4a5e', cursor: 'pointer' }}
          onFocus={e => e.target.style.borderColor = ACC} onBlur={e => e.target.style.borderColor = BDR}>
          <option value="" disabled>What keeps you up at night?</option>
          {['Client intake is a mess','Losing leads / slow follow-up','Drowning in admin work','No documented systems or SOPs','CRM not set up or underused','Tech stack is overwhelming or underused','Billing and collections','Growing but cannot scale','Need a website or digital presence','Other'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={lbl}>Message</label>
        <textarea required value={f.message} onChange={e => u('message', e.target.value)}
          placeholder="Tell me about your business and what you need..." rows={5}
          style={{ ...inp, resize: 'vertical', minHeight: 110 }}
          onFocus={e => e.target.style.borderColor = ACC} onBlur={e => e.target.style.borderColor = BDR} />
      </div>
      <button type="submit" disabled={st === 'sending'} style={{
        padding: '14px 40px', background: ACC, color: '#fff',
        fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
        border: 'none', cursor: st === 'sending' ? 'wait' : 'pointer',
        borderRadius: 2, fontFamily: MONO, opacity: st === 'sending' ? 0.6 : 1,
        alignSelf: 'flex-start', transition: 'background 0.2s',
      }}
        onMouseEnter={e => { if (st !== 'sending') e.target.style.background = ACCL; }}
        onMouseLeave={e => e.target.style.background = ACC}>
        {st === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
      {st === 'error' && <p style={{ fontSize: 12, color: '#ef4444', fontFamily: MONO }}>Something went wrong. Email admin@vvvdigitals.com directly.</p>}
    </form>
  );
};

// ─── Services data ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    num: '01', title: 'Systems Audit',
    desc: 'A full diagnostic of your lead capture, client onboarding, internal workflows, and tech stack. You get a prioritized action plan — no fluff, no generics.',
    tags: ['Operations Review', 'SOP Analysis', 'Gap Assessment'],
  },
  {
    num: '02', title: 'Workflow Design & SOPs',
    desc: 'I map, build, and document your operational workflows. Lead intake, client onboarding, fulfillment, communications — all standardized, repeatable, and scalable.',
    tags: ['Process Mapping', 'SOP Creation', 'Template Library'],
  },
  {
    num: '03', title: 'CRM & Tech Implementation',
    desc: 'I configure, integrate, and deploy the tools your business actually needs — CRM setup, automation, and team training. No more underused subscriptions collecting dust.',
    tags: ['CRM Setup', 'Automation', 'Tech Training'],
  },
  {
    num: '04', title: 'Digital Presence',
    desc: 'Custom websites, brand identity, and technical deployment for businesses that need to look the part. Built from scratch, no templates. We work with legal, real estate, consulting, creative services, and service-based businesses.',
    tags: ['Web Development', 'Brand Identity', 'SEO'],
  },
];

const PRODUCTS = [
  {
    name: 'Intake SOP Starter Kit',
    price: '$97',
    desc: 'Complete client intake workflow templates — lead capture, onboarding sequence, and handoff checklist. Plug in your business info and deploy same day.',
    tag: 'Instant Download',
  },
  {
    name: 'Operations Playbook',
    price: '$147',
    desc: 'A comprehensive operations manual template for solo operators and small teams. Covers intake through delivery, client comms, and billing protocols.',
    tag: 'Instant Download',
  },
  {
    name: 'Tech Stack Audit',
    price: '$297',
    desc: 'Submit your current tools and workflows. I review everything and deliver a written report with specific upgrade and consolidation recommendations.',
    tag: '48hr Turnaround',
  },
];

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const Home = () => {
  const sx = { maxWidth: 1200, margin: '0 auto', padding: '0 32px' };

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TXT, fontFamily: SANS }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${ACC}; color: #fff; }
        select option { background: #0f1520; color: ${TXT}; }
        @media (max-width: 768px) {
          .vvv-about-grid    { grid-template-columns: 1fr !important; }
          .vvv-form-row      { grid-template-columns: 1fr !important; }
          .vvv-services-grid { grid-template-columns: 1fr !important; }
          .vvv-products-grid { grid-template-columns: 1fr !important; }
          .vvv-hero-ctas     { flex-direction: column !important; align-items: stretch !important; }
          .vvv-hero-ctas a   { text-align: center !important; }
          .vvv-tools-grid    { grid-template-columns: 1fr !important; }
          .vvv-contact-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav />

      {/* ── HERO ── */}
      <section style={{ padding: '120px 0 140px' }}>
        <div style={sx}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <Label>Operational Consulting — Small Business Infrastructure</Label>
            <h1 style={{
              fontFamily: HEAD,
              fontSize: 'clamp(72px, 10vw, 140px)',
              lineHeight: 0.92, letterSpacing: '0.02em',
              color: TXT, marginBottom: 40,
            }}>
              Your business<br />runs on systems.<br />
              <span style={{ color: ACC }}>Most are broken.</span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: 560 }}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#6b7f99', marginBottom: 40 }}>
              15 years in banking, insurance, and risk — now applied to small businesses, solo operators, and veteran-owned companies who need real infrastructure, not guesswork.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }} className="vvv-hero-ctas">
              <a href="#tools" style={{
                padding: '14px 36px', background: ACC, color: '#fff',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 2, fontFamily: MONO, transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.target.style.background = ACCL}
                onMouseLeave={e => e.target.style.background = ACC}>
                Grade Your Operations
              </a>
              <a href="#services" style={{
                padding: '14px 36px', background: 'transparent',
                border: `1px solid ${BDR}`, color: '#6b7f99',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 2, fontFamily: MONO, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.target.style.borderColor = `${ACC}66`; e.target.style.color = TXT; }}
                onMouseLeave={e => { e.target.style.borderColor = BDR; e.target.style.color = '#6b7f99'; }}>
                See Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: '100px 0' }}>
        <div style={sx}>
          <FadeUp>
            <Label>What I Do</Label>
            <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(48px, 6vw, 80px)', color: TXT, letterSpacing: '0.03em', marginBottom: 60, lineHeight: 1 }}>
              SERVICES
            </h2>
          </FadeUp>
          <div className="vvv-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, background: BDR, border: `1px solid ${BDR}` }}>
            {SERVICES.map(({ num, title, desc, tags }, i) => (
              <FadeUp key={num} delay={i * 0.08}>
                <div style={{ background: BGC, padding: '40px 36px', height: '100%' }}>
                  <div style={{ fontFamily: HEAD, fontSize: 40, color: ACC, opacity: 0.35, lineHeight: 1, marginBottom: 16 }}>{num}</div>
                  <h3 style={{ fontFamily: HEAD, fontSize: 28, color: TXT, letterSpacing: '0.05em', marginBottom: 16 }}>{title.toUpperCase()}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: '#6b7f99', marginBottom: 24 }}>{desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {tags.map(t => (
                      <span key={t} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACC, border: `1px solid ${ACC}33`, padding: '5px 10px' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── TOOLS / GRADER ── */}
      <section id="tools" style={{ padding: '100px 0' }}>
        <div style={sx}>
          <div className="vvv-tools-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <FadeUp>
              <Label>Free Tool</Label>
              <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(48px, 6vw, 80px)', color: TXT, letterSpacing: '0.03em', marginBottom: 24, lineHeight: 1 }}>
                GRADE YOUR<br />OPERATIONS
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#6b7f99', marginBottom: 32 }}>
                Six questions. Two minutes. Know exactly where your business operations are failing — and what it's costing you.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Identify your biggest operational gaps','Get a letter grade with specific recommendations','See what high-performing businesses are doing differently'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: ACC, fontFamily: MONO, fontSize: 10, marginTop: 3 }}>→</span>
                    <span style={{ fontSize: 14, color: '#6b7f99' }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div style={{ padding: '36px', background: BG2, border: `1px solid ${BDR}` }}>
                <IntakeGrader />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── WORK ── */}
      <section id="work" style={{ padding: '100px 0' }}>
        <div style={sx}>
          <FadeUp>
            <Label>Selected Work</Label>
            <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(48px, 6vw, 80px)', color: TXT, letterSpacing: '0.03em', marginBottom: 48, lineHeight: 1 }}>WORK</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link to="/work/aeroadix" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                border: `1px solid ${BDR}`, background: BGC,
                transition: 'border-color 0.3s',
                overflow: 'hidden',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${ACC}55`}
                onMouseLeave={e => e.currentTarget.style.borderColor = BDR}>
                <div style={{ aspectRatio: '16/6', overflow: 'hidden', background: BG2 }}>
                  <img src="/work/aeroadix/01-hero.png" alt="AeroAdix" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                </div>
                <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, borderTop: `1px solid ${BDR}` }}>
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: MID, marginBottom: 6 }}>Case Study — 001</div>
                    <div style={{ fontFamily: HEAD, fontSize: 32, color: TXT, letterSpacing: '0.05em' }}>AEROADIX / 3DBOOMPRINT</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['React', 'Vite', 'Tailwind', 'Netlify'].map(t => (
                      <span key={t} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACC, border: `1px solid ${ACC}33`, padding: '5px 10px' }}>{t}</span>
                    ))}
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: ACC }}>View Case Study →</span>
                </div>
              </div>
            </Link>
          </FadeUp>
        </div>
      </section>

      <Divider />

      {/* ── PRODUCTS ── */}
      <section id="products" style={{ padding: '100px 0' }}>
        <div style={sx}>
          <FadeUp>
            <Label>Digital Products</Label>
            <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(48px, 6vw, 80px)', color: TXT, letterSpacing: '0.03em', marginBottom: 16, lineHeight: 1 }}>PRODUCTS</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#6b7f99', maxWidth: 480, marginBottom: 52 }}>
              Can't commit to a full engagement yet? Start here. Templates and tools built from real client work.
            </p>
          </FadeUp>
          <div className="vvv-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: BDR, border: `1px solid ${BDR}` }}>
            {PRODUCTS.map(({ name, price, desc, tag }, i) => (
              <FadeUp key={name} delay={i * 0.08}>
                <div style={{ background: BGC, padding: '36px 28px', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACC, border: `1px solid ${ACC}33`, padding: '5px 10px' }}>{tag}</span>
                    <span style={{ fontFamily: HEAD, fontSize: 28, color: TXT }}>{price}</span>
                  </div>
                  <h3 style={{ fontFamily: HEAD, fontSize: 22, color: TXT, letterSpacing: '0.05em', lineHeight: 1.1 }}>{name.toUpperCase()}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: '#6b7f99', flex: 1 }}>{desc}</p>
                  <a href="#contact" style={{
                    display: 'block', padding: '11px', background: 'transparent',
                    border: `1px solid ${BDR}`, color: MID,
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
                    textDecoration: 'none', textAlign: 'center', fontFamily: MONO,
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.target.style.borderColor = ACC; e.target.style.color = ACC; }}
                    onMouseLeave={e => { e.target.style.borderColor = BDR; e.target.style.color = MID; }}>
                    Get Access
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.2}>
            <div style={{ marginTop: 2, background: BDR }}>
              <div style={{ background: BGC, padding: '32px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: MID, marginBottom: 6 }}>Pay As You Go</div>
                  <div style={{ fontFamily: HEAD, fontSize: 22, color: TXT, letterSpacing: '0.05em' }}>ONE-TIME PAYMENT — NO SUBSCRIPTION</div>
                </div>
                <PayPalButton />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <Divider />

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '100px 0' }}>
        <div style={sx}>
          <div className="vvv-about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <FadeUp>
              <Label>About</Label>
              <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(48px, 6vw, 72px)', color: TXT, letterSpacing: '0.03em', marginBottom: 28, lineHeight: 1 }}>
                THE OPERATOR<br />BEHIND THE SYSTEM
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#6b7f99', marginBottom: 20 }}>
                I fix the operational and digital chaos that keeps small businesses from scaling. 15 years inside the institutions that run on systems — banking, insurance, risk assessment. USAA. American Express. I know what functioning infrastructure looks like from the inside, and I know exactly what it costs when it breaks.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#6b7f99', marginBottom: 20 }}>
                Now I apply that experience to small businesses, solo operators, and veteran-owned companies who are growing faster than their systems — and need someone who can build the infrastructure to catch up.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#6b7f99' }}>
                U.S. Army veteran. Founder of VVV Digitals LLC. Based in Glendale, Arizona. We work with legal, real estate, consulting, creative services, and service-based businesses nationwide.
              </p>
            </FadeUp>
            <FadeUp delay={0.12}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <BlinkingAvatar />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: BDR, border: `1px solid ${BDR}` }}>
                  {[
                    { label: 'Years of Experience', value: '15+' },
                    { label: 'Background', value: 'Banking · Insurance · Risk' },
                    { label: 'Military', value: 'U.S. Army Veteran' },
                    { label: 'Location', value: 'Glendale, AZ' },
                    { label: 'Focus', value: 'Small Business · Solo Operators · Veteran-Owned' },
                    { label: 'Certifications', value: 'VOSB · WOSB · 8(a) Pending' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: BGC, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: MID }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: TXT, textAlign: 'right' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '100px 0' }}>
        <div style={sx}>
          <div className="vvv-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>
            <FadeUp>
              <Label>Get in Touch</Label>
              <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(48px, 6vw, 72px)', color: TXT, letterSpacing: '0.03em', marginBottom: 24, lineHeight: 1 }}>
                LET'S TALK
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#6b7f99', marginBottom: 36 }}>
                Free 30-minute consultation. Bring your biggest operational problem and I'll tell you exactly what I'd do to fix it.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Email', value: 'admin@vvvdigitals.com' },
                  { label: 'Location', value: 'Glendale, AZ (Remote Nationwide)' },
                  { label: 'Response', value: 'Within 1 Business Day' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: MID, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, color: TXT }}>{value}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.12}>
              <div style={{ padding: '40px', background: BG2, border: `1px solid ${BDR}` }}>
                <ContactForm />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${BDR}`, padding: '28px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.15em', color: MID }}>VVV / DIGITALS</span>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link to="/privacy" style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: BDR, textDecoration: 'none' }}>Privacy</Link>
            <Link to="/terms"   style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: BDR, textDecoration: 'none' }}>Terms</Link>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 10, color: BDR, letterSpacing: '0.1em' }}>© 2026 VVV Digitals LLC</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
