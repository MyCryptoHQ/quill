import type { SettingsValue } from '@quill/common';
import {
  decryptSettings,
  fetchSettings,
  getPersistentKeys,
  rehydrateEmptyState,
  resetSettings,
  storeEncryptedSettings
} from '@quill/common';
import type { PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { clearStore, getFromStore, setInStore } from '@utils';

export function* settingsSaga() {
  yield all([
    takeLatest(resetSettings.type, resetSettingsWorker),
    takeEvery(fetchSettings.type, fetchSettingsWorker),
    takeEvery(storeEncryptedSettings.type, storeEncryptedSettingsWorker)
  ]);
}

export function* resetSettingsWorker() {
  const keys: string[] = yield select(getPersistentKeys);
  yield call(clearStore, keys);
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
