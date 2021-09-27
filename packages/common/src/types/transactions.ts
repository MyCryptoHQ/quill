import type { TransactionRequest as EthersTransactionRequest } from '@ethersproject/abstract-provider';
import type { Overwrite } from 'utility-types';

import type { TAddress } from './address';
import type { JsonRPCRequest } from './jsonrpc';
import type { TUuid } from './uuid';

export enum TxResult {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  WAITING = 'WAITING'
}

export type TransactionRequest = Overwrite<
  EthersTransactionRequest,
  { to?: TAddress; from: TAddress }
>;

export interface TxHistoryEntry {
  uuid: TUuid;
  tx: TransactionRequest;
  signedTx?: string;
  actionTakenTimestamp: number;
  receivedTimestamp: number;
  result: TxResult;
  origin?: string;
  adjustedNonce?: boolean;
  userEdited?: boolean;
  offline?: boolean;
}

export interface TxQueueEntry {
  uuid: TUuid;
  id: JsonRPCRequest['id'];
  tx: TransactionRequest;
  receivedTimestamp: number;
  result: TxResult.WAITING;
  origin?: string;
  adjustedNonce?: boolean;
  userEdited?: boolean;
  offline?: boolean;
}
