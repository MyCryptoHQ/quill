import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';

import { ipcBridgeRenderer } from '@bridge';
import { CryptoRequestType } from '@types';

export const signWithPrivateKey = (
  privateKey: string,
  tx: TransactionRequest
): Promise<TransactionResponse> => {
  return ipcBridgeRenderer.crypto.invoke({ type: CryptoRequestType.SIGN, privateKey, tx });
};
