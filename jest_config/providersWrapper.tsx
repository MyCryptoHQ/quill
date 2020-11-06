import React from 'react';

import { theme } from '@theme';
import { ThemeProvider } from 'styled-components';

/*
  Custom wrapper to enable rendered tests to consume providers data
  Ref: https://testing-library.com/docs/react-testing-library/setup
*/
export const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
