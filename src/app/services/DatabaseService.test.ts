import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType, TUuid } from '@types';

import {
  deletePrivateKey,
  getPrivateKey,
  init,
  isLoggedIn,
  isNewUser,
  login,
  reset,
  savePrivateKey
} from './DatabaseService';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: {
      invoke: jest.fn()
    }
  }
}));

const uuid = 'a259a13e-936b-5945-8c80-7f757e808507' as TUuid;
const privateKey = 'privkey';

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

  it('reset calls ipcBridge', () => {
    reset();
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.RESET
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

  it('calls ipcBridge with savePrivateKey', () => {
    savePrivateKey(uuid, privateKey);
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.SAVE_PRIVATE_KEY,
      privateKey,
      uuid
    });
  });

  it('calls ipcBridge with getPrivateKey', () => {
    getPrivateKey(uuid);
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.GET_PRIVATE_KEY,
      uuid
    });
  });

  it('calls ipcBridge with deletePrivateKey', () => {
    deletePrivateKey(uuid);
    expect(ipcBridgeRenderer.db.invoke).toHaveBeenCalledWith({
      type: DBRequestType.DELETE_PRIVATE_KEY,
      uuid
    });
  });
});
