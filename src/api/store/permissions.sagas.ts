import type { PayloadAction } from '@reduxjs/toolkit';
import { replace } from 'connected-react-router';
import { all, put, takeLatest } from 'redux-saga/effects';

import { ROUTE_PATHS } from '@app/routing';
import { requestPermission } from '@common/store';
import type { Permission } from '@types';

import { requestPermissions } from './ws.slice';

export function* permissionsSaga() {
  yield all([takeLatest(requestPermissions.type, requestPermissionsWorker)]);
}

export function* requestPermissionsWorker({ payload }: PayloadAction<Permission>) {
  yield put(requestPermission(payload));
  yield put(replace(ROUTE_PATHS.REQUEST_PERMISSION));
}
