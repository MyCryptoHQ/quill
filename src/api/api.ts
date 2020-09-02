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
  // @todo Figure out format and error code
  reply({
    id: 1,
    jsonrpc: "2.0",
    result: "",
    error: { code: "-1", message: "Unsupported operation" },
  });
};

export const handleResponse = (
  result: string,
  reply: (response: JsonRPCResponse) => void
) => {
  console.debug(result);
  reply({
    id: 1,
    jsonrpc: "2.0",
    result:
      "0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b",
  });
};
