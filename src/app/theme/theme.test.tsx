import React from 'react';

import { screen, simpleRender } from 'test-utils';

import { GlobalStyle } from './theme';

function getComponent() {
  return simpleRender(
    <body>
      <GlobalStyle />
    </body>
  );
}
