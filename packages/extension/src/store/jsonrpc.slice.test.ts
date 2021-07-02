import slice, { setNetwork } from './jsonrpc.slice';

describe('JsonRpcSlice', () => {
  describe('setNetwork', () => {
    it('sets the network to use', () => {
      expect(
        slice.reducer(
          undefined,
          setNetwork({
            providers: ['https://goerli.mycryptoapi.com/eth'],
            chainId: 5
          })
        ).network
      ).toStrictEqual({
        providers: ['https://goerli.mycryptoapi.com/eth'],
        chainId: 5
      });
    });
  });
});
