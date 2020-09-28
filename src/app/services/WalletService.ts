import { ipcBridge } from '@bridge';
import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';

import { IPC_CHANNELS } from '@types';

export function useWalletService() {
  const signWithPrivateKey = (
    privateKey: string,
    tx: TransactionRequest
  ): Promise<TransactionResponse> => {
    // @todo Better Typing?
    return ipcBridge.invoke(IPC_CHANNELS.CRYPTO, { privateKey, tx }) as Promise<
      TransactionResponse
    >;
  };

  return { signWithPrivateKey };
}
