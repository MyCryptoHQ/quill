import { all } from 'redux-saga/effects';

import { ipcBridgeRenderer } from '@bridge';
import { handshakeSaga } from '@common/store';

import { signingSaga } from './signing.slice';
import { transactionsSaga } from './transactions.slice';

export default function* rootSaga() {
  yield all([
    handshakeSaga(ipcBridgeRenderer.redux),
    signingSaga(),
    transactionsSaga()
  ]);
}
