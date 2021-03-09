import { BigNumber as BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

export type Bigish = BigNumber;

export const bigify = (
  v: BigNumber.Value | BigNumberish | bigint | ArrayLike<number>
): BigNumber => {
  BigNumber.config({ DECIMAL_PLACES: 18, EXPONENTIAL_AT: 1e9 });
  if (BigNumberish.isBigNumber(v) && 'toHexString' in v) {
    return new BigNumber(v.toHexString());
  } else if (typeof v === 'object' && '_hex' in v) {
    return new BigNumber(v._hex);
  } else if (typeof v === 'bigint') {
    return new BigNumber(v.toString(16), 16);
  } else if (Object.prototype.hasOwnProperty.call(v, 'length')) {
    return new BigNumber(Buffer.from(v as ArrayLike<number>).toString('hex'));
  } else {
    return new BigNumber(v as BigNumber.Value);
  }
};
