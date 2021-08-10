import { RelayTarget } from '../types';
import { injectProvider, WindowProvider } from './provider';
import { createWindowMessageSender } from './window';

jest.mock('./window', () => ({
  createWindowMessageSender: jest.fn()
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockImplementation(() => '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8')
}));

describe('Provider', () => {
  describe('request', () => {
    it('returns the response data', async () => {
      (createWindowMessageSender as jest.MockedFunction<
        typeof createWindowMessageSender
      >).mockImplementation(() => async () => ({
        id: '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8',
        target: RelayTarget.Page,
        data: '0xf000'
      }));

      const provider = new WindowProvider();
      await expect(provider.request({ method: 'eth_accounts', params: [] })).resolves.toBe(
        '0xf000'
      );
    });

    it('throws an error if the request failed', async () => {
      (createWindowMessageSender as jest.MockedFunction<
        typeof createWindowMessageSender
      >).mockImplementation(() => async () => ({
        id: '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8',
        target: RelayTarget.Page,
        error: {
          code: 0,
          message: 'foo'
        }
      }));

      const provider = new WindowProvider();
      await expect(provider.request({ method: 'eth_accounts', params: [] })).rejects.toThrow('foo');
    });
  });

  describe('enable', () => {
    it('calls eth_requestAccounts', async () => {
      const fn = jest.fn().mockResolvedValue({
        id: '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8',
        target: RelayTarget.Page,
        data: '0xf000'
      });

      (createWindowMessageSender as jest.MockedFunction<
        typeof createWindowMessageSender
      >).mockImplementation(() => async (...args: unknown[]) => fn(...args));

      const provider = new WindowProvider();
      await provider.enable();

      expect(fn).toHaveBeenCalledWith({
        id: '4653e3d5-b720-4b7f-8dce-41b7c8d9d8d8',
        payload: {
          method: 'eth_requestAccounts',
          params: []
        }
      });
    });
  });
});

describe('injectProvider', () => {
  it('injects an EIP-1193 provider into the global environment', () => {
    injectProvider();

    expect(window.ethereum.isMyCrypto).toBe(true);
    expect(window.ethereum.request).toBeDefined();
  });
});
