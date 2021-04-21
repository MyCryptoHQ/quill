import type { Infer } from 'superstruct';
import {
  array,
  literal,
  number,
  object,
  optional,
  pattern,
  refine,
  string,
  tuple,
  union
} from 'superstruct';

const Address = pattern(string(), /0x[a-fA-F0-9]{40}/);
const Hex = pattern(string(), /(?:0x)(?:[a-fA-F0-9]+)?/);
const EvenHex = refine(Hex, 'Even Length', (value) => value.length % 2 === 0);

export const SignTransactionStruct = tuple([
  object({
    to: Address,
    from: optional(Address),
    nonce: Hex,
    gasLimit: Hex,
    gasPrice: Hex,
    data: EvenHex,
    value: Hex,
    chainId: number()
  })
]);

export type TSignTransaction = Infer<typeof SignTransactionStruct>;

export const JSONRPCRequestStruct = object({
  id: union([string(), number()]),
  method: string(),
  jsonrpc: literal('2.0'),
  params: optional(array())
});

export type JsonRPCRequest<T = unknown[]> = Omit<Infer<typeof JSONRPCRequestStruct>, 'params'> & {
  params?: T;
};

export interface JsonRPCResponse<Result = unknown, Error = unknown> {
  id: string | number | null;
  jsonrpc: string;
  result?: Result;
  error?: {
    code: string;
    message: string;
    data?: Error;
  };
}

export type JsonRPCResult<Result = unknown, Error = unknown> = Omit<
  JsonRPCResponse<Result, Error>,
  'jsonrpc'
>;
