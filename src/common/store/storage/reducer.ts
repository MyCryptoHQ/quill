import type { Reducer } from '@reduxjs/toolkit';
import type { AnyAction } from 'redux';

import { rehydrateState } from './persistence.slice';

export interface PersistConfig {
  key: string;
  whitelistedActions: string[];
  whitelistedKeys: string[];
}

export interface PersistState {
  _persistence?: {
    whitelistedActions: string[];
    whitelistedKeys: string[];
  };
}

export const injectPersistent = <A>(
  { key, ...config }: PersistConfig,
  state: A
): A & PersistState => {
  return {
    _persistence: config,
    ...state
  };
};

/**
 * Creates a persist reducer, which will update the state when `rehydrateState` is dispatched with
 * the key specified in the persist config. Note that this does a shallow merge of the rehydrated
 * state with the old state.
 *
 * @param config The persist config to use for the reducer.
 * @param reducer The reducer to wrap.
 */
export const createPersistReducer = <S, A extends AnyAction>(
  config: PersistConfig,
  reducer: Reducer<S, A>
): Reducer<S, A> => {
  return (state, action) => {
    if (action.type === rehydrateState.type && action.payload.key === config.key) {
      return injectPersistent(config, { ...state, ...action.payload.state });
    }

    return injectPersistent(config, reducer(state, action));
  };
};
