import React, { useState } from 'react';

const VVV_COLORS = {
    purple: '#6246EA',
    coral: '#E9622D',
    charcoal: '#0C0C0E',
    surface: '#141418',
    text: '#E9E9E9',
    muted: '#B9B9C0',
    divider: '#24242A',
};

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

const apiKey = (import.meta && import.meta.env) ? import.meta.env.VITE_GEMINI_API_KEY : "";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

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
            throw new Error(`API request failed with status ${response.status}`);
        } catch (error) {
            if (attempt === maxRetries - 1) throw error;
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

const DeploymentCard = ({ deployment }) => {
    const placeholderUrl = `https://placehold.co/800x600/${VVV_COLORS.surface.substring(1)}/${deployment.accentColor.substring(1)}?text=${deployment.systemType.replace(/ /g, '+')}`;

    return (
        <div className="group bg-vvv-surface rounded-xl overflow-hidden shadow-xl border border-vvv-divider hover:border-[var(--vvv-coral)] transition-all duration-300">
            <div className="relative overflow-hidden">
                <img 
                    src={placeholderUrl} 
                    alt={deployment.title} 
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x600/141418/B9B9C0?text=LOAD+ERROR'; }}
                />
                <div className="absolute inset-0 bg-vvv-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-sm font-semibold text-vvv-text p-2 rounded-full bg-vvv-coral/80">VIEW LOGIC</span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-vvv-text">{deployment.title}</h3>
                <p className="text-xs text-vvv-muted mt-1">{deployment.description}</p>
            </div>
        </div>
    );
};

const App = () => {
    const [conceptInput, setConceptInput] = useState('');
    const [narrativeOutput, setNarrativeOutput] = useState(
        <p className="text-vvv-muted italic text-sm">Output will appear here...</p>
    );
    const [isLoading, setIsLoading] = useState(false);
    const [deployments] = useState(initialDeployments);

    const generateCinematicNarrative = async () => {
        const userQuery = conceptInput.trim();

        if (!userQuery) {
            setNarrativeOutput(<p className="text-vvv-coral">Error: Please enter a business concept.</p>);
            return;
        }

        if (!apiKey) {
            setNarrativeOutput(<p className="text-vvv-coral">System Error: API Configuration Missing. Check Environment.</p>);
            return;
        }

        setNarrativeOutput('');
        setIsLoading(true);

        const systemPrompt = `Act as a creative engineer for VVVDigitals. Your output must strictly follow the brand's core values: Automation, Artistry, Precision, and Velocity. Write a short, smart, cinematic, and high-impact project narrative (no more than three sentences).`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        try {
            const response = await exponentialBackoffFetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                setNarrativeOutput(<p className="text-vvv-text text-lg italic">{text}</p>);
            } else {
                setNarrativeOutput(<p className="text-vvv-coral">Error: Failed to generate narrative.</p>);
            }

        } catch (error) {
            console.error("API Error:", error);
            setNarrativeOutput(<p className="text-vvv-coral">System Error: Connection failed.</p>);
        } finally {
            setIsLoading(false);
        }
    };

    const globalStyles = `
        .text-vvv-gradient {
            background: linear-gradient(90deg, #E9622D 0%, #6246EA 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .btn-coral {
            background-color: #E9622D;
            transition: all 0.3s ease;
        }
        .btn-coral:hover { background-color: #f77a4a; transform: translateY(-1px); }
        .btn-purple {
            background-color: #6246EA;
            transition: all 0.3s ease;
        }
        .btn-purple:hover { background-color: #7a63eb; transform: translateY(-1px); }
        .loader {
            border: 4px solid #141418; border-top: 4px solid #E9622D;
            border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;

    return (
        <>
            <style>{globalStyles}</style>
            <header className="sticky top-0 z-50 bg-vvv-charcoal/95 backdrop-blur-sm shadow-lg border-b border-vvv-divider">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <a href="#" className="text-2xl font-extrabold tracking-tight text-vvv-gradient uppercase">VVVDigitals</a>
                    <div className="flex space-x-6 text-sm font-medium">
                        <a href="#portfolio" className="hover:text-vvv-coral transition-colors text-vvv-text">Deployments</a>
                        <a href="#engine" className="hover:text-vvv-coral transition-colors text-vvv-text">Engine</a>
                    </div>
                </nav>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="py-20 md:py-32 text-center">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tighter mb-4">
                        <span className="text-vvv-gradient block">Commanding Motion</span>
                        <span className="block text-vvv-text">with Pure Language.</span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-vvv-muted max-w-3xl mx-auto mb-8">
                        We don't automate. We orchestrate. We build velocity from metaphor.
                    </p>
                    <a href="#portfolio" className="btn-coral text-vvv-text font-semibold py-3 px-8 rounded-lg shadow-md inline-block">
                        View System Deployments
                    </a>
                </section>

                <section id="portfolio" className="py-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center border-b pb-4 border-vvv-divider uppercase tracking-widest text-vvv-text">
                        System Deployments
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deployments.map(d => <DeploymentCard key={d.id} deployment={d} />)}
                    </div>
                </section>

                <section id="engine" className="py-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center border-b pb-4 border-vvv-divider uppercase tracking-widest text-vvv-text">
                        Linguistic Architecture Engine
                    </h2>
                    <div className="bg-vvv-surface p-8 rounded-xl max-w-4xl mx-auto border border-vvv-divider shadow-2xl">
                        <p className="text-vvv-muted mb-4 text-sm">Input a business challenge to generate a cinematic system narrative.</p>
                        <input 
                            type="text" 
                            value={conceptInput} 
                            onChange={(e) => setConceptInput(e.target.value)} 
                            className="w-full bg-vvv-charcoal text-vvv-text p-3 rounded-lg border border-vvv-divider mb-6"
                            placeholder="Enter concept..."
                        />
                        <button onClick={generateCinematicNarrative} disabled={isLoading} className="btn-purple text-vvv-text font-semibold py-3 px-8 rounded-lg flex items-center justify-center w-full sm:w-auto">
                            {isLoading ? 'Orchestrating...' : '✨ Generate Narrative'}
                            {isLoading && <div className="loader ml-2"></div>}
                        </button>
                        <div className="mt-6 min-h-[6rem] bg-vvv-charcoal p-4 rounded-lg border border-vvv-divider flex items-center">
                            {narrativeOutput}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="mt-20 border-t border-vvv-divider py-8 text-center bg-vvv-surface/50 text-vvv-muted text-xs">
                VVVDigitals © 2025. Commanding Motion with Pure Language.
            </footer>
        </>
    );
};

export default App;
