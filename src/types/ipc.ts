import { TransactionRequest } from '@ethersproject/abstract-provider';

export interface CryptoRequest {
  privateKey: string;
  tx: TransactionRequest;
}

export type CryptoResponse = string;
