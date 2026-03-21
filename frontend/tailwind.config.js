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
          600: '#0d9488',
        },
        secondary: {
          500: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
