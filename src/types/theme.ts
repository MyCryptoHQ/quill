export interface Theme {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  fontSizes: string[];
  lineHeights: string[];
  radii: string[];
  text: Record<string, Record<string, string | number>>;
  forms: Record<string, Record<string, string | number>>;
  variants: Record<string, Record<string, string | number | unknown>>;
  buttons: Record<string, Record<string, string | number | unknown>>;
}
