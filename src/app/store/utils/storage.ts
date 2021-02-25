import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

export const storage = {
  getItem: (key: string) => {
    return ipcBridgeRenderer.db.invoke({ type: DBRequestType.GET_FROM_STORE, key });
  },
  setItem: (key: string, value: unknown) => {
    return ipcBridgeRenderer.db.invoke({ type: DBRequestType.SET_IN_STORE, key, payload: value });
  },
  removeItem: (_key: string) => {
    // @todo If needed
    throw new Error('Invalid key');
  }
};
