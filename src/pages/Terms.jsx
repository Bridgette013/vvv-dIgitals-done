import React from 'react';

export default function Terms(){
  return (
    <main style={{maxWidth: 980, margin: '32px auto', padding: '0 16px'}}>
      <h1>Terms of Service</h1>
      <p style={{color:'#666'}}>View or download our Terms of Service below.</p>

      <div style={{marginTop:20}}>
        <iframe
          title="VVVDigitals Terms of Service (PDF)"
          src="/docs/terms-of-service.pdf"
          style={{width:'100%', height:'800px', border:'1px solid #e6e6e6'}}
        />
      </div>

      <div style={{marginTop:12}}>
        <a href="/docs/terms-of-service.html" target="_blank" rel="noopener noreferrer">Read HTML version</a>
        {' • '}
        <a href="/docs/terms-of-service.pdf" target="_blank" rel="noopener noreferrer" download>Download PDF</a>
      </div>

      <p style={{marginTop:18, color:'#444', fontSize:14}}>
        Questions? Contact <a href="mailto:admin@vvvdigitals.com">admin@vvvdigitals.com</a>.
      </p>
    </main>
  );
}
