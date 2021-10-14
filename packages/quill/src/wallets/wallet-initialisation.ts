import type { DeterministicWallet, Wallet } from '@mycrypto/wallets';
import { Keystore, MnemonicPhrase, PrivateKey } from '@mycrypto/wallets';
import type { SerializedDeterministicWallet, SerializedWallet } from '@quill/common';
import { WalletType } from '@quill/common';

export const getWallet = async (initialiseWallet: SerializedWallet): Promise<Wallet> => {
  switch (initialiseWallet.walletType) {
    case WalletType.MNEMONIC: {
      const { mnemonicPhrase, passphrase, path, index } = initialiseWallet;
      return new MnemonicPhrase(mnemonicPhrase, passphrase).getWallet(path, index);
    }
    case WalletType.PRIVATE_KEY: {
      const { privateKey } = initialiseWallet;
      return new PrivateKey(privateKey);
    }
    case WalletType.KEYSTORE: {
      const { keystore, password } = initialiseWallet;
      return new Keystore(keystore, password);
    }
  }

  throw new Error('Invalid wallet type');
};

export const getDeterministicWallet = async (
  initialiseWallet: SerializedDeterministicWallet
): Promise<DeterministicWallet> => {
  switch (initialiseWallet.walletType) {
    case WalletType.MNEMONIC: {
      const { mnemonicPhrase, passphrase } = initialiseWallet;
      return new MnemonicPhrase(mnemonicPhrase, passphrase);
    }
  }
};
