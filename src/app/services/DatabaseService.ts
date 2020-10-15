import { AccountsState } from '@app/store/account';
import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType, TUuid } from '@types';

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

export const getAccounts = (): Promise<AccountsState> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.GET_ACCOUNTS });
};

export const setAccounts = (accounts: AccountsState): Promise<void> => {
  return ipcBridgeRenderer.db.invoke({ type: DBRequestType.SET_ACCOUNTS, accounts });
};

export const savePrivateKey = (uuid: TUuid, privateKey: string): Promise<void> => {
  return ipcBridgeRenderer.db.invoke({
    type: DBRequestType.SAVE_PRIVATE_KEY,
    uuid,
    privateKey
  });
};

export const getPrivateKey = (uuid: TUuid): Promise<string | null> => {
  return ipcBridgeRenderer.db.invoke({
    type: DBRequestType.GET_PRIVATE_KEY,
    uuid
  });
};

export const deletePrivateKey = (uuid: TUuid): Promise<boolean> => {
  return ipcBridgeRenderer.db.invoke({
    type: DBRequestType.DELETE_PRIVATE_KEY,
    uuid
  });
};
