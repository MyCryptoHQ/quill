import { TransactionRequest } from "@ethersproject/abstract-provider";
import { JsonRPCRequest } from "../types/JsonRPCRequest";

export const makeTx = (request: JsonRPCRequest): TransactionRequest => {
  return request.params[0];
};

export const addHexPrefix = (str: string) => {
  return str.slice(0, 2) === "0x" ? str : "0x" + str;
};
