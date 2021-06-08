import { parse } from '@ethersproject/transactions';
import type { EnhancedStore } from '@reduxjs/toolkit';
import {
  enqueue,
  makeQueueTx,
  setNavigationBack,
  toTransactionRequest,
  translateRaw
} from '@signer/common';
import type { DeepPartial } from '@signer/common';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { push } from 'connected-react-router';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';
import configureStore from 'redux-mock-store';

import { fAccounts, fRawTransaction } from '@fixtures';
import { ROUTE_PATHS } from '@routing';
import { LoadTransaction } from '@screens/LoadTransaction';
import type { ApplicationState } from '@store';

Date.now = jest.fn(() => 1607602775360);

jest.mock('uuid', () => ({ v4: jest.fn() }));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>>) => {
  return render(
    <Provider store={store}>
      <LoadTransaction />
    </Provider>
  );
};

describe('LoadTransaction', () => {
  it('validates the form inputs', () => {
    const mockStore = createMockStore({
      accounts: {
        accounts: fAccounts
      }
    });

    const { getByText, findByText } = getComponent(mockStore);

    const button = getByText(translateRaw('LOAD_TRANSACTION'));
    fireEvent.click(button);

    expect(mockStore.getActions()).toHaveLength(1);
    expect(findByText(translateRaw('ACCOUNT_EMPTY'))).toBeDefined();
    expect(findByText(translateRaw('NOT_RAW_TRANSACTION'))).toBeDefined();
  });

  it('submits the form', async () => {
    const mockStore = createMockStore({
      accounts: {
        accounts: fAccounts
      }
    });

    const { getByText, getByLabelText } = getComponent(mockStore);

    const selector = getByText(translateRaw('SELECT_ACCOUNT'));
    selectEvent.openMenu(selector);

    const account = getByText(fAccounts[1].address);
    fireEvent.click(account);

    const input = getByLabelText(translateRaw('RAW_TRANSACTION_DETAILS'));
    fireEvent.change(input, { target: { value: fRawTransaction } });

    const button = getByText(translateRaw('LOAD_TRANSACTION'));
    fireEvent.click(button);

    const queueTransaction = makeQueueTx(
      toTransactionRequest({
        ...parse(fRawTransaction),
        from: fAccounts[1].address
      }),
      true
    );

    await waitFor(() => expect(mockStore.getActions()).toContainEqual(enqueue(queueTransaction)));
    expect(mockStore.getActions()).toContainEqual(push(ROUTE_PATHS.HOME));
  });

  it('sets navigationBack', () => {
    const mockStore = createMockStore({
      accounts: {
        accounts: []
      }
    });

    const { unmount } = getComponent(mockStore);
    unmount();

    expect(mockStore.getActions()).toStrictEqual([
      setNavigationBack(ROUTE_PATHS.MENU),
      setNavigationBack(undefined)
    ]);
  });
});
