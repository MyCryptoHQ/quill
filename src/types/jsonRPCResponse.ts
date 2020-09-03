export interface JsonRPCResponse {
  id: number;
  jsonrpc: string;
  result?: any;
  error?: {
    code: string;
    message: string;
    data?: any;
  };
}
