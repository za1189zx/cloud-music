const colors = require('tailwindcss/colors.js')

module.exports = {
  purge: ['./src/**/*.vue', './src/**/*.js', './public/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        45: '11.25rem',
        50: '12.5rem',
        70: '17.5rem',
        104: '26rem',
        105: '26.25rem',
        112: '28rem',
        120: '30rem',
        128: '32rem',
        136: '34rem',
        144: '36rem',
        192: '48rem',
        250: '62.5rem',
        256: '64rem',
        300: '75rem',
        full: '100%',
        '2/5': '40%',
        '4/1': '400%'
      },
      colors: {
        gray: colors.trueGray
      },
      maxWidth: {
        60: '15rem'
      },
      minWidth: {
        14: '3.5rem'
      },
      minHeight: {
        180: '45rem'
      },
      screens: {
        xs: '480px'
      },
      boxShadow: {
        black: '0 5px 16px 0 rgba(0, 0, 0, 0.8)'
      },
      stroke: theme => theme('colors')
    },
    fill: theme => theme('colors')
  },
  variants: {
    extend: {
      backgroundColor: ['odd', 'even', 'disabled'],
      backgroundImage: ['disabled'],
      borderWidth: ['last'],
      cursor: ['disabled'],
      display: ['group-hover'],
      fill: ['hover', 'focus'],
      textColor: ['disabled'],
      translate: ['group-hover']
    }
  },
  plugins: []
}
