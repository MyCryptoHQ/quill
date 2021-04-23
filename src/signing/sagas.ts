import { all } from 'redux-saga/effects';

import { handshakeSaga, SynchronizationTarget } from '@common/store';
import type { ReduxIPC } from '@types';

import { accountsSaga } from './accounts.sagas';
import { signingSaga } from './signing.sagas';

export default function* rootSaga(ipc: ReduxIPC) {
  yield all([
    handshakeSaga({ [SynchronizationTarget.MAIN]: ipc }, SynchronizationTarget.SIGNING),
    signingSaga(),
    accountsSaga()
  ]);
}
