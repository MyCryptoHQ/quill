import type { TAddress } from '../types';
import { generateDeterministicAddressUUID } from './uuid';

describe('generateUUID', () => {
  it('generates a deterministic address uuid', () => {
    const address = '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress;
    const accountUuid = '4be38596-5d9c-5c01-8e04-19d1c726fe24';
    const actual = generateDeterministicAddressUUID(address);
    expect(actual).toEqual(accountUuid);
  });
});
