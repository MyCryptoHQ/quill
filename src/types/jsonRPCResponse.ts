export interface JsonRPCResponse {
  id: string | number | null;
  jsonrpc: string;
  result?: any;
  error?: {
    code: string;
    message: string;
    data?: any;
  };
}
