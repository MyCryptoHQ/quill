import { TransactionRequest } from '@ethersproject/abstract-provider';

import { TAddress } from './address';
import { TUuid } from './uuid';

export enum CryptoRequestType {
  SIGN = 'SIGN',
  GET_ADDRESS = 'GET_ADDRESS'
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

type GetAddressRequest = PrivKeyRequest<CryptoRequestType.GET_ADDRESS>;

export type CryptoRequest = SignTxRequest | GetAddressRequest;

export type CryptoResponse = string | { address: TAddress; uuid: TUuid };
