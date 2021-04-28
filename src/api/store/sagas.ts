import { all } from 'redux-saga/effects';

import { handshakeSaga, Process } from '@common/store';
import type { ReduxIPC } from '@types';

import { accountsSaga } from './accounts.sagas';
import { permissionsSaga } from './permissions.sagas';
import { settingsSaga } from './settings.sagas';
import { transactionsSaga } from './transactions.sagas';
import { webSocketSaga } from './ws.sagas';

export default function* rootSaga(processes: Partial<Record<Process, ReduxIPC>>) {
  yield all([
    webSocketSaga(),
    handshakeSaga(processes, Process.Main),
    accountsSaga(),
    transactionsSaga(),
    settingsSaga(),
    permissionsSaga()
  ]);
}
