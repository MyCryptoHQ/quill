import { all } from 'redux-saga/effects';

import { signingSaga } from './signing.slice';

export default function* rootSaga() {
  yield all([signingSaga()]);
}
