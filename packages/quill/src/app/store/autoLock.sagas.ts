import { getAutoLockTimeout, getLoggedIn, logout } from '@quill/common';
import { eventChannel } from 'redux-saga';
import { all, call, delay, put, race, select, take } from 'redux-saga/effects';

export function* autoLockSaga() {
  yield all([autoLockWorker()]);
}

export function* autoLockWorker() {
  const channel = yield call(subscribe);
  while (true) {
    yield race({
      task: call(delayedLock),
      cancel: take(channel)
    });
  }
}

export function* delayedLock() {
  const timeout: number = yield select(getAutoLockTimeout);
  yield delay(timeout);
  const isLoggedIn: boolean = yield select(getLoggedIn);
  if (isLoggedIn) {
    yield put(logout());
  }
}

export const subscribe = () => {
  return eventChannel((emitter) => {
    const events = ['mousemove', 'keydown'];

    const listener = (event: Event) => emitter(event);

    events.forEach((e) => window.addEventListener(e, listener));

    return () => {
      events.forEach((e) => window.removeEventListener(e, listener));
    };
  });
};
