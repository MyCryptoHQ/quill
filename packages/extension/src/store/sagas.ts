import { all } from 'redux-saga/effects';

import { socketsSaga } from './sockets.slice';

export default function* rootSaga(/* ipc: ReduxIPC */): Generator {
  yield all([socketsSaga()]);
}
