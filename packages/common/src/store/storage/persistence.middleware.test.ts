import { createAction } from '@reduxjs/toolkit';
import configureStore from 'redux-mock-store';

import { encryptSettings, fetchSettings, persistenceMiddleware, rehydrateAllState } from '..';

const createMockStore = configureStore();

describe('persistenceMiddleware', () => {
  it('dispatches fetchSettings if the action is rehydrateAllState', () => {
    const next = jest.fn();
    const store = createMockStore({
      foo: {
        _persistence: {
          whitelistedActions: [],
          whitelistedKeys: []
        }
      },
      bar: {
        _persistence: {
          whitelistedActions: [],
          whitelistedKeys: []
        }
      }
    });

    persistenceMiddleware()(store)(next)(rehydrateAllState());

    expect(next).toHaveBeenCalled();
    expect(store.getActions()).toStrictEqual([fetchSettings('foo'), fetchSettings('bar')]);
  });

  it('persists the whitelisted state if a whitelisted action is dispatched', () => {
    const fooAction = createAction<string>('foo/fooAction');
    const barAction = createAction<string>('foo/barAction');

    const next = jest.fn();
    const store = createMockStore({
      foo: {
        _persistence: {
          whitelistedActions: [fooAction.type],
          whitelistedKeys: ['bar', 'qux']
        },
        bar: 'baz',
        qux: 'quux',
        quuz: 'corge'
      }
    });

    persistenceMiddleware()(store)(next)(barAction());

    expect(store.getActions()).toHaveLength(0);

    persistenceMiddleware()(store)(next)(fooAction());

    expect(next).toHaveBeenCalled();
    expect(store.getActions()).toStrictEqual([
      encryptSettings({
        key: 'foo',
        value: {
          bar: 'baz',
          qux: 'quux'
        }
      })
    ]);
  });
});
