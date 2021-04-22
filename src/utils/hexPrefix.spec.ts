import { addHexPrefix } from '@utils/hexPrefix';

describe('addHexPrefix', () => {
  it('adds hex prefix if no prefix exist', () => {
    expect(addHexPrefix('4bbeEB066eD09B7AEd07bF39EEe0460DFa261520')).toBe(
      '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
    );
  });

  it('adds doesnt add hex prefix the string is already prefixed', () => {
    expect(addHexPrefix('0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520')).toBe(
      '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520'
    );
  });
});
