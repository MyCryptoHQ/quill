import { JsonRPCMethod } from '@config';
import { fTxRequest } from '@fixtures';
import { makeTx } from '@utils/tx';

describe('makeTx', () => {
  it('extracts tx from json rpc request', () => {
    expect(
      makeTx({
        id: 1,
        jsonrpc: '2.0',
        method: JsonRPCMethod.SignTransaction,
        params: [fTxRequest]
      })
    ).toBe(fTxRequest);
  });
});
