import { BigNumber as BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

import { bigify } from './bigify';

describe('bigify', () => {
  it('supports Ethers BN', () => {
    const input = BigNumberish.from('999999999999999999999');
    expect(bigify(input).toString(16)).toEqual(input.toHexString().slice(2));
  });

  it('supports bigint', () => {
    const input = BigInt(999999999999999999999);
    expect(bigify(input).toString(16)).toEqual(input.toString(16));
  });

  it('supports bytes', () => {
    const input = Uint8Array.from([255, 255]);
    expect(bigify(input).toString(16)).toEqual('ffff');
  });

  it('supports BigNumber.js', () => {
    const input = new BigNumber('999999999999999999999');
    expect(bigify(input).toString(16)).toEqual(input.toString(16));
  });
});
