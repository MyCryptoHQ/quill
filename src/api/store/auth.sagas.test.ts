import { push } from 'connected-react-router';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import {
  init,
  login as loginFn,
  logout as logoutFn,
  reset as resetFn,
  storeExists
} from '@api/store/utils/store';
import {
  createPassword,
  createPasswordFailed,
  createPasswordSuccess,
  login,
  loginFailed,
  loginSuccess,
  setNewUser
} from '@common/store';
import { translateRaw } from '@common/translate';
import { ROUTE_PATHS } from '@routing';

import {
  checkNewUserWorker,
  createPasswordWorker,
  loginWorker,
  logoutWorker,
  resetWorker
} from './auth.sagas';

jest.mock('electron-store');

describe('checkNewUserWorker', () => {
  it('dispatches setNewUser if the store does not exist', async () => {
    await expectSaga(checkNewUserWorker)
      .provide([[call.fn(storeExists), true]])
      .call(storeExists)
      .put(setNewUser(false))
      .silentRun();

    await expectSaga(checkNewUserWorker)
      .provide([[call.fn(storeExists), false]])
      .call(storeExists)
      .put(setNewUser(true))
      .silentRun();
  });
});

describe('createPasswordWorker', () => {
  it('dispatches createPasswordSuccess on success', () => {
    return expectSaga(createPasswordWorker, createPassword('foobar'))
      .provide([[call.fn(init), true]])
      .call(init, 'foobar')
      .put(createPasswordSuccess())
      .silentRun();
  });

  it('navigates to the setup page on succesful login', () => {
    return expectSaga(createPasswordWorker, createPassword('foobar'))
      .provide([[call.fn(init), true]])
      .call(init, 'foobar')
      .put(push(ROUTE_PATHS.SETUP_ACCOUNT))
      .silentRun();
  });

  it('dispatches createPasswordFailed on error', () => {
    return expectSaga(createPasswordWorker, createPassword('foobar'))
      .provide([[call.fn(init), false]])
      .call(init, 'foobar')
      .put(createPasswordFailed(translateRaw('CREATE_PASSWORD_ERROR')))
      .silentRun();
  });
});

describe('loginWorker', () => {
  it('handles a succesful login', () => {
    return expectSaga(loginWorker, login('foobar'))
      .provide([[call.fn(loginFn), true]])
      .call(loginFn, 'foobar')
      .put(loginSuccess())
      .silentRun();
  });

  it('sets an error on failed login', () => {
    return expectSaga(loginWorker, login('foobar'))
      .provide([[call.fn(loginFn), false]])
      .call(loginFn, 'foobar')
      .put(loginFailed(translateRaw('LOGIN_ERROR')))
      .silentRun();
  });
});

describe('logoutWorker', () => {
  it('handles logout', () => {
    return expectSaga(logoutWorker)
      .provide([[call.fn(logoutFn), true]])
      .call(logoutFn)
      .silentRun();
  });
});

describe('resetWorker', () => {
  it('handles reset', () => {
    return expectSaga(resetWorker)
      .provide([[call.fn(resetFn), true]])
      .call(resetFn)
      .silentRun();
  });
});
