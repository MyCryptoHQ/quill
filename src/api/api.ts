import { JsonRPCRequest, JsonRPCResponse, SUPPORTED_METHODS } from '../types';
import { safeJSONParse } from '../utils';
import { isValidRequest } from './validators';

export const handleRequest = (
  data: string,
  sendToUI: (message: any) => void,
  reply: (response: JsonRPCResponse) => void,
) => {
  // @todo: Further sanitation?
  const json = safeJSONParse(data);
  if (json[0] !== null) {
    reply({
      id: null,
      jsonrpc: '2.0',
      error: { code: '-32700', message: 'Parse error' },
    });
    return;
  }
  const request = json[1] as JsonRPCRequest;
  // @todo: VALIDATE
  if (Object.values(SUPPORTED_METHODS).includes(request.method)) {
    if (!isValidRequest(request)) {
      reply({
        id: null,
        jsonrpc: '2.0',
        error: { code: '-32600', message: 'Invalid Request' },
      });
      return;
    }
    switch (request.method) {
      case SUPPORTED_METHODS.SIGN_TRANSACTION:
        sendToUI(request);
        return;
      // @todo Actual account handling
      case SUPPORTED_METHODS.ACCOUNTS:
        reply({
          id: request.id,
          jsonrpc: '2.0',
          result: ['0x82D69476357A03415E92B5780C89e5E9e972Ce75'],
        });
        return;
      default:
        break;
    }
  }
  // https://www.jsonrpc.org/specification
  reply({
    id: request.id,
    jsonrpc: '2.0',
    error: { code: '-32601', message: 'Unsupported method' },
  });
};

export const handleResponse = (
  result: { id: number; result: string },
  reply: (response: JsonRPCResponse) => void,
): void => {
  console.debug(result);
  reply({
    ...result,
    jsonrpc: '2.0',
  });
};
