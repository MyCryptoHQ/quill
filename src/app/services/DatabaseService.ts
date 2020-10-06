import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

export const init = (password: string): Promise<boolean> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.INIT, password });
};

export const login = (password: string): Promise<boolean> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.LOGIN, password });
};

export const isNewUser = (): Promise<boolean> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.IS_NEW_USER });
};

export const isLoggedIn = (): Promise<boolean> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.IS_LOGGED_IN });
};

export const getAccounts = (): Promise<string> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.GET_ACCOUNTS });
};
