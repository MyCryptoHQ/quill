'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ProvidersWrapper = void 0;
const styled_components_1 = require('styled-components');

const _theme_1 = require('@theme');
/*
  Custom wrapper to enable rendered tests to consume providers data
  Ref: https://testing-library.com/docs/react-testing-library/setup
*/
exports.ProvidersWrapper = ({ children }) => (
  <styled_components_1.ThemeProvider theme={_theme_1.theme}>
    {children}
  </styled_components_1.ThemeProvider>
);
//# sourceMappingURL=providersWrapper.js.map
