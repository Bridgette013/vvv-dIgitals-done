import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Nav from '../../components/Nav';
import { screenshots, meta } from '../../data/aeroadix-screenshots';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const BG   = '#080d14';
const BG2  = '#0c1220';
const BGC  = '#0f1520';
const BDR  = '#1a2332';
const ACC  = '#3B6EF8';
const MID  = '#4a5568';
const TXT  = '#E8EDF5';
const MONO = "'DM Mono', monospace";
const HEAD = "'Bebas Neue', cursive";
const SANS = "'DM Sans', sans-serif";

// ─── Sub-components ────────────────────────────────────────────────────────────
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

// ─── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ images, index, onClose, onNav }) => {
  const img = images[index];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft')  onNav(-1);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onNav]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5,8,14,0.96)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 24, right: 28,
            background: 'none', border: `1px solid ${BDR}`,
            color: MID, fontFamily: MONO, fontSize: 10,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '6px 14px', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.borderColor = TXT; e.target.style.color = TXT; }}
          onMouseLeave={e => { e.target.style.borderColor = BDR; e.target.style.color = MID; }}
        >
          ESC / Close
        </button>

        {/* Image */}
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: 1200, width: '100%' }}
        >
          <img
            src={img.src}
            alt={img.caption}
            style={{
              width: '100%', maxHeight: '72vh',
              objectFit: 'contain',
              border: `1px solid ${BDR}`,
              display: 'block',
            }}
          />
          <p style={{
            fontFamily: MONO, fontSize: 10,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: MID, marginTop: 16, textAlign: 'center',
          }}>
            {img.caption}
          </p>
        </motion.div>

        {/* Nav */}
        <div
          onClick={e => e.stopPropagation()}
          style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24 }}
        >
          <button
            onClick={() => onNav(-1)}
            disabled={index === 0}
            style={{
              background: 'none', border: `1px solid ${BDR}`,
              color: index === 0 ? BDR : MID,
              fontFamily: MONO, fontSize: 10, letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '8px 20px',
              cursor: index === 0 ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (index > 0) { e.target.style.borderColor = ACC; e.target.style.color = ACC; }}}
            onMouseLeave={e => { e.target.style.borderColor = BDR; e.target.style.color = index === 0 ? BDR : MID; }}
          >
            ← Prev
          </button>
          <span style={{ fontFamily: MONO, fontSize: 10, color: MID, letterSpacing: '0.1em' }}>
            {index + 1} / {images.length}
          </span>
          <button
            onClick={() => onNav(1)}
            disabled={index === images.length - 1}
            style={{
              background: 'none', border: `1px solid ${BDR}`,
              color: index === images.length - 1 ? BDR : MID,
              fontFamily: MONO, fontSize: 10, letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '8px 20px',
              cursor: index === images.length - 1 ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (index < images.length - 1) { e.target.style.borderColor = ACC; e.target.style.color = ACC; }}}
            onMouseLeave={e => { e.target.style.borderColor = BDR; e.target.style.color = index === images.length - 1 ? BDR : MID; }}
          >
            Next →
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Gallery Grid ──────────────────────────────────────────────────────────────
const Gallery = ({ images }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const handleNav = useCallback((dir) => {
    setLightboxIndex(i => {
      const next = i + dir;
      if (next < 0 || next >= images.length) return i;
      return next;
    });
  }, [images.length]);

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 2,
        background: BDR,
        border: `1px solid ${BDR}`,
        marginTop: 40,
      }}>
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            onClick={() => setLightboxIndex(i)}
            style={{
              background: BGC, cursor: 'pointer',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Image */}
            <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
              <img
                src={img.src}
                alt={img.caption}
                loading="lazy"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                  transition: 'transform 0.4s ease',
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            </div>

            {/* Hover overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(8,13,20,0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(8,13,20,0.55)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(8,13,20,0)'}
            >
              <span style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: TXT,
                opacity: 0, transition: 'opacity 0.3s',
                padding: '8px 16px', border: `1px solid ${ACC}`,
              }}
                className="gallery-zoom-label"
              >
                View
              </span>
            </div>

            {/* Caption */}
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${BDR}` }}>
              <p style={{
                fontFamily: MONO, fontSize: 9,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: MID, margin: 0,
              }}>
                {img.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .gallery-zoom-label { opacity: 0 !important; }
        div:hover > .gallery-zoom-label { opacity: 1 !important; }
      `}</style>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={handleNav}
        />
      )}
    </>
  );
};

// ─── Stack grid ────────────────────────────────────────────────────────────────
const stackItems = [
  { cat: 'Framework',      tech: 'React + Vite' },
  { cat: 'Styling',        tech: 'Tailwind CSS' },
  { cat: 'Animation',      tech: 'Framer Motion' },
  { cat: 'Deployment',     tech: 'Netlify CI/CD' },
  { cat: 'DNS & SSL',      tech: 'Netlify DNS + Let\'s Encrypt' },
  { cat: 'SEO',            tech: 'React Helmet + Schema.org' },
  { cat: 'Social Meta',    tech: 'Open Graph + Twitter Cards' },
  { cat: 'Version Control','tech': 'GitHub' },
];

// ─── AeroAdix Case Study Page ─────────────────────────────────────────────────
const AeroAdix = () => {
  const sx = { maxWidth: 1200, margin: '0 auto', padding: '0 32px' };

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TXT, fontFamily: SANS }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${ACC}; color: #fff; }
        @media (max-width: 768px) {
          .cs-split { grid-template-columns: 1fr !important; gap: 48px !important; }
          .cs-highlights { grid-template-columns: 1fr !important; }
          .cs-stack { grid-template-columns: 1fr 1fr !important; }
          .cs-hero-meta { flex-direction: column !important; gap: 24px !important; }
          .cs-hero-title { font-size: clamp(64px, 18vw, 120px) !important; }
        }
      `}</style>

      <Nav />

      {/* ── HERO ── */}
      <section style={{ padding: '100px 0 80px', borderBottom: `1px solid ${BDR}` }}>
        <div style={sx}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Label>Case Study — 001</Label>

            {/* Split title treatment: AERO solid, ADIX outlined */}
            <h1
              className="cs-hero-title"
              style={{
                fontFamily: HEAD,
                fontSize: 'clamp(80px, 13vw, 160px)',
                lineHeight: 0.88,
                letterSpacing: '0.02em',
                marginBottom: 36,
              }}
            >
              <span style={{ color: TXT }}>AERO</span>
              <span style={{
                color: 'transparent',
                WebkitTextStroke: `1px ${ACC}`,
              }}>ADIX</span>
            </h1>

            <p style={{
              fontSize: 16, lineHeight: 1.8,
              color: '#6b7f99', maxWidth: 540, marginBottom: 52,
            }}>
              Brand identity, custom React platform, and full technical deployment
              for a performance automotive aerodynamics startup — built from zero
              to live in under two weeks.
            </p>

            {/* Meta row */}
            <div
              className="cs-hero-meta"
              style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}
            >
              {[
                { label: 'Client',    value: meta.client },
                { label: 'Timeline',  value: meta.timeline },
                { label: 'Location',  value: meta.location },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: MID, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: TXT }}>{value}</div>
                </div>
              ))}
              <div>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: MID, marginBottom: 6 }}>Live Site</div>
                <a
                  href={meta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: ACC,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#22c55e',
                    animation: 'pulse 2s infinite',
                  }} />
                  aeroadix.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BRIEF + PROBLEM ── */}
      <section style={{ padding: '80px 0' }}>
        <div style={sx}>
          <div
            className="cs-split"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
            >
              <Label>The Brief</Label>
              <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(36px, 5vw, 56px)', color: TXT, letterSpacing: '0.03em', marginBottom: 24, lineHeight: 1 }}>
                A CONCEPT WITHOUT A PRESENCE
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#6b7f99' }}>
                AeroAdix arrived as an engineering vision with no digital presence,
                no brand language, and no way to communicate the technical
                sophistication of their process to a market full of skeptical
                enthusiasts.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#6b7f99', marginTop: 16 }}>
                The ask: build something that looked and felt like it belonged next
                to the OEM brands they were competing with — and do it fast.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Label>The Problem</Label>
              <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(36px, 5vw, 56px)', color: TXT, letterSpacing: '0.03em', marginBottom: 24, lineHeight: 1 }}>
                NOISE IN A CROWDED MARKET
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#6b7f99' }}>
                The performance automotive aftermarket is saturated with cheap
                cosmetic parts and hollow branding. AeroAdix's differentiator —
                every component 3D-scanned, CFD-simulated, and precision printed —
                was genuinely technical and genuinely different.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#6b7f99', marginTop: 16 }}>
                Without the right language and presentation, it would read the same
                as everyone else.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── HIGHLIGHTS ── */}
      <section style={{ padding: '80px 0' }}>
        <div style={sx}>
          <Label>By the Numbers</Label>
          <div
            className="cs-highlights"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: BDR, border: `1px solid ${BDR}` }}
          >
            {[
              { num: '01', label: 'Developer. Zero Team.', desc: 'Every line of code, every pixel, every word. No agency. No templates. No shortcuts.' },
              { num: '14', label: 'Days to Production', desc: 'Blank repo to live deployment on custom DNS — CI/CD pipeline, SSL, SEO infrastructure.' },
              { num: '06', label: 'Disciplines Delivered', desc: 'Brand identity, development, copywriting, DevOps, SEO, and project management — all in scope.' },
            ].map(({ num, label, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: BGC, padding: '40px 32px' }}
              >
                <div style={{ fontFamily: HEAD, fontSize: 64, color: ACC, opacity: 0.5, lineHeight: 1, marginBottom: 12 }}>{num}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TXT, marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 13, lineHeight: 1.65, color: MID }}>{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── THE BUILD ── */}
      <section style={{ padding: '80px 0' }}>
        <div style={sx}>
          <Label>The Build</Label>
          <div
            className="cs-split"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 56 }}
          >
            <div>
              <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(36px, 5vw, 56px)', color: TXT, letterSpacing: '0.03em', marginBottom: 24, lineHeight: 1 }}>
                WHAT WE BUILT
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#6b7f99', marginBottom: 16 }}>
                A full custom React SPA — no templates, no WordPress, no shortcuts.
                Built from scratch with Vite, Tailwind CSS, and Framer Motion with
                interactive components, custom animations, and a responsive layout
                engineered for both desktop and mobile.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#6b7f99', marginBottom: 16 }}>
                The brand work ran parallel to the build. The AeroAdix logo and the
                M.A.S.T. concept — Motorsports Aerodynamics Surface Technologies —
                was developed as the brand's technical identity framework and woven
                throughout the site's structure and copy.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#6b7f99' }}>
                The CFD process section required technically accurate content about
                computational fluid dynamics — Navier-Stokes, pressure mapping,
                boundary layer simulation. Researched, written, and structured for
                both technical and general audiences.
              </p>
            </div>

            {/* Stack grid */}
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: MID, marginBottom: 20 }}>Tech Stack</div>
              <div
                className="cs-stack"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: BDR, border: `1px solid ${BDR}` }}
              >
                {stackItems.map(({ cat, tech }) => (
                  <div key={cat} style={{ background: BGC, padding: '16px 20px' }}>
                    <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACC, marginBottom: 6 }}>{cat}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: TXT }}>{tech}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services tags */}
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: MID, marginBottom: 16 }}>Services Delivered</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {meta.services.map(s => (
              <span key={s} style={{
                fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: ACC,
                border: `1px solid ${ACC}33`, padding: '8px 14px',
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── GALLERY ── */}
      <section style={{ padding: '80px 0' }}>
        <div style={sx}>
          <Label>Site Gallery</Label>
          <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(36px, 5vw, 56px)', color: TXT, letterSpacing: '0.03em', marginBottom: 8, lineHeight: 1 }}>
            THE FINISHED PRODUCT
          </h2>
          <p style={{ fontSize: 15, color: '#6b7f99', maxWidth: 500 }}>
            Every section, every interaction — built and deployed live at aeroadix.com.
          </p>
          <Gallery images={screenshots} />
        </div>
      </section>

      <Divider />

      {/* ── CTA ── */}
      <section style={{ padding: '100px 0', textAlign: 'center' }}>
        <div style={{ ...sx, maxWidth: 640 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Label>Ready to Build?</Label>
            <h2 style={{ fontFamily: HEAD, fontSize: 'clamp(48px, 8vw, 96px)', color: TXT, letterSpacing: '0.03em', lineHeight: 0.95, marginBottom: 24 }}>
              LET'S BUILD YOURS
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#6b7f99', marginBottom: 40 }}>
              VVV Digitals delivers full-stack digital solutions — from concept through
              production. One point of contact. No agency markup.
            </p>
            <a
              href="/#contact"
              style={{
                display: 'inline-block',
                padding: '14px 44px', background: ACC, color: '#fff',
                fontFamily: MONO, fontSize: 10, fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = '#6b93fa'}
              onMouseLeave={e => e.target.style.background = ACC}
            >
              Start a Conversation
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${BDR}`,
        padding: '28px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Link to="/" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.15em', color: MID, textDecoration: 'none' }}>
            VVV / DIGITALS
          </Link>
          <span style={{ fontFamily: MONO, fontSize: 10, color: BDR, letterSpacing: '0.1em' }}>
            © 2026 VVV Digitals LLC — Glendale, AZ
          </span>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default AeroAdix;
