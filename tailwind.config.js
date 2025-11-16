/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vvv-purple': '#6246EA',
        'vvv-coral': '#E9622D',
        'vvv-charcoal': '#0C0C0E',
        'vvv-surface': '#141418',
        'vvv-text': '#E9E9E9',
        'vvv-muted': '#B9B9C0',
        'vvv-divider': '#24242A',
      }
    },
  },
  plugins: [],
}