import { all } from 'redux-saga/effects';

import { handshakeSaga } from '@common/store';
import { ReduxIPC } from '@types';

import { authSaga } from './auth.slice';

export default function* rootSaga(ipc: ReduxIPC) {
  yield all([handshakeSaga(ipc), authSaga()]);
}
