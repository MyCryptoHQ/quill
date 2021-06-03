'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const package_json_1 = __importDefault(require('../package.json'));

const dependencies = Object.entries({
  ...package_json_1.default.dependencies,
  ...package_json_1.default.devDependencies
});
// from https://docs.npmjs.com/files/package.json#dependencies
const nonExactPrefixes = /^(~|\^|>|>=|<|<=)/;
describe('package.json', () => {
  it.each(dependencies)('%s should have an exact version', (_, depVersion) => {
    expect(depVersion).not.toMatch(nonExactPrefixes);
  });
});
//# sourceMappingURL=package.json.test.js.map
