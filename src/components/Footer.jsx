// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer(){
  return (
    <footer style={{padding:'32px 16px', textAlign:'center', borderTop:'1px solid #eee', marginTop:40}}>
      <nav aria-label="footer">
        <Link to="/" style={{marginRight:10}}>Home</Link> ·
        <Link to="/privacy" style={{marginLeft:10, marginRight:10}}>Privacy</Link> ·
        <Link to="/terms" style={{marginLeft:10}}>Terms</Link>
      </nav>

      <div style={{marginTop:8, fontSize:13, color:'#666'}}>
        {/* direct links to legal HTML/PDF for downloads or legal references */}
        <a href="/docs/privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy (HTML)</a>
        {' • '}
        <a href="/docs/privacy-policy.pdf" target="_blank" rel="noopener noreferrer" download>Privacy (PDF)</a>
        {' • '}
        <a href="/docs/terms-of-service.html" target="_blank" rel="noopener noreferrer">Terms (HTML)</a>
        {' • '}
        <a href="/docs/terms-of-service.pdf" target="_blank" rel="noopener noreferrer" download>Terms (PDF)</a>
      </div>

      <p style={{marginTop:12,color:'#666'}}>© {new Date().getFullYear()} VVVDigitals LLC — <a href="mailto:admin@vvvdigitals.com">admin@vvvdigitals.com</a></p>
    </footer>
  );
}