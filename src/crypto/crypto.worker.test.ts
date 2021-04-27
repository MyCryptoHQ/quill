import { Process, sendPublicKey } from '@common/store';
import { fEncryptionPublicKey } from '@fixtures';

import { init } from './crypto.worker';

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
});
