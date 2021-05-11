import { DEFAULT_ETH, getFullPath } from '@mycrypto/wallets';

import { fAccount, fMnemonicPhrase, fPrivateKey } from '@fixtures';
import type { SerializedWallet, TAddress } from '@types';
import { WalletType } from '@types';

import slice, {
  addAccount,
  clearAddAccounts,
  fetchAccounts,
  fetchAddresses,
  fetchFailed,
  fetchReset,
  removeAccount,
  setAddAccounts,
  setAddresses,
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
      const result = slice.reducer(
        { accounts: [], addresses: [], isFetching: false },
        addAccount(fAccount)
      );
      expect(result.accounts).toStrictEqual([fAccount]);
    });
  });

  describe('removeAccount()', () => {
    it('removes account from state', () => {
      const result = slice.reducer(
        { accounts: [fAccount], addresses: [], isFetching: false },
        removeAccount(fAccount)
      );
      expect(result.accounts).toStrictEqual([]);
    });
  });

  describe('updateAccount()', () => {
    it('updates account in state', () => {
      const newAccount = { ...fAccount, label: 'new label' };
      const result = slice.reducer(
        { accounts: [fAccount], addresses: [], isFetching: false },
        updateAccount(newAccount)
      );
      expect(result.accounts).toStrictEqual([newAccount]);
    });
  });

  describe('setAddAccounts', () => {
    it('sets accounts to add', () => {
      const add = {
        accounts: [
          {
            walletType: WalletType.PRIVATE_KEY as const,
            address: fAccount.address,
            privateKey: fPrivateKey
          }
        ],
        secret: fPrivateKey
      };

      const result = slice.reducer(
        { accounts: [], addresses: [], isFetching: false },
        setAddAccounts(add)
      );
      expect(result.add).toStrictEqual(add);
    });
  });

  describe('clearAddAccounts', () => {
    it('clears accounts to add', () => {
      const result = slice.reducer(
        {
          accounts: [],
          addresses: [],
          isFetching: false,
          add: {
            accounts: [
              {
                walletType: WalletType.PRIVATE_KEY as const,
                address: fAccount.address,
                privateKey: fPrivateKey
              }
            ],
            secret: fPrivateKey
          }
        },
        clearAddAccounts()
      );
      expect(result.add).toBeUndefined();
    });
  });

  describe('setAddresses', () => {
    it('sets the addresses and resets the fetch state', () => {
      const result = slice.reducer(
        { accounts: [], addresses: [], isFetching: true, fetchError: 'foo' },
        setAddresses([{ dPath: getFullPath(DEFAULT_ETH, 0), address: 'foo' as TAddress, index: 0 }])
      );

      expect(result.isFetching).toBe(false);
      expect(result.fetchError).toBeUndefined();
      expect(result.addresses).toStrictEqual([
        {
          dPath: getFullPath(DEFAULT_ETH, 0),
          address: 'foo' as TAddress,
          index: 0
        }
      ]);
    });
  });

  describe('fetchAccount()', () => {
    it('sets isFetching to true', () => {
      const result = slice.reducer(
        { accounts: [], addresses: [], isFetching: false },
        fetchAccounts([wallet])
      );
      expect(result.isFetching).toBe(true);
    });
  });

  describe('fetchAddresses', () => {
    it('sets isFetching to true and clears the fetch error', () => {
      const result = slice.reducer(
        { accounts: [], addresses: [], isFetching: false, fetchError: 'error' },
        fetchAddresses({
          wallet: { walletType: WalletType.MNEMONIC, mnemonicPhrase: fMnemonicPhrase },
          path: DEFAULT_ETH,
          limit: 5,
          offset: 0
        })
      );
      expect(result).toStrictEqual(
        expect.objectContaining({
          isFetching: true,
          fetchError: undefined
        })
      );
    });
  });

  describe('fetchFailed()', () => {
    it('sets error', () => {
      const error = 'error';
      const result = slice.reducer(
        { accounts: [], addresses: [], isFetching: false },
        fetchFailed(error)
      );
      expect(result.fetchError).toBe(error);
    });
  });

  describe('fetchReset()', () => {
    it('resets fetch state', () => {
      const result = slice.reducer(
        { accounts: [], addresses: [], isFetching: true, fetchError: 'foo' },
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
        { accounts: [], addresses: [], isFetching: false },
        setGeneratedAccount(account)
      );
      expect(result.generatedAccount).toBe(account);
    });
  });
});
