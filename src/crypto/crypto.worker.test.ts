import { Process, sendPublicKey } from '@common/store';
import { fEncryptionPublicKey } from '@fixtures';

import { init } from './crypto.worker';
import { createStore } from './store';

jest.mock('./store', () => ({
  createStore: jest.fn().mockImplementation(jest.requireActual('./store').createStore)
}));

describe('init', () => {
  it('sets up store with listeners', () => {
    global.process.on = jest.fn();
    global.process.send = jest.fn();

    expect(() => init()).not.toThrow();
    expect(global.process.on).toHaveBeenCalled();
  });

  it('calls emit when dispatching actions', () => {
    global.process.on = jest.fn();
    global.process.send = jest.fn();

    expect(() => init()).not.toThrow();
    expect(global.process.on).toHaveBeenCalled();

    const connectionCallback = (global.process.on as jest.MockedFunction<typeof global.process.on>)
      .mock.calls[0][1];

    const action = sendPublicKey(fEncryptionPublicKey);

    connectionCallback(JSON.stringify(action));

    expect(global.process.send).toHaveBeenCalledWith(
      JSON.stringify({ ...action, remote: true, from: Process.Crypto })
    );
  });

  it('returns an unsubscribe function', () => {
    global.process.on = jest.fn();
    global.process.removeListener = jest.fn();

    const fn = jest.fn().mockImplementation(() => ({ dispatch: jest.fn() }));
    const createStoreMock = (createStore as jest.MockedFunction<
      typeof createStore
    >).mockImplementationOnce(fn);

    init();

    const listener = jest.fn();
    const unsubscribe = createStoreMock.mock.calls[0][0].on(listener);
    unsubscribe();

    expect(process.removeListener).toHaveBeenCalledWith('message', listener);
  });
});
