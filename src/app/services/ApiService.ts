import { useQueue } from '@app/hooks';
import { ipcBridgeRenderer } from '@bridge';
import { JsonRPCResponse } from '@types';

export function useApiService() {
  const { first: currentTx, length, dequeue } = useQueue((state) => state.transactions.queue);

  const respondCurrentTx = (obj: Omit<JsonRPCResponse, 'id' | 'jsonrpc'>) => {
    ipcBridgeRenderer.api.sendResponse({ id: currentTx.id, ...obj });
  };

  const denyCurrent = () => {
    respondCurrentTx({
      error: { code: '-32000', message: 'User denied transaction' }
    });
    dequeue();
  };

  return { currentTx, txQueueLength: length, denyCurrent };
}
