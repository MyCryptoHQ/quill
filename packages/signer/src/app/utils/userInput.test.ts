import { sanitizeGasPriceInput } from '.';

describe('sanitizeGasPriceInput', () => {
  it('replaces decimal separator', () => {
    expect(sanitizeGasPriceInput('1,0')).toBe('1.0');
  });

  it('limits the number of decimals to Gwei limit', () => {
    expect(sanitizeGasPriceInput('1,123456789123456789')).toBe('1.123456789');
  });

  it('doesnt do anything if not needed', () => {
    expect(sanitizeGasPriceInput('5.25')).toBe('5.25');
  });
});
