import type { JsonRPCRequest } from '@signer/common';

import type { RelayMessage } from '../types';

export const toJsonRpcRequest = (message: RelayMessage): JsonRPCRequest => ({
  jsonrpc: '2.0',
  id: message.id,
  method: message.payload.method,
  // @todo: Handle object params
  params: Array.isArray(message.payload.params) ? message.payload.params : []
});
