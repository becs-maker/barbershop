/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fbf7ef',
          100: '#f5ebd8',
          200: '#e9d3ad',
          300: '#dbb67a',
          400: '#cd984f',
          500: '#b88238',
          600: '#9c682b',
          700: '#7d5024',
          800: '#664222',
          900: '#55371f',
        },
        charcoal: {
          700: '#272b30',
          800: '#1b1e22',
          900: '#121417',
          950: '#0b0c0e',
        },
        stone: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e6dfd3',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans Ethiopic', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        amharic: ['Noto Sans Ethiopic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
