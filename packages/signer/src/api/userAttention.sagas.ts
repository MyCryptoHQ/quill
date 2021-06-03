import type { BrowserWindow } from 'electron';
import { all, call, takeEvery } from 'redux-saga/effects';

import { requestPermission } from '@common/store';
import { showWindowOnTop } from '@utils';

import { requestSignTransaction } from './ws.slice';

export function* userAttentionSaga(window: BrowserWindow) {
  yield all([
    takeEvery([requestPermission.type, requestSignTransaction.type], userAttentionWorker, window)
  ]);
}

export function* userAttentionWorker(window: BrowserWindow) {
  window.hide();
  yield call(showWindowOnTop, window);
}
