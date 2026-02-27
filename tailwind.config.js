/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:           '#080d14',
        'bg-2':       '#0c1220',
        'bg-card':    '#0f1520',
        border:       '#1a2332',
        accent:       '#3B6EF8',
        'accent-dim': '#1e3a6e',
        txt:          '#E8EDF5',
        mid:          '#4a5568',
        muted:        '#2d3a4a',
      },
      fontFamily: {
        sans:     ["'DM Sans'",    'sans-serif'],
        mono:     ["'DM Mono'",    'monospace'],
        headline: ["'Bebas Neue'", 'cursive'],
      },
    },
  },
  plugins: [],
};
