import keytar from 'keytar';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { KEYTAR_SERVICE } from '@config';
import { fAccount } from '@fixtures';

import { resetWorker } from './auth.sagas';

describe('resetWorker', () => {
  it('calls deletePassword on existing credentials', async () => {
    await expectSaga(resetWorker)
      .provide([[call.fn(keytar.findCredentials), [{ account: fAccount.uuid }]]])
      .call(keytar.deletePassword, KEYTAR_SERVICE, fAccount.uuid)
      .silentRun();
  });
});
