/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#222222',
        'accent-cyan': '#00CED1',
        'accent-teal': '#20B2AA',
        'primary-blue': '#2563eb',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans JP"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
