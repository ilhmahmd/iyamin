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
          light: '#DDDAFE',
          DEFAULT: '#6E61E9',
        },
        dark: '#110B49',
        accent: {
          light: '#FFF2E3',
          DEFAULT: '#FAB96E',
          dark: '#FFA84A',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
