import React from 'react';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { SetupAccount } from '@screens';
import { translateRaw } from '@translations';

const getComponent = () =>
  render(
    <MemoryRouter>
      <SetupAccount />
    </MemoryRouter>
  );

describe('SetupAccount', () => {
  it('renders', () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('SETUP_ACCOUNT_HEADER'))).toBeDefined();
  });
});
