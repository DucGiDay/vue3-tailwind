/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
  prefix: 'fb-',
  darkMode: ['selector', '[class*="fabi-cms-sub-dark"]'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [PrimeUI],
  theme: {
    extend: {
      colors: {
        primary: '#0560A6',
        white: '#FFFFFF',
        black: '#000000',
        brand: {
          25: '#FCFAFF',
          50: '#F9F5FF',
          100: '#F4EBFF',
          200: '#E9D7FE',
          300: '#D6BBFB',
          400: '#B692F6',
          500: '#9E77ED',
          600: '#7F56D9',
          700: '#6941C6',
          800: '#53389E',
          900: '#42307D',
          950: '#2C1C5F',
          DEFAULT: '#9E77ED'
        },
        error: {
          25: '#FFFBFA',
          50: '#FEF3F2',
          100: '#FEE4E2',
          200: '#FECDCA',
          300: '#FDA29B',
          400: '#F97066',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
          800: '#912018',
          900: '#7A271A',
          950: '#55160C',
          DEFAULT: '#F04438'
        },
        'gray-blue': {
          25: '#FCFCFD',
          50: '#F8F9FC',
          100: '#EAECF5',
          200: '#D5D9EB',
          300: '#B3B8DB',
          400: '#717BBC',
          500: '#4E5BA6',
          600: '#3E4784',
          700: '#363F72',
          800: '#293056',
          900: '#101323',
          950: '#0D0F1C',
          DEFAULT: '#4E5BA6'
        },
        'gray-dark': {
          25: '#FAFAFA',
          50: '#F7F7F7',
          100: '#F0F0F1',
          200: '#ECECED',
          300: '#CECFD2',
          400: '#94979C',
          500: '#85888E',
          600: '#61656C',
          700: '#373A41',
          800: '#22262F',
          900: '#13161B',
          950: '#0C0E12',
          DEFAULT: '#85888E'
        },
        gray: {
          25: '#FDFDFD',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E9EAEB',
          300: '#D5D7DA',
          400: '#A4A7AE',
          500: '#717680',
          600: '#535862',
          700: '#414651',
          800: '#252B37',
          900: '#181D27',
          950: '#0A0D12',
          DEFAULT: '#717680'
        },
        success: {
          25: '#F6FEF9',
          50: '#ECFDF3',
          100: '#DCFAE6',
          200: '#ABEFC6',
          300: '#75E0A7',
          400: '#47CD89',
          500: '#17B26A',
          600: '#079455',
          700: '#067647',
          800: '#085D3A',
          900: '#074D31',
          950: '#053321',
          DEFAULT: '#17B26A'
        },
        warning: {
          25: '#FFFCF5',
          50: '#FFFAEB',
          100: '#FEF0C7',
          200: '#FEDF89',
          300: '#FEC84B',
          400: '#FDB022',
          500: '#F7941D',
          600: '#DC6803',
          700: '#B54708',
          800: '#93370D',
          900: '#7A2E0E',
          950: '#4E1D09',
          DEFAULT: '#F7941D'
        }
      }
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1920px'
    }
  }
};
