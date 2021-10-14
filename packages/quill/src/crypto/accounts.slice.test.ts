import { DEFAULT_ETH } from '@mycrypto/wallets';
import type { SerializedWallet, SerializedWalletWithAddress, TAddress } from '@quill/common';
import {
  addAccount,
  addGeneratedAccount,
  addSavedAccounts,
  clearAddAccounts,
  fetchAccounts,
  fetchAddresses,
  fetchFailed,
  nextFlow,
  removeAccount,
  setAddAccounts,
  setAddresses,
  setExtendedKey,
  setGeneratedAccount,
  WalletType
} from '@quill/common';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { DEFAULT_MNEMONIC_INDEX } from '@config';
import {
  fAccount,
  fExtendedKey,
  fKeystore,
  fKeystorePassword,
  fMnemonicPhrase,
  fPrivateKey
} from '@fixtures';

import slice, {
  addGeneratedAccountWorker,
  addSavedAccountsWorker,
  fetchAccount,
  fetchAccountsWorker,
  fetchAddressesWorker,
  generateAccountWorker,
  getSecret,
  removeAccountWorker
} from './accounts.slice';
import { createWallet, derivePrivateKey, getAddress, getAddresses } from './crypto';
import { deleteAccountSecrets, saveAccountSecrets } from './secrets';

jest.mock('keytar');

const wallet: SerializedWallet = {
  walletType: WalletType.PRIVATE_KEY,
  privateKey: fPrivateKey
};

const otherWallet: SerializedWallet = {
  walletType: WalletType.MNEMONIC,
  mnemonicPhrase: fMnemonicPhrase,
  path: DEFAULT_ETH,
  index: 0
};

describe('AccountsSlice', () => {
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

      const result = slice.reducer(undefined, setAddAccounts(add));
      expect(result.add).toStrictEqual(add);
    });
  });

  describe('clearAddAccounts', () => {
    it('clears accounts to add', () => {
      const result = slice.reducer(
        {
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

  describe('setGeneratedAccount()', () => {
    it('sets generated account', () => {
      const account = {
        mnemonicPhrase: 'foo',
        address: 'bar' as TAddress
      };

      const result = slice.reducer({}, setGeneratedAccount(account));

      expect(result.generatedAccount).toBe(account);
    });
  });
});

describe('fetchAccount', () => {
  it('handles getting account address', () => {
    return expectSaga(fetchAccount, wallet)
      .provide([[call.fn(getAddress), fAccount.address]])
      .call(getAddress, wallet)
      .returns({ ...wallet, address: fAccount.address })
      .silentRun();
  });
});

describe('fetchAccountsWorker', () => {
  it('fetches an address for each account and sets them in the store', async () => {
    await expectSaga(fetchAccountsWorker, fetchAccounts([wallet, otherWallet]))
      .call(fetchAccount, wallet)
      .call(fetchAccount, otherWallet)
      .put(
        setAddAccounts({
          secret: wallet.privateKey,
          accounts: [
            { ...wallet, address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4' as TAddress },
            { ...otherWallet, address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4' as TAddress }
          ]
        })
      )
      .put(nextFlow())
      .silentRun();
  });

  it('derives a private key for a keystore file', async () => {
    const keystoreWallet = {
      walletType: WalletType.KEYSTORE as const,
      keystore: fKeystore,
      password: fKeystorePassword
    };

    await expectSaga(fetchAccountsWorker, fetchAccounts([keystoreWallet]))
      .call(derivePrivateKey, keystoreWallet)
      .call(fetchAccount, keystoreWallet)
      .put(
        setAddAccounts({
          accounts: [
            {
              ...keystoreWallet,
              address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4' as TAddress
            }
          ],
          secret: fPrivateKey
        })
      )
      .silentRun();
  });

  it('uses the mnemonic phrase itself for mnemonic wallets', async () => {
    await expectSaga(fetchAccountsWorker, fetchAccounts([otherWallet]))
      .call(fetchAccount, otherWallet)
      .put(
        setAddAccounts({
          accounts: [
            {
              ...otherWallet,
              address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4' as TAddress
            }
          ],
          secret: otherWallet.mnemonicPhrase
        })
      )
      .silentRun();
  });

  it('handles errors', () => {
    const input = { ...wallet, persistent: false };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .provide({
        call() {
          throw new Error('error');
        }
      })
      .call(getSecret, input)
      .put(fetchFailed('error'))
      .silentRun();
  });
});

describe('removeAccountWorker', () => {
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

describe('fetchAddressesWorker', () => {
  const wallet = {
    walletType: WalletType.MNEMONIC,
    mnemonicPhrase: fMnemonicPhrase
  } as const;

  it('fetches addresses for a deterministic wallet', async () => {
    const dPathInfo = {
      name: 'Default (ETH)',
      path: "m/44'/60'/0'/0/<account>"
    };

    await expectSaga(
      fetchAddressesWorker,
      fetchAddresses({
        wallet,
        path: DEFAULT_ETH,
        limit: 3,
        offset: 0
      })
    )
      .call(getAddresses, wallet, DEFAULT_ETH, 3, 0)
      .put(setExtendedKey(fExtendedKey))
      .put(
        setAddresses([
          {
            address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4' as TAddress,
            dPath: "m/44'/60'/0'/0/0",
            dPathInfo,
            index: 0
          },
          {
            address: '0xa34F236d4Ead4D668b9335891f1BC4011A92B2CD' as TAddress,
            dPath: "m/44'/60'/0'/0/1",
            dPathInfo,
            index: 1
          },
          {
            address: '0x5e147f4A4224428c2978dca3A95aee7625FDB3Fd' as TAddress,
            dPath: "m/44'/60'/0'/0/2",
            dPathInfo,
            index: 2
          }
        ])
      )
      .silentRun();
  });

  it('handles errors', async () => {
    await expectSaga(
      fetchAddressesWorker,
      fetchAddresses({
        wallet,
        path: DEFAULT_ETH,
        limit: 3,
        offset: 0
      })
    )
      .provide({
        call() {
          throw new Error('error');
        }
      })
      .call(getAddresses, wallet, DEFAULT_ETH, 3, 0)
      .put(fetchFailed('error'))
      .silentRun();
  });
});

describe('addSavedAccountsWorker', () => {
  it('adds saved accounts', async () => {
    const account = {
      walletType: WalletType.PRIVATE_KEY,
      address: fAccount.address,
      privateKey: fPrivateKey
    } as const;

    await expectSaga(addSavedAccountsWorker, addSavedAccounts(false))
      .withState({
        accounts: {
          add: {
            type: WalletType.PRIVATE_KEY,
            secret: wallet.privateKey,
            accounts: [
              { ...wallet, address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress },
              { ...otherWallet, address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress }
            ]
          }
        }
      })
      .put(removeAccount({ ...fAccount, persistent: true }))
      .put(addAccount({ ...fAccount, persistent: false }))
      .put(nextFlow())
      .silentRun();

    await expectSaga(addSavedAccountsWorker, addSavedAccounts(true))
      .withState({
        accounts: {
          add: {
            type: WalletType.PRIVATE_KEY,
            secret: wallet.privateKey,
            accounts: [
              { ...wallet, address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress },
              { ...otherWallet, address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress }
            ]
          }
        }
      })
      .put(removeAccount({ ...fAccount, persistent: true }))
      .put(addAccount({ ...fAccount, persistent: true }))
      .call(saveAccountSecrets, account)
      .put(nextFlow())
      .silentRun();
  });
});

describe('addGeneratedAccountWorker', () => {
  it('adds generated account', async () => {
    const wallet: SerializedWalletWithAddress = {
      walletType: WalletType.MNEMONIC,
      path: DEFAULT_ETH,
      index: DEFAULT_MNEMONIC_INDEX,
      mnemonicPhrase: fMnemonicPhrase,
      address: fAccount.address
    };

    await expectSaga(addGeneratedAccountWorker, addGeneratedAccount(true))
      .withState({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: wallet.mnemonicPhrase,
            address: wallet.address
          }
        }
      })
      .put(setAddAccounts({ accounts: [wallet], secret: wallet.mnemonicPhrase }))
      .put(addSavedAccounts(true))
      .silentRun();

    await expectSaga(addGeneratedAccountWorker, addGeneratedAccount(false))
      .withState({
        accounts: {
          generatedAccount: {
            mnemonicPhrase: wallet.mnemonicPhrase,
            address: wallet.address
          }
        }
      })
      .put(setAddAccounts({ accounts: [wallet], secret: wallet.mnemonicPhrase }))
      .put(addSavedAccounts(false))
      .silentRun();
  });
});
