import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { goBack } from 'connected-react-router';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { previousFlow, resetFlow } from '@common/store';
import type { FlowProps } from '@components';
import { Flow } from '@components';
import type { ApplicationState } from '@store';
import { theme } from '@theme';
import type { DeepPartial } from '@types';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (
  props: FlowProps,
  store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore()
) => {
  return render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Flow {...props} />
      </Provider>
    </ThemeProvider>
  );
};

describe('Flow', () => {
  it('renders', () => {
    const { getByText } = getComponent(
      {
        components: [
          {
            component: () => <>Foo</>
          }
        ],
        onDone: jest.fn()
      },
      createMockStore({ flow: 0 })
    );
    expect(getByText('Foo').textContent).toBeDefined();
  });

  it('shows the current step', () => {
    const { getByText, getAllByTestId } = getComponent(
      {
        components: [
          {
            component: ({ flowHeader }) => <>{flowHeader} Foo</>
          },
          {
            component: ({ flowHeader }) => <>{flowHeader} Bar</>
          }
        ],
        onDone: jest.fn()
      },
      createMockStore({ flow: 1 })
    );

    expect(getByText('Bar')).toBeDefined();
    expect(getAllByTestId('active-item')).toHaveLength(1);
    expect(getAllByTestId('item')).toHaveLength(1);
  });

  it('dispatches goBack when calling onPrevious on the first step', () => {
    const store = createMockStore({ flow: 0 });
    const { getByTestId } = getComponent(
      {
        components: [
          {
            component: ({ onPrevious }) => (
              <>
                Foo
                <button data-testid="previous-button" onClick={onPrevious} />
              </>
            )
          }
        ],
        onDone: jest.fn()
      },
      store
    );

    const button = getByTestId('previous-button');
    fireEvent.click(button);

    expect(store.getActions()).toContainEqual(goBack());
  });

  it('goes to the previous step when calling onPrevious', () => {
    const store = createMockStore({ flow: 1 });
    const { getByTestId } = getComponent(
      {
        components: [
          {
            component: () => <>Foo</>
          },
          {
            component: ({ onPrevious }) => (
              <>
                Bar
                <button data-testid="previous-button" onClick={onPrevious} />
              </>
            )
          }
        ],
        onDone: jest.fn()
      },
      store
    );

    const previousButton = getByTestId('previous-button');
    fireEvent.click(previousButton);

    expect(store.getActions()).toContainEqual(previousFlow());
  });

  it('goes to the first step when calling onReset', () => {
    const store = createMockStore({ flow: 1 });
    const { getByTestId } = getComponent(
      {
        components: [
          {
            component: () => <>Foo</>
          },
          {
            component: ({ onReset }) => (
              <>
                Bar
                <button data-testid="reset-button" onClick={onReset} />
              </>
            )
          }
        ],
        onDone: jest.fn()
      },
      store
    );

    const resetButton = getByTestId('reset-button');
    fireEvent.click(resetButton);

    expect(store.getActions()).toContainEqual(resetFlow());
  });

  it('calls onDone when done', () => {
    const onDone = jest.fn();
    const store = createMockStore({ flow: 1 });
    getComponent(
      {
        components: [
          {
            component: () => <>Foo</>
          }
        ],
        onDone
      },
      store
    );

    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
