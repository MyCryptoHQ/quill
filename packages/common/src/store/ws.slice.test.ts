import { fRequestPublicKey } from '../__fixtures__';
import slice, { incrementNonce } from './ws.slice';

describe('WebSockets slice', () => {
  describe('incrementNonce', () => {
    it('increments the nonce by one', () => {
      expect(slice.reducer(undefined, incrementNonce(fRequestPublicKey))).toStrictEqual(
        expect.objectContaining({
          nonces: {
            [fRequestPublicKey]: 1
          }
        })
      );

      expect(
        slice.reducer({ nonces: { [fRequestPublicKey]: 1 } }, incrementNonce(fRequestPublicKey))
      ).toStrictEqual(
        expect.objectContaining({
          nonces: {
            [fRequestPublicKey]: 2
          }
        })
      );
    });
  });
});
