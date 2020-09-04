import { validator } from '@exodus/schemasafe';
import { SUPPORTED_METHODS, JsonRPCRequest } from '@types';

const requestSchema = {
  type: 'object',
  additionalProperties: true,
  required: ['jsonrpc', 'method', 'id'],
  properties: {
    jsonrpc: { type: 'string' },
    method: { type: 'string' },
    id: { type: ['string', 'integer'] },
    params: {
      type: 'array',
    },
  },
};

export const isValidRequest = (request: JsonRPCRequest): boolean => {
  const result = validator(requestSchema)(request);
  return result && isValidParams(request);
};

const paramSchemas = {
  // @todo Further validate that strings are hex?
  [SUPPORTED_METHODS.SIGN_TRANSACTION]: {
    type: 'array',
    minItems: 1,
    maxItems: 1,
    items: {
      type: 'object',
      required: [
        'to',
        'nonce',
        'gasLimit',
        'gasPrice',
        'data',
        'value',
        'chainId',
      ],
      properties: {
        to: { type: 'string' },
        from: { type: 'string' },
        nonce: { type: 'string' },
        gasLimit: { type: 'string' },
        gasPrice: { type: 'string' },
        data: { type: 'string' },
        value: { type: 'string' },
        chainId: { type: 'integer' },
      },
    },
  },
  [SUPPORTED_METHODS.ACCOUNTS]: {},
};

const isValidParams = (request: JsonRPCRequest) => {
  const { method, params } = request;
  if (params && method in paramSchemas) {
    const schema = paramSchemas[method];
    return validator(schema)(params);
  }
  // No schema
  return false;
};
