import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura'; // aura | lara | nora

const MyDesignPreset = definePreset(Aura, {
  semantic: {
    primary: {
      25: '#FCFAFD',
      50: '#EEF6FC',
      100: '#CAE5FA',
      200: '#5CA2D8',
      300: '#4394D2',
      400: '#2985CC',
      500: '#0560A6',
      600: '#0262AD',
      700: '#015697',
      800: '#014981',
      900: '#023257',
      950: '#012846',
      DEFAULT: '#0560A6',
      default: '#0560A6'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
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
          950: '#0A0D12'
        },
        text: {
          color: '#181D27', // text-primary
          mutedColor: '#535862', // text-secondary
        }
      },
      dark: {
        surface: {
          0: '#ffffff',
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
          950: '#0C0E12'
        }
      }
    }
  }
});

export default MyDesignPreset;
