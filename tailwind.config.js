module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {},
    screens: {
      'xs': '414px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  variants: {
    extend: {
      margin: ['active'],
      padding: ['active'],
      width: ['active'],
      height: ['active'],
      boxShadow: ['active'],
    },
  },
  plugins: [],
}
