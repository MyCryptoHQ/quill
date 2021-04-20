import { waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import WebSocket from 'ws';

import { SUPPORTED_METHODS, WS_PORT } from '@config';
import { fRequestOrigin } from '@fixtures';

import type { DeepPartial } from '../types';
import { handleRequest } from './api';
import type { ApplicationState } from './store';
import { runAPI } from './ws';

jest.mock('./api', () => ({
  handleRequest: jest.fn()
}));

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

describe('runAPI', () => {
  it('passes information to handleRequest', async () => {
    const store = createMockStore();

    // @ts-expect-error Partial store
    const stop = runAPI(store);

    const client = new WebSocket(`ws://localhost:${WS_PORT}`, {
      headers: { origin: 'https://app.mycrypto.com' }
    });
    await waitFor(() => expect(client.readyState).toBe(client.OPEN));
    const request = JSON.stringify({ id: 1, jsonrpc: '2.0', method: SUPPORTED_METHODS.ACCOUNTS });
    client.send(request);
    await waitFor(() => expect(handleRequest).toHaveBeenCalledWith(request, store, fRequestOrigin));

    client.close();
    stop();
  });
});
