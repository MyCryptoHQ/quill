import { createAction } from '@reduxjs/toolkit';
import type { UserRequest } from '@signer/common';
import { requestPermission } from '@signer/common';
import { replace } from 'connected-react-router';
import { all, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { ROUTE_PATHS } from '@app/routing';

import { reply } from './ws.slice';

const sliceName = 'permissions';

export const requestWalletPermissions = createAction<UserRequest>(
  `${sliceName}/requestWalletPermissions`
);

export const getWalletPermissions = createAction<UserRequest>(`${sliceName}/getWalletPermissions`);

export function* permissionsSaga() {
  yield all([
    takeLatest(requestPermission.type, requestPermissionsWorker),
    takeEvery(requestWalletPermissions.type, requestWalletPermissionsWorker),
    takeEvery(getWalletPermissions.type, getWalletPermissionsWorker)
  ]);
}

export function* requestPermissionsWorker() {
  yield put(replace(ROUTE_PATHS.REQUEST_PERMISSION));
}

/**
 * Handler for `wallet_requestPermissions`.
 * @todo: Implement EIP-2255 and replace `requestPermissionsWorker`.
 */
export function* requestWalletPermissionsWorker({
  payload
}: ReturnType<typeof requestWalletPermissions>) {
  yield put(
    reply({
      id: payload.request.id,
      result: '0x'
    })
  );
}

/**
 * Handler for `wallet_getPermissions`.
 * @todo: Implement EIP-2255 and replace `requestPermissionsWorker`.
 */
export function* getWalletPermissionsWorker({ payload }: ReturnType<typeof getWalletPermissions>) {
  yield put(
    reply({
      id: payload.request.id,
      result: [
        {
          invoker: 'https://mycrypto.com',
          parentCapability: 'eth_accounts'
        }
      ]
    })
  );
}
