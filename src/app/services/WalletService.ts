import { ipcBridge } from '@bridge';
import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';

export const signWithPrivateKey = (
  privateKey: string,
  tx: TransactionRequest
): Promise<TransactionResponse> => {
  return ipcBridge.signTransaction({ privateKey, tx });
};
