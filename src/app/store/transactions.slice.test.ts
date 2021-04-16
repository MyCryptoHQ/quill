/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan';

import { ipcBridgeRenderer } from '@bridge';
import { fRequestOrigin, fTxRequest } from '@fixtures';
import type { TUuid } from '@types';
import { TxResult } from '@types';
import { makeHistoryTx, makeQueueTx, makeTx } from '@utils';

import slice, {
  addToHistory,
  denyCurrentTransactionWorker,
  dequeue,
  enqueue,
  selectTransaction
} from './transactions.slice';

Date.now = jest.fn(() => 1607602775360);

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: { invoke: jest.fn() },
    api: { sendResponse: jest.fn(), subscribeToRequests: jest.fn() }
  }
}));

const request = { origin: fRequestOrigin, request: fTxRequest };

describe('TransactionsSlice', () => {
  it('enqueue(): adds item to queue', () => {
    const { uuid, ...tx } = makeQueueTx(request);
    const result = slice.reducer(
      { queue: [{ ...makeQueueTx(request), id: 1 }], history: [] },
      enqueue({ origin: fRequestOrigin, request: { ...fTxRequest, id: 2 } })
    );
    expect(result.queue).toStrictEqual([
      expect.objectContaining({ ...tx, id: 1 }),
      expect.objectContaining({ ...tx, id: 2 })
    ]);
  });

  it('dequeue(): removes item from queue', () => {
    const removeUuid = 'uuid' as TUuid;
    const { uuid, ...tx } = makeQueueTx(request);
    const removeTx = { ...tx, uuid: removeUuid, id: 1 };
    const result = slice.reducer(
      {
        queue: [removeTx, { ...makeQueueTx(request), id: 2 }],
        history: []
      },
      dequeue(removeTx)
    );
    expect(result.queue).toStrictEqual([expect.objectContaining({ ...tx, id: 2 })]);
  });

  it('addToTxHistory(): adds item to tx history', () => {
    const entry = {
      uuid: 'uuid' as TUuid,
      tx: makeTx(fTxRequest),
      result: TxResult.DENIED,
      timestamp: Date.now(),
      origin: fRequestOrigin
    };
    const result = slice.reducer(
      {
        queue: [],
        history: []
      },
      addToHistory(entry)
    );
    expect(result.history).toStrictEqual([entry]);
  });

  it('selectTransaction(): sets selected transaction', () => {
    const entry = {
      uuid: 'uuid' as TUuid,
      tx: makeTx(fTxRequest),
      result: TxResult.DENIED,
      timestamp: Date.now(),
      origin: fRequestOrigin
    };
    const result = slice.reducer(
      {
        queue: [],
        history: [],
        currentTransaction: undefined
      },
      selectTransaction(entry)
    );
    expect(result.currentTransaction).toStrictEqual(entry);
  });
});

describe('denyCurrentTransactionWorker()', () => {
  it('handles denying a tx', () => {
    const tx = makeQueueTx(request);
    return expectSaga(denyCurrentTransactionWorker)
      .withState({ transactions: { queue: [tx], currentTransaction: tx } })
      .call(ipcBridgeRenderer.api.sendResponse, {
        id: fTxRequest.id,
        error: { code: '-32000', message: 'User denied transaction' }
      })
      .put(dequeue(tx))
      .put(addToHistory(makeHistoryTx(tx, TxResult.DENIED)))
      .silentRun();
  });
});
