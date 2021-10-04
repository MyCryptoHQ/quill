import { quitApp } from '@signer/common';
import { app } from 'electron';
import { expectSaga } from 'redux-saga-test-plan';

import { appSettingsSaga } from './appSettings.sagas';

jest.mock('electron', () => ({
  app: {
    quit: jest.fn()
  }
}));

describe('appSettings', () => {
  it('calls quit when requested', async () => {
    return expectSaga(appSettingsSaga).dispatch(quitApp()).call(app.quit).silentRun();
  });
});
