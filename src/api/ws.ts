import WebSocket from "ws";
import { IpcMain, WebContents } from "electron";

export const runAPI = (ipcMain: IpcMain, webContents: WebContents) => {
  console.debug("Spinning up WS");
  const ws = new WebSocket.Server({ host: "localhost", port: 8000 });
  ws.on("connection", (socket, _) => {
    ipcMain.on("message", (event) => {
      console.debug(event);
    });
    socket.on("message", (data) => {
      console.debug("Received WS msg, sending to renderer");
      webContents.send("message", data);
    });
  });
};
