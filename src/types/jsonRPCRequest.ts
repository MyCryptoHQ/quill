export interface JsonRPCRequest {
  id: number;
  jsonrpc: string;
  params: any[];
}
