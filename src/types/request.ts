import { JsonRPCRequest } from './jsonRPCRequest';

export interface UserRequest<T> {
  origin?: string;
  request: JsonRPCRequest<T>;
}
