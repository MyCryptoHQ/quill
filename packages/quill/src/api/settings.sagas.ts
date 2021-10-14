import type { SettingsValue } from '@quill/common';
import {
  decryptSettings,
  fetchSettings,
  rehydrateEmptyState,
  resetSettings,
  storeEncryptedSettings
} from '@quill/common';
import type { PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { clearStore, getFromStore, setInStore } from '@utils';

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
  const ciphertext: string = yield call(getFromStore, payload);
  if (ciphertext) {
    yield put(decryptSettings({ key: payload, value: ciphertext }));
  } else {
    yield put(rehydrateEmptyState({ key: payload }));
  }
}

export function* storeEncryptedSettingsWorker({ payload }: PayloadAction<SettingsValue<string>>) {
  yield call(setInStore, payload.key, payload.value);
}
