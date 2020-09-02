import { JsonRPCResponse } from "../types/jsonRPCResponse";

enum SUPPORTED_METHODS {
  SIGN_TRANSACTION = "eth_signTransaction",
}

export const handleRequest = (
  data: string,
  sendToUI: (message: string) => void,
  reply: (response: JsonRPCResponse) => void
) => {
  // @todo: SANITIZE
  const parsed = JSON.parse(data);
  // @todo: VALIDATE
  if (Object.values(SUPPORTED_METHODS).includes(parsed.method)) {
    switch (parsed.method) {
      case SUPPORTED_METHODS.SIGN_TRANSACTION:
        sendToUI(parsed);
        return;
    }
  }
  // https://www.jsonrpc.org/specification
  reply({
    id: parsed.id,
    jsonrpc: "2.0",
    error: { code: "-32601", message: "Unsupported method" },
  });
};

export const handleResponse = (
  result: { id: number; result: string },
  reply: (response: JsonRPCResponse) => void
) => {
  console.debug(result);
  reply({
    ...result,
    jsonrpc: "2.0",
  });
};