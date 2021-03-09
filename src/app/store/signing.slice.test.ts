/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { ipcBridgeRenderer } from '@bridge';
import { fPrivateKey, fSignedTx, fTxRequest } from '@fixtures';
import { CryptoRequestType, SerializedWallet, WalletType } from '@types';
import { makeTx } from '@utils';

import slice, { sign, signSuccess, signWorker } from './signing.slice';
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
    const result = slice.reducer({ isSigning: false }, sign({ wallet, tx }));
    expect(result.isSigning).toBe(true);
  });

  it('signSuccess(): sets signing to false', () => {
    const result = slice.reducer({ isSigning: true }, signSuccess());
    expect(result.isSigning).toBe(false);
  });
});

describe('signWorker()', () => {
  it('handles signing', () => {
    return expectSaga(
      signWorker,
      sign({
        wallet,
        tx
      })
    )
      .withState({ transactions: { queue: [fTxRequest], currentTransaction: fTxRequest } })
      .provide([[call.fn(ipcBridgeRenderer.crypto.invoke), fSignedTx]])
      .call(ipcBridgeRenderer.crypto.invoke, { type: CryptoRequestType.SIGN, wallet, tx })
      .put(signSuccess())
      .call(ipcBridgeRenderer.api.sendResponse, { id: fTxRequest.id, result: fSignedTx })
      .put(dequeue())
      .silentRun();
  });
});
