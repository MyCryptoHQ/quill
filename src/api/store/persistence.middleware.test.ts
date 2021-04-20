import configureStore from 'redux-mock-store';

import { checkNewUser, loginSuccess, setPersisted } from '@common/store';
import type { DeepPartial } from '@types';

import { persistenceMiddleware } from './persistence.middleware';
import type { ApplicationState } from './store';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

describe('persistenceMiddleware', () => {
  it('calls persist on loginSuccess', () => {
    const fn = jest.fn();
    const persist = jest.fn();
    const getState = jest.fn().mockReturnValue({ bootstrapped: false });
    const action = loginSuccess();

    persistenceMiddleware()(createMockStore({ persistence: { persistor: { persist, getState } } }))(
      fn
    )(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(persist).toHaveBeenCalled();
  });

  it('dispatches setPersisted when not set', () => {
    const fn = jest.fn();
    const persist = jest.fn();
    const getState = jest.fn().mockReturnValue({ bootstrapped: true });
    const action = checkNewUser();
    const store = createMockStore({ persistence: { persistor: { persist, getState } } });

    persistenceMiddleware()(store)(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(persist).toHaveBeenCalledTimes(0);
    expect(store.getActions()).toContainEqual(setPersisted(true));
  });

  it('skips middleware if persistor is undefined', () => {
    const fn = jest.fn();
    const action = checkNewUser();
    const store = createMockStore({ persistence: { persistor: undefined } });

    persistenceMiddleware()(store)(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(store.getActions()).toHaveLength(0);
  });

  it('skips middleware if setPersisted is dispatched', () => {
    const fn = jest.fn();
    const action = setPersisted(true);
    const persist = jest.fn();
    const getState = jest.fn().mockReturnValue({ bootstrapped: true });
    const store = createMockStore({ persistence: { persistor: { persist, getState } } });

    persistenceMiddleware()(store)(fn)(action);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(action);
    expect(store.getActions()).toHaveLength(0);
  });
});
