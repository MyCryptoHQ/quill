import { logout, makeQueueTx, setNewUser } from '@quill/common';
import { createHashHistory } from 'history';

import { fAccounts, fRequestOrigin, fTxRequest } from '@fixtures';

import { createRootReducer } from './reducer';

describe('rootReducer', () => {
  it('clears the state when logout is dispatched', () => {
    const rootReducer = createRootReducer(createHashHistory());
    const initialState = rootReducer(undefined, setNewUser(false));

    const request = { origin: fRequestOrigin, request: fTxRequest };

    // Random modified state to test
    const modifiedState = {
      ...initialState,
      auth: {
        ...initialState.auth,
        newUser: false
      },
      transactions: {
        ...initialState.transactions,
        queue: [makeQueueTx(request), makeQueueTx(request)]
      },
      accounts: {
        ...initialState.accounts,
        accounts: fAccounts
      }
    };

    expect(rootReducer(modifiedState, logout())).toStrictEqual(initialState);
  });
});
