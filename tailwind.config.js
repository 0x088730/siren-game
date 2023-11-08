const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  colors: {
    black: '#000',
    current: 'currentColor',
    transparent: 'transparent',
    white: '#fff',
  },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
