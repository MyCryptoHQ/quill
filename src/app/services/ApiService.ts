import { useEffect } from 'react';

import { ipcBridge } from '@bridge';
import { TransactionResponse } from '@ethersproject/abstract-provider';

import { useQueue } from '@app/utils';
import { JsonRPCRequest, JsonRPCResponse } from '@types';

export function useApiService() {
  // @todo Move to global state
  const { first: currentTx, length, enqueue, dequeue } = useQueue<JsonRPCRequest>();

  useEffect(() => {
    const unsubscribe = ipcBridge.subscribeToRequests((request) => {
      // We expect this to be validated and sanitized JSON RPC request
      enqueue(request);
    });
    return () => unsubscribe();
  }, []);

  const respondCurrentTx = (obj: Omit<JsonRPCResponse, 'id' | 'jsonrpc'>) => {
    ipcBridge.sendResponse({ id: currentTx.id, ...obj });
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
