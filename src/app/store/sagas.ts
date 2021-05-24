import { all } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import { handshakeSaga, Process } from '@common/store';

import { autoLockSaga } from './autoLock.sagas';

export default function* rootSaga() {
  yield all([
    handshakeSaga({ [Process.Main]: ipcBridgeRenderer.redux }, Process.Renderer),
    autoLockSaga()
  ]);
}
