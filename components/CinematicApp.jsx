'use client';
import React, { useState } from 'react';

export default function CinematicApp() {
  const [prompt, setPrompt] = useState('');
  const [out, setOut] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setOut('');
    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const j = await r.json();
      setOut(j.text || j.error || '(no response)');
    } catch (e) {
      setOut('Error: ' + (e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ background:'#0b0b10', color:'#eaeaf2', minHeight:'100vh', fontFamily:'sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1rem' }}>
        <h1 style={{ fontSize:'2.25rem', textAlign:'center', marginBottom:'1rem' }}>
          VVVDigitals Cinematic Engine
        </h1>

        <input
          value={prompt}
          onChange={e=>setPrompt(e.target.value)}
          placeholder="Enter a business concept…"
          style={{
            width:'100%', maxWidth:700, display:'block', margin:'0 auto 1rem',
            padding:'0.8rem', borderRadius:10, border:'1px solid #333',
            background:'#141418', color:'#fff'
          }}
        />

        <div style={{ display:'flex', justifyContent:'center' }}>
          <button
            onClick={generate}
            disabled={loading}
            style={{
              padding:'0.9rem 1.5rem', background:'#6246EA', color:'#fff',
              border:'none', borderRadius:10, cursor:'pointer', fontWeight:700
            }}
          >
            {loading ? 'Generating…' : '✨ Generate Narrative'}
          </button>
        </div>

        <div style={{
          marginTop:'2rem', whiteSpace:'pre-wrap', lineHeight:1.6,
          maxWidth:700, marginInline:'auto', textAlign:'left'
        }}>
          {out && <p>{out}</p>}
        </div>
      </div>
    </main>
  );
}
