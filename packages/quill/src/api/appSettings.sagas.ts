import { quitApp } from '@quill/common';
import { app } from 'electron';
import { all, call, takeEvery } from 'redux-saga/effects';

export function* appSettingsSaga() {
  yield all([takeEvery([quitApp.type], quitAppWorker)]);
}

export function* quitAppWorker() {
  yield call(app.quit);
}
