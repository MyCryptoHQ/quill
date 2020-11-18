import { Theme } from 'theme-ui';

export const theme: Theme = {
  colors: {
    // BLUE
    BLUE: '#027796',
    DARK_BLUE: '#1c314e',
    LIGHT_BLUE: '#55B6E2',

    // BLACK
    BODY: '#424242',

    // WHITE
    WHITE: '#FFFFFF',

    // ORANGE
    ORANGE: '#FA873F',

    // GREEN
    GREEN: '#B3DD87',

    // RED
    RED: '#EF4747',

    // PURPLE
    PURPLE: '#A682FF'
  },
  fonts: {
    default: 'Lato, sans-serif'
  },
  fontSizes: ['10px', '12px', '16px', '18px', '20px', '40px'],
  lineHeights: ['16px', '24px', '48px'],
  text: {
    heading: {
      fontSize: 5,
      lineHeight: 3,
      fontWeight: 700,
      color: 'DARK_BLUE'
    },
    subHeading: {
      fontSize: 4,
      lineHeight: 2,
      color: 'DARK_BLUE',
      fontWeight: 700
    },
    body: {
      fontSize: 2,
      lineHeight: 1,
      color: 'BODY'
    }
  },
  styles: {
    root: {
      fontFamily: 'default',
      color: 'BODY',
      fontSize: 2,
      lineHeight: 1,
      backgroundColor: 'WHITE'
    }
  }
};
