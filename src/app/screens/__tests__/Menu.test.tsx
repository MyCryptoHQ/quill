import React from 'react';

import { render } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';

import { Menu } from '../Menu';

function getComponent() {
  return render(
    <Router>
      <Menu />
    </Router>
  );
}

describe('Menu', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Add or Generate Accounts').textContent).toBeDefined();
  });
});
