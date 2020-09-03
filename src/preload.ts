// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// https://dennistretyakov.com/ipc-render-in-cra-managed-app

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("appRuntime", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  subscribe: (channel, listener) => {
    const subscription = (event, ...args) => listener(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
});
