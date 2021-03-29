import { JsonRPCRequest } from './jsonRPCRequest';

export interface UserRequest<T> {
  origin: string | undefined;
  request: JsonRPCRequest<T>;
}
