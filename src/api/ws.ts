import WebSocket from 'ws';
import { IpcMain, WebContents } from 'electron';

import { JsonRPCResponse } from '@types';
import { handleRequest, handleResponse } from './api';

export const runAPI = (ipcMain: IpcMain, webContents: WebContents) => {
  console.debug('Spinning up WS');
  const ws = new WebSocket.Server({ host: 'localhost', port: 8000 });
  ws.on('connection', (socket) => {
    const reply = (response: JsonRPCResponse) =>
      socket.send(JSON.stringify(response), (err) => {
        if (err) console.error(err);
      });

    const sendToUI = (messageToUI: string) =>
      webContents.send('message', messageToUI);

    ipcMain.on('message', (event, arg) => {
      console.debug(event);
      console.debug(arg);
      handleResponse(arg, reply);
    });
    socket.on('message', (data) => {
      console.debug(data);
      handleRequest(data as string, sendToUI, reply);
    });
  });
};
