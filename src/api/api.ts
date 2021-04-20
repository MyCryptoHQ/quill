import type { EnhancedStore } from '@reduxjs/toolkit';
import { ipcMain } from 'electron';

import { addTransaction } from '@common/store';
import { IPC_CHANNELS, SUPPORTED_METHODS } from '@config';
import type { JsonRPCRequest, JsonRPCResponse, TSignTransaction, UserRequest } from '@types';
import { safeJSONParse } from '@utils';

import type { ApplicationState } from './store';
import { isValidMethod, isValidParams, isValidRequest } from './validators';

const toJsonRpcResponse = (response: Omit<JsonRPCResponse, 'jsonrpc'>) => {
  return { jsonrpc: '2.0', ...response };
};

const requestSigning = (
  request: UserRequest<TSignTransaction>,
  store: EnhancedStore<ApplicationState>
): Promise<JsonRPCResponse> => {
  // @todo Cleaner way of doing this?
  // @todo Reject?
  return new Promise((resolve, _reject) => {
    store.dispatch(addTransaction(request));

    // @todo: Refactor this using Redux
    const listener = (response: Omit<JsonRPCResponse, 'jsonrpc'>) => {
      console.log('listener', response, request.request);

      if (response.id === request.request.id) {
        // Resolve promise and remove listener if response matches request
        // Since it is then the actual result of the JSON RPC request in question
        resolve(toJsonRpcResponse(response));
        ipcMain.removeListener(IPC_CHANNELS.API, listener);
      }
    };

    // @ts-expect-error Wrong type
    ipcMain.on(IPC_CHANNELS.API, listener);
  });
};

const handleValidRequest = async (
  req: UserRequest<unknown>,
  store: EnhancedStore<ApplicationState>
) => {
  const { request } = req;
  switch (request.method) {
    case SUPPORTED_METHODS.SIGN_TRANSACTION:
      return requestSigning(req as UserRequest<TSignTransaction>, store);
    // @todo Permissions based on origin
    case SUPPORTED_METHODS.ACCOUNTS:
      return toJsonRpcResponse({
        id: request.id,
        result: store.getState().accounts.accounts.map((account) => account.address)
      });
    default:
      throw new Error('Unexpected error');
  }
};

// Replies follow: https://www.jsonrpc.org/specification
export const handleRequest = async (
  data: string,
  store: EnhancedStore<ApplicationState>,
  origin?: string
): Promise<JsonRPCResponse> => {
  // @todo: Further sanitation?
  const [valid, request] = safeJSONParse<JsonRPCRequest>(data);
  if (valid !== null) {
    return toJsonRpcResponse({
      id: null,
      error: { code: '-32700', message: 'Parse error' }
    });
  }

  if (!isValidRequest(request)) {
    return toJsonRpcResponse({
      id: null,
      error: { code: '-32600', message: 'Invalid Request' }
    });
  }

  if (!isValidMethod(request.method)) {
    return toJsonRpcResponse({
      id: request.id,
      error: { code: '-32601', message: 'Unsupported Method' }
    });
  }

  if (!isValidParams(request)) {
    return toJsonRpcResponse({
      id: request.id,
      error: { code: '-32602', message: 'Invalid Params' }
    });
  }

  // No errors found, handle as valid request
  return handleValidRequest({ origin, request }, store);
};
