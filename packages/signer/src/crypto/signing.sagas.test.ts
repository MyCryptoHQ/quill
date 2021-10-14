import {
  dequeue,
  makeQueueTx,
  makeTx,
  sign,
  signFailed,
  signSuccess,
  WalletType
} from '@quill/common';
import type { SerializedWallet } from '@quill/common';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { reply } from '@api/ws.slice';
import { fPrivateKey, fRequestOrigin, fSignedTx, fTxRequest } from '@fixtures';

import { signTransaction } from './crypto';
import { signWorker } from './signing.sagas';

jest.mock('electron-store');
jest.mock('electron', () => ({
  ipcMain: {
    emit: jest.fn()
  }
}));

const wallet = {
  walletType: WalletType.PRIVATE_KEY,
  privateKey: fPrivateKey
} as SerializedWallet;
const tx = makeTx(fTxRequest);

describe('signWorker()', () => {
  it('handles signing', () => {
    const queueTx = makeQueueTx({ origin: fRequestOrigin, request: fTxRequest });
    return expectSaga(
      signWorker,
      sign({
        wallet,
        tx
      })
    )
      .withState({ transactions: { queue: [queueTx], currentTransaction: queueTx } })
      .provide([[call.fn(signTransaction), fSignedTx]])
      .call(signTransaction, wallet, tx)
      .put(
        reply({
          id: queueTx.id,
          result: fSignedTx
        })
      )
      .put(signSuccess())
      .put(dequeue(queueTx))
      .silentRun();
  });

  it('does not call reply for offline transactions', async () => {
    const queueTx = makeQueueTx({ origin: fRequestOrigin, request: fTxRequest }, true);
    await expectSaga(
      signWorker,
      sign({
        wallet,
        tx
      })
    )
      .withState({ transactions: { queue: [queueTx], currentTransaction: queueTx } })
      .provide([[call.fn(signTransaction), fSignedTx]])
      .call(signTransaction, wallet, tx)
      .not.put(
        reply({
          id: queueTx.id,
          result: fSignedTx
        })
      )
      .put(signSuccess())
      .put(dequeue(queueTx))
      .silentRun();
  });

  it('handles signing errors', () => {
    const queueTx = makeQueueTx({ origin: fRequestOrigin, request: fTxRequest });
    return expectSaga(
      signWorker,
      sign({
        wallet,
        tx
      })
    )
      .withState({ transactions: { queue: [queueTx], currentTransaction: queueTx } })
      .provide({
        call() {
          throw new Error('error');
        }
      })
      .call(signTransaction, wallet, tx)
      .put(signFailed('error'))
      .silentRun();
  });
});
