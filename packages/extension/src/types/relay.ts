import type { JsonRPCRequest } from '@quill/common';
import type { Infer } from 'superstruct';
import { any, array, number, object, optional, pattern, string, union, unknown } from 'superstruct';

export enum RelayTarget {
  Page = 'Page',
  Content = 'Content',
  Background = 'Background'
}

const UuidStruct = pattern(
  string(),
  /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/
);

export const RelayMessageStruct = object({
  id: UuidStruct,
  target: string(),
  payload: object({
    method: string(),
    params: optional(union([array(unknown()), object()]))
  })
});

export type RelayMessage = Infer<typeof RelayMessageStruct>;

export const RelayResponseStruct = object({
  id: UuidStruct,
  target: string(),
  data: optional(any()),
  error: optional(
    object({
      code: union([string(), number()]),
      message: string()
    })
  )
});

export type RelayResponse = Infer<typeof RelayResponseStruct>;

export const JsonRpcResponseStruct = object({
  jsonrpc: string(),
  id: union([string(), number()]),
  result: optional(unknown()),
  error: optional(
    object({
      code: union([string(), number()]),
      message: string(),
      data: optional(
        object({
          expectedNonce: number()
        })
      )
    })
  )
});

export type JsonRpcResponse = Infer<typeof JsonRpcResponseStruct>;

export interface JsonRpcRelayRequest {
  tabId: number;
  request: JsonRPCRequest;
}
