import type { JsonRPCRequest } from './jsonrpc';

export interface UserRequest<T = unknown> {
  origin?: string;
  request: JsonRPCRequest<T>;
}
