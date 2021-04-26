import { init } from './crypto.worker';

describe('init', () => {
  it('sets up store with listeners', () => {
    global.process.on = jest.fn();
    global.process.send = jest.fn();

    expect(() => init()).not.toThrow();
    expect(global.process.on).toHaveBeenCalled();
  });
});
