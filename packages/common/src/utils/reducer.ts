import type { Reducer } from '@reduxjs/toolkit';
import type { AnyAction } from 'redux';

import type { SynchronizationState } from '../store';
import { logout } from '../store';

/**
 * Wraps a root reducer with a reducer that clears the state when `logout` is dispatched. This does
 * not clear the synchronization state, since that is required to log in.
 *
 * @param reducer The reducer to wrap.
 */
export const wrapRootReducer = <
  S extends { synchronization: SynchronizationState },
  A extends AnyAction
>(
  reducer: Reducer<S, A>
): Reducer<S, A> => {
  return (state: S, action: A) => {
    if (action.type === logout.type) {
      return reducer({ synchronization: state.synchronization } as S, action);
    }

    return reducer(state, action);
  };
};
