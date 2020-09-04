export interface JsonRPCRequest {
  id: number;
  method: string;
  jsonrpc: string;
  params: any[];
}
