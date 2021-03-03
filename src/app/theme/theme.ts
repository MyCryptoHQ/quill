import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { variant } from 'styled-system';

export const theme: DefaultTheme = {
  colors: {
    // BLUE
    BLUE: '#027796',
    DARK_BLUE: '#1c314e',
    LIGHT_BLUE: '#55B6E2',
    BLUE_DARK_SLATE: '#163150',

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
  fonts: {
    default: "'Lato', sans-serif"
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
  }
};

// Global styling for default elements
export const GlobalStyle = createGlobalStyle`
  body { 
    margin: 0;
  }

  :root {
    color: ${(p) => p.theme.colors.BODY};
    font-family: ${(props) => props.theme.fonts.default};
    font-size: ${(props) => props.theme.fontSizes[2]};
    line-height: ${(props) => props.theme.lineHeights[1]};
  }
`;

// FROM CORE, DELETE WHEN COMPONENT SHARING
const FLEX_RECIPES = {
  align: {
    alignItems: 'center'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
};

const FLEX_VARIANTS = {
  rowAlign: {
    display: 'flex',
    flexDirection: 'row',
    ...FLEX_RECIPES.align
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    ...FLEX_RECIPES.center
  },
  columnAlign: {
    display: 'flex',
    flexDirection: 'column',
    ...FLEX_RECIPES.align
  },
  columnCenter: {
    display: 'flex',
    flexDirection: 'column',
    ...FLEX_RECIPES.center
  }
};

export type FlexVariants = keyof typeof FLEX_VARIANTS;
export const flexVariants = variant({
  variants: FLEX_VARIANTS
});
