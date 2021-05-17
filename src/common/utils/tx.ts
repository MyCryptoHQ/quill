import type { Transaction } from '@ethersproject/transactions';

import { generateUUID } from '@common/utils';
import type {
  JsonRPCRequest,
  TransactionRequest,
  TSignTransaction,
  TxHistoryEntry,
  TxQueueEntry,
  UserRequest
} from '@types';
import { TxResult } from '@types';

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
  ...prev,
  signedTx,
  result,
  timestamp: Date.now()
});
