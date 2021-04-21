import { ipcMain } from 'electron';
import { expectSaga } from 'redux-saga-test-plan';

import { addToHistory, addTransaction, dequeue, enqueue } from '@common/store';
import { IPC_CHANNELS } from '@config';
import { fRequestOrigin, fTxRequest } from '@fixtures';
import { TxResult } from '@types';
import { makeHistoryTx, makeQueueTx } from '@utils';

import { addTransactionWorker, denyCurrentTransactionWorker } from './transactions.sagas';

const request = { origin: fRequestOrigin, request: fTxRequest };

Date.now = jest.fn(() => 1607602775360);

jest.mock('electron-store');
jest.mock('electron', () => ({
  ipcMain: {
    emit: jest.fn()
  }
}));

describe('addTransactionWorker', () => {
  it('adds a transaction if the user is logged in', async () => {
    await expectSaga(addTransactionWorker, addTransaction(request))
      .withState({
        auth: {
          loggedIn: true
        }
      })
      .put(enqueue(request))
      .silentRun();

    await expectSaga(addTransactionWorker, addTransaction(request))
      .withState({
        auth: {
          loggedIn: false
        }
      })
      .not.put(enqueue(request))
      .silentRun();
  });
});

describe('denyCurrentTransactionWorker()', () => {
  it('handles denying a tx', () => {
    const tx = makeQueueTx(request);
    return expectSaga(denyCurrentTransactionWorker)
      .withState({ transactions: { queue: [tx], currentTransaction: tx } })
      .call(ipcMain.emit, IPC_CHANNELS.API, {
        id: fTxRequest.id,
        error: { code: '-32000', message: 'User denied transaction' }
      })
      .put(dequeue(tx))
      .put(addToHistory(makeHistoryTx(tx, TxResult.DENIED)))
      .silentRun();
  });
});
