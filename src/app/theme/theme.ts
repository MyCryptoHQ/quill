import { createGlobalStyle, DefaultTheme } from 'styled-components';

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

const LINK_RECIPES = {
  default: {
    cursor: 'pointer',
    transition: 'all 120ms ease',
    textDecoration: 'none',
    // https://mayashavin.com/articles/svg-icons-currentcolor
    svg: {
      fill: 'currentColor'
    },
    '&:hover svg': {
      fill: 'currentColor'
    }
  }
};

export const LINK_VARIANTS = {
  barren: {
    ...LINK_RECIPES.default,
    color: 'inherit'
  },
  underlineLink: {
    ...LINK_RECIPES.default,
    color: 'inherit',
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  opacityLink: {
    ...LINK_RECIPES.default,
    color: 'BLUE_SKY',
    '&:hover': {
      opacity: '0.8'
    },
    '&:hover svg': {
      opacity: '0.8'
    }
  },
  defaultLink: {
    ...LINK_RECIPES.default,
    fontSize: { _: 0, sm: 1 },
    lineHeight: { _: 0, sm: 1 },
    color: 'BLUE_BRIGHT',
    '&:hover': {
      color: 'BLUE_LIGHT_DARKISH'
    },
    '&:active': {
      opacity: 1
    },
    '&:focus': {
      opacity: 1
    }
  }
};

export const theme: DefaultTheme = {
  colors: {
    DEFAULT_BACKGROUND: '#fbfbfb',

    // BLUE
    BLUE: '#027796',
    DARK_BLUE: '#1c314e',
    LIGHT_BLUE: '#55B6E2',
    BLUE_DARK_SLATE: '#163150',
    BLUE_GREY: '#B5BFC7',

    // BLACK
    BODY: '#424242',

    // GREY
    BG_GREY: '#C4C4C4',
    GREY_ATHENS: '#e8eaed',
    GREY_LIGHTEST: '#f7f7f7',

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
  },
  variants: {
    ...FLEX_VARIANTS,
    ...LINK_VARIANTS,
    divider: {
      bg: 'GREY_ATHENS',
      width: '100%',
      height: '1px'
    },
    avatar: {
      borderRadius: '50%'
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
