import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

export const login = (password: string): Promise<boolean> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.LOGIN, password });
};

export const getAccounts = (): Promise<string> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.GET_ACCOUNTS });
};
