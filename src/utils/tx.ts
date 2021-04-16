import type { Transaction } from '@ethersproject/transactions';

import type {
  JsonRPCRequest,
  TransactionRequest,
  TSignTransaction,
  TxHistoryEntry,
  TxQueueEntry,
  UserRequest
} from '@types';
import { TxResult } from '@types';

import { generateUUID } from './generateUUID';

export const makeTx = (request: JsonRPCRequest): TransactionRequest =>
  request.params[0] as TransactionRequest;

export const makeQueueTx = (payload: UserRequest<TSignTransaction>): TxQueueEntry => {
  const { request, origin } = payload;
  return {
    uuid: generateUUID(),
    id: request.id,
    tx: makeTx(request),
    signedTx: undefined,
    result: TxResult.WAITING,
    timestamp: Date.now(),
    origin
  };
};

export const makeHistoryTx = (
  prev: TxQueueEntry,
  result: TxResult,
  signedTx?: Transaction
): TxHistoryEntry => ({
  uuid: prev.uuid,
  tx: prev.tx,
  signedTx,
  result,
  timestamp: Date.now(),
  origin: prev.origin
});
