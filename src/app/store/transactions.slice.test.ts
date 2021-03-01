/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan';

import { ipcBridgeRenderer } from '@bridge';
import { fTxRequest } from '@fixtures';

import slice, {
  denyCurrentTransaction,
  denyCurrentTransactionWorker,
  dequeue,
  enqueue
} from './transactions.slice';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: { invoke: jest.fn() },
    api: { sendResponse: jest.fn(), subscribeToRequests: jest.fn() }
  }
}));

describe('TransactionsSlice', () => {
  it('enqueue(): adds item to queue', () => {
    const result = slice.reducer(
      { queue: [{ ...fTxRequest, id: 1 }] },
      enqueue({ ...fTxRequest, id: 2 })
    );
    expect(result.queue).toStrictEqual([
      { ...fTxRequest, id: 1 },
      { ...fTxRequest, id: 2 }
    ]);
  });

  it('dequeue(): removes item from queue', () => {
    const result = slice.reducer(
      {
        queue: [
          { ...fTxRequest, id: 1 },
          { ...fTxRequest, id: 2 }
        ]
      },
      dequeue()
    );
    expect(result.queue).toStrictEqual([{ ...fTxRequest, id: 2 }]);
  });
});

describe('denyCurrentTransactionWorker()', () => {
  it('handles denying a tx', () => {
    return expectSaga(denyCurrentTransactionWorker, denyCurrentTransaction(fTxRequest))
      .withState({ transactions: { queue: [fTxRequest] } })
      .call(ipcBridgeRenderer.api.sendResponse, {
        id: fTxRequest.id,
        error: { code: '-32000', message: 'User denied transaction' }
      })
      .put(dequeue())
      .silentRun();
  });
});
