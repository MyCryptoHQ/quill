/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan';

import { ipcBridgeRenderer } from '@bridge';
import { fTxRequest } from '@fixtures';
import { TxHistoryResult } from '@types';
import { makeTx } from '@utils';

import slice, {
  addToHistory,
  denyCurrentTransactionWorker,
  dequeue,
  enqueue
} from './transactions.slice';

Date.now = jest.fn(() => 1607602775360);

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: { invoke: jest.fn() },
    api: { sendResponse: jest.fn(), subscribeToRequests: jest.fn() }
  }
}));

describe('TransactionsSlice', () => {
  it('enqueue(): adds item to queue', () => {
    const result = slice.reducer(
      { queue: [{ ...fTxRequest, id: 1 }], history: [] },
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
        ],
        history: []
      },
      dequeue()
    );
    expect(result.queue).toStrictEqual([{ ...fTxRequest, id: 2 }]);
  });

  it('addToTxHistory(): adds item to tx history', () => {
    const entry = { tx: makeTx(fTxRequest), result: TxHistoryResult.DENIED, timestamp: Date.now() };
    const result = slice.reducer(
      {
        queue: [],
        history: []
      },
      addToHistory(entry)
    );
    expect(result.history).toStrictEqual([entry]);
  });
});

describe('denyCurrentTransactionWorker()', () => {
  it('handles denying a tx', () => {
    return expectSaga(denyCurrentTransactionWorker)
      .withState({ transactions: { queue: [fTxRequest] } })
      .call(ipcBridgeRenderer.api.sendResponse, {
        id: fTxRequest.id,
        error: { code: '-32000', message: 'User denied transaction' }
      })
      .put(dequeue())
      .put(
        addToHistory({
          tx: makeTx(fTxRequest),
          timestamp: Date.now(),
          result: TxHistoryResult.DENIED
        })
      )
      .silentRun();
  });
});
