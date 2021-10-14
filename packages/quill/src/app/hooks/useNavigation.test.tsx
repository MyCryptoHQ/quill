import type { DeepPartial } from '@quill/common';
import { setNavigationBack } from '@quill/common';
import { renderHook } from '@testing-library/react-hooks';
import type { FunctionComponent } from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { useNavigation } from '@hooks/useNavigation';
import { ROUTE_PATHS } from '@routing';
import type { ApplicationState } from '@store';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

describe('useNavigation', () => {
  it('sets and clears navigationBack', () => {
    const mockStore = createMockStore();
    const Wrapper: FunctionComponent = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );

    const { unmount } = renderHook(() => useNavigation(ROUTE_PATHS.MENU), { wrapper: Wrapper });
    expect(mockStore.getActions()).toContainEqual(setNavigationBack(ROUTE_PATHS.MENU));

    unmount();
    expect(mockStore.getActions()).toContainEqual(setNavigationBack(undefined));
  });
});
