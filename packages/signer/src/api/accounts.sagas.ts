import type { PayloadAction } from '@reduxjs/toolkit';
import type { IAccount, UserRequest } from '@signer/common';
import { getAccounts } from '@signer/common';
import { all, put, select, takeLatest } from 'redux-saga/effects';

import { reply, requestAccounts } from './ws.slice';

export function* accountsSaga() {
  yield all([takeLatest(requestAccounts.type, getAccountsWorker)]);
}

export function* getAccountsWorker({ payload }: PayloadAction<UserRequest>) {
  const accounts: IAccount[] = yield select(getAccounts);

  yield put(
    reply({
      id: payload.request.id,
      result: accounts.map((account) => account.address)
    })
  );
}
