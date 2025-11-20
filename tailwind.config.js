/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VVVDigitals Brand Palette
        "vvv-purple": "#6246EA",
        "vvv-coral": "#E9622D",
        "vvv-charcoal": "#0C0C0E",
        "vvv-surface": "#141418",
        "vvv-text": "#E9E9E9",
        "vvv-muted": "#B9B9C0",
        "vvv-divider": "#24242A",
      },
      backgroundColor: {
        // opacity variants you used
        "vvv-charcoal/95": "rgba(12,12,14,0.95)",
        "vvv-surface/50": "rgba(20,20,24,0.5)",
      },
      textColor: {
        "vvv-text": "#E9E9E9",
        "vvv-muted": "#B9B9C0",
        "vvv-purple": "#6246EA",
        "vvv-coral": "#E9622D",
      },
      borderColor: {
        "vvv-divider": "#24242A",
      }
    },
  },
  plugins: [],
};
