import { all } from 'redux-saga/effects';

import type { SynchronizationTarget } from '@common/store';
import { handshakeSaga } from '@common/store';
import type { ReduxIPC } from '@types';

import { accountsSaga } from './accounts.sagas';
import { authSaga } from './auth.sagas';
import { transactionsSaga } from './transactions.sagas';
import { webSocketSaga } from './ws.sagas';

export default function* rootSaga(ipcs: Partial<Record<SynchronizationTarget, ReduxIPC>>) {
  yield all([webSocketSaga(), handshakeSaga(ipcs), authSaga(), accountsSaga(), transactionsSaga()]);
}
