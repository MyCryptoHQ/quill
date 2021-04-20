import { all } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import { handshakeSaga } from '@common/store';

export default function* rootSaga() {
  yield all([handshakeSaga(ipcBridgeRenderer.redux)]);
}
