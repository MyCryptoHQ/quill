import { Transaction } from '@ethersproject/transactions';

import {
  JsonRPCRequest,
  TransactionRequest,
  TSignTransaction,
  TxHistoryEntry,
  TxQueueEntry,
  TxResult
} from '@types';

import { generateUUID } from './generateUUID';

export const makeTx = (request: JsonRPCRequest): TransactionRequest =>
  request.params[0] as TransactionRequest;

export const makeQueueTx = (payload: JsonRPCRequest<TSignTransaction>): TxQueueEntry => ({
  uuid: generateUUID(),
  id: payload.id,
  tx: makeTx(payload),
  signedTx: undefined,
  result: TxResult.WAITING,
  timestamp: Date.now()
});

export const makeHistoryTx = (
  prev: TxQueueEntry,
  result: TxResult,
  signedTx?: Transaction
): TxHistoryEntry => ({
  uuid: prev.uuid,
  tx: prev.tx,
  signedTx,
  result,
  timestamp: Date.now()
});
