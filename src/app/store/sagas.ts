import { all } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import { handshakeSaga, SynchronizationTarget } from '@common/store';

export default function* rootSaga() {
  yield all([
    handshakeSaga(
      { [SynchronizationTarget.MAIN]: ipcBridgeRenderer.redux },
      SynchronizationTarget.RENDERER
    )
  ]);
}
