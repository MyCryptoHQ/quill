import { theme as UITheme } from '@mycrypto/ui';
import merge from 'lodash.merge';
import { createGlobalStyle } from 'styled-components';

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
  primary: {
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
    px: '3',
    py: '14px',
    width: '100%',
    borderColor: 'BLUE_LIGHT',
    borderWidth: '2px',
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

const overrideTheme = {
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
    GREY_TEXT: '#828282',

    // ORANGE
    ORANGE: '#FA873F',

    // GREEN
    GREEN: '#B3DD87',

    // RED
    RED: '#EF4747',

    // PURPLE
    PURPLE: '#A682FF',

    text: {
      success: '#B3DD87',
      warning: '#FA873F',
      alert: '#EF4747'
    },

    badge: {
      muted: '#F6F8FA'
    },

    border: {
      light: '#e3edff',
      dark: '#007a99'
    }
  },
  radii: { input: '2px', banner: '3px', badge: '4px' },
  variants: {
    ...LINK_VARIANTS,
    divider: {
      bg: 'GREY_ATHENS',
      width: '100%',
      height: '1px'
    },
    avatar: {
      borderRadius: '50%'
    },
    panel: {
      bg: 'white',
      border: '1px solid',
      borderColor: 'GREY_ATHENS',
      boxShadow: '0px -12px 20px rgba(79, 79, 79, 0.11)',
      padding: '4'
    },
    clear: {
      bg: 'DEFAULT_BACKGROUND',
      boxShadow: 'none',
      borderColor: 'none',
      padding: '24px',
      paddingTop: '0'
    },
    badge: {
      borderRadius: 'badge',
      bg: 'PURPLE',
      py: '1',
      px: '2',
      color: 'WHITE',
      fontSize: '14px',
      lineHeight: '20px',
      nonce: {
        bg: 'badge.muted'
      }
    },
    banner: {
      success: {
        background: '#f4faed',
        color: '#b4dd88'
      },
      info: {
        background: '#f4f6f7',
        color: '#b6c0c8'
      },
      action: {
        background: '#f2ecff',
        color: '#a682ff'
      },
      warning: {
        background: '#feede2',
        color: '#fa873f'
      },
      error: {
        background: '#fde4e4',
        color: '#ef4747'
      },
      clear: {
        background: 'none',
        color: '#a682ff'
      }
    }
  },
  buttons: {
    ...BUTTON_VARIANTS
  }
};

export const theme = merge(UITheme, overrideTheme);
export type Theme = typeof theme;

// Global styling for default elements
export const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden;
    margin: 0;
  }

  :root {
    color: ${(p) => p.theme.colors.BODY};
    font-family: ${(props) => props.theme.fonts.body};
    font-size: ${(props) => props.theme.fontSizes[2]};
    line-height: ${(props) => props.theme.lineHeights[1]};
  }
`;
