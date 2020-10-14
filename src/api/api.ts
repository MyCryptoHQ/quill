import { ipcMain, WebContents } from 'electron';

import { ipcBridgeMain } from '@bridge';
import { IPC_CHANNELS, SUPPORTED_METHODS } from '@config';
import { JsonRPCRequest, JsonRPCResponse } from '@types';
import { safeJSONParse } from '@utils';

import { getAccounts } from './db';
import { isValidMethod, isValidRequest } from './validators';

const toJsonRpcResponse = (response: Omit<JsonRPCResponse, 'jsonrpc'>) => {
  return { jsonrpc: '2.0', ...response };
};

const requestSigning = (
  request: JsonRPCRequest,
  webContents: WebContents
): Promise<JsonRPCResponse> => {
  // @todo Cleaner way of doing this?
  // @todo Reject?
  return new Promise((resolve, _reject) => {
    webContents.send(IPC_CHANNELS.API, request);

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

    ipcBridgeMain(ipcMain).api.on(listener);
  });
};

const handleValidRequest = async (request: JsonRPCRequest, webContents: WebContents) => {
  switch (request.method) {
    case SUPPORTED_METHODS.SIGN_TRANSACTION:
      return requestSigning(request, webContents);
    // @todo Dont expose all accounts at once?
    // @todo Decide whether to fetch directly from store?
    case SUPPORTED_METHODS.ACCOUNTS:
      return toJsonRpcResponse({
        id: request.id,
        result: Object.values((await getAccounts()).accounts).map((a) => a.address)
      });
    default:
      return Promise.reject(new Error('Unexpected error'));
  }
};

// Replies follow: https://www.jsonrpc.org/specification
export const handleRequest = async (
  data: string,
  webContents: WebContents
): Promise<JsonRPCResponse> => {
  // @todo: Further sanitation?
  const [valid, request] = safeJSONParse(data) as [any, JsonRPCRequest];
  if (valid !== null) {
    return toJsonRpcResponse({
      id: null,
      error: { code: '-32700', message: 'Parse error' }
    });
  }
  if (!isValidMethod(request.method)) {
    return toJsonRpcResponse({
      id: request.id,
      error: { code: '-32601', message: 'Unsupported method' }
    });
  }
  if (!isValidRequest(request)) {
    return toJsonRpcResponse({
      id: null,
      error: { code: '-32600', message: 'Invalid Request' }
    });
  }
  // No errors found, handle as valid request
  return handleValidRequest(request, webContents);
};
