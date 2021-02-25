import { TransactionRequest } from '@ethersproject/abstract-provider';

export interface Wallet {
  signTransaction(transaction: TransactionRequest): Promise<string>;
  getAddress(): Promise<string>;
  // signMessage(): Promise<string>;
}
