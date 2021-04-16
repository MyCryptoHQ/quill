import { ReactNode } from 'react';

import { ThemeProvider } from 'styled-components';

import { theme } from '@theme';

/*
  Custom wrapper to enable rendered tests to consume providers data
  Ref: https://testing-library.com/docs/react-testing-library/setup
*/
export const ProvidersWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
