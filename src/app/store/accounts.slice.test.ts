/* eslint-disable jest/expect-expect */
import { DEFAULT_ETH } from '@mycrypto/wallets';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { ipcBridgeRenderer } from '@bridge';
import { DEFAULT_MNEMONIC_INDEX } from '@config/derivation';
import { fAccount, fPrivateKey } from '@fixtures';
import { CryptoRequestType, DBRequestType, SerializedWallet, TAddress, WalletType } from '@types';

import slice, {
  addAccount,
  fetchAccounts,
  fetchAccountsWorker,
  fetchFailed,
  fetchReset,
  generateAccountWorker,
  removeAccount,
  removeAccountWorker,
  setGeneratedAccount,
  updateAccount
} from './account.slice';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    crypto: { invoke: jest.fn() },
    db: { invoke: jest.fn() }
  }
}));

const wallet: SerializedWallet = {
  walletType: WalletType.PRIVATE_KEY,
  privateKey: fPrivateKey
};

describe('AccountSlice', () => {
  it('addAccount(): adds account to state', () => {
    const result = slice.reducer({ accounts: [], isFetching: false }, addAccount(fAccount));
    expect(result.accounts).toStrictEqual([fAccount]);
  });

  it('removeAccount(): removes account from state', () => {
    const result = slice.reducer(
      { accounts: [fAccount], isFetching: false },
      removeAccount(fAccount)
    );
    expect(result.accounts).toStrictEqual([]);
  });

  it('updateAccount(): updates account in state', () => {
    const newAccount = { ...fAccount, label: 'new label' };
    const result = slice.reducer(
      { accounts: [fAccount], isFetching: false },
      updateAccount(newAccount)
    );
    expect(result.accounts).toStrictEqual([newAccount]);
  });

  it('fetchAccount(): sets isFetching to true', () => {
    const result = slice.reducer(
      { accounts: [], isFetching: false },
      fetchAccounts([{ ...wallet, persistent: true }])
    );
    expect(result.isFetching).toBe(true);
  });

  it('fetchFailed(): sets error', () => {
    const error = 'error';
    const result = slice.reducer({ accounts: [], isFetching: false }, fetchFailed(error));
    expect(result.fetchError).toBe(error);
  });

  it('fetchReset(): resets fetch state', () => {
    const result = slice.reducer(
      { accounts: [], isFetching: true, fetchError: 'foo' },
      fetchReset()
    );
    expect(result.fetchError).toBeUndefined();
    expect(result.isFetching).toBe(false);
  });

  it('setGeneratedAccount(): sets generated account', () => {
    const account = {
      mnemonicPhrase: 'foo',
      address: 'bar' as TAddress
    };

    const result = slice.reducer({ accounts: [], isFetching: false }, setGeneratedAccount(account));
    expect(result.generatedAccount).toBe(account);
  });
});

describe('fetchAccountWorker()', () => {
  it('handles getting account address', () => {
    const input = { ...wallet, persistent: false };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .withState({ accounts: { accounts: [] } })
      .provide([[call.fn(ipcBridgeRenderer.crypto.invoke), fAccount.address]])
      .call(ipcBridgeRenderer.crypto.invoke, { type: CryptoRequestType.GET_ADDRESS, wallet: input })
      .put(addAccount({ ...fAccount, dPath: undefined }))
      .silentRun();
  });

  it('handles saving account secrets', () => {
    const input = { ...wallet, persistent: true };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .withState({ accounts: { accounts: [] } })
      .provide([[call.fn(ipcBridgeRenderer.crypto.invoke), fAccount.address]])
      .call(ipcBridgeRenderer.crypto.invoke, { type: CryptoRequestType.GET_ADDRESS, wallet: input })
      .call(ipcBridgeRenderer.db.invoke, {
        type: DBRequestType.SAVE_ACCOUNT_SECRETS,
        wallet: input
      })
      .put(addAccount({ ...fAccount, dPath: undefined, persistent: true }))
      .silentRun();
  });

  it('overwrites existing account', () => {
    const input = { ...wallet, persistent: false };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .withState({ accounts: { accounts: [fAccount] } })
      .provide([[call.fn(ipcBridgeRenderer.crypto.invoke), fAccount.address]])
      .call(ipcBridgeRenderer.crypto.invoke, { type: CryptoRequestType.GET_ADDRESS, wallet: input })
      .put(removeAccount(fAccount))
      .put(addAccount({ ...fAccount, dPath: undefined }))
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
      .call(ipcBridgeRenderer.crypto.invoke, { type: CryptoRequestType.GET_ADDRESS, wallet: input })
      .put(fetchFailed('error'))
      .silentRun();
  });
});

describe('removeAccountWorker()', () => {
  it('handles deleting account secrets', () => {
    const input = { ...fAccount, persistent: true };
    return expectSaga(removeAccountWorker, removeAccount(input))
      .call(ipcBridgeRenderer.db.invoke, {
        type: DBRequestType.DELETE_ACCOUNT_SECRETS,
        uuid: input.uuid
      })
      .silentRun();
  });
});

describe('generateAccountWorker', () => {
  it('generates an account', () => {
    return expectSaga(generateAccountWorker)
      .provide({
        call(effect, next) {
          if (effect.fn === ipcBridgeRenderer.crypto.invoke) {
            const [{ type }] = effect.args;
            if (type === 'CREATE_WALLET') {
              return 'foo bar';
            }

            if (type === 'GET_ADDRESS') {
              return 'baz qux';
            }
          }

          return next();
        }
      })
      .call(ipcBridgeRenderer.crypto.invoke, {
        type: CryptoRequestType.CREATE_WALLET,
        wallet: WalletType.MNEMONIC
      })
      .call(ipcBridgeRenderer.crypto.invoke, {
        type: CryptoRequestType.GET_ADDRESS,
        wallet: {
          walletType: WalletType.MNEMONIC,
          path: DEFAULT_ETH,
          index: DEFAULT_MNEMONIC_INDEX,
          mnemonicPhrase: 'foo bar'
        }
      })
      .put(setGeneratedAccount({ mnemonicPhrase: 'foo bar', address: 'baz qux' as TAddress }))
      .silentRun();
  });
});
