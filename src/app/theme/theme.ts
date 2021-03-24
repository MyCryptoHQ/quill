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
    fontWeight: 'bold',
    lineHeight: { _: 0, sm: 1 },
    color: 'LIGHT_BLUE',
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

const BUTTON_VARIANTS = {
  default: {
    p: '3',
    width: '100%',
    bg: 'BLUE_LIGHT',
    '&:hover': {
      bg: 'BLUE_LIGHT_DARKISH',
      cursor: 'pointer'
    },
    '&:disabled': {
      bg: 'GREY_LIGHT',
      cursor: 'default',
      '&:hover': {
        bg: 'GREY_LIGHT',
        cursor: 'default'
      }
    },
    '&:focus': {
      outline: 'none'
    }
  },
  inverted: {
    p: '3',
    width: '100%',
    borderColor: 'BLUE_LIGHT',
    borderWidth: '1px',
    borderStyle: 'solid',
    color: 'BLUE_LIGHT',
    bg: 'white',
    '&:hover': {
      cursor: 'pointer',
      color: 'white',
      bg: 'BLUE_LIGHT_DARKISH'
    },
    '&:disabled': {
      color: 'BLUE_GREY',
      borderColor: 'BLUE_GREY',
      cursor: 'default',
      '&:hover': {
        color: 'BLUE_GREY',
        bg: 'revert',
        cursor: 'default'
      }
    },
    '&:focus': {
      outline: 'none'
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
    BLUE_LIGHT: '#007896',
    BLUE_LIGHT_DARKISH: '#006077',
    BLUE_DARK_SLATE: '#163150',
    BLUE_GREY: '#B5BFC7',
    BLUE_BRIGHT: '#1eb8e7',

    // BLACK
    BODY: '#424242',

    // GREY
    BG_GREY: '#C4C4C4',
    BG_GREY_MUTED: '#F6F8FA',
    GREY_ATHENS: '#e8eaed',
    GREY_LIGHTEST: '#f7f7f7',
    GREY_LIGHTER: '#e5ecf3',
    GREY_LIGHT: '#d8d8d8',

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
  radii: ['3px'],
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
    },
    error: {
      fontSize: 2,
      lineHeight: 1,
      color: 'RED'
    }
  },
  forms: {
    label: {
      marginBottom: '6px'
    },
    input: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'GREY_ATHENS',
      boxShadow: '0px 1px 1px rgba(232, 234, 237, 0.5), inset 0px 1px 3px rgba(232, 234, 237, 0.5)',
      borderRadius: 0
    },
    textarea: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'GREY_ATHENS',
      boxShadow: '0px 1px 1px rgba(232, 234, 237, 0.5), inset 0px 1px 3px rgba(232, 234, 237, 0.5)',
      borderRadius: 0
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
  },
  buttons: {
    ...BUTTON_VARIANTS
  }
};

// Global styling for default elements
export const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden;
    margin: 0;
  }

  :root {
    color: ${(p) => p.theme.colors.BODY};
    font-family: ${(props) => props.theme.fonts.default};
    font-size: ${(props) => props.theme.fontSizes[2]};
    line-height: ${(props) => props.theme.lineHeights[1]};
  }
`;
