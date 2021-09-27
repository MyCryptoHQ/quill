import type { Action } from '@reduxjs/toolkit';
import { requestPermission } from '@signer/common';
import { push } from 'connected-react-router';
import type { BrowserWindow } from 'electron';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import { ROUTE_PATHS } from '@routing';
import { showWindowOnTop } from '@utils';

import { requestSignTransaction } from './ws.slice';

export function* userAttentionSaga(window: BrowserWindow) {
  yield all([
    takeEvery([requestPermission.type, requestSignTransaction.type], userAttentionWorker, window)
  ]);
}

export function* userAttentionWorker(window: BrowserWindow, action: Action) {
  window.hide();
  yield call(showWindowOnTop, window);
  if (action.type === requestSignTransaction.type) {
    yield put(push(ROUTE_PATHS.HOME));
  }
}
