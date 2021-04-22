import type { TAddress } from '@mycrypto/wallets';
import { DEFAULT_ETH } from '@mycrypto/wallets';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { createWallet, getAddress, getAddresses } from '@api/crypto';
import { deleteAccountSecrets, saveAccountSecrets } from '@api/db';
import { createJsonRpcRequest } from '@api/store/utils';
import {
  addAccount,
  fetchAccounts,
  fetchAddresses,
  fetchFailed,
  fetchReset,
  removeAccount,
  setAddresses,
  setGeneratedAccount
} from '@common/store';
import { DEFAULT_MNEMONIC_INDEX, JsonRPCMethod } from '@config';
import { fAccount, fAccounts, fMnemonicPhrase, fPrivateKey, fRequestOrigin } from '@fixtures';
import type { SerializedWallet } from '@types';
import { WalletType } from '@types';

import {
  fetchAccountsWorker,
  fetchAddressesWorker,
  generateAccountWorker,
  getAccountsWorker,
  removeAccountWorker
} from './accounts.sagas';
import { reply, requestAccounts } from './ws.sagas';

jest.mock('electron-store');
jest.mock('keytar');

const wallet: SerializedWallet = {
  walletType: WalletType.PRIVATE_KEY,
  privateKey: fPrivateKey
};

describe('getAccountsWorker', () => {
  it('gets the addresses of all accounts', async () => {
    const request = createJsonRpcRequest(JsonRPCMethod.Accounts);
    await expectSaga(getAccountsWorker, requestAccounts({ origin: fRequestOrigin, request }))
      .withState({ accounts: { accounts: fAccounts } })
      .put(reply({ id: request.id, result: fAccounts.map((account) => account.address) }))
      .silentRun();
  });
});

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

describe('fetchAddressesWorker', () => {
  const wallet = {
    walletType: WalletType.MNEMONIC,
    mnemonicPhrase: fMnemonicPhrase
  } as const;

  it('fetches addresses for a deterministic wallet', async () => {
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
      .put(
        setAddresses([
          {
            address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4' as TAddress,
            dPath: "m/44'/60'/0'/0/0",
            index: 0
          },
          {
            address: '0xa34F236d4Ead4D668b9335891f1BC4011A92B2CD' as TAddress,
            dPath: "m/44'/60'/0'/0/1",
            index: 1
          },
          {
            address: '0x5e147f4A4224428c2978dca3A95aee7625FDB3Fd' as TAddress,
            dPath: "m/44'/60'/0'/0/2",
            index: 2
          }
        ])
      )
      .put(fetchReset())
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
