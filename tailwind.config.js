/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        range: {
          bg: '#fcfcfc',
          dark: '#030712',
          primary: '#10b981',
          secondary: '#3b82f6',
          accent: '#f59e0b',
          light: {
            bg: '#fcfcfc',
            primary: '#059669',
            dark: '#171717',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
