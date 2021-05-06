import { render } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';

import { translateRaw } from '@common/translate';

import { AddAccountEnd } from './index';

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
