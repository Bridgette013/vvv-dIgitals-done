import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const BG   = '#080d14';
const BGC  = '#0f1520';
const BDR  = '#1a2332';
const ACC  = '#3B6EF8';
const ACCL = '#5482ff';
const MID  = '#4a5568';
const TXT  = '#E8EDF5';
const MONO = "'DM Mono', monospace";
const HEAD = "'Bebas Neue', cursive";
const SANS = "'DM Sans', sans-serif";

const encodeForm = (data) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');

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

const ContactForm = () => {
  const [f,  setF]  = useState({ name: '', email: '', industry: '', biggest_pain_point: '', message: '', 'bot-field': '' });
  const [st, setSt] = useState('idle');
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault(); setSt('sending');
    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm({ 'form-name': 'contact', ...f }),
      });
      if (r.ok) { setSt('sent'); setF({ name: '', email: '', industry: '', biggest_pain_point: '', message: '', 'bot-field': '' }); }
      else setSt('error');
    } catch { setSt('error'); }
  };

  const inp = { width: '100%', padding: '13px 16px', background: '#0c1220', border: `1px solid ${BDR}`, color: TXT, fontSize: 13, fontFamily: SANS, outline: 'none', borderRadius: 2, transition: 'border-color 0.2s' };
  const lbl = { display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: MID, marginBottom: 8, fontFamily: MONO };

  if (st === 'sent') return (
    <div style={{ textAlign: 'center', padding: '64px 0' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${ACC}18`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <span style={{ color: ACC, fontSize: 26 }}>✓</span>
      </div>
      <h3 style={{ fontSize: 36, color: TXT, marginBottom: 10, fontFamily: HEAD, letterSpacing: '0.05em' }}>Message Received.</h3>
      <p style={{ fontSize: 14, color: MID }}>I'll be in touch within one business day.</p>
    </div>
  );

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={submit}
      style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
    >
      <input type="hidden" name="form-name" value="contact" />
      <p hidden>
        <label>Don't fill this out: <input name="bot-field" value={f['bot-field']} onChange={e => u('bot-field', e.target.value)} /></label>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="vvv-form-row">
        <div>
          <label style={lbl}>Name</label>
          <input required type="text" name="name" value={f.name} onChange={e => u('name', e.target.value)} placeholder="Your name" style={inp}
            onFocus={e => e.target.style.borderColor = ACC} onBlur={e => e.target.style.borderColor = BDR} />
        </div>
        <div>
          <label style={lbl}>Email</label>
          <input required type="email" name="email" value={f.email} onChange={e => u('email', e.target.value)} placeholder="you@firm.com" style={inp}
            onFocus={e => e.target.style.borderColor = ACC} onBlur={e => e.target.style.borderColor = BDR} />
        </div>
      </div>
      <div>
        <label style={lbl}>Industry</label>
        <select name="industry" value={f.industry} onChange={e => u('industry', e.target.value)}
          style={{ ...inp, color: f.industry ? TXT : '#3a4a5e', cursor: 'pointer' }}
          onFocus={e => e.target.style.borderColor = ACC} onBlur={e => e.target.style.borderColor = BDR}>
          <option value="" disabled>Select your industry</option>
          {['Legal','Real Estate','Consulting','Creative Services','Financial Services','Health & Wellness','Coaching / Training','E-Commerce','Construction / Trades','Veteran-Owned Business','Other Service Business'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={lbl}>Biggest Pain Point</label>
        <select name="biggest_pain_point" value={f.biggest_pain_point} onChange={e => u('biggest_pain_point', e.target.value)}
          style={{ ...inp, color: f.biggest_pain_point ? TXT : '#3a4a5e', cursor: 'pointer' }}
          onFocus={e => e.target.style.borderColor = ACC} onBlur={e => e.target.style.borderColor = BDR}>
          <option value="" disabled>What keeps you up at night?</option>
          {['Client intake is a mess','Losing leads / slow follow-up','Drowning in admin work','No documented systems or SOPs','CRM not set up or underused','Tech stack is overwhelming or underused','Billing and collections','Growing but cannot scale','Need a website or digital presence','Other'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label style={lbl}>Message</label>
        <textarea required name="message" value={f.message} onChange={e => u('message', e.target.value)}
          placeholder="Tell me about your business and what you need..." rows={6}
          style={{ ...inp, resize: 'vertical', minHeight: 140 }}
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

const Contact = () => (
  <div style={{ background: BG, color: TXT, minHeight: '100vh', fontFamily: SANS }}>
    <Nav />
    <section style={{ padding: '100px 0 120px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Label>Start a Project — Get in Touch</Label>
          <h1 style={{
            fontFamily: HEAD,
            fontSize: 'clamp(56px, 8vw, 110px)',
            lineHeight: 0.92, letterSpacing: '0.02em',
            color: TXT, marginBottom: 28,
          }}>
            Let's talk about<br /><span style={{ color: ACC }}>what's broken.</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#6b7f99', maxWidth: 560, marginBottom: 56 }}>
            Tell me about your business — current systems, the bottlenecks costing you time, and what you'd need to fix to scale. I'll respond within one business day with a recommended next step.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="vvv-contact-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}
        >
          <div>
            {[
              { label: 'Email',   value: 'admin@vvvdigitals.com' },
              { label: 'Based In', value: 'Glendale, AZ' },
              { label: 'Response', value: 'Within 1 Business Day' },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: MID, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 15, color: TXT }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: BGC, border: `1px solid ${BDR}`, padding: '40px 36px' }}>
            <ContactForm />
          </div>
        </motion.div>
      </div>
    </section>

    <style>{`
      select option { background: #0f1520; color: ${TXT}; }
      @media (max-width: 768px) {
        .vvv-form-row     { grid-template-columns: 1fr !important; }
        .vvv-contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      }
    `}</style>

    <Footer />
  </div>
);

export default Contact;
