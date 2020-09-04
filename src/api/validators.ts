import { validate } from "jsonschema";
import { SUPPORTED_METHODS, JsonRPCRequest } from "../types";

const requestSchema = {
  type: "object",
  additionalProperties: true,
  properties: {
    jsonrpc: { type: "string", required: true },
    method: { type: "string", required: true },
    id: { type: ["string", "integer"], required: true },
    params: {
      type: "array",
    },
  },
};

export const isValidRequest = (request: JsonRPCRequest): boolean => {
  const result = validate(request, requestSchema);
  return result.valid && isValidParams(request);
};

const paramSchemas = {
  // @todo Further validate that strings are hex?
  [SUPPORTED_METHODS.SIGN_TRANSACTION]: {
    type: "array",
    minItems: 1,
    maxItems: 1,
    items: {
      required: true,
      type: "object",
      properties: {
        to: { type: "string", required: true },
        from: { type: "string", required: false },
        nonce: { type: "string", required: true },
        gasLimit: { type: "string", required: true },
        gasPrice: { type: "string", required: true },
        data: { type: "string", required: true },
        value: { type: "string", required: true },
        chainId: { type: "integer", required: true },
      },
    },
  },
  [SUPPORTED_METHODS.ACCOUNTS]: {},
};

const isValidParams = (request: JsonRPCRequest) => {
  const { method, params } = request;
  if (params && method in paramSchemas) {
    const schema = paramSchemas[method as SUPPORTED_METHODS];
    return validate(params, schema).valid;
  }
  // No schema
  return false;
};
