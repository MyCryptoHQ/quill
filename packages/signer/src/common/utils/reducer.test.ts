import { combineReducers } from 'redux';

import { login, logout } from '@common/store';
import { wrapRootReducer } from '@common/utils/reducer';

describe('wrapRootReducer', () => {
  it('creates a reducer that clears the state on logout', () => {
    const reducer = combineReducers({
      synchronization: jest.fn().mockImplementation((state = { foo: 'bar' }) => state),
      baz: jest.fn().mockImplementation((state = { qux: 'quux' }) => state)
    });

    const wrappedReducer = wrapRootReducer(reducer);
    const initialState = wrappedReducer(undefined, login());

    expect(initialState).toStrictEqual({
      synchronization: {
        foo: 'bar'
      },
      baz: {
        qux: 'quux'
      }
    });

    const modifiedState = {
      synchronization: {
        foo: 'foo'
      },
      baz: {
        qux: 'quuz'
      }
    };

    expect(wrappedReducer(modifiedState, login())).toStrictEqual(modifiedState);
    expect(wrappedReducer(modifiedState, logout())).toStrictEqual({
      synchronization: {
        ...modifiedState.synchronization
      },
      baz: {
        ...initialState.baz
      }
    });
  });
});
