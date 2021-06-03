'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const setupElectron_1 = __importDefault(require('./setupElectron'));

jest.setTimeout(30000);
describe('Basic E2E tests', () => {
  beforeAll(async () => {
    await setupElectron_1.default.start();
  });
  afterAll(async () => {
    if (setupElectron_1.default && setupElectron_1.default.isRunning()) {
      await setupElectron_1.default.stop();
    }
  });
  it('opens a window', async () => {
    const count = await setupElectron_1.default.client.getWindowCount();
    expect(count).toEqual(1);
  });
  it('has the correct title', async () => {
    const title = await setupElectron_1.default.client.getTitle();
    expect(title).toEqual('Signer');
  });
  it('renders the initial view', async () => {
    const spinner = await setupElectron_1.default.client.$('#loading-spinner');
    const exists = await spinner.isExisting();
    expect(exists).toBe(true);
  });
});
//# sourceMappingURL=basic-electron.test.js.map
