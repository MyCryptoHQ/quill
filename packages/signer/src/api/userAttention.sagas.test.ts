import { requestPermission } from '@signer/common';
import { push } from 'connected-react-router';
import type { BrowserWindow } from 'electron';
import { expectSaga } from 'redux-saga-test-plan';

import { ROUTE_PATHS } from '@app/routing';
import { fPermission, fRequestOrigin, fTxRequest } from '@fixtures';
import { showWindowOnTop } from '@utils';

import { userAttentionSaga } from './userAttention.sagas';
import { requestSignTransaction } from './ws.slice';

const request = { origin: fRequestOrigin, request: fTxRequest };

const mockWindow = ({
  hide: jest.fn(),
  show: jest.fn(),
  focus: jest.fn(),
  setAlwaysOnTop: jest.fn(),
  setVisibleOnAllWorkspaces: jest.fn()
} as unknown) as BrowserWindow;

describe('userAttentionSaga', () => {
  it('calls showWindowOnTop when new transactions are requested signed', async () => {
    await expectSaga(userAttentionSaga, mockWindow)
      .dispatch(requestSignTransaction(request))
      .call(showWindowOnTop, mockWindow)
      .put(push(ROUTE_PATHS.HOME))
      .silentRun();

    expect(mockWindow.show).toHaveBeenCalled();
    expect(mockWindow.focus).toHaveBeenCalled();
    expect(mockWindow.setAlwaysOnTop).toHaveBeenCalled();
    expect(mockWindow.setVisibleOnAllWorkspaces).toHaveBeenCalled();
  });

  it('calls showWindowOnTop when permissions are requested', async () => {
    await expectSaga(userAttentionSaga, mockWindow)
      .dispatch(requestPermission(fPermission))
      .call(showWindowOnTop, mockWindow)
      .not.put(push(ROUTE_PATHS.HOME))
      .silentRun();

    expect(mockWindow.show).toHaveBeenCalled();
    expect(mockWindow.focus).toHaveBeenCalled();
    expect(mockWindow.setAlwaysOnTop).toHaveBeenCalled();
    expect(mockWindow.setVisibleOnAllWorkspaces).toHaveBeenCalled();
  });
});
