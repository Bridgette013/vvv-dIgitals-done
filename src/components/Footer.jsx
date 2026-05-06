import React from 'react';
import { Link } from 'react-router-dom';

const BG   = '#080d14';
const BG2  = '#0c1220';
const BDR  = '#1a2332';
const ACC  = '#3B6EF8';
const MID  = '#4a5568';
const TXT  = '#E8EDF5';
const MONO = "'DM Mono', monospace";
const HEAD = "'Bebas Neue', cursive";
const SANS = "'DM Sans', sans-serif";

const Footer = () => (
  <footer style={{
    background: BG,
    borderTop: `1px solid ${BDR}`,
    fontFamily: SANS,
    color: TXT,
  }}>
    {/* ── Top: brand + CTA ───────────────────────────────────────── */}
    <div className="vvv-footer-top" style={{
      maxWidth: 1200, margin: '0 auto',
      padding: '72px 32px 56px',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 40,
      alignItems: 'start',
    }}>
      <div>
        <Link to="/" style={{ display: 'inline-flex', textDecoration: 'none', marginBottom: 18 }}>
          <img
            src="/brand/vvv-digitals-horizontal-light.svg"
            alt="VVV Digitals"
            style={{ height: 40, width: 'auto', display: 'block' }}
          />
        </Link>
        <p style={{
          fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: MID, lineHeight: 1.6,
          margin: '4px 0 0', maxWidth: 380,
        }}>
          Operational Consulting + Digital Systems<br />
          A Veteran-Owned Small Business
        </p>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: MONO, fontSize: 10, fontWeight: 500,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: MID, marginBottom: 10,
        }}>
          Get in Touch
        </div>
        <Link to="/contact" style={{
          fontFamily: HEAD, fontSize: 28,
          letterSpacing: '0.06em', color: ACC,
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#5482ff'}
          onMouseLeave={e => e.currentTarget.style.color = ACC}>
          CONTACT US →
        </Link>
        <div style={{
          marginTop: 8, fontSize: 12, color: MID, fontFamily: SANS,
        }}>
          <a href="mailto:admin@vvvdigitals.com" style={{ color: MID, textDecoration: 'none' }}
             onMouseEnter={e => e.currentTarget.style.color = TXT}
             onMouseLeave={e => e.currentTarget.style.color = MID}>
            admin@vvvdigitals.com
          </a>
        </div>
      </div>
    </div>

    {/* ── Mid: Stripe / store placeholder row ─────────────────────── */}
    <div style={{
      borderTop: `1px solid ${BDR}`,
      borderBottom: `1px solid ${BDR}`,
      background: BG2,
    }}>
      <div className="vvv-footer-pay" style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 32, flexWrap: 'wrap',
        fontFamily: MONO, fontSize: 10, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: MID,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span aria-hidden="true" style={{ color: '#22c55e' }}>🔒</span>
          SSL Encrypted
        </span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Powered by <span style={{ color: TXT, fontWeight: 600, letterSpacing: '0.04em', fontStyle: 'italic' }}>Stripe</span>
        </span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span style={{ display: 'inline-flex', gap: 6 }}>
          {['VISA', 'MC', 'AMEX'].map(c => (
            <span key={c} style={{
              border: `1px solid ${BDR}`, padding: '4px 10px',
              borderRadius: 2, fontSize: 9, color: MID,
            }}>{c}</span>
          ))}
        </span>
      </div>
    </div>

    {/* ── Bottom bar ──────────────────────────────────────────────── */}
    <div className="vvv-footer-bottom" style={{
      maxWidth: 1200, margin: '0 auto',
      padding: '24px 32px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 16,
    }}>
      <span style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: MID,
      }}>
        © {new Date().getFullYear()} VVV Digitals LLC — Glendale, AZ
      </span>
      <nav style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {[
          { to: '/contact', label: 'Contact' },
          { to: '/privacy', label: 'Privacy' },
          { to: '/terms',   label: 'Terms'   },
        ].map(({ to, label }) => (
          <Link key={to} to={to} style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: MID, textDecoration: 'none',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = TXT}
            onMouseLeave={e => e.currentTarget.style.color = MID}>
            {label}
          </Link>
        ))}
      </nav>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .vvv-footer-top    { grid-template-columns: 1fr !important; padding: 56px 24px 40px !important; }
        .vvv-footer-top > div:last-child { text-align: left !important; }
        .vvv-footer-pay    { gap: 16px !important; padding: 18px 24px !important; }
        .vvv-footer-bottom { padding: 20px 24px !important; }
      }
    `}</style>
  </footer>
);

export default Footer;
