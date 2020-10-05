import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType, LoginState } from '@types';

export const init = (password: string): Promise<boolean> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.INIT, password });
};

export const login = (password: string): Promise<boolean> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.LOGIN, password });
};

export const getLoginState = (): Promise<LoginState> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.GET_LOGIN_STATE });
};

export const getAccounts = (): Promise<string> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.GET_ACCOUNTS });
};
