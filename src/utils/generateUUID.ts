import getUuid from 'uuid-by-string';

import { TAddress, TUuid } from '@types';

import { toChecksumAddress } from './toChecksumAddress';

export const generateDeterministicAddressUUID = (address: TAddress) =>
  getUUID(toChecksumAddress(address)) as TUuid;

export const getUUID = (val: string): TUuid => getUuid(val) as TUuid;
