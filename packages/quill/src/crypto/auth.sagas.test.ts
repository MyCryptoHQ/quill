import {
  changePassword,
  changePasswordFailed,
  changePasswordSuccess,
  createPassword,
  createPasswordSuccess,
  login,
  loginFailed,
  loginSuccess,
  logout,
  rehydrateAllState,
  resetSettings,
  setNewUser,
  translateRaw
} from '@quill/common';
import { push } from 'connected-react-router';
import keytar from 'keytar';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { KEYTAR_SERVICE } from '@config';
import { fAccount, fEncryptionPrivateKey, fPrivateKey } from '@fixtures';
import { ROUTE_PATHS } from '@routing';

import {
  changePasswordWorker,
  checkNewUserWorker,
  createPasswordWorker,
  getAccountPrivateKey,
  loginWorker,
  logoutWorker,
  resetWorker
} from './auth.sagas';
import {
  checkSettingsKey,
  clearEncryptionKey,
  comparePassword,
  deleteSalt,
  getSettingsKey,
  hasSettingsKey,
  init,
  safeGetPrivateKey,
  savePrivateKey
} from './secrets';

jest.mock('./secrets');
jest.mock('keytar');

describe('checkNewUserWorker', () => {
  it('checks if the settings key exists and dispatches setNewUser', async () => {
    await expectSaga(checkNewUserWorker)
      .provide([[call.fn(hasSettingsKey), true]])
      .put(setNewUser(false))
      .silentRun();

    await expectSaga(checkNewUserWorker)
      .provide([[call.fn(hasSettingsKey), false]])
      .put(setNewUser(true))
      .silentRun();
  });
});

describe('loginWorker', () => {
  it('sets the encryption key and logs in', async () => {
    await expectSaga(loginWorker, login('foo'))
      .provide([[call.fn(init), undefined]])
      .provide([[call.fn(checkSettingsKey), true]])
      .call(init, 'foo')
      .call(checkSettingsKey)
      .put(loginSuccess())
      .put(rehydrateAllState())
      .silentRun();
  });

  it('puts an error if the settings key is invalid', async () => {
    await expectSaga(loginWorker, login('foo'))
      .provide([[call.fn(init), undefined]])
      .provide([[call.fn(checkSettingsKey), false]])
      .call(init, 'foo')
      .call(checkSettingsKey)
      .put(loginFailed(translateRaw('LOGIN_ERROR')))
      .silentRun();
  });
});

describe('createPasswordWorker', () => {
  it('sets up the store', async () => {
    (keytar.findCredentials as jest.MockedFunction<
      typeof keytar.findCredentials
    >).mockImplementationOnce(async () => [
      {
        account: fAccount.uuid,
        password: 'foo'
      }
    ]);

    await expectSaga(createPasswordWorker, createPassword('foo'))
      .provide([[call.fn(keytar.findCredentials), [{ account: fAccount.uuid }]]])
      .provide([[call.fn(init), undefined]])
      .provide([[call.fn(getSettingsKey), undefined]])
      .call(init, 'foo')
      .call(getSettingsKey)
      .put(createPasswordSuccess())
      .put(push(ROUTE_PATHS.SETUP_ACCOUNT))
      .silentRun();
  });
});

describe('getAccountPrivateKey', () => {
  it('returns the UUID and private key for an account', async () => {
    (safeGetPrivateKey as jest.MockedFunction<typeof safeGetPrivateKey>).mockImplementation(
      async () => fPrivateKey
    );

    await expectSaga(getAccountPrivateKey, fAccount.uuid)
      .call(safeGetPrivateKey, fAccount.uuid)
      .returns([fAccount.uuid, fPrivateKey])
      .silentRun();
  });

  it('returns null for accounts that cannot be decrypted', async () => {
    (safeGetPrivateKey as jest.MockedFunction<typeof safeGetPrivateKey>).mockImplementation(
      async () => null
    );

    await expectSaga(getAccountPrivateKey, fAccount.uuid)
      .call(safeGetPrivateKey, fAccount.uuid)
      .returns(null)
      .silentRun();
  });
});

describe('changePasswordWorker', () => {
  it('changes the password', async () => {
    (keytar.findCredentials as jest.MockedFunction<
      typeof keytar.findCredentials
    >).mockImplementationOnce(async () => [
      {
        account: fAccount.uuid,
        password: 'foo'
      },
      {
        account: fAccount.uuid,
        password: 'foo'
      },
      {
        account: fAccount.uuid,
        password: 'foo'
      }
    ]);

    (safeGetPrivateKey as jest.MockedFunction<typeof safeGetPrivateKey>)
      .mockImplementationOnce(async () => fPrivateKey)
      .mockImplementationOnce(async () => null)
      .mockImplementationOnce(async () => fEncryptionPrivateKey);

    await expectSaga(
      changePasswordWorker,
      changePassword({ currentPassword: 'foo', password: 'foo' })
    )
      .provide([[call.fn(keytar.findCredentials), [{ account: fAccount.uuid }]]])
      .provide([[call.fn(init), undefined]])
      .provide([[call.fn(comparePassword), true]])
      .call(deleteSalt)
      .call(init, 'foo')
      .call(savePrivateKey, fAccount.uuid, fPrivateKey)
      .call(savePrivateKey, fAccount.uuid, fEncryptionPrivateKey)
      .put(changePasswordSuccess())
      .put(logout())
      .silentRun();
  });

  it('sets an error', async () => {
    await expectSaga(
      changePasswordWorker,
      changePassword({ currentPassword: 'foo', password: 'foo' })
    )
      .provide([[call.fn(comparePassword), throwError(new Error('foo'))]])
      .put(changePasswordFailed('Error: foo'))
      .silentRun();

    await expectSaga(
      changePasswordWorker,
      changePassword({ currentPassword: 'foo', password: 'foo' })
    )
      .provide([[call.fn(comparePassword), false]])
      .put(changePasswordFailed(translateRaw('CURRENT_PASSWORD_NOT_EQUAL')))
      .silentRun();
  });
});

describe('logoutWorker', () => {
  it('clears the encryption key', async () => {
    await expectSaga(logoutWorker).call(clearEncryptionKey).silentRun();
  });
});

describe('resetWorker', () => {
  it('calls deletePassword on existing credentials', async () => {
    await expectSaga(resetWorker)
      .provide([[call.fn(keytar.findCredentials), [{ account: fAccount.uuid }]]])
      .put(resetSettings())
      .call(keytar.deletePassword, KEYTAR_SERVICE, fAccount.uuid)
      .silentRun();
  });
});
