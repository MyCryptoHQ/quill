import {
  addToHistory,
  dequeue,
  enqueue,
  makeHistoryTx,
  makeQueueTx,
  MAX_QUEUE_LENGTH,
  TxResult
} from '@quill/common';
import { expectSaga } from 'redux-saga-test-plan';

import { fRequestOrigin, fTxRequest } from '@fixtures';

import { addTransactionWorker, denyCurrentTransactionWorker } from './transactions.sagas';
import { reply, requestSignTransaction } from './ws.slice';

const request = { origin: fRequestOrigin, request: fTxRequest };

Date.now = jest.fn(() => 1607602775360);

jest.mock('uuid', () => ({ v4: jest.fn() }));
jest.mock('electron-store');
jest.mock('electron', () => ({
  ipcMain: {
    emit: jest.fn()
  }
}));

describe('addTransactionWorker', () => {
  it('adds a transaction if the user is logged in', async () => {
    await expectSaga(addTransactionWorker, requestSignTransaction(request))
      .withState({
        auth: {
          loggedIn: true
        },
        transactions: { queue: [] }
      })
      .put(enqueue(makeQueueTx(request)))
      .silentRun();

    await expectSaga(addTransactionWorker, requestSignTransaction(request))
      .withState({
        auth: {
          loggedIn: false
        },
        transactions: { queue: [] }
      })
      .not.put(enqueue(makeQueueTx(request)))
      .silentRun();
  });

  it('fails if queue length limit met', async () => {
    await expectSaga(addTransactionWorker, requestSignTransaction(request))
      .withState({
        auth: {
          loggedIn: true
        },
        transactions: { queue: new Array(MAX_QUEUE_LENGTH).fill(makeQueueTx(request)) }
      })
      .put(
        reply({
          id: request.request.id,
          // @todo Decide what error message to use
          error: { code: '-32600', message: 'Invalid request' }
        })
      )
      .silentRun();
  });
});

describe('denyCurrentTransactionWorker()', () => {
  it('handles denying a tx', () => {
    const tx = makeQueueTx(request);
    return expectSaga(denyCurrentTransactionWorker)
      .withState({ transactions: { queue: [tx], currentTransaction: tx } })
      .put(
        reply({
          id: fTxRequest.id,
          error: { code: '-32000', message: 'User denied transaction' }
        })
      )
      .put(dequeue(tx))
      .put(addToHistory(makeHistoryTx(tx, TxResult.DENIED)))
      .silentRun();
  });
});
