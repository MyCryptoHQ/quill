import { createStore } from '@api/index';
import { Process } from '@common/store';

jest.mock('electron-store');

describe('createStore', () => {
  it('creates a store', () => {
    const ipc = {
      emit: jest.fn(),
      on: jest.fn()
    };

    expect(() => createStore({ [Process.Renderer]: ipc })).not.toThrow();
    expect(ipc.on).toHaveBeenCalled();
  });
});
