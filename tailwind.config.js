/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1A2B',
        sand: '#FFF8EE',
        coral: '#FF6B4A',
        teal: '#0A7C86'
      },
      boxShadow: {
        card: '0 16px 40px -20px rgba(14, 26, 43, 0.35)'
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
