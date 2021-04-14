import { all, call, put, takeLatest } from 'redux-saga/effects';

import { storeExists } from '@api/db';
import { checkNewUser } from '@common/store';
import { setNewUser } from '@store/auth.slice';

export function* authSaga() {
  yield all([takeLatest(checkNewUser.type, checkNewUserWorker)]);
}

export function* checkNewUserWorker() {
  const existingUser: boolean = yield call(storeExists);
  yield put(setNewUser(!existingUser));
}
