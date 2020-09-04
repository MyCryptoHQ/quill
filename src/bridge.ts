type Unsubscribe = () => void;
type Listener = (...args: any[]) => void;

interface IpcBridge {
  send(channel: string, data: any): void;
  subscribe(channel: string, listener: Listener): Unsubscribe;
}

export const IpcBridge = (ipcRenderer) => ({
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  subscribe: (channel: string, listener: (...args: any[]) => void) => {
    const subscription = (_: any, ...args: any[]) => listener(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
});

export const ipcBridge = (window as Window).ipcBridge as IpcBridge;
