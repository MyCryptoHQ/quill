import { translateRaw } from '@quill/common';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { SetupAccount } from './SetupAccount';

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
