import { TransactionRequest } from '@ethersproject/abstract-provider';

import { TAddress } from './address';
import {
  GetMnemonicAddressArgs,
  GetMnemonicAddressesArgs,
  GetMnemonicAddressesResult
} from './mnemonic';
import { TUuid } from './uuid';
import { WalletType } from './wallet';

export enum CryptoRequestType {
  SIGN = 'SIGN',
  GET_ADDRESS = 'GET_ADDRESS',
  CREATE_WALLET = 'CREATE_WALLET'
}

interface BaseRequest<Type extends CryptoRequestType> {
  type: Type;
}

interface PrivKeyRequest<Type extends CryptoRequestType> extends BaseRequest<Type> {
  privateKey: string;
}

export interface SignTxRequest extends PrivKeyRequest<CryptoRequestType.SIGN> {
  tx: TransactionRequest;
}

export interface CreateWalletRequest extends BaseRequest<CryptoRequestType.CREATE_WALLET> {
  wallet: WalletType;
}

export interface GetPrivateKeyAddressRequest {
  wallet: WalletType.PRIVATE_KEY;
  args: string;
}
export interface GetMnemonicAddressRequest {
  wallet: WalletType.MNEMONIC;
  args: GetMnemonicAddressArgs | GetMnemonicAddressesArgs;
}

export type GetAddressRequest = BaseRequest<CryptoRequestType.GET_ADDRESS> &
  (GetPrivateKeyAddressRequest | GetMnemonicAddressRequest);

export type CryptoRequest = SignTxRequest | GetAddressRequest | CreateWalletRequest;

export type CryptoResponse =
  | string
  | { address: TAddress; uuid: TUuid }
  | GetMnemonicAddressesResult[];
