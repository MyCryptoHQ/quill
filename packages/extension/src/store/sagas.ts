import { all } from 'redux-saga/effects';

import { jsonRpcSaga } from './jsonrpc.slice';
import { socketsSaga } from './sockets.slice';

export default function* rootSaga(): Generator {
  yield all([jsonRpcSaga(), socketsSaga()]);
}
