import { TransactionRequest } from '@ethersproject/abstract-provider';

import { TAddress } from './address';
import { GetAddressesResult } from './mnemonic';
import { TUuid } from './uuid';
import { WalletType } from './wallet';

export enum CryptoRequestType {
  SIGN = 'SIGN',
  GET_ADDRESS = 'GET_ADDRESS',
  GET_ADDRESSES = 'GET_ADDRESSES',
  CREATE_WALLET = 'CREATE_WALLET'
}

export interface InitialisePrivateKey {
  walletType: WalletType.PRIVATE_KEY;
  privateKey: string;
}

export interface InitialiseMnemonicPhrase {
  walletType: WalletType.MNEMONIC;
  mnemonicPhrase: string;
  passphrase?: string;
  path: string;
}

export interface InitialisePersistentAccount {
  persistent: true;
  uuid: TUuid;
}

export type SerializedWallet = InitialisePrivateKey | InitialiseMnemonicPhrase;
export type SerializedOptionalPersistentWallet =
  | (InitialisePrivateKey & { persistent?: false })
  | (InitialiseMnemonicPhrase & { persistent?: false })
  | InitialisePersistentAccount;

interface InitialiseDeterministicMnemonicPhrase {
  walletType: WalletType.MNEMONIC;
  mnemonicPhrase: string;
  passphrase?: string;
}

export type InitialiseDeterministicWallet = InitialiseDeterministicMnemonicPhrase;

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
  wallet: InitialiseDeterministicWallet;
  path: string;
  limit: number;
  offset: number;
};

export type CryptoRequest =
  | SignTxRequest
  | GetAddressRequest
  | GetAddressesRequest
  | CreateWalletRequest;

export type CryptoResponse = string | { address: TAddress; uuid: TUuid } | GetAddressesResult[];
