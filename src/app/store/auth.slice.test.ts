/* eslint-disable jest/expect-expect */
import { login, loginFailed, loginSuccess, loginWorker, logoutWorker } from '@store/auth.slice';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

jest.mock('@bridge', () => ({
  ipcBridgeRenderer: {
    db: { invoke: jest.fn() }
  }
}));

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
