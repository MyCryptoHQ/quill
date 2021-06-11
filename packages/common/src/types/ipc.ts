import type { IpcMainEvent, IpcRendererEvent } from 'electron';

export interface IPC {
  redux: {
    emit(...args: unknown[]): void;
    on(listener: (event: IpcMainEvent | IpcRendererEvent, ...args: unknown[]) => void): () => void;
  };
}

export type ReduxIPC = IPC['redux'];
