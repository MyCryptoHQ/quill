import delayP from '@redux-saga/delay-p';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';

import { logout } from '@common/store';

import { autoLockSaga } from './autoLock.sagas';

// Fake inputs
global.window.addEventListener = jest.fn().mockImplementation((e, l) => {
  setTimeout(() => l(e), 100);
});

describe('autoLockSaga', () => {
  it('puts logout after timeout', async () => {
    await expectSaga(autoLockSaga)
      .provide([[call.fn(delayP), null]])
      .put(logout())
      .silentRun();

    expect(global.window.addEventListener).toHaveBeenCalled();
  });

  it('doesnt put logout if no timeout', async () => {
    await expectSaga(autoLockSaga).not.put(logout()).silentRun();

    expect(global.window.addEventListener).toHaveBeenCalled();
  });
});
