import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const BG  = '#080d14';
const BDR = '#1a2332';
const ACC = '#3B6EF8';
const MID = '#4a5568';
const TXT = '#E8EDF5';

const Nav = () => {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome   = location.pathname === '/';

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const monoLabel = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11, fontWeight: 500,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    textDecoration: 'none', color: MID,
    transition: 'color 0.2s',
  };

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(8,13,20,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${scrolled ? BDR : 'transparent'}`,
        transition: 'all 0.3s',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 32px', height: 64,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13, fontWeight: 500,
              letterSpacing: '0.2em', color: TXT,
            }}>
              VVV <span style={{ color: MID }}>/</span> DIGITALS
            </span>
          </Link>

          {/* Desktop */}
          <nav style={{ display: 'flex', gap: 36, alignItems: 'center' }} className="vvv-desktop-nav">
            {isHome ? (
              ['services','tools','products','about'].map(s => (
                <a key={s} href={`#${s}`} style={monoLabel}
                   onMouseEnter={e => e.target.style.color = TXT}
                   onMouseLeave={e => e.target.style.color = MID}>{s}</a>
              ))
            ) : (
              <>
                <Link to="/" style={monoLabel}
                      onMouseEnter={e => e.target.style.color = TXT}
                      onMouseLeave={e => e.target.style.color = MID}>Home</Link>
                <Link to="/work/aeroadix" style={monoLabel}
                      onMouseEnter={e => e.target.style.color = TXT}
                      onMouseLeave={e => e.target.style.color = MID}>Work</Link>
              </>
            )}
            <a href={isHome ? '#contact' : '/#contact'} style={{
                ...monoLabel, color: ACC,
                padding: '8px 20px',
                border: `1px solid ${ACC}33`,
                borderRadius: 2,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${ACC}18`; e.currentTarget.style.color = TXT; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = ACC; }}>
              Contact
            </a>
          </nav>

          {/* Mobile burger */}
          <button className="vvv-mobile-toggle"
            onClick={() => setMobileOpen(o => !o)}
            style={{ background: 'none', border: 'none', color: MID, cursor: 'pointer', padding: 8, display: 'none', fontSize: 18 }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden', borderTop: `1px solid ${BDR}`, background: 'rgba(8,13,20,0.98)' }}>
              <div style={{ padding: '20px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {isHome
                  ? ['services','tools','products','about'].map(s => (
                      <a key={s} href={`#${s}`} style={{ ...monoLabel, color: '#6b7280' }}
                         onClick={() => setMobileOpen(false)}>{s}</a>
                    ))
                  : [['/', 'Home'], ['/work/aeroadix', 'Work']].map(([to, label]) => (
                      <Link key={to} to={to} style={{ ...monoLabel, color: '#6b7280' }}>{label}</Link>
                    ))
                }
                <a href={isHome ? '#contact' : '/#contact'}
                   style={{ ...monoLabel, color: ACC }}
                   onClick={() => setMobileOpen(false)}>Contact</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <style>{`
        @media (max-width: 768px) {
          .vvv-desktop-nav   { display: none !important; }
          .vvv-mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Nav;
