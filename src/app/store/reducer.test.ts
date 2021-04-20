import { createHashHistory } from 'history';
import { REHYDRATE } from 'redux-persist';

import { logout } from '@common/store';
import { fAccounts, fRequestOrigin, fTxRequest } from '@fixtures';
import { makeQueueTx } from '@utils';

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

  it('REHYDRATE sets state directly', () => {
    const rootReducer = createRootReducer(createHashHistory());
    const state = rootReducer(undefined, {
      type: 'foo'
    });

    expect(
      rootReducer(state, {
        type: REHYDRATE,
        payload: { ...state.accounts, accounts: fAccounts },
        key: 'accounts'
      })
    ).toStrictEqual({ ...state, accounts: { ...state.accounts, accounts: fAccounts } });
  });
});
