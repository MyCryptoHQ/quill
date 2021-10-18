import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { DerivationPath } from '@mycrypto/wallets';
import { MnemonicPhrase, PrivateKey } from '@mycrypto/wallets';
import type {
  SerializedDeterministicWallet,
  SerializedOptionalPersistentWallet,
  SerializedWallet,
  TUuid
} from '@quill/common';
import { WalletType } from '@quill/common';
import { getDeterministicWallet, getWallet } from '@wallets/wallet-initialisation';

import { getPrivateKey } from './secrets';

const MNEMONIC_ENTROPY_BYTES = 16;

const getPersistentWallet = async (uuid: TUuid): Promise<PrivateKey> => {
  const privateKey = await getPrivateKey(uuid);
  if (privateKey == null) {
    throw new Error('Saved Private Key is invalid');
  }
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

export const getExtendedKey = async (
  wallet: SerializedDeterministicWallet,
  derivationPath: DerivationPath
): Promise<string> => {
  const initialisedWallet = await getDeterministicWallet(wallet);
  return initialisedWallet.getExtendedPublicKey(derivationPath);
};

export const derivePrivateKey = async (wallet: SerializedWallet) => {
  const initialisedWallet = await getWallet(wallet);
  return initialisedWallet.getPrivateKey();
};

export const createWallet = async (wallet: WalletType) => {
  if (wallet === WalletType.MNEMONIC) {
    return MnemonicPhrase.create(undefined, MNEMONIC_ENTROPY_BYTES).mnemonicPhrase;
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
