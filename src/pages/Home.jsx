import React, { useState } from 'react';
import logo from '../assets/logo.png'; // (Or './assets/logo.png' depending on file location)

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

// --- API Setup ---
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  console.warn("Google API key missing — AI features disabled.");
}

const API_URL = apiKey
  ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`
  : null;

// --- DATA: Services (The Offer) ---
const systemModules = [
    {
        id: 'M1',
        title: 'Brand Encoding',
        description: 'We codify your voice. No more guessing what your brand sounds like.',
        icon: '🧬',
    },
    {
        id: 'M2',
        title: 'Content Sprint',
        description: '12 branded posts, captions, and visual assets generated in 48 hours.',
        icon: '⚡',
    },
    {
        id: 'M3',
        title: 'Infrastructure',
        description: 'The Highway. We build the Zapier/Notion workflows for you.',
        icon: '🏗️',
    }
];

// --- DATA: Portfolio (The Proof) ---
const initialDeployments = [
    {
        id: 'A1',
        title: 'Content Automation Pipeline',
        description: 'Infrastructure for content scaling abstracted into modular data flow. Velocity: high.',
        systemType: 'AUTOMATION',
        accentColor: VVV_COLORS.purple,
    },
    {
        id: 'B2',
        title: 'Brand Linguistic Encoding',
        description: 'A study in visual architecture, composed with pure language parameters. Artistry applied.',
        systemType: 'DIGITAL ASSET',
        accentColor: VVV_COLORS.coral,
    },
    {
        id: 'C3',
        title: 'Strategic Logic Gamma',
        description: 'Merging market complexity with perfect solution calculation. Precision-driven outcome.',
        systemType: 'CONSULTING',
        accentColor: VVV_COLORS.purple,
    },
    {
        id: 'D4',
        title: 'Data Synthesis Layer',
        description: 'Abstract concepts visualized for high-impact content flow, ready for executive review.',
        systemType: 'DATA FLOW',
        accentColor: VVV_COLORS.muted,
    },
    {
        id: 'E5',
        title: 'Infrastructure Architecture',
        description: 'The fusion of automation and emotion. Poetic coding realized in deployment.',
        systemType: 'INFRASTRUCTURE',
        accentColor: VVV_COLORS.muted,
    },
    {
        id: 'F6',
        title: 'Optimization Logic Suite',
        description: 'Accelerated project velocity running at the speed of maximum efficiency.',
        systemType: 'OPTIMIZATION',
        accentColor: VVV_COLORS.muted,
    },
];

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

// --- COMPONENT: Portfolio Card ---
const DeploymentCard = ({ deployment }) => {
    const placeholderUrl = `https://placehold.co/800x600/${VVV_COLORS.surface.substring(1)}/${deployment.accentColor.substring(1)}?text=${deployment.systemType.replace(/ /g, '+')}`;

    return (
        <div className="group bg-[#141418] rounded-xl overflow-hidden border border-[#24242A] hover:border-[#E9622D] transition-all duration-300">
            <div className="relative overflow-hidden aspect-video">
                <img 
                    src={placeholderUrl} 
                    alt={deployment.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x600/141418/B9B9C0?text=LOAD+ERROR'; }}
                />
                <div className="absolute inset-0 bg-[#6246EA]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-xs font-bold text-white p-2 rounded-full bg-[#E9622D]">VIEW LOGIC</span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{deployment.title}</h3>
                <p className="text-xs text-[#B9B9C0] leading-relaxed">{deployment.description}</p>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const Home = () => {
    const [conceptInput, setConceptInput] = useState('');
    const [narrativeOutput, setNarrativeOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateNarrative = async (e) => {
        e.preventDefault();
        if (!conceptInput.trim()) return;
        
        setIsLoading(true);
        const systemPrompt = `Act as a creative engineer for VVVDigitals. Write a 2-sentence cinematic, high-tech project narrative for the user's concept. Use words like 'velocity', 'architecture', 'scale'.`;
        
        try {
            if (!apiKey) {
                await new Promise(r => setTimeout(r, 1500));
                setNarrativeOutput("System Integrity Check: API Key Missing. (This is a simulation of the Poetic Coding Engine).");
            } else {
                const response = await exponentialBackoffFetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: conceptInput }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] }
                    })
                });
                const data = await response.json();
                setNarrativeOutput(data.candidates?.[0]?.content?.parts?.[0]?.text || "Error parsing logic.");
            }
        } catch (err) {
            setNarrativeOutput("Connection severed. Retrying sequence...");
        } finally {
            setIsLoading(false);
        }
    };

    const globalStyles = `
        .text-gradient { background: linear-gradient(90deg, #E9622D 0%, #6246EA 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn-primary { background: linear-gradient(90deg, #E9622D 0%, #6246EA 100%); color: white; font-weight: bold; transition: transform 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); }
        input, textarea, select { background: #141418; border: 1px solid #24242A; color: white; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #6246EA; }
    `;

    return (
        <div className="min-h-screen bg-[#0C0C0E] text-[#E9E9E9] font-sans selection:bg-[#6246EA] selection:text-white">
            <style>{globalStyles}</style>

         {/* --- HERO --- */}
    <header className="max-w-10xl mx-auto px-6 py-9 flex justify-between items-center sticky top-0 z-50 bg-[#0C0C0E]/90 backdrop-blur-md border-b border-[#24242A]">
        
        {/* REPLACED TEXT WITH LOGO IMAGE BELOW */}
        <a href="#" className="block">
            <img 
                src={logo} 
                alt="VVV Digitals" 
                className="w-64 md:w-64 h-64 object-contain" 
            />
        </a>

        <nav className="hidden md:flex gap-6 text-xs font-bold tracking-widest">
            <a href="#engine" className="hover:text-[#E9622D] transition-colors">ENGINE</a>
            <a href="#services" className="hover:text-[#E9622D] transition-colors">SYSTEMS</a>
            <a href="#tools" className="hover:text-[#E9622D] transition-colors">TOOLS</a>
            <a href="#sprint" className="hover:text-[#E9622D] transition-colors text-[#E9622D]">INITIATE SPRINT</a>
        </nav>
    </header>

            <main className="max-w-8xl mx-auto px-8">
                <section className="py-24 md:py-32 text-center">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
                        <span className="text-gradient block">Commanding Motion</span>
                        <span className="block text-white">with Pure Language.</span>
                    </h1>
                    <p className="text-xl text-[#B9B9C0] max-w-2xl mx-auto mb-10">
                        We don't just design. We engineer high-velocity content systems.
                        <br />
                        From raw idea to deployment in 72 hours.
                    </p>
                    <a href="#engine" className="btn-primary px-8 py-4 rounded-lg inline-block tracking-widest text-sm">
                        TEST THE LOGIC
                    </a>
                </section>

                {/* --- 1. ENGINE (INITIATION) --- */}
                <section id="engine" className="mb-32 scroll-mt-24">
                    <div className="bg-[#141418] p-1 rounded-2xl border border-[#24242A] shadow-2xl overflow-hidden">
                        <div className="bg-[#0C0C0E] p-8 rounded-xl">
                            <label className="block text-xs font-mono text-[#6246EA] mb-4 uppercase tracking-widest">
                                // System Terminal: Initiate Concept
                            </label>
                            <form onSubmit={generateNarrative} className="flex flex-col gap-4">
                                <input 
                                    type="text" 
                                    value={conceptInput}
                                    onChange={(e) => setConceptInput(e.target.value)}
                                    placeholder="Enter a business challenge (e.g., 'Need viral content for a tech startup')" 
                                    className="w-full p-4 rounded-lg text-lg placeholder-[#555]"
                                />
                                <button type="submit" disabled={isLoading} className="btn-primary py-4 rounded-lg w-full md:w-auto md:self-start px-12">
                                    {isLoading ? 'PROCESSING...' : 'RUN LOGIC'}
                                </button>
                            </form>
                            {narrativeOutput && (
                                <div className="mt-8 p-6 border-l-2 border-[#E9622D] bg-[#141418]">
                                    <p className="font-mono text-sm text-[#E9622D] mb-2">OUTPUT &gt;&gt;</p>
                                    <p className="text-lg italic opacity-90">{narrativeOutput}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* --- 2. SERVICES (ARCHITECTURE) --- */}
                <section id="services" className="mb-32 scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                        <span className="text-[#6246EA]">01.</span> SYSTEM ARCHITECTURE
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {systemModules.map(mod => (
                            <div key={mod.id} className="p-8 bg-[#141418] border border-[#24242A] rounded-xl hover:border-[#6246EA] transition-colors group">
                                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{mod.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{mod.title}</h3>
                                <p className="text-[#B9B9C0] text-sm leading-relaxed">{mod.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 3. PORTFOLIO (DEPLOYMENT LOG) --- */}
                <section id="portfolio" className="mb-32 scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                        <span className="text-[#E9622D]">02.</span> DEPLOYMENT LOG
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {initialDeployments.map(deployment => (
                            <DeploymentCard key={deployment.id} deployment={deployment} />
                        ))}
                    </div>
                </section>

                {/* --- 4. PRICING (SPRINT PROTOCOLS) --- */}
                <section id="sprint" className="mb-32 scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                        <span className="text-[#6246EA]">03.</span> SPRINT PROTOCOLS
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Starter: Workflow Install */}
                        <div className="p-8 border border-[#24242A] rounded-xl flex flex-col bg-[#0C0C0E]">
                            <h3 className="text-2xl font-bold mb-2">WORKFLOW INSTALL</h3>
                            <div className="text-3xl font-mono text-[#6246EA] mb-6">$500</div>
                            <p className="text-sm text-white mb-6 font-bold">Perfect for fixing one broken system.</p>
                            <ul className="space-y-3 mb-8 text-sm text-[#B9B9C0] flex-1">
                                <li>• 1 Core Workflow Rebuild (e.g. Lead Intake)</li>
                                <li>• Custom Automation Map</li>
                                <li>• SOP Documentation</li>
                                <li>• 48-Hour Turnaround</li>
                            </ul>
                            <a href="#contact" className="block text-center py-3 border border-[#6246EA] text-[#6246EA] font-bold rounded-lg hover:bg-[#6246EA] hover:text-white transition-all">
                                INITIATE INSTALL
                            </a>
                        </div>

                        {/* Pro: The Engine Build */}
                        <div className="p-8 border border-[#E9622D] rounded-xl bg-[#141418] relative overflow-hidden flex flex-col transform md:-translate-y-4 shadow-2xl shadow-[#E9622D]/10">
                            <div className="absolute top-0 right-0 bg-[#E9622D] text-black text-xs font-bold px-3 py-1">MOST POPULAR</div>
                            <h3 className="text-2xl font-bold mb-2">THE VVVD ENGINE</h3>
                            <div className="text-3xl font-mono text-[#E9622D] mb-6">$1,200</div>
                            <p className="text-sm text-white mb-6 font-bold">The complete "Business-in-a-Box" System.</p>
                            <ul className="space-y-3 mb-8 text-sm text-[#E9E9E9] flex-1">
                                <li>• Full "Internal OS" Build</li>
                                <li>• Content Engine + Admin Automation</li>
                                <li>• Operations Dashboard</li>
                                <li>• 30 Days of Pre-Loaded Content Prompts</li>
                                <li>• 72-Hour Deployment</li>
                            </ul>
                            <a href="#contact" className="btn-primary block text-center py-3 rounded-lg">
                                DEPLOY ENGINE
                            </a>
                        </div>
                    </div>
                </section>

                {/* --- 5. DIGITAL ARSENAL (MICRO-OFFERS) --- */}
                <section id="tools" className="mb-32 scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                        <span className="text-[#E9622D]">04.</span> DIGITAL ARSENAL
                    </h2>
                    <div className="bg-[#141418] border border-[#24242A] rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="text-[#6246EA] text-xs font-bold tracking-widest mb-2">MICRO-OFFER // INSTANT ACCESS</div>
                            <h3 className="text-3xl font-black text-white mb-4">THE 48-HOUR PROMPT PACK</h3>
                            <p className="text-[#B9B9C0] mb-6 leading-relaxed">
                                Don't need a full build yet? Get the raw code. Access our proprietary library of 50+ high-velocity content prompts designed to generate 30 days of posts in one sitting.
                            </p>
                            <ul className="text-sm text-[#E9E9E9] space-y-2 mb-8">
                                <li className="flex items-center gap-2"><span>⚡</span> 50+ Architecture-Grade Prompts</li>
                                <li className="flex items-center gap-2"><span>⚡</span> Platform-Agnostic (LinkedIn, X, IG)</li>
                                <li className="flex items-center gap-2"><span>⚡</span> Instant PDF Download</li>
                            </ul>
                            <button className="btn-primary px-8 py-3 rounded-lg w-full md:w-auto">
                                DOWNLOAD ASSETS ($27)
                            </button>
                        </div>
                        <div className="w-full md:w-1/3 aspect-square bg-[#0C0C0E] border border-[#24242A] rounded-lg flex items-center justify-center relative overflow-hidden group">
                            {/* Placeholder for Digital Product Image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#6246EA]/20 to-[#E9622D]/20 group-hover:opacity-75 transition-opacity"></div>
                            <span className="text-6xl">📦</span>
                        </div>
                    </div>
                </section>

                {/* --- 6. CONTACT (BOOKING) --- */}
                <section id="contact" className="pb-32 text-center max-w-2xl mx-auto scroll-mt-24">
                    <h2 className="text-4xl font-bold mb-6">READY TO BUILD?</h2>
                    <p className="text-[#B9B9C0] mb-10">
                        Fill out the intake log below. We review and deploy.
                    </p>
                    
                    {/* Netlify Form Setup */}
                    <form name="contact" method="POST" data-netlify="true" className="text-left space-y-4">
                        <input type="hidden" name="form-name" value="contact" />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[#B9B9C0] mb-1">NAME / CALLSIGN</label>
                                <input type="text" name="name" required className="w-full p-3 rounded bg-[#0C0C0E] border border-[#24242A]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#B9B9C0] mb-1">EMAIL FREQUENCY</label>
                                <input type="email" name="email" required className="w-full p-3 rounded bg-[#0C0C0E] border border-[#24242A]" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#B9B9C0] mb-1">SYSTEM TYPE</label>
                            <select name="package" className="w-full p-3 rounded bg-[#0C0C0E] border border-[#24242A] text-white">
                                <option>Initiation ($500)</option>
                                <option>Full System ($1,200)</option>
                                <option>Custom Architecture</option>
                                <option>Prompt Pack ($27)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#B9B9C0] mb-1">MISSION BRIEF (Optional)</label>
                            <textarea name="message" rows="4" className="w-full p-3 rounded bg-[#0C0C0E] border border-[#24242A]"></textarea>
                        </div>

                        <button type="submit" className="btn-primary w-full py-4 rounded font-bold tracking-widest text-lg mt-4">
                            TRANSMIT REQUEST
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default Home;