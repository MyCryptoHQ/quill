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

export const createPersistReducer = <S, A extends AnyAction>(
  config: PersistConfig,
  reducer: Reducer<S, A>
): Reducer<S, A> => {
  return (state, action) => {
    if (action.type === rehydrateState.type && action.payload.key === config.key) {
      return injectPersistent(config, action.payload.state);
    }

    return injectPersistent(config, reducer(state, action));
  };
};
