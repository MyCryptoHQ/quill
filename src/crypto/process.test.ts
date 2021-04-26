import { fork } from 'child_process';

import { createCryptoProcess } from './process';

const mockOn = jest.fn();
jest.mock('child_process', () => ({
  fork: jest.fn().mockImplementation(() => ({
    on: mockOn
  }))
}));

describe('createCryptoProcess', () => {
  it('forks a child process', () => {
    expect(() => createCryptoProcess()).not.toThrow();
    expect(fork).toHaveBeenCalled();
    expect(mockOn).toHaveBeenCalled();
  });
});
