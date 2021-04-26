import keytar from 'keytar';
import { all, call, takeLatest } from 'redux-saga/effects';

import { reset } from '@common/store';
import { KEYTAR_SERVICE } from '@config';

export function* authSaga() {
  yield all([takeLatest(reset.type, resetWorker)]);
}

export function* resetWorker() {
  const credentials = yield call(keytar.findCredentials, KEYTAR_SERVICE);
  for (const { account } of credentials) {
    yield call(keytar.deletePassword, KEYTAR_SERVICE, account);
  }
}
