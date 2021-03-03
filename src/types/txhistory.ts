import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Transaction } from '@ethersproject/transactions';

export enum TxHistoryResult {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED'
}

export interface TxHistoryEntry {
  tx: TransactionRequest;
  signedTx?: Transaction;
  timestamp: number;
  result: TxHistoryResult;
}
