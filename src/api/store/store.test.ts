import { createStore } from '@api/store';

jest.mock('electron-store');

describe('createStore', () => {
  it('creates a store', () => {
    const ipc = {
      emit: jest.fn(),
      on: jest.fn(),
      handle: jest.fn()
    };

    expect(() => createStore(ipc)).not.toThrow();
    expect(ipc.on).toHaveBeenCalled();
  });
});
