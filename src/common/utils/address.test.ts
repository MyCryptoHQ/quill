import { toChecksumAddress } from './address';

describe('toChecksumAddress', () => {
  it('checksums non-checksummed address', () => {
    expect(toChecksumAddress('0x4bbeeb066ed09b7aed07bf39eee0460dfa261520')).toBe(
      '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
    );
  });
});
