import { JsonRPCRequest, JsonRPCResponse, SUPPORTED_METHODS, IPC_CHANNELS } from '@types';
import { safeJSONParse } from '@utils';
import { IpcMain, WebContents } from 'electron';
import { isValidRequest } from './validators';

const toJsonRpcResponse = (response: Omit<JsonRPCResponse, 'jsonrpc'>) => {
  return { jsonrpc: '2.0', ...response };
};

const requestSigning = (
  request: JsonRPCRequest,
  ipcMain: IpcMain,
  webContents: WebContents
): Promise<JsonRPCResponse> => {
  // @todo Cleaner way of doing this?
  // @fixme  Also doesn't work with TX queue, fix!
  return new Promise((resolve, reject) => {
    webContents.send(IPC_CHANNELS.API, request);

    ipcMain.once(IPC_CHANNELS.API, (event, arg) => {
      console.debug(event);
      console.debug(arg);
      const response = arg;
      return resolve(response);
    });
  });
};

// Replies follow: https://www.jsonrpc.org/specification
export const handleRequest = async (
  data: string,
  ipcMain: IpcMain,
  webContents: WebContents
): Promise<JsonRPCResponse> => {
  // @todo: Further sanitation?
  const [valid, parsed] = safeJSONParse(data);
  if (valid !== null) {
    return toJsonRpcResponse({
      id: null,
      error: { code: '-32700', message: 'Parse error' }
    });
  }
  const request = parsed as JsonRPCRequest;
  if (!Object.values(SUPPORTED_METHODS).includes(request.method)) {
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
  switch (request.method) {
    case SUPPORTED_METHODS.SIGN_TRANSACTION:
      return requestSigning(request, ipcMain, webContents);
    // @todo Actual account handling
    case SUPPORTED_METHODS.ACCOUNTS:
      return toJsonRpcResponse({
        id: request.id,
        result: ['0x82D69476357A03415E92B5780C89e5E9e972Ce75']
      });
    default:
      return Promise.reject(new Error('Unexpected error'));
  }
};
