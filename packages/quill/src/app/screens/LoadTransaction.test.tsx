import { parse } from '@ethersproject/transactions';
import type { DeepPartial } from '@quill/common';
import {
  enqueue,
  makeQueueTx,
  setNavigationBack,
  toTransactionRequest,
  translateRaw
} from '@quill/common';
import type { EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import type { Result } from '@zxing/library';
import { push } from 'connected-react-router';
import { QrReader } from 'react-qr-reader';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { theme } from '@app/theme';
import { fAccounts, fRawTransaction } from '@fixtures';
import { ROUTE_PATHS } from '@routing';
import { LoadTransaction } from '@screens/LoadTransaction';
import type { ApplicationState } from '@store';

jest.mock('@app/utils/camera', () => ({
  hasCamera: jest.fn().mockResolvedValue(true)
}));

jest.mock('react-qr-reader', () => ({
  QrReader: jest.fn().mockReturnValue(null)
}));

Date.now = jest.fn(() => 1607602775360);

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

const getComponent = (store: EnhancedStore<DeepPartial<ApplicationState>>) => {
  return render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <LoadTransaction />
      </Provider>
    </ThemeProvider>
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

  it('shows the QR scanner', async () => {
    const mockStore = createMockStore({
      accounts: {
        accounts: []
      }
    });

    const { getByText, getByTestId } = getComponent(mockStore);

    // Need to wait for a bit for the scanner button to become enabled
    await new Promise((resolve) => setTimeout(resolve, 100));

    const button = getByText(translateRaw('SCAN_QR'));
    fireEvent.click(button);

    expect(getByTestId('scanner')).toBeDefined();

    const mock = QrReader as jest.MockedFunction<typeof QrReader>;
    const handleDecode = mock.mock.calls[0][0].onResult!;

    handleDecode({ getText: () => fRawTransaction } as Result);

    expect(() => getByTestId('scanner')).toThrow();
  });
});
