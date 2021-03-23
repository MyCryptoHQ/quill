import React from 'react';

import { render } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';

import { translateRaw } from '@translations';

import { AddAccountEnd } from '../AddAccount';

describe('AddAccountEnd', () => {
  it('renders', async () => {
    const { getByText } = render(
      <Router>
        <AddAccountEnd />
      </Router>
    );
    expect(getByText(translateRaw('BACK_TO_HOME'))).toBeDefined();
  });
});
