import { translateRaw } from '@quill/common';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ErrorBoundary } from './ErrorBoundary';

const getComponent = (children: ReactNode) => {
  return render(<ErrorBoundary>{children}</ErrorBoundary>);
};

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    const { getByText } = getComponent(<>foo</>);
    expect(getByText('foo')).toBeDefined();
  });

  it('renders error page in case of errors', () => {
    const Throws = () => {
      throw new Error('Oh no!');
    };
    const { getByText } = getComponent(<Throws />);
    expect(getByText(translateRaw('SOMETHING_WENT_WRONG'))).toBeDefined();
  });
});
