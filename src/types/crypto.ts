import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { DerivationPath } from '@mycrypto/wallets';

import type { TAddress } from './address';
import type { GetAddressesResult } from './mnemonic';
import type { TUuid } from './uuid';
import type { WalletType } from './wallet';

export enum CryptoRequestType {
  SIGN = 'SIGN',
  GET_ADDRESS = 'GET_ADDRESS',
  GET_ADDRESSES = 'GET_ADDRESSES',
  CREATE_WALLET = 'CREATE_WALLET'
}

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

interface BaseRequest<Type extends CryptoRequestType> {
  type: Type;
}

interface SignTxRequest extends BaseRequest<CryptoRequestType.SIGN> {
  wallet: SerializedOptionalPersistentWallet;
  tx: TransactionRequest;
}

interface CreateWalletRequest extends BaseRequest<CryptoRequestType.CREATE_WALLET> {
  wallet: WalletType;
}

export type GetAddressRequest = BaseRequest<CryptoRequestType.GET_ADDRESS> & {
  wallet: SerializedWallet;
};

export type GetAddressesRequest = BaseRequest<CryptoRequestType.GET_ADDRESSES> & {
  wallet: SerializedDeterministicWallet;
  path: DerivationPath;
  limit: number;
  offset: number;
};

export type CryptoRequest =
  | SignTxRequest
  | GetAddressRequest
  | GetAddressesRequest
  | CreateWalletRequest;

export type CryptoResponse = string | { address: TAddress; uuid: TUuid } | GetAddressesResult[];
