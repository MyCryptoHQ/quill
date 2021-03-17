import { createHashHistory } from 'history';

import { fAccounts, fTxRequest } from '@fixtures';
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

    // Random modified state to test
    const modifiedState = {
      ...initialState,
      auth: {
        ...initialState.auth,
        newUser: false
      },
      transactions: {
        ...initialState.transactions,
        queue: [makeQueueTx(fTxRequest), makeQueueTx(fTxRequest)]
      },
      accounts: {
        ...initialState.accounts,
        accounts: fAccounts
      }
    };

    expect(rootReducer(modifiedState, logout())).toStrictEqual(initialState);
  });
});
