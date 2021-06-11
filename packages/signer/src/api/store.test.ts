import { Process } from '@signer/common';

import { createStore } from './store';

jest.mock('electron-store');

describe('createStore', () => {
  it('creates a store', () => {
    const ipc = {
      emit: jest.fn(),
      on: jest.fn()
    };

    expect(() => createStore(undefined, { [Process.Renderer]: ipc })).not.toThrow();
    expect(ipc.on).toHaveBeenCalled();
  });
});
