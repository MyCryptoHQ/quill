import type { IIpcBridgeMain, IIpcBridgeRenderer } from '@bridge';

export type ReduxIPC = IIpcBridgeRenderer['redux'] | IIpcBridgeMain['redux'];
