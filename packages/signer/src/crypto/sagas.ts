import { handshakeSaga, Process } from '@quill/common';
import type { ReduxIPC } from '@quill/common';
import { all } from 'redux-saga/effects';

import { accountsSaga } from './accounts.slice';
import { authSaga } from './auth.sagas';
import { settingsSaga } from './settings.sagas';
import { signingSaga } from './signing.sagas';

export default function* rootSaga(ipc: ReduxIPC) {
  yield all([
    handshakeSaga({ [Process.Main]: ipc }, Process.Crypto),
    signingSaga(),
    accountsSaga(),
    authSaga(),
    settingsSaga()
  ]);
}
