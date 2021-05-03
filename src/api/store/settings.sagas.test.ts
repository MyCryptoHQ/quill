import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import {
  fetchSettingsWorker,
  resetSettingsWorker,
  storeEncryptedSettingsWorker
} from '@api/store/settings.sagas';
import { clearStore, getFromStore, setInStore } from '@api/store/utils';
import { decryptSettings, fetchSettings, storeEncryptedSettings } from '@common/store';

describe('resetSettingsWorker', () => {
  it('clears the store', async () => {
    await expectSaga(resetSettingsWorker)
      .provide([[call.fn(clearStore), jest.fn()]])
      .call(clearStore)
      .silentRun();
  });
});

describe('fetchSettingsWorker', () => {
  it('fetches settings from the store and dispatches decryptSettings', async () => {
    await expectSaga(fetchSettingsWorker, fetchSettings('foo'))
      .provide([[call.fn(getFromStore), 'bar']])
      .call(getFromStore, 'foo')
      .put(decryptSettings({ key: 'foo', value: 'bar' }))
      .silentRun();
  });
});

describe('storeEncryptedSettings', () => {
  it('stores encrypted settings', async () => {
    await expectSaga(
      storeEncryptedSettingsWorker,
      storeEncryptedSettings({ key: 'foo', value: 'bar' })
    )
      .provide([[call.fn(setInStore), jest.fn()]])
      .call(setInStore, 'foo', 'bar')
      .silentRun();
  });
});
