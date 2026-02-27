import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';

const BG  = '#080d14';
const BDR = '#1a2332';
const ACC = '#3B6EF8';
const TXT = '#E8EDF5';
const MONO = "'DM Mono', monospace";
const HEAD = "'Bebas Neue', cursive";
const SANS = "'DM Sans', sans-serif";

const Terms = () => (
  <div style={{ minHeight: '100vh', background: BG, color: TXT, fontFamily: SANS }}>
    <style>{`* { box-sizing: border-box; margin: 0; }`}</style>
    <Nav />
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 32px' }}>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACC, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 32, height: 1, background: ACC, display: 'inline-block' }} />
        Legal
      </div>
      <h1 style={{ fontFamily: HEAD, fontSize: 64, color: TXT, letterSpacing: '0.03em', marginBottom: 48, lineHeight: 1 }}>TERMS OF SERVICE</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {[
          { title: 'Services', body: 'VVV Digitals LLC provides operational consulting, systems design, and digital services to law firms and legal professionals. Specific deliverables, timelines, and fees are defined in individual service agreements or project proposals.' },
          { title: 'Not Legal Advice', body: 'VVV Digitals LLC is an operational consulting firm. Nothing on this website or in our services constitutes legal advice. We help firms operate more efficiently — we do not provide legal counsel.' },
          { title: 'Digital Products', body: 'Digital products (templates, toolkits, audits) are sold as-is. All sales are final. Products are licensed for use by the purchasing firm only and may not be redistributed or resold.' },
          { title: 'Intellectual Property', body: 'Custom work product created for your firm is yours upon full payment. All other content on this site — copy, tools, frameworks — is property of VVV Digitals LLC.' },
          { title: 'Limitation of Liability', body: 'VVV Digitals LLC is not liable for business outcomes, lost revenue, or damages arising from the use or implementation of our recommendations. We provide our best professional judgment; results depend on your implementation.' },
          { title: 'Governing Law', body: 'These terms are governed by the laws of the State of Arizona. Any disputes shall be resolved in Maricopa County, Arizona.' },
          { title: 'Contact', body: 'Questions about these terms? Reach us at admin@vvvdigitals.com.' },
        ].map(({ title, body }) => (
          <div key={title} style={{ paddingBottom: 32, borderBottom: `1px solid #1a2332` }}>
            <h2 style={{ fontFamily: HEAD, fontSize: 24, color: TXT, letterSpacing: '0.05em', marginBottom: 12 }}>{title.toUpperCase()}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#6b7f99' }}>{body}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 48 }}>
        <Link to="/" style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: ACC, textDecoration: 'none' }}>← Back to Home</Link>
      </div>
    </div>
  </div>
);

export default Terms;
