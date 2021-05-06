import { expectSaga } from 'redux-saga-test-plan';

import { createJsonRpcRequest } from '@api/store/utils';
import {
  addAccount,
  addSavedAccounts,
  nextFlow,
  persistAccount,
  removeAccount
} from '@common/store';
import { JsonRPCMethod } from '@config';
import { fAccount, fAccounts, fPrivateKey, fRequestOrigin } from '@fixtures';
import { WalletType } from '@types';

import { addSavedAccountsWorker, getAccountsWorker } from './accounts.sagas';
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

describe('addSavedAccountsWorker', () => {
  it('adds saved accounts', async () => {
    const account = {
      walletType: WalletType.PRIVATE_KEY,
      address: fAccount.address,
      privateKey: fPrivateKey
    } as const;

    await expectSaga(addSavedAccountsWorker, addSavedAccounts(false))
      .withState({
        accounts: {
          accountsToAdd: [account]
        }
      })
      .put(removeAccount({ ...fAccount, dPath: undefined, index: undefined, persistent: true }))
      .put(addAccount({ ...fAccount, dPath: undefined, index: undefined, persistent: false }))
      .put(nextFlow())
      .silentRun();

    await expectSaga(addSavedAccountsWorker, addSavedAccounts(true))
      .withState({
        accounts: {
          accountsToAdd: [account]
        }
      })
      .put(removeAccount({ ...fAccount, dPath: undefined, index: undefined, persistent: true }))
      .put(addAccount({ ...fAccount, dPath: undefined, index: undefined, persistent: true }))
      .put(persistAccount(account))
      .put(nextFlow())
      .silentRun();
  });
});
