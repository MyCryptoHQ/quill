import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { DerivationPath } from '@mycrypto/wallets';

import type { TAddress } from './address';
import type { GetAddressesResult } from './mnemonic';
import type { TUuid } from './uuid';
import type { WalletType } from './wallet';

export interface SerializedPrivateKey {
  walletType: WalletType.PRIVATE_KEY;
  privateKey: string;
}

export interface SerializedMnemonicPhrase {
  walletType: WalletType.MNEMONIC;
  mnemonicPhrase: string;
  passphrase?: string;
  path: DerivationPath;
  index: number;
}

export interface SerializedKeystore {
  walletType: WalletType.KEYSTORE;
  keystore: string;
  password: string;
}

export interface SerializedPersistentAccount {
  persistent: true;
  uuid: TUuid;
}

export type SerializedWallet = SerializedPrivateKey | SerializedMnemonicPhrase | SerializedKeystore;
export type SerializedOptionalPersistentWallet =
  | (SerializedWallet & { persistent?: false })
  | SerializedPersistentAccount;

interface SerializedDeterministicMnemonicPhrase {
  walletType: WalletType.MNEMONIC;
  mnemonicPhrase: string;
  passphrase?: string;
}

export type SerializedDeterministicWallet = SerializedDeterministicMnemonicPhrase;
