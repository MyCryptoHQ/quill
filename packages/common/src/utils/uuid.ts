import { v4 } from 'uuid';
import getUuid from 'uuid-by-string';

import { toChecksumAddress } from '.';
import type { TAddress, TUuid } from '../types';

export const generateDeterministicAddressUUID = (address: TAddress) =>
  getUUID(toChecksumAddress(address)) as TUuid;

export const getUUID = (val: string): TUuid => getUuid(val) as TUuid;

// This is a randomly-generated uuid (non-deterministic).
export const generateUUID = (): TUuid => {
  return v4() as TUuid;
};
