import { createStore } from './store';

describe('createStore', () => {
  it('creates a store', () => {
    const ipc = {
      emit: jest.fn(),
      on: jest.fn()
    };

    expect(() => createStore(ipc)).not.toThrow();
    expect(ipc.on).toHaveBeenCalled();
  });
});
