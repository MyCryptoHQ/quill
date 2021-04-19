import { all } from 'redux-saga/effects';

import { handshakeSaga } from '@common/store';
import type { ReduxIPC } from '@types';

export default function* rootSaga(ipc: ReduxIPC) {
  yield all([handshakeSaga(ipc)]);
}
