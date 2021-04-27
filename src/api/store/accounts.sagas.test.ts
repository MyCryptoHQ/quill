import { expectSaga } from 'redux-saga-test-plan';

import { createJsonRpcRequest } from '@api/store/utils';
import { JsonRPCMethod } from '@config';
import { fAccounts, fRequestOrigin } from '@fixtures';

import { getAccountsWorker } from './accounts.sagas';
import { reply, requestAccounts } from './ws.slice';

jest.mock('electron-store');

describe('getAccountsWorker', () => {
  it('gets the addresses of all accounts', async () => {
    const request = createJsonRpcRequest(JsonRPCMethod.Accounts);
    await expectSaga(getAccountsWorker, requestAccounts({ origin: fRequestOrigin, request }))
      .withState({ accounts: { accounts: fAccounts } })
      .put(reply({ id: request.id, result: fAccounts.map((account) => account.address) }))
      .silentRun();
  });
});
