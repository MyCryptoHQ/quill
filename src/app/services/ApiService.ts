import { useEffect } from 'react';

import { ipcBridge } from '@bridge';
import { TransactionResponse } from '@ethersproject/abstract-provider';

import { useQueue } from '@app/utils';
import { IPC_CHANNELS, JsonRPCRequest, JsonRPCResponse } from '@types';

export function useApiService() {
  const { first: currentTx, length, enqueue, dequeue } = useQueue<JsonRPCRequest>();

  useEffect(() => {
    const unsubscribe = ipcBridge.subscribe(IPC_CHANNELS.API, (...args) => {
      // We expect this to be validated and sanitized JSON RPC request
      const tx = args[0];
      enqueue(tx);
    });
    return () => unsubscribe();
  }, []);

  const respondCurrentTx = (obj: Omit<JsonRPCResponse, 'id' | 'jsonrpc'>) => {
    ipcBridge.send(IPC_CHANNELS.API, { id: currentTx.id, ...obj });
  };

  const approveCurrent = (signedTx: TransactionResponse) => {
    respondCurrentTx({ result: signedTx });
    dequeue();
  };

  const denyCurrent = () => {
    respondCurrentTx({
      error: { code: '-32000', message: 'User denied transaction' }
    });
    dequeue();
  };

  return { currentTx, txQueueLength: length, approveCurrent, denyCurrent };
}
