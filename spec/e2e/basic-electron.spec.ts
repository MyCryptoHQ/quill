import app from './setupElectron';

jest.setTimeout(10000);

beforeAll(function () {
  return app.start();
});

afterAll(function () {
  if (app && app.isRunning()) {
    return app.stop();
  }
});

test('App Init', async function () {
  const isVisible = await app.browserWindow.isVisible();
  expect(isVisible).toBe(true);
  const count = await app.client.getWindowCount();
  expect(count).toEqual(1);
});
