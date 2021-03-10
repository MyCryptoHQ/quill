import { BigNumber as BigNumberish, isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
import BigNumber from 'bignumber.js';

export type Bigish = BigNumber;

export const bigify = (
  v: BigNumber.Value | BigNumberish | bigint | ArrayLike<number>
): BigNumber => {
  BigNumber.config({ DECIMAL_PLACES: 18, EXPONENTIAL_AT: 1e9 });
  if (isBigNumberish(v)) {
    return new BigNumber(BigNumberish.from(v).toHexString());
  } else if (typeof v === 'bigint') {
    return new BigNumber(v.toString(16), 16);
  } else {
    return new BigNumber(v as BigNumber.Value);
  }
};
