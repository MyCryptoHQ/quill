import { expectSaga } from 'redux-saga-test-plan';

import { addToHistory, dequeue, enqueue } from '@common/store';
import { update } from '@common/store/transactions.slice';
import { fRequestOrigin, fTxRequest } from '@fixtures';
import { TxResult } from '@types';
import { addHexPrefix, bigify, makeHistoryTx, makeQueueTx } from '@utils';

import {
  addTransactionWorker,
  denyCurrentTransactionWorker,
  nonceConflictWorker
} from './transactions.sagas';
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
        }
      })
      .put(enqueue(makeQueueTx(request)))
      .silentRun();

    await expectSaga(addTransactionWorker, requestSignTransaction(request))
      .withState({
        auth: {
          loggedIn: false
        }
      })
      .not.put(enqueue(makeQueueTx(request)))
      .silentRun();
  });
});

describe('nonceConflictWorker', () => {
  it('doesnt do anything if no other transactions exist', async () => {
    const queueTx = makeQueueTx(request);
    await expectSaga(nonceConflictWorker, enqueue(queueTx))
      .withState({
        transactions: {
          queue: [],
          history: []
        }
      })
      .not.put(update(queueTx))
      .silentRun();
  });

  it('doesnt do anything if no issues found', async () => {
    const queueTx = makeQueueTx(request);
    await expectSaga(nonceConflictWorker, enqueue(queueTx))
      .withState({
        transactions: {
          queue: [queueTx, { ...queueTx, uuid: 'tx2', tx: { ...queueTx.tx, nonce: '0x7' } }],
          history: []
        }
      })
      .not.put(update(queueTx))
      .silentRun();
  });

  it('updates nonce if conflict detected', async () => {
    const tx1 = { ...makeHistoryTx(makeQueueTx(request), TxResult.APPROVED), uuid: 'tx1' };
    const tx2 = makeQueueTx(request);
    await expectSaga(nonceConflictWorker, enqueue(tx2))
      .withState({
        transactions: {
          queue: [tx2],
          history: [tx1]
        }
      })
      .put(
        update({
          ...tx2,
          adjustedNonce: true,
          tx: { ...tx2.tx, nonce: addHexPrefix(bigify(tx1.tx.nonce).plus(1).toString(16)) }
        })
      )
      .silentRun();
  });

  it('updates nonce if lower than account nonce detected', async () => {
    const tx1 = { ...makeHistoryTx(makeQueueTx(request), TxResult.APPROVED), uuid: 'tx1' };
    const tx2 = makeQueueTx(request);
    const newTx2 = { ...tx2, tx: { ...tx2.tx, nonce: '0x1' } };
    await expectSaga(nonceConflictWorker, enqueue(tx2))
      .withState({
        transactions: {
          queue: [newTx2],
          history: [tx1]
        }
      })
      .put(
        update({
          ...newTx2,
          adjustedNonce: true,
          tx: { ...newTx2.tx, nonce: addHexPrefix(bigify(tx1.tx.nonce).plus(1).toString(16)) }
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
