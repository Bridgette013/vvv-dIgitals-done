import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

/**
 * AeroAdix Case Study
 * Route: /work/aeroadix
 * Screenshots served from: /work/aeroadix/screenshots/
 *
 * Self-contained component — all styles scoped under .aa-cs to avoid
 * collision with VVV Digitals site styles. Drop-in ready.
 */

const SHOTS = '/work/aeroadix/screenshots';
const SITE_URL = 'https://vvvdigitals.com';
const PAGE_URL = `${SITE_URL}/work/aeroadix`;
const OG_IMAGE = `${SITE_URL}/work/aeroadix/og-image.png`; // TEMP: using a homepage screenshot until a 1200x630 OG card is designed

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'AeroAdix · Production ecommerce + owner-operated CMS',
  description:
    'A production-grade React + Vite ecommerce site and self-serve Supabase-powered CMS, built end-to-end for a CFD-engineered, 3D-printed performance aerodynamics brand. Built by VVV Digitals.',
  image: OG_IMAGE,
  url: PAGE_URL,
  datePublished: '2026-04-26',
  dateModified: '2026-05-06',
  author: {
    '@type': 'Organization',
    name: 'VVV Digitals LLC',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'VVV Digitals LLC',
    url: SITE_URL,
  },
  about: {
    '@type': 'CreativeWork',
    name: 'AeroAdix Fabrication Solutions',
    url: 'https://aeroadix.com',
  },
  keywords:
    'case study, ecommerce, React, Vite, Supabase, Stripe, Netlify, CMS, headless commerce, VVV Digitals, AeroAdix, 3D-printed aerodynamics, web development, portfolio',
};

export default function AeroAdix() {
  return (
    <>
      <Helmet>
        <title>AeroAdix — Production ecommerce + owner-operated CMS · VVV Digitals</title>
        <meta
          name="description"
          content="A production-grade React + Vite ecommerce site and self-serve Supabase CMS, built end-to-end in ten weeks for a CFD-engineered aerodynamics brand. Case study from VVV Digitals."
        />
        <link rel="canonical" href={PAGE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={PAGE_URL} />
        <meta
          property="og:title"
          content="AeroAdix — Production ecommerce + owner-operated CMS"
        />
        <meta
          property="og:description"
          content="React + Vite ecommerce, Supabase-powered CMS, Stripe checkout. Owner-operated end to end. Built by VVV Digitals."
        />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="VVV Digitals" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="AeroAdix — Case Study · VVV Digitals"
        />
        <meta
          name="twitter:description"
          content="Production ecommerce + owner-operated CMS. Built in ten weeks. End to end."
        />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* Structured data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <style>{`
        /* ============ AeroAdix Case Study — Scoped Styles ============ */
        .aa-cs {
          --aa-blue-deep: #184EA7;
          --aa-blue-bright: #2B64D8;
          --aa-black: #000000;
          --aa-canvas: #050608;
          --aa-surface: #0C0E12;
          --aa-surface-2: #15181E;
          --aa-silver: #B9BCC1;
          --aa-dark-gray: #484A4E;
          --aa-off-white: #EDEDEE;
          --aa-rule: rgba(185, 188, 193, 0.12);
          --aa-rule-strong: rgba(185, 188, 193, 0.24);
          --aa-font-display: 'Geist', system-ui, sans-serif;
          --aa-font-body: 'Inter', system-ui, sans-serif;
          --aa-font-mono: 'JetBrains Mono', ui-monospace, monospace;
          --aa-max: 1280px;
          --aa-pad: clamp(1.25rem, 4vw, 3.5rem);

          background: var(--aa-canvas);
          color: var(--aa-off-white);
          font-family: var(--aa-font-body);
          font-weight: 400;
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          display: block;
          width: 100%;
          overflow-x: hidden;
        }
        .aa-cs *, .aa-cs *::before, .aa-cs *::after { box-sizing: border-box; }
        .aa-cs ::selection { background: var(--aa-blue-bright); color: var(--aa-off-white); }
        .aa-cs a { color: inherit; text-decoration: none; }

        .aa-cs .wrap {
          max-width: var(--aa-max);
          margin: 0 auto;
          padding-left: var(--aa-pad);
          padding-right: var(--aa-pad);
        }
        .aa-cs .wrap-wide {
          max-width: 1480px;
          margin: 0 auto;
          padding-left: var(--aa-pad);
          padding-right: var(--aa-pad);
        }

        .aa-cs .eyebrow {
          font-family: var(--aa-font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--aa-silver);
          font-weight: 500;
        }
        .aa-cs .eyebrow .dot {
          display: inline-block;
          width: 6px; height: 6px;
          background: var(--aa-blue-bright);
          border-radius: 50%;
          margin: 0 0.65em 0.1em 0;
          vertical-align: middle;
        }

        /* Breadcrumb */
        .aa-cs .crumb {
          padding: 1.5rem 0 0;
          font-family: var(--aa-font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--aa-silver);
        }
        .aa-cs .crumb a {
          color: var(--aa-silver);
          transition: color 0.2s ease;
        }
        .aa-cs .crumb a:hover { color: var(--aa-off-white); }
        .aa-cs .crumb .sep { margin: 0 0.6em; opacity: 0.5; }
        .aa-cs .crumb .current { color: var(--aa-off-white); }

        /* HERO */
        .aa-cs .hero {
          padding: clamp(2.5rem, 7vw, 5rem) 0 clamp(2.5rem, 6vw, 4.5rem);
          position: relative;
          overflow: hidden;
        }
        .aa-cs .hero::before {
          content: "";
          position: absolute;
          top: -10%; right: -10%;
          width: 60vw; height: 60vw;
          background: radial-gradient(circle at center, rgba(43, 100, 216, 0.18) 0%, transparent 60%);
          pointer-events: none;
          filter: blur(20px);
        }
        .aa-cs .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(185,188,193,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(185,188,193,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          mask-image: linear-gradient(180deg, transparent 0%, black 25%, black 75%, transparent 100%);
          -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 25%, black 75%, transparent 100%);
        }
        .aa-cs .hero .wrap { position: relative; z-index: 1; }

        .aa-cs .hero-eyebrow-row {
          display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;
          margin-bottom: 2.5rem;
          opacity: 0;
          animation: aa-fade-up 0.7s 0.1s ease forwards;
        }
        .aa-cs .hero-eyebrow-row .div { width: 1px; height: 12px; background: var(--aa-dark-gray); }

        .aa-cs .hero h1 {
          font-family: var(--aa-font-display);
          font-weight: 800;
          font-size: clamp(3rem, 11vw, 9.5rem);
          line-height: 0.92;
          letter-spacing: -0.04em;
          margin: 0 0 0.4em;
          opacity: 0;
          animation: aa-fade-up 0.9s 0.2s ease forwards;
        }
        .aa-cs .hero h1 .aero { color: var(--aa-silver); font-weight: 600; }
        .aa-cs .hero h1 .dot-mark { color: var(--aa-blue-bright); margin: 0 0.04em; }
        .aa-cs .hero h1 .adix { color: var(--aa-off-white); font-weight: 800; }

        .aa-cs .hero-sub {
          font-family: var(--aa-font-display);
          font-weight: 400;
          font-size: clamp(1.15rem, 2vw, 1.5rem);
          line-height: 1.4;
          color: var(--aa-silver);
          max-width: 38ch;
          margin: 0 0 2.5rem;
          opacity: 0;
          animation: aa-fade-up 0.9s 0.35s ease forwards;
        }

        .aa-cs .hero-meta {
          display: flex; gap: 2rem; flex-wrap: wrap;
          font-family: var(--aa-font-mono);
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          color: var(--aa-silver);
          opacity: 0;
          animation: aa-fade-up 0.9s 0.5s ease forwards;
        }
        .aa-cs .hero-meta a {
          color: var(--aa-blue-bright);
          border-bottom: 1px solid currentColor;
          padding-bottom: 2px;
          transition: color 0.2s ease;
        }
        .aa-cs .hero-meta a:hover { color: var(--aa-off-white); }

        /* Ticker */
        .aa-cs .ticker {
          border-top: 1px solid var(--aa-rule-strong);
          border-bottom: 1px solid var(--aa-rule-strong);
          padding: 2rem 0;
          background: var(--aa-black);
        }
        .aa-cs .ticker .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
        .aa-cs .ticker .cell { padding: 0 1.5rem; border-right: 1px solid var(--aa-rule); }
        .aa-cs .ticker .cell:last-child { border-right: none; }
        .aa-cs .ticker .cell:first-child { padding-left: 0; }
        .aa-cs .ticker .num {
          font-family: var(--aa-font-display);
          font-weight: 700;
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--aa-off-white);
          margin-bottom: 0.5rem;
        }
        .aa-cs .ticker .label {
          font-family: var(--aa-font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--aa-silver);
        }
        @media (max-width: 720px) {
          .aa-cs .ticker .grid { grid-template-columns: repeat(2, 1fr); row-gap: 2rem; }
          .aa-cs .ticker .cell:nth-child(2) { border-right: none; }
          .aa-cs .ticker .cell:nth-child(3) { padding-left: 0; }
        }

        .aa-cs section { padding: clamp(3.5rem, 7vw, 6rem) 0; }
        .aa-cs section.tight { padding: clamp(2rem, 4vw, 3.5rem) 0; }

        .aa-cs .section-head {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: clamp(2rem, 6vw, 5rem);
          margin-bottom: 3.5rem;
          align-items: start;
        }
        @media (max-width: 880px) {
          .aa-cs .section-head { grid-template-columns: 1fr; gap: 1.5rem; }
        }

        .aa-cs .section-head .lead h2 {
          font-family: var(--aa-font-display);
          font-size: clamp(2rem, 4.5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.025em;
          margin: 1rem 0 0;
          color: var(--aa-off-white);
        }
        .aa-cs .section-head .body p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--aa-silver);
          margin: 0;
          max-width: 60ch;
        }
        .aa-cs .section-head .body p + p { margin-top: 1.25em; }
        .aa-cs .section-head .body strong { color: var(--aa-off-white); font-weight: 500; }

        /* Brief */
        .aa-cs .brief {
          background: var(--aa-black);
          border-top: 1px solid var(--aa-rule);
          border-bottom: 1px solid var(--aa-rule);
        }
        .aa-cs .brief blockquote {
          font-family: var(--aa-font-display);
          font-size: clamp(1.5rem, 3vw, 2.4rem);
          line-height: 1.25;
          font-weight: 500;
          letter-spacing: -0.015em;
          color: var(--aa-off-white);
          max-width: 28ch;
          margin: 0 auto;
          text-align: center;
          padding: clamp(2rem, 4vw, 3rem) 0;
          position: relative;
        }
        .aa-cs .brief blockquote::before, .aa-cs .brief blockquote::after {
          content: "";
          display: block;
          width: 40px; height: 1px;
          background: var(--aa-blue-bright);
          margin: 0 auto 2rem;
        }
        .aa-cs .brief blockquote::after { margin: 2rem auto 0; }
        .aa-cs .brief blockquote em { font-style: normal; color: var(--aa-blue-bright); }

        /* Phase */
        .aa-cs .phase + .phase { border-top: 1px solid var(--aa-rule); }
        .aa-cs .phase-meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.5rem; }
        .aa-cs .phase-num {
          font-family: var(--aa-font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          color: var(--aa-blue-bright);
          font-weight: 600;
        }

        /* Browser-framed screenshots */
        .aa-cs .browser {
          background: var(--aa-surface);
          border: 1px solid var(--aa-rule-strong);
          border-radius: 6px;
          overflow: hidden;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.04) inset,
            0 25px 50px -20px rgba(0,0,0,0.7),
            0 10px 25px -10px rgba(0,0,0,0.4);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .aa-cs .browser:hover {
          transform: translateY(-4px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 35px 60px -20px rgba(0,0,0,0.8),
            0 15px 30px -10px rgba(43, 100, 216, 0.15);
        }
        .aa-cs .browser-bar {
          background: var(--aa-surface-2);
          padding: 0.65rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          border-bottom: 1px solid var(--aa-rule);
        }
        .aa-cs .browser-dots { display: flex; gap: 0.4rem; flex-shrink: 0; }
        .aa-cs .browser-dots span {
          width: 9px; height: 9px;
          border-radius: 50%;
          background: var(--aa-dark-gray);
        }
        .aa-cs .browser-dots span:nth-child(1) { background: #FF5F57; }
        .aa-cs .browser-dots span:nth-child(2) { background: #FEBC2E; }
        .aa-cs .browser-dots span:nth-child(3) { background: #28C840; }
        .aa-cs .browser-url {
          flex: 1;
          font-family: var(--aa-font-mono);
          font-size: 0.72rem;
          color: var(--aa-silver);
          background: var(--aa-canvas);
          padding: 0.4rem 0.85rem;
          border-radius: 4px;
          border: 1px solid var(--aa-rule);
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .aa-cs .browser-url .lock {
          color: var(--aa-blue-bright);
          margin-right: 0.5em;
          font-size: 0.7em;
        }
        .aa-cs .browser-img {
          display: block;
          width: 100%;
          height: auto;
        }
        .aa-cs .browser-img.cap-tall {
          max-height: 640px;
          object-fit: cover;
          object-position: top;
        }
        .aa-cs .browser-img.cap-mid {
          max-height: 520px;
          object-fit: cover;
          object-position: top;
        }
        .aa-cs .browser-caption {
          margin-top: 0.85rem;
          font-family: var(--aa-font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--aa-silver);
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0 0.25rem;
        }
        .aa-cs .browser-caption .right { color: var(--aa-dark-gray); }

        .aa-cs .shots-grid { display: grid; gap: clamp(1.25rem, 2.5vw, 2rem); margin-top: 2rem; }
        .aa-cs .shots-grid.cols-2 { grid-template-columns: 1fr 1fr; }
        @media (max-width: 880px) {
          .aa-cs .shots-grid.cols-2 { grid-template-columns: 1fr; }
        }
        .aa-cs .shot-block { display: flex; flex-direction: column; }

        /* Featured build */
        .aa-cs .featured-build {
          background: linear-gradient(180deg, var(--aa-canvas) 0%, var(--aa-black) 100%);
          border-top: 1px solid var(--aa-rule);
          border-bottom: 1px solid var(--aa-rule);
          position: relative;
          overflow: hidden;
        }
        .aa-cs .featured-build::before {
          content: "";
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 80vw; height: 80vw;
          background: radial-gradient(circle at center, rgba(43, 100, 216, 0.08) 0%, transparent 55%);
          pointer-events: none;
        }
        .aa-cs .featured-build .wrap-wide { position: relative; }
        .aa-cs .featured-head {
          text-align: center;
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }
        .aa-cs .featured-head .eyebrow { display: inline-block; margin-bottom: 1rem; }
        .aa-cs .featured-head h2 {
          font-family: var(--aa-font-display);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin: 0 0 1rem;
          color: var(--aa-off-white);
        }
        .aa-cs .featured-head h2 .accent { color: var(--aa-blue-bright); }
        .aa-cs .featured-head p {
          color: var(--aa-silver);
          max-width: 52ch;
          margin: 0 auto;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        /* Deliverables */
        .aa-cs .deliverables {
          list-style: none;
          padding: 0;
          margin: 2rem 0 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          counter-reset: aa-d;
        }
        .aa-cs .deliverables li {
          padding: 1rem 0;
          border-bottom: 1px solid var(--aa-rule);
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 1rem;
          align-items: start;
          color: var(--aa-off-white);
          font-size: 0.98rem;
          line-height: 1.5;
        }
        .aa-cs .deliverables li::before {
          content: counter(aa-d, decimal-leading-zero);
          counter-increment: aa-d;
          font-family: var(--aa-font-mono);
          font-size: 0.7rem;
          color: var(--aa-dark-gray);
          padding-top: 4px;
          letter-spacing: 0.05em;
        }
        .aa-cs .delivers-toggle {
          margin-top: 2.5rem;
          border-top: 1px solid var(--aa-rule);
          padding-top: 2rem;
        }
        .aa-cs .delivers-toggle summary {
          cursor: pointer;
          list-style: none;
          font-family: var(--aa-font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--aa-silver);
          padding: 0.5rem 0;
          transition: color 0.2s ease;
        }
        .aa-cs .delivers-toggle summary::-webkit-details-marker { display: none; }
        .aa-cs .delivers-toggle summary::after {
          content: "+";
          margin-left: 0.6em;
          color: var(--aa-blue-bright);
          font-weight: 600;
        }
        .aa-cs .delivers-toggle[open] summary::after { content: "−"; }
        .aa-cs .delivers-toggle summary:hover { color: var(--aa-off-white); }

        /* Stack */
        .aa-cs .stack {
          background: var(--aa-black);
          border-top: 1px solid var(--aa-rule);
          border-bottom: 1px solid var(--aa-rule);
        }
        .aa-cs .stack-table { width: 100%; border-collapse: collapse; margin-top: 2rem; }
        .aa-cs .stack-table th, .aa-cs .stack-table td {
          text-align: left;
          padding: 1rem 0;
          border-bottom: 1px solid var(--aa-rule);
          vertical-align: top;
        }
        .aa-cs .stack-table th {
          font-family: var(--aa-font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--aa-silver);
          font-weight: 500;
          width: 28%;
          padding-right: 2rem;
        }
        .aa-cs .stack-table td { color: var(--aa-off-white); font-size: 0.98rem; }
        .aa-cs .stack-table td .pill {
          display: inline-block;
          font-family: var(--aa-font-mono);
          font-size: 0.78rem;
          color: var(--aa-blue-bright);
          border: 1px solid rgba(43, 100, 216, 0.3);
          padding: 0.2em 0.7em;
          border-radius: 999px;
          margin: 0.15em 0.4em 0.15em 0;
        }

        /* Outcome */
        .aa-cs .outcome-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--aa-rule);
          border: 1px solid var(--aa-rule);
          margin-top: 1rem;
        }
        @media (max-width: 880px) { .aa-cs .outcome-grid { grid-template-columns: 1fr; } }
        .aa-cs .outcome-cell { background: var(--aa-canvas); padding: 2rem; }
        .aa-cs .outcome-cell .num {
          font-family: var(--aa-font-mono);
          font-size: 0.72rem;
          color: var(--aa-blue-bright);
          letter-spacing: 0.18em;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }
        .aa-cs .outcome-cell h3 {
          font-family: var(--aa-font-display);
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--aa-off-white);
          margin: 0 0 0.5rem;
          letter-spacing: -0.01em;
        }
        .aa-cs .outcome-cell p {
          color: var(--aa-silver);
          font-size: 0.92rem;
          line-height: 1.55;
          margin: 0;
        }

        /* Live link strip */
        .aa-cs .live-strip {
          background: linear-gradient(135deg, var(--aa-blue-deep) 0%, var(--aa-blue-bright) 100%);
          padding: clamp(2.5rem, 5vw, 4rem) 0;
          position: relative;
          overflow: hidden;
        }
        .aa-cs .live-strip::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 100% 32px;
          pointer-events: none;
        }
        .aa-cs .live-strip .row {
          display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap;
          position: relative;
        }
        .aa-cs .live-strip .label {
          font-family: var(--aa-font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 0.5rem;
        }
        .aa-cs .live-strip a.url {
          font-family: var(--aa-font-display);
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
          display: inline-block;
          border-bottom: 2px solid rgba(255,255,255,0.4);
          padding-bottom: 0.15em;
          transition: border-color 0.2s ease;
        }
        .aa-cs .live-strip a.url:hover { border-color: white; }
        .aa-cs .live-strip .arrow {
          font-family: var(--aa-font-display);
          font-size: clamp(2.5rem, 6vw, 4rem);
          color: rgba(255,255,255,0.5);
          line-height: 1;
        }

        /* Credits */
        .aa-cs .credits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        @media (max-width: 720px) { .aa-cs .credits-grid { grid-template-columns: 1fr; gap: 1.5rem; } }
        .aa-cs .credit-block .label {
          font-family: var(--aa-font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--aa-silver);
          margin-bottom: 0.75rem;
          font-weight: 500;
        }
        .aa-cs .credit-block .value {
          font-family: var(--aa-font-display);
          font-size: 1rem;
          color: var(--aa-off-white);
          font-weight: 500;
          line-height: 1.4;
        }
        .aa-cs .credit-block .value small {
          display: block;
          font-family: var(--aa-font-body);
          font-size: 0.85rem;
          color: var(--aa-silver);
          font-weight: 400;
          margin-top: 0.3em;
        }

        /* CTA — closing */
        .aa-cs .cta {
          background: var(--aa-black);
          border-top: 1px solid var(--aa-rule);
          padding: clamp(4rem, 8vw, 7rem) 0;
        }
        .aa-cs .cta-head {
          text-align: center;
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }
        .aa-cs .cta-head .eyebrow { display: inline-block; margin-bottom: 1rem; }
        .aa-cs .cta-head h2 {
          font-family: var(--aa-font-display);
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin: 0;
          color: var(--aa-off-white);
        }
        .aa-cs .cta-head h2 .accent { color: var(--aa-blue-bright); }
        .aa-cs .cta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--aa-rule-strong);
          border: 1px solid var(--aa-rule-strong);
        }
        @media (max-width: 720px) { .aa-cs .cta-grid { grid-template-columns: 1fr; } }
        .aa-cs .cta-card {
          background: var(--aa-canvas);
          padding: clamp(2rem, 4vw, 3rem);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: background 0.3s ease;
          position: relative;
          color: var(--aa-off-white);
        }
        .aa-cs .cta-card:hover {
          background: var(--aa-surface-2);
        }
        .aa-cs .cta-card .label {
          font-family: var(--aa-font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--aa-blue-bright);
          font-weight: 600;
        }
        .aa-cs .cta-card h3 {
          font-family: var(--aa-font-display);
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0;
          color: var(--aa-off-white);
        }
        .aa-cs .cta-card p {
          color: var(--aa-silver);
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
          max-width: 40ch;
        }
        .aa-cs .cta-card .arrow {
          margin-top: auto;
          padding-top: 1.5rem;
          font-family: var(--aa-font-display);
          font-size: 1rem;
          font-weight: 600;
          color: var(--aa-blue-bright);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: gap 0.2s ease, color 0.2s ease;
        }
        .aa-cs .cta-card:hover .arrow {
          gap: 0.85rem;
          color: var(--aa-off-white);
        }
        .aa-cs .cta-card .arrow span:last-child {
          font-size: 1.2em;
          line-height: 0;
        }

        /* Animations */
        @keyframes aa-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aa-cs *, .aa-cs *::before, .aa-cs *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <article className="aa-cs">
        {/* Breadcrumb */}
        <div className="wrap">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to="/work">Work</Link>
            <span className="sep">/</span>
            <span className="current">AeroAdix</span>
          </nav>
        </div>

        {/* Hero */}
        <header className="hero">
          <div className="wrap">
            <div className="hero-eyebrow-row">
              <span className="eyebrow">
                <span className="dot"></span>Case Study · 2026
              </span>
              <span className="div"></span>
              <span className="eyebrow">Ecommerce + CMS · Phase 1+2 · Final</span>
            </div>

            <h1>
              <span className="aero">AERO</span>
              <span className="dot-mark">·</span>
              <span className="adix">ADIX</span>
            </h1>

            <p className="hero-sub">
              A production-grade ecommerce site and owner-operated CMS for a
              CFD-engineered, 3D-printed aerodynamics brand. Built end-to-end in ten weeks.
            </p>

            <div className="hero-meta">
              <span>VVV DIGITALS · BRIT, DIRECTOR OF DIGITAL OPERATIONS</span>
              <a href="https://aeroadix.com" target="_blank" rel="noopener noreferrer">
                aeroadix.com →
              </a>
            </div>
          </div>
        </header>

        {/* Ticker */}
        <section className="ticker tight" aria-label="Engagement at a glance">
          <div className="wrap">
            <div className="grid">
              <div className="cell">
                <div className="num">10</div>
                <div className="label">Active Weeks</div>
              </div>
              <div className="cell">
                <div className="num">02</div>
                <div className="label">Phases Delivered</div>
              </div>
              <div className="cell">
                <div className="num">04</div>
                <div className="label">Vehicle Platforms</div>
              </div>
              <div className="cell">
                <div className="num">
                  9<span style={{ color: 'var(--aa-blue-bright)' }}>+</span>6
                </div>
                <div className="label">Public + Admin Routes</div>
              </div>
            </div>
          </div>
        </section>

        {/* The Brief */}
        <section className="brief">
          <div className="wrap">
            <span
              className="eyebrow"
              style={{ display: 'block', textAlign: 'center', marginBottom: '0.5rem' }}
            >
              <span className="dot"></span>The Brief
            </span>
            <blockquote>
              Build a production-grade ecommerce site for a CFD-engineered aerodynamics brand.{' '}
              <em>Make it ownable. Make it self-serve.</em>
            </blockquote>
          </div>
        </section>

        {/* Phase 1 */}
        <section className="phase">
          <div className="wrap-wide">
            <div className="section-head">
              <div className="lead">
                <div className="phase-meta">
                  <span className="phase-num">PHASE 01</span>
                  <span className="eyebrow">Delivered Apr 24, 2026</span>
                </div>
                <h2>The Site.</h2>
              </div>
              <div className="body">
                <p>
                  A custom React + Vite single-page application with nine public routes —
                  homepage, shop, category, product detail, cart, checkout, order
                  confirmation, contact, and a custom 404. Branded from logo system through
                  to social card.
                </p>
                <p>
                  Stripe checkout via a serverless Netlify Function.{' '}
                  <strong>WCAG 2.1 AA accessibility audit and remediation.</strong>{' '}
                  Forty-eight product photographs processed and a full SEO launch kit
                  shipped — sitemap, robots, meta, Open Graph, font preloading, lazy
                  loading, WebP pipeline.
                </p>
              </div>
            </div>

            {/* Homepage hero */}
            <div className="shot-block">
              <div className="browser">
                <div className="browser-bar">
                  <div className="browser-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="browser-url">
                    <span className="lock">🔒</span>aeroadix.com
                  </div>
                </div>
                <img
                  src={`${SHOTS}/01-homepage-full.png`}
                  alt="AeroAdix homepage — top fold showing the rotating product carousel, M.A.S.T. concept tagline, and four-platform vehicle selector"
                  className="browser-img cap-tall"
                  loading="lazy"
                />
              </div>
              <div className="browser-caption">
                <span>01 · Homepage</span>
                <span className="right">/</span>
              </div>
            </div>

            {/* 2x2 grid */}
            <div className="shots-grid cols-2">
              <div className="shot-block">
                <div className="browser">
                  <div className="browser-bar">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-url">
                      <span className="lock">🔒</span>aeroadix.com/shop
                    </div>
                  </div>
                  <img
                    src={`${SHOTS}/03-shop.png`}
                    alt="AeroAdix shop catalog — four vehicle platform tiles for Focus RS, GTR R35, BMW E90/E92, and Subaru STI"
                    className="browser-img"
                    loading="lazy"
                  />
                </div>
                <div className="browser-caption">
                  <span>02 · Shop catalog</span>
                  <span className="right">/shop</span>
                </div>
              </div>

              <div className="shot-block">
                <div className="browser">
                  <div className="browser-bar">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-url">
                      <span className="lock">🔒</span>aeroadix.com/shop/category/subaru-sti
                    </div>
                  </div>
                  <img
                    src={`${SHOTS}/04-sti-category.png`}
                    alt="STI category page — full Aero-RS system available as a bundle or individual pieces"
                    className="browser-img"
                    loading="lazy"
                  />
                </div>
                <div className="browser-caption">
                  <span>03 · STI category</span>
                  <span className="right">/shop/category/:slug</span>
                </div>
              </div>

              <div className="shot-block">
                <div className="browser">
                  <div className="browser-bar">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-url">
                      <span className="lock">🔒</span>aeroadix.com/shop/focus-rs-canard-kit
                    </div>
                  </div>
                  <img
                    src={`${SHOTS}/05-product-focus.png`}
                    alt="Focus RS Canard Kit product detail — multi-image gallery, specs table, package breakdown"
                    className="browser-img cap-mid"
                    loading="lazy"
                  />
                </div>
                <div className="browser-caption">
                  <span>04 · Product detail · Focus RS</span>
                  <span className="right">/shop/:productId</span>
                </div>
              </div>

              <div className="shot-block">
                <div className="browser">
                  <div className="browser-bar">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-url">
                      <span className="lock">🔒</span>aeroadix.com/contact
                    </div>
                  </div>
                  <img
                    src={`${SHOTS}/02-contact.png`}
                    alt="Contact page — Netlify Forms wired with honeypot spam protection"
                    className="browser-img"
                    loading="lazy"
                  />
                </div>
                <div className="browser-caption">
                  <span>05 · Contact</span>
                  <span className="right">/contact</span>
                </div>
              </div>
            </div>

            <details className="delivers-toggle">
              <summary>Phase 01 deliverables · expand</summary>
              <ol className="deliverables">
                <li>
                  Brand identity — logo system (SVG master, PNG variants, favicon set),
                  social card, Open Graph creative
                </li>
                <li>
                  Custom Vite + React + Tailwind single-page application, nine public
                  routes
                </li>
                <li>
                  Homepage — hero, engineering stack, CFD process, platform selector,
                  About, flagship showcase, footer
                </li>
                <li>
                  Shop catalog, category pages, product detail with multi-image galleries
                </li>
                <li>Cart context, cart page, checkout, order confirmation</li>
                <li>Stripe integration via serverless Netlify Function</li>
                <li>Initial product data layer — seven SKUs across four vehicle platforms</li>
                <li>SEO launch kit, WCAG 2.1 AA accessibility audit and remediation</li>
                <li>Product photography processing (48+ assets) and CFD imagery curation</li>
                <li>
                  Netlify deployment configuration with security headers, caching, SPA
                  redirects
                </li>
                <li>
                  CodeQL security workflow, clean repository hygiene, full handoff package
                </li>
              </ol>
            </details>
          </div>
        </section>

        {/* Featured Build — STI Aero-RS */}
        <section className="featured-build">
          <div className="wrap-wide">
            <div className="featured-head">
              <span className="eyebrow">
                <span className="dot"></span>Featured Build
              </span>
              <h2>
                STI <span className="accent">Aero-RS</span> Full Package
              </h2>
              <p>
                The flagship product page. A bundle that surfaces the complete Aero-RS
                aerodynamic system for the Subaru WRX STI — package savings, breakdown of
                individual components, and cross-sells, all dynamic from the CMS.
              </p>
            </div>

            <div className="browser" style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div className="browser-bar">
                <div className="browser-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="browser-url">
                  <span className="lock">🔒</span>
                  aeroadix.com/shop/sti-aero-rs-full-package
                </div>
              </div>
              <img
                src={`${SHOTS}/08-package-sti.png`}
                alt="STI Aero-RS Full Package product page — complete aerodynamic system with bundle savings, package breakdown, and related products"
                className="browser-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Phase 2 */}
        <section className="phase">
          <div className="wrap-wide">
            <div className="section-head">
              <div className="lead">
                <div className="phase-meta">
                  <span className="phase-num">PHASE 02</span>
                  <span className="eyebrow">Delivered Apr 26, 2026</span>
                </div>
                <h2>The Owner Panel.</h2>
              </div>
              <div className="body">
                <p>
                  A self-serve content management system. The owner manages every product,
                  price, photograph, and homepage carousel image through a branded admin
                  panel — <strong>no developer involvement required.</strong>
                </p>
                <p>
                  Supabase Postgres with Row Level Security. Two public Storage buckets
                  gated to the owner email. Admin routes shielded by both a frontend route
                  guard and database-level enforcement. Stripe checkout uses live admin
                  prices automatically — no Stripe sync when prices change.
                </p>
              </div>
            </div>

            {/* Dashboard hero */}
            <div className="shot-block">
              <div className="browser">
                <div className="browser-bar">
                  <div className="browser-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="browser-url">
                    <span className="lock">🔒</span>aeroadix.com/admin
                  </div>
                </div>
                <img
                  src={`${SHOTS}/09-admin-dashboard.png`}
                  alt="Admin dashboard — three tiles showing live counts of products, carousel images, and storage"
                  className="browser-img"
                  loading="lazy"
                />
              </div>
              <div className="browser-caption">
                <span>06 · Admin dashboard</span>
                <span className="right">/admin</span>
              </div>
            </div>

            {/* Products + Carousel */}
            <div className="shots-grid cols-2">
              <div className="shot-block">
                <div className="browser">
                  <div className="browser-bar">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-url">
                      <span className="lock">🔒</span>aeroadix.com/admin/products
                    </div>
                  </div>
                  <img
                    src={`${SHOTS}/10-admin-products.png`}
                    alt="Admin products manager — full list with reorder controls, edit, delete, and featured toggles"
                    className="browser-img"
                    loading="lazy"
                  />
                </div>
                <div className="browser-caption">
                  <span>07 · Products manager</span>
                  <span className="right">/admin/products</span>
                </div>
              </div>

              <div className="shot-block">
                <div className="browser">
                  <div className="browser-bar">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-url">
                      <span className="lock">🔒</span>aeroadix.com/admin/carousel
                    </div>
                  </div>
                  <img
                    src={`${SHOTS}/11-admin-carousel.png`}
                    alt="Admin carousel manager — drag-and-drop upload, inline label editing, reorder, replace, delete"
                    className="browser-img"
                    loading="lazy"
                  />
                </div>
                <div className="browser-caption">
                  <span>08 · Carousel manager</span>
                  <span className="right">/admin/carousel</span>
                </div>
              </div>
            </div>

            <details className="delivers-toggle">
              <summary>Phase 02 deliverables · expand</summary>
              <ol className="deliverables">
                <li>
                  Supabase project provisioning — schema, idempotent migration script, Row
                  Level Security policies, Storage buckets and policies
                </li>
                <li>
                  One-time image migration uploading all existing site assets to Supabase
                  Storage and rewriting database references
                </li>
                <li>
                  React data layer — hooks replacing the static data file, with skeleton
                  loading on Shop, Category, Product Detail, and homepage carousel
                </li>
                <li>
                  Owner authentication — Supabase Auth integration, owner-only gating,
                  branded login page, protected route wrapper
                </li>
                <li>
                  Admin shell — bare-layout admin frame, dashboard tiles, mobile
                  responsiveness, noindex meta on every admin page
                </li>
                <li>
                  Admin products module — list with reorder, full edit form, multi-image
                  drag-and-drop, set-thumbnail, delete-with-Storage-cleanup
                </li>
                <li>
                  New-product flow with auto-generated URL slug, owner-friendly field
                  hiding (Stripe IDs, SKUs, internal fields)
                </li>
                <li>
                  Admin carousel module — list, drag-and-drop add, inline label editing,
                  replace, delete
                </li>
                <li>
                  Owner UX polish — plain-English placeholders, slug protection on
                  existing products, intuitive sort controls
                </li>
                <li>
                  Documentation — idempotent SQL setup, storage walkthrough, environment
                  template, owner operations guide
                </li>
              </ol>
            </details>
          </div>
        </section>

        {/* Stack */}
        <section className="stack">
          <div className="wrap">
            <div className="section-head">
              <div className="lead">
                <span className="eyebrow">
                  <span className="dot"></span>Stack
                </span>
                <h2>Built on.</h2>
              </div>
              <div className="body">
                <p>
                  Modern, minimal, production-grade. Every choice is intentional — chosen
                  for the owner to be able to live with the system long after handoff, and
                  for the codebase to be readable by any competent React engineer.
                </p>
              </div>
            </div>

            <table className="stack-table">
              <tbody>
                <tr>
                  <th>Framework</th>
                  <td>
                    <span className="pill">Vite 6</span>
                    <span className="pill">React 18</span>
                    <span className="pill">React Router 7</span>
                  </td>
                </tr>
                <tr>
                  <th>Styling</th>
                  <td>
                    <span className="pill">Tailwind CSS 3</span>
                    <span className="pill">Framer Motion 11</span>
                    <span className="pill">Inter (Google Fonts)</span>
                  </td>
                </tr>
                <tr>
                  <th>Database</th>
                  <td>
                    <span className="pill">Supabase Postgres</span>
                    <span className="pill">Row Level Security</span>
                  </td>
                </tr>
                <tr>
                  <th>File Storage</th>
                  <td>
                    <span className="pill">Supabase Storage</span>
                    <span className="pill">Two public buckets</span>
                  </td>
                </tr>
                <tr>
                  <th>Authentication</th>
                  <td>
                    <span className="pill">Supabase Auth</span>
                    <span className="pill">Single owner</span>
                  </td>
                </tr>
                <tr>
                  <th>Hosting</th>
                  <td>
                    <span className="pill">Netlify</span>
                    <span className="pill">Netlify Functions</span>
                    <span className="pill">Netlify Forms</span>
                  </td>
                </tr>
                <tr>
                  <th>Payments</th>
                  <td>
                    <span className="pill">Stripe Checkout</span>
                    <span className="pill">Serverless bridge</span>
                  </td>
                </tr>
                <tr>
                  <th>CI/CD &amp; Security</th>
                  <td>
                    <span className="pill">GitHub</span>
                    <span className="pill">CodeQL</span>
                    <span className="pill">Auto preview deploys</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Outcome */}
        <section className="phase">
          <div className="wrap">
            <div className="section-head">
              <div className="lead">
                <span className="eyebrow">
                  <span className="dot"></span>Outcome
                </span>
                <h2>What shipped.</h2>
              </div>
              <div className="body">
                <p>
                  A production site indexed by Google Search Console at{' '}
                  <strong>aeroadix.com</strong>, owner-operated end to end, with the owner
                  able to add products, change prices, swap homepage imagery, and manage
                  the catalog without touching code.
                </p>
              </div>
            </div>

            <div className="outcome-grid">
              <div className="outcome-cell">
                <div className="num">01</div>
                <h3>Owner Independence</h3>
                <p>
                  The site owner manages every product, price, photograph, and homepage
                  carousel image. Zero developer involvement required for ongoing
                  operations.
                </p>
              </div>
              <div className="outcome-cell">
                <div className="num">02</div>
                <h3>No Stripe Sync Drift</h3>
                <p>
                  Checkout uses live admin prices via ad-hoc{' '}
                  <code
                    style={{
                      fontFamily: 'var(--aa-font-mono)',
                      fontSize: '0.85em',
                      color: 'var(--aa-blue-bright)',
                    }}
                  >
                    price_data
                  </code>
                  . Change a price in the admin panel — it takes effect on the next
                  checkout.
                </p>
              </div>
              <div className="outcome-cell">
                <div className="num">03</div>
                <h3>Defense in Depth</h3>
                <p>
                  Frontend route guard plus database-level Row Level Security. Browser
                  secrets isolated. Storage policies enforce owner-only writes. Bypass
                  either layer and the other still holds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Live link */}
        <section className="live-strip">
          <div className="wrap row">
            <div>
              <div className="label">Live Site · Production</div>
              <a
                href="https://aeroadix.com"
                className="url"
                target="_blank"
                rel="noopener noreferrer"
              >
                aeroadix.com
              </a>
            </div>
            <div className="arrow" aria-hidden="true">
              →
            </div>
          </div>
        </section>

        {/* Credits */}
        <section className="phase">
          <div className="wrap">
            <span className="eyebrow">
              <span className="dot"></span>Credits
            </span>
            <h2
              style={{
                fontFamily: 'var(--aa-font-display)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                margin: '1rem 0 3rem',
              }}
            >
              Engagement record.
            </h2>

            <div className="credits-grid">
              <div className="credit-block">
                <div className="label">Build &amp; Brand</div>
                <div className="value">
                  VVV Digitals LLC
                  <small>Brit · Director of Digital Operations</small>
                </div>
              </div>
              <div className="credit-block">
                <div className="label">Client</div>
                <div className="value">
                  AeroAdix Fabrication Solutions
                  <small>A division of 3DBoomPrint · Richard Garcia</small>
                </div>
              </div>
              <div className="credit-block">
                <div className="label">Engagement Window</div>
                <div className="value">
                  Feb 14, 2026 → Apr 26, 2026
                  <small>10 active weeks · 2 phases · final delivery</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="cta">
          <div className="wrap">
            <div className="cta-head">
              <span className="eyebrow">
                <span className="dot"></span>What's Next
              </span>
              <h2>
                Got a build like this <span className="accent">in mind?</span>
              </h2>
            </div>

            <div className="cta-grid">
              <Link to="/contact" className="cta-card" aria-label="Start a project with VVV Digitals">
                <span className="label">Start a Project</span>
                <h3>Tell us about it.</h3>
                <p>
                  Production sites, headless commerce, owner-operated CMS systems. Built
                  end to end, documented, and handed over for good.
                </p>
                <span className="arrow">
                  <span>Get in touch</span>
                  <span>→</span>
                </span>
              </Link>

              <Link to="/work" className="cta-card" aria-label="See more VVV Digitals case studies">
                <span className="label">More Work</span>
                <h3>See other builds.</h3>
                <p>
                  Browse the rest of the VVV Digitals portfolio — case studies, deliverables,
                  and live engagements across digital operations and product.
                </p>
                <span className="arrow">
                  <span>View all work</span>
                  <span>→</span>
                </span>
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
