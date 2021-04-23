import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { DerivationPath } from '@mycrypto/wallets';
import { MnemonicPhrase, PrivateKey } from '@mycrypto/wallets';
import { getDeterministicWallet, getWallet } from '@wallets/wallet-initialisation';

import { getPrivateKey } from '@api/db';
import type {
  SerializedDeterministicWallet,
  SerializedOptionalPersistentWallet,
  SerializedWallet,
  TUuid
} from '@types';
import { WalletType } from '@types';

const getPersistentWallet = async (uuid: TUuid): Promise<PrivateKey> => {
  const privateKey = await getPrivateKey(uuid);
  return new PrivateKey(privateKey);
};

export const signTransaction = async (
  wallet: SerializedOptionalPersistentWallet,
  tx: TransactionRequest
) => {
  const initialisedWallet = wallet.persistent
    ? await getPersistentWallet(wallet.uuid)
    : await getWallet(wallet as SerializedWallet);
  return initialisedWallet.signTransaction(tx);
};

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
