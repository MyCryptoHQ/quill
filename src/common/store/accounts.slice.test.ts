import { fAccount, fPrivateKey } from '@fixtures';
import type { SerializedWallet, TAddress } from '@types';
import { WalletType } from '@types';

import slice, {
  addAccount,
  fetchAccounts,
  fetchFailed,
  fetchReset,
  removeAccount,
  setGeneratedAccount,
  updateAccount
} from './accounts.slice';

const wallet: SerializedWallet = {
  walletType: WalletType.PRIVATE_KEY,
  privateKey: fPrivateKey
};

describe('AccountSlice', () => {
  describe('addAccount()', () => {
    it('adds account to state', () => {
      const result = slice.reducer({ accounts: [], isFetching: false }, addAccount(fAccount));
      expect(result.accounts).toStrictEqual([fAccount]);
    });
  });

  describe('removeAccount()', () => {
    it('removes account from state', () => {
      const result = slice.reducer(
        { accounts: [fAccount], isFetching: false },
        removeAccount(fAccount)
      );
      expect(result.accounts).toStrictEqual([]);
    });
  });

  describe('updateAccount()', () => {
    it('updates account in state', () => {
      const newAccount = { ...fAccount, label: 'new label' };
      const result = slice.reducer(
        { accounts: [fAccount], isFetching: false },
        updateAccount(newAccount)
      );
      expect(result.accounts).toStrictEqual([newAccount]);
    });
  });

  describe('fetchAccount()', () => {
    it('sets isFetching to true', () => {
      const result = slice.reducer(
        { accounts: [], isFetching: false },
        fetchAccounts([{ ...wallet, persistent: true }])
      );
      expect(result.isFetching).toBe(true);
    });
  });

  describe('fetchFailed()', () => {
    it('sets error', () => {
      const error = 'error';
      const result = slice.reducer({ accounts: [], isFetching: false }, fetchFailed(error));
      expect(result.fetchError).toBe(error);
    });
  });

  describe('fetchReset()', () => {
    it('resets fetch state', () => {
      const result = slice.reducer(
        { accounts: [], isFetching: true, fetchError: 'foo' },
        fetchReset()
      );
      expect(result.fetchError).toBeUndefined();
      expect(result.isFetching).toBe(false);
    });
  });

  describe('setGeneratedAccount()', () => {
    it('sets generated account', () => {
      const account = {
        mnemonicPhrase: 'foo',
        address: 'bar' as TAddress
      };

      const result = slice.reducer(
        { accounts: [], isFetching: false },
        setGeneratedAccount(account)
      );
      expect(result.generatedAccount).toBe(account);
    });
  });
});
