import type { DerivationPath } from '@mycrypto/wallets';
import { MnemonicPhrase } from '@mycrypto/wallets';
import { getDeterministicWallet, getWallet } from '@wallets/wallet-initialisation';

import type { SerializedDeterministicWallet, SerializedWallet } from '@types';
import { WalletType } from '@types';

export const getAddress = async (wallet: SerializedWallet) => {
  const initialisedWallet = await getWallet(wallet);
  return initialisedWallet.getAddress();
};

export const createWallet = async (wallet: WalletType) => {
  if (wallet === WalletType.MNEMONIC) {
    return MnemonicPhrase.create().mnemonicPhrase;
  }
  throw new Error('Unsupported wallet type');
};

export const getAddresses = async (
  wallet: SerializedDeterministicWallet,
  path: DerivationPath,
  limit: number,
  offset: number
) => {
  const initialisedWallet = await getDeterministicWallet(wallet);
  return initialisedWallet.getAddresses({ path, limit, offset });
};
