import { all } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import { handshakeSaga, Process } from '@common/store';

export default function* rootSaga() {
  yield all([handshakeSaga({ [Process.Main]: ipcBridgeRenderer.redux }, Process.Renderer)]);
}
