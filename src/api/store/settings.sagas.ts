import type { PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import type { SettingsValue } from '@common/store';
import {
  decryptSettings,
  fetchSettings,
  resetSettings,
  storeEncryptedSettings
} from '@common/store';

import { clearStore, getFromStore, setInStore } from './utils';

export function* settingsSaga() {
  yield all([
    takeLatest(resetSettings.type, resetSettingsWorker),
    takeEvery(fetchSettings.type, fetchSettingsWorker),
    takeEvery(storeEncryptedSettings.type, storeEncryptedSettingsWorker)
  ]);
}

export function* resetSettingsWorker() {
  yield call(clearStore);
}

export function* fetchSettingsWorker({ payload }: PayloadAction<string>) {
  const ciphertext = getFromStore(payload);
  if (ciphertext) {
    yield put(decryptSettings({ key: payload, value: ciphertext }));
  }
}

export function* storeEncryptedSettingsWorker({ payload }: PayloadAction<SettingsValue<string>>) {
  yield call(setInStore, payload.key, payload.value);
}
