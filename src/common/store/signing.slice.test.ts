/* eslint-disable jest/expect-expect */
import { fPrivateKey, fTxRequest } from '@fixtures';
import type { SerializedWallet } from '@types';
import { WalletType } from '@types';
import { makeTx } from '@utils';

import slice, { sign, signFailed, signSuccess } from './signing.slice';

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
