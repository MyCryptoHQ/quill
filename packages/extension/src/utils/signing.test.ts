import { createRandomPrivateKey } from './signing';

jest.mock('noble-ed25519', () => ({
  utils: {
    randomPrivateKey: jest
      .fn()
      .mockImplementation(() =>
        Buffer.from('7e623c72637634f530bc66c951b0c623883a52844f16ac144a118df8ceb937b5', 'hex')
      )
  }
}));

describe('createRandomPrivateKey', () => {
  it('creates a random private key', () => {
    expect(createRandomPrivateKey()).toStrictEqual(
      '7e623c72637634f530bc66c951b0c623883a52844f16ac144a118df8ceb937b5'
    );
  });
});
