import { TransactionRequest } from '@ethersproject/abstract-provider';

export enum CryptoRequestType {
  SIGN = 'SIGN'
}

interface BaseRequest<Type extends CryptoRequestType> {
  type: Type;
}

interface SignTxRequest extends BaseRequest<CryptoRequestType.SIGN> {
  privateKey: string;
  tx: TransactionRequest;
}

export type CryptoRequest = SignTxRequest;

export type CryptoResponse = string;
