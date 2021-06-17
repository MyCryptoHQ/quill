import { handshakeSaga, Process } from '@signer/common';
import type { ReduxIPC } from '@signer/common';
import { all } from 'redux-saga/effects';

export default function* rootSaga(ipc: ReduxIPC) {
  yield all([handshakeSaga({ [Process.Main]: ipc }, Process.Extension)]);
}
