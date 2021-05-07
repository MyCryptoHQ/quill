import { render } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';

import { translateRaw } from '@common/translate';

import { AddAccountEnd } from './AddAccountEnd';

describe('AddAccountEnd', () => {
  it('renders', async () => {
    const { getByText } = render(
      <Router>
        <AddAccountEnd
          onNext={jest.fn()}
          onPrevious={jest.fn()}
          onReset={jest.fn()}
          flowHeader={<></>}
        />
      </Router>
    );
    expect(getByText(translateRaw('BACK_TO_HOME'))).toBeDefined();
  });
});
