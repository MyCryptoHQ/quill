import { getLoggedIn, logout } from '@signer/common';
import { testSaga } from 'redux-saga-test-plan';
import { call, take } from 'redux-saga/effects';

import { AUTO_LOCK_TIMEOUT } from '@config';

import { autoLockWorker, delayedLock, subscribe } from './autoLock.sagas';

describe('autoLockSaga', () => {
  it('starts race between delayedLock and input', async () => {
    jest.spyOn(window, 'addEventListener');
    const channel = subscribe();
    testSaga(autoLockWorker)
      .next()
      .call(subscribe)
      .next(channel)
      .race({ task: call(delayedLock), cancel: take(channel) })
      .finish()
      .isDone();

    expect(window.addEventListener).toHaveBeenCalled();
  });
});

describe('delayedLock', () => {
  it('logs out if not cancelled', async () => {
    testSaga(delayedLock)
      .next()
      .delay(AUTO_LOCK_TIMEOUT)
      .next()
      .select(getLoggedIn)
      .next(true)
      .put(logout())
      .next()
      .isDone();
  });

  it('doesnt log out if already logged out', async () => {
    testSaga(delayedLock)
      .next()
      .delay(AUTO_LOCK_TIMEOUT)
      .next()
      .select(getLoggedIn)
      .next(false)
      .isDone();
  });
});

describe('subscribe', () => {
  jest.spyOn(window, 'addEventListener');
  jest.spyOn(window, 'removeEventListener');
  it('creates an event channel and tears it down', () => {
    const channel = subscribe();
    expect(window.addEventListener).toHaveBeenCalled();
    channel.close();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
});
