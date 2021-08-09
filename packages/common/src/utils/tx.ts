import type { Transaction } from '@ethersproject/transactions';
import { parse } from '@ethersproject/transactions';

import { addHexPrefix, bigify, generateUUID } from '.';
import type {
  JsonRPCRequest,
  TransactionRequest,
  TSignTransaction,
  TxHistoryEntry,
  TxQueueEntry,
  UserRequest
} from '../types';
import { JsonRPCMethod, TxResult } from '../types';

export const makeTx = (request: JsonRPCRequest): TransactionRequest => {
  const { gas, ...rest } = request.params[0] as Record<string, unknown>;
  return {
    ...rest,
    gasLimit: gas
  } as TransactionRequest;
};

export const makeQueueTx = (
  payload: UserRequest<TSignTransaction>,
  offline: boolean = false
): TxQueueEntry => {
  const { request, origin } = payload;
  return {
    uuid: generateUUID(),
    id: request.id,
    tx: makeTx(request),
    result: TxResult.WAITING,
    timestamp: Date.now(),
    origin,
    offline
  };
};

export const makeHistoryTx = (
  prev: TxQueueEntry,
  result: TxResult,
  signedTx?: string
): TxHistoryEntry => ({
  ...prev,
  signedTx,
  result,
  timestamp: Date.now()
});

export const toTransactionRequest = ({
  r,
  s,
  v,
  type,
  accessList,
  hash,
  ...transaction
}: Transaction): UserRequest<TSignTransaction> => {
  return {
    request: {
      jsonrpc: '2.0',
      id: 0,
      method: JsonRPCMethod.SignTransaction,
      params: [
        {
          ...transaction,
          value: transaction.value.toHexString(),
          gasPrice: transaction.gasPrice.toHexString(),
          gas: transaction.gasLimit.toHexString(),
          nonce: addHexPrefix(transaction.nonce.toString(16))
        }
      ]
    }
  };
};

export const isRawTransaction = (transaction: string): boolean => {
  try {
    const { r, s } = parse(transaction);
    return bigify(r ?? 0).isZero() && bigify(s ?? 0).isZero();
  } catch {
    return false;
  }
};
