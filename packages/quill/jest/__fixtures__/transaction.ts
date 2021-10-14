import type { TransactionResponse } from '@ethersproject/abstract-provider';
import type { JsonRPCRequest, TSignTransaction, UserRequest } from '@quill/common';

import { default as ethTxRequest } from './ethTxRequest.json';
import { default as ethTxRequestEIP1559 } from './ethTxRequestEIP1559.json';
import { default as ethTxResponse } from './ethTxResponse.json';
import { fRequestOrigin } from './origin';

export const fTxRequest = (ethTxRequest as unknown) as JsonRPCRequest<TSignTransaction>;
export const fTxRequestEIP1559 = (ethTxRequestEIP1559 as unknown) as JsonRPCRequest<
  TSignTransaction
>;
export const fTxResponse = ethTxResponse as TransactionResponse;

export const fRawTransaction =
  '0xeb0685012a05f20082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc1000080038080';
export const fSignedTx =
  '0xf86b0685012a05f20082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc10000802aa0686df061021262b4e75eb1608c8baaf043cca2b5ac68fb24420ede62d13a8a7fa035389237414433ac06a33d95c863b8221fe2c797a9c650c47a555255be0234f3';

export const getTransactionRequest = (
  from: string,
  tx?: Partial<TSignTransaction[0]>
): UserRequest<TSignTransaction> => ({
  origin: fRequestOrigin,
  request: {
    ...fTxRequest,
    params: [
      {
        ...fTxRequest.params[0],
        ...tx,
        from
      }
    ]
  }
});

export const getEIP1559TransactionRequest = (
  from: string,
  tx?: Partial<TSignTransaction[0]>
): UserRequest<TSignTransaction> => ({
  origin: fRequestOrigin,
  request: {
    ...fTxRequestEIP1559,
    params: [
      {
        ...fTxRequestEIP1559.params[0],
        ...tx,
        from
      }
    ]
  }
});
