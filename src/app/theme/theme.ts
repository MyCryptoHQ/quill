import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { variant } from 'styled-system';

export const theme: DefaultTheme = {
  colors: {
    // BLUE
    BLUE: '#027796',
    DARK_BLUE: '#1c314e',
    LIGHT_BLUE: '#55B6E2',

    // BLACK
    BODY: '#424242',

    // GREY
    BG_GREY: '#C4C4C4',

    // ORANGE
    ORANGE: '#FA873F',

    // GREEN
    GREEN: '#B3DD87',

    // RED
    RED: '#EF4747',

    // PURPLE
    PURPLE: '#A682FF'
  },
  fontFamily: "'Lato', sans-serif",
  fontSizes: ['10px', '12px', '16px', '18px', '20px', '40px'],
  lineHeights: ['16px', '24px', '48px']
};

const TEXT_VARIANTS = {
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
};

// Global styling for default elements

export const GlobalStyle = createGlobalStyle`
  :root {
    color: ${(p) => p.theme.colors.BODY};
    font-family: ${(props) => props.theme.fontFamily};
    font-size: ${(props) => props.theme.fontSizes[2]};
    line-height: ${(props) => props.theme.lineHeights[1]};
  }
`;

export type TextVariants = keyof typeof TEXT_VARIANTS;

export const textVariants = variant({
  variants: TEXT_VARIANTS
});
