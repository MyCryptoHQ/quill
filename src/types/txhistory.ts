import { TransactionRequest as EthersTransactionRequest } from '@ethersproject/abstract-provider';
import { Transaction } from '@ethersproject/transactions';
import { Overwrite } from 'utility-types';

import { TAddress } from './address';
import { JsonRPCRequest } from './jsonRPCRequest';
import { TUuid } from './uuid';

export enum TxResult {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  WAITING = 'WAITING'
}

export type TransactionRequest = Overwrite<
  EthersTransactionRequest,
  { to: TAddress; from: TAddress }
>;

export interface TxHistoryEntry {
  uuid: TUuid;
  tx: TransactionRequest;
  signedTx?: Transaction;
  timestamp: number;
  result: TxResult;
  origin?: string;
}

export interface TxQueueEntry {
  uuid: TUuid;
  id: JsonRPCRequest['id'];
  tx: TransactionRequest;
  signedTx: undefined;
  timestamp: number;
  result: TxResult.WAITING;
  origin?: string;
}
