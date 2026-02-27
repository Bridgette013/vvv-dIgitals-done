import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';

const BG  = '#080d14';
const BDR = '#1a2332';
const ACC = '#3B6EF8';
const MID = '#4a5568';
const TXT = '#E8EDF5';
const MONO = "'DM Mono', monospace";
const HEAD = "'Bebas Neue', cursive";
const SANS = "'DM Sans', sans-serif";

const Privacy = () => (
  <div style={{ minHeight: '100vh', background: BG, color: TXT, fontFamily: SANS }}>
    <style>{`* { box-sizing: border-box; margin: 0; }`}</style>
    <Nav />
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 32px' }}>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACC, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 32, height: 1, background: ACC, display: 'inline-block' }} />
        Legal
      </div>
      <h1 style={{ fontFamily: HEAD, fontSize: 64, color: TXT, letterSpacing: '0.03em', marginBottom: 48, lineHeight: 1 }}>PRIVACY POLICY</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {[
          { title: 'Information We Collect', body: 'We collect information you provide directly, such as your name, email address, practice area, and any details you share through our contact form. We do not collect payment information directly — all transactions are processed through PayPal.' },
          { title: 'How We Use Your Information', body: 'Information you provide is used solely to respond to your inquiry and provide requested services. We do not sell, rent, or share your personal information with third parties for marketing purposes.' },
          { title: 'Contact Form Data', body: 'Form submissions are processed through Formspree. By submitting the contact form, you agree to their privacy policy in addition to ours. We retain form data only as long as necessary to respond to your inquiry.' },
          { title: 'Cookies', body: 'This website uses minimal cookies necessary for functionality. We do not use tracking cookies or third-party advertising cookies.' },
          { title: 'Data Security', body: 'We take reasonable measures to protect your information. However, no method of transmission over the internet is 100% secure.' },
          { title: 'Contact', body: 'For privacy-related questions, contact us at admin@vvvdigitals.com.' },
        ].map(({ title, body }) => (
          <div key={title} style={{ paddingBottom: 32, borderBottom: `1px solid ${BDR}` }}>
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

export default Privacy;
