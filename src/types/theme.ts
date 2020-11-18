export interface Theme {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  fontSizes: string[];
  lineHeights: string[];
  text: Record<string, Record<string, string | number>>;
}
