import { createIpc } from '@ipc';
import type { BrowserWindow } from 'electron';

import { REDUX_CHANNEL } from '@bridge';
import { Process } from '@common/store';
import type { createCryptoProcess } from '@crypto/process';

jest.unmock('@bridge');

const mockWindow = { webContents: { send: jest.fn() } };
const mockCrypto = { send: jest.fn(), on: jest.fn(), removeListener: jest.fn() };

describe('createIpc', () => {
  it('emits to browser window when targeting Renderer', () => {
    const ipc = createIpc(
      (mockWindow as unknown) as BrowserWindow,
      (mockCrypto as unknown) as ReturnType<typeof createCryptoProcess>
    );
    ipc[Process.Renderer].emit('foo');
    expect(mockWindow.webContents.send).toHaveBeenCalledWith(REDUX_CHANNEL, 'foo');
  });

  it('emits to crypto process when targeting Crypto', () => {
    const ipc = createIpc(
      (mockWindow as unknown) as BrowserWindow,
      (mockCrypto as unknown) as ReturnType<typeof createCryptoProcess>
    );
    ipc[Process.Crypto].emit('bar');
    expect(mockCrypto.send).toHaveBeenCalledWith('bar');
  });

  it('sets up listener for crypto process when targeting Crypto', () => {
    const ipc = createIpc(
      (mockWindow as unknown) as BrowserWindow,
      (mockCrypto as unknown) as ReturnType<typeof createCryptoProcess>
    );
    const unsubscribe = ipc[Process.Crypto].on((_, _args) => {
      return;
    });
    expect(mockCrypto.on).toHaveBeenCalled();
    unsubscribe();
    expect(mockCrypto.removeListener).toHaveBeenCalled();
  });
});
