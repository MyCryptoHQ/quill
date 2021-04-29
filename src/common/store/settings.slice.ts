import { createAction } from '@reduxjs/toolkit';

const sliceName = 'settings';

export interface SettingsValue<T = unknown> {
  key: string;
  value: T;
}

export const resetSettings = createAction(`${sliceName}/resetSettings`);

export const encryptSettings = createAction<SettingsValue>(`${sliceName}/encryptSettings`);
export const storeEncryptedSettings = createAction<SettingsValue<string>>(
  `${sliceName}/storeEncryptedSettings`
);

export const fetchSettings = createAction<string>(`${sliceName}/fetchSettings`);
export const decryptSettings = createAction<SettingsValue>(`${sliceName}/decryptSettings`);
export const storeDecryptedSettings = createAction<SettingsValue<string>>(
  `${sliceName}/storeDecryptedSettings`
);
