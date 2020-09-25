import { ipcBridge } from '@bridge';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { IPC_CHANNELS } from '@types';

export function useWalletService() {
  const signWithPrivateKey = (privateKey: string, tx: TransactionRequest) => {
    return ipcBridge.invoke(IPC_CHANNELS.CRYPTO, { privateKey, tx });
  };

  return { signWithPrivateKey };
}
