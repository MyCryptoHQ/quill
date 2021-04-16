import type { WebContents } from 'electron';
import { ipcMain } from 'electron';

import type { AccountsState } from '@app/store';
import { ipcBridgeMain } from '@bridge';
import { IPC_CHANNELS, SUPPORTED_METHODS } from '@config';
import type { JsonRPCRequest, JsonRPCResponse, UserRequest } from '@types';
import { safeJSONParse } from '@utils';

import { getFromStore } from './db';
import { isValidMethod, isValidParams, isValidRequest } from './validators';

const toJsonRpcResponse = (response: Omit<JsonRPCResponse, 'jsonrpc'>) => {
  return { jsonrpc: '2.0', ...response };
};

const requestSigning = (
  req: UserRequest<unknown>,
  webContents: WebContents
): Promise<JsonRPCResponse> => {
  // @todo Cleaner way of doing this?
  // @todo Reject?
  return new Promise((resolve, _reject) => {
    const { request } = req;
    webContents.send(IPC_CHANNELS.API, req);

    const listener = (
      _event: Electron.IpcMainEvent,
      response: Omit<JsonRPCResponse, 'jsonrpc'>
    ) => {
      if (response.id === request.id) {
        // Resolve promise and remove listener if response matches request
        // Since it is then the actual result of the JSON RPC request in question
        resolve(toJsonRpcResponse(response));
        ipcMain.removeListener(IPC_CHANNELS.API, listener);
      }
    };

    ipcBridgeMain(ipcMain, webContents).api.on(listener);
  });
};

const handleValidRequest = async (req: UserRequest<unknown>, webContents: WebContents) => {
  const { request } = req;
  switch (request.method) {
    case SUPPORTED_METHODS.SIGN_TRANSACTION:
      return requestSigning(req, webContents);
    // @todo Permissions based on origin
    // @todo Decide whether to fetch directly from store?
    case SUPPORTED_METHODS.ACCOUNTS:
      return toJsonRpcResponse({
        id: request.id,
        result: ((await getFromStore('accounts')) as AccountsState).accounts.map((a) => a.address)
      });
    default:
      return Promise.reject(new Error('Unexpected error'));
  }
};

// Replies follow: https://www.jsonrpc.org/specification
export const handleRequest = async (
  data: string,
  webContents: WebContents,
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
  return handleValidRequest({ origin, request }, webContents);
};
