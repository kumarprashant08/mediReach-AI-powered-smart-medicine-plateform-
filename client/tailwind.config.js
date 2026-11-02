/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36a9f7',
          500: '#0c8de9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b83',
          900: '#0c3f6e',
          950: '#082849',
        },
        navy: {
          800: '#0b192c',
          900: '#070f1e',
          950: '#030710',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        ai: {
          purple: '#8b5cf6',
          violet: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        glow: '0 0 25px -5px rgba(12, 141, 233, 0.4)',
      },
    },
  },
  plugins: [],
};
