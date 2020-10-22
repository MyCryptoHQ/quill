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

interface SignTxRequest extends PrivKeyRequest<CryptoRequestType.SIGN> {
  tx: TransactionRequest;
}

interface CreateWalletRequest extends BaseRequest<CryptoRequestType.CREATE_WALLET> {
  wallet: WalletType;
}

export interface GetAddressRequest extends BaseRequest<CryptoRequestType.GET_ADDRESS> {
  wallet: WalletType;
  args: string | GetMnemonicAddressesArgs | GetMnemonicAddressArgs;
}

export type CryptoRequest = SignTxRequest | GetAddressRequest | CreateWalletRequest;

export type CryptoResponse =
  | string
  | { address: TAddress; uuid: TUuid }
  | GetMnemonicAddressesResult[];
