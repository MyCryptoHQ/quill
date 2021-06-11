import { createAction, createReducer } from '@reduxjs/toolkit';

import type { PersistConfig } from '..';
import { createPersistReducer, injectPersistent, rehydrateState } from '..';

describe('injectPersistent', () => {
  it('injects the persistence config into the state', () => {
    const state = {
      foo: 'bar',
      baz: 'qux'
    };

    const { key, ...config }: PersistConfig = {
      key: 'foo',
      whitelistedActions: [],
      whitelistedKeys: ['baz']
    };

    expect(injectPersistent({ key, ...config }, state)).toStrictEqual({
      _persistence: {
        ...config
      },
      ...state
    });
  });
});

describe('createPersistReducer', () => {
  it('injects the persistence config into the state', () => {
    const setFoo = createAction<string>('setFoo');
    const initialState = {
      foo: 'bar',
      baz: 'qux'
    };

    const reducer = createReducer(initialState, (builder) =>
      builder.addCase(setFoo, (state, action) => {
        state.foo = action.payload;
      })
    );

    const { key, ...config }: PersistConfig = {
      key: 'foo',
      whitelistedActions: [setFoo.type],
      whitelistedKeys: ['baz']
    };

    const persistReducer = createPersistReducer({ key, ...config }, reducer);
    expect(persistReducer(initialState, setFoo('quux'))).toStrictEqual({
      _persistence: {
        ...config
      },
      foo: 'quux',
      baz: 'qux'
    });
  });

  it('replaces the state if rehydrateState is called with the key of the reducer', () => {
    const setFoo = createAction<string>('setFoo');
    const initialState = {
      foo: 'bar',
      baz: 'qux'
    };

    const reducer = createReducer(initialState, (builder) =>
      builder.addCase(setFoo, (state, action) => {
        state.foo = action.payload;
      })
    );

    const { key, ...config }: PersistConfig = {
      key: 'foo',
      whitelistedActions: [setFoo.type],
      whitelistedKeys: ['baz']
    };

    const persistReducer = createPersistReducer({ key, ...config }, reducer);
    expect(
      persistReducer(initialState, rehydrateState({ key: 'bar', state: { foo: 'quux' } }))
    ).toStrictEqual({
      _persistence: {
        ...config
      },
      foo: 'bar',
      baz: 'qux'
    });

    expect(
      persistReducer(initialState, rehydrateState({ key: 'foo', state: { foo: 'quux' } }))
    ).toStrictEqual({
      _persistence: {
        ...config
      },
      foo: 'quux',
      baz: 'qux'
    });
  });
});
