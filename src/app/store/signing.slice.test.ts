/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { ipcBridgeRenderer } from '@bridge';
import { fPrivateKey, fRequestOrigin, fSignedTx, fTxRequest } from '@fixtures';
import type { SerializedWallet } from '@types';
import { CryptoRequestType, WalletType } from '@types';
import { makeQueueTx, makeTx } from '@utils';

import slice, { sign, signFailed, signSuccess, signWorker } from './signing.slice';
import { dequeue } from './transactions.slice';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: { invoke: jest.fn() },
    api: { sendResponse: jest.fn() }
  }
}));

const wallet = {
  walletType: WalletType.PRIVATE_KEY,
  privateKey: fPrivateKey
} as SerializedWallet;
const tx = makeTx(fTxRequest);

describe('SigningSlice', () => {
  it('sign(): sets signing to true', () => {
    const result = slice.reducer({ isSigning: false, error: undefined }, sign({ wallet, tx }));
    expect(result.isSigning).toBe(true);
  });

  it('signSuccess(): sets signing to false', () => {
    const result = slice.reducer({ isSigning: true, error: undefined }, signSuccess());
    expect(result.isSigning).toBe(false);
  });

  it('signFailed(): sets error message and signing', () => {
    const error = 'error';
    const result = slice.reducer({ isSigning: true, error: undefined }, signFailed(error));
    expect(result.isSigning).toBe(false);
    expect(result.error).toBe(error);
  });
});

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
      .provide([[call.fn(ipcBridgeRenderer.crypto.invoke), fSignedTx]])
      .call(ipcBridgeRenderer.crypto.invoke, { type: CryptoRequestType.SIGN, wallet, tx })
      .put(signSuccess())
      .call(ipcBridgeRenderer.api.sendResponse, { id: fTxRequest.id, result: fSignedTx })
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
      .call(ipcBridgeRenderer.crypto.invoke, { type: CryptoRequestType.SIGN, wallet, tx })
      .put(signFailed('error'))
      .silentRun();
  });
});
