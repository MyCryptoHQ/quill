import getUuid from 'uuid-by-string';
import v4 from 'uuid/v4';

import { TAddress, TUuid } from '@types';

import { toChecksumAddress } from './toChecksumAddress';

// This is a randomly-generated uuid (non-deterministic).
export const generateUUID = (): TUuid => {
  return v4() as TUuid;
};

export const generateDeterministicAddressUUID = (address: TAddress) =>
  getUuid(toChecksumAddress(address)) as TUuid;

export const getUUID = (val: string): TUuid => getUuid(val) as TUuid;
