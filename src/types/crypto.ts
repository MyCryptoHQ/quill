import { TransactionRequest } from '@ethersproject/abstract-provider';

import { AccountType } from './account';
import { TAddress } from './address';
import { TUuid } from './uuid';

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
  wallet: AccountType;
}

type GetAddressRequest = PrivKeyRequest<CryptoRequestType.GET_ADDRESS>;

export type CryptoRequest = SignTxRequest | GetAddressRequest | CreateWalletRequest;

export type CryptoResponse = string | { address: TAddress; uuid: TUuid };
