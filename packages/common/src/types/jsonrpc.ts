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

import type { DistributiveOmit } from './distributive';

// Supported JSON-RPC methods
export enum JsonRPCMethod {
  RequestPermissions = 'wallet_requestPermissions',
  GetPermissions = 'wallet_getPermissions',
  SignTransaction = 'eth_signTransaction',
  Accounts = 'eth_accounts'
}

const Address = pattern(string(), /^0x[a-fA-F0-9]{40}$/);
const Hex = pattern(string(), /^(?:0x)(?:[a-fA-F0-9]+)?$/);
const NonPrefixedHex = pattern(string(), /^(?:[a-fA-F0-9]+)?$/);
export const EvenHex = refine(Hex, 'Even Length', (value) => value.length % 2 === 0);

const SignTransactionLegacy = object({
  to: optional(Address),
  from: optional(Address),
  nonce: Hex,
  gas: Hex,
  gasPrice: Hex,
  data: EvenHex,
  value: Hex,
  // Note: this is technically not compliant to the JSON-RPC spec, but since Quill isn't
  // aware of the chain ID otherwise, we need to include it.
  chainId: number()
});

const SignTransactionEIP1559 = object({
  to: optional(Address),
  from: optional(Address),
  nonce: Hex,
  gas: Hex,
  maxFeePerGas: Hex,
  maxPriorityFeePerGas: Hex,
  data: EvenHex,
  value: Hex,
  type: literal(2),
  // Note: this is technically not compliant to the JSON-RPC spec, but since Quill isn't
  // aware of the chain ID otherwise, we need to include it.
  chainId: number()
});

export const SignTransactionStruct = tuple([
  union([SignTransactionLegacy, SignTransactionEIP1559])
]);

// @todo Replace with simple `Infer` once superstruct bug is fixed
// https://github.com/ianstormtaylor/superstruct/issues/804
export type TSignTransaction = [
  DistributiveOmit<Infer<typeof SignTransactionStruct>[0], 'from' | 'to'> & {
    from?: string;
    to?: string;
  }
];

export const RequestWalletPermissionsStruct = tuple([
  object({
    eth_accounts: object()
  })
]);

export type TRequestWalletPermissions = Infer<typeof RequestWalletPermissionsStruct>;

export const JSONRPCRequestStruct = object({
  id: union([string(), number()]),
  method: string(),
  jsonrpc: literal('2.0'),
  params: optional(array()),
  signature: refine(NonPrefixedHex, 'Has Correct Length', (value) => value.length === 128), // 64 bytes = 128 hex chars
  publicKey: refine(NonPrefixedHex, 'Has Correct Length', (value) => value.length === 64) // 32 bytes = 64 hex chars
});

export type SignedJsonRPCRequest<T = unknown[]> = Omit<
  Infer<typeof JSONRPCRequestStruct>,
  'params'
> & {
  params?: T;
};

export type JsonRPCRequest<T = unknown[]> = Omit<
  Infer<typeof JSONRPCRequestStruct>,
  'params' | 'publicKey' | 'signature'
> & {
  params?: T;
};

export interface JsonRPCBase {
  id: string | number | null;
}

export type JsonRPCError<Error = unknown> = JsonRPCBase & {
  error: {
    code: string;
    message: string;
    data?: Error;
  };
};

export type JsonRPCResult<Result = unknown> = JsonRPCBase & {
  result: Result;
};

export type JsonRPCResponse<Result = unknown, Error = unknown> =
  | JsonRPCResult<Result>
  | JsonRPCError<Error>;
export type JsonRPCMessage<Result = unknown, Error = unknown> = JsonRPCResponse<Result, Error> & {
  jsonrpc: '2.0';
};
