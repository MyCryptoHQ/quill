import { testSaga } from 'redux-saga-test-plan';
import { call, take } from 'redux-saga/effects';

import { getLoggedIn, logout } from '@common/store';
import { AUTO_LOCK_TIMEOUT } from '@config';

import { autoLockWorker, delayedLock, subscribe } from './autoLock.sagas';

// Fake inputs
global.window.addEventListener = jest.fn().mockImplementation((e, l) => {
  setTimeout(() => l(e), 100);
});

describe('autoLockSaga', () => {
  it('starts race between delayedLock and input', async () => {
    const channel = subscribe();
    testSaga(autoLockWorker)
      .next()
      .call(subscribe)
      .next(channel)
      .race({ task: call(delayedLock), cancel: take(channel) })
      .finish()
      .isDone();

    expect(global.window.addEventListener).toHaveBeenCalled();
  });

  it('delayedLock logs out if not cancelled', async () => {
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

  it('delayedLock doesnt log out if already logged out', async () => {
    testSaga(delayedLock)
      .next()
      .delay(AUTO_LOCK_TIMEOUT)
      .next()
      .select(getLoggedIn)
      .next(false)
      .isDone();
  });
});
