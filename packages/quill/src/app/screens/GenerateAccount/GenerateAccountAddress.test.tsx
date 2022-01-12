import { translateRaw } from '@quill/common';
import type { DeepPartial } from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import type { ApplicationState } from '@store';

import { GenerateAccountAddress } from './GenerateAccountAddress';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (
  store: EnhancedStore<DeepPartial<ApplicationState>> = createMockStore(),
  onNext = jest.fn()
) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <GenerateAccountAddress
          onNext={onNext}
          onPrevious={jest.fn()}
          onReset={jest.fn()}
          flowHeader={<></>}
        />
      </Provider>
    </MemoryRouter>
  );
};

describe('GenerateAccountAddress', () => {
  it('renders', () => {
    const { getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: 'test test test test test test test test test test test ball',
            address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
          }
        }
      })
    );
    expect(getByText(translateRaw('NEW_ACCOUNT_TITLE'))).toBeDefined();
  });

  it('shows the address and mnemonic phrase', () => {
    const mnemonicPhrase = 'test test test test test test test test test test test ball';
    const address = '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf';

    const { getByText, getAllByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase,
            address
          }
        }
      })
    );

    expect(getAllByText(address)).toBeDefined();

    const button = getByText(translateRaw('CLICK_TO_SHOW'));
    fireEvent.click(button);

    expect(getAllByText(mnemonicPhrase)).toHaveLength(1);
  });

  it('dispatches addGeneratedAccount when clicking the button', () => {
    const onNext = jest.fn();
    const { getByText } = getComponent(
      createMockStore({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: 'test test test test test test test test test test test ball',
            address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
          }
        }
      }),
      onNext
    );

    const button = getByText(translateRaw('NEXT'));
    fireEvent.click(button);

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
