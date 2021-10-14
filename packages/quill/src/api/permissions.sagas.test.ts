import { replace } from 'connected-react-router';
import { expectSaga } from 'redux-saga-test-plan';

import { ROUTE_PATHS } from '@app/routing';
import { fRequestOrigin, fTxRequest } from '@fixtures';

import {
  getWalletPermissions,
  getWalletPermissionsWorker,
  requestPermissionsWorker,
  requestWalletPermissions,
  requestWalletPermissionsWorker
} from './permissions.sagas';
import { reply } from './ws.slice';

describe('requestPermissionsWorker()', () => {
  it('handles redirect when requesting permissions', () => {
    return expectSaga(requestPermissionsWorker)
      .put(replace(ROUTE_PATHS.REQUEST_PERMISSION))
      .silentRun();
  });
});

describe('requestWalletPermissionsWorker', () => {
  it('handles EIP-2255 permission requests', async () => {
    const request = { origin: fRequestOrigin, request: fTxRequest };

    await expectSaga(requestWalletPermissionsWorker, requestWalletPermissions(request))
      .put(
        reply({
          id: fTxRequest.id,
          result: '0x'
        })
      )
      .silentRun();
  });
});

describe('getWalletPermissionsWorker', () => {
  it('handles EIP-2255 get permission requests', async () => {
    const request = { origin: fRequestOrigin, request: fTxRequest };

    await expectSaga(getWalletPermissionsWorker, getWalletPermissions(request))
      .put(
        reply({
          id: fTxRequest.id,
          result: [
            {
              invoker: 'https://mycrypto.com',
              parentCapability: 'eth_accounts'
            }
          ]
        })
      )
      .silentRun();
  });
});
