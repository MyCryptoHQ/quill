import { waitFor } from '@testing-library/react';
import { WebContents } from 'electron';
import WebSocket from 'ws';

import { SUPPORTED_METHODS, WS_PORT } from '@config';

import { handleRequest } from './api';
import { runAPI } from './ws';

jest.mock('./api', () => ({
  handleRequest: jest.fn()
}));

const mockWebContents = { send: jest.fn() };

describe('runAPI', () => {
  it('passes information to handleRequest', async () => {
    const stop = runAPI((mockWebContents as unknown) as WebContents);

    const client = new WebSocket(`ws://localhost:${WS_PORT}`);
    await waitFor(() => expect(client.readyState).toBe(client.OPEN));
    const request = JSON.stringify({ id: 1, jsonrpc: '2.0', method: SUPPORTED_METHODS.ACCOUNTS });
    client.send(request);
    await waitFor(() => expect(handleRequest).toHaveBeenCalledWith(request, mockWebContents));

    client.close();
    stop();
  });
});
