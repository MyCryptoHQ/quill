import { contextBridge } from 'electron';

jest.mock('electron', () => ({
  contextBridge: {
    exposeInMainWorld: jest.fn()
  }
}));

describe('preload', () => {
  it('exposes the ipc bridge to the renderer', async () => {
    require('preload');
    expect(contextBridge.exposeInMainWorld).toHaveBeenCalledWith(
      'ipcBridge',
      expect.objectContaining({
        api: expect.anything(),
        db: expect.anything(),
        crypto: expect.anything()
      })
    );
  });
});
