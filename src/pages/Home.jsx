import React, { useState, useEffect, useRef } from 'react';
import logoNew from '../assets/logo-new.png';

const GRADER_QUESTIONS = [
  { id: 1, question: "How do new clients first contact your firm?", options: [
    { text: "They call and whoever answers takes notes on paper", score: 1 },
    { text: "They email or call — I manually enter info into a spreadsheet", score: 2 },
    { text: "They fill out a basic form on my website", score: 3 },
    { text: "Automated online form that routes to my case management system", score: 4 },
  ]},
  { id: 2, question: "How quickly do new leads get a response?", options: [
    { text: "When I get around to it — sometimes days", score: 1 },
    { text: "Within 24 hours, usually", score: 2 },
    { text: "Same business day — I try to prioritize it", score: 3 },
    { text: "Automated acknowledgment within minutes, follow-up within hours", score: 4 },
  ]},
  { id: 3, question: "What happens with client documents during intake?", options: [
    { text: "They bring physical copies — I keep a paper folder", score: 1 },
    { text: "They email docs and I save them in folders on my computer", score: 2 },
    { text: "They upload to a shared drive or portal", score: 3 },
    { text: "Secure client portal with automated document requests and tracking", score: 4 },
  ]},
  { id: 4, question: "How do you screen for conflicts of interest?", options: [
    { text: "I rely on memory", score: 1 },
    { text: "I search my email and old files manually", score: 2 },
    { text: "I have a spreadsheet or database I check", score: 3 },
    { text: "Automated conflict check integrated with my intake process", score: 4 },
  ]},
  { id: 5, question: "What does your fee agreement process look like?", options: [
    { text: "I explain fees verbally and sometimes follow up with a letter", score: 1 },
    { text: "I have a standard template I edit and email for signature", score: 2 },
    { text: "Clients sign digitally via DocuSign or similar", score: 3 },
    { text: "Auto-generated from intake data, e-signed, and filed — no manual steps", score: 4 },
  ]},
  { id: 6, question: "How do you track where each new matter stands in the intake pipeline?", options: [
    { text: "I keep it in my head", score: 1 },
    { text: "Sticky notes, a notebook, or a to-do list", score: 2 },
    { text: "A spreadsheet with statuses", score: 3 },
    { text: "CRM or practice management software with pipeline stages", score: 4 },
  ]},
];

function getGrade(score) {
  const max = GRADER_QUESTIONS.length * 4;
  const pct = (score / max) * 100;
  if (pct >= 85) return { letter: 'A', label: 'Excellent', color: '#22c55e', summary: "Your intake system is well-built. You're ahead of 90% of solo practitioners. Minor optimizations could still save you hours per month.", recs: ["Consider adding automated follow-up sequences for leads that don't convert immediately.", "Audit your process quarterly — even good systems drift.", "Look into client satisfaction surveys post-intake to catch friction points."] };
  if (pct >= 70) return { letter: 'B', label: 'Solid', color: '#84cc16', summary: "You've got the bones of a good system, but there are gaps costing you time and probably clients. The leads that slip through those gaps? They're hiring your competitors.", recs: ["Automate your initial response — every hour of delay drops conversion rates by 10%.", "Move document collection to a secure portal. Email attachments are a liability risk.", "Build a conflict check into your intake form so it happens before you invest time in a consultation."] };
  if (pct >= 50) return { letter: 'C', label: 'Needs Work', color: '#eab308', summary: "You're running on manual effort and it's costing you. Every hour you spend on admin intake tasks is an hour you're not billing. And the clients who never hear back? They found someone faster.", recs: ["Priority one: automate your first response. A simple auto-reply with next steps keeps leads warm.", "Get your fee agreements into a digital signature workflow — this alone saves 2-3 hours per week.", "Track your pipeline somewhere other than your head. You're losing matters you don't even know about.", "Consider a full intake system audit to identify exactly where your process breaks down."] };
  if (pct >= 30) return { letter: 'D', label: 'At Risk', color: '#f97316', summary: "Your intake process has serious gaps that are actively costing you revenue and creating compliance risk. You're working harder than you need to and still losing clients to firms with better systems.", recs: ["You need a structured intake workflow — not a better to-do list, an actual system.", "Document collection via email is a malpractice risk. Move to a secure portal immediately.", "Your response time is likely your biggest revenue leak. Prospects contact 3-5 firms — the first one to respond professionally usually wins.", "A full operational audit would identify exactly how much revenue you're leaving on the table.", "This is fixable. Most solo practitioners are in this range — the ones who fix it see 20-40% more conversions."] };
  return { letter: 'F', label: 'Critical', color: '#ef4444', summary: "Your intake process needs immediate attention. You're almost certainly losing more clients than you're signing, creating unnecessary liability exposure, and spending your most valuable hours on tasks that should be automated.", recs: ["Stop everything and build a basic intake form. Even a Google Form is better than what you have now.", "Set up an auto-responder today. Literally today. It takes 15 minutes and it's the single highest-ROI change you can make.", "You need professional help rebuilding this from the ground up. The good news: a proper intake system pays for itself within 60 days through recovered leads alone.", "Every week you operate like this costs you 3-5 potential clients. That's not a guess — that's the data across hundreds of solo practices."] };
}

const IntakeGrader = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const resultsRef = useRef(null);
  const gold = '#c8a45e';

  const handleAnswer = (questionId, score) => {
    setSelectedOption(score);
    setTimeout(() => {
      const newAnswers = { ...answers, [questionId]: score };
      setAnswers(newAnswers);
      setSelectedOption(null);
      if (currentQ < GRADER_QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setShowResults(true);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }, 300);
  };

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const grade = getGrade(totalScore);
  const progress = ((currentQ + (showResults ? 1 : 0)) / GRADER_QUESTIONS.length) * 100;

  const reset = () => { setCurrentQ(0); setAnswers({}); setShowResults(false); setSelectedOption(null); };

  if (showResults) {
    return (
      <div ref={resultsRef} style={{ animation: 'fadeUp 0.6s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 120, height: 120, borderRadius: '50%', border: `3px solid ${grade.color}`, background: `${grade.color}11`, marginBottom: 16 }}>
            <span style={{ fontSize: 56, fontWeight: 800, color: grade.color, fontFamily: "'Playfair Display', serif" }}>{grade.letter}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: grade.color, marginBottom: 8 }}>{grade.label}</div>
          <div style={{ fontSize: 13, color: '#888', fontFamily: "'DM Mono', monospace" }}>{totalScore} / {GRADER_QUESTIONS.length * 4} points</div>
        </div>
        <div style={{ padding: '28px 32px', marginBottom: 32, borderLeft: `2px solid ${grade.color}`, background: '#0a0a0a' }}>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#d4d4d4', margin: 0 }}>{grade.summary}</p>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#666', marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>Recommendations</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {grade.recs.map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 20px', background: '#0a0a0a', borderRadius: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: grade.color, fontFamily: "'DM Mono', monospace", flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: '#ccc', margin: 0 }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '32px', background: '#0a0a0a', border: '1px solid #222', textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Want to fix this?</p>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 24, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>I build intake systems for solo practitioners that actually work. Most of my clients see results within 30 days.</p>
          <a href="mailto:britnic@vvvdigitals.com?subject=Intake%20System%20Audit%20Request" style={{ display: 'inline-block', padding: '14px 40px', background: '#fff', color: '#000', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.25s' }} onMouseEnter={e => { e.target.style.background = gold; }} onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#000'; }}>Request an Audit</a>
        </div>
        <button onClick={reset} style={{ display: 'block', margin: '24px auto 0', padding: '10px 24px', background: 'transparent', border: '1px solid #333', color: '#666', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Retake Assessment</button>
      </div>
    );
  }

  const q = GRADER_QUESTIONS[currentQ];
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#666', fontFamily: "'DM Mono', monospace" }}>QUESTION {currentQ + 1} OF {GRADER_QUESTIONS.length}</span>
          <span style={{ fontSize: 11, color: '#444', fontFamily: "'DM Mono', monospace" }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 2, background: '#1a1a1a', borderRadius: 1 }}>
          <div style={{ height: '100%', background: `linear-gradient(90deg, ${gold}, #e8c97e)`, borderRadius: 1, width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 600, color: '#f0f0f0', marginBottom: 28, lineHeight: 1.5, fontFamily: "'Playfair Display', serif" }}>{q.question}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(q.id, opt.score)} style={{ padding: '16px 20px', background: selectedOption === opt.score ? `${gold}11` : '#0a0a0a', border: selectedOption === opt.score ? `1px solid ${gold}` : '1px solid #1a1a1a', color: selectedOption === opt.score ? '#e8c97e' : '#ccc', fontSize: 14, lineHeight: 1.5, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', borderRadius: 2 }} onMouseEnter={e => { if (selectedOption !== opt.score) { e.target.style.borderColor = '#333'; e.target.style.color = '#fff'; }}} onMouseLeave={e => { if (selectedOption !== opt.score) { e.target.style.borderColor = '#1a1a1a'; e.target.style.color = '#ccc'; }}}>{opt.text}</button>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    document.head.appendChild(script);
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sx = { maxWidth: 960, margin: '0 auto', padding: '0 24px' };
  const gold = '#c8a45e';

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#e8e8e8', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        ::selection { background: #c8a45e; color: #000; }
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; margin: 0; }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-toggle { display: block !important; } .about-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) { .mobile-toggle { display: none !important; } .mobile-menu { display: none !important; } }
      `}</style>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: scrolled ? 'rgba(5,5,5,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '1px solid #151515' : '1px solid transparent', transition: 'all 0.3s ease' }}>
        <div style={{ ...sx, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
          <a href="#" style={{ textDecoration: 'none' }}><img src={logoNew} alt="VVV Digitals" style={{ height: 40 }} /></a>
          <nav className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {['Services', 'Tools', 'Products'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ color: '#888', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s', fontFamily: "'DM Mono', monospace" }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#888'}>{item}</a>
            ))}
            <a href="mailto:britnic@vvvdigitals.com" style={{ padding: '10px 24px', background: 'transparent', border: `1px solid ${gold}`, color: gold, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.25s', fontFamily: "'DM Mono', monospace" }} onMouseEnter={e => { e.target.style.background = gold; e.target.style.color = '#000'; }} onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = gold; }}>Contact</a>
          </nav>
          <button className="mobile-toggle" onClick={() => setMobileNav(!mobileNav)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 24, cursor: 'pointer', padding: 8 }}>{mobileNav ? '\u2715' : '\u2630'}</button>
        </div>
        {mobileNav && (
          <div className="mobile-menu" style={{ padding: '16px 24px', borderTop: '1px solid #151515', display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(5,5,5,0.97)' }}>
            {['Services', 'Tools', 'Products'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileNav(false)} style={{ color: '#ccc', fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: "'DM Mono', monospace" }}>{item}</a>
            ))}
            <a href="mailto:britnic@vvvdigitals.com" style={{ color: gold, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Contact</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 100, paddingBottom: 120 }}>
        <div style={{ ...sx, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: gold, marginBottom: 32, fontFamily: "'DM Mono', monospace", animation: 'fadeIn 1s ease' }}>Operational Consulting for Legal Professionals</div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 28, color: '#fff', fontFamily: "'Playfair Display', serif", animation: 'fadeUp 0.8s ease' }}>
            Your practice runs on systems.<br /><span style={{ color: gold, fontStyle: 'italic' }}>Most of them are broken.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: '#999', maxWidth: 580, margin: '0 auto 48px', animation: 'fadeUp 0.8s ease 0.15s both' }}>
            15 years in banking, insurance, and risk assessment — now applied to the firms that need it most. I fix the operational chaos that keeps solo attorneys buried in admin instead of practicing law.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.8s ease 0.3s both' }}>
            <a href="#tools" style={{ padding: '16px 40px', background: '#fff', color: '#000', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.25s' }} onMouseEnter={e => e.target.style.background = gold} onMouseLeave={e => e.target.style.background = '#fff'}>Grade Your Intake System</a>
            <a href="#services" style={{ padding: '16px 40px', background: 'transparent', border: '1px solid #333', color: '#ccc', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.25s' }} onMouseEnter={e => { e.target.style.borderColor = '#888'; e.target.style.color = '#fff'; }} onMouseLeave={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#ccc'; }}>View Services</a>
          </div>
        </div>
      </section>

      {/* CREDIBILITY BAR */}
      <section style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: '40px 0', background: '#080808' }}>
        <div style={{ ...sx, display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {['15+ Years Financial Services', 'U.S. Army Veteran', 'Woman-Owned Business', 'Arizona-Based'].map((item, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555', fontFamily: "'DM Mono', monospace" }}>{item}</span>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: '100px 0' }}>
        <div style={sx}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: '#444', marginBottom: 24, fontFamily: "'DM Mono', monospace" }}>THE PROBLEM</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.35, color: '#fff', marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>You went to law school to practice law. Not to troubleshoot your CRM at 11pm.</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#999', marginBottom: 20 }}>Solo practitioners lose an average of 10-15 hours per week on operational tasks that should be automated. That's $15,000-$30,000 in unbilled time every month.</p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#999', marginBottom: 20 }}>Your intake process leaks clients. Your document management creates liability. Your billing workflow costs you money you don't even know you're losing.</p>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: '#fff', fontWeight: 600 }}>I've spent 15 years finding exactly these kinds of operational failures in banking and insurance. Now I find them in your practice — and I fix them.</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 0', background: '#080808', borderTop: '1px solid #111' }}>
        <div style={sx}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: gold, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>SERVICES</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display', serif" }}>How I Help</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { tag: 'OPERATIONS', title: 'Workflow Optimization', desc: 'Full audit and rebuild of your practice operations — client intake, document management, billing, and case tracking. I find where time and money are leaking and plug the holes.', price: 'From $2,500' },
              { tag: 'SYSTEMS', title: 'Intake System Design', desc: 'Custom-built client intake workflows that automate first contact through signed engagement. Reduce your intake admin by 40-60% while capturing every lead.', price: 'From $3,500' },
              { tag: 'CONTRACTS', title: 'Contract Review', desc: 'Plain-English translation and risk analysis of business contracts. I spent 15 years finding where money disappears in fine print — now I do it for your agreements.', price: 'From $200' },
              { tag: 'COMPLIANCE', title: 'Risk & Compliance Audit', desc: 'Operational risk assessment for your practice. I identify compliance gaps, document management vulnerabilities, and process failures before they become problems.', price: 'From $1,500' },
              { tag: 'TECHNOLOGY', title: 'Tech Stack Setup', desc: "I select, configure, and integrate the right practice management tools for your firm. No more paying for software you don't use or missing tools you need.", price: 'From $2,000' },
              { tag: 'ONGOING', title: 'Monthly Retainer', desc: 'Ongoing operational support and optimization. I keep your systems running, troubleshoot issues, and continuously improve your workflows as your practice grows.', price: '$500\u20131,500/mo' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '36px 32px', background: '#0c0c0c', border: '1px solid #151515', transition: 'border-color 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'} onMouseLeave={e => e.currentTarget.style.borderColor = '#151515'}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: gold, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>{s.tag}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#888', marginBottom: 20 }}>{s.desc}</p>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: "'DM Mono', monospace" }}>{s.price}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button data-tally-open="VLGZAy" data-tally-layout="modal" data-tally-width="1000" style={{ display: 'inline-block', padding: '16px 48px', background: '#fff', color: '#000', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', transition: 'all 0.25s' }} onMouseEnter={e => e.target.style.background = gold} onMouseLeave={e => e.target.style.background = '#fff'}>Request a Consultation</button>
          </div>
        </div>
      </section>

      {/* INTAKE GRADER */}
      <section id="tools" style={{ padding: '100px 0', borderTop: '1px solid #111' }}>
        <div style={sx}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', border: `1px solid ${gold}33`, color: gold, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>Free Assessment</div>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Intake System Grader</h2>
              <p style={{ fontSize: 15, color: '#888', lineHeight: 1.7 }}>Six questions. Sixty seconds. Find out if your client intake process is costing you cases.</p>
            </div>
            <div style={{ padding: '40px 36px', background: '#0c0c0c', border: '1px solid #151515' }}><IntakeGrader /></div>
          </div>
        </div>
      </section>

      {/* DIGITAL PRODUCTS */}
      <section id="products" style={{ padding: '100px 0', background: '#080808', borderTop: '1px solid #111' }}>
        <div style={sx}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: gold, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>DIGITAL PRODUCTS</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Self-Service Solutions</h2>
            <p style={{ fontSize: 15, color: '#888', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>Not ready for a full engagement? These tools give you a head start.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{ padding: '36px 32px', background: '#0c0c0c', border: '1px solid #151515', transition: 'border-color 0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'} onMouseLeave={e => e.currentTarget.style.borderColor = '#151515'}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: gold, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>THE MISSING GUIDES</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>Step-by-Step Recovery Guides</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#888', marginBottom: 20 }}>Personalized, step-by-step guides for navigating insurance claims, housing recovery, legal self-representation, and more. Written by someone who has been through it.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {['Insurance Claims', 'Housing Recovery', 'LLC Formation', 'VA Claims'].map((tag, i) => (<span key={i} style={{ padding: '4px 12px', background: '#151515', fontSize: 11, color: '#888', fontFamily: "'DM Mono', monospace" }}>{tag}</span>))}
              </div>
              <a href="https://themissingguides.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 28px', border: '1px solid #333', color: '#ccc', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.25s' }} onMouseEnter={e => { e.target.style.borderColor = gold; e.target.style.color = gold; }} onMouseLeave={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#ccc'; }}>Visit Site</a>
            </div>
            <div style={{ padding: '36px 32px', background: '#0c0c0c', border: '1px solid #151515', transition: 'border-color 0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'} onMouseLeave={e => e.currentTarget.style.borderColor = '#151515'}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: gold, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>TRUTHSEEKER</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>AI Forensic Analysis</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#888', marginBottom: 20 }}>Romance scam detection and digital evidence authentication. Helps victims and legal professionals analyze communications, identify fraud patterns, and authenticate evidence for proceedings.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {['Scam Detection', 'Evidence Auth', 'Legal Analysis', 'AI-Powered'].map((tag, i) => (<span key={i} style={{ padding: '4px 12px', background: '#151515', fontSize: 11, color: '#888', fontFamily: "'DM Mono', monospace" }}>{tag}</span>))}
              </div>
              <span style={{ display: 'inline-block', padding: '12px 28px', border: '1px solid #222', color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ padding: '100px 0', borderTop: '1px solid #111' }}>
        <div style={sx}>
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: gold, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>ABOUT</div>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 20, lineHeight: 1.3, fontFamily: "'Playfair Display', serif" }}>I have spent my career finding where systems fail.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#999', marginBottom: 16 }}>15 years in banking and insurance taught me one thing: every business bleeds money through bad processes. The difference between the ones that thrive and the ones that barely survive is operational discipline.</p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#999', marginBottom: 16 }}>As a U.S. Army veteran, I bring that discipline to every engagement. As someone who has navigated the legal system as a pro se litigant, I understand the exact pain points solo attorneys face every day.</p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#ccc', fontWeight: 500 }}>I do not just consult. I build the systems, implement the tools, and make sure they actually work before I leave.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[{ num: '15+', label: 'Years in Financial Services' }, { num: '40\u201360%', label: 'Avg. Admin Time Reduction' }, { num: '30', label: 'Days to See Results' }, { num: '3', label: 'Revenue Streams, One Firm' }].map((stat, i) => (
                <div key={i} style={{ padding: '24px 28px', background: '#0a0a0a', border: '1px solid #151515', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: gold, fontFamily: "'Playfair Display', serif", minWidth: 80 }}>{stat.num}</span>
                  <span style={{ fontSize: 14, color: '#888' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '100px 0', borderTop: '1px solid #111', background: 'linear-gradient(180deg, #080808 0%, #0c0a06 100%)' }}>
        <div style={{ ...sx, textAlign: 'center', maxWidth: 640 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 16, fontFamily: "'Playfair Display', serif", lineHeight: 1.3 }}>Ready to stop running your practice on duct tape?</h2>
          <p style={{ fontSize: 16, color: '#888', marginBottom: 40, lineHeight: 1.7 }}>One conversation is all it takes to find out where your systems are failing. No pitch, no pressure — just an honest assessment of what is working and what is not.</p>
          <button data-tally-open="VLGZAy" data-tally-layout="modal" data-tally-width="1000" style={{ display: 'inline-block', padding: '18px 56px', background: '#fff', color: '#000', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', transition: 'all 0.25s' }} onMouseEnter={e => e.target.style.background = gold} onMouseLeave={e => e.target.style.background = '#fff'}>Start a Conversation</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #111', padding: '48px 0', background: '#050505' }}>
        <div style={sx}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <img src={logoNew} alt="VVV Digitals" style={{ height: 32, marginBottom: 8, opacity: 0.7 }} />
              <p style={{ fontSize: 12, color: '#444', fontFamily: "'DM Mono', monospace" }}>Operational Consulting & Digital Solutions</p>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <a href="/docs/privacy-policy.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#444', textDecoration: 'none', fontFamily: "'DM Mono', monospace" }}>Privacy</a>
              <a href="/docs/terms-of-service.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#444', textDecoration: 'none', fontFamily: "'DM Mono', monospace" }}>Terms</a>
              <a href="mailto:britnic@vvvdigitals.com" style={{ fontSize: 11, color: gold, textDecoration: 'none', fontFamily: "'DM Mono', monospace" }}>britnic@vvvdigitals.com</a>
            </div>
          </div>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 11, color: '#333', fontFamily: "'DM Mono', monospace" }}>{'\u00A9'} {new Date().getFullYear()} VVV Digitals LLC. All rights reserved.</p>
            <p style={{ fontSize: 11, color: '#333', fontFamily: "'DM Mono', monospace" }}>Glendale, Arizona</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
