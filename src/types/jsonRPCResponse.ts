export interface JsonRPCResponse {
  id: number;
  jsonrpc: string;
  result: string;
  error?: {
    code: string;
    message: string;
    data?: any;
  };
}
