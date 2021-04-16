import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { LinkApp } from '@app/components';
import { Trans } from '@translations';

describe('Trans', () => {
  it('replaces variables', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Trans
          id="FORGOT_PASSWORD_HELP"
          variables={{
            $link: () => (
              <LinkApp href="#" isExternal={false}>
                here
              </LinkApp>
            )
          }}
        />
      </MemoryRouter>
    );
    expect(getByText('here', { exact: false })).toBeDefined();
  });
});
