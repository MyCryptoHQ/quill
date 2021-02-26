import { DeterministicWallet } from '@wallets/deterministic-wallet';
import { MnemonicPhrase } from '@wallets/implementations/deterministic/mnemonic-phrase';
import { PrivateKey } from '@wallets/implementations/non-deterministic/private-key';
import { Wallet } from '@wallets/wallet';

import { InitialiseDeterministicWallet, InitialiseWallet, WalletType } from '@types';

export const getWallet = async (initialiseWallet: InitialiseWallet): Promise<Wallet> => {
  switch (initialiseWallet.walletType) {
    case WalletType.MNEMONIC: {
      const { mnemonicPhrase, passphrase, path } = initialiseWallet;
      return new MnemonicPhrase(mnemonicPhrase, passphrase).getWallet(path);
    }
    case WalletType.PRIVATE_KEY: {
      const { privateKey } = initialiseWallet;
      return new PrivateKey(privateKey);
    }
  }

  throw new Error('Invalid wallet type');
};

export const getDeterministicWallet = async (
  initialiseWallet: InitialiseDeterministicWallet
): Promise<DeterministicWallet> => {
  switch (initialiseWallet.walletType) {
    case WalletType.MNEMONIC: {
      const { mnemonicPhrase, passphrase } = initialiseWallet;
      return new MnemonicPhrase(mnemonicPhrase, passphrase);
    }
  }
};
