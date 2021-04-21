import { all } from 'redux-saga/effects';

import { handshakeSaga } from '@common/store';
import type { ReduxIPC } from '@types';

import { signingSaga } from './signing.sagas';

export default function* rootSaga(ipc: ReduxIPC) {
  yield all([handshakeSaga(ipc), signingSaga()]);
}
