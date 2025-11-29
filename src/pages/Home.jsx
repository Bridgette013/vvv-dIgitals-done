import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <main style={{maxWidth:980, margin:'40px auto', padding:'0 16px', fontFamily:'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'}}>
      <header style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, marginBottom:28}}>
        <div>
          <h1 style={{margin:0, fontSize:36}}>VVVDigitals</h1>
          <p style={{margin:'6px 0 0', color:'#555'}}>AI-powered content and branding — full packs delivered in 72 hours.</p>
        </div>
        <nav aria-label="top">
          <Link to="/privacy" style={{marginRight:12, color:'#0366d6'}}>Privacy</Link>
          <Link to="/terms" style={{color:'#0366d6'}}>Terms</Link>
        </nav>
      </header>

      <section aria-labelledby="hero" style={{padding:'28px 18px', borderRadius:8, background:'#f8fafc', border:'1px solid #e9eef5', marginBottom:28}}>
        <h2 id="hero" style={{marginTop:0}}>Done-for-you Content Packs — 72 Hours</h2>
        <p style={{color:'#444'}}>Strategy, scripts, visuals, and a mini-brand kit — delivered fast so you can focus on clients and growth.</p>
        <div style={{marginTop:18, display:'flex', gap:12, flexWrap:'wrap'}}>
          <Link to="/book" style={{background:'#111', color:'#fff', padding:'10px 16px', borderRadius:6, textDecoration:'none'}}>Book a 15-min Clarity Call</Link>
          <Link to="/privacy" style={{padding:'10px 16px', borderRadius:6, textDecoration:'none', background:'#fff', border:'1px solid #ddd', color:'#111'}}>Privacy & Terms</Link>
        </div>
      </section>

      <section aria-labelledby="what" style={{marginBottom:28}}>
        <h3 id="what">What we do</h3>
        <p style={{color:'#444'}}>VVVDigitals creates repeatable, branded content systems for creators, coaches, and podcasters. We combine AI prompt stacks, human editing, and design templates into one pack you can publish right away.</p>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16, marginTop:16}}>
          <article style={{padding:16, border:'1px solid #eee', borderRadius:8}}>
            <h4 style={{marginTop:0}}>Signature Pack</h4>
            <ul style={{marginTop:8}}>
              <li>12 branded posts + captions</li>
              <li>3 short video scripts (reels / shorts)</li>
              <li>Mini branding kit (colors, logos)</li>
              <li>72-hour delivery</li>
            </ul>
          </article>

          <article style={{padding:16, border:'1px solid #eee', borderRadius:8}}>
            <h4 style={{marginTop:0}}>Growth Retainer</h4>
            <p style={{margin:0}}>Weekly packs, strategy calls, performance tweaks. Built for creators who want consistent growth without the grind.</p>
          </article>

          <article style={{padding:16, border:'1px solid #eee', borderRadius:8}}>
            <h4 style={{marginTop:0}}>Custom Sprints</h4>
            <p style={{margin:0}}>1-week transformation sprints for agencies and teams — audit to automation.</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="contact" style={{marginBottom:40}}>
        <h3 id="contact">Contact</h3>
        <p style={{color:'#444'}}>Questions or accessibility needs? Email <a href="mailto:admin@vvvdigitals.com">admin@vvvdigitals.com</a>.</p>
      </section>

      <footer style={{borderTop:'1px solid #eee', paddingTop:18, color:'#666', textAlign:'center'}}>
        <p style={{margin:0}}>© {new Date().getFullYear()} VVVDigitals LLC — <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link></p>
      </footer>
    </main>
  );
}
