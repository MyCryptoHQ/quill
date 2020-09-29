export interface JsonRPCResponse {
  id: number | null;
  jsonrpc: string;
  result?: any;
  error?: {
    code: string;
    message: string;
    data?: any;
  };
}
