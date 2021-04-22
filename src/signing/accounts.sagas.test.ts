import { DEFAULT_ETH } from "@mycrypto/wallets";
import { expectSaga } from "redux-saga-test-plan";

import { createWallet, getAddress } from "@api/crypto";
import { removeAccount, saveAccountSecrets, setGeneratedAccount } from "@common/store";
import { DEFAULT_MNEMONIC_INDEX } from "@config/derivation";
import { fAccount, fPrivateKey } from "@fixtures";
import type { SerializedWallet, TAddress} from "@types";
import { WalletType } from "@types";

import { generateAccountWorker, removeAccountWorker, saveAccountWorker } from "./accounts.sagas";
import { deleteAccountSecrets, saveAccountSecrets as saveAccountSecretsFn } from "./secrets";

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
})

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