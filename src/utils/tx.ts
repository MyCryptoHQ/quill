import { Transaction } from '@ethersproject/transactions';

import {
  JsonRPCRequest,
  TransactionRequest,
  TSignTransaction,
  TxHistoryEntry,
  TxQueueEntry,
  TxResult
} from '@types';

export const makeTx = (request: JsonRPCRequest): TransactionRequest =>
  request.params[0] as TransactionRequest;

export const makeQueueTx = (payload: JsonRPCRequest<TSignTransaction>): TxQueueEntry => ({
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
  tx: prev.tx,
  signedTx,
  result,
  timestamp: Date.now()
});
