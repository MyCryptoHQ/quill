import type { PayloadAction } from '@reduxjs/toolkit';
import type { SettingsValue } from '@signer/common';
import {
  decryptSettings,
  encryptSettings,
  rehydrateState,
  safeJSONParse,
  storeEncryptedSettings
} from '@signer/common';
import { all, call, put, takeEvery } from 'redux-saga/effects';

import { decrypt, encrypt } from '@utils/encryption';

import { getSettingsKey } from './secrets';

export function* settingsSaga() {
  yield all([
    takeEvery(encryptSettings.type, encryptSettingsWorker),
    takeEvery(decryptSettings.type, decryptSettingsWorker)
  ]);
}

export function* encryptSettingsWorker({ payload }: PayloadAction<SettingsValue>) {
  const settingsKey: Buffer = yield call(getSettingsKey);
  const ciphertext = encrypt(JSON.stringify(payload.value), settingsKey);

  yield put(storeEncryptedSettings({ key: payload.key, value: ciphertext }));
}

export function* decryptSettingsWorker({ payload }: PayloadAction<SettingsValue<string>>) {
  const settingsKey: Buffer = yield call(getSettingsKey);

  try {
    const [error, json] = safeJSONParse(decrypt(payload.value, settingsKey));
    if (error) {
      return;
    }

    yield put(rehydrateState({ key: payload.key, state: json }));
  } catch {
    // noop
  }
}
