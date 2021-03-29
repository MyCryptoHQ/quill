import { createHashHistory } from 'history';

import { fAccounts, fRequestOrigin, fTxRequest } from '@fixtures';
import { makeQueueTx } from '@utils';

import { logout } from './auth.slice';
import { createRootReducer } from './reducer';

describe('rootReducer', () => {
  it('clears the state when logout is dispatched', () => {
    const rootReducer = createRootReducer(createHashHistory());
    const initialState = rootReducer(undefined, {
      type: 'foo'
    });

    initialState.auth.newUser = false;

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
