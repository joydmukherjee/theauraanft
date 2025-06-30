/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'comic': ['Comic Neue', 'cursive'],
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        }
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out',
      },
      colors: {
        customColor1: '#030122',    // Replace with your desired color
        customColor2: '#100136',    // Replace with your desired color
      },
      gradientColorStops: {
        customGradient1: 'var(--tw-gradient-stops)',    // Use default gradient stops
        customGradient2: 'var(--tw-gradient-stops)',    // Use default gradient stops
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
