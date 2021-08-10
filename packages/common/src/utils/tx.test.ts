import { fTxRequest } from '../__fixtures__';
import { makeTx } from './tx';

describe('makeTx', () => {
  it('extracts tx from json rpc request', () => {
    const { gas, ...rest } = fTxRequest.params[0];

    expect(makeTx(fTxRequest)).toStrictEqual({ gasLimit: gas, ...rest });
  });
});
