/* eslint-disable jest/expect-expect */

import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { storeExists } from '@api/db';
import { checkNewUserWorker } from '@api/store/auth.slice';
import { setNewUser } from '@store';

jest.mock('@api/db', () => ({
  storeExists: jest
    .fn()
    .mockImplementationOnce(() => false)
    .mockImplementationOnce(() => true)
}));

describe('checkNewUserWorker', () => {
  it('dispatches setNewUser if the store does not exist', async () => {
    await expectSaga(checkNewUserWorker)
      .provide([[call.fn(storeExists), true]])
      .call(storeExists)
      .put(setNewUser(false))
      .silentRun();

    await expectSaga(checkNewUserWorker)
      .provide([[call.fn(storeExists), false]])
      .call(storeExists)
      .put(setNewUser(true))
      .silentRun();
  });
});
