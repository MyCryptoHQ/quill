import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Transaction } from '@ethersproject/transactions';

import { JsonRPCRequest } from './jsonRPCRequest';

export enum TxResult {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  WAITING = 'WAITING'
}

export interface TxHistoryEntry {
  tx: TransactionRequest;
  signedTx?: Transaction;
  timestamp: number;
  result: TxResult;
}

export interface TxQueueEntry {
  id: JsonRPCRequest['id'];
  tx: TransactionRequest;
  signedTx: undefined;
  timestamp: number;
  result: TxResult.WAITING;
}
