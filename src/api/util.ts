import { TransactionRequest } from "@ethersproject/abstract-provider";
import { JsonRPCRequest } from "../types/JsonRPCRequest";

export const makeTx = (request: JsonRPCRequest): TransactionRequest => {
  return request.params[0];
};
