import { all } from 'redux-saga/effects';

import { handshakeSaga } from '@common/store';
import type { ReduxIPC } from '@types';

import { accountsSaga } from './accounts.sagas';
import { authSaga } from './auth.sagas';
import { signingSaga } from './signing.sagas';
import { transactionsSaga } from './transactions.sagas';
import { webSocketSaga } from './ws.sagas';

export default function* rootSaga(ipc: ReduxIPC) {
  yield all([
    webSocketSaga(),
    handshakeSaga(ipc),
    authSaga(),
    accountsSaga(),
    transactionsSaga(),
    signingSaga()
  ]);
}
