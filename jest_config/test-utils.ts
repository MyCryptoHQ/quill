import { render } from '@testing-library/react';

import { ProvidersWrapper } from './providersWrapper';

export const simpleRender = (ui: React.ReactElement, options?: Record<string, unknown>) =>
  render(ui, { wrapper: ProvidersWrapper, ...options });

// re-export everything
export * from '@testing-library/react';
