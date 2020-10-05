import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

import { getAccounts, getLoginState, init, login } from './DatabaseService';

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

  it('getLoginState calls ipcBridge', () => {
    getLoginState();
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.GET_LOGIN_STATE
    });
  });

  it('getAccounts calls ipcBridge', () => {
    getAccounts();
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({ type: DBRequestType.GET_ACCOUNTS });
  });
});
