/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-fast': 'pulse 0.5s ease-in-out infinite',
        'line-clear': 'lineClear 0.3s ease-out forwards',
      },
      keyframes: {
        lineClear: {
          '0%': { opacity: '1', transform: 'scaleY(1)' },
          '50%': { opacity: '0.5', transform: 'scaleY(1.1)' },
          '100%': { opacity: '0', transform: 'scaleY(0)' },
        },
      },
    },
  },
  plugins: [],
}
