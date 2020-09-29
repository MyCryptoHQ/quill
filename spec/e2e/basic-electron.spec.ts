import app from './setupElectron';

jest.setTimeout(10000);

beforeAll(async () => app.start());

// @todo: doesn't work right now
afterAll(async () => app.isRunning() && app.stop());

test('App Init', async function () {
  // const isVisible = await app.browserWindow.isVisible();
  // expect(isVisible).toBe(true);

  const count = await app.client.getWindowCount();
  expect(count).toEqual(1);
});
