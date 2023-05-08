/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        image: 'image 40s linear infinite'
      },
      keyframes: {
        image: {
          '0%, 100%': { objectPosition: 'center 0%' },
          '50%': { objectPosition: 'center 100%' }
        }
      }
    }
  },
  plugins: []
};
