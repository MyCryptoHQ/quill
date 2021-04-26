// @fixme DONT DO THIS
import { getAddress } from '@crypto/crypto';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { createJsonRpcRequest } from '@api/store/utils';
import { addAccount, fetchAccounts, fetchFailed, removeAccount } from '@common/store';
import { JsonRPCMethod } from '@config';
import { fAccount, fAccounts, fPrivateKey, fRequestOrigin } from '@fixtures';
import type { SerializedWallet } from '@types';
import { WalletType } from '@types';

import { fetchAccountsWorker, getAccountsWorker } from './accounts.sagas';
import { reply, requestAccounts } from './ws.slice';

jest.mock('electron-store');
jest.mock('keytar');

const wallet: SerializedWallet = {
  walletType: WalletType.PRIVATE_KEY,
  privateKey: fPrivateKey
};

describe('getAccountsWorker', () => {
  it('gets the addresses of all accounts', async () => {
    const request = createJsonRpcRequest(JsonRPCMethod.Accounts);
    await expectSaga(getAccountsWorker, requestAccounts({ origin: fRequestOrigin, request }))
      .withState({ accounts: { accounts: fAccounts } })
      .put(reply({ id: request.id, result: fAccounts.map((account) => account.address) }))
      .silentRun();
  });
});

describe('fetchAccountWorker()', () => {
  it('handles getting account address', () => {
    const input = { ...wallet, persistent: false };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .withState({ accounts: { accounts: [] } })
      .provide([[call.fn(getAddress), fAccount.address]])
      .call(getAddress, input)
      .put(addAccount({ ...fAccount, dPath: undefined, index: undefined }))
      .silentRun();
  });

  it('overwrites existing account', () => {
    const input = { ...wallet, persistent: false };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .withState({ accounts: { accounts: [fAccount] } })
      .provide([[call.fn(getAddress), fAccount.address]])
      .call(getAddress, input)
      .put(removeAccount(fAccount))
      .put(addAccount({ ...fAccount, dPath: undefined, index: undefined }))
      .silentRun();
  });

  it('handles errors', () => {
    const input = { ...wallet, persistent: false };
    return expectSaga(fetchAccountsWorker, fetchAccounts([input]))
      .withState({ accounts: { accounts: [] } })
      .provide({
        call() {
          throw new Error('error');
        }
      })
      .call(getAddress, input)
      .put(fetchFailed('error'))
      .silentRun();
  });
});
