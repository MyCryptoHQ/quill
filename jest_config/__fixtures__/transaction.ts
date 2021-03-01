import { TransactionResponse } from '@ethersproject/abstract-provider';

import { JsonRPCRequest, TSignTransaction } from '@types';

import { default as ethTxRequest } from './ethTxRequest.json';
import { default as ethTxResponse } from './ethTxResponse.json';

export const fTxRequest = ethTxRequest as JsonRPCRequest<TSignTransaction>;
export const fTxResponse = ethTxResponse as TransactionResponse;

export const getTransactionRequest = (from: string): JsonRPCRequest<TSignTransaction> => ({
  ...fTxRequest,
  params: [
    {
      ...fTxRequest.params[0],
      from
    }
  ]
});
