module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
        screens: {
          'xs': '360px',
        },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}