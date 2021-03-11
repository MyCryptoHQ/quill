/* eslint-disable jest/expect-expect */
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

import slice, {
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
        loggedIn: true
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
    it('sets loggedIn to false', () => {
      expect(slice.reducer({ newUser: false, loggedIn: true }, logout())).toStrictEqual({
        newUser: false,
        loggedIn: false
      });
    });
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
      .put(loginFailed('An error occurred'))
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
