import { replace } from 'connected-react-router';
import { expectSaga } from 'redux-saga-test-plan';

import { ROUTE_PATHS } from '@app/routing';

import { requestPermissionsWorker } from './permissions.sagas';

describe('requestPermissionsWorker()', () => {
  it('handles redirect when requesting permissions', () => {
    return expectSaga(requestPermissionsWorker)
      .put(replace(ROUTE_PATHS.REQUEST_PERMISSION))
      .silentRun();
  });
});
