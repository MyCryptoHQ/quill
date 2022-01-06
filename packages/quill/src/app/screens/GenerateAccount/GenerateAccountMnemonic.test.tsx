import { generateAccount, translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { GenerateAccountMnemonic } from '@screens/GenerateAccount/GenerateAccountMnemonic';
import type { ApplicationState } from '@store';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (
  store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore(),
  onNext = jest.fn()
) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <GenerateAccountMnemonic
          onNext={onNext}
          onPrevious={jest.fn()}
          onReset={jest.fn()}
          flowHeader={<></>}
        />
      </Provider>
    </MemoryRouter>
  );
};

describe('GenerateAccountMnemonic', () => {
  it('renders', () => {
    const { getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: 'foo bar'
          }
        }
      })
    );
    expect(getByText(translateRaw('CREATE_MNEMONIC_PHRASE_TITLE'))).toBeDefined();
  });

  it('dispatches generateAccount on first render', async () => {
    const store = createMockStore({
      accounts: {}
    });

    getComponent(store);
    expect(store.getActions()).toContainEqual(generateAccount());
  });

  it('shows the generated mnemonic phrase', () => {
    const store = createMockStore({
      accounts: {
        generatedAccount: {
          mnemonicPhrase: 'foo bar baz'
        }
      }
    });

    const { getByText } = getComponent(store);
    expect(getByText('foo')).toBeDefined();
    expect(getByText('bar')).toBeDefined();
    expect(getByText('baz')).toBeDefined();
  });

  it('calls onNext when clicking the button', () => {
    const onNext = jest.fn();

    const { getByText } = getComponent(
      createMockStore({
        accounts: {}
      }),
      onNext
    );

    const button = getByText(translateRaw('CONFIRM_MNEMONIC_PHRASE'));
    fireEvent.click(button);

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
