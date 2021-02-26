import { all } from 'redux-saga/effects';

import { accountsSaga } from './account.slice';
import { signingSaga } from './signing.slice';
import { transactionsSaga } from './transactions.slice';

export default function* rootSaga() {
  yield all([signingSaga(), accountsSaga(), transactionsSaga()]);
}
