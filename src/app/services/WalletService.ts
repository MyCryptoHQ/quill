import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';

import { ipcBridgeRenderer } from '@bridge';

export const signWithPrivateKey = (
  privateKey: string,
  tx: TransactionRequest
): Promise<TransactionResponse> => {
  return ipcBridgeRenderer.crypto.invoke({ privateKey, tx });
};
