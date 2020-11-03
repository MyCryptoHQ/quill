// Overide styled-components DefaultTheme type to have our theme properties
// https://github.com/styled-components/styled-components-website/issues/392#issuecomment-447067722

// import original module declaration
import 'styled-components';

// and extend it
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Record<string, string>;
    fontFamily: string;
    fontSizes: string[];
    lineHeights: string[];
  }
}
