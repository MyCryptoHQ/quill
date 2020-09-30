import app from './setupElectron';

jest.setTimeout(10000);

describe('Basic E2E tests', () => {
  beforeAll(() => {
    return app.start();
  });

  afterAll(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('opens a window', async () => {
    const count = await app.client.getWindowCount();
    expect(count).toEqual(1);
  });

  it('has the correct title', async () => {
    const title = await app.client.getTitle();
    expect(title).toEqual('Signer');
  });

  it('renders the initial view', async () => {
    const btn = await app.client.$('#accept_button');
    const text = await btn.getText();
    expect(text).toBe('Accept');
  });
});
