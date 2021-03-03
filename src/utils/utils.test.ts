import { SUPPORTED_METHODS } from '@config';
import { fTxRequest } from '@fixtures';
import { addHexPrefix, makeTx } from '@utils';

describe('addHexPrefix', () => {
  it('adds hex prefix if no prefix exist', () => {
    expect(addHexPrefix('4bbeEB066eD09B7AEd07bF39EEe0460DFa261520')).toBe(
      '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
    );
  });

  it('adds doesnt add hex prefix the string is already prefixed', () => {
    expect(addHexPrefix('0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520')).toBe(
      '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
    );
  });
});

describe('makeTx', () => {
  it('extracts tx from json rpc request', () => {
    expect(
      makeTx({
        id: 1,
        jsonrpc: '2.0',
        method: SUPPORTED_METHODS.SIGN_TRANSACTION,
        params: [fTxRequest]
      })
    ).toBe(fTxRequest);
  });
});
