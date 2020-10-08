import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType, IAccount } from '@types';

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

export const getAccounts = (): Promise<Record<string, IAccount>> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.GET_ACCOUNTS });
};

export const setAccounts = (accounts: Record<string, IAccount>): Promise<void> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.SET_ACCOUNTS, accounts });
};
