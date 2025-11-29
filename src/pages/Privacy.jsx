import React from 'react';

export default function Privacy(){
  return (
    <main style={{maxWidth: 980, margin: '32px auto', padding: '0 16px'}}>
      <h1>Privacy Policy</h1>
      <p style={{color:'#666'}}>View or download our Privacy Policy below. If the PDF doesn't render in your browser, click the download link.</p>

      <div style={{marginTop:20}}>
        <iframe
          title="VVVDigitals Privacy Policy (PDF)"
          src="/docs/privacy-policy.pdf"
          style={{width:'100%', height:'800px', border:'1px solid #e6e6e6'}}
        />
      </div>

      <div style={{marginTop:12}}>
        <a href="/docs/privacy-policy.html" target="_blank" rel="noopener noreferrer">Read HTML version</a>
        {' • '}
        <a href="/docs/privacy-policy.pdf" target="_blank" rel="noopener noreferrer" download>Download PDF</a>
      </div>

      <p style={{marginTop:18, color:'#444', fontSize:14}}>
        Need an accessible copy or printable format? Use the HTML link above or email <a href="mailto:admin@vvvdigitals.com">admin@vvvdigitals.com</a>.
      </p>
    </main>
  );
}
