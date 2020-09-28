import { WebContents } from 'electron';
import WebSocket from 'ws';

import { JsonRPCResponse } from '@types';

import { handleRequest } from './api';

export const runAPI = (webContents: WebContents) => {
  console.debug('Spinning up WS');
  const ws = new WebSocket.Server({ host: 'localhost', port: 8000 });
  ws.on('connection', (socket) => {
    const reply = (response: JsonRPCResponse) =>
      socket.send(JSON.stringify(response), (err) => {
        if (err) console.error(err);
      });

    socket.on('message', async (data) => {
      console.debug(data);
      const response = await handleRequest(data as string, webContents);
      reply(response);
    });
  });
};
