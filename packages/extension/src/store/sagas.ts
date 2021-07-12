import { all } from 'redux-saga/effects';

import { socketsSaga } from './sockets.slice';

export default function* rootSaga(): Generator {
  yield all([socketsSaga()]);
}
