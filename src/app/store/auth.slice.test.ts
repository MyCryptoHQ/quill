/* eslint-disable jest/expect-expect */
import { push } from 'connected-react-router';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { ipcBridgeRenderer } from '@bridge';
import { ROUTE_PATHS } from '@routing';
import { translateRaw } from '@translations';
import { DBRequestType } from '@types';

import slice, {
  createPassword,
  createPasswordFailed,
  createPasswordSuccess,
  createPasswordWorker,
  login,
  loginFailed,
  loginSuccess,
  loginWorker,
  logout,
  logoutWorker,
  setLoggedIn,
  setNewUser
} from './auth.slice';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: { invoke: jest.fn() }
  }
}));

describe('authSlice', () => {
  describe('setNewUser', () => {
    it('sets newUser to the payload', () => {
      expect(slice.reducer({ newUser: false, loggedIn: false }, setNewUser(true))).toStrictEqual({
        newUser: true,
        loggedIn: false
      });

      expect(slice.reducer({ newUser: true, loggedIn: false }, setNewUser(false))).toStrictEqual({
        newUser: false,
        loggedIn: false
      });
    });
  });

  describe('setLoggedIn', () => {
    it('sets loggedIn to the payload', () => {
      expect(slice.reducer({ newUser: false, loggedIn: false }, setLoggedIn(true))).toStrictEqual({
        newUser: false,
        loggedIn: true
      });

      expect(slice.reducer({ newUser: false, loggedIn: true }, setLoggedIn(false))).toStrictEqual({
        newUser: false,
        loggedIn: false
      });
    });
  });

  describe('loginSuccess', () => {
    it('sets loggedIn to true', () => {
      expect(slice.reducer({ newUser: false, loggedIn: false }, loginSuccess())).toStrictEqual({
        newUser: false,
        loggedIn: true,
        error: undefined
      });
    });
  });

  describe('loginFailed', () => {
    it('sets error to the payload', () => {
      const state = { newUser: false, loggedIn: false };
      expect(slice.reducer(state, loginFailed('Foo bar'))).toStrictEqual({
        ...state,
        error: 'Foo bar'
      });
    });
  });

  describe('logout', () => {
    it('sets loggedIn and newUser to false', () => {
      expect(slice.reducer({ newUser: true, loggedIn: true }, logout())).toStrictEqual({
        newUser: false,
        loggedIn: false
      });
    });
  });

  describe('createPasswordSuccess', () => {
    it('sets newUser to false and loggedIn to true', () => {
      expect(
        slice.reducer({ newUser: true, loggedIn: false }, createPasswordSuccess())
      ).toStrictEqual({
        newUser: false,
        loggedIn: true,
        error: undefined
      });
    });

    it('clears the error', () => {
      expect(
        slice.reducer({ newUser: true, loggedIn: false, error: 'foo bar' }, createPasswordSuccess())
      ).toStrictEqual({
        newUser: false,
        loggedIn: true,
        error: undefined
      });
    });
  });

  describe('createPasswordFailed', () => {
    it('sets error to the payload', () => {
      const state = { newUser: true, loggedIn: false };
      expect(slice.reducer(state, createPasswordFailed('Foo bar'))).toStrictEqual({
        ...state,
        error: 'Foo bar'
      });
    });
  });
});

describe('createPasswordWorker', () => {
  it('dispatches createPasswordSuccess on success', () => {
    return expectSaga(createPasswordWorker, createPassword('foobar'))
      .provide([[call.fn(ipcBridgeRenderer.db.invoke), true]])
      .call(ipcBridgeRenderer.db.invoke, {
        type: DBRequestType.INIT,
        password: 'foobar'
      })
      .put(createPasswordSuccess())
      .silentRun();
  });

  it('navigates to the setup page on succesful login', () => {
    return expectSaga(createPasswordWorker, createPassword('foobar'))
      .provide([[call.fn(ipcBridgeRenderer.db.invoke), true]])
      .call(ipcBridgeRenderer.db.invoke, {
        type: DBRequestType.INIT,
        password: 'foobar'
      })
      .put(push(ROUTE_PATHS.SETUP_ACCOUNT))
      .silentRun();
  });

  it('dispatches createPasswordFailed on error', () => {
    return expectSaga(createPasswordWorker, createPassword('foobar'))
      .provide([[call.fn(ipcBridgeRenderer.db.invoke), false]])
      .call(ipcBridgeRenderer.db.invoke, {
        type: DBRequestType.INIT,
        password: 'foobar'
      })
      .put(createPasswordFailed(translateRaw('CREATE_PASSWORD_ERROR')))
      .silentRun();
  });
});

describe('loginWorker', () => {
  it('handles a succesful login', () => {
    return expectSaga(loginWorker, login('foobar'))
      .provide([[call.fn(ipcBridgeRenderer.db.invoke), true]])
      .call(ipcBridgeRenderer.db.invoke, {
        type: DBRequestType.LOGIN,
        password: 'foobar'
      })
      .put(loginSuccess())
      .silentRun();
  });

  it('sets an error on failed login', () => {
    return expectSaga(loginWorker, login('foobar'))
      .provide([[call.fn(ipcBridgeRenderer.db.invoke), false]])
      .call(ipcBridgeRenderer.db.invoke, {
        type: DBRequestType.LOGIN,
        password: 'foobar'
      })
      .put(loginFailed(translateRaw('LOGIN_ERROR')))
      .silentRun();
  });
});

describe('logoutWorker', () => {
  it('handles logout', () => {
    return expectSaga(logoutWorker)
      .call(ipcBridgeRenderer.db.invoke, {
        type: DBRequestType.LOGOUT
      })
      .silentRun();
  });
});
