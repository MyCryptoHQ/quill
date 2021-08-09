import { injectProvider } from './provider';

jest.mock('./window', () => ({
  createWindowMessageSender: jest.fn()
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8')
}));

// describe('createProvider', () => {
//   it('creates an EIP-1193 provider', () => {
//     const provider = createProvider();
//
//     expect(provider.isMyCrypto).toBe(true);
//     expect(provider.request).toBeDefined();
//   });
//
//   describe('provider', () => {
//     it('returns the response data', async () => {
//       (createWindowMessageSender as jest.MockedFunction<
//         typeof createWindowMessageSender
//       >).mockImplementation(() => async () => ({
//         id: '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8',
//         target: RelayTarget.Page,
//         data: '0xf000'
//       }));
//
//       const provider = createProvider();
//       await expect(provider.request({ method: 'eth_accounts', params: [] })).resolves.toBe(
//         '0xf000'
//       );
//     });
//
//     it('throws an error if the request failed', async () => {
//       (createWindowMessageSender as jest.MockedFunction<
//         typeof createWindowMessageSender
//       >).mockImplementation(() => async () => ({
//         id: '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8',
//         target: RelayTarget.Page,
//         error: {
//           code: 0,
//           message: 'foo'
//         }
//       }));
//
//       const provider = createProvider();
//       await expect(provider.request({ method: 'eth_accounts', params: [] })).rejects.toThrow('foo');
//     });
//   });
// });

describe('injectProvider', () => {
  it('injects an EIP-1193 provider into the global environment', () => {
    injectProvider();

    expect(window.ethereum.isMyCrypto).toBe(true);
    expect(window.ethereum.request).toBeDefined();
  });
});
