import { getSettingsKey } from '@crypto/secrets';
import { decryptSettingsWorker, encryptSettingsWorker } from '@crypto/settings.sagas';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import {
  decryptSettings,
  encryptSettings,
  rehydrateState,
  storeEncryptedSettings
} from '@common/store';

jest.mock('keytar');
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest.fn().mockImplementation(() => Buffer.from('2d21938ada7a165c39c8f3fd', 'hex'))
}));

describe('encryptSettingsWorker', () => {
  it('encrypts the settings and dispatches storeEncryptedSettings', async () => {
    await expectSaga(
      encryptSettingsWorker,
      encryptSettings({ key: 'foo', value: { foo: 'bar', baz: 'qux' } })
    )
      .provide([
        [
          call.fn(getSettingsKey),
          Buffer.from('9d4698a3accd9e76f1f5c021eac71e715c3fa5bb3089249b90d30737159905b4', 'hex')
        ]
      ])
      .put(
        storeEncryptedSettings({
          key: 'foo',
          value:
            '86a8148489111d799ce4c36f06badff39b115ae40a342c620b12ea1677d5670cad5977eb6d35ac7e8f2d21938ada7a165c39c8f3fd'
        })
      )
      .silentRun();
  });
});

describe('decryptSettingsWorker', () => {
  it('decrypts the settings and dispatches rehydrateState', async () => {
    await expectSaga(
      decryptSettingsWorker,
      decryptSettings({
        key: 'foo',
        value:
          '86a8148489111d799ce4c36f06badff39b115ae40a342c620b12ea1677d5670cad5977eb6d35ac7e8f2d21938ada7a165c39c8f3fd'
      })
    )
      .provide([
        [
          call.fn(getSettingsKey),
          Buffer.from('9d4698a3accd9e76f1f5c021eac71e715c3fa5bb3089249b90d30737159905b4', 'hex')
        ]
      ])
      .put(rehydrateState({ key: 'foo', state: { foo: 'bar', baz: 'qux' } }))
      .silentRun();
  });

  it('does nothing on error', async () => {
    await expectSaga(
      decryptSettingsWorker,
      decryptSettings({
        key: 'foo',
        value:
          '86a8148489111d799ce4c36f06badff39b115ae40a342c620b12ea1677d5670cad5977eb6d35ac7e8f2d21938ada7a165c39c8f3fd'
      })
    )
      .provide([[call.fn(getSettingsKey), Buffer.from('key', 'hex')]])
      .not.put(rehydrateState({ key: 'foo', state: { foo: 'bar', baz: 'qux' } }))
      .silentRun();
  });
});
