import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

// --- Global Brand Variables ---
const VVV_COLORS = {
    purple: '#6246EA',
    coral: '#E9622D',
    charcoal: '#0C0C0E',
    surface: '#141418',
    text: '#E9E9E9',
    muted: '#B9B9C0',
    divider: '#24242A',
};

// --- API Setup (OpenAI) ---
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn("OpenAI API key missing — AI features disabled.");
}

const API_URL = "https://api.openai.com/v1/chat/completions";

// --- HELPER: Fetch Logic ---
async function exponentialBackoffFetch(url, options, maxRetries = 5) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;
            if (response.status === 429 && attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw new Error(`API request failed: ${response.status}`);
        } catch (error) {
            if (attempt === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }
}

// --- MAIN APP COMPONENT ---
const Home = () => {
    const [legalInput, setLegalInput] = useState('');
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const MAX_CHARS = 150;
    const charCount = legalInput.length;
    
    const exampleText = "The Indemnifying Party shall indemnify, defend, and hold harmless the Indemnified Party from and against any and all claims...";

    useEffect(() => {
        // Load Tally popup script
        const script = document.createElement('script');
        script.src = 'https://tally.so/widgets/embed.js';
        script.async = true;
        document.head.appendChild(script);
        
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handleInputChange = (e) => {
        const text = e.target.value;
        if (text.length <= MAX_CHARS) {
            setLegalInput(text);
            setTranslation('');
        }
    };

    const handleExampleClick = () => {
        setLegalInput(exampleText);
        setTranslation('');
    };

    const translateJargon = async (e) => {
        e.preventDefault();
        if (!legalInput.trim()) return;
        
        setIsLoading(true);
        const systemPrompt = `You are a plain-English translator for legal and financial contracts. Translate complex legal jargon into simple, clear language that anyone can understand. Be direct and concise.`;
        
        try {
            if (!apiKey) {
                await new Promise(r => setTimeout(r, 1500));
                setTranslation("Demo mode: This tool translates legal jargon into plain English. Add your OpenAI API key to enable real translations.");
            } else {
                const response = await exponentialBackoffFetch(API_URL, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: `Translate this legal text to plain English: "${legalInput}"` }
                        ],
                        max_tokens: 200,
                        temperature: 0.3
                    })
                });
                const data = await response.json();
                setTranslation(data.choices?.[0]?.message?.content || "Error translating text.");
            }
        } catch (err) {
            setTranslation("Translation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const globalStyles = `
        .text-gradient { background: linear-gradient(90deg, #E9622D 0%, #6246EA 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn-primary { background: linear-gradient(90deg, #E9622D 0%, #6246EA 100%); color: white; font-weight: bold; transition: transform 0.2s; border: none; cursor: pointer; }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-secondary { border: 2px solid #6246EA; color: #6246EA; background: transparent; font-weight: bold; transition: all 0.2s; }
        .btn-secondary:hover { background: #6246EA; color: white; }
        input, textarea, select { background: #141418; border: 1px solid #24242A; color: white; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #6246EA; }
    `;

    return (
        <div className="min-h-screen bg-[#0C0C0E] text-[#E9E9E9] font-sans selection:bg-[#6246EA] selection:text-white">
            <style>{globalStyles}</style>

            {/* HEADER */}
            <header className="max-w-4xl mx-auto px-6 py-4 flex justify-center items-center sticky top-0 z-50 bg-[#0C0C0E]/90 backdrop-blur-md border-b border-[#24242A]">
                <div className="text-center">
                    <span className="text-xs uppercase tracking-widest block mb-1 text-[#6246EA] font-bold">VVVDigitals Consulting</span>
                    <span className="text-sm text-[#B9B9C0] italic">Translating Attorney Jargon Since 2010</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6">
                {/* HERO */}
                <section className="py-24 md:py-32 text-center">
                    <div className="inline-block px-4 py-1 mb-6 border border-[#6246EA] rounded-full text-xs font-bold text-[#6246EA] tracking-widest">
                        VVVDigitals Consulting
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                        <span className="text-gradient block">Exposing The Cons</span>
                        <span className="block text-white">In Contracts</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-[#E9E9E9] max-w-2xl mx-auto mb-4 leading-relaxed">
                        I spent <span className="text-[#6246EA] font-bold">15 years in banking and insurance</span> finding where money disappears in fine print.
                    </p>
                    
                    <p className="text-lg md:text-xl text-[#E9E9E9] max-w-2xl mx-auto mb-10 leading-relaxed">
                        Now I do it for your contracts—<span className="text-[#E9622D] font-bold">before you sign</span>.
                    </p>
                    
                    <button 
                        data-tally-open="VLGZAy" 
                        data-tally-layout="modal" 
                        data-tally-width="1000" 
                        className="btn-primary px-8 py-4 rounded-lg inline-block tracking-widest text-sm"
                    >
                        SEE HOW IT WORKS →
                    </button>
                </section>

                {/* FREE TOOL - TRANSLATOR */}
                <section id="translator" className="mb-32 scroll-mt-24">
                    <div className="bg-[#141418] border border-[#24242A] rounded-2xl p-8 md:p-12">
                        <div className="text-center mb-8">
                            <span className="inline-block px-3 py-1 bg-[#6246EA]/20 border border-[#6246EA] rounded-full text-xs font-bold text-[#6246EA] tracking-widest mb-4">
                                ✨ FREE TOOL
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Test The <span className="text-gradient">Translator</span>
                            </h2>
                            <p className="text-[#B9B9C0] max-w-xl mx-auto">
                                Paste confusing contract language. I'll translate it into plain English.
                            </p>
                        </div>

                        <form onSubmit={translateJargon} className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold text-[#B9B9C0]">Legal Jargon</label>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs ${charCount > 140 ? 'text-[#E9622D]' : 'text-[#B9B9C0]'}`}>
                                            {charCount}/{MAX_CHARS}
                                        </span>
                                        <button 
                                            type="button"
                                            onClick={handleExampleClick}
                                            className="text-xs text-[#6246EA] hover:text-[#E9622D] font-bold transition-colors"
                                        >
                                            Try Example
                                        </button>
                                    </div>
                                </div>
                                <textarea 
                                    value={legalInput}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 'The Party of the First Part shall indemnify...'"
                                    rows="4"
                                    className="w-full p-4 rounded-lg bg-[#0C0C0E] border border-[#24242A] text-white resize-none"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading || !legalInput.trim()}
                                className="btn-primary w-full py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'TRANSLATING...' : 'TRANSLATE TO ENGLISH'}
                            </button>
                        </form>

                        {translation && (
                            <div className="mt-6 p-6 bg-[#0C0C0E] border-l-2 border-[#E9622D] rounded-lg">
                                <p className="text-xs font-mono text-[#E9622D] mb-2 uppercase tracking-widest">Plain English:</p>
                                <p className="text-white leading-relaxed">{translation}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* THE GAP YOUR ATTORNEY LEAVES */}
                <section id="the-gap" className="mb-32 scroll-mt-24">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                        The Gap <span className="text-gradient">Your Attorney Leaves</span>
                    </h2>
                    
                    <div className="bg-[#141418] border border-[#24242A] rounded-xl p-8 md:p-12 space-y-6">
                        <p className="text-lg text-[#E9E9E9] leading-relaxed">
                            Here's the truth about working with attorneys:
                        </p>
                        
                        <p className="text-lg text-[#E9E9E9] leading-relaxed">
                            They review your contract. They might catch the big stuff. But then they hand it back and say <span className="text-[#B9B9C0] italic">"looks fine"</span> or <span className="text-[#B9B9C0] italic">"you should negotiate clause 7."</span>
                        </p>

                        <div className="border-l-2 border-[#E9622D] pl-6 my-8">
                            <h3 className="text-xl font-bold text-white mb-4">What they DON'T do:</h3>
                            <ul className="space-y-3 text-[#E9E9E9]">
                                <li>• Sit with you for 2 hours explaining every single clause</li>
                                <li>• Translate the jargon into language you actually understand</li>
                                <li>• Walk through what each section means for YOUR specific situation</li>
                                <li>• Answer your "dumb" questions without billing you $400/hour</li>
                            </ul>
                        </div>

                        <p className="text-xl text-[#E9622D] font-bold">
                            They expect you to have "done your research."
                        </p>
                        
                        <p className="text-lg text-[#E9E9E9] leading-relaxed">
                            But nobody teaches you how to read a 47-page contract.
                        </p>
                        
                        <p className="text-xl text-white font-bold mt-8">
                            That's where I come in.
                        </p>
                    </div>
                </section>

                {/* SERVICES / PRICING */}
                <section id="services" className="mb-32 scroll-mt-24">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                        <span className="text-gradient">How I Help</span>
                    </h2>
                    <p className="text-center text-[#B9B9C0] mb-12 max-w-2xl mx-auto">
                        Your attorney reviews contracts. I explain them.
                    </p>

                    <div className="space-y-6">
                        {/* Tier 1: Audit Call */}
                        <div className="bg-[#141418] border border-[#24242A] rounded-xl p-8 hover:border-[#6246EA] transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Contract Audit Call</h3>
                                    <p className="text-[#B9B9C0] text-sm">30-minute video consultation</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-[#6246EA]">$200</div>
                                    <div className="text-xs text-[#B9B9C0] mt-1">Credits toward full review</div>
                                </div>
                            </div>
                            <ul className="space-y-2 text-[#E9E9E9] mb-6">
                                <li>• Quick contract scan on video call</li>
                                <li>• Identify top 3-5 problem areas</li>
                                <li>• "Should you sign this?" verdict</li>
                                <li>• <span className="text-[#E9622D] font-bold">Full $200 credits toward Translation or Full Review</span></li>
                            </ul>
                            <button 
                                data-tally-open="VLGZAy" 
                                data-tally-layout="modal" 
                                data-tally-width="1000"
                                className="btn-secondary w-full py-3 rounded-lg"
                            >
                                BOOK AUDIT CALL
                            </button>
                        </div>

                        {/* Tier 2: Translation */}
                        <div className="bg-[#141418] border border-[#24242A] rounded-xl p-8 hover:border-[#6246EA] transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Plain English Translation</h3>
                                    <p className="text-[#B9B9C0] text-sm">Understanding what you're signing</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-[#6246EA]">$2,100</div>
                                </div>
                            </div>
                            <ul className="space-y-2 text-[#E9E9E9] mb-6">
                                <li>• Full contract rewritten in normal language</li>
                                <li>• Section-by-section breakdown</li>
                                <li>• "What this actually means" explanations</li>
                                <li>• Delivered as annotated PDF</li>
                            </ul>
                            <button 
                                data-tally-open="VLGZAy" 
                                data-tally-layout="modal" 
                                data-tally-width="1000"
                                className="btn-secondary w-full py-3 rounded-lg"
                            >
                                REQUEST TRANSLATION
                            </button>
                        </div>

                        {/* Tier 3: Full Review */}
                        <div className="bg-gradient-to-br from-[#E9622D]/10 to-[#6246EA]/10 border-2 border-[#E9622D] rounded-xl p-8 relative">
                            <div className="absolute top-0 right-0 bg-[#E9622D] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                                MOST POPULAR
                            </div>
                            <div className="flex justify-between items-start mb-4 mt-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Full Contract Review</h3>
                                    <p className="text-[#E9E9E9] text-sm">Translation + What To Watch Out For</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-[#E9622D]">$5,200</div>
                                </div>
                            </div>
                            <ul className="space-y-2 text-[#E9E9E9] mb-6">
                                <li>• <span className="font-bold">Everything in Translation</span>, plus:</li>
                                <li>• Red flags highlighted with context from my 15 years in finance</li>
                                <li>• What to push back on and why</li>
                                <li>• Alternative clause language options</li>
                                <li>• "What I'd negotiate if this were mine"</li>
                                <li>• 30-minute walkthrough call</li>
                            </ul>
                            <button 
                                data-tally-open="VLGZAy" 
                                data-tally-layout="modal" 
                                data-tally-width="1000"
                                className="btn-primary w-full py-3 rounded-lg"
                            >
                                REQUEST FULL REVIEW
                            </button>
                        </div>
                    </div>
                </section>

                {/* CONTRACT TYPES */}
                <section id="contract-types" className="mb-32 scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Contracts I <span className="text-gradient">Review</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        {[
                            'Business Sale/Acquisition',
                            'Employment Agreements',
                            'Real Estate Contracts',
                            'NDAs & Non-Competes',
                            'Partnership Agreements',
                            'Vendor/Supplier Contracts'
                        ].map((type, i) => (
                            <div key={i} className="p-6 bg-[#141418] border border-[#24242A] rounded-lg hover:border-[#6246EA] transition-colors">
                                <p className="font-bold text-white">{type}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CASE STUDY */}
                <section id="case-study" className="mb-32 scroll-mt-24">
                    <div className="bg-[#141418] border border-[#24242A] rounded-xl p-8 md:p-12">
                        <span className="inline-block px-3 py-1 bg-[#E9622D]/20 border border-[#E9622D] rounded-full text-xs font-bold text-[#E9622D] tracking-widest mb-6">
                            CASE STUDY
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                            The $650,000 Manufacturing Sale
                        </h3>
                        <div className="space-y-4 text-[#E9E9E9]">
                            <p className="leading-relaxed">
                                Client was selling their manufacturing business for $650K. Their attorney reviewed the purchase agreement and said it "looked standard."
                            </p>
                            <p className="leading-relaxed">
                                I found a liability clause that would have made them personally responsible for equipment defects discovered within 5 years—even after the sale.
                            </p>
                            <p className="leading-relaxed text-[#E9622D] font-bold">
                                Potential exposure: Unlimited. Equipment value: $2.3M.
                            </p>
                            <p className="leading-relaxed">
                                We flagged it. They renegotiated. Cap set at $50K with a 12-month window.
                            </p>
                            <p className="leading-relaxed font-bold text-white">
                                That's what I do.
                            </p>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section id="how-it-works" className="mb-32 scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        How It <span className="text-gradient">Works</span>
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { num: '01', title: 'Submit', desc: 'Fill out the form with your contract details' },
                            { num: '02', title: 'Review', desc: 'I analyze every clause in detail' },
                            { num: '03', title: 'Translate', desc: 'Get your annotated plain-English version' },
                            { num: '04', title: 'Consult', desc: '30-min call to walk through findings' }
                        ].map((step, i) => (
                            <div key={i} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#E9622D] to-[#6246EA] text-white font-bold text-xl mb-4">
                                    {step.num}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-[#B9B9C0]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="mb-32 scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Common <span className="text-gradient">Questions</span>
                    </h2>
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="bg-[#141418] border border-[#24242A] rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-3">Do I need an attorney?</h3>
                            <p className="text-[#E9E9E9] leading-relaxed">
                                Yes. I work with clients who have legal representation. I'm not replacing your attorney—I'm the person who sits with you for hours explaining what everything means, which your attorney doesn't have time to do.
                            </p>
                        </div>

                        <div className="bg-[#141418] border border-[#24242A] rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-3">How long does it take?</h3>
                            <p className="text-[#E9E9E9] leading-relaxed">
                                Audit calls are scheduled within 48 hours. Full reviews typically take 5-7 business days depending on contract complexity.
                            </p>
                        </div>

                        <div className="bg-[#141418] border border-[#24242A] rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-3">What if I've already signed?</h3>
                            <p className="text-[#E9E9E9] leading-relaxed">
                                I can still review it to identify risks you should be aware of and help you understand your obligations going forward.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="pb-32 text-center">
                    <div className="bg-gradient-to-br from-[#E9622D]/10 to-[#6246EA]/10 border border-[#6246EA] rounded-2xl p-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                            Ready to understand what you're signing?
                        </h2>
                        <p className="text-lg text-[#E9E9E9] mb-8 max-w-xl mx-auto">
                            Don't sign blindly. Get your contract reviewed by someone who's spent 15 years finding the traps.
                        </p>
                        <button 
                            data-tally-open="VLGZAy" 
                            data-tally-layout="modal" 
                            data-tally-width="1000"
                            className="btn-primary px-12 py-4 rounded-lg text-lg"
                        >
                            REQUEST REVIEW
                        </button>
                    </div>
                </section>

                {/* LEGAL DISCLAIMER */}
                <section className="pb-16 text-center">
                    <p className="text-xs text-[#B9B9C0] max-w-2xl mx-auto leading-relaxed">
                        <span className="font-bold text-white">Legal Disclaimer:</span> Services are based on 15 years of financial industry experience identifying contractual risks. This is not legal advice. I work alongside your attorney, not as a replacement. Always consult a licensed attorney before making legal decisions.
                    </p>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="border-t border-[#24242A] bg-[#0C0C0E]">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="flex flex-col items-center gap-8 mb-8">
                        {/* Logo */}
                        <div className="flex items-center justify-center">
                            {logo ? (
                                <img src={logo} alt="VVVDigitals" className="h-32 w-auto opacity-90" />
                            ) : (
                                <span className="text-3xl font-extrabold tracking-tighter uppercase text-gradient">VVVDIGITALS</span>
                            )}
                        </div>
                        
                        {/* Company Info */}
                        <div className="text-center">
                            <p className="text-[#E9E9E9] font-bold mb-2">VVVDigitals Consulting</p>
                            <p className="text-[#B9B9C0] text-sm mb-4">Contract Review & Translation Services</p>
                            <a 
                                href="mailto:britnic@vvvdigitals.com" 
                                className="text-[#6246EA] hover:text-[#E9622D] transition-colors font-bold"
                            >
                                britnic@vvvdigitals.com
                            </a>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#24242A]">
                        <div className="flex gap-6 text-sm">
                            <a 
                                href="/docs/privacy-policy.html" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#B9B9C0] hover:text-[#E9622D] transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a 
                                href="/docs/terms-of-service.html" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#B9B9C0] hover:text-[#E9622D] transition-colors"
                            >
                                Terms of Service
                            </a>
                        </div>
                        
                        <p className="text-[#B9B9C0] text-sm">
                            © {new Date().getFullYear()} VVVDigitals LLC. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
