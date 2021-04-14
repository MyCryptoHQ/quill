import React from 'react';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { translateRaw } from '@common/translate';
import { SetupAccount } from '@screens';

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
