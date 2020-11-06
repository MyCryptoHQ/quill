import { render } from '@testing-library/react';

import { ProvidersWrapper } from './providerWrapper';

export const simpleRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: ProvidersWrapper, ...options });

// re-export everything
export * from '@testing-library/react';
