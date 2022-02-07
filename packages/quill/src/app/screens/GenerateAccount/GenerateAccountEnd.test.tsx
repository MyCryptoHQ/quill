import { translateRaw } from '@quill/common';
import { render } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';

import { GenerateAccountEnd } from './GenerateAccountEnd';

describe('GenerateAccountEnd', () => {
  it('renders', async () => {
    const { getByText } = render(
      <Router>
        <GenerateAccountEnd
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
