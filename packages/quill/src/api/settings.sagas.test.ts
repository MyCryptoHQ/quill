import {
  decryptSettings,
  fetchSettings,
  rehydrateEmptyState,
  storeEncryptedSettings
} from '@quill/common';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import {
  fetchSettingsWorker,
  resetSettingsWorker,
  storeEncryptedSettingsWorker
} from '@api/settings.sagas';
import { clearStore, getFromStore, setInStore } from '@utils';

describe('resetSettingsWorker', () => {
  it('clears the store', async () => {
    await expectSaga(resetSettingsWorker)
      .withState({
        accounts: {
          _persistence: { whitelistedActions: ['addAccount'], whitelistedKeys: ['accounts'] }
        }
      })
      .provide([[call.fn(clearStore), jest.fn()]])
      .call(clearStore, ['accounts'])
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

  it('fetches settings from the store and dispatches rehydrateState if it is null', async () => {
    await expectSaga(fetchSettingsWorker, fetchSettings('foo'))
      .provide([[call.fn(getFromStore), null]])
      .call(getFromStore, 'foo')
      .put(rehydrateEmptyState({ key: 'foo' }))
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
