import { fork } from 'child_process';

import { createCryptoProcess } from './process';

jest.mock('child_process', () => ({
  fork: jest.fn().mockImplementation(() => ({}))
}));

describe('createCryptoProcess', () => {
  it('forks a child process', () => {
    expect(() => createCryptoProcess()).not.toThrow();
    expect(fork).toHaveBeenCalled();
  });
});
