import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

import { getAccounts, init, isLoggedIn, isNewUser, login, setAccounts } from './DatabaseService';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: {
      invoke: jest.fn()
    }
  }
}));

describe('DatabaseService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('init calls ipcBridge', () => {
    init('password');
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.INIT,
      password: 'password'
    });
  });

  it('login calls ipcBridge', () => {
    login('password');
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.LOGIN,
      password: 'password'
    });
  });

  it('isLoggedIn calls ipcBridge', () => {
    isLoggedIn();
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.IS_LOGGED_IN
    });
  });

  it('isNewUser calls ipcBridge', () => {
    isNewUser();
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.IS_NEW_USER
    });
  });

  it('getAccounts calls ipcBridge', () => {
    getAccounts();
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({ type: DBRequestType.GET_ACCOUNTS });
  });

  it('setAccounts calls ipcBridge', () => {
    setAccounts({});
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.SET_ACCOUNTS,
      accounts: {}
    });
  });
});
