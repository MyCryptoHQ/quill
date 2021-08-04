import { FallbackProvider, JsonRpcProvider } from '@ethersproject/providers';
import { expectSaga } from 'redux-saga-test-plan';

import { RelayTarget } from '../types';
import { fSignedTx } from './__fixtures__/transaction';
import slice, {
  broadcastTransaction,
  broadcastTransactionWorker,
  handleJsonRpcRequest,
  handleJsonRpcRequestWorker,
  setNetwork
} from './jsonrpc.slice';

jest.mock('@ethersproject/providers');

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

describe('broadcastTransactionWorker', () => {
  it('broadcasts a signed transaction', async () => {
    await expectSaga(broadcastTransactionWorker, broadcastTransaction(fSignedTx))
      .withState({
        jsonrpc: {
          network: {
            providers: ['https://example.com']
          }
        }
      })
      .silentRun();

    expect(
      (FallbackProvider as jest.MockedClass<typeof FallbackProvider>).mock.instances[0]
        .sendTransaction
    ).toHaveBeenCalledWith(fSignedTx);
  });
});

describe('handleJsonRpcRequestWorker', () => {
  it('handles external JSON-RPC calls', async () => {
    const request = {
      tabId: 1,
      request: {
        jsonrpc: '2.0' as const,
        id: 'foo',
        method: 'eth_chainId',
        params: []
      }
    };

    await expectSaga(handleJsonRpcRequestWorker, handleJsonRpcRequest(request))
      .withState({
        jsonrpc: {
          network: {
            providers: ['https://example.com']
          }
        }
      })
      .silentRun();

    expect(
      (JsonRpcProvider as jest.MockedClass<typeof JsonRpcProvider>).mock.instances[0].send
    ).toHaveBeenCalledWith(request.request.method, request.request.params);
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(request.tabId, {
      id: request.request.id,
      target: RelayTarget.Content,
      data: undefined
    });
  });
});
