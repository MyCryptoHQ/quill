import type { EnhancedStore } from '@reduxjs/toolkit';
import log from 'electron-log';
import WebSocket from 'ws';

import { WS_PORT } from '@config';

import { handleRequest } from './api';
import type { ApplicationState } from './store';

export const runAPI = (store: EnhancedStore<ApplicationState>) => {
  log.debug('Spinning up WS');
  const ws = new WebSocket.Server({ host: 'localhost', port: WS_PORT });
  ws.on('connection', (socket, request) => {
    // @todo Verify this if possible
    const origin = request.headers.origin && new URL(request.headers.origin).host;
    socket.on('message', async (data) => {
      log.debug(data);
      // Handle request in API and send response back when promise resolves.
      const response = await handleRequest(data as string, store, origin);
      socket.send(JSON.stringify(response), (err) => {
        if (err) log.error(err);
      });
    });
  });
  return () => ws.close();
};
