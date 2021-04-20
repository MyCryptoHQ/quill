import { ipcMain } from 'electron';
import { expectSaga } from 'redux-saga-test-plan';

import { addToHistory, dequeue } from '@common/store';
import { IPC_CHANNELS } from '@config';
import { fRequestOrigin, fTxRequest } from '@fixtures';
import { TxResult } from '@types';
import { makeHistoryTx, makeQueueTx } from '@utils';

import { denyCurrentTransactionWorker } from './transactions.sagas';

const request = { origin: fRequestOrigin, request: fTxRequest };

Date.now = jest.fn(() => 1607602775360);

jest.mock('electron-store');
jest.mock('electron', () => ({
  ipcMain: {
    emit: jest.fn()
  }
}));

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
