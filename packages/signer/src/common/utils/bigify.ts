import { BigNumber as BigNumberish } from '@ethersproject/bignumber';
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
import BigNumber from 'bignumber.js';

import type { Bigish } from '@types';

export const bigify = (v: BigNumber.Value | BigNumberish | bigint | ArrayLike<number>): Bigish => {
  BigNumber.config({ DECIMAL_PLACES: 18, EXPONENTIAL_AT: 1e9 });
  if (isBigNumberish(v) && !Object.prototype.hasOwnProperty.call(v, 'c')) {
    return new BigNumber(BigNumberish.from(v).toHexString());
  } else {
    return new BigNumber(v as BigNumber.Value);
  }
};
