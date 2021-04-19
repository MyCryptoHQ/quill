/* eslint-disable jest/expect-expect */
import type { TAddress } from '@mycrypto/wallets';
import { DEFAULT_ETH } from '@mycrypto/wallets';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { createWallet, getAddress } from '@api/crypto';
import { deleteAccountSecrets, saveAccountSecrets } from '@api/db';
import {
  addAccount,
  fetchAccounts,
  fetchFailed,
  removeAccount,
  setGeneratedAccount
} from '@common/store';
import { DEFAULT_MNEMONIC_INDEX } from '@config/derivation';
import { fAccount, fPrivateKey } from '@fixtures';
import type { SerializedWallet } from '@types';
import { WalletType } from '@types';

import { fetchAccountsWorker, generateAccountWorker, removeAccountWorker } from './accounts.sagas';

jest.mock('electron-store');

const wallet: SerializedWallet = {
  walletType: WalletType.PRIVATE_KEY,
  privateKey: fPrivateKey
};

describe('fetchAccountWorker()', () => {
  it('handles getting account address', () => {
    const input = { ...wallet, persistent: false };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .withState({ accounts: { accounts: [] } })
      .provide([[call.fn(getAddress), fAccount.address]])
      .call(getAddress, input)
      .put(addAccount({ ...fAccount, dPath: undefined, index: undefined }))
      .silentRun();
  });

  it('handles saving account secrets', () => {
    const input = { ...wallet, persistent: true };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .withState({ accounts: { accounts: [] } })
      .provide([[call.fn(getAddress), fAccount.address]])
      .call(getAddress, input)
      .call(saveAccountSecrets, input)
      .put(addAccount({ ...fAccount, dPath: undefined, index: undefined, persistent: true }))
      .silentRun();
  });

  it('overwrites existing account', () => {
    const input = { ...wallet, persistent: false };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .withState({ accounts: { accounts: [fAccount] } })
      .provide([[call.fn(getAddress), fAccount.address]])
      .call(getAddress, input)
      .put(removeAccount(fAccount))
      .put(addAccount({ ...fAccount, dPath: undefined, index: undefined }))
      .silentRun();
  });

  it('handles errors', () => {
    const input = { ...wallet, persistent: false };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .withState({ accounts: { accounts: [] } })
      .provide({
        call() {
          throw new Error('error');
        }
      })
      .call(getAddress, input)
      .put(fetchFailed('error'))
      .silentRun();
  });
});

describe('removeAccountWorker()', () => {
  it('handles deleting account secrets', () => {
    const input = { ...fAccount, persistent: true };
    return expectSaga(removeAccountWorker, removeAccount(input))
      .call(deleteAccountSecrets, input.uuid)
      .silentRun();
  });
});

describe('generateAccountWorker', () => {
  it('generates an account', () => {
    return expectSaga(generateAccountWorker)
      .provide({
        call(effect, next) {
          if (effect.fn === createWallet) {
            return 'foo bar';
          }

          if (effect.fn === getAddress) {
            return 'baz qux';
          }

          return next();
        }
      })
      .call(createWallet, WalletType.MNEMONIC)
      .call(getAddress, {
        walletType: WalletType.MNEMONIC,
        path: DEFAULT_ETH,
        index: DEFAULT_MNEMONIC_INDEX,
        mnemonicPhrase: 'foo bar'
      })
      .put(setGeneratedAccount({ mnemonicPhrase: 'foo bar', address: 'baz qux' as TAddress }))
      .silentRun();
  });
});
