import { ipcMain, webContents } from 'electron';
import { all } from 'redux-saga/effects';

import { ipcBridgeMain } from '@bridge';
import { handshakeSaga } from '@common/store';

import { authSaga } from './auth.slice';

export default function* rootSaga() {
  yield all([handshakeSaga(ipcBridgeMain(ipcMain, webContents).redux), authSaga()]);
}
