import { translateRaw } from '../src/translations';
import app from './setupElectron';

jest.setTimeout(10000);

describe('Basic E2E tests', () => {
  beforeAll(async () => {
    await app.start();
  });

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop();
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
    const btn = await app.client.$('#create-password');
    const text = await btn.getText();
    expect(text).toBe(translateRaw('CREATE_PASSWORD'));
  });
});
