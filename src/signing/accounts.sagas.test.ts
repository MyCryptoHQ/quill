import { DEFAULT_ETH } from '@mycrypto/wallets';
import { expectSaga } from 'redux-saga-test-plan';

import {
  fetchAddresses,
  fetchFailed,
  removeAccount,
  saveAccountSecrets,
  setAddresses,
  setGeneratedAccount
} from '@common/store';
import { DEFAULT_MNEMONIC_INDEX } from '@config/derivation';
import { fAccount, fMnemonicPhrase, fPrivateKey } from '@fixtures';
import type { SerializedWallet, TAddress } from '@types';
import { WalletType } from '@types';

import {
  fetchAddressesWorker,
  generateAccountWorker,
  removeAccountWorker,
  saveAccountWorker
} from './accounts.sagas';
import { createWallet, getAddress, getAddresses } from './crypto';
import { deleteAccountSecrets, saveAccountSecrets as saveAccountSecretsFn } from './secrets';

const wallet: SerializedWallet = {
  walletType: WalletType.PRIVATE_KEY,
  privateKey: fPrivateKey
};

describe('saveAccountWorker', () => {
  it('handles saving account secrets', () => {
    return expectSaga(saveAccountWorker, saveAccountSecrets(wallet))
      .call(saveAccountSecretsFn, wallet)
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
