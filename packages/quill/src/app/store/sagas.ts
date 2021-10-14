import { handshakeSaga, Process } from '@quill/common';
import { all } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';

import { autoLockSaga } from './autoLock.sagas';

export default function* rootSaga() {
  yield all([
    handshakeSaga({ [Process.Main]: ipcBridgeRenderer.redux }, Process.Renderer),
    autoLockSaga()
  ]);
}
