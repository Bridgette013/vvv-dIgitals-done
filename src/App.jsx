import React, { useState } from 'react';

// --- Global Brand Variables (for easy reference in JSX) ---
const VVV_COLORS = {
  purple: '#6246EA',
  coral: '#E9622D',
  charcoal: '#0C0C0E',
  surface: '#141418',
  text: '#E9E9E9',
  muted: '#B9B9C0',
  divider: '#24242A',
};

// Access the environment variable provided by Vite.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

// --- Initial Dynamic Data Array for Portfolio Section ---
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

/**
 * Retries the fetch request with exponential backoff.
 */
async function exponentialBackoffFetch(url, options, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      if (response.status === 429 && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// --- Component for a Single Portfolio Card ---
const DeploymentCard = ({ deployment }) => {
  const placeholderUrl = `https://placehold.co/800x600/${VVV_COLORS.surface.substring(1)}/${deployment.accentColor.substring(1)}?text=${deployment.systemType.replace(/ /g, '+')}`;

  return (
    <div className="group bg-vvv-surface rounded-xl overflow-hidden shadow-xl border border-vvv-divider hover:border-vvv-purple transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={placeholderUrl}
          alt={deployment.title}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/800x600/141418/B9B9C0?text=LOAD+ERROR';
          }}
        />
        <div className="absolute inset-0 bg-vvv-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-sm font-semibold text-vvv-text p-2 rounded-full bg-vvv-coral/80">
            VIEW LOGIC
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-vvv-text">{deployment.title}</h3>
        <p className="text-xs text-vvv-muted mt-1">{deployment.description}</p>
      </div>
    </div>
  );
};

// --- Main Application Component ---
const App = () => {
  const [conceptInput, setConceptInput] = useState('');
  const [narrativeOutput, setNarrativeOutput] = useState(
    <p className="text-vvv-muted italic text-sm">Output will appear here...</p>
  );
  const [isLoading, setIsLoading] = useState(false);
  const [deployments] = useState(initialDeployments); // Dynamic project list

  // Function to handle the API call
  const generateCinematicNarrative = async () => {
    const userQuery = conceptInput.trim();

    // Check if API key was injected successfully during build
    if (!apiKey) {
      setNarrativeOutput(
        <p className="text-vvv-coral">
          System Error: API key not loaded. Check your <code>.env</code> file and Vite config.
        </p>
      );
      return;
    }

    if (!userQuery) {
      setNarrativeOutput(
        <p className="text-vvv-coral">
          Error: Please enter a business concept or challenge to begin orchestration.
        </p>
      );
      return;
    }

    setNarrativeOutput('');
    setIsLoading(true);

    const systemPrompt =
      'Act as a creative engineer for VVVDigitals. Your output must strictly follow the brand\'s core values: Automation, Artistry, Precision, and Velocity. Write a short, smart, cinematic, and high-impact project narrative (no more than three sentences) for a client\'s digital assets or business consulting challenge based on the user\'s concept. Every phrase must feel designed. Use terms like "system," "architecture," "encoding," "sequence," "logic," or "pipeline" to describe the solution.';

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
      const response = await exponentialBackoffFetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setNarrativeOutput(
          <p className="text-vvv-text text-lg italic">{text}</p>
        );
      } else {
        setNarrativeOutput(
          <p className="text-vvv-coral">
            Error: Failed to generate narrative. Response structure was invalid.
          </p>
        );
      }
    } catch (error) {
      console.error('Gemini API Call Error:', error);
      setNarrativeOutput(
        <p className="text-vvv-coral">
          System Error: Connection failed or maximum retries exceeded. Check console for details.
        </p>
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-vvv-charcoal/95 backdrop-blur-sm shadow-lg border-b border-vvv-divider">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo: Gradient 'VVVDigitals' Text Mark */}
          <a href="#" className="text-2xl font-extrabold tracking-tight text-vvv-gradient uppercase">
            VVVDigitals
          </a>

          {/* Menu Items */}
          <div className="flex space-x-6 text-sm font-medium">
            <a href="#portfolio" className="hover:text-vvv-coral transition-colors">Deployments</a>
            <a href="#engine" className="hover:text-vvv-coral transition-colors">Engine</a>
            <a href="#contact" className="hover:text-vvv-coral transition-colors">Contact</a>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 01. Hero Section: Cinematic Tone */}
        <section className="py-20 md:py-32 text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tighter mb-4">
            <span className="text-vvv-gradient block">Commanding Motion</span>
            <span className="block text-vvv-text">with Pure Language.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-vvv-muted max-w-3xl mx-auto mb-8">
            We don&apos;t automate. We orchestrate. We build velocity from metaphor.
          </p>
          <a
            href="#portfolio"
            className="btn-coral text-vvv-text font-semibold py-3 px-8 rounded-lg shadow-md inline-block"
          >
            View System Deployments
          </a>
        </section>

        {/* 02. Core Value Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 text-center">
          {/* Card 1: Automation */}
          <div className="bg-vvv-surface p-6 rounded-xl border border-vvv-divider">
            <h3 className="text-3xl font-bold mb-2 text-vvv-purple">01</h3>
            <h4 className="text-lg font-semibold text-vvv-text mb-2">Automation</h4>
            <p className="text-sm text-vvv-muted">
              Scalable systems built for speed. The fusion of logic and velocity.
            </p>
          </div>
          {/* Card 2: Artistry */}
          <div className="bg-vvv-surface p-6 rounded-xl border border-vvv-divider">
            <h3 className="text-3xl font-bold mb-2 text-vvv-purple">02</h3>
            <h4 className="text-lg font-semibold text-vvv-text mb-2">Artistry</h4>
            <p className="text-sm text-vvv-muted">
              Visual and linguistic elegance. Every asset is a designed sequence.
            </p>
          </div>
          {/* Card 3: Precision */}
          <div className="bg-vvv-surface p-6 rounded-xl border border-vvv-divider">
            <h3 className="text-3xl font-bold mb-2 text-vvv-purple">03</h3>
            <h4 className="text-lg font-semibold text-vvv-text mb-2">Precision</h4>
            <p className="text-sm text-vvv-muted">
              Strategy disguised as design. Flawless execution where logic meets goal.
            </p>
          </div>
        </section>

        {/* 03. Portfolio Showcase (DYNAMIC Content) */}
        <section id="portfolio" className="py-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center border-b pb-4 border-vvv-divider uppercase tracking-widest text-vvv-text">
            System Deployments &amp; Case Logic
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deployments.map((deployment) => (
              <DeploymentCard key={deployment.id} deployment={deployment} />
            ))}
          </div>
        </section>

        {/* 04. Linguistic Architecture Engine (Gemini API Feature) */}
        <section id="engine" className="py-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center border-b pb-4 border-vvv-divider uppercase tracking-widest text-vvv-text">
            Linguistic Architecture Engine
          </h2>
          <div className="bg-vvv-surface p-8 rounded-xl max-w-4xl mx-auto border border-vvv-divider shadow-2xl">
            <p className="text-vvv-muted mb-4 text-sm">
              <strong>Automation in Action:</strong> Test our core value of Linguistic Art by generating a{' '}
              <strong>Cinematic System Narrative</strong> for a business challenge.
            </p>

            <div className="mb-6">
              <label
                htmlFor="concept-input"
                className="block text-sm font-medium text-vvv-muted mb-2"
              >
                Input Business Challenge (e.g., &quot;Need to automate content creation for a new product
                launch.&quot;)
              </label>
              <input
                type="text"
                id="concept-input"
                placeholder="Enter your concept..."
                value={conceptInput}
                onChange={(e) => setConceptInput(e.target.value)}
                className="w-full bg-vvv-charcoal text-vvv-text p-3 rounded-lg border border-vvv-divider focus:border-vvv-purple focus:ring-1 focus:ring-vvv-purple transition-colors"
              />
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={generateCinematicNarrative}
                disabled={isLoading}
                className="btn-purple text-vvv-text font-semibold py-3 px-8 rounded-lg flex items-center justify-center disabled:opacity-50"
              >
                <span id="button-text">
                  {isLoading ? 'Orchestrating...' : '✨ Generate System Narrative'}
                </span>
                {isLoading && <div id="loader" className="loader ml-2"></div>}
              </button>
            </div>

            <div
              id="narrative-output"
              className="min-h-[6rem] bg-vvv-charcoal p-4 rounded-lg border border-vvv-divider flex items-center"
            >
              {narrativeOutput}
            </div>
          </div>
        </section>

        {/* 05. Contact / CTA Section */}
        <section id="contact" className="py-20 text-center">
          <div className="bg-vvv-surface p-10 rounded-xl max-w-4xl mx-auto border border-vvv-divider shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-vvv-text">
              Ready to <span className="text-vvv-coral">Orchestrate</span> Motion?
            </h2>
            <p className="text-vvv-muted mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how to merge <strong>Automation</strong> and <strong>Artistry</strong> for
              your next high-impact content system.
            </p>
            <a
              href="#"
              className="btn-coral text-vvv-text font-semibold py-3 px-10 rounded-lg shadow-lg inline-block text-lg"
            >
              Start the Dialogue
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-vvv-divider py-8 text-center bg-vvv-surface/50">
        <p className="text-xs text-vvv-muted">
          VVVDigitals &copy; 2025. Commanding Motion with Pure Language.
        </p>
        <p className="text-xs text-vvv-muted mt-1">
          <span className="text-vvv-purple">Automation</span> |{' '}
          <span className="text-vvv-purple">Artistry</span> |{' '}
          <span className="text-vvv-purple">Precision</span>
        </p>
      </footer>
    </>
  );
};

export default App;
